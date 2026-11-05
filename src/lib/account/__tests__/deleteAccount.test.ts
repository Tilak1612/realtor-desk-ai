import { describe, it, expect, vi, beforeEach } from "vitest";

/**
 * The client half of account deletion: one edge-function call, and every way
 * it can come back turned into something the dialog can show. supabase-js
 * reports a 4xx/5xx as an error object with the Response on `context`, so the
 * useful part of a refusal (which step failed, what already ran) is one await
 * away from being dropped; these pin that it is read.
 */

const invoke = vi.fn();
const signOut = vi.fn();
vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    functions: { invoke: (...a: unknown[]) => invoke(...a) },
    auth: { signOut: (...a: unknown[]) => signOut(...a) },
  },
}));

import { clearLocalSession, requestAccountDeletion } from "../deleteAccount";

const httpError = (body: unknown) => ({
  name: "FunctionsHttpError",
  message: "Edge Function returned a non-2xx status code",
  context: { json: async () => body },
});

beforeEach(() => {
  invoke.mockReset();
  signOut.mockReset();
});

describe("requestAccountDeletion", () => {
  it("calls delete-account with the confirmation phrase and no user id", async () => {
    invoke.mockResolvedValue({ data: { success: true, deleted: true, completed_steps: [] }, error: null });
    await requestAccountDeletion();
    expect(invoke).toHaveBeenCalledTimes(1);
    expect(invoke).toHaveBeenCalledWith("delete-account", { body: { confirm: "DELETE" } });
  });

  it("is ok only when the server says the account is gone", async () => {
    invoke.mockResolvedValue({
      data: { success: true, deleted: true, completed_steps: ["demo_check", "delete_auth_user"] },
      error: null,
    });
    expect(await requestAccountDeletion()).toEqual({
      ok: true,
      failure: null,
      completedSteps: ["demo_check", "delete_auth_user"],
    });

    // A 200 that does not say deleted is not a success.
    invoke.mockResolvedValue({ data: {}, error: null });
    expect((await requestAccountDeletion()).ok).toBe(false);
    invoke.mockResolvedValue({ data: null, error: null });
    expect((await requestAccountDeletion()).ok).toBe(false);
  });

  it.each([
    [{ success: false, code: "demo_account", completed_steps: [] }, "demo_account"],
    [{ success: false, code: "stripe_cancel_failed", completed_steps: ["demo_check"] }, "stripe_cancel_failed"],
    [{ success: false, code: "unauthorized", completed_steps: [] }, "unauthorized"],
    [{ success: false, code: "confirmation_required", completed_steps: [] }, "unknown"],
    [{ success: false, code: "profile_check_failed", completed_steps: [] }, "unknown"],
  ])("reads the refusal out of a non-2xx response: %j", async (body, failure) => {
    invoke.mockResolvedValue({ data: null, error: httpError(body) });
    const result = await requestAccountDeletion();
    expect(result.ok).toBe(false);
    expect(result.failure).toBe(failure);
  });

  it("says 'partial' only when something was really removed", async () => {
    invoke.mockResolvedValue({
      data: null,
      error: httpError({
        success: false,
        code: "row_delete_failed",
        completed_steps: ["demo_check", "cancel_subscriptions", "delete_storage"],
      }),
    });
    expect(await requestAccountDeletion()).toEqual({
      ok: false,
      failure: "partial",
      completedSteps: ["demo_check", "cancel_subscriptions", "delete_storage"],
    });

    // Billing cancelled but no data touched yet: not "part of your data was deleted".
    invoke.mockResolvedValue({
      data: null,
      error: httpError({
        success: false,
        code: "storage_delete_failed",
        completed_steps: ["demo_check", "cancel_subscriptions"],
      }),
    });
    expect((await requestAccountDeletion()).failure).toBe("unknown");
  });

  it("reports a dropped connection instead of throwing", async () => {
    invoke.mockResolvedValue({ data: null, error: { name: "FunctionsFetchError", message: "Failed to fetch" } });
    expect((await requestAccountDeletion()).failure).toBe("network");

    invoke.mockRejectedValue(new TypeError("Failed to fetch"));
    expect((await requestAccountDeletion()).failure).toBe("network");
  });

  it("survives an error body that is not JSON", async () => {
    invoke.mockResolvedValue({
      data: null,
      error: { context: { json: async () => { throw new SyntaxError("Unexpected token <"); } } },
    });
    expect(await requestAccountDeletion()).toEqual({ ok: false, failure: "unknown", completedSteps: [] });
  });
});

describe("clearLocalSession", () => {
  it("drops the local session without a server call, and never throws", async () => {
    signOut.mockResolvedValue({ error: null });
    await clearLocalSession();
    expect(signOut).toHaveBeenCalledWith({ scope: "local" });

    signOut.mockRejectedValue(new Error("storage blocked"));
    await expect(clearLocalSession()).resolves.toBeUndefined();
  });
});
