import { supabase } from "@/integrations/supabase/client";

// Client side of supabase/functions/delete-account.
//
// The function answers every request, success or failure, with one JSON shape
// (see DeletionOutcome in supabase/functions/delete-account/deletion.ts). This
// module turns that into something a component can render without knowing how
// supabase-js reports a non-2xx response.

/**
 * The phrase the function requires in the request body. The dialog asks the
 * person to type a word in their own language; what is SENT is always this.
 */
export const DELETE_CONFIRM_PHRASE = "DELETE";

/** Where "contact support" points in the dialog. The address Settings already used. */
export const ACCOUNT_SUPPORT_EMAIL = "support@realtordesk.ai";

export type DeleteAccountFailure =
  /** The shared demo / reviewer account. Refused by the server too. */
  | "demo_account"
  /** Stripe would not cancel the subscription. Nothing was deleted. */
  | "stripe_cancel_failed"
  /** The session is missing or no longer valid. */
  | "unauthorized"
  /** The request never reached the function. */
  | "network"
  /** A later step failed after earlier ones had finished; a retry resumes. */
  | "partial"
  /** Anything else. Nothing is known to have been deleted. */
  | "unknown";

export interface DeleteAccountResult {
  ok: boolean;
  failure: DeleteAccountFailure | null;
  /** Steps the server reports as finished in this attempt. */
  completedSteps: string[];
}

interface FunctionPayload {
  success?: boolean;
  deleted?: boolean;
  code?: string;
  completed_steps?: unknown;
}

// Server steps that remove something. demo_check and cancel_subscriptions
// finishing does not mean any data is gone yet.
const DESTRUCTIVE_STEPS = new Set(["delete_storage", "delete_rows", "delete_auth_user"]);

const steps = (payload: FunctionPayload | null): string[] =>
  Array.isArray(payload?.completed_steps)
    ? payload.completed_steps.filter((s): s is string => typeof s === "string")
    : [];

function classify(payload: FunctionPayload | null): DeleteAccountFailure {
  const code = payload?.code;
  if (code === "demo_account") return "demo_account";
  if (code === "stripe_cancel_failed") return "stripe_cancel_failed";
  if (code === "unauthorized") return "unauthorized";
  // Said only when it is true: a destructive step has finished and the account
  // is still there.
  if (steps(payload).some((s) => DESTRUCTIVE_STEPS.has(s))) return "partial";
  return "unknown";
}

/**
 * Ask the server to delete the signed-in account. Never throws: every outcome,
 * including a dropped connection, comes back as a result the dialog can show.
 */
export async function requestAccountDeletion(): Promise<DeleteAccountResult> {
  let data: unknown = null;
  let error: unknown = null;
  try {
    const res = await supabase.functions.invoke("delete-account", {
      body: { confirm: DELETE_CONFIRM_PHRASE },
    });
    data = res.data;
    error = res.error;
  } catch {
    return { ok: false, failure: "network", completedSteps: [] };
  }

  if (!error) {
    const payload = (data ?? null) as FunctionPayload | null;
    if (payload?.success === true && payload.deleted === true) {
      return { ok: true, failure: null, completedSteps: steps(payload) };
    }
    return { ok: false, failure: classify(payload), completedSteps: steps(payload) };
  }

  // A 4xx/5xx arrives as FunctionsHttpError with the Response on `context`.
  // Checked by shape, not instanceof: the class identity does not survive
  // being mocked or bundled twice, and the body is what matters.
  const context = (error as { context?: unknown }).context;
  if (context && typeof (context as Response).json === "function") {
    try {
      const payload = (await (context as Response).json()) as FunctionPayload;
      return { ok: false, failure: classify(payload), completedSteps: steps(payload) };
    } catch {
      return { ok: false, failure: "unknown", completedSteps: [] };
    }
  }

  // FunctionsFetchError / FunctionsRelayError: nothing came back at all.
  return { ok: false, failure: "network", completedSteps: [] };
}

/**
 * Drop the session held on this device without calling the server. Used after a
 * successful deletion when the normal sign-out reports an error: the account no
 * longer exists, so there is nothing server-side left to revoke, but the stale
 * tokens must not stay in storage.
 */
export async function clearLocalSession(): Promise<void> {
  try {
    await supabase.auth.signOut({ scope: "local" });
  } catch {
    /* nothing more can be done from here; the tokens no longer work anyway */
  }
}
