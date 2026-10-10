import { formatTime, normalizeLocale, type SupportedLocale } from "@/lib/i18n/format";

/**
 * Dashboard formatting for /app, layered on lib/i18n/format (which owns the
 * locale rules and the Quebec 24-hour clock). Added here: compact CAD *without*
 * the "CAD"/"CA" suffix that pricing surfaces need but a KPI tile does not,
 * percent shares, and short durations — all via Intl so fr-CA reads as French:
 * "8,4 M$", "67 %", "22 min".
 */
export type AppLocale = SupportedLocale;
export const appLocale = (lang: string | undefined): AppLocale => normalizeLocale(lang);

export function formatCad(value: number, locale: AppLocale, compact = false): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "CAD",
    notation: compact && Math.abs(value) >= 10_000 ? "compact" : "standard",
    maximumFractionDigits: compact ? 1 : 0,
    // fr-CA otherwise prints "1,0 M$"; drop a zero decimal in either language.
    trailingZeroDisplay: "stripIfInteger",
  } as Intl.NumberFormatOptions).format(value);
}

export function formatCount(value: number, locale: AppLocale): string {
  return new Intl.NumberFormat(locale).format(value);
}

export function formatPct(share: number, locale: AppLocale, signed = false): string {
  return new Intl.NumberFormat(locale, {
    style: "percent",
    maximumFractionDigits: 0,
    signDisplay: signed ? "exceptZero" : "auto",
  }).format(share);
}

/** Spelled out, since it sits inside a sentence: "22 minutes", "3 hours" / "3 heures". */
export function formatDuration(minutes: number, locale: AppLocale): string {
  const unit = minutes < 60 ? "minute" : minutes < 60 * 24 ? "hour" : "day";
  const value = unit === "minute" ? Math.max(1, Math.round(minutes)) : unit === "hour" ? Math.round(minutes / 60) : Math.round(minutes / 1440);
  return new Intl.NumberFormat(locale, {
    style: "unit",
    unit,
    unitDisplay: "long",
  }).format(value);
}

export function formatClock(date: Date, locale: AppLocale): string {
  return formatTime(date, locale);
}

export function formatLongDate(date: Date, locale: AppLocale): string {
  return date.toLocaleDateString(locale, { weekday: "long", month: "long", day: "numeric" });
}
