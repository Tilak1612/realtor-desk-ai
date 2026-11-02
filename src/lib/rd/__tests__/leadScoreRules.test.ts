import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { answersToInput, scoreLead, type ScorerAnswers } from "../leadScoreRules";

const fn = readFileSync(join(process.cwd(), "supabase/functions/calculate-lead-score/index.ts"), "utf8");

const score = (a: Partial<ScorerAnswers>) =>
  scoreLead(answersToInput({ timeline: "1-3_months", preApproved: true, engagement: "opens", listings: 3, ...a }));

describe("homepage lead scorer", () => {
  it("uses the same weights as calculate-lead-score", () => {
    // If one of these fails, the edge function's rules changed: update
    // leadScoreRules.ts to match, then update the expected values here.
    for (const [tl, pts] of [["0-30_days", 15], ["1-3_months", 12], ["3-6_months", 8], ["6+_months", 4]] as const) {
      expect(fn).toMatch(new RegExp(`case "${tl.replace("+", "\\+")}":\\s*timelineScore = ${pts};`));
    }
    expect(fn).toMatch(/let timelineScore = 2;/);
    expect(fn).toMatch(/let budgetMatchScore = 15;/);
    expect(fn).toMatch(/pre_approved\) \{\s*qualificationScore = 5;/);
    expect(fn).toMatch(/engagementScore \+= openRate \* 10;/);
    expect(fn).toMatch(/engagementScore \+= 5;/);
    expect(fn).toMatch(/Math\.min\(\(stats\.website_visits \/ 10\) \* 10, 10\)/);
    expect(fn).toMatch(/Math\.min\(\(stats\.properties_viewed \/ 5\) \* 10, 10\)/);
    expect(fn).toMatch(/avg_session_duration > 180/);
    expect(fn).toMatch(/totalScore >= 80[\s\S]*totalScore >= 60[\s\S]*totalScore >= 40/);
  });

  it("starts warm, as the hero shows it on load", () => {
    const r = score({});
    expect(r.total).toBe(67);
    expect(r.actions).toEqual(["marketReport", "shareMatches", "followUpCall"]);
  });

  it("turns hot when the lead replies and wants to move this month", () => {
    const r = score({ timeline: "0-30_days", engagement: "replies" });
    expect(r.total).toBeGreaterThanOrEqual(80);
    expect(r.actions[0]).toBe("scheduleViewing");
    expect(r.actions).not.toContain("sendPreapproval");
  });

  it("asks for pre-approval when a hot lead does not have it", () => {
    const r = score({ timeline: "0-30_days", engagement: "replies", listings: 5, preApproved: false });
    expect(r.total).toBeGreaterThanOrEqual(80);
    expect(r.actions).toContain("sendPreapproval");
  });

  it("drops to the long nurture for a quiet lead with no timeline", () => {
    const r = score({ timeline: "not_specified", engagement: "none", listings: 0, preApproved: false });
    expect(r.total).toBe(17);
    expect(r.actions[0]).toBe("updateContact");
  });

  it("never leaves 0 to 100 and reports factors as percentages", () => {
    const max = score({ timeline: "0-30_days", engagement: "replies", listings: 5 });
    expect(max.total).toBeLessThanOrEqual(100);
    for (const v of Object.values(max.factors)) expect(v).toBeGreaterThanOrEqual(0);
    expect(max.factors.timeline).toBe(100);
    expect(max.factors.budget_match).toBe(75);
  });
});
