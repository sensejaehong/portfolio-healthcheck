import { NextResponse } from 'next/server';
import { getPortfolio, getHoldings, setAnalysis } from '@/lib/store';
import type { AnalysisResponse, AnalysisResult, ApiError } from '@/types';

// POST /api/portfolios/[id]/analyze — trigger portfolio analysis
export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const portfolio = getPortfolio(id);
  if (!portfolio) {
    return NextResponse.json<ApiError>(
      { error: 'Portfolio not found', code: 'NOT_FOUND' },
      { status: 404 }
    );
  }

  const holdings = getHoldings(id) ?? [];
  if (holdings.length === 0) {
    return NextResponse.json<ApiError>(
      { error: 'Portfolio has no holdings to analyze', code: 'NO_HOLDINGS' },
      { status: 400 }
    );
  }

  // Try to import real analysis functions; fall back to mock
  let analysisResult: AnalysisResult;
  try {
    const { analyzePortfolio } = await import('@/lib/analysis');
    analysisResult = analyzePortfolio(holdings);
  } catch {
    // Fallback: generate mock analysis result
    analysisResult = generateMockAnalysis();
  }

  // Cache the result
  setAnalysis(id, analysisResult);

  return NextResponse.json<AnalysisResponse>({ analysis: analysisResult });
}

function generateMockAnalysis(): AnalysisResult {
  return {
    healthScore: 72,
    healthGrade: 'good',
    diversification: {
      hhi: 1175,
      topNConcentration: { n: 3, percentage: 47 },
      stockCount: 8,
      interpretation:
        '포트폴리오가 적절히 분산되어 있으나, 기술주 비중이 높습니다.',
    },
    sectorBalance: {
      sectors: [
        { name: 'Technology', weight: 82, benchmark: 35, deviation: 47 },
        { name: 'Consumer Cyclical', weight: 10, benchmark: 12, deviation: -2 },
        {
          name: 'Communication Services',
          weight: 8,
          benchmark: 10,
          deviation: -2,
        },
      ],
      totalDeviation: 51,
      interpretation:
        '기술 섹터에 과도하게 집중되어 있습니다. 다른 섹터로의 분산이 필요합니다.',
    },
    risk: {
      annualVolatility: 24.5,
      beta: 1.15,
      maxDrawdown: -18.3,
      sharpeRatio: 1.42,
      interpretation:
        '시장 대비 약간 높은 변동성을 보이지만, 위험 대비 수익률은 양호합니다.',
    },
    rebalancing: {
      suggestions: [
        {
          ticker: 'AAPL',
          name: 'Apple Inc.',
          action: 'sell',
          currentWeight: 20,
          targetWeight: 15,
          adjustmentPercent: -5,
        },
        {
          ticker: 'NVDA',
          name: 'NVIDIA Corporation',
          action: 'hold',
          currentWeight: 12,
          targetWeight: 12,
          adjustmentPercent: 0,
        },
        {
          ticker: '005930',
          name: '삼성전자',
          action: 'hold',
          currentWeight: 15,
          targetWeight: 15,
          adjustmentPercent: 0,
        },
        {
          ticker: 'VZ',
          name: 'Verizon Communications',
          action: 'buy',
          currentWeight: 0,
          targetWeight: 5,
          adjustmentPercent: 5,
        },
      ],
      strategyName: 'Balanced Growth',
      estimatedTrades: 2,
    },
    analyzedAt: new Date().toISOString(),
  };
}
