import { useState } from "react";
import { useTranslation } from "react-i18next";
import { AppShell } from "@/components/rd/layout/AppShell";
import {
  RDButton,
  RDBadge,
  RDCard,
  IconPlus,
  IconSparkles,
  IconLead,
  IconCalendar,
  IconChevron,
} from "@/components/rd";
import { MOCK_AUTOMATIONS } from "@/data/rd";
import type { AutomationSequence, AutomationStep } from "@/types/rd";
import { cn } from "@/lib/utils";
import { useAutomations, useToggleAutomation } from "@/hooks/rd/useAutomations";

// /app/automation — Sequences list + editor per rd-app-extra.jsx
// Artboard_Automation.
//
// Data: useAutomations() pulls automation_sequences + joined steps for
// the signed-in user. Falls back to MOCK_AUTOMATIONS when the account
// has nothing yet so the page stays demo-legible. Toggle-switch is
// wired to useToggleAutomation() — only the on/off mutation is live
// this PR; the full step editor ships in a follow-up.

type ListFilter = "all" | "active" | "draft";

export default function Automation() {
  const { t } = useTranslation();
  const { sequences: liveSequences, loading } = useAutomations();
  const isLive = !loading && liveSequences.length > 0;
  const sequences = isLive ? liveSequences : MOCK_AUTOMATIONS;

  const [selectedId, setSelectedId] = useState<string>(sequences[0]?.id ?? "");
  const [filter, setFilter] = useState<ListFilter>("all");

  const filtered = sequences.filter((s) => {
    if (filter === "active") return s.active;
    if (filter === "draft") return !s.active;
    return true;
  });

  const effectiveSelectedId =
    sequences.find((s) => s.id === selectedId) ? selectedId : sequences[0]?.id ?? "";
  const selected = sequences.find((s) => s.id === effectiveSelectedId);

  const totalEnrolled = sequences.reduce((sum, s) => sum + s.stats30d.sent, 0);
  const totalReplied = sequences.reduce((sum, s) => sum + s.stats30d.replied, 0);

  return (
    <AppShell>
      <div className="p-7 pb-10">
        {/* Header */}
        <div className="flex flex-wrap justify-between items-end gap-4 mb-6">
          <div>
            <div className="text-xs text-rd-ink-500 font-semibold">
              {sequences.length} sequences · {totalEnrolled} leads enrolled · {totalReplied}{" "}
              conversions this month
              {!isLive && !loading && (
                <span className="ml-2 text-rd-terra-700">· sample data</span>
              )}
            </div>
            <h1 className="text-[28px] font-semibold tracking-[-0.02em] mt-0.5">
              {t("rd.pages.automation.title", "Automation")}
            </h1>
          </div>
          <div className="flex gap-2">
            <RDButton variant="outline" size="sm">
              Templates
            </RDButton>
            <RDButton variant="primary" size="sm" icon={<IconPlus />}>
              New sequence
            </RDButton>
          </div>
        </div>

        {/* Split: list + editor */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-5">
          <SequenceList
            sequences={filtered}
            selectedId={effectiveSelectedId}
            onSelect={setSelectedId}
            filter={filter}
            onFilter={setFilter}
            activeCount={sequences.filter((s) => s.active).length}
            draftCount={sequences.filter((s) => !s.active).length}
            canMutate={isLive}
          />
          <SequencePreview sequence={selected} />
        </div>
      </div>
    </AppShell>
  );
}

/* ────────────────────────────────────────────────────────── */

function SequenceList({
  sequences,
  selectedId,
  onSelect,
  filter,
  onFilter,
  activeCount,
  draftCount,
  canMutate,
}: {
  sequences: AutomationSequence[];
  selectedId: string;
  onSelect: (id: string) => void;
  filter: ListFilter;
  onFilter: (f: ListFilter) => void;
  activeCount: number;
  draftCount: number;
  canMutate: boolean;
}) {
  return (
    <RDCard padding={0} className="overflow-hidden">
      <div className="px-5 py-3.5 border-b border-rd-line flex justify-between items-center bg-rd-ink-50 flex-wrap gap-3">
        <h3 className="text-sm font-semibold">All sequences</h3>
        <div className="flex gap-1.5">
          <FilterChip active={filter === "all"} onClick={() => onFilter("all")}>
            All
          </FilterChip>
          <FilterChip active={filter === "active"} onClick={() => onFilter("active")}>
            Active · {activeCount}
          </FilterChip>
          <FilterChip active={filter === "draft"} onClick={() => onFilter("draft")}>
            Draft · {draftCount}
          </FilterChip>
        </div>
      </div>

      {sequences.length === 0 && (
        <div className="px-5 py-8 text-center text-sm text-rd-ink-500">
          No sequences match this filter.
        </div>
      )}

      {sequences.map((s, i) => (
        <SequenceRow
          key={s.id}
          sequence={s}
          selected={s.id === selectedId}
          isLast={i === sequences.length - 1}
          onClick={() => onSelect(s.id)}
          canMutate={canMutate}
        />
      ))}
    </RDCard>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "px-2.5 py-1 text-[11px] font-semibold rounded-rd-pill border transition-colors",
        active
          ? "bg-rd-navy-800 text-white border-rd-navy-800"
          : "bg-transparent text-rd-ink-600 border-rd-line"
      )}
    >
      {children}
    </button>
  );
}

function SequenceRow({
  sequence,
  selected,
  isLast,
  onClick,
  canMutate,
}: {
  sequence: AutomationSequence;
  selected: boolean;
  isLast: boolean;
  onClick: () => void;
  canMutate: boolean;
}) {
  const { sent, replied } = sequence.stats30d;
  const convRate = sent > 0 ? Math.round((replied / sent) * 100) : 0;
  const toggle = useToggleAutomation();
  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!canMutate) return;
    toggle.mutate({ id: sequence.id, active: !sequence.active });
  };
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full text-left px-5 py-4 grid grid-cols-[1fr_auto] gap-4 items-center border-l-[3px] transition-colors",
        !isLast && "border-b border-rd-line",
        selected
          ? "bg-rd-navy-100 border-l-rd-navy-800"
          : "bg-transparent border-l-transparent hover:bg-rd-ink-50"
      )}
    >
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-semibold">{sequence.name}</span>
          <span className="text-[9px] font-bold tracking-[0.06em] rounded-[3px] px-1.5 py-[1px] bg-rd-ink-100 text-rd-ink-700">
            {triggerLabel(sequence.trigger)}
          </span>
          {sequence.active ? (
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-rd-success">
              <span className="w-[5px] h-[5px] rounded-full bg-rd-success" />
              Active
            </span>
          ) : (
            <span className="text-[10px] font-semibold text-rd-ink-500">Draft</span>
          )}
        </div>
        <div className="text-xs text-rd-ink-500 mb-2">{sequence.steps.length} step flow</div>
        <div className="flex gap-4 text-[11px] text-rd-ink-600">
          <span>
            <strong className="text-rd-ink-900">{sequence.steps.length}</strong> steps
          </span>
          <span>
            <strong className="text-rd-ink-900">{sent}</strong> sent
          </span>
          <span>
            <strong className="text-rd-success">{replied}</strong> replied
          </span>
          {sent > 0 && (
            <span>
              · <strong className="text-rd-ink-900">{convRate}%</strong> rate
            </span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div
          role="button"
          aria-label={sequence.active ? "Pause sequence" : "Activate sequence"}
          aria-disabled={!canMutate}
          onClick={handleToggle}
          className={canMutate ? "cursor-pointer" : "cursor-not-allowed opacity-60"}
        >
          <ToggleSwitch on={sequence.active} />
        </div>
        <span className="w-7 h-7 border border-rd-line bg-white rounded-rd-sm flex items-center justify-center text-rd-ink-500">
          <IconChevron />
        </span>
      </div>
    </button>
  );
}

function ToggleSwitch({ on }: { on: boolean }) {
  return (
    <div
      aria-hidden
      className={cn(
        "w-[34px] h-5 rounded-[10px] p-[2px] relative",
        on ? "bg-rd-success" : "bg-rd-ink-200"
      )}
    >
      <div
        className="w-4 h-4 rounded-full bg-white absolute top-[2px] transition-[left] duration-200"
        style={{ left: on ? 16 : 2, boxShadow: "0 1px 3px rgba(0,0,0,.2)" }}
      />
    </div>
  );
}

function triggerLabel(t: AutomationSequence["trigger"]): string {
  switch (t) {
    case "lead.created":
      return "New lead";
    case "lead.wentCold":
      return "Went cold";
    case "showing.scheduled":
      return "Showing";
    case "consent.captured":
      return "Consent";
  }
}

/* ────────────────────────────────────────────────────────── */

function SequencePreview({ sequence }: { sequence: AutomationSequence | undefined }) {
  if (!sequence) {
    return (
      <RDCard padding={0} className="overflow-hidden flex items-center justify-center min-h-[360px] text-sm text-rd-ink-500">
        Select a sequence to preview.
      </RDCard>
    );
  }

  return (
    <RDCard padding={0} className="overflow-hidden flex flex-col">
      <div className="px-5 py-4 border-b border-rd-line bg-rd-ink-50">
        <div className="text-[11px] text-rd-ink-500 font-semibold uppercase tracking-[0.06em] mb-1">
          Sequence · {triggerLabel(sequence.trigger)}
        </div>
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h3 className="text-[15px] font-semibold">{sequence.steps.length}-step flow</h3>
          <RDBadge tone="success" size="sm">
            CASL consent required
          </RDBadge>
        </div>
      </div>

      <div className="p-5 relative">
        {/* Vertical connector */}
        <div
          className="absolute w-[2px] bg-rd-line"
          style={{ left: 35, top: 34, bottom: 34 }}
        />
        {sequence.steps.map((step, i) => (
          <SeqStepRow
            key={step.id}
            step={step}
            index={i + 1}
            last={i === sequence.steps.length - 1}
          />
        ))}
      </div>

      <div className="px-5 py-3.5 border-t border-rd-line bg-rd-paper-2 flex justify-between items-center flex-wrap gap-2">
        <div className="text-[11px] text-rd-ink-500">
          {sequence.lastRunAt
            ? `Last run ${new Date(sequence.lastRunAt).toLocaleString("en-CA", {
                month: "short",
                day: "numeric",
                hour: "numeric",
                minute: "2-digit",
              })}`
            : "Not yet run"}
        </div>
        <div className="flex gap-2">
          <RDButton variant="outline" size="sm">
            Preview
          </RDButton>
          <RDButton variant="primary" size="sm">
            Edit flow
          </RDButton>
        </div>
      </div>
    </RDCard>
  );
}

function SeqStepRow({ step, index, last }: { step: AutomationStep; index: number; last: boolean }) {
  const tone = step.kind === "wait" ? "neutral" : step.kind === "task" ? "navy" : "terra";
  const TONE_CLASS: Record<string, string> = {
    terra: "bg-rd-terra-600",
    navy: "bg-rd-navy-800",
    neutral: "bg-rd-ink-400",
  };
  const icon =
    step.kind === "wait" ? (
      <span className="text-lg">⏱</span>
    ) : step.kind === "task" ? (
      <IconLead className="w-4 h-4" />
    ) : step.kind === "email" || step.kind === "sms" ? (
      <IconCalendar className="w-4 h-4" />
    ) : (
      <IconSparkles className="w-4 h-4" />
    );
  const delay =
    step.kind === "wait" && step.hours !== undefined
      ? `Wait ${formatHours(step.hours)}`
      : step.hours
      ? `+${formatHours(step.hours)}`
      : "instant";

  return (
    <div
      className={cn("grid grid-cols-[40px_1fr_auto] gap-4 relative", !last && "mb-4")}
    >
      <div
        className={cn(
          "w-8 h-8 rounded-rd-sm text-white flex items-center justify-center font-bold text-[13px] relative z-[1]",
          TONE_CLASS[tone]
        )}
      >
        {step.kind === "wait" ? icon : index}
      </div>
      <div>
        <div className="text-[13px] font-semibold mb-0.5">{step.label}</div>
        <div className="text-xs text-rd-ink-500 leading-[1.4]">{describeStep(step)}</div>
      </div>
      <div className="text-[11px] text-rd-ink-500 font-semibold whitespace-nowrap pt-2 tabular-nums">
        {delay}
      </div>
    </div>
  );
}

function describeStep(step: AutomationStep): string {
  switch (step.kind) {
    case "ai_followup":
      return "Desk AI picks the language and replies in-thread.";
    case "email":
      return step.templateId
        ? `Send email template · ${step.templateId}`
        : "Send email using the selected template.";
    case "sms":
      return step.templateId ? `Send SMS template · ${step.templateId}` : "Send SMS.";
    case "task":
      return "Create a follow-up task for the assigned agent.";
    case "wait":
      return step.hours ? `Wait ${formatHours(step.hours)} before the next step.` : "Wait.";
  }
}

function formatHours(h: number): string {
  if (h === 0) return "0s";
  if (h < 1) return `${Math.round(h * 60)}m`;
  if (h < 24) return `${h}h`;
  return `${Math.round(h / 24)}d`;
}
