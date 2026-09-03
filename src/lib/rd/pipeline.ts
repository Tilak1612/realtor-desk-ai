import type { Lead, PipelineStage } from "@/types/rd";

/**
 * One definition of "open pipeline", shared by every surface that reports it.
 *
 * Before this existed, the same book was reported three different ways on
 * three screens the user can see at once:
 *
 *   - Dashboard "Pipeline value" summed EVERY lead, including won and lost.
 *   - The dashboard snapshot card summed only new/contacted/showing/offer,
 *     silently dropping `qualified` — so a qualified lead and its budget were
 *     invisible on that card while counting in the KPI directly above it.
 *   - The Pipeline page header summed all stages again, producing a third
 *     figure.
 *
 * On the Team demo book that read as $11.0M, $9.8M and $11,020,000
 * simultaneously. Any agent who noticed stopped trusting every other number.
 *
 * A lead is OPEN until it is won or lost. Won revenue is not pipeline — it has
 * already landed — and lost is not pipeline either. Report those separately.
 */

/** Stages a lead passes through while still in play, in board order. */
export const OPEN_STAGES: readonly PipelineStage[] = [
  "new",
  "contacted",
  "qualified",
  "showing",
  "offer",
] as const;

/** Terminal stages. Excluded from every "pipeline" and "active" figure. */
export const CLOSED_STAGES: readonly PipelineStage[] = ["won", "lost"] as const;

export function isOpenStage(stage: PipelineStage): boolean {
  return OPEN_STAGES.includes(stage);
}

/** Leads still in play — the denominator for anything called "active". */
export function openLeads(leads: Lead[]): Lead[] {
  return leads.filter((l) => isOpenStage(l.stage));
}

/**
 * Total budget across open leads only.
 *
 * Note this is the sum of what BUYERS said they can spend, not commission and
 * not revenue. Label it accordingly wherever it is rendered.
 */
export function openPipelineValue(leads: Lead[]): number {
  return openLeads(leads).reduce((sum, l) => sum + (l.budgetCad ?? 0), 0);
}

/** Per-stage counts and values over the open stages, in board order. */
export function openPipelineByStage(
  leads: Lead[]
): { stage: PipelineStage; count: number; valueCad: number }[] {
  return OPEN_STAGES.map((stage) => {
    const inStage = leads.filter((l) => l.stage === stage);
    return {
      stage,
      count: inStage.length,
      valueCad: inStage.reduce((sum, l) => sum + (l.budgetCad ?? 0), 0),
    };
  });
}
