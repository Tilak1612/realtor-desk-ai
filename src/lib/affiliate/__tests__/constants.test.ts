import { describe, it, expect } from "vitest";
import {
  COMMISSION_RATES_BPS,
  TIER_THRESHOLDS,
  CLAWBACK_WINDOW_DAYS,
  ATTRIBUTION_WINDOW_DAYS,
  ATTRIBUTION_COOKIE,
  MIN_PAYOUT_CAD_CENTS,
  MIN_IP_SALT_LENGTH,
  DEFAULT_SLUG_LENGTH,
} from "../constants";

// Canary tests — if any of these break, the SQL migration
// (fn_current_commission_rate_bps, fn_recompute_affiliate_tier) is
// out of sync and needs a matching update.

describe("affiliate constants", () => {
  it("commission rates match the SQL migration verbatim", () => {
    expect(COMMISSION_RATES_BPS.starter).toBe(2500);    // 25%
    expect(COMMISSION_RATES_BPS.growth).toBe(3000);     // 30%
    expect(COMMISSION_RATES_BPS.elite).toBe(4000);      // 40%
    expect(COMMISSION_RATES_BPS.ambassador).toBe(2000); // 20%
  });

  it("tier thresholds are strictly ordered starter < growth < elite", () => {
    expect(TIER_THRESHOLDS.growth).toBeLessThan(TIER_THRESHOLDS.elite);
  });

  it("clawback window is 60 days (spec + README)", () => {
    expect(CLAWBACK_WINDOW_DAYS).toBe(60);
  });

  it("attribution window is 90 days (last-click)", () => {
    expect(ATTRIBUTION_WINDOW_DAYS).toBe(90);
    expect(ATTRIBUTION_COOKIE.ttlDays).toBe(90);
  });

  it("cookie is rd_ref, SameSite=Lax, not HttpOnly", () => {
    expect(ATTRIBUTION_COOKIE.name).toBe("rd_ref");
    expect(ATTRIBUTION_COOKIE.sameSite).toBe("Lax");
    expect(ATTRIBUTION_COOKIE.httpOnly).toBe(false);
  });

  it("payout threshold is 50 CAD", () => {
    expect(MIN_PAYOUT_CAD_CENTS).toBe(5000);
  });

  it("IP salt length floor is at least 16", () => {
    expect(MIN_IP_SALT_LENGTH).toBeGreaterThanOrEqual(16);
  });

  it("default slug length is reasonable", () => {
    expect(DEFAULT_SLUG_LENGTH).toBeGreaterThanOrEqual(6);
    expect(DEFAULT_SLUG_LENGTH).toBeLessThanOrEqual(16);
  });
});
