import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AppShell } from "@/components/rd/layout/AppShell";
import {
  RDButton,
  RDAvatar,
  RDScore,
  IconFilter,
  IconMail,
  IconPhone,
  IconChevron,
  IconSparkles,
  IconPlus,
} from "@/components/rd";
import { RDTabs } from "@/components/rd/Tabs";
import { DataError, EmptyLeads } from "@/components/rd/DataState";
import type { Lead, PipelineStage } from "@/types/rd";
import { cn } from "@/lib/utils";
import { useLeads } from "@/hooks/rd/useLeads";
import { AddLeadDialog } from "@/components/rd/AddLeadDialog";

// /app/leads — Leads table per rd-app.jsx Artboard_Leads.
//
// Data source: `useLeads()` queries public.contacts scoped to the signed-in
// user via RLS. There is no fixture fallback: an empty account renders a real
// zero-state and a failed query renders an error. Substituting fixtures on
// error was how a real lead could be accepted and then sit invisible behind a
// screen that looked healthy and full.

const LEADS_GRID = "24px 2fr 1.4fr 1fr 1.4fr 1fr 1.2fr 100px";
const GRID_STYLE = { display: "grid", gridTemplateColumns: LEADS_GRID };

type TabKey = "all" | "hot" | "warm" | "cold" | "ai";

export default function Leads() {
  const { t } = useTranslation();
  const [tab, setTab] = useState<TabKey>("all");
  const [addOpen, setAddOpen] = useState(false);
  const [sortDesc, setSortDesc] = useState(true);
  const [page, setPage] = useState(0);
  const { leads: liveLeads, loading, error } = useLeads();

  // Derive whether we're rendering real or fixture data. Real wins whenever
  // the current user has at least one contact.
  // Never substitute fixtures. This used to fall back to MOCK_LEADS whenever
  // the query returned nothing OR errored -- so a schema/RLS fault rendered
  // convincing fake leads while a real lead sat invisible behind the error.
  const source: Lead[] = liveLeads;

  const counts = useMemo(() => {
    const hot = source.filter((l) => l.score >= 80).length;
    const warm = source.filter((l) => l.score >= 60 && l.score < 80).length;
    const cold = source.filter((l) => l.score < 60).length;
    const ai = source.filter((l) => l.aiHandling).length;
    return { hot, warm, cold, ai };
  }, [source]);

  const rows = useMemo(() => {
    let items = source;
    if (tab === "hot") items = source.filter((l) => l.score >= 80);
    else if (tab === "warm") items = source.filter((l) => l.score >= 60 && l.score < 80);
    else if (tab === "cold") items = source.filter((l) => l.score < 60);
    else if (tab === "ai") items = source.filter((l) => l.aiHandling);
    return [...items].sort((a, b) => (sortDesc ? b.score - a.score : a.score - b.score));
  }, [tab, source, sortDesc]);

  // Real pagination. The footer used to read "Showing 1–9 of 247" with a
  // dead 28-page pager — both numbers invented.
  const PAGE_SIZE = 25;
  const pageCount = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount - 1);
  const pageRows = rows.slice(safePage * PAGE_SIZE, (safePage + 1) * PAGE_SIZE);

  return (
    <AppShell>
      <AddLeadDialog open={addOpen} onClose={() => setAddOpen(false)} />
      <div className="px-7 py-6 pb-10">
        {/* Header */}
        <div className="flex flex-wrap justify-between items-end gap-4 mb-5">
          <div>
            <div className="text-xs text-rd-ink-500 font-semibold tracking-[0.02em]">
              {source.length} total · {counts.hot} hot
              {loading && <span className="ml-2 text-rd-ink-400">· loading…</span>}
              {error && (
                <span className="ml-2 text-rd-danger">
                  · {error.message}
                </span>
              )}
            </div>
            <h1 className="text-[28px] font-semibold tracking-[-0.02em] mt-0.5">
              {t("rd.pages.leads.title", "Leads")}
            </h1>
          </div>
          <div className="flex gap-2">
            <RDButton variant="outline" size="sm" icon={<IconFilter />}>
              {t("rd.actions.filter", "Filter")}
            </RDButton>
            <RDButton variant="outline" size="sm">
              {t("rd.actions.import", "Import")}
            </RDButton>
            <RDButton
              variant="primary"
              size="sm"
              icon={<IconPlus />}
              onClick={() => setAddOpen(true)}
            >
              {t("rd.actions.addLead", "Add lead")}
            </RDButton>
          </div>
        </div>

        {error && <div className="mb-4"><DataError message={error.message} /></div>}

        {/* Tabs + sort */}
        <div className="flex items-center justify-between mb-4">
          <RDTabs
            value={tab}
            onValueChange={(v) => setTab(v as TabKey)}
            items={[
              { value: "all", label: t("rd.tabs.leads.all", "All") },
              { value: "hot", label: t("rd.tabs.leads.hot", "Hot"), count: counts.hot },
              { value: "warm", label: t("rd.tabs.leads.warm", "Warm"), count: counts.warm },
              { value: "cold", label: t("rd.tabs.leads.cold", "Cold"), count: counts.cold },
              { value: "ai", label: t("rd.tabs.leads.aiHandled", "AI-handled"), count: counts.ai },
            ]}
          />
          <div className="flex items-center gap-2 pb-2 text-xs">
            <span className="text-[11px] font-bold uppercase tracking-[0.06em] text-rd-ink-500">
              {t("rd.actions.sort", "Sort")}
            </span>
            <button
              type="button"
              onClick={() => setSortDesc((d) => !d)}
              aria-pressed={!sortDesc}
              className="px-2.5 py-1 text-xs border border-rd-line rounded-rd-sm bg-white hover:border-rd-ink-400 cursor-pointer"
            >
              {sortDesc
                ? t("rd.actions.scoreHighToLow", "Score · high to low")
                : t("rd.actions.scoreLowToHigh", "Score · low to high")}
            </button>
          </div>
        </div>

        {/* Table. A genuine zero-state replaces the old fixture fallback. */}
        {!loading && !error && source.length === 0 ? (
          <EmptyLeads onAdd={() => setAddOpen(true)} />
        ) : (
        <div className="bg-white border border-rd-line rounded-rd-lg overflow-hidden shadow-rd-sm">
          <div
            style={GRID_STYLE}
            className="px-5 py-3 bg-rd-ink-50 border-b border-rd-line text-[11px] font-bold uppercase tracking-[0.06em] text-rd-ink-500 items-center"
          >
            <input type="checkbox" aria-label={t("rd.common.selectAll", "Select all")} />
            <div>{t("rd.columns.leads.lead", "Lead")}</div>
            <div>{t("rd.columns.leads.listing", "Listing")}</div>
            <div>{t("rd.columns.leads.source", "Source")}</div>
            <div>{t("rd.columns.leads.aiScore", "AI score")}</div>
            <div>{t("rd.columns.leads.stage", "Stage")}</div>
            <div>{t("rd.columns.leads.lastActivity", "Last activity")}</div>
            <div />
          </div>
          {pageRows.map((l, i) => (
            <LeadRow key={l.id} lead={l} isLast={i === pageRows.length - 1} />
          ))}
        </div>

        )}

        {source.length > 0 && (
        <div className="mt-3 flex justify-between items-center text-xs text-rd-ink-500">
          <span>
            {t("rd.leads.showing", "Showing {{from}}–{{to}} of {{total}}", {
              from: rows.length === 0 ? 0 : safePage * PAGE_SIZE + 1,
              to: Math.min((safePage + 1) * PAGE_SIZE, rows.length),
              total: rows.length,
            })}
          </span>
          {pageCount > 1 && (
            <Pagination page={safePage} pageCount={pageCount} onPage={setPage} />
          )}
        </div>
        )}
      </div>
    </AppShell>
  );
}

/* ────────────────────────────────────────────────────────── */

function LeadRow({ lead, isLast }: { lead: Lead; isLast: boolean }) {
  return (
    <Link
      to={`/app/leads/${lead.id}`}
      style={GRID_STYLE}
      className={cn(
        "px-5 py-3.5 items-center text-[13px] hover:bg-rd-ink-50 transition-colors",
        !isLast && "border-b border-rd-line"
      )}
    >
      <input
        type="checkbox"
        aria-label={`Select ${lead.name}`}
        onClick={(e) => e.stopPropagation()}
      />
      <div className="flex items-center gap-2.5 min-w-0">
        <RDAvatar name={lead.name} size={30} />
        <div className="min-w-0">
          <div className="font-semibold flex items-center gap-1.5 truncate">
            {lead.name}
            <span
              className={cn(
                "text-[9px] font-bold tracking-[0.06em] rounded-[3px] px-1.5 py-[1px]",
                lead.language === "FR"
                  ? "bg-rd-terra-100 text-rd-terra-800"
                  : "bg-rd-navy-100 text-rd-navy-800"
              )}
            >
              {lead.language}
            </span>
          </div>
          <div className="text-[11px] text-rd-ink-500 truncate">{lead.email}</div>
        </div>
      </div>
      <div className="text-rd-ink-700 truncate">{lead.listing ?? <span className="text-rd-ink-400">—</span>}</div>
      <div>
        <span className="text-[11px] px-2 py-[2px] bg-rd-ink-100 text-rd-ink-700 rounded-[4px] font-semibold">
          {lead.source}
        </span>
      </div>
      <RDScore value={lead.score} />
      <div>
        <StageBadge stage={lead.stage} />
      </div>
      <div className="flex items-center gap-1.5 text-rd-ink-600 text-xs">
        {lead.aiHandling && (
          <span title="AI-handled" className="text-rd-terra-700">
            <IconSparkles className="w-3 h-3" />
          </span>
        )}
        {lead.lastActivity}
      </div>
      <div className="flex justify-end gap-1">
        <IconBtn aria-label="Email">
          <IconMail />
        </IconBtn>
        <IconBtn aria-label="Call">
          <IconPhone />
        </IconBtn>
        <IconBtn aria-label="Open">
          <IconChevron />
        </IconBtn>
      </div>
    </Link>
  );
}

function IconBtn({ children, ...rest }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      onClick={(e) => e.stopPropagation()}
      className="w-[26px] h-[26px] rounded-rd-sm flex items-center justify-center text-rd-ink-500 hover:bg-rd-ink-100 hover:text-rd-ink-900"
      {...rest}
    >
      {children}
    </button>
  );
}

/* ────────────────────────────────────────────────────────── */

const STAGE_META: Record<PipelineStage, { bg: string; fg: string; dot: string; label: string }> = {
  new: { bg: "bg-rd-terra-100", fg: "text-rd-terra-800", dot: "bg-rd-terra-600", label: "New" },
  contacted: {
    bg: "bg-rd-navy-100",
    fg: "text-rd-navy-800",
    dot: "bg-rd-navy-500",
    label: "Contacted",
  },
  qualified: {
    bg: "bg-rd-navy-100",
    fg: "text-rd-navy-800",
    dot: "bg-rd-navy-600",
    label: "Qualified",
  },
  showing: {
    bg: "bg-[#E9F0F6]",
    fg: "text-rd-navy-700",
    dot: "bg-rd-navy-700",
    label: "Showing",
  },
  offer: {
    bg: "bg-rd-success-bg",
    fg: "text-rd-success",
    dot: "bg-rd-success",
    label: "Offer",
  },
  won: {
    bg: "bg-rd-success-bg",
    fg: "text-rd-success",
    dot: "bg-rd-success",
    label: "Won",
  },
  lost: {
    bg: "bg-rd-ink-100",
    fg: "text-rd-ink-600",
    dot: "bg-rd-ink-400",
    label: "Lost",
  },
};

function StageBadge({ stage }: { stage: PipelineStage }) {
  const { t } = useTranslation();
  const s = STAGE_META[stage];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-[3px] rounded-[5px]",
        s.bg,
        s.fg
      )}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {t(`rd.stages.${stage}`, s.label)}
    </span>
  );
}

function Pagination({
  page,
  pageCount,
  onPage,
}: {
  page: number;
  pageCount: number;
  onPage: (p: number) => void;
}) {
  // Replaces a decorative pager hardcoded to 28 pages of a fictional 247
  // leads. Renders only real pages and actually navigates.
  return (
    <div className="flex gap-1">
      <button
        type="button"
        onClick={() => onPage(Math.max(0, page - 1))}
        disabled={page === 0}
        aria-label="Previous page"
        className="px-2.5 py-1.5 text-xs font-semibold border border-rd-line rounded-rd-sm min-w-[28px] bg-white text-rd-ink-700 disabled:opacity-40 cursor-pointer disabled:cursor-default"
      >
        ‹
      </button>
      {Array.from({ length: pageCount }, (_, i) => (
        <button
          key={i}
          type="button"
          onClick={() => onPage(i)}
          aria-current={i === page ? "page" : undefined}
          className={cn(
            "px-2.5 py-1.5 text-xs font-semibold border border-rd-line rounded-rd-sm min-w-[28px] cursor-pointer",
            i === page ? "bg-rd-navy-800 text-white border-rd-navy-800" : "bg-white text-rd-ink-700"
          )}
        >
          {i + 1}
        </button>
      ))}
      <button
        type="button"
        onClick={() => onPage(Math.min(pageCount - 1, page + 1))}
        disabled={page >= pageCount - 1}
        aria-label="Next page"
        className="px-2.5 py-1.5 text-xs font-semibold border border-rd-line rounded-rd-sm min-w-[28px] bg-white text-rd-ink-700 disabled:opacity-40 cursor-pointer disabled:cursor-default"
      >
        ›
      </button>
    </div>
  );
}
