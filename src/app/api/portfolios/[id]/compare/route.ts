import { NextResponse } from 'next/server';
import {
  getPortfolio,
  mockStrategies,
  generateMockComparison,
} from '@/lib/store';
import type { ComparisonResponse, ApiError } from '@/types';

// POST /api/portfolios/[id]/compare — compare portfolio with strategy
export async function POST(
  request: Request,
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

  try {
    const body = await request.json();
    const { strategyId } = body as { strategyId?: string };

    if (!strategyId) {
      return NextResponse.json<ApiError>(
        { error: 'strategyId is required', code: 'VALIDATION_ERROR' },
        { status: 400 }
      );
    }

    // If a specific strategy is requested, compare with just that one
    // Otherwise compare with all strategies
    if (strategyId === 'all') {
      const comparisons = mockStrategies
        .map((s) => generateMockComparison(s.id))
        .filter(Boolean) as NonNullable<ReturnType<typeof generateMockComparison>>[];

      return NextResponse.json<ComparisonResponse>({ comparisons });
    }

    const comparison = generateMockComparison(strategyId);
    if (!comparison) {
      return NextResponse.json<ApiError>(
        { error: 'Strategy not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    return NextResponse.json<ComparisonResponse>({
      comparisons: [comparison],
    });
  } catch {
    return NextResponse.json<ApiError>(
      { error: 'Invalid request body', code: 'PARSE_ERROR' },
      { status: 400 }
    );
  }
}
