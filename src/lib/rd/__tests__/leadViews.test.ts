import { describe, expect, it } from "vitest";
import { applyLeadView, isLeadView, isStage } from "../leadViews";
import type { Lead } from "@/types/rd";

const NOW = new Date(2026, 9, 9, 10, 0, 0);
const lead = (over: Partial<Lead>): Lead => ({
  id: Math.random().toString(36),
  name: "x",
  email: "",
  phone: "",
  language: "EN",
  source: "Other",
  listing: "",
  stage: "contacted",
  score: 0,
  lastActivity: "—",
  aiHandling: false,
  ...over,
});

describe("lead views (dashboard drill-downs)", () => {
  const leads = [
    lead({ id: "today", nextFollowupDate: "2026-10-09" }),
    lead({ id: "late", nextFollowupDate: "2026-10-06" }),
    lead({ id: "later", nextFollowupDate: "2026-10-12" }),
    lead({ id: "wonLate", stage: "won", nextFollowupDate: "2026-10-01" }),
    lead({ id: "fresh", stage: "new", createdAt: new Date(2026, 9, 7).toISOString() }),
    lead({ id: "old", stage: "showing", createdAt: new Date(2026, 8, 1).toISOString() }),
  ];
  const ids = (xs: Lead[]) => xs.map((l) => l.id);

  it("due = open leads with a follow-up today or earlier", () => {
    expect(ids(applyLeadView(leads, "due", null, NOW))).toEqual(["today", "late"]);
  });
  it("overdue = before today only", () => {
    expect(ids(applyLeadView(leads, "overdue", null, NOW))).toEqual(["late"]);
  });
  it("open excludes won and lost", () => {
    expect(ids(applyLeadView(leads, "open", null, NOW))).not.toContain("wonLate");
  });
  it("new7d uses created_at", () => {
    expect(ids(applyLeadView(leads, "new7d", null, NOW))).toEqual(["fresh"]);
  });
  it("stage filters and combines with a view", () => {
    expect(ids(applyLeadView(leads, null, "showing", NOW))).toEqual(["old"]);
  });
  it("rejects unknown params", () => {
    expect(isLeadView("everything")).toBe(false);
    expect(isStage("closed")).toBe(false);
    expect(isLeadView(null)).toBe(false);
  });
});
