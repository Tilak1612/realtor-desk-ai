import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  TRIAL_PERIOD_DAYS,
  LOWEST_MONTHLY_CAD,
  PLAN_SUMMARIES,
  projectedFirstChargeDate,
  formatBillingDate,
  formatCad,
} from "../billing";

// The signup page discloses billing terms BEFORE checkout exists, so the
// client necessarily carries its own copy of the trial length. This test is
// the guard that keeps that copy honest: it reads the edge function source and
// fails if the server value ever changes without the client following.

describe("billing contract with create-checkout", () => {
  it("client TRIAL_PERIOD_DAYS matches the server constant", () => {
    const src = readFileSync(
      resolve(__dirname, "../../../supabase/functions/create-checkout/index.ts"),
      "utf8",
    );
    const match = src.match(/const TRIAL_PERIOD_DAYS\s*=\s*(\d+)/);
    expect(match, "TRIAL_PERIOD_DAYS not found in create-checkout").toBeTruthy();
    expect(Number(match![1])).toBe(TRIAL_PERIOD_DAYS);
  });

  it("the server actually applies the trial to the Checkout Session", () => {
    const src = readFileSync(
      resolve(__dirname, "../../../supabase/functions/create-checkout/index.ts"),
      "utf8",
    );
    // If this line ever disappears, the disclosure on /signup becomes a lie.
    expect(src).toContain("trial_period_days: TRIAL_PERIOD_DAYS");
    expect(src).toContain('payment_method_collection: "always"');
  });
});

describe("billing helpers", () => {
  it("projects the first charge exactly TRIAL_PERIOD_DAYS out", () => {
    const from = new Date(2026, 7, 14); // 14 Aug 2026, local
    const charge = projectedFirstChargeDate(from);
    const diffDays = Math.round((charge.getTime() - from.getTime()) / 86_400_000);
    expect(diffDays).toBe(TRIAL_PERIOD_DAYS);
  });

  it("crosses month boundaries correctly", () => {
    const charge = projectedFirstChargeDate(new Date(2026, 7, 25)); // 25 Aug
    expect(charge.getMonth()).toBe(8); // September
    expect(charge.getDate()).toBe(8);
  });

  it("formats dates and money per locale", () => {
    const d = new Date(2026, 7, 28);
    expect(formatBillingDate(d, "en")).toMatch(/August/);
    expect(formatBillingDate(d, "fr")).toMatch(/août/);
    // fr-CA puts the symbol after the amount; en-CA before.
    expect(formatCad(149, "en")).toContain("149");
    expect(formatCad(149, "fr")).toContain("149");
  });

  it("quotes the lowest published plan price", () => {
    expect(LOWEST_MONTHLY_CAD).toBe(Math.min(...PLAN_SUMMARIES.map((p) => p.monthlyCad)));
    expect(LOWEST_MONTHLY_CAD).toBe(149);
  });
});
