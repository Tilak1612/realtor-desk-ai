import { useState } from "react";
import { Link } from "react-router-dom";
import { AppShell } from "@/components/rd/layout/AppShell";
import {
  RDButton,
  RDBadge,
  RDStatCard,
  RDCard,
  Spark,
  IconCalendar,
  IconPlus,
  IconSparkles,
  IconDot,
  IconArrow,
  IconChevron,
  IconShield,
} from "@/components/rd";
import { cn } from "@/lib/utils";
import { MOCK_DASHBOARD_METRICS } from "@/data/rd";

// /app — Dashboard page per rd-app.jsx Artboard_Dashboard.
// Mock data drives every surface for Phase 3; backend wiring swaps the
// MOCK_* imports for real Supabase hooks in a later phase.

export default function Dashboard() {
  return (
    <AppShell>
      <div className="p-7 pb-10">
        <Greeting />
        <KPIRow />
        <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-4 mt-5">
          <AIActivityCard />
          <TodayCard />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-5">
          <PipelineSnapshotCard />
          <LeadSourcesCard />
          <ComplianceCard />
        </div>
      </div>
    </AppShell>
  );
}

/* ────────────────────────────────────────────────────────── */

function Greeting() {
  const today = new Date().toLocaleDateString("en-CA", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
  return (
    <div className="flex flex-wrap justify-between items-end gap-4 mb-6">
      <div>
        <div className="text-[13px] text-rd-terra-700 font-semibold tracking-[0.02em]">
          {today}
        </div>
        <h1 className="text-[28px] lg:text-[32px] font-semibold tracking-[-0.02em] mt-1">
          Good morning, Sarah.{" "}
          <span className="font-rd-serif italic font-normal text-rd-ink-500">
            Desk worked overnight.
          </span>
        </h1>
      </div>
      <div className="flex flex-wrap gap-2.5">
        <RDButton variant="outline" size="sm" icon={<IconCalendar />}>
          This week
        </RDButton>
        <RDButton variant="primary" size="sm" icon={<IconPlus />}>
          New lead
        </RDButton>
      </div>
    </div>
  );
}

function KPIRow() {
  const SPARK_COLOURS: Record<string, string> = {
    leads_this_week: "var(--rd-navy-500)",
    response_time_avg: "var(--rd-success)",
    showings_booked: "var(--rd-terra-600)",
    pipeline_value: "var(--rd-navy-500)",
  };
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {MOCK_DASHBOARD_METRICS.map((m) => (
        <RDStatCard
          key={m.key}
          label={m.label}
          value={m.value}
          delta={m.delta}
          deltaTone={m.deltaTone ?? "success"}
          sparkline={
            m.spark && (
              <Spark
                points={m.spark}
                color={SPARK_COLOURS[m.key] ?? "var(--rd-navy-500)"}
                direction={m.key === "response_time_avg" ? "down" : "up"}
              />
            )
          }
        />
      ))}
    </div>
  );
}

/* ────────────────────────────────────────────────────────── */

type ActivityBadge = { tone: "terra" | "navy" | "neutral"; label: string };

interface AIEventRow {
  time: string;
  who: string;
  action: string;
  subject: string;
  detail: string;
  lang?: "FR";
  badge: ActivityBadge;
}

const AI_EVENTS: AIEventRow[] = [
  {
    time: "7:52 AM",
    who: "Émilie Tremblay",
    action: "asked about",
    subject: "Le Plateau · $680K",
    detail: "Booked showing tonight 7pm. Replied in French. Pre-approval mentioned.",
    lang: "FR",
    badge: { tone: "terra", label: "Hot · 92" },
  },
  {
    time: "6:14 AM",
    who: "Hassan Ahmed",
    action: "requested",
    subject: "Mississauga 3BR detached",
    detail: "Sent 3 similar listings within 10-min radius. Asked about school catchment.",
    badge: { tone: "navy", label: "Warm · 74" },
  },
  {
    time: "3:08 AM",
    who: "Chen Wei",
    action: "replied to drip on",
    subject: "Richmond BC townhomes",
    detail: "Confirmed budget up to $1.1M CAD. Flagged for your follow-up call.",
    badge: { tone: "terra", label: "Hot · 88" },
  },
  {
    time: "1:42 AM",
    who: "Anonymous visitor",
    action: "inquired via form",
    subject: "34 Dovercourt Rd",
    detail: "Didn't leave phone. AI offered call-back slot. No response yet.",
    badge: { tone: "neutral", label: "Cold · 31" },
  },
  {
    time: "12:11 AM",
    who: "Olivia Kenner",
    action: "asked price on",
    subject: "Leslieville semi",
    detail: "AI shared last comparable sale ($1.34M, 22 Queen E). Scheduled follow-up Thursday.",
    badge: { tone: "navy", label: "Warm · 68" },
  },
];

function AIActivityCard() {
  const [filter, setFilter] = useState<"all" | "responses" | "showings">("all");
  return (
    <RDCard padding={0} className="overflow-hidden">
      <div className="px-6 py-5 border-b border-rd-line flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-rd-sm bg-rd-terra-600 text-white flex items-center justify-center">
            <IconSparkles />
          </div>
          <h3 className="text-base font-semibold">Desk AI activity</h3>
          <RDBadge tone="success" size="sm">
            <IconDot />
            Live
          </RDBadge>
        </div>
        <div className="flex gap-1.5">
          {(["all", "responses", "showings"] as const).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={cn(
                "px-2.5 py-[5px] text-[11px] font-semibold rounded-rd-pill border transition-colors capitalize",
                filter === f
                  ? "bg-rd-navy-800 text-white border-rd-navy-800"
                  : "bg-transparent text-rd-ink-600 border-rd-line"
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </div>
      <div className="py-2">
        {AI_EVENTS.map((e, i) => (
          <AIEvent key={i} {...e} />
        ))}
      </div>
      <div className="px-6 py-3 border-t border-rd-line bg-rd-ink-50 flex items-center justify-between">
        <span className="text-xs text-rd-ink-600">12 more events since midnight</span>
        <RDButton variant="ghost" size="sm" trailingIcon={<IconArrow />}>
          Open activity log
        </RDButton>
      </div>
    </RDCard>
  );
}

function AIEvent({ time, who, action, subject, detail, lang, badge }: AIEventRow) {
  return (
    <div className="grid grid-cols-[60px_24px_1fr_auto] gap-3.5 px-6 py-3 items-start">
      <div className="text-[11px] text-rd-ink-500 font-semibold tabular-nums tracking-[0.03em] pt-0.5">
        {time}
      </div>
      <div className="flex flex-col items-center pt-1.5">
        <div className="w-2 h-2 rounded-full bg-rd-terra-600" />
      </div>
      <div>
        <div className="text-[13px]">
          <span className="font-semibold">{who}</span>
          <span className="text-rd-ink-500"> {action} </span>
          <span className="font-medium">{subject}</span>
          {lang && (
            <span className="ml-2 text-[10px] font-bold tracking-[0.08em] bg-rd-terra-100 text-rd-terra-800 rounded-[4px] px-1.5 py-[1px]">
              {lang}
            </span>
          )}
        </div>
        <div className="text-xs text-rd-ink-500 mt-0.5 leading-[1.5]">{detail}</div>
      </div>
      <RDBadge tone={badge.tone} size="sm">
        {badge.label}
      </RDBadge>
    </div>
  );
}

/* ────────────────────────────────────────────────────────── */

const TODAY_ITEMS: { time: string; kind: string; title: string; note: string; tone: "terra" | "navy" | "neutral" }[] = [
  { time: "9:30 AM", kind: "Call", title: "Priya Shah", note: "Pre-approval walkthrough", tone: "terra" },
  { time: "11:00 AM", kind: "Showing", title: "34 Dovercourt Rd", note: "with Olivia Kenner", tone: "navy" },
  { time: "1:15 PM", kind: "Team", title: "Weekly stand-up", note: "Zoom · 30 min", tone: "neutral" },
  { time: "4:00 PM", kind: "Showing", title: "Le Plateau condo", note: "with Émilie Tremblay · FR", tone: "terra" },
  { time: "7:00 PM", kind: "Open house", title: "22 Westwood Pl.", note: "Oakville · 2 co-hosts", tone: "navy" },
];

function TodayCard() {
  const TONE: Record<string, string> = {
    terra: "border-rd-terra-600 text-rd-terra-700",
    navy: "border-rd-navy-500 text-rd-navy-700",
    neutral: "border-rd-ink-400 text-rd-ink-600",
  };
  return (
    <RDCard padding={0} className="overflow-hidden">
      <div className="px-6 py-5 border-b border-rd-line flex items-center justify-between">
        <h3 className="text-base font-semibold">Today</h3>
        <IconChevron className="text-rd-ink-500" />
      </div>
      <div className="px-6 py-4 flex flex-col gap-3.5">
        {TODAY_ITEMS.map((t, i) => (
          <div key={i} className="grid grid-cols-[56px_1fr] gap-3 items-start">
            <div className="text-[11px] font-bold text-rd-ink-500 tabular-nums pt-1">{t.time}</div>
            <div className={`border-l-2 pl-3 ${TONE[t.tone].split(" ")[0]}`}>
              <span
                className={`text-[10px] font-bold uppercase tracking-[0.06em] ${
                  TONE[t.tone].split(" ")[1]
                }`}
              >
                {t.kind}
              </span>
              <div className="text-[13px] font-semibold mt-0.5">{t.title}</div>
              <div className="text-xs text-rd-ink-500 mt-0.5">{t.note}</div>
            </div>
          </div>
        ))}
      </div>
    </RDCard>
  );
}

/* ────────────────────────────────────────────────────────── */

function PipelineSnapshotCard() {
  const stages: { label: string; count: number; value: string; tone: string }[] = [
    { label: "New leads", count: 24, value: "$1.2M", tone: "bg-rd-terra-600" },
    { label: "Contacted", count: 18, value: "$1.8M", tone: "bg-rd-navy-500" },
    { label: "Showing booked", count: 9, value: "$1.1M", tone: "bg-rd-navy-700" },
    { label: "Offer", count: 3, value: "$0.7M", tone: "bg-rd-success" },
  ];
  return (
    <RDCard padding={0} className="overflow-hidden">
      <div className="px-6 py-5 border-b border-rd-line flex items-center justify-between">
        <h3 className="text-sm font-semibold">Pipeline snapshot</h3>
        <RDBadge tone="ghost" size="sm">
          $4.8M
        </RDBadge>
      </div>
      <div className="p-5">
        <div className="flex h-2.5 rounded-[5px] overflow-hidden bg-rd-ink-100">
          <div className="bg-rd-terra-600 w-[30%]" />
          <div className="bg-rd-navy-500 w-[35%]" />
          <div className="bg-rd-navy-700 w-[22%]" />
          <div className="bg-rd-success w-[13%]" />
        </div>
        <div className="flex flex-col gap-2.5 mt-4">
          {stages.map((s) => (
            <div key={s.label} className="flex items-center gap-2.5 text-[13px]">
              <span className={`w-2 h-2 rounded-full ${s.tone}`} />
              <span className="flex-1">{s.label}</span>
              <span className="text-rd-ink-500 text-xs">{s.count}</span>
              <span className="font-semibold tabular-nums">{s.value}</span>
            </div>
          ))}
        </div>
        <Link
          to="/app/pipeline"
          className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-rd-navy-800 hover:underline"
        >
          Open pipeline <IconArrow />
        </Link>
      </div>
    </RDCard>
  );
}

function LeadSourcesCard() {
  const sources: { label: string; pct: number; count: number; tone: string }[] = [
    { label: "CREA DDF", pct: 42, count: 63, tone: "bg-rd-navy-800" },
    { label: "Website form", pct: 28, count: 42, tone: "bg-rd-terra-600" },
    { label: "Facebook Ads", pct: 14, count: 21, tone: "bg-rd-navy-400" },
    { label: "Referral", pct: 10, count: 15, tone: "bg-rd-success" },
    { label: "Open house", pct: 6, count: 9, tone: "bg-rd-ink-400" },
  ];
  return (
    <RDCard padding={0} className="overflow-hidden">
      <div className="px-6 py-5 border-b border-rd-line">
        <h3 className="text-sm font-semibold">Lead sources · 30d</h3>
      </div>
      <div className="p-5 flex flex-col gap-3">
        {sources.map((s) => (
          <div key={s.label} className="text-[13px]">
            <div className="flex justify-between mb-1.5">
              <span>{s.label}</span>
              <span className="text-rd-ink-500">
                <span className="text-rd-ink-900 font-semibold mr-1">{s.count}</span>· {s.pct}%
              </span>
            </div>
            <div className="h-1.5 bg-rd-ink-100 rounded-[3px] overflow-hidden">
              <div className={`h-full ${s.tone}`} style={{ width: `${s.pct}%` }} />
            </div>
          </div>
        ))}
      </div>
    </RDCard>
  );
}

function ComplianceCard() {
  const rows: { label: string; done: number; total: number; warning?: boolean }[] = [
    { label: "CASL consent on file", done: 234, total: 247 },
    { label: "PIPEDA data requests", done: 2, total: 2 },
    { label: "FINTRAC verifications", done: 9, total: 9 },
    { label: "RECO Quebec disclosures", done: 12, total: 14, warning: true },
  ];
  return (
    <RDCard padding={0} className="overflow-hidden">
      <div className="px-6 py-5 border-b border-rd-line flex items-center justify-between">
        <h3 className="text-sm font-semibold">Compliance</h3>
        <IconShield className="text-rd-success" />
      </div>
      <div className="p-5 flex flex-col gap-3.5">
        {rows.map((r) => {
          const pct = (r.done / r.total) * 100;
          return (
            <div key={r.label}>
              <div className="flex justify-between text-[13px] mb-1.5">
                <span>{r.label}</span>
                <span
                  className={cn(
                    "font-semibold",
                    r.warning ? "text-rd-warning" : "text-rd-success"
                  )}
                >
                  {r.done}/{r.total}
                </span>
              </div>
              <div className="h-1 bg-rd-ink-100 rounded-[2px] overflow-hidden">
                <div
                  className={cn("h-full", r.warning ? "bg-rd-warning" : "bg-rd-success")}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </RDCard>
  );
}
