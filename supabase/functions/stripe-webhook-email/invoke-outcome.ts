// What a failed supabaseAdmin.functions.invoke("send-lifecycle-email") means
// for the Stripe webhook's answer. No imports, so vitest can load it.
//
// Stripe retries a webhook delivery that gets a non-2xx answer (for up to
// three days). So:
//   - "permanent": send-lifecycle-email rejected the request itself (400 bad
//     input, 404 unknown user, 422). Retrying cannot help; answer 200.
//   - "retry": anything else (5xx, network, relay, a 401/403 from a
//     misconfigured key, 408, 429). Answer 500 so Stripe redelivers and the
//     failure stays visible in the Stripe dashboard.
// A retry cannot double-send: send-lifecycle-email skips an event it has
// already recorded (source_event_id) and a user/event pair sent in the last
// 24 h. Those checks are check-then-send, so two deliveries of the same event
// running at the same moment can still both send; no provider idempotency
// key is used.

export type InvokeOutcome = "ok" | "permanent" | "retry";

const PERMANENT = new Set([400, 404, 422]);

export function classifyInvokeError(error: unknown): InvokeOutcome {
  if (!error) return "ok";
  const status = (error as { context?: { status?: unknown } })?.context?.status;
  return typeof status === "number" && PERMANENT.has(status) ? "permanent" : "retry";
}
