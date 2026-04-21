import { NextResponse } from 'next/server';
import type { StockSearchResponse, StockSearchResult } from '@/types';

const STOCK_LIST: StockSearchResult[] = [
  // US Stocks
  { ticker: 'AAPL', name: 'Apple Inc.', market: 'NASDAQ', sector: 'Technology' },
  { ticker: 'MSFT', name: 'Microsoft Corporation', market: 'NASDAQ', sector: 'Technology' },
  { ticker: 'GOOGL', name: 'Alphabet Inc.', market: 'NASDAQ', sector: 'Technology' },
  { ticker: 'AMZN', name: 'Amazon.com Inc.', market: 'NASDAQ', sector: 'Consumer Cyclical' },
  { ticker: 'NVDA', name: 'NVIDIA Corporation', market: 'NASDAQ', sector: 'Technology' },
  { ticker: 'META', name: 'Meta Platforms Inc.', market: 'NASDAQ', sector: 'Communication Services' },
  { ticker: 'TSLA', name: 'Tesla Inc.', market: 'NASDAQ', sector: 'Consumer Cyclical' },
  { ticker: 'BRK.B', name: 'Berkshire Hathaway', market: 'NYSE', sector: 'Financial Services' },
  { ticker: 'JPM', name: 'JPMorgan Chase & Co.', market: 'NYSE', sector: 'Financial Services' },
  { ticker: 'V', name: 'Visa Inc.', market: 'NYSE', sector: 'Financial Services' },
  { ticker: 'JNJ', name: 'Johnson & Johnson', market: 'NYSE', sector: 'Healthcare' },
  { ticker: 'UNH', name: 'UnitedHealth Group', market: 'NYSE', sector: 'Healthcare' },
  { ticker: 'XOM', name: 'Exxon Mobil Corporation', market: 'NYSE', sector: 'Energy' },
  { ticker: 'PG', name: 'Procter & Gamble', market: 'NYSE', sector: 'Consumer Staples' },
  { ticker: 'MA', name: 'Mastercard Inc.', market: 'NYSE', sector: 'Financial Services' },
  { ticker: 'DIS', name: 'Walt Disney Company', market: 'NYSE', sector: 'Communication Services' },
  { ticker: 'AMD', name: 'Advanced Micro Devices', market: 'NASDAQ', sector: 'Technology' },
  // Korean Stocks
  { ticker: '005930', name: '삼성전자', market: 'KRX', sector: 'Technology' },
  { ticker: '000660', name: 'SK하이닉스', market: 'KRX', sector: 'Technology' },
  { ticker: '035720', name: '카카오', market: 'KRX', sector: 'Communication Services' },
  { ticker: '035420', name: 'NAVER', market: 'KRX', sector: 'Communication Services' },
  { ticker: '051910', name: 'LG화학', market: 'KRX', sector: 'Basic Materials' },
  { ticker: '006400', name: '삼성SDI', market: 'KRX', sector: 'Technology' },
  { ticker: '005380', name: '현대자동차', market: 'KRX', sector: 'Consumer Cyclical' },
  { ticker: '000270', name: '기아', market: 'KRX', sector: 'Consumer Cyclical' },
  { ticker: '105560', name: 'KB금융', market: 'KRX', sector: 'Financial Services' },
  { ticker: '055550', name: '신한지주', market: 'KRX', sector: 'Financial Services' },
  { ticker: '068270', name: '셀트리온', market: 'KRX', sector: 'Healthcare' },
  { ticker: '207940', name: '삼성바이오로직스', market: 'KRX', sector: 'Healthcare' },
  { ticker: '003670', name: '포스코퓨처엠', market: 'KRX', sector: 'Basic Materials' },
];

// GET /api/stocks/search?q=query
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = (searchParams.get('q') ?? '').trim().toLowerCase();

  if (!query) {
    return NextResponse.json<StockSearchResponse>({ stocks: [] });
  }

  const stocks = STOCK_LIST.filter(
    (s) =>
      s.ticker.toLowerCase().includes(query) ||
      s.name.toLowerCase().includes(query) ||
      s.sector.toLowerCase().includes(query)
  ).slice(0, 10);

  return NextResponse.json<StockSearchResponse>({ stocks });
}
