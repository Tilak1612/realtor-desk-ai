import { describe, it, expect } from "vitest";
import {
  formatCurrencyCAD,
  formatDateISO,
  formatPercent,
  formatSeconds,
  formatTime,
  normalizeLocale,
} from "../format";

const NNBSP = " "; // narrow no-break space — FR typographic spacer

describe("normalizeLocale", () => {
  it("maps fr variants to fr-CA", () => {
    expect(normalizeLocale("fr")).toBe("fr-CA");
    expect(normalizeLocale("fr-CA")).toBe("fr-CA");
    expect(normalizeLocale("fr-FR")).toBe("fr-CA");
    expect(normalizeLocale("FR")).toBe("fr-CA");
  });
  it("defaults everything else to en-CA", () => {
    expect(normalizeLocale("en")).toBe("en-CA");
    expect(normalizeLocale(undefined)).toBe("en-CA");
    expect(normalizeLocale("")).toBe("en-CA");
    expect(normalizeLocale("es")).toBe("en-CA");
  });
});

describe("formatCurrencyCAD — FR typographic conventions", () => {
  it("formats millions with symbol after number + NNBSP", () => {
    expect(formatCurrencyCAD(1_400_000, "fr-CA")).toBe(`1,4${NNBSP}M$ CA`);
  });
  it("formats thousands with k$ suffix", () => {
    expect(formatCurrencyCAD(680_000, "fr-CA")).toBe(`680${NNBSP}k$ CA`);
  });
  it("formats monthly price", () => {
    expect(formatCurrencyCAD(149, "fr-CA", { compact: false, perMonth: true })).toBe(
      `149${NNBSP}$/mois CA`,
    );
  });
  it("formats yearly price", () => {
    expect(formatCurrencyCAD(999, "fr-CA", { compact: false, perYear: true })).toBe(
      `999${NNBSP}$/an CA`,
    );
  });
});

describe("formatCurrencyCAD — EN-CA", () => {
  it("keeps US-style compact symbols with CAD suffix", () => {
    expect(formatCurrencyCAD(1_400_000, "en-CA")).toBe("$1.4M CAD");
    expect(formatCurrencyCAD(680_000, "en-CA")).toBe("$680K CAD");
    expect(formatCurrencyCAD(149, "en-CA", { compact: false, perMonth: true })).toBe(
      "$149/mo CAD",
    );
  });
});

describe("formatTime", () => {
  it("FR: top of hour — lowercase h, no period, NNBSP", () => {
    expect(formatTime(new Date(2026, 3, 22, 19, 0), "fr-CA")).toBe(`19${NNBSP}h`);
  });
  it("FR: off-hour — h splits hours and minutes", () => {
    expect(formatTime(new Date(2026, 3, 22, 19, 42), "fr-CA")).toBe(
      `19${NNBSP}h${NNBSP}42`,
    );
  });
  it("FR: midnight 00:00 renders as 0 h", () => {
    expect(formatTime(new Date(2026, 3, 22, 0, 0), "fr-CA")).toBe(`0${NNBSP}h`);
  });
  it("EN: 12-hour with a.m./p.m.", () => {
    expect(formatTime(new Date(2026, 3, 22, 7, 0), "en-CA")).toBe("7 a.m.");
    expect(formatTime(new Date(2026, 3, 22, 19, 42), "en-CA")).toBe("7:42 p.m.");
    expect(formatTime(new Date(2026, 3, 22, 0, 0), "en-CA")).toBe("12 a.m.");
  });
});

describe("formatPercent", () => {
  it("FR prepends Unicode minus + NNBSP before %", () => {
    expect(formatPercent(-96, "fr-CA")).toBe(`−96${NNBSP}%`);
    expect(formatPercent(20, "fr-CA")).toBe(`+20${NNBSP}%`);
    expect(formatPercent(0, "fr-CA")).toBe(`0${NNBSP}%`);
  });
  it("EN uses ASCII and no space", () => {
    expect(formatPercent(-96, "en-CA")).toBe("−96%");
    expect(formatPercent(20, "en-CA")).toBe("+20%");
  });
});

describe("formatSeconds", () => {
  it("FR inserts NNBSP before unit", () => {
    expect(formatSeconds(32, "fr-CA")).toBe(`32${NNBSP}s`);
  });
  it("EN concatenates", () => {
    expect(formatSeconds(32, "en-CA")).toBe("32s");
  });
});

describe("formatDateISO", () => {
  it("emits zero-padded YYYY-MM-DD regardless of locale", () => {
    expect(formatDateISO(new Date(2026, 3, 22))).toBe("2026-04-22");
    expect(formatDateISO(new Date(2026, 0, 1))).toBe("2026-01-01");
  });
});
