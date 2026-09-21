import { FC } from "react";

type MetricCardProps = {
  label: string;
  value: number;
  helperText: string;
};

export const MetricCard: FC<MetricCardProps> = ({
  label,
  value,
  helperText,
}) => {
  return (
    <div
      className="rounded-lg border border-border-subtle bg-background p-4 shadow-lg"
      data-testid="metric-card"
    >
      <p className="text-xs font-medium uppercase tracking-wide opacity-70">
        {label}
      </p>
      <p className="mt-2 text-2xl font-semibold">{value}</p>
      <p className="mt-1 text-xs opacity-70">{helperText}</p>
    </div>
  );
};
