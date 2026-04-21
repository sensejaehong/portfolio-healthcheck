"use client";

import { useState, useMemo } from "react";
import { Plus, Trash2, PieChart, Info, Camera } from "lucide-react";
import type { Holding, HoldingInput } from "@/types";
import SectorDonut from "@/components/charts/SectorDonut";
import ScreenshotImport from "@/components/portfolio/ScreenshotImport";

const SECTORS = [
  "기술",
  "금융",
  "헬스케어",
  "소비재",
  "에너지",
  "산업재",
  "통신",
  "유틸리티",
  "부동산",
  "소재",
];

const INITIAL_HOLDINGS: Holding[] = [
  {
    id: "1",
    portfolioId: "demo",
    ticker: "AAPL",
    name: "Apple Inc.",
    market: "NASDAQ",
    shares: 50,
    avgPrice: 178.5,
    sector: "기술",
    currentPrice: 195.2,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    portfolioId: "demo",
    ticker: "MSFT",
    name: "Microsoft Corp.",
    market: "NASDAQ",
    shares: 30,
    avgPrice: 340.0,
    sector: "기술",
    currentPrice: 378.9,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "3",
    portfolioId: "demo",
    ticker: "005930",
    name: "삼성전자",
    market: "KRX",
    shares: 100,
    avgPrice: 71000,
    sector: "기술",
    currentPrice: 74500,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "4",
    portfolioId: "demo",
    ticker: "JPM",
    name: "JPMorgan Chase",
    market: "NYSE",
    shares: 20,
    avgPrice: 155.0,
    sector: "금융",
    currentPrice: 198.4,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "5",
    portfolioId: "demo",
    ticker: "JNJ",
    name: "Johnson & Johnson",
    market: "NYSE",
    shares: 25,
    avgPrice: 160.0,
    sector: "헬스케어",
    currentPrice: 155.8,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const emptyForm: HoldingInput = {
  ticker: "",
  name: "",
  market: "NASDAQ",
  shares: 0,
  avgPrice: 0,
  sector: "",
};

export default function PortfolioPage() {
  const [holdings, setHoldings] = useState<Holding[]>(INITIAL_HOLDINGS);
  const [form, setForm] = useState<HoldingInput>(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [showScreenshotImport, setShowScreenshotImport] = useState(false);

  const totalValue = useMemo(() => {
    return holdings.reduce((sum, h) => {
      const price = h.currentPrice ?? h.avgPrice;
      return sum + h.shares * price;
    }, 0);
  }, [holdings]);

  const holdingsWithWeight = useMemo(() => {
    return holdings.map((h) => {
      const price = h.currentPrice ?? h.avgPrice;
      const value = h.shares * price;
      return {
        ...h,
        currentValue: value,
        weight: totalValue > 0 ? (value / totalValue) * 100 : 0,
      };
    });
  }, [holdings, totalValue]);

  const sectorData = useMemo(() => {
    const map = new Map<string, number>();
    holdingsWithWeight.forEach((h) => {
      const sector = h.sector || "기타";
      map.set(sector, (map.get(sector) || 0) + (h.weight || 0));
    });
    return Array.from(map.entries()).map(([name, weight]) => ({
      name,
      weight: Math.round(weight * 10) / 10,
      benchmark: 15,
    }));
  }, [holdingsWithWeight]);

  const addHolding = () => {
    if (!form.ticker || !form.name || form.shares <= 0 || form.avgPrice <= 0)
      return;
    const newHolding: Holding = {
      id: Date.now().toString(),
      portfolioId: "demo",
      ticker: form.ticker.toUpperCase(),
      name: form.name,
      market: form.market,
      shares: form.shares,
      avgPrice: form.avgPrice,
      sector: form.sector || null,
      currentPrice: form.avgPrice,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setHoldings((prev) => [...prev, newHolding]);
    setForm(emptyForm);
    setShowForm(false);
  };

  const removeHolding = (id: string) => {
    setHoldings((prev) => prev.filter((h) => h.id !== id));
  };

  const handleScreenshotImport = (imported: Holding[]) => {
    setHoldings((prev) => [...prev, ...imported]);
    setShowScreenshotImport(false);
  };

  const formatCurrency = (value: number, market: string) => {
    if (market === "KRX") {
      return new Intl.NumberFormat("ko-KR", {
        style: "currency",
        currency: "KRW",
        maximumFractionDigits: 0,
      }).format(value);
    }
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Screenshot Import Modal */}
      {showScreenshotImport && (
        <ScreenshotImport
          onImport={handleScreenshotImport}
          onClose={() => setShowScreenshotImport(false)}
        />
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">포트폴리오 관리</h1>
          <p className="text-slate-500 mt-1">
            보유 종목을 추가하고 포트폴리오 구성을 확인하세요
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowScreenshotImport(true)}
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium px-5 py-2.5 rounded-lg transition-colors shadow-sm"
          >
            <Camera className="w-4 h-4" />
            스크린샷으로 추가
          </button>
          <button
            onClick={() => setShowForm(!showForm)}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-medium px-5 py-2.5 rounded-lg transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            종목 추가
          </button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <p className="text-sm text-slate-500">총 평가 금액</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">
            {totalValue > 1000000
              ? `${(totalValue / 1000000).toFixed(1)}M`
              : totalValue.toLocaleString()}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <p className="text-sm text-slate-500">보유 종목수</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">
            {holdings.length}개
          </p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <p className="text-sm text-slate-500">섹터 수</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">
            {sectorData.length}개
          </p>
        </div>
      </div>

      {/* Add form */}
      {showForm && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 animate-fade-in-up">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">
            새 종목 추가
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                티커
              </label>
              <input
                type="text"
                value={form.ticker}
                onChange={(e) =>
                  setForm({ ...form, ticker: e.target.value })
                }
                placeholder="예: AAPL, 005930"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                종목명
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
                placeholder="예: Apple Inc."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                시장
              </label>
              <select
                value={form.market}
                onChange={(e) =>
                  setForm({
                    ...form,
                    market: e.target.value as "KRX" | "NYSE" | "NASDAQ",
                  })
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
              >
                <option value="NASDAQ">NASDAQ</option>
                <option value="NYSE">NYSE</option>
                <option value="KRX">KRX (한국)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                보유 수량
              </label>
              <input
                type="number"
                value={form.shares || ""}
                onChange={(e) =>
                  setForm({ ...form, shares: Number(e.target.value) })
                }
                placeholder="0"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                평균 매입가
              </label>
              <input
                type="number"
                value={form.avgPrice || ""}
                onChange={(e) =>
                  setForm({ ...form, avgPrice: Number(e.target.value) })
                }
                placeholder="0"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                섹터
              </label>
              <select
                value={form.sector || ""}
                onChange={(e) =>
                  setForm({ ...form, sector: e.target.value })
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
              >
                <option value="">섹터 선택</option>
                {SECTORS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex gap-3 mt-5">
            <button
              onClick={addHolding}
              className="bg-blue-600 hover:bg-blue-500 text-white font-medium px-5 py-2 rounded-lg transition-colors text-sm"
            >
              추가하기
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium px-5 py-2 rounded-lg transition-colors text-sm"
            >
              취소
            </button>
          </div>
        </div>
      )}

      {/* Content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Holdings table */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200">
            <h2 className="font-semibold text-slate-900">보유 종목</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-left">
                  <th className="px-6 py-3 font-medium">종목</th>
                  <th className="px-4 py-3 font-medium">시장</th>
                  <th className="px-4 py-3 font-medium text-right">수량</th>
                  <th className="px-4 py-3 font-medium text-right">현재가</th>
                  <th className="px-4 py-3 font-medium text-right">평가금액</th>
                  <th className="px-4 py-3 font-medium text-right">비중</th>
                  <th className="px-4 py-3 font-medium"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {holdingsWithWeight.map((h) => (
                  <tr key={h.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-3">
                      <div>
                        <p className="font-medium text-slate-900">{h.ticker}</p>
                        <p className="text-xs text-slate-400">{h.name}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-600">
                        {h.market}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right text-slate-700">
                      {h.shares.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right text-slate-700">
                      {formatCurrency(h.currentPrice ?? h.avgPrice, h.market)}
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-slate-900">
                      {formatCurrency(h.currentValue ?? 0, h.market)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-500 rounded-full"
                            style={{ width: `${Math.min(h.weight ?? 0, 100)}%` }}
                          />
                        </div>
                        <span className="text-slate-700 font-medium w-12 text-right">
                          {(h.weight ?? 0).toFixed(1)}%
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => removeHolding(h.id)}
                        className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"
                        title="삭제"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
                {holdings.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                      보유 종목이 없습니다. 위의 &quot;종목 추가&quot; 버튼을 눌러
                      시작하세요.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sector chart */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <PieChart className="w-5 h-5 text-blue-600" />
            <h2 className="font-semibold text-slate-900">섹터 분포</h2>
          </div>
          {sectorData.length > 0 ? (
            <SectorDonut sectors={sectorData} />
          ) : (
            <div className="h-48 flex items-center justify-center text-slate-400 text-sm">
              종목을 추가하면 섹터 분포가 표시됩니다
            </div>
          )}
          <div className="mt-4 flex items-start gap-2 p-3 bg-blue-50 rounded-lg">
            <Info className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-blue-700">
              섹터 비중은 각 종목의 평가금액(수량 x 현재가) 기준으로 자동 계산됩니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
