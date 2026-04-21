// =============================================
// 7 Investor Strategy Definitions
// =============================================

import type { InvestorStrategy } from '@/types';

export const warrenBuffett: InvestorStrategy = {
  id: 'warren-buffett',
  name: 'Warren Buffett',
  nameKo: '워런 버핏',
  philosophy:
    'Buy wonderful companies at fair prices. Focus on durable competitive advantages, strong management, and long-term compounding.',
  philosophyKo:
    '적정한 가격에 훌륭한 기업을 매수합니다. 지속 가능한 경쟁 우위, 우수한 경영진, 장기 복리 효과에 집중합니다.',
  riskLevel: 'moderate',
  concentrationStyle: 'concentrated',
  sectorAllocation: {
    'Technology': { min: 15, max: 50, target: 35 },
    'Financials': { min: 15, max: 40, target: 25 },
    'Consumer Staples': { min: 5, max: 20, target: 15 },
    'Energy': { min: 5, max: 15, target: 8 },
    'Healthcare': { min: 0, max: 10, target: 5 },
    'Consumer Discretionary': { min: 0, max: 15, target: 7 },
    'Industrials': { min: 0, max: 10, target: 5 },
  },
  metrics: {
    preferredPER: { min: 5, max: 25 },
    preferredPBR: { min: 1, max: 5 },
    minROE: 15,
    minDividendYield: 1.0,
    maxDebtToEquity: 100,
  },
  cashRatio: { min: 5, max: 30 },
  maxSinglePosition: 40,
  topHoldingsCount: 10,
  keyCharacteristics: [
    'Long-term buy-and-hold strategy',
    'Focus on companies with economic moats',
    'Preference for simple, understandable businesses',
    'High conviction concentrated positions',
    'Patient waiting for the right price',
  ],
  keyCharacteristicsKo: [
    '장기 매수 후 보유 전략',
    '경제적 해자를 보유한 기업에 집중',
    '단순하고 이해하기 쉬운 사업 선호',
    '높은 확신을 가진 집중 투자',
    '적정 가격이 올 때까지 인내심 있게 대기',
  ],
};

export const stanleyDruckenmiller: InvestorStrategy = {
  id: 'stanley-druckenmiller',
  name: 'Stanley Druckenmiller',
  nameKo: '스탠리 드러켄밀러',
  philosophy:
    'Macro-driven, flexible approach. Concentrate capital when conviction is high. Focus on risk/reward and capital preservation.',
  philosophyKo:
    '거시경제 기반의 유연한 접근법입니다. 확신이 높을 때 자본을 집중합니다. 위험/보상 비율과 자본 보존에 집중합니다.',
  riskLevel: 'aggressive',
  concentrationStyle: 'concentrated',
  sectorAllocation: {
    'Technology': { min: 20, max: 50, target: 35 },
    'Communication Services': { min: 5, max: 25, target: 15 },
    'Consumer Discretionary': { min: 5, max: 25, target: 15 },
    'Financials': { min: 5, max: 20, target: 10 },
    'Healthcare': { min: 0, max: 15, target: 10 },
    'Industrials': { min: 0, max: 15, target: 8 },
    'Energy': { min: 0, max: 15, target: 7 },
  },
  metrics: {
    preferredPER: { min: 10, max: 40 },
    preferredPBR: { min: 2, max: 15 },
    minROE: 12,
  },
  cashRatio: { min: 0, max: 40 },
  maxSinglePosition: 30,
  topHoldingsCount: 15,
  keyCharacteristics: [
    'Top-down macro analysis drives decisions',
    'Aggressive position sizing when conviction is high',
    'Willing to change direction quickly',
    'Focus on asymmetric risk/reward',
    'Growth-oriented with momentum consideration',
  ],
  keyCharacteristicsKo: [
    '하향식(탑다운) 거시경제 분석에 기반한 의사결정',
    '확신이 높을 때 공격적인 포지션 규모',
    '방향 전환에 주저하지 않는 유연성',
    '비대칭적 위험/보상 비율에 집중',
    '모멘텀을 고려한 성장 지향적 투자',
  ],
};

export const howardMarks: InvestorStrategy = {
  id: 'howard-marks',
  name: 'Howard Marks',
  nameKo: '하워드 막스',
  philosophy:
    'Second-level thinking and contrarian investing. Focus on understanding market cycles, avoiding the herd, and buying below intrinsic value.',
  philosophyKo:
    '2차적 사고와 역발상 투자를 추구합니다. 시장 사이클을 이해하고 군중 심리를 피하며 내재가치 이하에서 매수합니다.',
  riskLevel: 'conservative',
  concentrationStyle: 'balanced',
  sectorAllocation: {
    'Financials': { min: 15, max: 35, target: 25 },
    'Industrials': { min: 10, max: 25, target: 15 },
    'Energy': { min: 5, max: 20, target: 12 },
    'Healthcare': { min: 5, max: 20, target: 12 },
    'Consumer Staples': { min: 5, max: 20, target: 12 },
    'Real Estate': { min: 5, max: 15, target: 10 },
    'Materials': { min: 0, max: 15, target: 7 },
    'Technology': { min: 0, max: 15, target: 7 },
  },
  metrics: {
    preferredPER: { min: 3, max: 15 },
    preferredPBR: { min: 0.5, max: 2 },
    minROE: 10,
    minDividendYield: 2.0,
    maxDebtToEquity: 80,
  },
  cashRatio: { min: 10, max: 40 },
  maxSinglePosition: 15,
  topHoldingsCount: 20,
  keyCharacteristics: [
    'Contrarian approach — buy when others are fearful',
    'Deep focus on risk management and capital preservation',
    'Understanding market cycles is paramount',
    'Patient investing in distressed/undervalued assets',
    'Emphasis on margin of safety',
  ],
  keyCharacteristicsKo: [
    '역발상 접근 — 다른 투자자들이 두려워할 때 매수',
    '리스크 관리와 자본 보존에 깊이 집중',
    '시장 사이클 이해를 최우선시',
    '부실/저평가 자산에 인내심 있게 투자',
    '안전 마진을 중시',
  ],
};

export const rayDalio: InvestorStrategy = {
  id: 'ray-dalio',
  name: 'Ray Dalio',
  nameKo: '레이 달리오',
  philosophy:
    'All-weather portfolio through radical diversification. Balance risk across asset classes and economic environments.',
  philosophyKo:
    '극단적 분산을 통한 올웨더 포트폴리오를 추구합니다. 자산 클래스와 경제 환경에 걸쳐 위험을 균형 있게 배분합니다.',
  riskLevel: 'conservative',
  concentrationStyle: 'diversified',
  sectorAllocation: {
    'Technology': { min: 8, max: 18, target: 13 },
    'Healthcare': { min: 8, max: 18, target: 13 },
    'Financials': { min: 8, max: 18, target: 12 },
    'Consumer Staples': { min: 8, max: 16, target: 12 },
    'Industrials': { min: 6, max: 14, target: 10 },
    'Utilities': { min: 5, max: 12, target: 8 },
    'Energy': { min: 4, max: 12, target: 8 },
    'Consumer Discretionary': { min: 4, max: 12, target: 8 },
    'Real Estate': { min: 3, max: 10, target: 6 },
    'Materials': { min: 3, max: 10, target: 5 },
    'Communication Services': { min: 2, max: 10, target: 5 },
  },
  metrics: {
    preferredPER: { min: 8, max: 25 },
    preferredPBR: { min: 1, max: 4 },
    minROE: 10,
    minDividendYield: 1.5,
    maxDebtToEquity: 80,
  },
  cashRatio: { min: 5, max: 15 },
  maxSinglePosition: 8,
  topHoldingsCount: 30,
  keyCharacteristics: [
    'Maximum diversification across sectors and asset types',
    'Risk parity approach — balance risk, not capital',
    'Systematic and rules-based framework',
    'Protection against multiple economic scenarios',
    'Regular rebalancing to maintain target allocations',
  ],
  keyCharacteristicsKo: [
    '섹터와 자산 유형에 걸친 최대 분산 투자',
    '리스크 패리티 접근 — 자본이 아닌 위험을 균형',
    '체계적이고 규칙 기반의 투자 프레임워크',
    '다양한 경제 시나리오에 대한 보호',
    '목표 배분을 유지하기 위한 정기적 리밸런싱',
  ],
};

export const peterLynch: InvestorStrategy = {
  id: 'peter-lynch',
  name: 'Peter Lynch',
  nameKo: '피터 린치',
  philosophy:
    'Invest in what you know. Find growth companies early, especially those overlooked by Wall Street. Use PEG ratio to assess value.',
  philosophyKo:
    '자신이 아는 것에 투자합니다. 성장 기업을 초기에 발견하고, 특히 월스트리트가 간과한 기업을 찾습니다. PEG 비율로 가치를 평가합니다.',
  riskLevel: 'moderate',
  concentrationStyle: 'diversified',
  sectorAllocation: {
    'Consumer Discretionary': { min: 10, max: 30, target: 20 },
    'Technology': { min: 10, max: 25, target: 18 },
    'Healthcare': { min: 5, max: 20, target: 15 },
    'Financials': { min: 5, max: 20, target: 12 },
    'Industrials': { min: 5, max: 15, target: 10 },
    'Consumer Staples': { min: 5, max: 15, target: 10 },
    'Communication Services': { min: 0, max: 10, target: 5 },
    'Energy': { min: 0, max: 10, target: 5 },
    'Real Estate': { min: 0, max: 8, target: 3 },
    'Materials': { min: 0, max: 5, target: 2 },
  },
  metrics: {
    preferredPER: { min: 5, max: 30 },
    preferredPBR: { min: 1, max: 8 },
    minROE: 12,
    maxDebtToEquity: 60,
  },
  cashRatio: { min: 2, max: 10 },
  maxSinglePosition: 10,
  topHoldingsCount: 25,
  keyCharacteristics: [
    'Bottom-up stock picking based on personal knowledge',
    'Classify stocks: slow/stalwart/fast growers, cyclical, turnaround, asset play',
    'PEG ratio < 1 preferred for growth stocks',
    'Diversified across many positions',
    'Focus on earnings growth sustainability',
  ],
  keyCharacteristicsKo: [
    '개인 지식을 기반으로 한 상향식(바텀업) 종목 선정',
    '종목 분류: 저성장/대형우량/고성장, 경기순환, 턴어라운드, 자산주',
    '성장주의 경우 PEG 비율 1 미만을 선호',
    '다수 포지션에 분산 투자',
    '이익 성장의 지속 가능성에 집중',
  ],
};

export const georgeSoros: InvestorStrategy = {
  id: 'george-soros',
  name: 'George Soros',
  nameKo: '조지 소로스',
  philosophy:
    'Reflexivity theory — markets are inherently unstable. Identify feedback loops and mispricings. Bet big when the thesis is right.',
  philosophyKo:
    '재귀성 이론 — 시장은 본질적으로 불안정합니다. 피드백 루프와 가격 괴리를 발견하고 확신이 있을 때 크게 베팅합니다.',
  riskLevel: 'aggressive',
  concentrationStyle: 'concentrated',
  sectorAllocation: {
    'Financials': { min: 10, max: 35, target: 22 },
    'Technology': { min: 10, max: 30, target: 20 },
    'Energy': { min: 5, max: 25, target: 15 },
    'Communication Services': { min: 5, max: 20, target: 12 },
    'Consumer Discretionary': { min: 5, max: 20, target: 12 },
    'Healthcare': { min: 0, max: 15, target: 8 },
    'Industrials': { min: 0, max: 15, target: 6 },
    'Materials': { min: 0, max: 10, target: 5 },
  },
  metrics: {
    preferredPER: { min: 5, max: 50 },
    preferredPBR: { min: 0.5, max: 10 },
    minROE: 8,
  },
  cashRatio: { min: 0, max: 50 },
  maxSinglePosition: 35,
  topHoldingsCount: 12,
  keyCharacteristics: [
    'Macro-level thesis driven by reflexivity theory',
    'Extremely concentrated bets on high-conviction ideas',
    'Willing to use leverage and short-selling',
    'Quick to cut losses when thesis is wrong',
    'Focus on market inefficiencies and dislocations',
  ],
  keyCharacteristicsKo: [
    '재귀성 이론에 기반한 거시적 투자 테제',
    '높은 확신의 아이디어에 극도로 집중된 베팅',
    '레버리지와 공매도를 적극적으로 활용',
    '테제가 틀렸을 때 빠르게 손절',
    '시장 비효율성과 가격 괴리에 집중',
  ],
};

export const cathieWood: InvestorStrategy = {
  id: 'cathie-wood',
  name: 'Cathie Wood',
  nameKo: '캐시 우드',
  philosophy:
    'Invest in disruptive innovation. Focus on exponential growth technologies with 5+ year time horizons. Embrace volatility.',
  philosophyKo:
    '파괴적 혁신에 투자합니다. 5년 이상의 시간 지평에서 지수적 성장 기술에 집중합니다. 변동성을 수용합니다.',
  riskLevel: 'aggressive',
  concentrationStyle: 'concentrated',
  sectorAllocation: {
    'Technology': { min: 30, max: 60, target: 42 },
    'Healthcare': { min: 10, max: 30, target: 20 },
    'Communication Services': { min: 5, max: 20, target: 13 },
    'Consumer Discretionary': { min: 5, max: 20, target: 12 },
    'Financials': { min: 0, max: 15, target: 8 },
    'Industrials': { min: 0, max: 10, target: 5 },
  },
  metrics: {
    preferredPER: { min: 20, max: 200 },
    preferredPBR: { min: 3, max: 50 },
    minROE: 5,
  },
  cashRatio: { min: 0, max: 10 },
  maxSinglePosition: 12,
  topHoldingsCount: 20,
  keyCharacteristics: [
    'Focus on disruptive innovation platforms (AI, genomics, fintech, robotics, energy storage)',
    'High growth tolerance — willing to hold unprofitable companies',
    'Long time horizon of 5+ years',
    'Concentrated in technology and innovation sectors',
    'Active management with frequent rebalancing',
  ],
  keyCharacteristicsKo: [
    '파괴적 혁신 플랫폼에 집중 (AI, 유전체학, 핀테크, 로보틱스, 에너지 저장)',
    '높은 성장 허용도 — 미수익 기업도 보유 가능',
    '5년 이상의 장기 투자 시간 지평',
    '기술 및 혁신 섹터에 집중 투자',
    '빈번한 리밸런싱을 통한 적극적 운용',
  ],
};

/** All 7 investor strategies */
export const strategies: InvestorStrategy[] = [
  warrenBuffett,
  stanleyDruckenmiller,
  howardMarks,
  rayDalio,
  peterLynch,
  georgeSoros,
  cathieWood,
];

/** Alias for backward compatibility */
export const investorStrategies = strategies;

/** Default export for dynamic import compatibility */
export default strategies;

/** Lookup strategy by ID */
export function getStrategyById(id: string): InvestorStrategy | undefined {
  return strategies.find((s) => s.id === id);
}

/** Lookup strategy by name (English or Korean) */
export function getStrategyByName(name: string): InvestorStrategy | undefined {
  const lower = name.toLowerCase();
  return strategies.find(
    (s) => s.name.toLowerCase() === lower || s.nameKo === name,
  );
}
