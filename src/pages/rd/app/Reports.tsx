import { useTranslation } from "react-i18next";
import { toCsv, downloadCsv, datedFilename } from "@/lib/rd/csv";
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
import { SkeletonStatRow } from "@/components/rd/Skeleton";
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
  const { leads, loading: leadsLoading } = useLeads();
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
  // Export what the page shows: the funnel and the source breakdown. Escaping
  // and BOM are handled in lib/rd/csv so an accented French name or a contact
  // called "Smith, Jr." cannot shift the columns.
  const handleExport = () => {
    const rows: unknown[][] = [];
    rows.push(["Funnel stage", "Leads"]);
    funnel.forEach((f) => rows.push([f.stage, f.count]));
    rows.push([]);
    rows.push(["Lead source", "Leads", "Closed won"]);
    sourceRows.forEach((r) => rows.push([r.source, r.count, r.closed]));
    downloadCsv(
      datedFilename("realtordesk-report"),
      toCsv(["RealtorDesk report", new Date().toISOString().slice(0, 10)], rows)
    );
  };

  const capturedToShowing =
    leads.length > 0 ? Math.round((showings / leads.length) * 100) : 0;

  return (
    <AppShell>
      <div className="p-7 pb-10">
        <Header onExport={handleExport} />
        <KPIRow
          avgResponseLabel={avgLabel ?? "—"}
          avgResponseSpark={rtSpark}
          rtLoading={rtLoading}
          leadsLoading={leadsLoading}
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
          {/* Agent leaderboard hidden. useAgentLeaderboard builds a literal
              single-element array from the signed-in user — its own comment
              says so — so it renders "rank 1 of 1 · YOU" and can never contain
              a colleague. Restore it when there is a real ownership model and
              more than one agent to rank. */}
        </div>
      </div>
    </AppShell>
  );
}

/* ────────────────────────────────────────────────────────── */

function Header({ onExport }: { onExport: () => void }) {
  const { t, i18n } = useTranslation();
  // Month-to-date, from the clock. This header used to be hardcoded to
  // "Apr 1 – Apr 21, 2026" with a dead month-picker button — stale dates on
  // a reports page read as stale data.
  const now = new Date();
  const locale = (i18n.language || "en").toLowerCase().startsWith("fr") ? "fr-CA" : "en-CA";
  const monthLabel = now.toLocaleDateString(locale, { month: "long", year: "numeric" });
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const fmt = (d: Date) => d.toLocaleDateString(locale, { month: "short", day: "numeric" });
  const range = `${fmt(start)} – ${fmt(now)}, ${now.getFullYear()} · ${now.getDate()} ${t("rd.pages.reports.days", "days")}`;
  return (
    <div className="flex flex-wrap justify-between items-end gap-4 mb-6">
      <div>
        <div className="text-xs text-rd-ink-500 font-semibold">{range}</div>
        <h1 className="text-[28px] font-semibold tracking-[-0.02em] mt-0.5">
          {t("rd.pages.reports.title", "Reports")}
        </h1>
      </div>
      <div className="flex gap-2">
        {/* Static label, not a button: the old month "picker" was a dead
            button promising a feature that does not exist. */}
        <span className="px-3 py-1.5 text-xs font-semibold border border-rd-line bg-white rounded-rd-sm flex items-center gap-1.5 text-rd-ink-700">
          <IconCalendar />
          {monthLabel}
        </span>
        {/* Export now does something. "Share" is removed — there is no sharing
            mechanism behind it, and a primary-styled button that does nothing
            is the most misleading control on the page. */}
        <RDButton variant="outline" size="sm" onClick={onExport}>
          {t("rd.actions.exportCsv", "Export CSV")}
        </RDButton>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────── */

const KPI_GRID = "grid grid-cols-2 lg:grid-cols-4 gap-4";

function KPIRow({
  avgResponseLabel,
  avgResponseSpark,
  rtLoading,
  leadsLoading,
  showings,
  won,
  revenue,
  capturedToShowing,
}: {
  avgResponseLabel: string;
  avgResponseSpark: number[];
  rtLoading: boolean;
  leadsLoading: boolean;
  showings: number;
  won: number;
  revenue: number;
  capturedToShowing: number;
}) {
  const { t } = useTranslation();
  // A sparkline with no series renders nothing, not a curve. Each of these
  // four tiles previously drew a smooth rising line from a hardcoded array --
  // so a brand-new account saw $0 revenue under a steeply climbing revenue
  // curve, and "-" avg response under an improving green one.
  const liveRtSpark = avgResponseSpark.length >= 2 ? avgResponseSpark : null;

  // `won`, `revenue` and `capturedToShowing` all derive from `leads`, which is
  // [] until the query resolves -- so mid-load this row asserted "Deals closed
  // 0", "Revenue attributed $0" and "Lead -> Showing 0%" as measured facts.
  // For an agent who has closed deals those are wrong numbers, not absent
  // ones. Reserve the space instead of publishing a zero.
  if (leadsLoading) {
    return <SkeletonStatRow count={4} className={KPI_GRID} />;
  }

  return (
    <div className={KPI_GRID}>
      <RDStatCard
        label={t("rd.kpi.avgResponseTime", "Avg response time")}
        value={rtLoading ? "…" : avgResponseLabel}
        sparkline={liveRtSpark ? <Spark points={liveRtSpark} color="var(--rd-success)" /> : undefined}
      />
      <RDStatCard
        label={t("rd.kpi.dealsClosed", "Deals closed")}
        value={String(won)}
      />
      <RDStatCard
        label={t("rd.kpi.leadToShowing", "Lead → Showing")}
        value={`${capturedToShowing}%`}
      />
      <RDStatCard
        label={t("rd.kpi.revenueAttributed", "Revenue attributed")}
        value={formatCadShort(revenue)}
        deltaTone="success"
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
  const { t } = useTranslation();
  return (
    <RDCard padding={0} className="overflow-hidden">
      <div className="px-6 py-4 border-b border-rd-line flex justify-between items-center flex-wrap gap-3">
        <div>
          <div className="text-[11px] font-bold text-rd-ink-500 uppercase tracking-[0.06em]">
            {t("rd.sections.responseTimeTrend", "Response time trend")}
          </div>
          {/* The "AI vs. Agent - last 21 days" subtitle and the two legend
              dots described a comparison the chart never actually plotted and
              that no query can produce today. The legend also printed the live
              average next to the fabricated AI line, which is what made the
              synthetic curve read as measured. */}
          <div className="text-base font-semibold mt-1">
            {t("rd.sections.avgFirstReply", "Average first reply")}
          </div>
        </div>
        {avgLabel && (
          <div className="text-xs text-rd-ink-600">
            {t("rd.reportsPage.currentAvg", "Current average: {{label}}", { label: avgLabel })}
          </div>
        )}
      </div>
      <div className="p-6">
        <BigChart />
      </div>
    </RDCard>
  );
}


// BigChart removed. It synthesised both traces --
//   ai:    170 + Math.sin(i * 0.9) * 6
//   agent: 60 + Math.sin(i * 0.4) * 20 + Math.cos(i * 0.7) * 15
// -- rendered them as a filled 21-day area chart with a hand-labelled
// "6h / 4h / 2h / 1m" y-axis, and printed the LIVE average in the legend
// beside the fabricated line. That presented the company's core sales claim
// ("AI replies in ~30s, agents take hours") to the customer as their own
// audited history. There is no data behind it: conversation_messages does not
// exist in production, so nothing can compute an AI-vs-agent split today.
function BigChart() {
  const { t } = useTranslation();
  return (
    <div className="py-12 text-center">
      <p className="text-sm text-rd-ink-500">
        {t(
          "rd.reportsPage.trendUnavailable",
          "Response time trend isn't available yet. It appears once there are enough replies to compare."
        )}
      </p>
    </div>
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
  const { t } = useTranslation();
  const rows =
    liveRows.length > 0 && liveRows[0].count > 0
      ? liveRows.map((r) => ({
          stage: r.label,
          count: r.count,
          pct: r.pct,
          tone: FUNNEL_TONE[r.stage] ?? "bg-rd-ink-400",
        }))
      : [
          { stage: t("rd.funnel.leadsCaptured", "Leads captured"), count: 0, pct: 0, tone: "bg-rd-navy-800" },
          { stage: t("rd.stages.contacted", "Contacted"), count: 0, pct: 0, tone: "bg-rd-navy-600" },
          { stage: t("rd.stages.qualified", "Qualified"), count: 0, pct: 0, tone: "bg-rd-terra-600" },
          { stage: t("rd.funnel.showingBooked", "Showing booked"), count: 0, pct: 0, tone: "bg-rd-terra-500" },
          { stage: t("rd.stages.offer", "Offer"), count: 0, pct: 0, tone: "bg-rd-success" },
          { stage: t("rd.funnel.closedWon", "Closed won"), count: 0, pct: 0, tone: "bg-rd-ink-900" },
        ];
  return (
    <RDCard padding={0} className="overflow-hidden">
      <div className="px-6 py-4 border-b border-rd-line">
        <div className="text-[11px] font-bold text-rd-ink-500 uppercase tracking-[0.06em]">
          {t("rd.sections.pipelineConversion", "Pipeline conversion")}
        </div>
        <div className="text-base font-semibold mt-1">
          {t("rd.sections.stageFunnel", "Stage funnel")}
        </div>
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
  const { t } = useTranslation();
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
          {
            s: t("rd.reportsPage.noSourcesYet", "No sources yet"),
            spend: "—",
            leads: 0,
            closed: 0,
            roi: "—",
            tone: "bg-rd-ink-400",
          },
        ];
  return (
    <RDCard padding={0} className="overflow-hidden">
      <div className="px-6 py-4 border-b border-rd-line">
        <div className="text-[11px] font-bold text-rd-ink-500 uppercase tracking-[0.06em]">
          {t("rd.sections.sourceRoi", "Source ROI")}
        </div>
        <div className="text-base font-semibold mt-1">
          {t("rd.sections.revenuePerLeadSource", "Revenue per lead source")}
        </div>
      </div>
      <div>
        <div className="grid grid-cols-[1.4fr_1fr_0.8fr_0.8fr_0.8fr] px-6 py-2.5 bg-rd-ink-50 text-[10px] font-bold uppercase tracking-[0.06em] text-rd-ink-500 border-b border-rd-line">
          <div>{t("rd.columns.reports.source", "Source")}</div>
          <div>{t("rd.columns.reports.spend", "Spend")}</div>
          <div>{t("rd.columns.reports.leads", "Leads")}</div>
          <div>{t("rd.columns.reports.closed", "Closed")}</div>
          <div>{t("rd.columns.reports.roi", "ROI")}</div>
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
  const { t } = useTranslation();
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
          {t("rd.sections.agentLeaderboard", "Agent leaderboard")}
        </div>
        <div className="text-base font-semibold mt-1">
          {t("rd.sections.thisMonth", "This month")}
        </div>
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
                i === 0 ? "text-rd-terra-700" : "text-rd-ink-500"
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
