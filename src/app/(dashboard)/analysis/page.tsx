"use client";

import {
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  Shield,
  Info,
  BarChart3,
} from "lucide-react";
import type { AnalysisResult } from "@/types";
import HealthGauge from "@/components/charts/HealthGauge";
import SectorDonut from "@/components/charts/SectorDonut";
import DiversificationRadar from "@/components/charts/DiversificationRadar";

const MOCK_ANALYSIS: AnalysisResult = {
  healthScore: 72,
  healthGrade: "good",
  diversification: {
    hhi: 1850,
    topNConcentration: { n: 3, percentage: 68.5 },
    stockCount: 5,
    interpretation:
      "상위 3종목에 68.5%가 집중되어 있습니다. HHI 1850으로 중간 수준의 집중도를 보입니다. 종목 수를 늘리거나 비중을 분산하면 리스크를 줄일 수 있습니다.",
  },
  sectorBalance: {
    sectors: [
      { name: "기술", weight: 62.3, benchmark: 28.0, deviation: 34.3 },
      { name: "금융", weight: 18.5, benchmark: 13.0, deviation: 5.5 },
      { name: "헬스케어", weight: 12.2, benchmark: 13.5, deviation: -1.3 },
      { name: "소비재", weight: 4.0, benchmark: 10.0, deviation: -6.0 },
      { name: "에너지", weight: 3.0, benchmark: 5.0, deviation: -2.0 },
    ],
    totalDeviation: 49.1,
    interpretation:
      "기술 섹터에 62.3%가 집중되어 벤치마크(28%) 대비 크게 초과합니다. 섹터 편중이 심해 특정 산업 리스크에 취약할 수 있습니다.",
  },
  risk: {
    annualVolatility: 22.5,
    beta: 1.15,
    maxDrawdown: -18.3,
    sharpeRatio: 0.85,
    interpretation:
      "연간 변동성 22.5%로 시장 평균보다 약간 높으며, 베타 1.15로 시장 대비 약간 공격적인 포트폴리오입니다. 샤프비율 0.85는 양호한 수준입니다.",
  },
  rebalancing: null,
  analyzedAt: new Date().toISOString(),
};

const radarMetrics = [
  { subject: "종목수", value: 45, fullMark: 100 },
  { subject: "섹터균형", value: 35, fullMark: 100 },
  { subject: "비중균등", value: 50, fullMark: 100 },
  { subject: "시총분산", value: 75, fullMark: 100 },
  { subject: "상관관계", value: 55, fullMark: 100 },
];

export default function AnalysisPage() {
  const analysis = MOCK_ANALYSIS;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">포트폴리오 분석</h1>
        <p className="text-slate-500 mt-1">
          AI가 분석한 포트폴리오 건강 진단 결과입니다
        </p>
      </div>

      {/* Health Score + Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Health Score Gauge */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-5 h-5 text-blue-600" />
            <h2 className="font-semibold text-slate-900">헬스 스코어</h2>
          </div>
          <HealthGauge score={analysis.healthScore} grade={analysis.healthGrade} />
          <div className="mt-4 p-3 bg-slate-50 rounded-lg">
            <p className="text-sm text-slate-600 leading-relaxed">
              종합 건강 점수 <span className="font-bold">{analysis.healthScore}점</span>으로{" "}
              <span className="font-bold text-blue-600">양호</span> 등급입니다.
              분산투자 수준을 높이고 섹터 편중을 줄이면 더 높은 점수를 달성할 수
              있습니다.
            </p>
          </div>
        </div>

        {/* Diversification Radar */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            <h2 className="font-semibold text-slate-900">분산투자 분석</h2>
          </div>
          <DiversificationRadar metrics={radarMetrics} />
          <div className="mt-2 p-3 bg-slate-50 rounded-lg">
            <p className="text-sm text-slate-600 leading-relaxed">
              {analysis.diversification.interpretation}
            </p>
          </div>
        </div>
      </div>

      {/* Sector + Risk */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sector distribution */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="font-semibold text-slate-900 mb-4">섹터 분포</h2>
          <SectorDonut sectors={analysis.sectorBalance.sectors} />
          <div className="mt-4 space-y-2">
            {analysis.sectorBalance.sectors.map((s) => (
              <div key={s.name} className="flex items-center justify-between text-sm">
                <span className="text-slate-600">{s.name}</span>
                <div className="flex items-center gap-3">
                  <span className="font-medium text-slate-900">{s.weight}%</span>
                  <span
                    className={`text-xs font-medium ${
                      s.deviation > 5
                        ? "text-red-500"
                        : s.deviation < -5
                        ? "text-amber-500"
                        : "text-emerald-500"
                    }`}
                  >
                    {s.deviation > 0 ? "+" : ""}
                    {s.deviation.toFixed(1)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 bg-amber-50 rounded-lg flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-amber-700">
              {analysis.sectorBalance.interpretation}
            </p>
          </div>
        </div>

        {/* Risk metrics */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="font-semibold text-slate-900 mb-4">리스크 지표</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-slate-400" />
                <p className="text-xs text-slate-500">연간 변동성</p>
              </div>
              <p className="text-2xl font-bold text-slate-900">
                {analysis.risk.annualVolatility}%
              </p>
              <p className="text-xs text-slate-400 mt-1">
                시장 평균 약 18~20%
              </p>
            </div>
            <div className="bg-slate-50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 className="w-4 h-4 text-slate-400" />
                <p className="text-xs text-slate-500">베타</p>
              </div>
              <p className="text-2xl font-bold text-slate-900">
                {analysis.risk.beta}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                1.0 = 시장과 동일
              </p>
            </div>
            <div className="bg-slate-50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingDown className="w-4 h-4 text-red-400" />
                <p className="text-xs text-slate-500">최대 낙폭 (MDD)</p>
              </div>
              <p className="text-2xl font-bold text-red-600">
                {analysis.risk.maxDrawdown}%
              </p>
              <p className="text-xs text-slate-400 mt-1">
                최악의 하락 시나리오
              </p>
            </div>
            <div className="bg-slate-50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-4 h-4 text-emerald-400" />
                <p className="text-xs text-slate-500">샤프 비율</p>
              </div>
              <p className="text-2xl font-bold text-emerald-600">
                {analysis.risk.sharpeRatio}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                1.0 이상이면 우수
              </p>
            </div>
          </div>
          <div className="mt-4 p-3 bg-blue-50 rounded-lg flex items-start gap-2">
            <Info className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-blue-700">
              {analysis.risk.interpretation}
            </p>
          </div>
        </div>
      </div>

      {/* Risk Glossary */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="font-semibold text-slate-900 mb-4">
          용어 설명
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="flex gap-3">
            <div className="w-1 bg-blue-500 rounded-full flex-shrink-0" />
            <div>
              <p className="font-medium text-slate-900">HHI (허핀달-허쉬만 지수)</p>
              <p className="text-slate-500">
                시장 집중도를 측정하는 지표. 0~10,000 범위로 낮을수록 분산이 잘
                되어 있습니다. 1,500 미만이면 분산형, 2,500 이상이면 집중형으로
                봅니다.
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="w-1 bg-emerald-500 rounded-full flex-shrink-0" />
            <div>
              <p className="font-medium text-slate-900">샤프 비율 (Sharpe Ratio)</p>
              <p className="text-slate-500">
                위험 대비 수익률을 측정합니다. 높을수록 같은 위험에서 더 많은
                수익을 얻는다는 의미입니다. 1.0 이상이면 양호합니다.
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="w-1 bg-amber-500 rounded-full flex-shrink-0" />
            <div>
              <p className="font-medium text-slate-900">베타 (Beta)</p>
              <p className="text-slate-500">
                시장 대비 변동성을 나타냅니다. 1.0이면 시장과 동일하게 움직이고,
                1 초과면 시장보다 변동성이 큽니다.
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="w-1 bg-red-500 rounded-full flex-shrink-0" />
            <div>
              <p className="font-medium text-slate-900">MDD (최대 낙폭)</p>
              <p className="text-slate-500">
                고점에서 저점까지의 최대 하락 폭입니다. 과거 데이터 기반으로
                최악의 시나리오에서의 손실 규모를 나타냅니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
