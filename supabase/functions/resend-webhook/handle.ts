// Pure event handling for resend-webhook. No imports, so vitest can load it
// (src/test/functions/resendWebhook.test.ts) as well as the Deno entry point.

export const SENDING_DOMAIN = "realtordesk.ai";

export type SuppressionSource = "resend_hard_bounce" | "resend_complaint" | "resend_suppressed";

export interface ResendEvent {
  type: string;
  created_at?: string;
  data?: {
    email_id?: string;
    from?: string;
    to?: string | string[];
    subject?: string;
    bounce?: { type?: string; subType?: string };
  };
}

export interface EventRow {
  svix_id: string;
  event_type: string;
  resend_email_id: string | null;
  recipient: string | null;
  from_address: string;
  subject: string | null;
  bounce_type: string | null;
  bounce_subtype: string | null;
  payload: ResendEvent;
  occurred_at: string | null;
}

export interface WebhookStore {
  /** Idempotent on svix_id: Resend retries deliver the same id. */
  logEvent(row: EventRow): Promise<{ error: unknown }>;
  /** Must not overwrite an existing row, so an unsubscribe keeps its source. */
  suppress(email: string, source: SuppressionSource): Promise<{ error: unknown }>;
}

export type HandleResult =
  | { status: 200; body: { ignored: "other_domain" } }
  | { status: 200; body: { ok: true; suppressed: number } }
  | { status: 500; body: "db error" };

/** "RealtorDesk AI <support@realtordesk.ai>" -> "support@realtordesk.ai" */
export const emailOf = (s: string) => (s.match(/<([^>]+)>/)?.[1] ?? s).trim().toLowerCase();

/**
 * Which suppression an event earns, if any. Only permanent bounces count;
 * a missing bounce type is treated as permanent so the app errs toward not
 * sending. `email.suppressed` means Resend already refuses this address
 * (an earlier bounce or complaint), so the app should stop trying too.
 */
export function suppressionFor(evt: ResendEvent): SuppressionSource | null {
  if (evt.type === "email.complained") return "resend_complaint";
  if (evt.type === "email.suppressed") return "resend_suppressed";
  if (evt.type === "email.bounced" && (evt.data?.bounce?.type ?? "Permanent") === "Permanent") {
    return "resend_hard_bounce";
  }
  return null;
}

export async function handleResendEvent(
  evt: ResendEvent,
  svixId: string,
  store: WebhookStore,
): Promise<HandleResult> {
  const d = evt.data ?? {};
  const from = emailOf(String(d.from ?? ""));
  // Resend webhooks are account-wide: other products' mail arrives here too.
  if (!from.endsWith("@" + SENDING_DOMAIN)) return { status: 200, body: { ignored: "other_domain" } };

  const recipients = (Array.isArray(d.to) ? d.to : [d.to])
    .filter((x): x is string => Boolean(x))
    .map((x) => emailOf(String(x)));

  const { error } = await store.logEvent({
    svix_id: svixId,
    event_type: evt.type,
    resend_email_id: d.email_id ?? null,
    recipient: recipients[0] ?? null,
    from_address: from,
    subject: d.subject ?? null,
    bounce_type: d.bounce?.type ?? null,
    bounce_subtype: d.bounce?.subType ?? null,
    payload: evt,
    occurred_at: evt.created_at ?? null,
  });
  // A 5xx makes Resend retry, which is what we want for a database blip.
  if (error) return { status: 500, body: "db error" };

  const source = suppressionFor(evt);
  if (!source) return { status: 200, body: { ok: true, suppressed: 0 } };

  for (const r of recipients) {
    const { error: e2 } = await store.suppress(r, source);
    if (e2) return { status: 500, body: "db error" };
  }
  return { status: 200, body: { ok: true, suppressed: recipients.length } };
}
