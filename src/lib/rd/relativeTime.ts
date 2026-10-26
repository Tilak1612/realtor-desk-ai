import type { TFunction } from "i18next";
import { formatClock, type AppLocale } from "./format";

const SEC = 1000;
const MIN = 60 * SEC;
const HOUR = 60 * MIN;
const DAY = 24 * HOUR;

/**
 * "2d ago" / "il y a 2 j", in the viewer's language. Older than four weeks
 * falls back to a short date ("Sep 18" / "18 sept."). Mirrors the rules of
 * mapContact's formatLastActivity, which stays as the English fallback for
 * fixtures that carry a pre-formatted string.
 */
export function relativeLabel(
  iso: string | null | undefined,
  t: TFunction,
  locale: AppLocale,
  now: number = Date.now()
): string {
  if (!iso) return "—";
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "—";
  const delta = Math.max(0, now - then);
  if (delta < MIN) return t("rd.shared.ago.seconds", { count: Math.floor(delta / SEC) });
  if (delta < HOUR) return t("rd.shared.ago.minutes", { count: Math.floor(delta / MIN) });
  if (delta < DAY) return t("rd.shared.ago.hours", { count: Math.floor(delta / HOUR) });
  const days = Math.floor(delta / DAY);
  if (days === 1) return t("rd.shared.ago.yesterday");
  if (days < 7) return t("rd.shared.ago.days", { count: days });
  if (days < 30) return t("rd.shared.ago.weeks", { count: Math.floor(days / 7) });
  return new Date(iso).toLocaleDateString(locale, { month: "short", day: "numeric" });
}

/**
 * When a message was sent: the clock time if it was today, otherwise how long
 * ago. A bare "3:43 AM" on a message from two days ago reads as this morning.
 */
export function messageTime(
  iso: string,
  t: TFunction,
  locale: AppLocale,
  now: Date = new Date()
): string {
  const sent = new Date(iso);
  if (Number.isNaN(sent.getTime())) return "";
  const sameDay =
    sent.getFullYear() === now.getFullYear() &&
    sent.getMonth() === now.getMonth() &&
    sent.getDate() === now.getDate();
  return sameDay ? formatClock(sent, locale) : relativeLabel(iso, t, locale, now.getTime());
}

/** A lead's last activity in the viewer's language; fixtures keep their label. */
export function leadActivity(
  lead: { lastActivity: string; lastActivityAt?: string | null },
  t: TFunction,
  locale: AppLocale
): string {
  return lead.lastActivityAt !== undefined ? relativeLabel(lead.lastActivityAt, t, locale) : lead.lastActivity;
}

const SOURCE_KEY: Record<string, string> = {
  DDF: "ddf",
  "Realtor.ca": "realtorCa",
  Form: "form",
  "Open house": "openHouse",
  Ads: "ads",
  Referral: "referral",
  Other: "other",
};

/** "Form" → "Formulaire". Unknown values (e.g. "Webhook" in fixtures) pass through. */
export function sourceLabel(source: string, t: TFunction): string {
  const key = SOURCE_KEY[source];
  return key ? t(`rd.shared.source.${key}`, source) : source;
}

/** Score band label for the conversation badges: Hot / Warm / Cold. */
export function tempLabel(score: number, t: TFunction): string {
  const band = score >= 80 ? "hot" : score >= 60 ? "warm" : "cold";
  return t(`rd.shared.temp.${band}`);
}
