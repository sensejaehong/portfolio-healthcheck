"use client";

import { useState, useMemo } from "react";
import { Users, Info } from "lucide-react";
import type { InvestorStrategy } from "@/types";
import InvestorCard from "@/components/ui/InvestorCard";
import SectorDonut from "@/components/charts/SectorDonut";

const INVESTOR_EMOJIS: Record<string, string> = {
  buffett: "\uD83C\uDFA9",
  druckenmiller: "\uD83D\uDCCA",
  marks: "\uD83D\uDEE1\uFE0F",
  dalio: "\u2696\uFE0F",
  lynch: "\uD83D\uDD0D",
  soros: "\uD83C\uDF0A",
  wood: "\uD83D\uDE80",
};

const MOCK_STRATEGIES: InvestorStrategy[] = [
  {
    id: "buffett",
    name: "Warren Buffett",
    nameKo: "워런 버핏",
    philosophy: "Value investing with a focus on quality businesses at fair prices.",
    philosophyKo:
      "훌륭한 기업을 적정 가격에 매수하여 장기 보유하는 가치투자 철학. 경제적 해자(moat)를 가진 기업을 선호합니다.",
    riskLevel: "conservative",
    concentrationStyle: "concentrated",
    sectorAllocation: {
      기술: { min: 10, max: 40, target: 25 },
      금융: { min: 20, max: 50, target: 35 },
      소비재: { min: 10, max: 30, target: 20 },
      헬스케어: { min: 5, max: 15, target: 10 },
      에너지: { min: 5, max: 15, target: 10 },
    },
    metrics: {
      preferredPER: { min: 5, max: 20 },
      preferredPBR: { min: 0.5, max: 3 },
      minROE: 15,
      minDividendYield: 1.5,
      maxDebtToEquity: 0.5,
    },
    cashRatio: { min: 5, max: 25 },
    maxSinglePosition: 40,
    topHoldingsCount: 5,
    keyCharacteristics: ["Economic moat", "Long-term holding", "Margin of safety", "Quality over quantity"],
    keyCharacteristicsKo: ["경제적 해자", "장기 보유", "안전마진", "질적 투자"],
  },
  {
    id: "druckenmiller",
    name: "Stanley Druckenmiller",
    nameKo: "스탠리 드러켄밀러",
    philosophy: "Top-down macro approach with aggressive position sizing.",
    philosophyKo:
      "거시경제 분석을 바탕으로 대규모 베팅을 하는 탑다운 투자. 확신이 있을 때 공격적으로 집중합니다.",
    riskLevel: "aggressive",
    concentrationStyle: "concentrated",
    sectorAllocation: {
      기술: { min: 20, max: 60, target: 40 },
      금융: { min: 5, max: 30, target: 15 },
      소비재: { min: 5, max: 25, target: 15 },
      에너지: { min: 5, max: 30, target: 15 },
      산업재: { min: 5, max: 25, target: 15 },
    },
    metrics: {
      preferredPER: { min: 5, max: 40 },
    },
    cashRatio: { min: 0, max: 50 },
    maxSinglePosition: 30,
    topHoldingsCount: 10,
    keyCharacteristics: ["Macro-driven", "High conviction bets", "Flexible allocation", "Momentum"],
    keyCharacteristicsKo: ["거시경제 분석", "높은 확신 베팅", "유연한 배분", "모멘텀"],
  },
  {
    id: "marks",
    name: "Howard Marks",
    nameKo: "하워드 막스",
    philosophy: "Risk-aware value investing focused on market cycles.",
    philosophyKo:
      "시장 사이클을 중시하며 위험 관리에 집중하는 가치투자. 남들이 두려워할 때 탐욕적이 되라는 역발상 투자입니다.",
    riskLevel: "conservative",
    concentrationStyle: "balanced",
    sectorAllocation: {
      금융: { min: 15, max: 35, target: 25 },
      기술: { min: 10, max: 25, target: 15 },
      소비재: { min: 10, max: 25, target: 20 },
      헬스케어: { min: 10, max: 25, target: 20 },
      산업재: { min: 10, max: 25, target: 20 },
    },
    metrics: {
      preferredPER: { min: 3, max: 15 },
      preferredPBR: { min: 0.3, max: 1.5 },
      maxDebtToEquity: 0.4,
    },
    cashRatio: { min: 10, max: 40 },
    maxSinglePosition: 15,
    topHoldingsCount: 15,
    keyCharacteristics: ["Cycle awareness", "Risk control", "Contrarian", "Defensive"],
    keyCharacteristicsKo: ["사이클 분석", "리스크 관리", "역발상 투자", "방어적 전략"],
  },
  {
    id: "dalio",
    name: "Ray Dalio",
    nameKo: "레이 달리오",
    philosophy: "All-weather diversification through uncorrelated assets.",
    philosophyKo:
      "어떤 경제 환경에서도 안정적인 수익을 추구하는 올웨더 전략. 자산 간 상관관계를 최소화하여 리스크를 분산합니다.",
    riskLevel: "moderate",
    concentrationStyle: "diversified",
    sectorAllocation: {
      기술: { min: 10, max: 25, target: 18 },
      금융: { min: 10, max: 25, target: 18 },
      소비재: { min: 10, max: 25, target: 18 },
      헬스케어: { min: 10, max: 25, target: 18 },
      유틸리티: { min: 5, max: 20, target: 14 },
      에너지: { min: 5, max: 20, target: 14 },
    },
    metrics: {},
    cashRatio: { min: 5, max: 15 },
    maxSinglePosition: 10,
    topHoldingsCount: 20,
    keyCharacteristics: ["Diversification", "Risk parity", "Uncorrelated assets", "All-weather"],
    keyCharacteristicsKo: ["극대 분산", "리스크 패리티", "비상관 자산", "올웨더 전략"],
  },
  {
    id: "lynch",
    name: "Peter Lynch",
    nameKo: "피터 린치",
    philosophy: "Invest in what you know; find growth at reasonable prices.",
    philosophyKo:
      "자신이 아는 기업에 투자하라는 GARP(성장+가치) 전략. 일상에서 발견하는 투자 아이디어를 중시합니다.",
    riskLevel: "moderate",
    concentrationStyle: "diversified",
    sectorAllocation: {
      소비재: { min: 20, max: 40, target: 30 },
      기술: { min: 15, max: 30, target: 20 },
      헬스케어: { min: 10, max: 25, target: 18 },
      금융: { min: 5, max: 20, target: 12 },
      산업재: { min: 10, max: 25, target: 20 },
    },
    metrics: {
      preferredPER: { min: 8, max: 25 },
      minROE: 12,
    },
    cashRatio: { min: 2, max: 10 },
    maxSinglePosition: 8,
    topHoldingsCount: 30,
    keyCharacteristics: ["GARP", "Consumer focus", "Bottom-up", "High diversification"],
    keyCharacteristicsKo: ["GARP 전략", "소비자 관점", "바텀업 분석", "고분산"],
  },
  {
    id: "soros",
    name: "George Soros",
    nameKo: "조지 소로스",
    philosophy: "Reflexivity theory; exploit market inefficiencies and mispricing.",
    philosophyKo:
      "시장의 비효율성과 반사성 이론을 활용하는 투기적 투자. 거시경제 변곡점에서 대규모 포지션을 취합니다.",
    riskLevel: "aggressive",
    concentrationStyle: "concentrated",
    sectorAllocation: {
      기술: { min: 15, max: 50, target: 30 },
      금융: { min: 10, max: 40, target: 25 },
      에너지: { min: 5, max: 30, target: 15 },
      산업재: { min: 5, max: 25, target: 15 },
      소비재: { min: 5, max: 25, target: 15 },
    },
    metrics: {},
    cashRatio: { min: 0, max: 60 },
    maxSinglePosition: 35,
    topHoldingsCount: 8,
    keyCharacteristics: ["Reflexivity", "Macro bets", "Aggressive sizing", "Short selling"],
    keyCharacteristicsKo: ["반사성 이론", "매크로 베팅", "공격적 비중", "공매도 활용"],
  },
  {
    id: "wood",
    name: "Cathie Wood",
    nameKo: "캐시 우드",
    philosophy: "Disruptive innovation investing with a 5-year horizon.",
    philosophyKo:
      "5년 이상의 장기 시계로 파괴적 혁신 기업에 집중투자. AI, 로봇, 유전체학, 에너지 저장, 블록체인 등 혁신 테마를 추구합니다.",
    riskLevel: "aggressive",
    concentrationStyle: "concentrated",
    sectorAllocation: {
      기술: { min: 40, max: 80, target: 60 },
      헬스케어: { min: 10, max: 30, target: 20 },
      산업재: { min: 5, max: 20, target: 10 },
      금융: { min: 0, max: 15, target: 5 },
      통신: { min: 0, max: 10, target: 5 },
    },
    metrics: {},
    cashRatio: { min: 0, max: 10 },
    maxSinglePosition: 15,
    topHoldingsCount: 10,
    keyCharacteristics: ["Disruptive innovation", "High growth", "5-year horizon", "Thematic investing"],
    keyCharacteristicsKo: ["파괴적 혁신", "고성장", "5년 투자 시계", "테마 투자"],
  },
];

const MOCK_SIMILARITIES: Record<string, number> = {
  buffett: 45,
  druckenmiller: 62,
  marks: 38,
  dalio: 55,
  lynch: 48,
  soros: 58,
  wood: 71,
};

// User mock sector data for comparison
const USER_SECTORS = [
  { name: "기술", weight: 62.3 },
  { name: "금융", weight: 18.5 },
  { name: "헬스케어", weight: 12.2 },
  { name: "소비재", weight: 4.0 },
  { name: "에너지", weight: 3.0 },
];

export default function StrategiesPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selectedStrategy = useMemo(
    () => MOCK_STRATEGIES.find((s) => s.id === selectedId),
    [selectedId]
  );

  const strategySectorData = useMemo(() => {
    if (!selectedStrategy) return [];
    return Object.entries(selectedStrategy.sectorAllocation).map(
      ([name, alloc]) => ({
        name,
        weight: alloc.target,
        benchmark: alloc.target,
      })
    );
  }, [selectedStrategy]);

  const userSectorDonutData = USER_SECTORS.map((s) => ({
    ...s,
    benchmark: 15,
  }));

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">투자자 전략 비교</h1>
        <p className="text-slate-500 mt-1">
          전설적 투자자들의 전략과 내 포트폴리오를 비교해 보세요
        </p>
      </div>

      {/* Info banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
        <Info className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
        <div className="text-sm text-blue-700">
          <p className="font-medium">유사도 점수란?</p>
          <p className="mt-0.5">
            내 포트폴리오의 섹터 배분, 집중도, 리스크 수준을 각 투자자의 전략과
            비교하여 0~100%로 산출합니다. 높을수록 해당 투자자의 스타일에
            가깝습니다.
          </p>
        </div>
      </div>

      {/* Investor cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {MOCK_STRATEGIES.map((strategy) => (
          <InvestorCard
            key={strategy.id}
            strategy={strategy}
            emoji={INVESTOR_EMOJIS[strategy.id] || "\uD83D\uDC64"}
            similarityScore={MOCK_SIMILARITIES[strategy.id] || 0}
            isSelected={selectedId === strategy.id}
            onClick={() =>
              setSelectedId(selectedId === strategy.id ? null : strategy.id)
            }
          />
        ))}
      </div>

      {/* Detailed comparison */}
      {selectedStrategy && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 animate-fade-in-up">
          <div className="flex items-center gap-3 mb-6">
            <Users className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-slate-900">
              섹터 배분 비교: 내 포트폴리오 vs{" "}
              {selectedStrategy.nameKo}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* User portfolio */}
            <div>
              <h3 className="text-sm font-medium text-slate-500 text-center mb-2">
                내 포트폴리오
              </h3>
              <SectorDonut sectors={userSectorDonutData} />
            </div>

            {/* Strategy target */}
            <div>
              <h3 className="text-sm font-medium text-slate-500 text-center mb-2">
                {selectedStrategy.nameKo} 목표 배분
              </h3>
              <SectorDonut sectors={strategySectorData} />
            </div>
          </div>

          {/* Comparison table */}
          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500">
                  <th className="text-left py-2 font-medium">섹터</th>
                  <th className="text-right py-2 font-medium">내 비중</th>
                  <th className="text-right py-2 font-medium">
                    {selectedStrategy.nameKo} 목표
                  </th>
                  <th className="text-right py-2 font-medium">차이</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {Object.entries(selectedStrategy.sectorAllocation).map(
                  ([sector, alloc]) => {
                    const userWeight =
                      USER_SECTORS.find((s) => s.name === sector)?.weight || 0;
                    const diff = userWeight - alloc.target;
                    return (
                      <tr key={sector}>
                        <td className="py-2 text-slate-700">{sector}</td>
                        <td className="py-2 text-right text-slate-700">
                          {userWeight.toFixed(1)}%
                        </td>
                        <td className="py-2 text-right text-slate-700">
                          {alloc.target}%
                        </td>
                        <td
                          className={`py-2 text-right font-medium ${
                            Math.abs(diff) > 10
                              ? "text-red-500"
                              : Math.abs(diff) > 5
                              ? "text-amber-500"
                              : "text-emerald-500"
                          }`}
                        >
                          {diff > 0 ? "+" : ""}
                          {diff.toFixed(1)}%
                        </td>
                      </tr>
                    );
                  }
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
