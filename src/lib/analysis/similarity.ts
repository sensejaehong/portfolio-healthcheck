// =============================================
// Strategy Similarity Matching
// =============================================

import type { Holding, InvestorStrategy, StrategyComparison } from '@/types';

/**
 * Normalize holdings to ensure each has a weight.
 */
function ensureWeights(holdings: Holding[]): Holding[] {
  const hasWeights = holdings.every((h) => typeof h.weight === 'number' && h.weight > 0);
  if (hasWeights) return holdings;

  const totalValue = holdings.reduce((sum, h) => {
    const value = h.currentValue ?? h.shares * (h.currentPrice ?? h.avgPrice);
    return sum + value;
  }, 0);

  if (totalValue === 0) return holdings;

  return holdings.map((h) => {
    const value = h.currentValue ?? h.shares * (h.currentPrice ?? h.avgPrice);
    return { ...h, weight: (value / totalValue) * 100 };
  });
}

/**
 * Calculate how similar the portfolio's sector allocation is to a strategy's target.
 * Returns 0-100 (100 = identical).
 */
function calcSectorSimilarity(
  holdings: Holding[],
  strategy: InvestorStrategy,
): number {
  const weighted = ensureWeights(holdings);

  // Aggregate portfolio sector weights
  const sectorWeights: Record<string, number> = {};
  for (const h of weighted) {
    const sector = h.sector ?? '기타';
    sectorWeights[sector] = (sectorWeights[sector] ?? 0) + (h.weight ?? 0);
  }

  const allSectors = new Set([
    ...Object.keys(sectorWeights),
    ...Object.keys(strategy.sectorAllocation),
  ]);

  let totalDeviation = 0;
  for (const sector of allSectors) {
    const portfolioWeight = sectorWeights[sector] ?? 0;
    const target = strategy.sectorAllocation[sector]?.target ?? 0;
    totalDeviation += Math.abs(portfolioWeight - target);
  }

  // Max possible deviation is 200 (all weight in wrong sectors)
  // Convert to 0-100 similarity score
  return Math.max(0, Math.min(100, Math.round(100 - (totalDeviation / 200) * 100)));
}

/**
 * Calculate how similar the portfolio's concentration style is to the strategy.
 * Returns 0-100.
 */
function calcConcentrationSimilarity(
  holdings: Holding[],
  strategy: InvestorStrategy,
): number {
  const weighted = ensureWeights(holdings);
  if (weighted.length === 0) return 0;

  const sorted = [...weighted].sort((a, b) => (b.weight ?? 0) - (a.weight ?? 0));

  // Check max single position
  const maxPosition = sorted[0]?.weight ?? 0;
  const maxPositionTarget = strategy.maxSinglePosition;
  const positionDiff = Math.abs(maxPosition - maxPositionTarget);
  const positionScore = Math.max(0, 100 - positionDiff * 3);

  // Check number of holdings vs strategy preference
  const holdingCount = weighted.length;
  const targetCount = strategy.topHoldingsCount;
  const countDiff = Math.abs(holdingCount - targetCount);
  const countScore = Math.max(0, 100 - countDiff * 8);

  // Concentration style match
  let styleScore = 50; // neutral
  const hhi = weighted.reduce((sum, h) => sum + (h.weight ?? 0) ** 2, 0);

  if (strategy.concentrationStyle === 'concentrated') {
    // High HHI is good for concentrated style
    styleScore = hhi > 2000 ? 100 : hhi > 1000 ? 70 : 30;
  } else if (strategy.concentrationStyle === 'diversified') {
    // Low HHI is good for diversified style
    styleScore = hhi < 1000 ? 100 : hhi < 2000 ? 70 : 30;
  } else {
    // balanced
    styleScore = hhi >= 800 && hhi <= 2500 ? 100 : hhi >= 500 && hhi <= 3500 ? 70 : 40;
  }

  return Math.round(positionScore * 0.3 + countScore * 0.3 + styleScore * 0.4);
}

/**
 * Calculate risk-level similarity. Returns 0-100.
 */
function calcRiskSimilarity(
  holdings: Holding[],
  strategy: InvestorStrategy,
): number {
  const weighted = ensureWeights(holdings);
  if (weighted.length === 0) return 0;

  // Estimate portfolio risk level from sector composition
  const riskySectors = new Set(['Technology', 'Energy', 'Communication Services', 'Consumer Discretionary']);
  const defensiveSectors = new Set(['Consumer Staples', 'Utilities', 'Healthcare', 'Real Estate']);

  let riskyWeight = 0;
  let defensiveWeight = 0;

  for (const h of weighted) {
    const w = h.weight ?? 0;
    if (riskySectors.has(h.sector ?? '')) riskyWeight += w;
    if (defensiveSectors.has(h.sector ?? '')) defensiveWeight += w;
  }

  // Determine portfolio's implied risk level
  let portfolioRiskScore: number;
  if (riskyWeight > 60) portfolioRiskScore = 3; // aggressive
  else if (defensiveWeight > 50) portfolioRiskScore = 1; // conservative
  else portfolioRiskScore = 2; // moderate

  const strategyRiskScore =
    strategy.riskLevel === 'aggressive' ? 3 :
    strategy.riskLevel === 'conservative' ? 1 : 2;

  const diff = Math.abs(portfolioRiskScore - strategyRiskScore);
  if (diff === 0) return 100;
  if (diff === 1) return 55;
  return 15;
}

/**
 * Identify key differences between the portfolio and a strategy.
 */
function identifyDifferences(
  holdings: Holding[],
  strategy: InvestorStrategy,
): string[] {
  const weighted = ensureWeights(holdings);
  const differences: string[] = [];

  if (weighted.length === 0) {
    differences.push('포트폴리오에 종목이 없습니다.');
    return differences;
  }

  // Holding count difference
  if (weighted.length > strategy.topHoldingsCount * 1.5) {
    differences.push(
      `종목 수(${weighted.length}개)가 전략 권장(${strategy.topHoldingsCount}개)보다 많습니다.`,
    );
  } else if (weighted.length < strategy.topHoldingsCount * 0.5) {
    differences.push(
      `종목 수(${weighted.length}개)가 전략 권장(${strategy.topHoldingsCount}개)보다 적습니다.`,
    );
  }

  // Max position check
  const sorted = [...weighted].sort((a, b) => (b.weight ?? 0) - (a.weight ?? 0));
  const maxPos = sorted[0]?.weight ?? 0;
  if (maxPos > strategy.maxSinglePosition * 1.2) {
    differences.push(
      `최대 단일 포지션(${Math.round(maxPos)}%)이 전략 한도(${strategy.maxSinglePosition}%)를 초과합니다.`,
    );
  }

  // Sector gaps
  const sectorWeights: Record<string, number> = {};
  for (const h of weighted) {
    const sector = h.sector ?? '기타';
    sectorWeights[sector] = (sectorWeights[sector] ?? 0) + (h.weight ?? 0);
  }

  for (const [sector, alloc] of Object.entries(strategy.sectorAllocation)) {
    const current = sectorWeights[sector] ?? 0;
    if (current < alloc.min && alloc.target > 5) {
      differences.push(`${sector} 섹터 비중(${Math.round(current)}%)이 최소 권장(${alloc.min}%)에 미달합니다.`);
    } else if (current > alloc.max) {
      differences.push(`${sector} 섹터 비중(${Math.round(current)}%)이 최대 권장(${alloc.max}%)을 초과합니다.`);
    }
  }

  // Limit to top 5 differences
  return differences.slice(0, 5);
}

/**
 * Calculate overall similarity score (0-100) between a portfolio and an investor strategy.
 */
export function calculateStrategySimilarity(
  holdings: Holding[],
  strategy: InvestorStrategy,
): StrategyComparison {
  if (holdings.length === 0) {
    return {
      strategyId: strategy.id,
      strategyName: strategy.nameKo,
      similarityScore: 0,
      sectorSimilarity: 0,
      concentrationSimilarity: 0,
      riskSimilarity: 0,
      differences: ['포트폴리오에 종목이 없습니다.'],
    };
  }

  const sectorSimilarity = calcSectorSimilarity(holdings, strategy);
  const concentrationSimilarity = calcConcentrationSimilarity(holdings, strategy);
  const riskSimilarity = calcRiskSimilarity(holdings, strategy);

  // Weighted composite: sector 40%, concentration 30%, risk 30%
  const similarityScore = Math.round(
    sectorSimilarity * 0.4 +
    concentrationSimilarity * 0.3 +
    riskSimilarity * 0.3,
  );

  const differences = identifyDifferences(holdings, strategy);

  return {
    strategyId: strategy.id,
    strategyName: strategy.nameKo,
    similarityScore,
    sectorSimilarity,
    concentrationSimilarity,
    riskSimilarity,
    differences,
  };
}

/**
 * Compare portfolio against all strategies, return sorted by similarity (highest first).
 */
export function compareAllStrategies(
  holdings: Holding[],
  strategies: InvestorStrategy[],
): StrategyComparison[] {
  const comparisons = strategies.map((strategy) =>
    calculateStrategySimilarity(holdings, strategy),
  );

  return comparisons.sort((a, b) => b.similarityScore - a.similarityScore);
}
