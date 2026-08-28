import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AppShell } from "@/components/rd/layout/AppShell";
import { AddLeadDialog } from "@/components/rd/AddLeadDialog";
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
import type { ActivityItem, Lead, PipelineStage, ReportMetric } from "@/types/rd";
import { useLeads, useLead } from "@/hooks/rd/useLeads";
import { useSession } from "@/hooks/rd/useSession";
import { useActivityFeed, useLeadsPerDay } from "@/hooks/rd/useDashboardFeed";

// /app — Dashboard page per rd-app.jsx Artboard_Dashboard.
//
// Data source mix (Phase B):
//   - Greeting   : signed-in user's profile full name (from auth).
//   - KPI row    : derives live counts from useLeads() when the user
//                  has data; sparklines stay on the MOCK_* series until
//                  we wire real timeseries queries (trivial additional
//                  rung, not blocking the dashboard-alive milestone).
//   - AI activity, Today, Pipeline/Sources/Compliance cards: static
//                  previews until their dedicated backend rungs land.

export default function Dashboard() {
  const { user } = useSession();
  const { t } = useTranslation();
  const { leads: liveLeads, loading: leadsLoading } = useLeads();
  const { points: leadsSpark, loading: sparkLoading } = useLeadsPerDay(7);
  const { activity, loading: activityLoading } = useActivityFeed();
  const firstName = extractFirstName(user?.user_metadata?.full_name ?? user?.email ?? null);

  return (
    <AppShell agentName={fullNameFromUser(user) ?? "Your desk"}>
      <div className="p-7 pb-10">
        <Greeting firstName={firstName} />
        {/* Same fixture banner as Leads/Inbox. The dashboard fell back to
            MOCK figures for empty accounts with no indication — the one
            page that boasted "38s avg response" while Reports showed real
            zeros. If fixtures render, say so. */}
        {!leadsLoading && liveLeads.length === 0 && (
          <div className="mb-4 px-4 py-2.5 bg-rd-terra-50 border border-rd-terra-200 rounded-rd-sm text-[12px] text-rd-terra-900 flex items-center gap-2">
            <IconSparkles className="text-rd-terra-700 flex-shrink-0" />
            <span>
              {t("rd.common.sampleDashboard", "Showing sample data — add your first lead and this dashboard switches to your real numbers.")}
            </span>
          </div>
        )}
        <KPIRow
          liveLeads={liveLeads}
          loading={leadsLoading}
          liveLeadsSpark={sparkLoading ? undefined : leadsSpark}
        />
        <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-4 mt-5">
          <AIActivityCard
            liveActivity={activity}
            loading={activityLoading}
            leadsById={Object.fromEntries(liveLeads.map((l) => [l.id, l]))}
          />
          <TodayCard leads={liveLeads} loading={leadsLoading} />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-5">
          <PipelineSnapshotCard leads={liveLeads} loading={leadsLoading} />
          <LeadSourcesCard leads={liveLeads} loading={leadsLoading} />
        </div>
      </div>
    </AppShell>
  );
}

function fullNameFromUser(user: ReturnType<typeof useSession>["user"]): string | null {
  if (!user) return null;
  const meta = user.user_metadata as Record<string, unknown> | undefined;
  const full = typeof meta?.full_name === "string" ? meta.full_name : null;
  return full ?? user.email ?? null;
}

function extractFirstName(raw: string | null): string {
  if (!raw) return "there";
  const [first] = raw.split(/\s+|@/);
  return first || "there";
}

/* ────────────────────────────────────────────────────────── */

function Greeting({ firstName }: { firstName: string }) {
  const [addOpen, setAddOpen] = useState(false);
  const { t, i18n } = useTranslation();
  const isFr = (i18n.language || "en").toLowerCase().startsWith("fr");
  const today = new Date().toLocaleDateString(isFr ? "fr-CA" : "en-CA", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
  const hour = new Date().getHours();
  const salute =
    hour < 12
      ? t("rd.pages.dashboard.saluteMorning", "Good morning")
      : hour < 18
      ? t("rd.pages.dashboard.saluteAfternoon", "Good afternoon")
      : t("rd.pages.dashboard.saluteEvening", "Good evening");
  return (
    <div className="flex flex-wrap justify-between items-end gap-4 mb-6">
      <div>
        <div className="text-[13px] text-rd-terra-700 font-semibold tracking-[0.02em]">
          {today}
        </div>
        <h1 className="text-[28px] lg:text-[32px] font-semibold tracking-[-0.02em] mt-1">
          {salute}, {firstName}.{" "}
          <span className="font-rd-serif italic font-normal text-rd-ink-500">
            {t("rd.pages.dashboard.subhead", "Here's where things stand.")}
          </span>
        </h1>
      </div>
      <div className="flex flex-wrap gap-2.5">
        {/* "This week" removed: a range picker with no handler and no state.
            The KPIs it appeared to filter are all-time. */}
        <RDButton
          variant="primary"
          size="sm"
          icon={<IconPlus />}
          onClick={() => setAddOpen(true)}
        >
          New lead
        </RDButton>
        <AddLeadDialog open={addOpen} onClose={() => setAddOpen(false)} />
      </div>
    </div>
  );
}

function KPIRow({
  liveLeads,
  loading,
  liveLeadsSpark,
}: {
  liveLeads: ReturnType<typeof useLeads>["leads"];
  loading: boolean;
  liveLeadsSpark?: number[];
}) {
  const { t } = useTranslation();
  const SPARK_COLOURS: Record<string, string> = {
    leads_this_week: "var(--rd-navy-500)",
    response_time_avg: "var(--rd-success)",
    showings_booked: "var(--rd-terra-600)",
    pipeline_value: "var(--rd-navy-500)",
  };

  const metrics: ReportMetric[] = useMemo(() => {
    // No fixture fallback. This used to return MOCK_DASHBOARD_METRICS whole
    // when the account was empty and -- worse -- kept returning the mock
    // response-time tile ("Avg response 38s, -14%") INSIDE the live branch,
    // so a paying agent with real leads saw a fabricated number presented as
    // their own performance. That number also appeared to corroborate the
    // public "replies within 15 minutes" claim.
    //
    // Zero is a legitimate answer; invented is not. Sparklines render only
    // from a real series, and the response-time tile is gone until a
    // conversations timeseries exists to compute it honestly.
    const leadsCount = liveLeads.length;
    const showings = liveLeads.filter((l) => l.stage === "showing").length;
    const pipelineValue = liveLeads.reduce((sum, l) => sum + (l.budgetCad ?? 0), 0);
    const hasSpark = !!liveLeadsSpark && liveLeadsSpark.length > 0;

    return [
      {
        key: "leads_this_week",
        label: t("rd.kpi.activeLeads", "Active leads"),
        value: String(leadsCount),
        deltaTone: "success",
        spark: hasSpark ? liveLeadsSpark : undefined,
      },
      {
        key: "showings_booked",
        label: t("rd.kpi.showingsBooked", "Showings booked"),
        value: String(showings),
        deltaTone: "success",
      },
      {
        key: "pipeline_value",
        label: t("rd.kpi.pipelineValue", "Pipeline value"),
        value: formatCadShort(pipelineValue),
        deltaTone: "success",
      },
    ];
  }, [liveLeads, liveLeadsSpark, t]);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((m) => (
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

// AI_EVENTS removed. Five fabricated events (Emilie Tremblay, Hassan Ahmed,
// Chen Wei, an "Anonymous visitor", Olivia Kenner) rendered whenever the live
// activity feed was empty -- independently of whether the account had leads --
// under a green "Live" badge, disclosed only by a grey footer line. An account
// with one real contact saw five named strangers presented as its own activity.

function AIActivityCard({
  liveActivity,
  loading,
  leadsById,
}: {
  liveActivity: ActivityItem[];
  loading: boolean;
  leadsById: Record<string, ReturnType<typeof useLeads>["leads"][number]>;
}) {
  const [filter, setFilter] = useState<"all" | "responses" | "showings">("all");
  const isLive = liveActivity.length > 0;

  const filteredLive = liveActivity.filter((a) => {
    if (filter === "responses") return a.kind === "ai_reply";
    if (filter === "showings") return a.kind === "ai_booked_showing";
    return true;
  });

  return (
    <RDCard padding={0} className="overflow-hidden">
      <div className="px-6 py-5 border-b border-rd-line flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-rd-sm bg-rd-terra-600 text-white flex items-center justify-center">
            <IconSparkles />
          </div>
          <h3 className="text-base font-semibold">Desk AI activity</h3>
          {/* Only claim "Live" when we are actually rendering live rows. */}
          {isLive && (
            <RDBadge tone="success" size="sm">
              <IconDot />
              Live
            </RDBadge>
          )}
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
        {loading && (
          <div className="px-6 py-8 text-center text-sm text-rd-ink-500">Loading activity…</div>
        )}
        {!loading && isLive &&
          filteredLive.slice(0, 6).map((a) => (
            <AIEventLive
              key={a.id}
              activity={a}
              leadName={a.leadId ? leadsById[a.leadId]?.name : undefined}
            />
          ))}
        {!loading && isLive && filteredLive.length === 0 && (
          <div className="px-6 py-8 text-center text-sm text-rd-ink-500">
            No events match this filter.
          </div>
        )}
        {!loading && !isLive && (
          <div className="px-6 py-8 text-center text-sm text-rd-ink-500">
            No AI activity yet. Once Desk AI replies to a lead, it shows up here.
          </div>
        )}
      </div>
      <div className="px-6 py-3 border-t border-rd-line bg-rd-ink-50 flex items-center justify-between">
        <span className="text-xs text-rd-ink-600">
          {isLive
            ? `${liveActivity.length} events in the last 25`
            : "No activity recorded yet"}
        </span>
        {/* "Open activity log" removed: no handler, and no activity-log route
            exists to open. */}
      </div>
    </RDCard>
  );
}

/** Live-feed renderer — shares AIEvent's grid layout but takes a
 *  normalized ActivityItem + optional joined lead name. */
function AIEventLive({
  activity,
  leadName,
}: {
  activity: ActivityItem;
  leadName?: string;
}) {
  const time = formatEventTime(activity.at);
  const who = leadName ?? activity.actor;
  const action = ACTION_VERB[activity.kind];
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
          <span className="font-medium">{activity.summary}</span>
          {activity.language === "FR" && (
            <span className="ml-2 text-[10px] font-bold tracking-[0.08em] bg-rd-terra-100 text-rd-terra-800 rounded-[4px] px-1.5 py-[1px]">
              FR
            </span>
          )}
        </div>
        {activity.detail && (
          <div className="text-xs text-rd-ink-500 mt-0.5 leading-[1.5]">{activity.detail}</div>
        )}
      </div>
      <div />
    </div>
  );
}

const ACTION_VERB: Record<ActivityItem["kind"], string> = {
  ai_reply: "replied to",
  ai_booked_showing: "booked showing for",
  lead_viewed_listing: "viewed",
  agent_called: "called",
  agent_note: "noted",
  stage_changed: "moved to",
  consent_captured: "consented on",
  automation_step: "automation step on",
};

function formatEventTime(iso: string): string {
  const d = new Date(iso);
  const today = new Date();
  if (
    d.getFullYear() === today.getFullYear() &&
    d.getMonth() === today.getMonth() &&
    d.getDate() === today.getDate()
  ) {
    return d.toLocaleTimeString("en-CA", { hour: "numeric", minute: "2-digit" });
  }
  return d.toLocaleDateString("en-CA", { month: "short", day: "numeric" });
}

// AIEvent renderer removed with AI_EVENTS -- nothing renders fixtures now.

/* ────────────────────────────────────────────────────────── */

// The three cards below were fully hardcoded: five named appointments, a
// $4.8M pipeline that contradicted the live "Pipeline value" KPI on the same
// screen, and a lead-source breakdown implying a DDF feed that has produced
// zero rows. They now derive from the same liveLeads the KPI row uses, and
// render an honest empty state when there is nothing to show.

function CardEmpty({ message, ctaLabel, ctaHref }: { message: string; ctaLabel?: string; ctaHref?: string }) {
  return (
    <div className="px-6 py-8 text-center">
      <p className="text-[13px] text-rd-ink-500">{message}</p>
      {ctaLabel && ctaHref && (
        <Link
          to={ctaHref}
          className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-rd-navy-800 hover:underline"
        >
          {ctaLabel} <IconArrow />
        </Link>
      )}
    </div>
  );
}

/** Follow-ups the user actually owes today, from contacts.next_followup_date. */
function TodayCard({ leads, loading }: { leads: Lead[]; loading: boolean }) {
  const due = useMemo(() => {
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);
    return leads
      .filter((l) => l.nextFollowupDate && new Date(l.nextFollowupDate) <= todayEnd)
      .sort((a, b) => (a.nextFollowupDate! < b.nextFollowupDate! ? -1 : 1))
      .slice(0, 6);
  }, [leads]);

  return (
    <RDCard padding={0} className="overflow-hidden">
      <div className="px-6 py-5 border-b border-rd-line flex items-center justify-between">
        <h3 className="text-base font-semibold">Follow-ups due</h3>
      </div>
      {loading ? (
        <div className="px-6 py-8 text-[13px] text-rd-ink-500">Loading…</div>
      ) : due.length === 0 ? (
        <CardEmpty
          message="Nothing due today. Set a follow-up date on a lead and it appears here."
          ctaLabel="Open leads"
          ctaHref="/app/leads"
        />
      ) : (
        <div className="px-6 py-4 flex flex-col gap-3.5">
          {due.map((l) => (
            <Link
              key={l.id}
              to={`/app/leads/${l.id}`}
              className="border-l-2 border-rd-terra-600 pl-3 block hover:bg-rd-ink-50 rounded-r-rd-sm"
            >
              <span className="text-[10px] font-bold uppercase tracking-[0.06em] text-rd-terra-700">
                {l.stage}
              </span>
              <div className="text-[13px] font-semibold mt-0.5">{l.name}</div>
              <div className="text-xs text-rd-ink-500 mt-0.5">
                Due {new Date(l.nextFollowupDate!).toLocaleDateString()}
              </div>
            </Link>
          ))}
        </div>
      )}
    </RDCard>
  );
}

/* ────────────────────────────────────────────────────────── */

const SNAPSHOT_STAGES: { key: PipelineStage; label: string; tone: string }[] = [
  { key: "new", label: "New leads", tone: "bg-rd-terra-600" },
  { key: "contacted", label: "Contacted", tone: "bg-rd-navy-500" },
  { key: "showing", label: "Showing booked", tone: "bg-rd-navy-700" },
  { key: "offer", label: "Offer", tone: "bg-rd-success" },
];

function PipelineSnapshotCard({ leads, loading }: { leads: Lead[]; loading: boolean }) {
  const { rows, total, anyValue } = useMemo(() => {
    const rows = SNAPSHOT_STAGES.map((s) => {
      const inStage = leads.filter((l) => l.stage === s.key);
      return {
        ...s,
        count: inStage.length,
        value: inStage.reduce((sum, l) => sum + (l.budgetCad ?? 0), 0),
      };
    });
    const total = rows.reduce((sum, r) => sum + r.value, 0);
    const counted = rows.reduce((sum, r) => sum + r.count, 0);
    return { rows, total, anyValue: counted > 0 };
  }, [leads]);

  return (
    <RDCard padding={0} className="overflow-hidden">
      <div className="px-6 py-5 border-b border-rd-line flex items-center justify-between">
        <h3 className="text-sm font-semibold">Pipeline snapshot · active stages</h3>
        {/* Only badge a total when a budget is actually recorded; otherwise the
            figure would read $0 next to real leads and look like a bug. */}
        {total > 0 && (
          <RDBadge tone="ghost" size="sm">
            {formatCadShort(total)}
          </RDBadge>
        )}
      </div>
      {loading ? (
        <div className="px-6 py-8 text-[13px] text-rd-ink-500">Loading…</div>
      ) : !anyValue ? (
        <CardEmpty message="No leads in the pipeline yet." ctaLabel="Open pipeline" ctaHref="/app/pipeline" />
      ) : (
        <div className="p-5">
          <div className="flex h-2.5 rounded-[5px] overflow-hidden bg-rd-ink-100">
            {rows.map((r) => {
              const totalCount = rows.reduce((sum, x) => sum + x.count, 0);
              const pct = totalCount > 0 ? (r.count / totalCount) * 100 : 0;
              return pct > 0 ? (
                <div key={r.key} className={r.tone} style={{ width: `${pct}%` }} />
              ) : null;
            })}
          </div>
          <div className="flex flex-col gap-2.5 mt-4">
            {rows.map((r) => (
              <div key={r.key} className="flex items-center gap-2.5 text-[13px]">
                <span className={`w-2 h-2 rounded-full ${r.tone}`} />
                <span className="flex-1">{r.label}</span>
                <span className="text-rd-ink-500 text-xs">{r.count}</span>
                <span className="font-semibold tabular-nums">
                  {r.value > 0 ? formatCadShort(r.value) : "—"}
                </span>
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
      )}
    </RDCard>
  );
}

const SOURCE_TONES = [
  "bg-rd-navy-800",
  "bg-rd-terra-600",
  "bg-rd-navy-400",
  "bg-rd-success",
  "bg-rd-ink-400",
];

function LeadSourcesCard({ leads, loading }: { leads: Lead[]; loading: boolean }) {
  const sources = useMemo(() => {
    const counts = new Map<string, number>();
    for (const l of leads) {
      const key = l.source || "Other";
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
    const total = leads.length;
    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([label, count], i) => ({
        label,
        count,
        pct: total > 0 ? Math.round((count / total) * 100) : 0,
        tone: SOURCE_TONES[i % SOURCE_TONES.length],
      }));
  }, [leads]);

  return (
    <RDCard padding={0} className="overflow-hidden">
      <div className="px-6 py-5 border-b border-rd-line">
        <h3 className="text-sm font-semibold">Lead sources</h3>
      </div>
      {loading ? (
        <div className="px-6 py-8 text-[13px] text-rd-ink-500">Loading…</div>
      ) : sources.length === 0 ? (
        <CardEmpty message="No leads yet, so there are no sources to break down." ctaLabel="Add a lead" ctaHref="/app/leads" />
      ) : (
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
      )}
    </RDCard>
  );
}

// ComplianceCard removed 2026-08-14.
//
// It rendered three hardcoded counters -- "PIPEDA data requests 2/2",
// "FINTRAC verifications 9/9", "RECO disclosures 12/14" -- with NO backing
// tables. A schema sweep for fintrac/disclosure/consent/dsar/audit returned
// nothing at all. On a product sold on Canadian compliance, fabricated
// compliance counters are the highest-credibility-risk element on the page.
//
// It comes back when the data exists: FINTRAC records (ID type/number/
// issuing jurisdiction, entity 30-day deadline, 5-year retention), a
// disclosure log (RECO/OACIQ/BCFSA), and a DSAR workflow.
