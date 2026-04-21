import { NextResponse } from 'next/server';
import { getPortfolio, getAnalysis } from '@/lib/store';
import type { AnalysisResponse, ApiError } from '@/types';

// GET /api/portfolios/[id]/analysis — get cached analysis result
export async function GET(
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

  const analysis = getAnalysis(id);
  if (!analysis) {
    return NextResponse.json<ApiError>(
      {
        error: 'No analysis found. Run POST /api/portfolios/[id]/analyze first.',
        code: 'NO_ANALYSIS',
      },
      { status: 404 }
    );
  }

  return NextResponse.json<AnalysisResponse>({ analysis });
}
