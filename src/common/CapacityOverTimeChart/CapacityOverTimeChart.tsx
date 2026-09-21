"use client";

import { FC } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import type { CapacitySnapshot } from "../../lib/domain/types";

type CapacityOverTimeChartProps = {
  data: CapacitySnapshot[];
  title?: string;
  subtitle?: string;
};

export const CapacityOverTimeChart: FC<CapacityOverTimeChartProps> = ({
  data,
  title = "Capacity over time",
  subtitle,
}) => {
  if (!data || data.length === 0) return null;

  return (
    <div
      className="min-w-0 rounded-lg border border-border-subtle bg-background p-4 shadow-sm"
      data-testid="capacity-over-time-chart"
    >
      <h2 className="text-sm font-semibold uppercase tracking-wide opacity-70">
        {title}
      </h2>
      {subtitle ? <p className="mb-2 text-xs opacity-70">{subtitle}</p> : null}
      <div className="h-64 min-w-0">
        <ResponsiveContainer width="100%" height={240}>
          <LineChart
            data={data}
            margin={{ top: 8, right: 8, bottom: 0, left: 0 }}
          >
            <XAxis
              dataKey="sprintName"
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
            <Line
              type="monotone"
              dataKey="capacity"
              stroke="var(--accent)"
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="workload"
              stroke="#f97316"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
