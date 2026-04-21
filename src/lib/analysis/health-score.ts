// =============================================
// Portfolio Health Score Calculator
// =============================================

import type {
  Holding,
  HealthGrade,
  DiversificationResult,
  SectorBalanceResult,
  SectorItem,
  RiskResult,
} from '@/types';

// S&P 500 approximate sector weights (as of 2025)
export const SP500_SECTOR_BENCHMARK: Record<string, number> = {
  'Technology': 31.0,
  'Healthcare': 12.5,
  'Financials': 13.0,
  'Consumer Discretionary': 10.5,
  'Communication Services': 9.0,
  'Industrials': 8.5,
  'Consumer Staples': 6.0,
  'Energy': 3.8,
  'Utilities': 2.5,
  'Real Estate': 2.2,
  'Materials': 2.0,
};

// Simplified annualized volatility estimates by sector (%)
const SECTOR_VOLATILITY: Record<string, number> = {
  'Technology': 28,
  'Healthcare': 22,
  'Financials': 24,
  'Consumer Discretionary': 26,
  'Communication Services': 27,
  'Industrials': 21,
  'Consumer Staples': 15,
  'Energy': 35,
  'Utilities': 16,
  'Real Estate': 23,
  'Materials': 25,
};

// Simplified beta estimates by sector
const SECTOR_BETA: Record<string, number> = {
  'Technology': 1.2,
  'Healthcare': 0.9,
  'Financials': 1.1,
  'Consumer Discretionary': 1.15,
  'Communication Services': 1.1,
  'Industrials': 1.05,
  'Consumer Staples': 0.65,
  'Energy': 1.3,
  'Utilities': 0.55,
  'Real Estate': 0.85,
  'Materials': 1.0,
};

/**
 * Normalize holdings so each has a weight (percentage of total portfolio value).
 * If weights are already present, returns as-is.
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
 * Herfindahl-Hirschman Index — sum of squared weights.
 * Range: ~0 (perfectly diversified) to 10,000 (single stock).
 * Input weights are percentages (0-100).
 */
export function calculateHHI(holdings: Holding[]): number {
  if (holdings.length === 0) return 10000;

  const weighted = ensureWeights(holdings);
  return weighted.reduce((sum, h) => {
    const w = h.weight ?? 0;
    return sum + w * w;
  }, 0);
}

/**
 * Calculate full diversification metrics.
 */
export function calculateDiversification(holdings: Holding[]): DiversificationResult {
  if (holdings.length === 0) {
    return {
      hhi: 10000,
      topNConcentration: { n: 0, percentage: 0 },
      stockCount: 0,
      interpretation: '포트폴리오에 종목이 없습니다. 종목을 추가해 주세요.',
    };
  }

  const weighted = ensureWeights(holdings);
  const hhi = calculateHHI(weighted);

  // Top-N concentration (top 3 or fewer)
  const n = Math.min(3, weighted.length);
  const sorted = [...weighted].sort((a, b) => (b.weight ?? 0) - (a.weight ?? 0));
  const topNPct = sorted.slice(0, n).reduce((sum, h) => sum + (h.weight ?? 0), 0);

  let interpretation: string;
  if (weighted.length === 1) {
    interpretation = '단일 종목에 100% 집중되어 있습니다. 분산 투자를 강력히 권장합니다.';
  } else if (hhi > 5000) {
    interpretation = '포트폴리오가 소수 종목에 과도하게 집중되어 있습니다. 분산이 필요합니다.';
  } else if (hhi > 2500) {
    interpretation = '중간 수준의 집중도입니다. 추가 분산을 고려해 보세요.';
  } else if (hhi > 1500) {
    interpretation = '적절한 수준의 분산이 이루어져 있습니다.';
  } else {
    interpretation = '우수한 분산 투자 포트폴리오입니다.';
  }

  return {
    hhi: Math.round(hhi),
    topNConcentration: { n, percentage: Math.round(topNPct * 10) / 10 },
    stockCount: weighted.length,
    interpretation,
  };
}

/**
 * Calculate sector balance by comparing portfolio sector weights to a benchmark.
 */
export function calculateSectorBalance(
  holdings: Holding[],
  benchmark: Record<string, number> = SP500_SECTOR_BENCHMARK,
): SectorBalanceResult {
  if (holdings.length === 0) {
    return {
      sectors: [],
      totalDeviation: 0,
      interpretation: '포트폴리오에 종목이 없어 섹터 분석을 수행할 수 없습니다.',
    };
  }

  const weighted = ensureWeights(holdings);

  // Aggregate weights by sector
  const sectorWeights: Record<string, number> = {};
  for (const h of weighted) {
    const sector = h.sector ?? '기타';
    sectorWeights[sector] = (sectorWeights[sector] ?? 0) + (h.weight ?? 0);
  }

  // Collect all sectors from both portfolio and benchmark
  const allSectors = new Set([...Object.keys(sectorWeights), ...Object.keys(benchmark)]);

  const sectors: SectorItem[] = [];
  let totalDeviation = 0;

  for (const name of allSectors) {
    const weight = Math.round((sectorWeights[name] ?? 0) * 10) / 10;
    const benchmarkWeight = benchmark[name] ?? 0;
    const deviation = Math.round((weight - benchmarkWeight) * 10) / 10;
    totalDeviation += Math.abs(deviation);
    sectors.push({ name, weight, benchmark: benchmarkWeight, deviation });
  }

  totalDeviation = Math.round(totalDeviation * 10) / 10;

  // Sort by absolute deviation descending
  sectors.sort((a, b) => Math.abs(b.deviation) - Math.abs(a.deviation));

  let interpretation: string;
  if (totalDeviation < 20) {
    interpretation = '벤치마크(S&P 500)와 유사한 섹터 배분입니다.';
  } else if (totalDeviation < 50) {
    interpretation = '일부 섹터에서 벤치마크 대비 편차가 있습니다. 의도적인 배분인지 확인하세요.';
  } else if (totalDeviation < 80) {
    interpretation = '벤치마크 대비 상당한 섹터 편중이 있습니다. 특정 섹터 리스크에 노출될 수 있습니다.';
  } else {
    interpretation = '벤치마크와 매우 다른 섹터 구성입니다. 높은 섹터 집중 리스크가 존재합니다.';
  }

  return { sectors, totalDeviation, interpretation };
}

/**
 * Calculate simplified risk metrics based on sector-level volatility and beta estimates.
 */
export function calculateRisk(holdings: Holding[]): RiskResult {
  if (holdings.length === 0) {
    return {
      annualVolatility: 0,
      beta: 0,
      maxDrawdown: 0,
      sharpeRatio: 0,
      interpretation: '포트폴리오에 종목이 없어 리스크를 분석할 수 없습니다.',
    };
  }

  const weighted = ensureWeights(holdings);

  // Weighted average volatility and beta
  let weightedVol = 0;
  let weightedBeta = 0;
  let totalWeight = 0;

  for (const h of weighted) {
    const w = (h.weight ?? 0) / 100;
    const sector = h.sector ?? 'Technology'; // default fallback
    const vol = SECTOR_VOLATILITY[sector] ?? 25;
    const beta = SECTOR_BETA[sector] ?? 1.0;

    weightedVol += w * vol;
    weightedBeta += w * beta;
    totalWeight += w;
  }

  if (totalWeight > 0) {
    weightedVol /= totalWeight;
    weightedBeta /= totalWeight;
  }

  // Concentration penalty: less diversified portfolios have higher volatility
  const hhi = calculateHHI(weighted);
  // HHI of a perfectly equal portfolio with same count
  const n = weighted.length;
  const perfectHHI = n > 0 ? 10000 / n : 10000;
  // Concentration ratio: 1.0 = perfectly equal, higher = more concentrated
  const concentrationRatio = n > 1 ? Math.sqrt(hhi / perfectHHI) : 1;
  const adjustedVol = weightedVol * Math.min(concentrationRatio, 2.0);

  // Simplified max drawdown estimate (~1.5-2x annual vol for typical markets)
  const maxDrawdown = Math.min(adjustedVol * 1.8, 95);

  // Simplified Sharpe ratio: assume 10% expected return, 5% risk-free rate
  const excessReturn = 10 - 5;
  const sharpeRatio = adjustedVol > 0 ? excessReturn / adjustedVol : 0;

  const annualVolatility = Math.round(adjustedVol * 10) / 10;
  const roundedBeta = Math.round(weightedBeta * 100) / 100;
  const roundedDrawdown = Math.round(maxDrawdown * 10) / 10;
  const roundedSharpe = Math.round(sharpeRatio * 100) / 100;

  let interpretation: string;
  if (annualVolatility < 15) {
    interpretation = '낮은 변동성의 안정적인 포트폴리오입니다.';
  } else if (annualVolatility < 22) {
    interpretation = '시장 평균 수준의 변동성입니다.';
  } else if (annualVolatility < 30) {
    interpretation = '시장 평균보다 높은 변동성입니다. 리스크 관리에 주의하세요.';
  } else {
    interpretation = '매우 높은 변동성의 공격적인 포트폴리오입니다. 하락 리스크에 대비하세요.';
  }

  return {
    annualVolatility,
    beta: roundedBeta,
    maxDrawdown: roundedDrawdown,
    sharpeRatio: roundedSharpe,
    interpretation,
  };
}

/**
 * Calculate composite health score (0-100) from sub-scores.
 * Weights: diversification 40%, sector balance 30%, risk 30%.
 */
export function calculateHealthScore(
  diversification: DiversificationResult,
  sectorBalance: SectorBalanceResult,
  risk: RiskResult,
): number {
  // Diversification score: HHI 0-10000 -> 0-100
  // Lower HHI = better. 500 or below = perfect, 10000 = worst.
  const divScore = Math.max(0, Math.min(100, 100 - (diversification.hhi / 10000) * 100));

  // Sector balance score: total deviation 0-200 -> 0-100
  // Lower deviation = better.
  const sectorScore = Math.max(0, Math.min(100, 100 - (sectorBalance.totalDeviation / 200) * 100));

  // Risk score: annual volatility mapped to 0-100
  // 10% vol = 100 (best), 50%+ vol = 0 (worst)
  const riskScore = Math.max(0, Math.min(100, ((50 - risk.annualVolatility) / 40) * 100));

  const composite = divScore * 0.4 + sectorScore * 0.3 + riskScore * 0.3;
  return Math.round(Math.max(0, Math.min(100, composite)));
}

/**
 * Map numeric health score to a grade label.
 */
export function getHealthGrade(score: number): HealthGrade {
  if (score >= 80) return 'excellent';
  if (score >= 60) return 'good';
  if (score >= 40) return 'caution';
  return 'danger';
}
