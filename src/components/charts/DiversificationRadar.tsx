"use client";

import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

interface RadarMetric {
  subject: string;
  value: number;
  fullMark: number;
}

interface DiversificationRadarProps {
  metrics: RadarMetric[];
}

const defaultMetrics: RadarMetric[] = [
  { subject: "종목수", value: 70, fullMark: 100 },
  { subject: "섹터균형", value: 55, fullMark: 100 },
  { subject: "비중균등", value: 60, fullMark: 100 },
  { subject: "시총분산", value: 80, fullMark: 100 },
  { subject: "상관관계", value: 45, fullMark: 100 },
];

export default function DiversificationRadar({
  metrics = defaultMetrics,
}: DiversificationRadarProps) {
  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={metrics}>
          <PolarGrid stroke="#E2E8F0" />
          <PolarAngleAxis
            dataKey="subject"
            tick={{ fill: "#64748B", fontSize: 12 }}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 100]}
            tick={{ fill: "#94A3B8", fontSize: 10 }}
            tickCount={5}
          />
          <Radar
            name="내 포트폴리오"
            dataKey="value"
            stroke="#2563EB"
            fill="#2563EB"
            fillOpacity={0.2}
            strokeWidth={2}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "white",
              border: "1px solid #E2E8F0",
              borderRadius: "8px",
              fontSize: "13px",
            }}
            formatter={(value) => [`${value}점`, "점수"]}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
