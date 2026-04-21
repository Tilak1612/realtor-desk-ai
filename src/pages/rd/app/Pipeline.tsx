import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AppShell } from "@/components/rd/layout/AppShell";
import {
  RDButton,
  RDAvatar,
  IconPlus,
  IconFilter,
  IconSparkles,
} from "@/components/rd";
import { MOCK_LEADS, PIPELINE_STAGES } from "@/data/rd";
import type { Lead, PipelineStage } from "@/types/rd";
import { cn } from "@/lib/utils";
import { useLeads } from "@/hooks/rd/useLeads";

// /app/pipeline — Pipeline kanban per rd-app.jsx Artboard_Pipeline.
// Rollups + cards come from useLeads() — the same live source as the
// leads table, so anywhere a stage is updated flows through both views
// once mutations land. Still no drag-drop (visual-only); stage mutation
// UX ships in a later rung.

type ViewMode = "kanban" | "list" | "forecast";

// Columns to render. The Pipeline artboard shows 5 working stages —
// "won" stands in for Closed won, "lost" stays off the kanban to keep
// the grid sized at 5 columns.
const COLUMNS: PipelineStage[] = ["new", "contacted", "qualified", "showing", "offer"];

export default function Pipeline() {
  const [view, setView] = useState<ViewMode>("kanban");
  const { leads: liveLeads, loading } = useLeads();
  const isLive = !loading && liveLeads.length > 0;
  const source: Lead[] = isLive ? liveLeads : MOCK_LEADS;

  // Roll totals up by stage.
  const snapshot = useMemo(() => {
    const byStage: Record<PipelineStage, { count: number; valueCad: number }> = {
      new: { count: 0, valueCad: 0 },
      contacted: { count: 0, valueCad: 0 },
      qualified: { count: 0, valueCad: 0 },
      showing: { count: 0, valueCad: 0 },
      offer: { count: 0, valueCad: 0 },
      won: { count: 0, valueCad: 0 },
      lost: { count: 0, valueCad: 0 },
    };
    for (const lead of source) {
      byStage[lead.stage].count += 1;
      byStage[lead.stage].valueCad += lead.budgetCad ?? 0;
    }
    return byStage;
  }, [source]);

  const totalValue = Object.values(snapshot).reduce((a, b) => a + b.valueCad, 0);
  const totalCount = source.length;

  return (
    <AppShell>
      <div className="p-7 pb-10 h-full flex flex-col">
        {/* Header */}
        <div className="flex flex-wrap justify-between items-end gap-4 mb-5">
          <div>
            <div className="text-xs text-rd-ink-500 font-semibold">
              Total pipeline · {formatCad(totalValue)} · {totalCount} leads
              {!isLive && !loading && (
                <span className="ml-2 text-rd-terra-700">· sample data</span>
              )}
            </div>
            <h1 className="text-[28px] font-semibold tracking-[-0.02em] mt-0.5">Pipeline</h1>
          </div>
          <div className="flex gap-2">
            <ViewToggle view={view} onChange={setView} />
            <RDButton variant="outline" size="sm" icon={<IconFilter />}>
              All agents
            </RDButton>
            <RDButton variant="primary" size="sm" icon={<IconPlus />}>
              Add lead
            </RDButton>
          </div>
        </div>

        {view === "kanban" && (
          <div className="flex-1 grid gap-3.5 min-h-0 overflow-x-auto pb-2"
               style={{ gridTemplateColumns: `repeat(${COLUMNS.length}, minmax(240px, 1fr))` }}>
            {COLUMNS.map((stageId) => {
              const meta = PIPELINE_STAGES.find((s) => s.id === stageId)!;
              const rollup = snapshot[stageId];
              const leadsIn = source.filter((l) => l.stage === stageId);
              return (
                <KanbanColumn
                  key={stageId}
                  stageId={stageId}
                  label={meta.label}
                  toneClass={meta.toneClass}
                  count={rollup.count}
                  valueCad={rollup.valueCad}
                  leads={leadsIn}
                />
              );
            })}
          </div>
        )}

        {view === "list" && (
          <div className="flex-1 bg-white border border-rd-line rounded-rd-lg shadow-rd-sm overflow-hidden">
            <div className="px-5 py-4 text-sm text-rd-ink-500">
              List view lives at{" "}
              <Link to="/app/leads" className="text-rd-navy-800 underline">
                /app/leads
              </Link>{" "}
              — this toggle exists for parity with the design; it links rather than duplicating the
              table.
            </div>
          </div>
        )}

        {view === "forecast" && (
          <div className="flex-1 bg-white border border-rd-line rounded-rd-lg shadow-rd-sm flex items-center justify-center text-sm text-rd-ink-500">
            Forecast view ships in the Reports phase.
          </div>
        )}
      </div>
    </AppShell>
  );
}

/* ────────────────────────────────────────────────────────── */

function ViewToggle({ view, onChange }: { view: ViewMode; onChange: (v: ViewMode) => void }) {
  const items: ViewMode[] = ["kanban", "list", "forecast"];
  return (
    <div className="flex p-[3px] bg-white border border-rd-line rounded-rd-sm">
      {items.map((v) => (
        <button
          key={v}
          type="button"
          onClick={() => onChange(v)}
          className={cn(
            "px-3 py-[5px] text-xs font-semibold capitalize rounded-[5px] transition-colors",
            view === v
              ? "bg-rd-navy-800 text-white"
              : "bg-transparent text-rd-ink-600 hover:text-rd-ink-900"
          )}
        >
          {v}
        </button>
      ))}
    </div>
  );
}

/* ────────────────────────────────────────────────────────── */

function KanbanColumn({
  stageId,
  label,
  toneClass,
  count,
  valueCad,
  leads,
}: {
  stageId: PipelineStage;
  label: string;
  toneClass: string;
  count: number;
  valueCad: number;
  leads: Lead[];
}) {
  return (
    <div className="flex flex-col bg-rd-ink-50 border border-rd-line rounded-[12px] p-2.5 overflow-hidden min-w-0">
      <div className="px-1.5 pt-1.5 pb-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className={cn("w-2 h-2 rounded-full", toneClass)} />
          <span className="text-xs font-bold">{label}</span>
          <span className="text-[11px] text-rd-ink-500">{count}</span>
        </div>
        <span className="text-[11px] font-semibold text-rd-ink-600">
          {valueCad > 0 ? formatCadShort(valueCad) : "—"}
        </span>
      </div>
      <div className="flex flex-col gap-2 overflow-y-auto flex-1" data-stage={stageId}>
        {leads.map((l) => (
          <KanbanCard key={l.id} lead={l} />
        ))}
        <button
          type="button"
          className="border-[1.5px] border-dashed border-rd-line-strong bg-transparent rounded-rd-sm py-2.5 text-xs text-rd-ink-500 flex items-center justify-center gap-1.5 font-medium hover:text-rd-ink-700 hover:border-rd-ink-400"
        >
          <IconPlus />
          Add lead
        </button>
      </div>
    </div>
  );
}

function KanbanCard({ lead }: { lead: Lead }) {
  const band: "Hot" | "Warm" | "Cold" =
    lead.score >= 80 ? "Hot" : lead.score >= 60 ? "Warm" : "Cold";
  const tagTone = {
    Hot: "bg-rd-terra-100 text-rd-terra-800",
    Warm: "bg-rd-navy-100 text-rd-navy-800",
    Cold: "bg-rd-ink-100 text-rd-ink-600",
  }[band];
  return (
    <Link
      to={`/app/leads/${lead.id}`}
      className="block bg-white border border-rd-line rounded-rd-sm p-3 hover:shadow-rd-sm transition-shadow"
    >
      <div className="flex justify-between items-start mb-1.5 gap-2">
        <div className="text-[13px] font-semibold leading-tight flex items-center gap-1.5 min-w-0">
          <span className="truncate">{lead.name}</span>
          <span
            className={cn(
              "text-[9px] font-bold tracking-[0.06em] rounded-[3px] px-1 py-[1px] flex-shrink-0",
              lead.language === "FR"
                ? "bg-rd-terra-100 text-rd-terra-800"
                : "bg-rd-navy-100 text-rd-navy-800"
            )}
          >
            {lead.language}
          </span>
        </div>
        <span
          className={cn(
            "text-[10px] font-bold tracking-[0.04em] px-1.5 py-[2px] rounded-[4px] flex-shrink-0",
            tagTone
          )}
        >
          {band} · {lead.score}
        </span>
      </div>
      <div className="text-[11px] text-rd-ink-600 mb-2 leading-[1.35] line-clamp-2">
        {lead.listing}
      </div>
      <div className="flex justify-between items-center text-[10px] text-rd-ink-500 gap-2">
        <span className="flex items-center gap-1 truncate">
          <RDAvatar name={lead.name} size={18} />
          {lead.lastActivity}
        </span>
        {lead.aiHandling && (
          <span className="text-rd-terra-600 flex items-center gap-1 font-semibold flex-shrink-0">
            <IconSparkles className="w-2.5 h-2.5" />
            AI
          </span>
        )}
      </div>
    </Link>
  );
}

/* ────────────────────────────────────────────────────────── */

function formatCad(cents: number): string {
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
    maximumFractionDigits: 0,
  }).format(cents);
}

function formatCadShort(cents: number): string {
  if (cents >= 1_000_000) {
    return `$${(cents / 1_000_000).toFixed(1)}M`;
  }
  if (cents >= 1_000) {
    return `$${Math.round(cents / 1_000)}K`;
  }
  return formatCad(cents);
}
