import { NextResponse } from 'next/server';
import type { StockQuoteResponse, StockQuote, ApiError } from '@/types';

const MOCK_QUOTES: Record<string, StockQuote> = {
  AAPL: { ticker: 'AAPL', name: 'Apple Inc.', price: 195.2, change: 2.35, changePercent: 1.22, volume: 54_320_000, marketCap: 3_020_000_000_000, sector: 'Technology', currency: 'USD' },
  MSFT: { ticker: 'MSFT', name: 'Microsoft Corporation', price: 425.6, change: -1.8, changePercent: -0.42, volume: 22_150_000, marketCap: 3_160_000_000_000, sector: 'Technology', currency: 'USD' },
  GOOGL: { ticker: 'GOOGL', name: 'Alphabet Inc.', price: 172.3, change: 3.1, changePercent: 1.83, volume: 28_400_000, marketCap: 2_140_000_000_000, sector: 'Technology', currency: 'USD' },
  AMZN: { ticker: 'AMZN', name: 'Amazon.com Inc.', price: 198.5, change: 4.2, changePercent: 2.16, volume: 45_600_000, marketCap: 2_050_000_000_000, sector: 'Consumer Cyclical', currency: 'USD' },
  NVDA: { ticker: 'NVDA', name: 'NVIDIA Corporation', price: 875.3, change: 12.5, changePercent: 1.45, volume: 42_800_000, marketCap: 2_150_000_000_000, sector: 'Technology', currency: 'USD' },
  META: { ticker: 'META', name: 'Meta Platforms Inc.', price: 512.8, change: -3.2, changePercent: -0.62, volume: 18_900_000, marketCap: 1_310_000_000_000, sector: 'Communication Services', currency: 'USD' },
  TSLA: { ticker: 'TSLA', name: 'Tesla Inc.', price: 248.5, change: 8.7, changePercent: 3.63, volume: 98_200_000, marketCap: 790_000_000_000, sector: 'Consumer Cyclical', currency: 'USD' },
  '005930': { ticker: '005930', name: '삼성전자', price: 78500, change: 1200, changePercent: 1.55, volume: 12_500_000, marketCap: 468_000_000_000_000, sector: 'Technology', currency: 'KRW' },
  '000660': { ticker: '000660', name: 'SK하이닉스', price: 178000, change: -2500, changePercent: -1.39, volume: 3_200_000, marketCap: 129_000_000_000_000, sector: 'Technology', currency: 'KRW' },
  '035720': { ticker: '035720', name: '카카오', price: 48200, change: -800, changePercent: -1.63, volume: 2_800_000, marketCap: 21_400_000_000_000, sector: 'Communication Services', currency: 'KRW' },
  '035420': { ticker: '035420', name: 'NAVER', price: 215000, change: 3500, changePercent: 1.65, volume: 1_500_000, marketCap: 35_200_000_000_000, sector: 'Communication Services', currency: 'KRW' },
  '051910': { ticker: '051910', name: 'LG화학', price: 385000, change: -5000, changePercent: -1.28, volume: 450_000, marketCap: 27_200_000_000_000, sector: 'Basic Materials', currency: 'KRW' },
  '005380': { ticker: '005380', name: '현대자동차', price: 242000, change: 4500, changePercent: 1.90, volume: 1_200_000, marketCap: 51_000_000_000_000, sector: 'Consumer Cyclical', currency: 'KRW' },
};

// GET /api/stocks/[ticker]/quote
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ ticker: string }> }
) {
  const { ticker } = await params;
  const upperTicker = ticker.toUpperCase();

  const quote = MOCK_QUOTES[upperTicker] ?? MOCK_QUOTES[ticker];

  if (!quote) {
    return NextResponse.json<ApiError>(
      { error: `Quote not found for ticker: ${ticker}`, code: 'NOT_FOUND' },
      { status: 404 }
    );
  }

  return NextResponse.json<StockQuoteResponse>({ quote });
}
