import { describe, it, expect } from "vitest";
import { addMonths, consentWindow } from "../caslConsent";

describe("consentWindow", () => {
  it("gives an inquiry six months", () => {
    expect(consentWindow("inquiry", "2026-04-12", "2026-10-01")).toEqual({
      until: "2026-10-12",
      daysLeft: 11,
      status: "ending",
    });
  });

  it("gives a purchase or an ended contract two years", () => {
    expect(consentWindow("purchase", "2025-01-15", "2026-10-12")?.until).toBe("2027-01-15");
    expect(consentWindow("contract", "2025-01-15", "2026-10-12")?.status).toBe("active");
  });

  it("reports a window that has passed", () => {
    const w = consentWindow("inquiry", "2026-01-10", "2026-10-12");
    expect(w?.status).toBe("expired");
    expect(w?.daysLeft).toBeLessThan(0);
  });

  it("clamps to the end of a shorter month instead of rolling into the next", () => {
    // 31 August plus six months is the end of February, not 3 March.
    expect(consentWindow("inquiry", "2026-08-31", "2026-09-01")?.until).toBe("2027-02-28");
    expect(addMonths(new Date(2024, 1, 29), 24).getDate()).toBe(28);
  });

  it("counts the last day itself as still inside the window", () => {
    expect(consentWindow("inquiry", "2026-04-12", "2026-10-12")?.status).toBe("ending");
    expect(consentWindow("inquiry", "2026-04-12", "2026-10-13")?.status).toBe("expired");
  });

  it("rejects input that is not a real date", () => {
    expect(consentWindow("inquiry", "", "2026-10-12")).toBeNull();
    expect(consentWindow("inquiry", "2026-02-31", "2026-10-12")).toBeNull();
    expect(consentWindow("inquiry", "12/04/2026", "2026-10-12")).toBeNull();
  });
});
