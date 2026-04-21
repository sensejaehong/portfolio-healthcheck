'use client';

import useSWR, { type SWRResponse } from 'swr';
import useSWRMutation from 'swr/mutation';
import type {
  PortfolioListResponse,
  PortfolioDetailResponse,
  AnalysisResponse,
  StrategiesResponse,
  StockSearchResponse,
  ComparisonResponse,
  HoldingResponse,
  HoldingInput,
  Portfolio,
} from '@/types';
import { useRef, useEffect, useState } from 'react';

// --- Fetcher ---
async function fetcher<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(err.error ?? `HTTP ${res.status}`);
  }
  return res.json();
}

async function postFetcher<T>(url: string, { arg }: { arg?: unknown }): Promise<T> {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: arg ? JSON.stringify(arg) : undefined,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(err.error ?? `HTTP ${res.status}`);
  }
  return res.json();
}

// --- Hooks ---

/** Fetch all portfolios */
export function usePortfolios(): SWRResponse<PortfolioListResponse> {
  return useSWR<PortfolioListResponse>('/api/portfolios', fetcher);
}

/** Fetch single portfolio with holdings */
export function usePortfolio(id: string | undefined): SWRResponse<PortfolioDetailResponse> {
  return useSWR<PortfolioDetailResponse>(
    id ? `/api/portfolios/${id}` : null,
    fetcher
  );
}

/** Fetch cached analysis result */
export function useAnalysis(portfolioId: string | undefined): SWRResponse<AnalysisResponse> {
  return useSWR<AnalysisResponse>(
    portfolioId ? `/api/portfolios/${portfolioId}/analysis` : null,
    fetcher
  );
}

/** Fetch all investor strategies */
export function useStrategies(): SWRResponse<StrategiesResponse> {
  return useSWR<StrategiesResponse>('/api/strategies', fetcher);
}

/** Search stocks with debounce */
export function useStockSearch(query: string): SWRResponse<StockSearchResponse> {
  const [debouncedQuery, setDebouncedQuery] = useState(query);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    timerRef.current = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [query]);

  return useSWR<StockSearchResponse>(
    debouncedQuery.length >= 1
      ? `/api/stocks/search?q=${encodeURIComponent(debouncedQuery)}`
      : null,
    fetcher
  );
}

/** Trigger portfolio analysis (POST) */
export function useRunAnalysis(portfolioId: string | undefined) {
  return useSWRMutation<AnalysisResponse, Error, string | null>(
    portfolioId ? `/api/portfolios/${portfolioId}/analyze` : null,
    postFetcher<AnalysisResponse>
  );
}

/** Create a new portfolio (POST) */
export function useCreatePortfolio() {
  return useSWRMutation<{ portfolio: Portfolio }, Error, string, { name: string; description?: string }>(
    '/api/portfolios',
    postFetcher<{ portfolio: Portfolio }>
  );
}

/** Add a holding to a portfolio (POST) */
export function useAddHolding(portfolioId: string | undefined) {
  return useSWRMutation<HoldingResponse, Error, string | null, HoldingInput>(
    portfolioId ? `/api/portfolios/${portfolioId}/holdings` : null,
    postFetcher<HoldingResponse>
  );
}

/** Compare portfolio with a strategy (POST) */
export function useCompareStrategy(portfolioId: string | undefined) {
  return useSWRMutation<ComparisonResponse, Error, string | null, { strategyId: string }>(
    portfolioId ? `/api/portfolios/${portfolioId}/compare` : null,
    postFetcher<ComparisonResponse>
  );
}
