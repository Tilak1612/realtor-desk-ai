// Calendar dates stored as plain DATE columns ("YYYY-MM-DD"), such as
// tasks.due_date.
//
// `new Date("2026-10-18")` is UTC midnight, which is the evening of the 17th
// anywhere in Canada, so a task due today read that way shows yesterday's date
// and sorts as overdue. Going the other way, `toISOString().split("T")[0]` on a
// local date gives tomorrow's date east of UTC. Both directions go through the
// local calendar here instead.

/** "YYYY-MM-DD" → that day at local midnight. */
export function parseDateOnly(value: string): Date {
  const [y, m, d] = value.slice(0, 10).split("-").map(Number);
  return new Date(y, m - 1, d);
}

/** A Date → its local calendar day as "YYYY-MM-DD". */
export function toDateOnly(date: Date): string {
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${m}-${d}`;
}
