import type { PipelineStage, PipelineStageMeta } from "@/types/rd";
import { MOCK_LEADS } from "./leads";

// Pipeline stage metadata — order, labels, tone class, and live rollups
// computed off MOCK_LEADS. When backend wiring lands the rollups swap
// out for a Supabase view; shape stays identical.

export const PIPELINE_STAGES: Pick<PipelineStageMeta, "id" | "label" | "toneClass">[] = [
  { id: "new", label: "New", toneClass: "bg-rd-terra-600" },
  { id: "contacted", label: "Contacted", toneClass: "bg-rd-navy-500" },
  { id: "qualified", label: "Qualified", toneClass: "bg-rd-navy-700" },
  { id: "showing", label: "Showing", toneClass: "bg-rd-score-warm" },
  { id: "offer", label: "Offer", toneClass: "bg-rd-success" },
  { id: "won", label: "Won", toneClass: "bg-rd-success" },
  { id: "lost", label: "Lost", toneClass: "bg-rd-ink-300" },
];

export function pipelineSnapshot(): PipelineStageMeta[] {
  return PIPELINE_STAGES.map((stage) => {
    const leadsInStage = MOCK_LEADS.filter((l) => l.stage === stage.id);
    const valueCad = leadsInStage.reduce((sum, l) => sum + (l.budgetCad ?? 0), 0);
    return {
      ...stage,
      count: leadsInStage.length,
      valueCad,
    };
  });
}

export function leadsByStage(stage: PipelineStage) {
  return MOCK_LEADS.filter((l) => l.stage === stage);
}
