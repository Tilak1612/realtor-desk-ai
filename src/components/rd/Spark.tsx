import type { SVGProps } from "react";

// Tiny sparkline used by dashboard KPI tiles. Points are normalized 0..1
// per the ReportMetric.spark contract; this component maps them into a
// 90 × 24 viewbox. `direction="down"` flips a descending trend so the
// polyline always reads left-to-right regardless of whether the metric
// is getting better or worse.

interface SparkProps extends Omit<SVGProps<SVGSVGElement>, "points"> {
  points: number[];
  color?: string;
  direction?: "up" | "down";
}

export function Spark({
  points,
  color = "var(--rd-navy-500)",
  direction = "up",
  ...rest
}: SparkProps) {
  const ordered = direction === "down" ? [...points].reverse() : points;
  const step = ordered.length > 1 ? 90 / (ordered.length - 1) : 90;
  const coords = ordered
    .map((p, i) => `${i * step},${24 - p * 22}`)
    .join(" ");
  return (
    <svg
      viewBox="0 0 90 24"
      width="100%"
      height="24"
      fill="none"
      stroke={color}
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...rest}
    >
      <polyline points={coords} />
    </svg>
  );
}
