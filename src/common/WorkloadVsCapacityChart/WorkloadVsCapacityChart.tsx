"use client";

import { FC } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
type WorkloadVsCapacityChartProps = {
  data: { name: string; capacity: number; workload: number }[];
  title?: string;
  subtitle?: string;
};

export const WorkloadVsCapacityChart: FC<WorkloadVsCapacityChartProps> = ({
  data,
  title = "Workload vs capacity per team",
  subtitle,
}) => {
  if (!data || data.length === 0) return null;

  return (
    <div
      className="min-w-0 rounded-lg border border-border-subtle bg-background p-4 shadow-sm"
      data-testid="workload-vs-capacity-chart"
    >
      <h2 className="text-sm font-semibold uppercase tracking-wide opacity-70">
        {title}
      </h2>
      {subtitle ? <p className="mb-2 text-xs opacity-70">{subtitle}</p> : null}
      <div className="h-64 min-w-0">
        <ResponsiveContainer width="100%" height={240}>
          <BarChart
            data={data}
            margin={{ top: 8, right: 8, bottom: 0, left: 0 }}
          >
            <XAxis
              dataKey="name"
              tickLine={false}
              axisLine={false}
              fontSize={12}
            />
            <YAxis tickLine={false} axisLine={false} fontSize={12} />
            <Tooltip
              cursor={{ fill: "var(--accent-soft)", opacity: 0.25 }}
              contentStyle={{
                fontSize: 12,
                backgroundColor: "var(--background)",
                borderColor: "var(--border-subtle)",
                color: "var(--foreground)",
              }}
              labelStyle={{
                color: "var(--foreground)",
                fontSize: 12,
              }}
              itemStyle={{
                color: "var(--foreground)",
              }}
            />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="capacity" fill="var(--accent-soft)" />
            <Bar dataKey="workload" fill="var(--accent)" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
