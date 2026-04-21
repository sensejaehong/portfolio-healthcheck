// =============================================
// 공유 타입 정의 — 백엔드와 프론트엔드가 동일 참조
// =============================================

// --- Portfolio ---
export interface Portfolio {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Holding {
  id: string;
  portfolioId: string;
  ticker: string;
  name: string;
  market: 'KRX' | 'NYSE' | 'NASDAQ';
  shares: number;
  avgPrice: number;
  sector: string | null;
  currentPrice?: number;
  currentValue?: number;
  weight?: number;
  createdAt: string;
  updatedAt: string;
}

export interface HoldingInput {
  ticker: string;
  name: string;
  market: 'KRX' | 'NYSE' | 'NASDAQ';
  shares: number;
  avgPrice: number;
  sector?: string;
}

// --- Analysis ---
export type HealthGrade = 'excellent' | 'good' | 'caution' | 'danger';

export interface DiversificationResult {
  hhi: number;
  topNConcentration: { n: number; percentage: number };
  stockCount: number;
  interpretation: string;
}

export interface SectorItem {
  name: string;
  weight: number;
  benchmark: number;
  deviation: number;
}

export interface SectorBalanceResult {
  sectors: SectorItem[];
  totalDeviation: number;
  interpretation: string;
}

export interface RiskResult {
  annualVolatility: number;
  beta: number;
  maxDrawdown: number;
  sharpeRatio: number;
  interpretation: string;
}

export interface RebalanceSuggestion {
  ticker: string;
  name: string;
  action: 'buy' | 'sell' | 'hold';
  currentWeight: number;
  targetWeight: number;
  adjustmentPercent: number;
}

export interface RebalancingResult {
  suggestions: RebalanceSuggestion[];
  strategyName: string;
  estimatedTrades: number;
}

export interface AnalysisResult {
  healthScore: number;
  healthGrade: HealthGrade;
  diversification: DiversificationResult;
  sectorBalance: SectorBalanceResult;
  risk: RiskResult;
  rebalancing: RebalancingResult | null;
  analyzedAt: string;
}

// --- Investor Strategy ---
export type RiskLevel = 'conservative' | 'moderate' | 'aggressive';
export type ConcentrationStyle = 'concentrated' | 'balanced' | 'diversified';

export interface InvestorStrategy {
  id: string;
  name: string;
  nameKo: string;
  philosophy: string;
  philosophyKo: string;
  riskLevel: RiskLevel;
  concentrationStyle: ConcentrationStyle;
  sectorAllocation: Record<string, { min: number; max: number; target: number }>;
  metrics: {
    preferredPER?: { min: number; max: number };
    preferredPBR?: { min: number; max: number };
    minROE?: number;
    minDividendYield?: number;
    maxDebtToEquity?: number;
  };
  cashRatio: { min: number; max: number };
  maxSinglePosition: number;
  topHoldingsCount: number;
  keyCharacteristics: string[];
  keyCharacteristicsKo: string[];
}

export interface StrategyComparison {
  strategyId: string;
  strategyName: string;
  similarityScore: number;
  sectorSimilarity: number;
  concentrationSimilarity: number;
  riskSimilarity: number;
  differences: string[];
}

// --- Stock Search ---
export interface StockSearchResult {
  ticker: string;
  name: string;
  market: 'KRX' | 'NYSE' | 'NASDAQ';
  sector: string;
}

export interface StockQuote {
  ticker: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: number;
  sector: string;
  currency: string;
}

// --- API Response Wrappers ---
export interface ApiError {
  error: string;
  code: string;
}

export interface PortfolioListResponse {
  portfolios: Portfolio[];
}

export interface PortfolioDetailResponse {
  portfolio: Portfolio;
  holdings: Holding[];
}

export interface HoldingResponse {
  holding: Holding;
}

export interface BulkHoldingResponse {
  holdings: Holding[];
  failed: { index: number; reason: string }[];
}

export interface AnalysisResponse {
  analysis: AnalysisResult;
}

export interface StrategiesResponse {
  strategies: InvestorStrategy[];
}

export interface StrategyDetailResponse {
  strategy: InvestorStrategy;
}

export interface ComparisonResponse {
  comparisons: StrategyComparison[];
}

export interface StockSearchResponse {
  stocks: StockSearchResult[];
}

export interface StockQuoteResponse {
  quote: StockQuote;
}
