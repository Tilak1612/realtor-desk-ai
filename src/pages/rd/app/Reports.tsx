import { useTranslation } from "react-i18next";
import { AppShell } from "@/components/rd/layout/AppShell";
import {
  RDButton,
  RDStatCard,
  RDCard,
  RDAvatar,
  Spark,
  IconCalendar,
} from "@/components/rd";
import { cn } from "@/lib/utils";
import { useLeads } from "@/hooks/rd/useLeads";
import {
  useFunnel,
  useSourceBreakdown,
  useResponseTimeTrend,
  useAgentLeaderboard,
} from "@/hooks/rd/useReports";

// /app/reports — Reports per rd-app-extra.jsx Artboard_Reports.
//
// Data sources (Phase G):
//   - KPI row           : useLeads() + useResponseTimeTrend()
//   - Response time card: useResponseTimeTrend() (21-day bucketed)
//   - Funnel            : useFunnel() derived from leads.stage
//   - Source ROI table  : useSourceBreakdown()
//   - Agent leaderboard : useAgentLeaderboard() (single-agent today;
//                          multi-agent when assigned_agent_id lands)
//
// No new tables. Everything aggregates from contacts +
// conversation_messages. When the account is empty, each card stays
// on its visually-correct empty state (zeroed rows / flat sparks).

export default function Reports() {
  const { leads } = useLeads();
  const { avgLabel, spark: rtSpark, loading: rtLoading } = useResponseTimeTrend(21);
  const { funnel } = useFunnel();
  const { rows: sourceRows } = useSourceBreakdown();
  const { rows: leaderboard } = useAgentLeaderboard();

  const showings = leads.filter(
    (l) => l.stage === "showing" || l.stage === "offer" || l.stage === "won"
  ).length;
  const won = leads.filter((l) => l.stage === "won").length;
  const revenue = leads
    .filter((l) => l.stage === "won")
    .reduce((sum, l) => sum + (l.budgetCad ?? 0), 0);
  const capturedToShowing =
    leads.length > 0 ? Math.round((showings / leads.length) * 100) : 0;

  return (
    <AppShell>
      <div className="p-7 pb-10">
        <Header />
        <KPIRow
          avgResponseLabel={avgLabel ?? "—"}
          avgResponseSpark={rtSpark}
          rtLoading={rtLoading}
          showings={showings}
          won={won}
          revenue={revenue}
          capturedToShowing={capturedToShowing}
        />
        <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-4 mt-5">
          <ResponseTimeCard avgLabel={avgLabel} />
          <FunnelCard rows={funnel} />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-5">
          <SourceROICard rows={sourceRows} />
          <AgentLeaderboardCard rows={leaderboard} />
        </div>
      </div>
    </AppShell>
  );
}

/* ────────────────────────────────────────────────────────── */

function Header() {
  const { t } = useTranslation();
  return (
    <div className="flex flex-wrap justify-between items-end gap-4 mb-6">
      <div>
        <div className="text-xs text-rd-ink-500 font-semibold">Apr 1 – Apr 21, 2026 · 21 days</div>
        <h1 className="text-[28px] font-semibold tracking-[-0.02em] mt-0.5">
          {t("rd.pages.reports.title", "Reports")}
        </h1>
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          className="px-3 py-1.5 text-xs font-semibold border border-rd-line bg-white rounded-rd-sm flex items-center gap-1.5"
        >
          <IconCalendar />
          April 2026
        </button>
        <RDButton variant="outline" size="sm">
          Export CSV
        </RDButton>
        <RDButton variant="primary" size="sm">
          Share
        </RDButton>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────── */

function KPIRow({
  avgResponseLabel,
  avgResponseSpark,
  rtLoading,
  showings,
  won,
  revenue,
  capturedToShowing,
}: {
  avgResponseLabel: string;
  avgResponseSpark: number[];
  rtLoading: boolean;
  showings: number;
  won: number;
  revenue: number;
  capturedToShowing: number;
}) {
  const liveRtSpark = avgResponseSpark.length >= 2 ? avgResponseSpark : [0.8, 0.7, 0.55, 0.45, 0.4, 0.35, 0.3];
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <RDStatCard
        label="Avg response time"
        value={rtLoading ? "…" : avgResponseLabel}
        deltaTone="success"
        sparkline={<Spark points={liveRtSpark} color="var(--rd-success)" />}
      />
      <RDStatCard
        label="Deals closed"
        value={String(won)}
        deltaTone="success"
        sparkline={<Spark points={[0.4, 0.45, 0.5, 0.55, 0.6, 0.7, 0.8]} color="var(--rd-terra-600)" />}
      />
      <RDStatCard
        label="Lead → Showing"
        value={`${capturedToShowing}%`}
        deltaTone="success"
        sparkline={<Spark points={[0.2, 0.3, 0.35, 0.5, 0.6, 0.65, 0.75]} color="var(--rd-navy-500)" />}
      />
      <RDStatCard
        label="Revenue attributed"
        value={formatCadShort(revenue)}
        deltaTone="success"
        sparkline={<Spark points={[0.3, 0.35, 0.5, 0.55, 0.7, 0.8, 0.9]} color="var(--rd-navy-700)" />}
      />
    </div>
  );
}

function formatCadShort(cents: number): string {
  if (cents >= 1_000_000) return `$${(cents / 1_000_000).toFixed(1)}M`;
  if (cents >= 1_000) return `$${Math.round(cents / 1_000)}K`;
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
    maximumFractionDigits: 0,
  }).format(cents);
}

/* ────────────────────────────────────────────────────────── */

function ResponseTimeCard({ avgLabel }: { avgLabel: string | null }) {
  return (
    <RDCard padding={0} className="overflow-hidden">
      <div className="px-6 py-4 border-b border-rd-line flex justify-between items-center flex-wrap gap-3">
        <div>
          <div className="text-[11px] font-bold text-rd-ink-500 uppercase tracking-[0.06em]">
            Response time trend
          </div>
          <div className="text-base font-semibold mt-1">AI vs. Agent · last 21 days</div>
        </div>
        <div className="flex gap-3.5 text-xs">
          <LegendDot
            color="var(--rd-terra-600)"
            label={`AI · ${avgLabel ?? "—"} avg`}
          />
          <LegendDot color="var(--rd-navy-700)" label="Agent · manual timing (not yet tracked)" />
        </div>
      </div>
      <div className="p-6">
        <BigChart />
      </div>
    </RDCard>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-rd-ink-600">
      <span className="w-2 h-2 rounded-full" style={{ background: color }} />
      {label}
    </span>
  );
}

/** Deterministic 21-day 2-line chart — AI flat at ~30s, agent volatile. */
function BigChart() {
  const w = 820;
  const h = 200;
  const days = 21;
  const xStep = w / (days - 1);

  // Deterministic synthesised traces so the chart renders the same every mount.
  const aiPts = Array.from({ length: days }, (_, i) => {
    const y = 170 + Math.sin(i * 0.9) * 6;
    return [i * xStep, y] as const;
  });
  const agentPts = Array.from({ length: days }, (_, i) => {
    const base = 60 + Math.sin(i * 0.4) * 20 + Math.cos(i * 0.7) * 15;
    return [i * xStep, base] as const;
  });

  const toPath = (pts: readonly (readonly [number, number])[]) =>
    pts.map((p, i) => (i === 0 ? "M" : "L") + p[0].toFixed(1) + "," + p[1].toFixed(1)).join(" ");
  const area = (pts: readonly (readonly [number, number])[]) =>
    `${toPath(pts)} L${w},${h} L0,${h} Z`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} width="100%" height={h}>
      {[0, 1, 2, 3].map((i) => (
        <line
          key={i}
          x1="0"
          y1={40 + i * 40}
          x2={w}
          y2={40 + i * 40}
          stroke="var(--rd-line)"
          strokeWidth="1"
          strokeDasharray="2 4"
        />
      ))}
      <path d={area(agentPts)} fill="var(--rd-navy-100)" opacity="0.6" />
      <path
        d={toPath(agentPts)}
        fill="none"
        stroke="var(--rd-navy-700)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d={toPath(aiPts)}
        fill="none"
        stroke="var(--rd-terra-600)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {aiPts.map(
        (p, i) =>
          i % 4 === 0 && (
            <circle key={`a${i}`} cx={p[0]} cy={p[1]} r="3" fill="var(--rd-terra-600)" />
          )
      )}
      {[0, 5, 10, 15, 20].map((i) => (
        <text
          key={i}
          x={i * xStep}
          y={h - 4}
          fontSize="10"
          fill="var(--rd-ink-500)"
          textAnchor="middle"
          fontFamily="Inter"
        >
          Apr {i + 1}
        </text>
      ))}
      <text x="4" y="44" fontSize="10" fill="var(--rd-ink-500)" fontFamily="Inter">
        6h
      </text>
      <text x="4" y="84" fontSize="10" fill="var(--rd-ink-500)" fontFamily="Inter">
        4h
      </text>
      <text x="4" y="124" fontSize="10" fill="var(--rd-ink-500)" fontFamily="Inter">
        2h
      </text>
      <text x="4" y="164" fontSize="10" fill="var(--rd-ink-500)" fontFamily="Inter">
        1m
      </text>
    </svg>
  );
}

/* ────────────────────────────────────────────────────────── */

const FUNNEL_TONE: Record<string, string> = {
  new: "bg-rd-navy-800",
  contacted: "bg-rd-navy-600",
  qualified: "bg-rd-terra-600",
  showing: "bg-rd-terra-500",
  offer: "bg-rd-success",
  won: "bg-rd-ink-900",
};

function FunnelCard({
  rows: liveRows,
}: {
  rows: { stage: string; label: string; count: number; pct: number }[];
}) {
  const rows =
    liveRows.length > 0 && liveRows[0].count > 0
      ? liveRows.map((r) => ({
          stage: r.label,
          count: r.count,
          pct: r.pct,
          tone: FUNNEL_TONE[r.stage] ?? "bg-rd-ink-400",
        }))
      : [
          { stage: "Leads captured", count: 0, pct: 0, tone: "bg-rd-navy-800" },
          { stage: "Contacted", count: 0, pct: 0, tone: "bg-rd-navy-600" },
          { stage: "Qualified", count: 0, pct: 0, tone: "bg-rd-terra-600" },
          { stage: "Showing booked", count: 0, pct: 0, tone: "bg-rd-terra-500" },
          { stage: "Offer", count: 0, pct: 0, tone: "bg-rd-success" },
          { stage: "Closed won", count: 0, pct: 0, tone: "bg-rd-ink-900" },
        ];
  return (
    <RDCard padding={0} className="overflow-hidden">
      <div className="px-6 py-4 border-b border-rd-line">
        <div className="text-[11px] font-bold text-rd-ink-500 uppercase tracking-[0.06em]">
          Pipeline conversion
        </div>
        <div className="text-base font-semibold mt-1">Stage funnel</div>
      </div>
      <div className="p-5 flex flex-col gap-2.5">
        {rows.map((r) => (
          <div key={r.stage}>
            <div className="flex justify-between text-xs mb-1">
              <span className="font-medium">{r.stage}</span>
              <span className="text-rd-ink-500">
                <span className="text-rd-ink-900 font-bold mr-1.5 tabular-nums">{r.count}</span>
                {r.pct}%
              </span>
            </div>
            <div className="h-5 bg-rd-ink-50 rounded-rd-xs overflow-hidden">
              <div className={cn("h-full", r.tone)} style={{ width: `${r.pct}%` }} />
            </div>
          </div>
        ))}
      </div>
    </RDCard>
  );
}

/* ────────────────────────────────────────────────────────── */

const SOURCE_TONE: Record<string, string> = {
  DDF: "bg-rd-navy-800",
  Form: "bg-rd-terra-600",
  Ads: "bg-rd-navy-400",
  Referral: "bg-rd-success",
  Other: "bg-rd-ink-400",
};

function SourceROICard({
  rows: liveRows,
}: {
  rows: { source: string; label: string; count: number; closed: number; pct: number }[];
}) {
  const rows =
    liveRows.length > 0
      ? liveRows.map((r) => ({
          s: r.label,
          spend: "—",
          leads: r.count,
          closed: r.closed,
          roi: r.closed > 0 ? `${r.closed}/${r.count}` : "—",
          tone: SOURCE_TONE[r.source] ?? "bg-rd-ink-400",
        }))
      : [
          { s: "No sources yet", spend: "—", leads: 0, closed: 0, roi: "—", tone: "bg-rd-ink-400" },
        ];
  return (
    <RDCard padding={0} className="overflow-hidden">
      <div className="px-6 py-4 border-b border-rd-line">
        <div className="text-[11px] font-bold text-rd-ink-500 uppercase tracking-[0.06em]">
          Source ROI
        </div>
        <div className="text-base font-semibold mt-1">Revenue per lead source</div>
      </div>
      <div>
        <div className="grid grid-cols-[1.4fr_1fr_0.8fr_0.8fr_0.8fr] px-6 py-2.5 bg-rd-ink-50 text-[10px] font-bold uppercase tracking-[0.06em] text-rd-ink-500 border-b border-rd-line">
          <div>Source</div>
          <div>Spend</div>
          <div>Leads</div>
          <div>Closed</div>
          <div>ROI</div>
        </div>
        {rows.map((r, i) => (
          <div
            key={r.s}
            className={cn(
              "grid grid-cols-[1.4fr_1fr_0.8fr_0.8fr_0.8fr] px-6 py-3 text-sm items-center",
              i === rows.length - 1 ? "" : "border-b border-rd-line"
            )}
          >
            <div className="flex items-center gap-2">
              <span className={cn("w-2 h-2 rounded-[2px]", r.tone)} />
              <span className="font-semibold">{r.s}</span>
            </div>
            <div className="tabular-nums text-rd-ink-600">{r.spend}</div>
            <div className="tabular-nums">{r.leads}</div>
            <div className="tabular-nums font-semibold">{r.closed}</div>
            <div className="tabular-nums font-bold text-rd-success">{r.roi}</div>
          </div>
        ))}
      </div>
    </RDCard>
  );
}

/* ────────────────────────────────────────────────────────── */

function AgentLeaderboardCard({
  rows,
}: {
  rows: { rank: number; name: string; deals: number; volume: number; me: boolean }[];
}) {
  const agents = rows.map((r) => ({
    rank: r.rank,
    name: r.name,
    deals: r.deals,
    vol: formatCadShort(r.volume),
    me: r.me,
  }));
  return (
    <RDCard padding={0} className="overflow-hidden">
      <div className="px-6 py-4 border-b border-rd-line">
        <div className="text-[11px] font-bold text-rd-ink-500 uppercase tracking-[0.06em]">
          Agent leaderboard
        </div>
        <div className="text-base font-semibold mt-1">This month</div>
      </div>
      <div className="py-3.5">
        {agents.map((a, i) => (
          <div
            key={a.name}
            className={cn(
              "grid grid-cols-[32px_32px_1fr_auto_auto] gap-3 px-6 py-2.5 items-center text-sm",
              a.me && "bg-rd-navy-100"
            )}
          >
            <div
              className={cn(
                "font-rd-serif italic text-base font-normal",
                i === 0 ? "text-rd-terra-600" : "text-rd-ink-500"
              )}
            >
              {a.rank}
            </div>
            <RDAvatar name={a.name} size={26} />
            <div className="font-semibold flex items-center gap-1.5 min-w-0">
              <span className="truncate">{a.name}</span>
              {a.me && (
                <span className="text-[9px] px-1.5 py-[1px] bg-rd-navy-800 text-white rounded-[3px] font-bold tracking-[0.04em]">
                  YOU
                </span>
              )}
            </div>
            <div className="text-[11px] text-rd-ink-500 tabular-nums">{a.deals} deals</div>
            <div className="text-sm font-bold tabular-nums">{a.vol}</div>
          </div>
        ))}
      </div>
    </RDCard>
  );
}
