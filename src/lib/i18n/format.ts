// Locale-aware formatters for Canadian English and Canadian French.
//
// Why a custom module instead of raw `Intl` at call sites:
// - Canadian French has typographic conventions `Intl` doesn't enforce
//   on its own (thin space before `%`, lowercase `h` for 24-hour time,
//   `M$` / `k$` suffixes for compact currency) and we want those
//   locked in one place with tests.
// - Every price/date/time render in the marketing + dashboard surfaces
//   flows through here, so an audit-driven correction (e.g. switching
//   to the ISO unicode thin space ` `) is a one-file change.
//
// Locale normalization: i18next reports `fr`, `fr-CA`, `en`, `en-CA`
// depending on the detection path. We treat any `fr*` as fr-CA and any
// `en*` as en-CA since the product only ships two locales.

export type SupportedLocale = "en-CA" | "fr-CA";

export function normalizeLocale(input: string | undefined): SupportedLocale {
  return (input ?? "en").toLowerCase().startsWith("fr") ? "fr-CA" : "en-CA";
}

/** Narrow non-breaking space (U+202F) — required before `%`, `$`, `h` in FR-CA. */
const NNBSP = " ";

/**
 * Format a CAD amount. Emits "CA" suffix in both locales so USD/CAD can't be
 * confused on pricing surfaces — see the Canadian-first positioning.
 *
 * - en-CA: `$1.4M CAD`, `$680K CAD`, `$149/mo CAD`
 * - fr-CA: `1,4 M$ CA`, `680 k$ CA`, `149 $/mois CA`
 */
export function formatCurrencyCAD(
  amount: number,
  locale: SupportedLocale,
  opts: { compact?: boolean; perMonth?: boolean; perYear?: boolean } = {}
): string {
  const { compact = true, perMonth = false, perYear = false } = opts;
  const fr = locale === "fr-CA";

  if (compact && amount >= 1_000_000) {
    const value = amount / 1_000_000;
    const rendered = fr
      ? value.toFixed(1).replace(".", ",") + NNBSP + "M$"
      : "$" + value.toFixed(1) + "M";
    return rendered + (fr ? " CA" : " CAD");
  }
  if (compact && amount >= 1_000) {
    const value = Math.round(amount / 1_000);
    const rendered = fr ? value + NNBSP + "k$" : "$" + value + "K";
    return rendered + (fr ? " CA" : " CAD");
  }

  const body = fr
    ? Math.round(amount).toString() + NNBSP + "$"
    : "$" + Math.round(amount);
  const period = perYear
    ? fr ? "/an" : "/yr"
    : perMonth
      ? fr ? "/mois" : "/mo"
      : "";
  return body + period + (fr ? " CA" : " CAD");
}

/**
 * Long-form date. Canadian English drops US ordinal suffixes.
 *
 * - en-CA: `Wednesday, April 22, 2026`
 * - fr-CA: `mercredi 22 avril 2026` (no comma, lowercase month)
 */
export function formatDateLong(date: Date, locale: SupportedLocale): string {
  if (locale === "fr-CA") {
    // Intl emits "mercredi 22 avril 2026" in fr-CA — matches Quebec convention.
    return new Intl.DateTimeFormat("fr-CA", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date);
  }
  return new Intl.DateTimeFormat("en-CA", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

/**
 * Short ISO date — same shape in both locales (`2026-04-22`). ISO 8601 is the
 * Canadian federal style guide default for both languages.
 */
export function formatDateISO(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/**
 * Time of day.
 *
 * - en-CA (12h): `7:42 p.m.`
 * - fr-CA (24h): `19 h 42` — lowercase `h`, thin space separators, no period
 */
export function formatTime(date: Date, locale: SupportedLocale): string {
  const h24 = date.getHours();
  const m = date.getMinutes();

  if (locale === "fr-CA") {
    if (m === 0) return `${h24}${NNBSP}h`;
    return `${h24}${NNBSP}h${NNBSP}${String(m).padStart(2, "0")}`;
  }

  const ampm = h24 >= 12 ? "p.m." : "a.m.";
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  return m === 0 ? `${h12} ${ampm}` : `${h12}:${String(m).padStart(2, "0")} ${ampm}`;
}

/**
 * Percentage with locale-aware spacing. FR inserts a thin space before `%`;
 * EN does not.
 *
 * - en-CA: `-96%`
 * - fr-CA: `−96 %` (U+2212 minus + NNBSP + `%`)
 */
export function formatPercent(value: number, locale: SupportedLocale): string {
  const rounded = Math.round(value);
  if (locale === "fr-CA") {
    const sign = rounded < 0 ? "−" : rounded > 0 ? "+" : "";
    return `${sign}${Math.abs(rounded)}${NNBSP}%`;
  }
  const sign = rounded < 0 ? "−" : rounded > 0 ? "+" : "";
  return `${sign}${Math.abs(rounded)}%`;
}

/**
 * Duration in seconds. FR puts a thin space between value and unit.
 *
 * - en-CA: `32s`
 * - fr-CA: `32 s` (with NNBSP)
 */
export function formatSeconds(seconds: number, locale: SupportedLocale): string {
  return locale === "fr-CA" ? `${seconds}${NNBSP}s` : `${seconds}s`;
}
