// In-memory data store — simulates Supabase for MVP
import type {
  Portfolio,
  Holding,
  HoldingInput,
  AnalysisResult,
  InvestorStrategy,
  StrategyComparison,
} from '@/types';

// --- ID generator ---
let idCounter = 100;
function generateId(): string {
  idCounter += 1;
  return `id-${idCounter}-${Date.now().toString(36)}`;
}

function now(): string {
  return new Date().toISOString();
}

// --- Seed data ---
const SAMPLE_PORTFOLIO_ID = 'portfolio-1';

const portfolios: Map<string, Portfolio> = new Map([
  [
    SAMPLE_PORTFOLIO_ID,
    {
      id: SAMPLE_PORTFOLIO_ID,
      name: '글로벌 분산 포트폴리오',
      description: '미국 기술주와 한국 대형주 중심의 포트폴리오',
      createdAt: '2026-01-15T09:00:00.000Z',
      updatedAt: '2026-04-20T14:30:00.000Z',
    },
  ],
]);

const holdings: Map<string, Holding[]> = new Map([
  [
    SAMPLE_PORTFOLIO_ID,
    [
      {
        id: 'holding-1',
        portfolioId: SAMPLE_PORTFOLIO_ID,
        ticker: 'AAPL',
        name: 'Apple Inc.',
        market: 'NASDAQ',
        shares: 50,
        avgPrice: 178.5,
        sector: 'Technology',
        currentPrice: 195.2,
        currentValue: 9760,
        weight: 20,
        createdAt: '2026-01-15T09:00:00.000Z',
        updatedAt: '2026-04-20T14:30:00.000Z',
      },
      {
        id: 'holding-2',
        portfolioId: SAMPLE_PORTFOLIO_ID,
        ticker: 'MSFT',
        name: 'Microsoft Corporation',
        market: 'NASDAQ',
        shares: 25,
        avgPrice: 380.0,
        sector: 'Technology',
        currentPrice: 425.6,
        currentValue: 10640,
        weight: 15,
        createdAt: '2026-01-15T09:00:00.000Z',
        updatedAt: '2026-04-20T14:30:00.000Z',
      },
      {
        id: 'holding-3',
        portfolioId: SAMPLE_PORTFOLIO_ID,
        ticker: 'GOOGL',
        name: 'Alphabet Inc.',
        market: 'NASDAQ',
        shares: 40,
        avgPrice: 145.0,
        sector: 'Technology',
        currentPrice: 172.3,
        currentValue: 6892,
        weight: 10,
        createdAt: '2026-01-15T09:00:00.000Z',
        updatedAt: '2026-04-20T14:30:00.000Z',
      },
      {
        id: 'holding-4',
        portfolioId: SAMPLE_PORTFOLIO_ID,
        ticker: 'AMZN',
        name: 'Amazon.com Inc.',
        market: 'NASDAQ',
        shares: 35,
        avgPrice: 178.0,
        sector: 'Consumer Cyclical',
        currentPrice: 198.5,
        currentValue: 6947.5,
        weight: 10,
        createdAt: '2026-01-15T09:00:00.000Z',
        updatedAt: '2026-04-20T14:30:00.000Z',
      },
      {
        id: 'holding-5',
        portfolioId: SAMPLE_PORTFOLIO_ID,
        ticker: '005930',
        name: '삼성전자',
        market: 'KRX',
        shares: 150,
        avgPrice: 72000,
        sector: 'Technology',
        currentPrice: 78500,
        currentValue: 11775000,
        weight: 15,
        createdAt: '2026-01-15T09:00:00.000Z',
        updatedAt: '2026-04-20T14:30:00.000Z',
      },
      {
        id: 'holding-6',
        portfolioId: SAMPLE_PORTFOLIO_ID,
        ticker: '000660',
        name: 'SK하이닉스',
        market: 'KRX',
        shares: 60,
        avgPrice: 135000,
        sector: 'Technology',
        currentPrice: 178000,
        currentValue: 10680000,
        weight: 10,
        createdAt: '2026-01-15T09:00:00.000Z',
        updatedAt: '2026-04-20T14:30:00.000Z',
      },
      {
        id: 'holding-7',
        portfolioId: SAMPLE_PORTFOLIO_ID,
        ticker: 'NVDA',
        name: 'NVIDIA Corporation',
        market: 'NASDAQ',
        shares: 15,
        avgPrice: 480.0,
        sector: 'Technology',
        currentPrice: 875.3,
        currentValue: 13129.5,
        weight: 12,
        createdAt: '2026-01-15T09:00:00.000Z',
        updatedAt: '2026-04-20T14:30:00.000Z',
      },
      {
        id: 'holding-8',
        portfolioId: SAMPLE_PORTFOLIO_ID,
        ticker: '035720',
        name: '카카오',
        market: 'KRX',
        shares: 100,
        avgPrice: 52000,
        sector: 'Communication Services',
        currentPrice: 48200,
        currentValue: 4820000,
        weight: 8,
        createdAt: '2026-01-15T09:00:00.000Z',
        updatedAt: '2026-04-20T14:30:00.000Z',
      },
    ],
  ],
]);

// --- Analysis cache ---
const analysisCache: Map<string, AnalysisResult> = new Map();

// --- Portfolio CRUD ---
export function getPortfolios(): Portfolio[] {
  return Array.from(portfolios.values());
}

export function getPortfolio(id: string): Portfolio | undefined {
  return portfolios.get(id);
}

export function createPortfolio(data: {
  name: string;
  description?: string | null;
}): Portfolio {
  const id = generateId();
  const ts = now();
  const portfolio: Portfolio = {
    id,
    name: data.name,
    description: data.description ?? null,
    createdAt: ts,
    updatedAt: ts,
  };
  portfolios.set(id, portfolio);
  holdings.set(id, []);
  return portfolio;
}

export function updatePortfolio(
  id: string,
  data: Partial<{ name: string; description: string | null }>
): Portfolio | undefined {
  const existing = portfolios.get(id);
  if (!existing) return undefined;
  const updated: Portfolio = {
    ...existing,
    ...data,
    updatedAt: now(),
  };
  portfolios.set(id, updated);
  return updated;
}

export function deletePortfolio(id: string): boolean {
  const existed = portfolios.delete(id);
  holdings.delete(id);
  analysisCache.delete(id);
  return existed;
}

// --- Holdings CRUD ---
export function getHoldings(portfolioId: string): Holding[] | undefined {
  return holdings.get(portfolioId);
}

export function addHolding(
  portfolioId: string,
  input: HoldingInput
): Holding | undefined {
  const list = holdings.get(portfolioId);
  if (!list) return undefined;
  const ts = now();
  const holding: Holding = {
    id: generateId(),
    portfolioId,
    ticker: input.ticker,
    name: input.name,
    market: input.market,
    shares: input.shares,
    avgPrice: input.avgPrice,
    sector: input.sector ?? null,
    createdAt: ts,
    updatedAt: ts,
  };
  list.push(holding);
  return holding;
}

export function updateHolding(
  portfolioId: string,
  holdingId: string,
  data: Partial<HoldingInput>
): Holding | undefined {
  const list = holdings.get(portfolioId);
  if (!list) return undefined;
  const idx = list.findIndex((h) => h.id === holdingId);
  if (idx === -1) return undefined;
  const updated: Holding = {
    ...list[idx],
    ...data,
    sector: data.sector !== undefined ? data.sector ?? null : list[idx].sector,
    updatedAt: now(),
  };
  list[idx] = updated;
  return updated;
}

export function deleteHolding(
  portfolioId: string,
  holdingId: string
): boolean {
  const list = holdings.get(portfolioId);
  if (!list) return false;
  const idx = list.findIndex((h) => h.id === holdingId);
  if (idx === -1) return false;
  list.splice(idx, 1);
  return true;
}

export function bulkAddHoldings(
  portfolioId: string,
  inputs: HoldingInput[]
): { holdings: Holding[]; failed: { index: number; reason: string }[] } {
  const result: Holding[] = [];
  const failed: { index: number; reason: string }[] = [];

  for (let i = 0; i < inputs.length; i++) {
    try {
      const h = addHolding(portfolioId, inputs[i]);
      if (h) {
        result.push(h);
      } else {
        failed.push({ index: i, reason: 'Portfolio not found' });
      }
    } catch {
      failed.push({ index: i, reason: 'Failed to add holding' });
    }
  }

  return { holdings: result, failed };
}

// --- Analysis cache ---
export function getAnalysis(portfolioId: string): AnalysisResult | undefined {
  return analysisCache.get(portfolioId);
}

export function setAnalysis(
  portfolioId: string,
  result: AnalysisResult
): void {
  analysisCache.set(portfolioId, result);
}

// --- Mock strategies ---
export const mockStrategies: InvestorStrategy[] = [
  {
    id: 'warren-buffett',
    name: 'Warren Buffett',
    nameKo: '워렌 버핏',
    philosophy:
      'Focus on wonderful companies at fair prices with strong economic moats.',
    philosophyKo:
      '강력한 경제적 해자를 가진 훌륭한 기업을 적정 가격에 매수하는 전략.',
    riskLevel: 'moderate',
    concentrationStyle: 'concentrated',
    sectorAllocation: {
      Technology: { min: 20, max: 50, target: 40 },
      'Financial Services': { min: 15, max: 35, target: 25 },
      'Consumer Staples': { min: 5, max: 20, target: 15 },
      Healthcare: { min: 0, max: 15, target: 10 },
      Energy: { min: 0, max: 15, target: 10 },
    },
    metrics: {
      preferredPER: { min: 10, max: 25 },
      preferredPBR: { min: 1, max: 5 },
      minROE: 15,
      minDividendYield: 1.5,
      maxDebtToEquity: 0.5,
    },
    cashRatio: { min: 5, max: 25 },
    maxSinglePosition: 40,
    topHoldingsCount: 5,
    keyCharacteristics: [
      'Buy and hold forever',
      'Strong brand moats',
      'Predictable cash flows',
      'Shareholder-friendly management',
    ],
    keyCharacteristicsKo: [
      '영구 보유 전략',
      '강력한 브랜드 해자',
      '예측 가능한 현금 흐름',
      '주주 친화적 경영진',
    ],
  },
  {
    id: 'ray-dalio',
    name: 'Ray Dalio',
    nameKo: '레이 달리오',
    philosophy:
      'All-weather diversification across uncorrelated assets and risk parity.',
    philosophyKo:
      '비상관 자산 간의 올웨더 분산투자와 리스크 패리티 전략.',
    riskLevel: 'conservative',
    concentrationStyle: 'diversified',
    sectorAllocation: {
      Technology: { min: 10, max: 20, target: 15 },
      'Financial Services': { min: 10, max: 20, target: 15 },
      'Consumer Staples': { min: 10, max: 20, target: 15 },
      Healthcare: { min: 10, max: 20, target: 15 },
      Energy: { min: 5, max: 15, target: 10 },
      Industrials: { min: 5, max: 15, target: 10 },
      'Real Estate': { min: 5, max: 15, target: 10 },
      Utilities: { min: 5, max: 15, target: 10 },
    },
    metrics: {
      preferredPER: { min: 8, max: 20 },
      preferredPBR: { min: 0.8, max: 3 },
      minROE: 10,
      maxDebtToEquity: 0.7,
    },
    cashRatio: { min: 10, max: 30 },
    maxSinglePosition: 10,
    topHoldingsCount: 15,
    keyCharacteristics: [
      'Risk parity allocation',
      'Macro-driven decisions',
      'Maximum diversification',
      'All-weather approach',
    ],
    keyCharacteristicsKo: [
      '리스크 패리티 배분',
      '거시경제 기반 의사결정',
      '최대 분산투자',
      '올웨더 접근 방식',
    ],
  },
  {
    id: 'cathie-wood',
    name: 'Cathie Wood',
    nameKo: '캐시 우드',
    philosophy:
      'Invest in disruptive innovation with a 5-year time horizon.',
    philosophyKo:
      '5년 투자 시계로 파괴적 혁신 기업에 투자하는 전략.',
    riskLevel: 'aggressive',
    concentrationStyle: 'concentrated',
    sectorAllocation: {
      Technology: { min: 40, max: 70, target: 55 },
      Healthcare: { min: 10, max: 30, target: 20 },
      'Communication Services': { min: 5, max: 20, target: 15 },
      'Consumer Cyclical': { min: 0, max: 15, target: 10 },
    },
    metrics: {
      preferredPER: { min: 20, max: 100 },
      minROE: 5,
    },
    cashRatio: { min: 2, max: 10 },
    maxSinglePosition: 15,
    topHoldingsCount: 10,
    keyCharacteristics: [
      'Disruptive innovation focus',
      'High growth, high volatility',
      'Long time horizon',
      'Concentrated bets on conviction',
    ],
    keyCharacteristicsKo: [
      '파괴적 혁신 집중',
      '고성장, 고변동성',
      '장기 투자 시계',
      '확신에 기반한 집중 투자',
    ],
  },
];

// --- Mock comparison ---
export function generateMockComparison(
  strategyId: string
): StrategyComparison | undefined {
  const strategy = mockStrategies.find((s) => s.id === strategyId);
  if (!strategy) return undefined;

  const scores: Record<string, { sim: number; sector: number; conc: number; risk: number }> = {
    'warren-buffett': { sim: 62, sector: 58, conc: 70, risk: 65 },
    'ray-dalio': { sim: 45, sector: 40, conc: 35, risk: 55 },
    'cathie-wood': { sim: 78, sector: 82, conc: 75, risk: 72 },
  };
  const s = scores[strategyId] ?? { sim: 50, sector: 50, conc: 50, risk: 50 };

  return {
    strategyId: strategy.id,
    strategyName: strategy.name,
    similarityScore: s.sim,
    sectorSimilarity: s.sector,
    concentrationSimilarity: s.conc,
    riskSimilarity: s.risk,
    differences: [
      `Technology allocation differs by ~${Math.abs(55 - (strategy.sectorAllocation['Technology']?.target ?? 0))}%`,
      `Max single position: yours ~20% vs ${strategy.name} ${strategy.maxSinglePosition}%`,
      `Portfolio concentration style: balanced vs ${strategy.concentrationStyle}`,
    ],
  };
}
