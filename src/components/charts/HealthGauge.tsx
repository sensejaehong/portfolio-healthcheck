"use client";

import { motion } from "framer-motion";
import type { HealthGrade } from "@/types";

interface HealthGaugeProps {
  score: number;
  grade: HealthGrade;
}

const gradeLabel: Record<HealthGrade, string> = {
  excellent: "우수",
  good: "양호",
  caution: "주의",
  danger: "위험",
};

const gradeColor: Record<HealthGrade, string> = {
  excellent: "#10B981",
  good: "#2563EB",
  caution: "#F59E0B",
  danger: "#EF4444",
};

export default function HealthGauge({ score, grade }: HealthGaugeProps) {
  const clampedScore = Math.max(0, Math.min(100, score));

  // SVG arc parameters for a semicircle
  const cx = 150;
  const cy = 140;
  const r = 110;
  const strokeWidth = 20;

  // Semicircle from left to right (180 degrees)
  const startAngle = Math.PI; // left
  const endAngle = 0; // right
  const circumference = Math.PI * r; // half circle

  const fillLength = (clampedScore / 100) * circumference;

  // Arc path for the background
  const arcPath = `M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`;

  // Gradient stops for red -> yellow -> blue -> green
  const gradientId = "gauge-gradient";

  // Needle position
  const needleAngle = Math.PI - (clampedScore / 100) * Math.PI;
  const needleLength = r - 30;
  const needleX = cx + needleLength * Math.cos(needleAngle);
  const needleY = cy - needleLength * Math.sin(needleAngle);

  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 300 180" className="w-full max-w-xs">
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#EF4444" />
            <stop offset="30%" stopColor="#F59E0B" />
            <stop offset="60%" stopColor="#2563EB" />
            <stop offset="100%" stopColor="#10B981" />
          </linearGradient>
        </defs>

        {/* Background arc */}
        <path
          d={arcPath}
          fill="none"
          stroke="#E2E8F0"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />

        {/* Filled arc */}
        <motion.path
          d={arcPath}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference - fillLength }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />

        {/* Needle */}
        <motion.line
          x1={cx}
          y1={cy}
          x2={needleX}
          y2={needleY}
          stroke="#0F172A"
          strokeWidth={2.5}
          strokeLinecap="round"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        />
        <circle cx={cx} cy={cy} r={5} fill="#0F172A" />

        {/* Score text */}
        <motion.text
          x={cx}
          y={cy - 20}
          textAnchor="middle"
          className="text-4xl font-bold"
          fill="#0F172A"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          {clampedScore}
        </motion.text>

        {/* Scale labels */}
        <text x={cx - r - 5} y={cy + 20} textAnchor="middle" fill="#94A3B8" fontSize="12">
          0
        </text>
        <text x={cx} y={cy - r + 25} textAnchor="middle" fill="#94A3B8" fontSize="12">
          50
        </text>
        <text x={cx + r + 5} y={cy + 20} textAnchor="middle" fill="#94A3B8" fontSize="12">
          100
        </text>
      </svg>

      {/* Grade badge */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.4 }}
        className="flex items-center gap-2 mt-2"
      >
        <span
          className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold text-white"
          style={{ backgroundColor: gradeColor[grade] }}
        >
          {gradeLabel[grade]}
        </span>
        <span className="text-sm text-slate-500">등급</span>
      </motion.div>
    </div>
  );
}
