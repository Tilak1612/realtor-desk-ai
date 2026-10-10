import { describe, expect, it } from "vitest";
import { appLocale, formatCad, formatDuration, formatPct } from "../format";

const norm = (s: string) => s.replace(/[\u00a0\u202f]/g, " ");

describe("dashboard formatting", () => {
  it("compact CAD in both languages, no trailing zero", () => {
    expect(formatCad(8_420_000, "en-CA", true)).toBe("$8.4M");
    expect(norm(formatCad(8_420_000, "fr-CA", true))).toBe("8,4 M$");
    expect(formatCad(1_000_000, "en-CA", true)).toBe("$1M");
    expect(formatCad(4_500, "en-CA", true)).toBe("$4,500");
  });
  it("percent uses the French space", () => {
    expect(formatPct(0.67, "en-CA")).toBe("67%");
    expect(norm(formatPct(0.67, "fr-CA"))).toBe("67 %");
  });
  it("durations pick a sensible unit", () => {
    expect(formatDuration(22, "en-CA")).toBe("22 minutes");
    expect(formatDuration(1, "en-CA")).toBe("1 minute");
    expect(norm(formatDuration(180, "fr-CA"))).toBe("3 heures");
    expect(norm(formatDuration(2 * 1440, "fr-CA"))).toBe("2 jours");
  });
  it("normalises any fr* to fr-CA", () => {
    expect(appLocale("fr")).toBe("fr-CA");
    expect(appLocale(undefined)).toBe("en-CA");
  });
});
