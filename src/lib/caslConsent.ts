// Date arithmetic for /resources/casl-implied-consent-calculator.
//
// The periods come from subsection 10(10) of Canada's anti-spam legislation
// (S.C. 2010, c. 23): an existing business relationship arises from a purchase,
// lease or written contract within the two-year period, or an inquiry or
// application within the six-month period, immediately before the day the
// message is sent. This file only adds the period to a date. Whether a
// relationship exists at all is a legal question the calculator does not answer.

export type ConsentBasis = "inquiry" | "purchase" | "contract";

export const PERIOD_MONTHS: Record<ConsentBasis, number> = {
  inquiry: 6,
  purchase: 24,
  contract: 24,
};

export type ConsentStatus = "expired" | "ending" | "active";

export interface ConsentWindow {
  /** Last day of the period, as YYYY-MM-DD. */
  until: string;
  /** Whole days from today to that day. Negative once it has passed. */
  daysLeft: number;
  status: ConsentStatus;
}

const ENDING_SOON_DAYS = 30;

const parse = (iso: string): Date | null => {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m) return null;
  const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  // Reject dates the constructor rolled over, such as 2026-02-31.
  return d.getMonth() === Number(m[2]) - 1 && d.getDate() === Number(m[3]) ? d : null;
};

const format = (d: Date): string =>
  [d.getFullYear(), String(d.getMonth() + 1).padStart(2, "0"), String(d.getDate()).padStart(2, "0")].join("-");

/** Adds calendar months, clamping to the last day of a shorter month. */
export const addMonths = (d: Date, months: number): Date => {
  const day = d.getDate();
  const out = new Date(d.getFullYear(), d.getMonth() + months, 1);
  const last = new Date(out.getFullYear(), out.getMonth() + 1, 0).getDate();
  out.setDate(Math.min(day, last));
  return out;
};

/**
 * The window in which an existing business relationship can be relied on, from
 * the date of the inquiry, the purchase, or the day the contract ended.
 * Returns null for a date that is not a real YYYY-MM-DD date.
 */
export function consentWindow(basis: ConsentBasis, startIso: string, todayIso: string): ConsentWindow | null {
  const start = parse(startIso);
  const today = parse(todayIso);
  if (!start || !today) return null;
  const until = addMonths(start, PERIOD_MONTHS[basis]);
  const daysLeft = Math.round((until.getTime() - today.getTime()) / 86_400_000);
  const status: ConsentStatus = daysLeft < 0 ? "expired" : daysLeft <= ENDING_SOON_DAYS ? "ending" : "active";
  return { until: format(until), daysLeft, status };
}
