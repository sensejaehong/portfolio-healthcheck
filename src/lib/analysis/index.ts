// =============================================
// Analysis Module — Barrel Export + Main Orchestrator
// =============================================

import type { Holding, AnalysisResult } from '@/types';
import {
  calculateDiversification,
  calculateSectorBalance,
  calculateRisk,
  calculateHealthScore,
  getHealthGrade,
  calculateHHI,
  SP500_SECTOR_BENCHMARK,
} from './health-score';
import {
  generateRebalanceSuggestions,
  generateSectorRebalanceSuggestions,
} from './rebalance';
import {
  calculateStrategySimilarity,
  compareAllStrategies,
} from './similarity';

// Re-export all public functions
export {
  // health-score
  calculateHHI,
  calculateDiversification,
  calculateSectorBalance,
  calculateRisk,
  calculateHealthScore,
  getHealthGrade,
  SP500_SECTOR_BENCHMARK,
  // rebalance
  generateRebalanceSuggestions,
  generateSectorRebalanceSuggestions,
  // similarity
  calculateStrategySimilarity,
  compareAllStrategies,
};

/**
 * Run the full portfolio analysis pipeline.
 *
 * Computes diversification, sector balance, risk metrics, health score/grade,
 * and returns a complete AnalysisResult. Rebalancing is null by default —
 * call generateRebalanceSuggestions separately with a specific strategy target.
 *
 * @param holdings - The portfolio's holdings (with or without pre-calculated weights)
 * @returns Complete AnalysisResult
 */
export function analyzePortfolio(holdings: Holding[]): AnalysisResult {
  // Edge case: empty portfolio
  if (!holdings || holdings.length === 0) {
    return {
      healthScore: 0,
      healthGrade: 'danger',
      diversification: {
        hhi: 10000,
        topNConcentration: { n: 0, percentage: 0 },
        stockCount: 0,
        interpretation: '포트폴리오에 종목이 없습니다. 종목을 추가해 주세요.',
      },
      sectorBalance: {
        sectors: [],
        totalDeviation: 0,
        interpretation: '포트폴리오에 종목이 없어 섹터 분석을 수행할 수 없습니다.',
      },
      risk: {
        annualVolatility: 0,
        beta: 0,
        maxDrawdown: 0,
        sharpeRatio: 0,
        interpretation: '포트폴리오에 종목이 없어 리스크를 분석할 수 없습니다.',
      },
      rebalancing: null,
      analyzedAt: new Date().toISOString(),
    };
  }

  // Compute sub-analyses
  const diversification = calculateDiversification(holdings);
  const sectorBalance = calculateSectorBalance(holdings, SP500_SECTOR_BENCHMARK);
  const risk = calculateRisk(holdings);

  // Compute composite health score and grade
  const healthScore = calculateHealthScore(diversification, sectorBalance, risk);
  const healthGrade = getHealthGrade(healthScore);

  return {
    healthScore,
    healthGrade,
    diversification,
    sectorBalance,
    risk,
    rebalancing: null, // Populated on-demand with a specific strategy
    analyzedAt: new Date().toISOString(),
  };
}

/** Alias used by API routes */
export const runFullAnalysis = analyzePortfolio;
