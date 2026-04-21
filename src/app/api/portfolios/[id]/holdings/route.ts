import { NextResponse } from 'next/server';
import { getPortfolio, addHolding } from '@/lib/store';
import type { HoldingResponse, ApiError, HoldingInput } from '@/types';

// POST /api/portfolios/[id]/holdings — add a single holding
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
    const body: HoldingInput = await request.json();

    if (!body.ticker || !body.name || !body.market || !body.shares || !body.avgPrice) {
      return NextResponse.json<ApiError>(
        {
          error: 'Missing required fields: ticker, name, market, shares, avgPrice',
          code: 'VALIDATION_ERROR',
        },
        { status: 400 }
      );
    }

    const holding = addHolding(id, body);

    if (!holding) {
      return NextResponse.json<ApiError>(
        { error: 'Failed to add holding', code: 'INTERNAL_ERROR' },
        { status: 500 }
      );
    }

    return NextResponse.json<HoldingResponse>({ holding }, { status: 201 });
  } catch {
    return NextResponse.json<ApiError>(
      { error: 'Invalid request body', code: 'PARSE_ERROR' },
      { status: 400 }
    );
  }
}
