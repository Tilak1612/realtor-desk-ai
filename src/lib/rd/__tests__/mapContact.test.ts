import { describe, it, expect } from "vitest";
import { mapContactToLead, formatLastActivity, type ContactRow } from "@/lib/rd/mapContact";

// Regression coverage for the contacts-row -> Lead mapper (core CRM display
// transform) and the relative-time formatter. Added by audit 2026-06-21.

const base: ContactRow = {
  id: "c1",
  first_name: "John",
  last_name: "Doe",
  email: "john@doe.com",
  phone: "416-555-0123",
  ai_score: null,
  lead_score: null,
  status: null,
  source: null,
  preferred_language: null,
  last_contact_date: null,
  consent_date: null,
  metadata: {},
};

describe("mapContactToLead", () => {
  it("joins first + last into name, trims when last is null", () => {
    expect(mapContactToLead({ ...base }).name).toBe("John Doe");
    expect(mapContactToLead({ ...base, last_name: null }).name).toBe("John");
  });

  it("normalizes language to FR only for fr, else EN", () => {
    expect(mapContactToLead({ ...base, preferred_language: "fr" }).language).toBe("FR");
    expect(mapContactToLead({ ...base, preferred_language: "FR" }).language).toBe("FR");
    expect(mapContactToLead({ ...base, preferred_language: "en" }).language).toBe("EN");
    expect(mapContactToLead({ ...base, preferred_language: null }).language).toBe("EN");
  });

  it("classifies lead source from free-text", () => {
    const src = (s: string) => mapContactToLead({ ...base, source: s }).source;
    expect(src("CREA DDF")).toBe("DDF");
    expect(src("website form")).toBe("Form");
    expect(src("facebook ad")).toBe("Ads");
    expect(src("google ads")).toBe("Ads");
    expect(src("referral from Jane")).toBe("Referral");
    expect(src("walk-in")).toBe("Other");
    expect(src("")).toBe("Other");
  });

  it("normalizes stage, defaulting unknown/space-laden values to new", () => {
    const stage = (s: string | null) => mapContactToLead({ ...base, status: s }).stage;
    expect(stage("qualified")).toBe("qualified");
    expect(stage("Showing")).toBe("showing");
    expect(stage("in progress")).toBe("new"); // not in allowed set
    expect(stage(null)).toBe("new");
  });

  it("prefers ai_score, falls back to lead_score, then 0", () => {
    expect(mapContactToLead({ ...base, ai_score: 88, lead_score: 50 }).score).toBe(88);
    expect(mapContactToLead({ ...base, ai_score: null, lead_score: 50 }).score).toBe(50);
    expect(mapContactToLead({ ...base, ai_score: null, lead_score: null }).score).toBe(0);
  });

  it("pulls redesign fields from metadata with sensible defaults", () => {
    const lead = mapContactToLead({
      ...base,
      consent_date: "2026-01-01T00:00:00Z",
      metadata: {
        listing: "123 Main St",
        city: "Toronto",
        aiHandling: true,
        aiNextBest: "Call now",
        budgetCad: 750000,
        assignedAgentId: "agent-9",
      },
    });
    expect(lead.listing).toBe("123 Main St");
    expect(lead.city).toBe("Toronto");
    expect(lead.aiHandling).toBe(true);
    expect(lead.aiNextBest).toBe("Call now");
    expect(lead.budgetCad).toBe(750000);
    expect(lead.assignedAgentId).toBe("agent-9");
    expect(lead.caslConsentAt).toBe("2026-01-01T00:00:00Z");
  });

  it("applies defaults when metadata is empty", () => {
    const lead = mapContactToLead({ ...base });
    expect(lead.listing).toBe("New lead");
    expect(lead.aiHandling).toBe(false);
    expect(lead.budgetCad).toBeUndefined();
    expect(lead.assignedAgentId).toBeNull();
    expect(lead.phone).toBe("416-555-0123");
  });

  it("ignores non-string/empty metadata values safely", () => {
    const lead = mapContactToLead({ ...base, metadata: { city: "", budgetCad: "lots", aiHandling: "yes" } });
    expect(lead.city).toBeUndefined();
    expect(lead.budgetCad).toBeUndefined(); // only numbers accepted
    expect(lead.aiHandling).toBe(false); // strict === true
  });
});

describe("formatLastActivity", () => {
  const ago = (ms: number) => new Date(Date.now() - ms).toISOString();

  it("returns an em dash for null/invalid input", () => {
    expect(formatLastActivity(null)).toBe("—");
    expect(formatLastActivity(undefined)).toBe("—");
    expect(formatLastActivity("not-a-date")).toBe("—");
  });

  it("formats seconds, minutes, hours", () => {
    expect(formatLastActivity(ago(5_000))).toMatch(/^\d+s ago$/);
    expect(formatLastActivity(ago(5 * 60_000))).toBe("5m ago");
    expect(formatLastActivity(ago(3 * 3_600_000))).toBe("3h ago");
  });

  it("formats yesterday, days, and weeks", () => {
    expect(formatLastActivity(ago(24 * 3_600_000))).toBe("yesterday");
    expect(formatLastActivity(ago(3 * 24 * 3_600_000))).toBe("3d ago");
    expect(formatLastActivity(ago(14 * 24 * 3_600_000))).toBe("2w ago");
  });
});
