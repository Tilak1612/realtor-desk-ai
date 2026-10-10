import type { LeadSource, PipelineStage } from "@/types/rd";
import { normalizeSource, normalizeStage } from "./mapContact";
import { OPEN_STAGES } from "./pipeline";

/**
 * Dashboard v2 — pure computation.
 *
 * Everything the /app dashboard shows is derived here from three light,
 * RLS-scoped row sets (contacts, recent conversation messages, open tasks)
 * so it can be unit-tested without Supabase and so every surface agrees.
 *
 * Why not an RPC: production schema changes go through the generated baseline
 * (docs/PRODUCTION_RUNBOOK.md §12), which means applying to production first.
 * The hook pages through every contact instead, so the 250-row cap that made
 * the old KPIs undercount (useLeads LEADS_FETCH_LIMIT) does not apply here.
 *
 * Rules carried over from the August audit:
 *   - never invent a value; a figure with too small a sample is null, and the
 *     UI renders an em dash rather than a number that looks like performance.
 *   - "open" means not won/lost (lib/rd/pipeline).
 */

// ── Input rows ────────────────────────────────────────────────────────────

export interface DashContact {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  phone: string | null;
  stage: string | null;
  source: string | null;
  preferred_language: string | null;
  ai_score: number | null;
  created_at: string | null;
  last_contact_date: string | null;
  next_followup_date: string | null;
  casl_consent: boolean | null;
  consent_given: boolean | null;
  /** The legal record. /app's add-lead path stamps only this column. */
  consent_date: string | null;
  unsubscribed: boolean | null;
  /** contacts.metadata->budgetCad, selected as an alias. */
  budget: number | string | null;
}

export interface DashMessage {
  lead_id: string | null;
  author: string; // "lead" | "ai" | "agent"
  sent_at: string;
}

export interface DashTask {
  id: string;
  contact_id: string | null;
  title: string;
  due_date: string | null; // YYYY-MM-DD
  status: string | null;
}

export interface DashInput {
  contacts: DashContact[];
  messages: DashMessage[];
  tasks: DashTask[];
  /**
   * Lower-cased addresses in public.email_suppressions for this user. A CASL
   * unsubscribe is stored per ADDRESS; contacts.unsubscribed is only flagged
   * when the unsubscribe token carried a contact id, so a suppressed address
   * can sit on a contact that still reads as consented.
   */
  suppressedEmails?: string[];
}

// ── Output ────────────────────────────────────────────────────────────────

export interface DashSummary {
  openLeads: number;
  /** Sum of buyer budgets on open leads. Not commission, not revenue. */
  pipelineValue: number;
  newLeads7d: number;
  newLeadsPrev7d: number;
  followupsDue: number;
  followupsOverdue: number;
  /** Open leads whose most recent message (last 30 days) is from the lead. */
  awaitingReply: number;
  /** Median minutes from a lead's message to the first reply, last 7 days. Null under MIN_SAMPLE. */
  firstResponseMedianMin: number | null;
  firstResponsePrevMedianMin: number | null;
  firstResponseSample: number;
  stages: { stage: PipelineStage; count: number; value: number }[];
  sources: { source: LeadSource; leads: number; won: number }[];
  consent: { open: number; consented: number; unsubscribed: number };
  totalContacts: number;
}

export type QueueBucket = "awaiting" | "new" | "overdue" | "task" | "due" | "quiet" | "hot";

export type ConsentState = "consented" | "none" | "unsubscribed";

export interface QueueItem {
  id: string;
  name: string;
  language: "EN" | "FR";
  stage: PipelineStage;
  score: number;
  bucket: QueueBucket;
  /** i18n key suffix + interpolation values for the one-line reason. */
  reason: { key: QueueBucket; values: Record<string, string | number> };
  consent: ConsentState;
  phone: string | null;
  email: string | null;
}

// ── Tunables ──────────────────────────────────────────────────────────────

export const MIN_RESPONSE_SAMPLE = 5;
export const QUIET_AFTER_DAYS = 14;
export const NEW_LEAD_WINDOW_DAYS = 14;
export const HOT_SCORE = 80;
export const AWAITING_WINDOW_DAYS = 30;

const DAY = 86_400_000;
const BUCKET_WEIGHT: Record<QueueBucket, number> = {
  awaiting: 700,
  new: 600,
  overdue: 500,
  task: 400,
  due: 300,
  quiet: 200,
  hot: 100,
};

// ── Helpers ───────────────────────────────────────────────────────────────

export const normStage = normalizeStage;

const isOpen = (s: PipelineStage) => (OPEN_STAGES as readonly string[]).includes(s);

function num(v: number | string | null | undefined): number {
  const n = typeof v === "string" ? Number(v) : v ?? 0;
  return Number.isFinite(n) ? (n as number) : 0;
}

function startOfDay(d: Date): number {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
}

/**
 * Start of the next local day. Not `today + 86_400_000`: on a spring-forward
 * day the local day is 23 hours long, and that sum lands at 1 a.m. tomorrow —
 * counting tomorrow's follow-ups as due today.
 */
function startOfTomorrow(d: Date): number {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1).getTime();
}

/**
 * The local calendar day of a value. contacts.next_followup_date is a
 * timestamptz, read in the agent's local time; tasks.due_date is a plain DATE
 * ("YYYY-MM-DD"), which must not be parsed as UTC midnight (that is the
 * previous evening anywhere in Canada).
 */
function localDay(iso: string): number {
  if (/^\d{4}-\d{2}-\d{2}$/.test(iso)) {
    const [y, m, d] = iso.split("-").map(Number);
    return new Date(y, m - 1, d).getTime();
  }
  return startOfDay(new Date(iso));
}

function median(xs: number[]): number | null {
  if (xs.length === 0) return null;
  const s = [...xs].sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
}

/**
 * CASL state of a contact. Withdrawal (useRecordConsent) sets unsubscribed and
 * keeps consent_date as history, so unsubscribed — or a suppressed address —
 * always wins. Otherwise any of the three consent fields counts: the /app
 * add-lead path stamps only consent_date, the consent control sets all three.
 */
export function consentOf(
  c: Pick<DashContact, "casl_consent" | "consent_given" | "consent_date" | "unsubscribed" | "email">,
  suppressed?: ReadonlySet<string>
): ConsentState {
  if (c.unsubscribed) return "unsubscribed";
  if (c.email && suppressed?.has(c.email.trim().toLowerCase())) return "unsubscribed";
  return c.casl_consent || c.consent_given || c.consent_date ? "consented" : "none";
}

/**
 * The one definition of "awaiting reply", shared with /app/inbox?filter=awaiting
 * so the tile and the list it opens agree: an open lead whose latest message
 * was written by them, within the last AWAITING_WINDOW_DAYS.
 */
export function awaitsReply(
  // Raw rows carry sent_at; mapped ConversationMessage (Inbox) carries sentAt.
  latest: { author: string; sent_at?: string; sentAt?: string } | undefined | null,
  stage: PipelineStage,
  now: Date = new Date()
): boolean {
  if (!latest || latest.author !== "lead" || !isOpen(stage)) return false;
  const t = new Date(latest.sent_at ?? latest.sentAt ?? NaN).getTime();
  return !Number.isNaN(t) && t >= now.getTime() - AWAITING_WINDOW_DAYS * DAY;
}

function fullName(c: DashContact): string {
  return [c.first_name, c.last_name].filter(Boolean).join(" ").trim() || (c.email ?? "—");
}

function language(c: DashContact): "EN" | "FR" {
  const v = (c.preferred_language ?? "").trim().toLowerCase();
  return v === "fr" || v.startsWith("fr-") || v === "french" || v === "français" || v === "francais" ? "FR" : "EN";
}

/** Group messages by lead, oldest first. */
function threads(messages: DashMessage[]): Map<string, { t: number; a: string }[]> {
  const m = new Map<string, { t: number; a: string }[]>();
  for (const row of messages) {
    if (!row.lead_id) continue;
    const t = new Date(row.sent_at).getTime();
    if (Number.isNaN(t)) continue;
    const list = m.get(row.lead_id) ?? [];
    list.push({ t, a: row.author });
    m.set(row.lead_id, list);
  }
  for (const list of m.values()) list.sort((x, y) => x.t - y.t);
  return m;
}

/** Response times (minutes) for lead→reply pairs whose lead message falls in [from, to). */
function responseMinutes(th: Map<string, { t: number; a: string }[]>, from: number, to: number): number[] {
  const out: number[] = [];
  for (const msgs of th.values()) {
    let pending: number | null = null;
    for (const m of msgs) {
      if (m.a === "lead") {
        if (pending === null) pending = m.t; // first unanswered lead message starts the clock
      } else if ((m.a === "ai" || m.a === "agent") && pending !== null) {
        if (pending >= from && pending < to) out.push((m.t - pending) / 60_000);
        pending = null;
      }
    }
  }
  return out;
}

/** Lead ids whose latest message (within the window) was written by the lead, with when. */
function awaitingSince(th: Map<string, { t: number; a: string }[]>, now: number): Map<string, number> {
  const out = new Map<string, number>();
  const cutoff = now - AWAITING_WINDOW_DAYS * DAY;
  for (const [lead, msgs] of th) {
    const last = msgs[msgs.length - 1];
    if (!last || last.a !== "lead" || last.t < cutoff) continue;
    // Clock starts at the first lead message after the last reply.
    let since = last.t;
    for (let i = msgs.length - 1; i >= 0 && msgs[i].a === "lead"; i--) since = msgs[i].t;
    out.set(lead, since);
  }
  return out;
}

// ── Summary ───────────────────────────────────────────────────────────────

export function computeSummary(input: DashInput, now: Date = new Date()): DashSummary {
  const nowMs = now.getTime();
  const today = startOfDay(now);
  const tomorrow = startOfTomorrow(now);
  const th = threads(input.messages);
  const awaiting = awaitingSince(th, nowMs);
  const suppressed = new Set((input.suppressedEmails ?? []).map((e) => e.trim().toLowerCase()));

  let openCount = 0;
  let pipelineValue = 0;
  let newLeads7d = 0;
  let newLeadsPrev7d = 0;
  let followupsDue = 0;
  let followupsOverdue = 0;
  let awaitingReply = 0;
  let consented = 0;
  let unsubscribed = 0;

  const stageMap = new Map<PipelineStage, { count: number; value: number }>(
    OPEN_STAGES.map((s) => [s, { count: 0, value: 0 }])
  );
  const sourceMap = new Map<LeadSource, { leads: number; won: number }>();

  for (const c of input.contacts) {
    const stage = normStage(c.stage);
    const open = isOpen(stage);
    const src = normalizeSource(c.source);
    const sv = sourceMap.get(src) ?? { leads: 0, won: 0 };
    sv.leads += 1;
    if (stage === "won") sv.won += 1;
    sourceMap.set(src, sv);

    if (c.created_at) {
      const t = new Date(c.created_at).getTime();
      if (t >= nowMs - 7 * DAY && t <= nowMs) newLeads7d += 1;
      else if (t >= nowMs - 14 * DAY && t < nowMs - 7 * DAY) newLeadsPrev7d += 1;
    }

    if (!open) continue;
    openCount += 1;
    const budget = num(c.budget);
    pipelineValue += budget;
    const st = stageMap.get(stage)!;
    st.count += 1;
    st.value += budget;

    if (c.next_followup_date) {
      const d = localDay(c.next_followup_date);
      if (d < tomorrow) followupsDue += 1;
      if (d < today) followupsOverdue += 1;
    }
    if (awaiting.has(c.id)) awaitingReply += 1;
    const cs = consentOf(c, suppressed);
    if (cs === "consented") consented += 1;
    if (cs === "unsubscribed") unsubscribed += 1;
  }

  const cur = responseMinutes(th, nowMs - 7 * DAY, nowMs + 1);
  const prev = responseMinutes(th, nowMs - 14 * DAY, nowMs - 7 * DAY);

  return {
    openLeads: openCount,
    pipelineValue,
    newLeads7d,
    newLeadsPrev7d,
    followupsDue,
    followupsOverdue,
    awaitingReply,
    firstResponseMedianMin: cur.length >= MIN_RESPONSE_SAMPLE ? median(cur) : null,
    firstResponsePrevMedianMin: prev.length >= MIN_RESPONSE_SAMPLE ? median(prev) : null,
    firstResponseSample: cur.length,
    stages: OPEN_STAGES.map((stage) => ({ stage, ...stageMap.get(stage)! })),
    sources: [...sourceMap.entries()]
      .map(([source, v]) => ({ source, ...v }))
      .sort((a, b) => b.leads - a.leads),
    consent: { open: openCount, consented, unsubscribed },
    totalContacts: input.contacts.length,
  };
}

// ── Next-up queue ─────────────────────────────────────────────────────────

/**
 * One ranked list of who to contact next. Each open lead appears at most once,
 * under its most urgent reason:
 *
 *   awaiting  their last message is unanswered (oldest wait first)
 *   new       created in the last 14 days, never contacted
 *   overdue   follow-up date before today
 *   task      an open task linked to them is due today or overdue
 *   due       follow-up date is today
 *   quiet     past "new", no contact in 14+ days
 *   hot       score ≥ 80 with nothing else pending
 *
 * Ties break on lead score, then on how long the reason has applied.
 */
export function buildNextUp(input: DashInput, now: Date = new Date(), limit = 8): QueueItem[] {
  const nowMs = now.getTime();
  const today = startOfDay(now);
  const tomorrow = startOfTomorrow(now);
  const th = threads(input.messages);
  const awaiting = awaitingSince(th, nowMs);
  const suppressed = new Set((input.suppressedEmails ?? []).map((e) => e.trim().toLowerCase()));
  const outbound = new Set<string>();
  for (const [lead, msgs] of th) if (msgs.some((m) => m.a === "ai" || m.a === "agent")) outbound.add(lead);

  const tasksByContact = new Map<string, DashTask[]>();
  for (const t of input.tasks) {
    if (!t.contact_id || !t.due_date) continue;
    if ((t.status ?? "").toLowerCase() === "completed") continue;
    if (localDay(t.due_date) >= tomorrow) continue;
    const list = tasksByContact.get(t.contact_id) ?? [];
    list.push(t);
    tasksByContact.set(t.contact_id, list);
  }

  const scored: { item: QueueItem; weight: number; age: number }[] = [];

  for (const c of input.contacts) {
    const stage = normStage(c.stage);
    if (!isOpen(stage)) continue;
    const score = c.ai_score ?? 0;
    let bucket: QueueBucket | null = null;
    let values: Record<string, string | number> = {};
    let age = 0;

    const waitingSince = awaiting.get(c.id);
    const created = c.created_at ? new Date(c.created_at).getTime() : null;
    const lastContact = c.last_contact_date ? new Date(c.last_contact_date).getTime() : null;
    const follow = c.next_followup_date ? localDay(c.next_followup_date) : null;
    const tasks = tasksByContact.get(c.id);

    if (waitingSince !== undefined) {
      bucket = "awaiting";
      age = nowMs - waitingSince;
      values = { minutes: Math.max(1, Math.round(age / 60_000)) };
    } else if (
      stage === "new" &&
      lastContact === null &&
      !outbound.has(c.id) &&
      created !== null &&
      nowMs - created <= NEW_LEAD_WINDOW_DAYS * DAY
    ) {
      bucket = "new";
      age = nowMs - created;
      values = { minutes: Math.max(1, Math.round(age / 60_000)) };
    } else if (follow !== null && follow < today) {
      bucket = "overdue";
      age = today - follow;
      values = { days: Math.round(age / DAY) };
    } else if (tasks && tasks.length) {
      bucket = "task";
      const first = [...tasks].sort((a, b) => localDay(a.due_date!) - localDay(b.due_date!))[0];
      age = today - localDay(first.due_date!);
      values = { title: first.title };
    } else if (follow !== null && follow < tomorrow) {
      bucket = "due";
    } else if (stage !== "new" && lastContact !== null && nowMs - lastContact >= QUIET_AFTER_DAYS * DAY) {
      bucket = "quiet";
      age = nowMs - lastContact;
      values = { days: Math.floor(age / DAY) };
    } else if (score >= HOT_SCORE) {
      bucket = "hot";
      values = { score };
    }

    if (!bucket) continue;
    scored.push({
      weight: BUCKET_WEIGHT[bucket],
      age,
      item: {
        id: c.id,
        name: fullName(c),
        language: language(c),
        stage,
        score,
        bucket,
        reason: { key: bucket, values },
        consent: consentOf(c, suppressed),
        phone: c.phone || null,
        email: c.email || null,
      },
    });
  }

  return scored
    .sort((a, b) => b.weight - a.weight || b.item.score - a.item.score || b.age - a.age)
    .slice(0, limit)
    .map((s) => s.item);
}

/** Count of queue candidates per bucket — for the filter chips. Same rules as buildNextUp. */
export function countBuckets(items: QueueItem[]): Record<QueueBucket, number> {
  const out: Record<QueueBucket, number> = { awaiting: 0, new: 0, overdue: 0, task: 0, due: 0, quiet: 0, hot: 0 };
  for (const i of items) out[i.bucket] += 1;
  return out;
}

/** Signed change as a share of the prior value, or null when there is no prior. */
export function pctChange(current: number | null, prior: number | null): number | null {
  if (current === null || prior === null || prior === 0) return null;
  return (current - prior) / prior;
}
