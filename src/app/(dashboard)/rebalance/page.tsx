"use client";

import { useState, useMemo } from "react";
import {
  RefreshCw,
  ArrowUpCircle,
  ArrowDownCircle,
  MinusCircle,
  Info,
  ChevronDown,
} from "lucide-react";
import type { RebalanceSuggestion } from "@/types";
import SectorDonut from "@/components/charts/SectorDonut";

const STRATEGIES = [
  { id: "buffett", name: "워런 버핏 스타일" },
  { id: "dalio", name: "레이 달리오 스타일" },
  { id: "lynch", name: "피터 린치 스타일" },
  { id: "marks", name: "하워드 막스 스타일" },
  { id: "wood", name: "캐시 우드 스타일" },
];

const MOCK_SUGGESTIONS: Record<string, RebalanceSuggestion[]> = {
  buffett: [
    {
      ticker: "AAPL",
      name: "Apple Inc.",
      action: "hold",
      currentWeight: 28.5,
      targetWeight: 25.0,
      adjustmentPercent: -3.5,
    },
    {
      ticker: "MSFT",
      name: "Microsoft Corp.",
      action: "sell",
      currentWeight: 22.0,
      targetWeight: 15.0,
      adjustmentPercent: -7.0,
    },
    {
      ticker: "005930",
      name: "삼성전자",
      action: "sell",
      currentWeight: 21.8,
      targetWeight: 10.0,
      adjustmentPercent: -11.8,
    },
    {
      ticker: "JPM",
      name: "JPMorgan Chase",
      action: "buy",
      currentWeight: 15.5,
      targetWeight: 25.0,
      adjustmentPercent: 9.5,
    },
    {
      ticker: "JNJ",
      name: "Johnson & Johnson",
      action: "hold",
      currentWeight: 12.2,
      targetWeight: 10.0,
      adjustmentPercent: -2.2,
    },
    {
      ticker: "KO",
      name: "Coca-Cola",
      action: "buy",
      currentWeight: 0,
      targetWeight: 8.0,
      adjustmentPercent: 8.0,
    },
    {
      ticker: "BRK.B",
      name: "Berkshire Hathaway",
      action: "buy",
      currentWeight: 0,
      targetWeight: 7.0,
      adjustmentPercent: 7.0,
    },
  ],
  dalio: [
    {
      ticker: "AAPL",
      name: "Apple Inc.",
      action: "sell",
      currentWeight: 28.5,
      targetWeight: 12.0,
      adjustmentPercent: -16.5,
    },
    {
      ticker: "MSFT",
      name: "Microsoft Corp.",
      action: "sell",
      currentWeight: 22.0,
      targetWeight: 10.0,
      adjustmentPercent: -12.0,
    },
    {
      ticker: "005930",
      name: "삼성전자",
      action: "sell",
      currentWeight: 21.8,
      targetWeight: 8.0,
      adjustmentPercent: -13.8,
    },
    {
      ticker: "JPM",
      name: "JPMorgan Chase",
      action: "hold",
      currentWeight: 15.5,
      targetWeight: 15.0,
      adjustmentPercent: -0.5,
    },
    {
      ticker: "JNJ",
      name: "Johnson & Johnson",
      action: "buy",
      currentWeight: 12.2,
      targetWeight: 15.0,
      adjustmentPercent: 2.8,
    },
    {
      ticker: "VNQ",
      name: "Vanguard Real Estate",
      action: "buy",
      currentWeight: 0,
      targetWeight: 10.0,
      adjustmentPercent: 10.0,
    },
    {
      ticker: "TLT",
      name: "iShares 20+ Year Treasury",
      action: "buy",
      currentWeight: 0,
      targetWeight: 15.0,
      adjustmentPercent: 15.0,
    },
    {
      ticker: "GLD",
      name: "SPDR Gold Shares",
      action: "buy",
      currentWeight: 0,
      targetWeight: 15.0,
      adjustmentPercent: 15.0,
    },
  ],
  lynch: [
    {
      ticker: "AAPL",
      name: "Apple Inc.",
      action: "sell",
      currentWeight: 28.5,
      targetWeight: 8.0,
      adjustmentPercent: -20.5,
    },
    {
      ticker: "MSFT",
      name: "Microsoft Corp.",
      action: "sell",
      currentWeight: 22.0,
      targetWeight: 8.0,
      adjustmentPercent: -14.0,
    },
    {
      ticker: "005930",
      name: "삼성전자",
      action: "sell",
      currentWeight: 21.8,
      targetWeight: 6.0,
      adjustmentPercent: -15.8,
    },
    {
      ticker: "JPM",
      name: "JPMorgan Chase",
      action: "hold",
      currentWeight: 15.5,
      targetWeight: 6.0,
      adjustmentPercent: -9.5,
    },
    {
      ticker: "JNJ",
      name: "Johnson & Johnson",
      action: "hold",
      currentWeight: 12.2,
      targetWeight: 8.0,
      adjustmentPercent: -4.2,
    },
    {
      ticker: "COST",
      name: "Costco Wholesale",
      action: "buy",
      currentWeight: 0,
      targetWeight: 8.0,
      adjustmentPercent: 8.0,
    },
    {
      ticker: "SBUX",
      name: "Starbucks",
      action: "buy",
      currentWeight: 0,
      targetWeight: 6.0,
      adjustmentPercent: 6.0,
    },
  ],
  marks: [
    {
      ticker: "AAPL",
      name: "Apple Inc.",
      action: "sell",
      currentWeight: 28.5,
      targetWeight: 10.0,
      adjustmentPercent: -18.5,
    },
    {
      ticker: "MSFT",
      name: "Microsoft Corp.",
      action: "sell",
      currentWeight: 22.0,
      targetWeight: 8.0,
      adjustmentPercent: -14.0,
    },
    {
      ticker: "005930",
      name: "삼성전자",
      action: "sell",
      currentWeight: 21.8,
      targetWeight: 8.0,
      adjustmentPercent: -13.8,
    },
    {
      ticker: "JPM",
      name: "JPMorgan Chase",
      action: "buy",
      currentWeight: 15.5,
      targetWeight: 20.0,
      adjustmentPercent: 4.5,
    },
    {
      ticker: "JNJ",
      name: "Johnson & Johnson",
      action: "buy",
      currentWeight: 12.2,
      targetWeight: 15.0,
      adjustmentPercent: 2.8,
    },
  ],
  wood: [
    {
      ticker: "AAPL",
      name: "Apple Inc.",
      action: "hold",
      currentWeight: 28.5,
      targetWeight: 12.0,
      adjustmentPercent: -16.5,
    },
    {
      ticker: "MSFT",
      name: "Microsoft Corp.",
      action: "hold",
      currentWeight: 22.0,
      targetWeight: 10.0,
      adjustmentPercent: -12.0,
    },
    {
      ticker: "005930",
      name: "삼성전자",
      action: "sell",
      currentWeight: 21.8,
      targetWeight: 5.0,
      adjustmentPercent: -16.8,
    },
    {
      ticker: "TSLA",
      name: "Tesla Inc.",
      action: "buy",
      currentWeight: 0,
      targetWeight: 15.0,
      adjustmentPercent: 15.0,
    },
    {
      ticker: "ROKU",
      name: "Roku Inc.",
      action: "buy",
      currentWeight: 0,
      targetWeight: 10.0,
      adjustmentPercent: 10.0,
    },
    {
      ticker: "CRSP",
      name: "CRISPR Therapeutics",
      action: "buy",
      currentWeight: 0,
      targetWeight: 8.0,
      adjustmentPercent: 8.0,
    },
  ],
};

const BEFORE_SECTORS = [
  { name: "기술", weight: 62.3, benchmark: 28.0 },
  { name: "금융", weight: 18.5, benchmark: 13.0 },
  { name: "헬스케어", weight: 12.2, benchmark: 13.5 },
  { name: "소비재", weight: 4.0, benchmark: 10.0 },
  { name: "에너지", weight: 3.0, benchmark: 5.0 },
];

const AFTER_SECTORS_MAP: Record<string, { name: string; weight: number; benchmark: number }[]> = {
  buffett: [
    { name: "기술", weight: 25.0, benchmark: 28.0 },
    { name: "금융", weight: 35.0, benchmark: 13.0 },
    { name: "헬스케어", weight: 10.0, benchmark: 13.5 },
    { name: "소비재", weight: 20.0, benchmark: 10.0 },
    { name: "에너지", weight: 10.0, benchmark: 5.0 },
  ],
  dalio: [
    { name: "기술", weight: 18.0, benchmark: 28.0 },
    { name: "금융", weight: 18.0, benchmark: 13.0 },
    { name: "헬스케어", weight: 18.0, benchmark: 13.5 },
    { name: "소비재", weight: 18.0, benchmark: 10.0 },
    { name: "유틸리티", weight: 14.0, benchmark: 5.0 },
    { name: "에너지", weight: 14.0, benchmark: 5.0 },
  ],
  lynch: [
    { name: "소비재", weight: 30.0, benchmark: 10.0 },
    { name: "기술", weight: 20.0, benchmark: 28.0 },
    { name: "헬스케어", weight: 18.0, benchmark: 13.5 },
    { name: "산업재", weight: 20.0, benchmark: 10.0 },
    { name: "금융", weight: 12.0, benchmark: 13.0 },
  ],
  marks: [
    { name: "금융", weight: 25.0, benchmark: 13.0 },
    { name: "소비재", weight: 20.0, benchmark: 10.0 },
    { name: "헬스케어", weight: 20.0, benchmark: 13.5 },
    { name: "기술", weight: 15.0, benchmark: 28.0 },
    { name: "산업재", weight: 20.0, benchmark: 10.0 },
  ],
  wood: [
    { name: "기술", weight: 60.0, benchmark: 28.0 },
    { name: "헬스케어", weight: 20.0, benchmark: 13.5 },
    { name: "산업재", weight: 10.0, benchmark: 10.0 },
    { name: "금융", weight: 5.0, benchmark: 13.0 },
    { name: "통신", weight: 5.0, benchmark: 5.0 },
  ],
};

export default function RebalancePage() {
  const [selectedStrategy, setSelectedStrategy] = useState("buffett");

  const suggestions = MOCK_SUGGESTIONS[selectedStrategy] || [];
  const afterSectors = AFTER_SECTORS_MAP[selectedStrategy] || BEFORE_SECTORS;

  const buyCount = suggestions.filter((s) => s.action === "buy").length;
  const sellCount = suggestions.filter((s) => s.action === "sell").length;
  const holdCount = suggestions.filter((s) => s.action === "hold").length;

  const strategyName =
    STRATEGIES.find((s) => s.id === selectedStrategy)?.name || "";

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            리밸런싱 시뮬레이터
          </h1>
          <p className="text-slate-500 mt-1">
            투자 전략에 맞춰 포트폴리오를 리밸런싱해 보세요
          </p>
        </div>
        <div className="relative">
          <select
            value={selectedStrategy}
            onChange={(e) => setSelectedStrategy(e.target.value)}
            className="appearance-none bg-white border border-slate-300 rounded-lg px-4 py-2.5 pr-10 text-sm font-medium text-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none cursor-pointer"
          >
            {STRATEGIES.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        </div>
      </div>

      {/* Summary badges */}
      <div className="flex flex-wrap gap-3">
        <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-lg text-sm font-medium">
          <ArrowUpCircle className="w-4 h-4" />
          매수 {buyCount}건
        </div>
        <div className="inline-flex items-center gap-2 bg-red-50 text-red-700 px-4 py-2 rounded-lg text-sm font-medium">
          <ArrowDownCircle className="w-4 h-4" />
          매도 {sellCount}건
        </div>
        <div className="inline-flex items-center gap-2 bg-slate-100 text-slate-600 px-4 py-2 rounded-lg text-sm font-medium">
          <MinusCircle className="w-4 h-4" />
          유지 {holdCount}건
        </div>
      </div>

      {/* Before / After donuts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="font-semibold text-slate-900 text-center mb-2">
            현재 포트폴리오
          </h2>
          <p className="text-xs text-slate-400 text-center mb-4">리밸런싱 전</p>
          <SectorDonut sectors={BEFORE_SECTORS} />
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="font-semibold text-slate-900 text-center mb-2">
            {strategyName} 목표
          </h2>
          <p className="text-xs text-slate-400 text-center mb-4">리밸런싱 후</p>
          <SectorDonut sectors={afterSectors} />
        </div>
      </div>

      {/* Suggestion list */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center gap-2">
          <RefreshCw className="w-5 h-5 text-blue-600" />
          <h2 className="font-semibold text-slate-900">리밸런싱 제안</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-left">
                <th className="px-6 py-3 font-medium">종목</th>
                <th className="px-4 py-3 font-medium text-center">액션</th>
                <th className="px-4 py-3 font-medium text-right">현재 비중</th>
                <th className="px-4 py-3 font-medium text-right">목표 비중</th>
                <th className="px-4 py-3 font-medium text-right">조정</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {suggestions.map((s) => (
                <tr key={s.ticker} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-3">
                    <div>
                      <p className="font-medium text-slate-900">{s.ticker}</p>
                      <p className="text-xs text-slate-400">{s.name}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {s.action === "buy" && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
                        <ArrowUpCircle className="w-3 h-3" />
                        매수
                      </span>
                    )}
                    {s.action === "sell" && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">
                        <ArrowDownCircle className="w-3 h-3" />
                        매도
                      </span>
                    )}
                    {s.action === "hold" && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600">
                        <MinusCircle className="w-3 h-3" />
                        유지
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right text-slate-700">
                    {s.currentWeight.toFixed(1)}%
                  </td>
                  <td className="px-4 py-3 text-right text-slate-700">
                    {s.targetWeight.toFixed(1)}%
                  </td>
                  <td
                    className={`px-4 py-3 text-right font-medium ${
                      s.adjustmentPercent > 0
                        ? "text-emerald-600"
                        : s.adjustmentPercent < 0
                        ? "text-red-600"
                        : "text-slate-500"
                    }`}
                  >
                    {s.adjustmentPercent > 0 ? "+" : ""}
                    {s.adjustmentPercent.toFixed(1)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
        <Info className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
        <div className="text-sm text-amber-700">
          <p className="font-medium">투자 유의사항</p>
          <p className="mt-0.5">
            이 리밸런싱 제안은 참고 목적으로만 제공됩니다. 실제 투자 판단은 개인의
            투자 목표, 리스크 허용 범위, 시장 상황 등을 종합적으로 고려하여 본인이
            직접 판단하시기 바랍니다. 과거 성과가 미래 수익을 보장하지 않습니다.
          </p>
        </div>
      </div>
    </div>
  );
}
