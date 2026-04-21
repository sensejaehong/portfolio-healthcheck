import { NextResponse } from 'next/server';
import {
  getPortfolio,
  getHoldings,
  updatePortfolio,
  deletePortfolio,
} from '@/lib/store';
import type { PortfolioDetailResponse, ApiError } from '@/types';

// GET /api/portfolios/[id] — get portfolio detail with holdings
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

  const holdings = getHoldings(id) ?? [];

  return NextResponse.json<PortfolioDetailResponse>({ portfolio, holdings });
}

// PUT /api/portfolios/[id] — update portfolio
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const body = await request.json();
    const updated = updatePortfolio(id, {
      name: body.name,
      description: body.description,
    });

    if (!updated) {
      return NextResponse.json<ApiError>(
        { error: 'Portfolio not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    return NextResponse.json({ portfolio: updated });
  } catch {
    return NextResponse.json<ApiError>(
      { error: 'Invalid request body', code: 'PARSE_ERROR' },
      { status: 400 }
    );
  }
}

// DELETE /api/portfolios/[id] — delete portfolio
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const deleted = deletePortfolio(id);

  if (!deleted) {
    return NextResponse.json<ApiError>(
      { error: 'Portfolio not found', code: 'NOT_FOUND' },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true });
}
