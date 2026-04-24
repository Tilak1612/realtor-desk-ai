// FX snapshot for commission rows. Called at invoice.paid time in the
// webhook handler and stored on the commission row (fx_rate_to_cad +
// amount_cad_cents) so dashboard totals never drift when BoC moves
// the rate. Rate freezing is the same principle as commission-rate
// freezing: snapshot once, never rewrite.
//
// Source: Bank of Canada Valet API (free, no API key, published daily).
// https://www.bankofcanada.ca/valet/docs

const BOC_USD_CAD_URL =
  "https://www.bankofcanada.ca/valet/observations/FXUSDCAD/json?recent=1";

export interface FxSnapshot {
  /** Multiplier to convert `from` → CAD. 1.0 when `from === "CAD"`. */
  rate: number;
  /** YYYY-MM-DD — the date the rate is valid for. */
  asOf: string;
  source: "boc" | "identity" | "fallback";
}

export type SupportedSource = "USD" | "CAD";

/**
 * Fetch the latest USD→CAD rate. Falls back to `fallbackRate` if the
 * BoC API is unreachable — better to record a commission with a slightly
 * stale rate than to drop the webhook entirely and miss the earning.
 *
 * @param from source currency ("CAD" returns identity)
 * @param opts.fetch    inject for testing
 * @param opts.fallback if BoC fails and a fallback is provided, use it
 */
export async function fxToCAD(
  from: SupportedSource,
  opts: {
    fetch?: typeof fetch;
    fallback?: { rate: number; asOf: string };
  } = {},
): Promise<FxSnapshot> {
  if (from === "CAD") {
    return { rate: 1, asOf: today(), source: "identity" };
  }

  const fetchImpl = opts.fetch ?? globalThis.fetch;
  if (!fetchImpl) {
    throw new Error("fxToCAD: no fetch implementation available");
  }

  try {
    const res = await fetchImpl(BOC_USD_CAD_URL);
    if (!res.ok) throw new Error(`BOC FX fetch ${res.status}`);
    const data = await res.json();
    const latest = data?.observations?.[0];
    const raw = latest?.FXUSDCAD?.v;
    const rate = typeof raw === "string" ? parseFloat(raw) : NaN;
    if (!rate || Number.isNaN(rate) || rate <= 0) {
      throw new Error("BOC FX rate unparseable");
    }
    const asOf = typeof latest.d === "string" ? latest.d : today();
    return { rate, asOf, source: "boc" };
  } catch (err) {
    if (opts.fallback) {
      return { ...opts.fallback, source: "fallback" };
    }
    throw err instanceof Error ? err : new Error(String(err));
  }
}

/**
 * Convert an invoice-currency amount (in cents) to CAD cents.
 * Banker's rounding would overshoot by fractions of a cent on ties;
 * Math.round is fine here — the penny is the atomic unit and the
 * difference is noise vs audit complexity.
 */
export function convertToCADCents(amountCents: number, fxRate: number): number {
  return Math.round(amountCents * fxRate);
}

function today(): string {
  return new Date().toISOString().slice(0, 10);
}
