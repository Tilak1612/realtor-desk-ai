import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AppShell } from "@/components/rd/layout/AppShell";
import { AddLeadDialog } from "@/components/rd/AddLeadDialog";
import { RDButton, RDBadge, IconPlus } from "@/components/rd";
import { SkeletonStatRow } from "@/components/rd/Skeleton";
import { KpiTile, type Tone } from "@/components/rd/dashboard/KpiTile";
import { NextUpCard } from "@/components/rd/dashboard/NextUpCard";
import { ActivityCard } from "@/components/rd/dashboard/ActivityCard";
import { ConsentCard, PipelineStagesCard, SourcesCard } from "@/components/rd/dashboard/SummaryCards";
import { useSession } from "@/hooks/rd/useSession";
import { useWorkspaceIdentity } from "@/hooks/rd/useWorkspaceIdentity";
import { useDashboardData } from "@/hooks/rd/useDashboardData";
import { useActivityFeed } from "@/hooks/rd/useDashboardFeed";
import { MIN_RESPONSE_SAMPLE, pctChange, type DashSummary } from "@/lib/rd/dashboard";
import { appLocale, formatCad, formatClock, formatCount, formatLongDate, formatPct, type AppLocale } from "@/lib/rd/format";
import { isNativeApp } from "@/lib/native/platform";
import type { TFunction } from "i18next";

// /app — dashboard v2 (Sprint A of docs/DASHBOARD_AUDIT_2026-10.md).
//
// Rendered only when useDashboardV2Flag is on; v1 stays the default until the
// redesign is approved. Layout, top to bottom:
//   greeting + one-sentence takeaway built from real counts
//   six KPI tiles, each a link to the list it counts, each naming its window
//   Next up (ranked queue)  |  pipeline by stage, CASL consent
//   lead sources            |  recent activity
// Every figure comes from useDashboardData, which pages through all contacts.

export default function DashboardV2() {
  const { t, i18n } = useTranslation();
  const locale = appLocale(i18n.language);
  const { user } = useSession();
  const identity = useWorkspaceIdentity();
  const { summary, queue, names, loading, error, refetch, updatedAt } = useDashboardData();
  const { activity, loading: activityLoading } = useActivityFeed();
  const [addOpen, setAddOpen] = useState(false);
  // On the web this page is an opt-in preview and says so, with a link back to
  // the current dashboard. Inside the iOS / Android app it is the only
  // dashboard (useDashboardV2Flag), so "Preview" would be untrue there, and
  // the way back leads to the v1 wording the app exists to avoid.
  const isPreview = !isNativeApp();

  const firstName = (() => {
    // Settings edits profiles.full_name; the auth metadata keeps the name typed
    // at sign-up forever, so it is only the fallback while the profile loads.
    const meta = user?.user_metadata as Record<string, unknown> | undefined;
    const metaName = typeof meta?.full_name === "string" ? meta.full_name : "";
    const full = (!identity.loading && identity.agentName) || metaName || user?.email || "";
    return full.split(/\s+|@/)[0] || "";
  })();
  const hour = new Date().getHours();
  const salute =
    hour < 12
      ? t("rd.pages.dashboard.saluteMorning", "Good morning")
      : hour < 18
        ? t("rd.pages.dashboard.saluteAfternoon", "Good afternoon")
        : t("rd.pages.dashboard.saluteEvening", "Good evening");

  return (
    <AppShell>
      <div className="px-4 py-5 sm:px-6 lg:px-7 lg:py-7 pb-10 max-w-[1440px]">
        {/* Header */}
        <div className="flex flex-wrap items-end justify-between gap-4 mb-5">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[13px] text-rd-terra-800 font-semibold tracking-[0.02em]">
                {formatLongDate(new Date(), locale)}
              </span>
              {isPreview && <RDBadge tone="terra" size="sm">{t("rd.dash.kpi.previewBadge")}</RDBadge>}
            </div>
            <h1 className="text-[26px] sm:text-[30px] font-semibold tracking-[-0.02em] mt-1">
              {firstName ? `${salute}, ${firstName}.` : `${salute}.`}{" "}
              <span className="font-rd-serif italic font-normal text-rd-ink-500">{t("rd.dash.subhead")}</span>
            </h1>
            <p className="mt-2 text-[15px] text-rd-ink-700 max-w-[70ch]" aria-live="polite">
              {summary ? takeaway(summary, t) : " "}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2.5">
            {updatedAt && (
              <span className="text-xs text-rd-ink-500">
                {t("rd.dash.updated", { time: formatClock(new Date(updatedAt), locale) })}
              </span>
            )}
            <RDButton variant="outline" size="sm" onClick={() => refetch()}>
              {t("rd.dash.refresh")}
            </RDButton>
            <RDButton variant="primary" size="sm" icon={<IconPlus />} onClick={() => setAddOpen(true)}>
              {t("rd.dash.newLead")}
            </RDButton>
            <AddLeadDialog open={addOpen} onClose={() => setAddOpen(false)} />
          </div>
        </div>

        {error && (
          <div role="alert" className="mb-4 px-4 py-3 rounded-rd-sm border border-rd-danger/30 bg-rd-danger-bg text-[13px] text-rd-danger flex flex-wrap items-center gap-3">
            <span>{t("rd.dash.error", { message: error.message })}</span>
            <button type="button" onClick={() => refetch()} className="font-semibold underline">
              {t("rd.dash.retry")}
            </button>
          </div>
        )}

        {/* KPI row */}
        <section aria-label={t("rd.dash.kpi.region")}>
          {loading || !summary ? (
            <SkeletonStatRow count={6} className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3" />
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
              {tiles(summary, t, locale).map((k) => (
                <KpiTile key={k.href + k.label} {...k} openLabel={t("rd.dash.kpi.open")} />
              ))}
            </div>
          )}
        </section>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] gap-4 mt-5 items-start">
          <NextUpCard items={queue} loading={loading} />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4">
            <PipelineStagesCard summary={summary} loading={loading} />
            <ConsentCard summary={summary} loading={loading} />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] gap-4 mt-4 items-start">
          <SourcesCard summary={summary} loading={loading} />
          <ActivityCard activity={activity} loading={activityLoading} names={names} />
        </div>

        {isPreview && (
          <p className="mt-6 text-xs text-rd-ink-500">
            {t("rd.dash.kpi.previewNote")}{" "}
            <Link to="/app?v=1" className="font-semibold text-rd-navy-800 hover:underline">
              {t("rd.dash.kpi.previewExit")}
            </Link>
          </p>
        )}
      </div>
    </AppShell>
  );
}

function takeaway(s: DashSummary, t: TFunction): string {
  const parts: string[] = [];
  if (s.awaitingReply > 0) parts.push(t("rd.dash.takeaway.awaiting", { count: s.awaitingReply }));
  if (s.followupsDue > 0) parts.push(t("rd.dash.takeaway.due", { count: s.followupsDue }));
  if (s.newLeads7d > 0) parts.push(t("rd.dash.takeaway.newLeads", { count: s.newLeads7d }));
  if (parts.length === 0) return t("rd.dash.takeaway.allClear");
  return parts.join(" · ") + ".";
}

interface TileSpec {
  label: string;
  value: string;
  unit?: string;
  detail?: string;
  detailTone?: Tone;
  window: string;
  href: string;
  emphasis?: boolean;
}

function deltaDetail(
  change: number | null,
  lowerIsBetter: boolean,
  t: TFunction,
  locale: AppLocale
): { detail: string; detailTone: Tone } {
  if (change === null) return { detail: t("rd.dash.kpi.noPrev"), detailTone: "neutral" };
  const better = lowerIsBetter ? change < 0 : change > 0;
  const arrow = change > 0 ? "▲" : change < 0 ? "▼" : "";
  return {
    detail: `${arrow} ${formatPct(Math.abs(change), locale)} ${t("rd.dash.kpi.vsPrev")}`.trim(),
    detailTone: change === 0 ? "neutral" : better ? "good" : "bad",
  };
}

function tiles(s: DashSummary, t: TFunction, locale: AppLocale): TileSpec[] {
  const out: TileSpec[] = [];

  {
    const label = t("rd.dash.kpi.awaiting");
    const value = formatCount(s.awaitingReply, locale);
    out.push({
      label, value,
      window: t("rd.dash.kpi.awaitingWindow"),
      href: "/app/inbox?filter=awaiting",
      emphasis: s.awaitingReply > 0,
    });
  }
  {
    const label = t("rd.dash.kpi.followups");
    const value = formatCount(s.followupsDue, locale);
    out.push({
      label, value,
      detail: s.followupsOverdue > 0 ? t("rd.dash.kpi.overdue", { count: s.followupsOverdue }) : undefined,
      detailTone: "bad",
      window: t("rd.dash.kpi.followupsWindow"),
      href: "/app/leads?view=due",
    });
  }
  {
    const label = t("rd.dash.kpi.newLeads");
    const value = formatCount(s.newLeads7d, locale);
    out.push({
      label, value,
      ...deltaDetail(pctChange(s.newLeads7d, s.newLeadsPrev7d || null), false, t, locale),
      window: t("rd.dash.kpi.newLeadsWindow"),
      href: "/app/leads?view=new7d",
    });
  }
  {
    const label = t("rd.dash.kpi.firstResponse");
    const m = s.firstResponseMedianMin;
    const value = m === null ? "—" : formatCount(Math.round(m), locale);
    const d =
      m === null
        ? { detail: t("rd.dash.kpi.firstResponseLow", { min: MIN_RESPONSE_SAMPLE }), detailTone: "neutral" as Tone }
        : deltaDetail(pctChange(m, s.firstResponsePrevMedianMin), true, t, locale);
    out.push({
      label, value,
      unit: m === null ? undefined : t("rd.dash.kpi.minutes"),
      ...d,
      window: t("rd.dash.kpi.firstResponseWindow"),
      href: "/app/inbox",
    });
  }
  {
    const label = t("rd.dash.kpi.pipeline");
    const value = formatCad(s.pipelineValue, locale, true);
    out.push({
      label, value,
      detail: t("rd.dash.kpi.pipelineDetail", { count: s.openLeads }),
      detailTone: "neutral",
      window: t("rd.dash.kpi.pipelineWindow"),
      href: "/app/pipeline",
    });
  }
  {
    const label = t("rd.dash.kpi.consent");
    const share = s.consent.open > 0 ? s.consent.consented / s.consent.open : null;
    const value = share === null ? "—" : formatPct(share, locale);
    out.push({
      label, value,
      detail: t("rd.dash.kpi.consentDetail", { consented: s.consent.consented, open: s.consent.open }),
      detailTone: share !== null && share < 0.5 ? "warn" : "neutral",
      window: t("rd.dash.kpi.consentWindow"),
      href: "/app/leads?view=open",
    });
  }
  return out;
}
