import type { ReportMetric } from "@/types/rd";

// Dashboard KPI tiles + /app/reports cards. Values are pre-formatted so
// the UI does zero locale math; backend wiring will produce strings in
// the same shape.

export const MOCK_DASHBOARD_METRICS: ReportMetric[] = [
  {
    key: "leads_this_week",
    label: "New leads · 7d",
    value: "47",
    delta: "+18%",
    deltaTone: "success",
    spark: [0.2, 0.35, 0.45, 0.4, 0.6, 0.75, 0.9],
  },
  {
    key: "response_time_avg",
    label: "Avg response",
    value: "38s",
    delta: "−14%",
    deltaTone: "success",
    spark: [0.9, 0.75, 0.7, 0.55, 0.5, 0.4, 0.35],
  },
  {
    key: "showings_booked",
    label: "Showings booked",
    value: "12",
    delta: "+3",
    deltaTone: "success",
    spark: [0.3, 0.4, 0.5, 0.6, 0.55, 0.7, 0.85],
  },
  {
    key: "pipeline_value",
    label: "Pipeline value",
    value: "$4.8M",
    delta: "+$620K",
    deltaTone: "success",
    spark: [0.25, 0.3, 0.5, 0.55, 0.65, 0.7, 0.85],
  },
];

// /app/reports sources-row data
export const MOCK_SOURCE_ROI: { label: string; count: number; pct: number; tone: string }[] = [
  { label: "CREA DDF feed", count: 134, pct: 54, tone: "bg-rd-terra-600" },
  { label: "Website form", count: 61, pct: 25, tone: "bg-rd-navy-500" },
  { label: "Google Ads", count: 32, pct: 13, tone: "bg-rd-navy-700" },
  { label: "Referral", count: 20, pct: 8, tone: "bg-rd-success" },
];
