import { describe, expect, it } from "vitest";
import { parseDateOnly, toDateOnly } from "../dateOnly";

describe("date-only values", () => {
  it("reads a DATE as that calendar day, not the evening before", () => {
    const d = parseDateOnly("2026-10-18");
    expect([d.getFullYear(), d.getMonth(), d.getDate(), d.getHours()]).toEqual([2026, 9, 18, 0]);
  });

  it("ignores a time part if one is present", () => {
    expect(parseDateOnly("2026-10-18T00:00:00Z").getDate()).toBe(18);
  });

  it("writes the local calendar day", () => {
    expect(toDateOnly(new Date(2026, 0, 5, 23, 59))).toBe("2026-01-05");
  });

  it("round-trips", () => {
    expect(toDateOnly(parseDateOnly("2026-03-08"))).toBe("2026-03-08");
  });
});
