import { describe, it, expect } from "vitest";
import { fxToCAD, convertToCADCents } from "../fx";

// Mocked fetch — never hit BoC for real in CI.

function mockBocFetch(rate: string | null, status = 200): typeof fetch {
  return (async () => {
    if (rate === null) {
      return new Response("nope", { status });
    }
    return new Response(
      JSON.stringify({
        observations: [{ d: "2026-04-23", FXUSDCAD: { v: rate } }],
      }),
      { status, headers: { "Content-Type": "application/json" } },
    );
  }) as unknown as typeof fetch;
}

describe("fxToCAD", () => {
  it("identity for CAD→CAD (no network call)", async () => {
    const snap = await fxToCAD("CAD");
    expect(snap.rate).toBe(1);
    expect(snap.source).toBe("identity");
    expect(snap.asOf).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it("parses BoC USD→CAD observation correctly", async () => {
    const snap = await fxToCAD("USD", { fetch: mockBocFetch("1.3690") });
    expect(snap.rate).toBeCloseTo(1.369, 3);
    expect(snap.asOf).toBe("2026-04-23");
    expect(snap.source).toBe("boc");
  });

  it("throws on BoC API failure with no fallback", async () => {
    await expect(
      fxToCAD("USD", { fetch: mockBocFetch(null, 503) }),
    ).rejects.toThrow(/BOC FX fetch 503/);
  });

  it("uses fallback when BoC fails and fallback is provided", async () => {
    const snap = await fxToCAD("USD", {
      fetch: mockBocFetch(null, 503),
      fallback: { rate: 1.35, asOf: "2026-04-22" },
    });
    expect(snap.rate).toBe(1.35);
    expect(snap.asOf).toBe("2026-04-22");
    expect(snap.source).toBe("fallback");
  });

  it("throws on malformed BoC response", async () => {
    const malformedFetch = (async () =>
      new Response(JSON.stringify({ observations: [] }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      })) as unknown as typeof fetch;
    await expect(fxToCAD("USD", { fetch: malformedFetch })).rejects.toThrow();
  });

  it("rejects negative or zero rates from BoC (defensive)", async () => {
    await expect(
      fxToCAD("USD", { fetch: mockBocFetch("0") }),
    ).rejects.toThrow();
    await expect(
      fxToCAD("USD", { fetch: mockBocFetch("-1.36") }),
    ).rejects.toThrow();
  });
});

describe("convertToCADCents", () => {
  it("multiplies and rounds to integer cents", () => {
    expect(convertToCADCents(14900, 1.369)).toBe(20398); // 14900 * 1.369 = 20398.1 → 20398
    expect(convertToCADCents(10000, 1.5)).toBe(15000);
  });

  it("handles zero and negative amounts (clawbacks)", () => {
    expect(convertToCADCents(0, 1.369)).toBe(0);
    expect(convertToCADCents(-14900, 1.369)).toBe(-20398);
  });

  it("identity for rate=1", () => {
    expect(convertToCADCents(12345, 1)).toBe(12345);
  });
});
