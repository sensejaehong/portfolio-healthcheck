"use client";

import { motion } from "framer-motion";
import type { InvestorStrategy, RiskLevel } from "@/types";

interface InvestorCardProps {
  strategy: InvestorStrategy;
  emoji: string;
  similarityScore: number;
  isSelected: boolean;
  onClick: () => void;
}

const riskBadge: Record<RiskLevel, { label: string; className: string }> = {
  conservative: {
    label: "보수적",
    className: "bg-blue-100 text-blue-700",
  },
  moderate: {
    label: "중립적",
    className: "bg-amber-100 text-amber-700",
  },
  aggressive: {
    label: "공격적",
    className: "bg-red-100 text-red-700",
  },
};

export default function InvestorCard({
  strategy,
  emoji,
  similarityScore,
  isSelected,
  onClick,
}: InvestorCardProps) {
  const badge = riskBadge[strategy.riskLevel];

  return (
    <motion.div
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`cursor-pointer rounded-xl border-2 p-5 transition-all ${
        isSelected
          ? "border-blue-500 bg-blue-50 shadow-lg shadow-blue-500/10"
          : "border-slate-200 bg-white hover:border-blue-200 hover:shadow-md"
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{emoji}</span>
          <div>
            <h3 className="font-bold text-slate-900">{strategy.nameKo}</h3>
            <p className="text-xs text-slate-400">{strategy.name}</p>
          </div>
        </div>
        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${badge.className}`}>
          {badge.label}
        </span>
      </div>

      {/* Philosophy */}
      <p className="text-sm text-slate-600 leading-relaxed mb-4 line-clamp-2">
        {strategy.philosophyKo}
      </p>

      {/* Similarity score */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{
              backgroundColor:
                similarityScore >= 70
                  ? "#10B981"
                  : similarityScore >= 40
                  ? "#F59E0B"
                  : "#EF4444",
            }}
            initial={{ width: 0 }}
            animate={{ width: `${similarityScore}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>
        <span className="text-sm font-semibold text-slate-700 w-12 text-right">
          {similarityScore}%
        </span>
      </div>
      <p className="text-xs text-slate-400 mt-1">유사도</p>

      {/* Expanded details */}
      {isSelected && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ duration: 0.3 }}
          className="mt-4 pt-4 border-t border-slate-200 space-y-3"
        >
          <div>
            <p className="text-xs font-medium text-slate-500 mb-1.5">
              핵심 특성
            </p>
            <div className="flex flex-wrap gap-1.5">
              {strategy.keyCharacteristicsKo.map((char, i) => (
                <span
                  key={i}
                  className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-slate-100 text-slate-600"
                >
                  {char}
                </span>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-slate-50 rounded-lg p-2">
              <p className="text-slate-400">최대 단일 비중</p>
              <p className="font-semibold text-slate-700">
                {strategy.maxSinglePosition}%
              </p>
            </div>
            <div className="bg-slate-50 rounded-lg p-2">
              <p className="text-slate-400">핵심 종목 수</p>
              <p className="font-semibold text-slate-700">
                {strategy.topHoldingsCount}개
              </p>
            </div>
            <div className="bg-slate-50 rounded-lg p-2">
              <p className="text-slate-400">현금 비중</p>
              <p className="font-semibold text-slate-700">
                {strategy.cashRatio.min}~{strategy.cashRatio.max}%
              </p>
            </div>
            <div className="bg-slate-50 rounded-lg p-2">
              <p className="text-slate-400">집중도</p>
              <p className="font-semibold text-slate-700">
                {strategy.concentrationStyle === "concentrated"
                  ? "집중투자"
                  : strategy.concentrationStyle === "balanced"
                  ? "균형투자"
                  : "분산투자"}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
