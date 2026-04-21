// =============================================
// Rebalancing Suggestion Engine
// =============================================

import type { Holding, RebalanceSuggestion, RebalancingResult } from '@/types';

/** Threshold in percentage points below which no action is suggested */
const REBALANCE_THRESHOLD = 2.0;

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
 * Generate rebalancing suggestions by comparing current weights to target allocation.
 *
 * @param holdings - Current portfolio holdings
 * @param targetAllocation - Map of ticker -> target weight (%). Tickers not in the map are assumed target 0.
 * @param strategyName - Name of the strategy used for labeling
 * @returns RebalancingResult with per-holding suggestions
 */
export function generateRebalanceSuggestions(
  holdings: Holding[],
  targetAllocation: Record<string, number>,
  strategyName: string,
): RebalancingResult {
  if (holdings.length === 0) {
    return {
      suggestions: [],
      strategyName,
      estimatedTrades: 0,
    };
  }

  const weighted = ensureWeights(holdings);
  const suggestions: RebalanceSuggestion[] = [];
  let estimatedTrades = 0;

  // Process existing holdings
  const processedTickers = new Set<string>();

  for (const h of weighted) {
    const currentWeight = Math.round((h.weight ?? 0) * 100) / 100;
    const targetWeight = targetAllocation[h.ticker] ?? 0;
    const diff = targetWeight - currentWeight;
    const absDiff = Math.abs(diff);

    let action: 'buy' | 'sell' | 'hold';
    if (absDiff < REBALANCE_THRESHOLD) {
      action = 'hold';
    } else if (diff > 0) {
      action = 'buy';
      estimatedTrades++;
    } else {
      action = 'sell';
      estimatedTrades++;
    }

    suggestions.push({
      ticker: h.ticker,
      name: h.name,
      action,
      currentWeight: Math.round(currentWeight * 10) / 10,
      targetWeight: Math.round(targetWeight * 10) / 10,
      adjustmentPercent: Math.round(diff * 10) / 10,
    });

    processedTickers.add(h.ticker);
  }

  // Process target tickers not currently held (new positions to open)
  for (const [ticker, targetWeight] of Object.entries(targetAllocation)) {
    if (processedTickers.has(ticker)) continue;
    if (targetWeight < REBALANCE_THRESHOLD) continue;

    suggestions.push({
      ticker,
      name: ticker, // name unknown for tickers not in holdings
      action: 'buy',
      currentWeight: 0,
      targetWeight: Math.round(targetWeight * 10) / 10,
      adjustmentPercent: Math.round(targetWeight * 10) / 10,
    });
    estimatedTrades++;
  }

  // Sort: sells first (most negative adjustment), then holds, then buys
  suggestions.sort((a, b) => a.adjustmentPercent - b.adjustmentPercent);

  return {
    suggestions,
    strategyName,
    estimatedTrades,
  };
}

/**
 * Generate sector-based rebalancing suggestions.
 * Maps holdings to sectors and compares to a sector-level target allocation.
 */
export function generateSectorRebalanceSuggestions(
  holdings: Holding[],
  sectorTargets: Record<string, { target: number }>,
  strategyName: string,
): RebalancingResult {
  if (holdings.length === 0) {
    return { suggestions: [], strategyName, estimatedTrades: 0 };
  }

  const weighted = ensureWeights(holdings);

  // Aggregate current sector weights
  const sectorWeights: Record<string, number> = {};
  const sectorHoldings: Record<string, Holding[]> = {};

  for (const h of weighted) {
    const sector = h.sector ?? '기타';
    sectorWeights[sector] = (sectorWeights[sector] ?? 0) + (h.weight ?? 0);
    if (!sectorHoldings[sector]) sectorHoldings[sector] = [];
    sectorHoldings[sector].push(h);
  }

  // For each holding, compute a proportional target weight based on sector targets
  const tickerTargets: Record<string, number> = {};

  for (const h of weighted) {
    const sector = h.sector ?? '기타';
    const sectorTarget = sectorTargets[sector]?.target ?? 0;
    const currentSectorWeight = sectorWeights[sector] ?? 0;
    const holdingsInSector = sectorHoldings[sector] ?? [];

    if (currentSectorWeight > 0 && holdingsInSector.length > 0) {
      // Distribute sector target proportionally among holdings within the sector
      const proportionInSector = (h.weight ?? 0) / currentSectorWeight;
      tickerTargets[h.ticker] = sectorTarget * proportionInSector;
    } else {
      tickerTargets[h.ticker] = 0;
    }
  }

  return generateRebalanceSuggestions(weighted, tickerTargets, strategyName);
}
