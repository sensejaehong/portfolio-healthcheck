import { NextResponse } from 'next/server';
import { getPortfolios, createPortfolio } from '@/lib/store';
import type { PortfolioListResponse, ApiError } from '@/types';

// GET /api/portfolios — list all portfolios
export async function GET() {
  const portfolios = getPortfolios();
  return NextResponse.json<PortfolioListResponse>({ portfolios });
}

// POST /api/portfolios — create a new portfolio
export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.name || typeof body.name !== 'string') {
      return NextResponse.json<ApiError>(
        { error: 'Portfolio name is required', code: 'VALIDATION_ERROR' },
        { status: 400 }
      );
    }

    const portfolio = createPortfolio({
      name: body.name,
      description: body.description ?? null,
    });

    return NextResponse.json({ portfolio }, { status: 201 });
  } catch {
    return NextResponse.json<ApiError>(
      { error: 'Invalid request body', code: 'PARSE_ERROR' },
      { status: 400 }
    );
  }
}
