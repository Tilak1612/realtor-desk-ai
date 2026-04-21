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
import { MOCK_LEADS } from "@/data/rd";
import type { Lead, PipelineStage } from "@/types/rd";
import { cn } from "@/lib/utils";
import { useLeads } from "@/hooks/rd/useLeads";

// /app/leads — Leads table per rd-app.jsx Artboard_Leads.
//
// Data source: `useLeads()` queries public.contacts scoped to the
// signed-in user via RLS. If the account has no rows yet, we fall back
// to MOCK_LEADS so the UI stays legible — an inline banner above the
// table says so, so fixtures are never mistaken for real data.

const LEADS_GRID = "24px 2fr 1.4fr 1fr 1.4fr 1fr 1.2fr 100px";
const GRID_STYLE = { display: "grid", gridTemplateColumns: LEADS_GRID };

type TabKey = "all" | "hot" | "warm" | "cold" | "ai" | "needs_reply";

export default function Leads() {
  const { t } = useTranslation();
  const [tab, setTab] = useState<TabKey>("all");
  const { leads: liveLeads, loading, error } = useLeads();

  // Derive whether we're rendering real or fixture data. Real wins whenever
  // the current user has at least one contact.
  const isLive = !loading && !error && liveLeads.length > 0;
  const source: Lead[] = isLive ? liveLeads : MOCK_LEADS;

  const counts = useMemo(() => {
    const hot = source.filter((l) => l.score >= 80).length;
    const warm = source.filter((l) => l.score >= 60 && l.score < 80).length;
    const cold = source.filter((l) => l.score < 60).length;
    const ai = source.filter((l) => l.aiHandling).length;
    return { hot, warm, cold, ai, needsReply: 6 };
  }, [source]);

  const rows = useMemo(() => {
    if (tab === "hot") return source.filter((l) => l.score >= 80);
    if (tab === "warm") return source.filter((l) => l.score >= 60 && l.score < 80);
    if (tab === "cold") return source.filter((l) => l.score < 60);
    if (tab === "ai") return source.filter((l) => l.aiHandling);
    return source;
  }, [tab, source]);

  return (
    <AppShell>
      <div className="px-7 py-6 pb-10">
        {/* Header */}
        <div className="flex flex-wrap justify-between items-end gap-4 mb-5">
          <div>
            <div className="text-xs text-rd-ink-500 font-semibold tracking-[0.02em]">
              {source.length} total · {counts.needsReply} new this week
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
              Filter
            </RDButton>
            <RDButton variant="outline" size="sm">
              Import
            </RDButton>
            <RDButton variant="primary" size="sm" icon={<IconPlus />}>
              Add lead
            </RDButton>
          </div>
        </div>

        {/* Fixture banner — when the signed-in user has zero contacts we
            render MOCK_LEADS so the UI is still legible in demos. Once any
            row is imported via CSV or the Add-lead flow, this banner
            disappears automatically and the table shows real data. */}
        {!isLive && !loading && (
          <div className="mb-4 px-4 py-2.5 bg-rd-terra-50 border border-rd-terra-200 rounded-rd-sm text-[12px] text-rd-terra-900 flex items-center gap-2">
            <IconSparkles className="text-rd-terra-600 flex-shrink-0" />
            <span>
              Showing <strong>sample leads</strong> — import your own via{" "}
              <Link to="/app/leads" className="underline font-semibold">
                CSV
              </Link>{" "}
              or add one with the button above to replace these.
            </span>
          </div>
        )}

        {/* Tabs + sort */}
        <div className="flex items-center justify-between mb-4">
          <RDTabs
            value={tab}
            onValueChange={(v) => setTab(v as TabKey)}
            items={[
              { value: "all", label: "All" },
              { value: "hot", label: "Hot", count: counts.hot },
              { value: "warm", label: "Warm", count: counts.warm },
              { value: "cold", label: "Cold", count: counts.cold },
              { value: "ai", label: "AI-handled", count: counts.ai },
              { value: "needs_reply", label: "Needs reply", count: counts.needsReply },
            ]}
          />
          <div className="flex items-center gap-2 pb-2 text-xs">
            <span className="text-[11px] font-bold uppercase tracking-[0.06em] text-rd-ink-500">
              Sort
            </span>
            <button
              type="button"
              className="px-2.5 py-1 text-xs border border-rd-line rounded-rd-sm bg-white"
            >
              Score · high to low
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white border border-rd-line rounded-rd-lg overflow-hidden shadow-rd-sm">
          <div
            style={GRID_STYLE}
            className="px-5 py-3 bg-rd-ink-50 border-b border-rd-line text-[11px] font-bold uppercase tracking-[0.06em] text-rd-ink-500 items-center"
          >
            <input type="checkbox" aria-label="Select all" />
            <div>Lead</div>
            <div>Listing</div>
            <div>Source</div>
            <div>AI score</div>
            <div>Stage</div>
            <div>Last activity</div>
            <div />
          </div>
          {rows.map((l, i) => (
            <LeadRow key={l.id} lead={l} isLast={i === rows.length - 1} />
          ))}
        </div>

        {/* Pagination (static — wiring later) */}
        <div className="mt-3 flex justify-between items-center text-xs text-rd-ink-500">
          <span>Showing 1–{rows.length} of 247</span>
          <Pagination />
        </div>
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
      <div className="text-rd-ink-700 truncate">{lead.listing}</div>
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
          <span title="AI-handled" className="text-rd-terra-600">
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
      {s.label}
    </span>
  );
}

function Pagination() {
  const pages = ["‹", "1", "2", "3", "4", "…", "28", "›"];
  return (
    <div className="flex gap-1">
      {pages.map((p, i) => (
        <button
          key={i}
          type="button"
          className={cn(
            "px-2.5 py-1.5 text-xs font-semibold border border-rd-line rounded-rd-sm min-w-[28px]",
            i === 1 ? "bg-rd-navy-800 text-white border-rd-navy-800" : "bg-white text-rd-ink-700"
          )}
        >
          {p}
        </button>
      ))}
    </div>
  );
}
