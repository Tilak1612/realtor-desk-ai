import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

// Source-contract guard for check-subscription.
//
// The bug this protects against: with apiVersion "2025-08-27.basil" pinned,
// current_period_end lives on the subscription ITEM, not the subscription. The
// old code read sub.current_period_end (undefined on Basil) and passed it
// straight into new Date(...).toISOString(), which throws
// RangeError("Invalid time value"). That sent the whole function to its 500
// branch; the client treats any error as subscribed:false; RequireBilling then
// bounced the user to /billing. Net effect: every ENTITLED customer ejected
// from all 19 product routes to a payment page they had already paid.
//
// It never surfaced in probing because the crash needs a Stripe subscription
// to exist — every no-customer probe returns before reaching the date code.

const SRC = readFileSync(
  resolve(__dirname, "../../../supabase/functions/check-subscription/index.ts"),
  "utf8",
);

// Comments in that file quote the dangerous pattern verbatim in order to
// explain it, so the "no unguarded toISOString" scan has to look at code only.
const CODE = SRC.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");

describe("check-subscription date handling", () => {
  it("never calls toISOString() on an unguarded value", () => {
    const unguarded = /new Date\([^)]*\*\s*1000\)\s*\.toISOString\(\)/g;
    expect(CODE.match(unguarded)).toBeNull();
  });

  it("routes every epoch conversion through the non-throwing helper", () => {
    expect(SRC).toContain("const toIso =");
    expect(SRC).toContain("Number.isFinite(seconds)");
    expect(SRC).toContain("Number.isNaN(d.getTime())");
    expect(SRC).toContain("subscriptionEnd = toIso(");
    expect(SRC).toContain("trialEnd = toIso(");
  });

  it("reads the period end from the subscription ITEM first", () => {
    const idx = SRC.indexOf("const periodEnd");
    expect(idx, "periodEnd resolution missing").toBeGreaterThan(-1);
    const block = SRC.slice(idx, idx + 320);
    expect(block.indexOf("item")).toBeGreaterThan(-1);
    expect(block.indexOf("item")).toBeLessThan(block.lastIndexOf("sub as unknown"));
    expect(block).toContain("sub as unknown");
  });

  it("keeps the pinned API version visible next to the item-shape assumption", () => {
    expect(SRC).toContain('apiVersion: "2025-08-27.basil"');
  });

  it("treats a failed profile write as non-fatal", () => {
    const idx = SRC.indexOf("subscription_status: sub && sub.status");
    expect(idx).toBeGreaterThan(-1);
    expect(SRC.slice(Math.max(0, idx - 400), idx)).toContain("try {");
  });

  it("still treats trialing and past_due as entitled", () => {
    expect(SRC).toContain('"trialing"');
    expect(SRC).toContain('"past_due"');
    expect(SRC).toContain('"active"');
  });
});

describe("toIso semantics (mirrored)", () => {
  const toIso = (seconds: unknown): string | null => {
    if (typeof seconds !== "number" || !Number.isFinite(seconds)) return null;
    const d = new Date(seconds * 1000);
    return Number.isNaN(d.getTime()) ? null : d.toISOString();
  };

  it("returns null instead of throwing on the values Basil actually produces", () => {
    expect(toIso(undefined)).toBeNull();
    expect(toIso(null)).toBeNull();
    expect(toIso(NaN)).toBeNull();
    expect(toIso(Infinity)).toBeNull();
    expect(toIso("1760000000")).toBeNull();
  });

  it("converts a real epoch correctly", () => {
    expect(toIso(1760000000)).toBe(new Date(1760000000 * 1000).toISOString());
  });

  it("reproduces the original crash to prove the guard is needed", () => {
    // This is exactly what the old line did on Basil.
    expect(() => new Date((undefined as unknown as number) * 1000).toISOString()).toThrow(RangeError);
  });
});
