import { NextResponse } from 'next/server';
import type { StrategiesResponse } from '@/types';
import { mockStrategies } from '@/lib/store';

// GET /api/strategies — list all investor strategies
export async function GET() {
  let strategies = mockStrategies;

  // Try to import from data directory (created by another agent)
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const module: any = await import('@/data/investor-strategies');
    if (module.strategies && Array.isArray(module.strategies)) {
      strategies = module.strategies;
    } else if (module.default && Array.isArray(module.default)) {
      strategies = module.default;
    }
  } catch {
    // Use mock strategies from store as fallback
  }

  return NextResponse.json<StrategiesResponse>({ strategies });
}
