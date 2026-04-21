"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

interface SectorData {
  name: string;
  weight: number;
  benchmark: number;
}

interface SectorDonutProps {
  sectors: SectorData[];
}

const COLORS = [
  "#2563EB",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
  "#EC4899",
  "#06B6D4",
  "#F97316",
  "#14B8A6",
  "#6366F1",
];

const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ name: string; value: number; payload: SectorData }> }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white border border-slate-200 rounded-lg shadow-lg px-4 py-3 text-sm">
        <p className="font-semibold text-slate-900">{data.name}</p>
        <p className="text-slate-600">
          비중: <span className="font-medium">{data.weight}%</span>
        </p>
        <p className="text-slate-400">
          벤치마크: {data.benchmark}%
        </p>
      </div>
    );
  }
  return null;
};

export default function SectorDonut({ sectors }: SectorDonutProps) {
  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={sectors}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={85}
            paddingAngle={2}
            dataKey="weight"
            nameKey="name"
            strokeWidth={0}
          >
            {sectors.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            formatter={(value: string) => (
              <span className="text-xs text-slate-600">{value}</span>
            )}
            iconSize={8}
            wrapperStyle={{ fontSize: "12px" }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
