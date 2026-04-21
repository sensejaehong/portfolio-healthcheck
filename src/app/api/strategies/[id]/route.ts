import { NextResponse } from 'next/server';
import type { StrategyDetailResponse, ApiError, InvestorStrategy } from '@/types';
import { mockStrategies } from '@/lib/store';

// GET /api/strategies/[id] — get single strategy
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  let strategies: InvestorStrategy[] = mockStrategies;

  // Try data directory first
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const module: any = await import('@/data/investor-strategies');
    if (module.strategies && Array.isArray(module.strategies)) {
      strategies = module.strategies;
    } else if (module.default && Array.isArray(module.default)) {
      strategies = module.default;
    }
  } catch {
    // Use mock strategies from store
  }

  const strategy = strategies.find((s) => s.id === id);

  if (!strategy) {
    return NextResponse.json<ApiError>(
      { error: 'Strategy not found', code: 'NOT_FOUND' },
      { status: 404 }
    );
  }

  return NextResponse.json<StrategyDetailResponse>({ strategy });
}
