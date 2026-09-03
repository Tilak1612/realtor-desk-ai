import { describe, it, expect } from "vitest";
import {
  OPEN_STAGES,
  isOpenStage,
  openLeads,
  openPipelineValue,
  openPipelineByStage,
} from "../pipeline";
import type { Lead, PipelineStage } from "@/types/rd";

function lead(stage: PipelineStage, budgetCad?: number): Lead {
  return {
    id: `${stage}-${budgetCad ?? 0}`,
    name: "Test Lead",
    email: "t@example.com",
    phone: "",
    language: "EN",
    source: "Referral",
    listing: undefined,
    stage,
    score: 0,
    lastActivity: "",
    aiHandling: false,
    budgetCad,
  } as Lead;
}

// One book, reported by all three surfaces. This mirrors the Team demo
// account that exposed the bug.
const BOOK = [
  lead("new", 1_000_000),
  lead("contacted", 2_000_000),
  lead("qualified", 1_250_000), // the stage the snapshot card used to drop
  lead("showing", 500_000),
  lead("offer", 750_000),
  lead("won", 3_000_000), // closed — not pipeline
  lead("lost", 900_000), // closed — not pipeline
];

describe("open pipeline definition", () => {
  it("treats everything except won and lost as open", () => {
    expect([...OPEN_STAGES]).toEqual(["new", "contacted", "qualified", "showing", "offer"]);
    expect(isOpenStage("won")).toBe(false);
    expect(isOpenStage("lost")).toBe(false);
  });

  it("excludes won and lost from active leads", () => {
    expect(openLeads(BOOK)).toHaveLength(5);
  });

  it("excludes won and lost from pipeline value", () => {
    // 1.0 + 2.0 + 1.25 + 0.5 + 0.75 = 5.5M. Won 3.0M and lost 0.9M are out.
    expect(openPipelineValue(BOOK)).toBe(5_500_000);
  });

  it("includes qualified — the stage the snapshot card silently dropped", () => {
    const stages = openPipelineByStage(BOOK).map((r) => r.stage);
    expect(stages).toContain("qualified");
    expect(openPipelineByStage(BOOK).find((r) => r.stage === "qualified")?.valueCad).toBe(1_250_000);
  });

  /**
   * The actual defect: the dashboard KPI, the dashboard snapshot card and the
   * Pipeline page header each computed this differently, so one book read as
   * $11.0M, $9.8M and $11,020,000 on screens the user sees together. Whatever
   * the definition is, the per-stage breakdown must reconcile to the total.
   */
  it("per-stage values sum to the headline total", () => {
    const sum = openPipelineByStage(BOOK).reduce((a, r) => a + r.valueCad, 0);
    expect(sum).toBe(openPipelineValue(BOOK));
  });

  it("per-stage counts sum to the active-lead count", () => {
    const sum = openPipelineByStage(BOOK).reduce((a, r) => a + r.count, 0);
    expect(sum).toBe(openLeads(BOOK).length);
  });

  it("treats a missing budget as zero, not NaN", () => {
    expect(openPipelineValue([lead("new"), lead("offer", 100)])).toBe(100);
  });

  it("returns zeroes for an empty book rather than throwing", () => {
    expect(openPipelineValue([])).toBe(0);
    expect(openLeads([])).toHaveLength(0);
    expect(openPipelineByStage([]).every((r) => r.count === 0)).toBe(true);
  });
});
