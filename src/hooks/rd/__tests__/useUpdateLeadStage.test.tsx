import { describe, it, expect, vi, beforeEach } from "vitest";
import type { ReactNode } from "react";
import { renderHook, waitFor, act } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Hoisted mocks — Supabase client + session. Both modules are imported
// deep inside useUpdateLeadStage, so `vi.mock` has to run before the
// hook is pulled in. We build a chainable builder that mimics the four
// .from().update().eq().eq() calls the mutation makes and flip its
// return value between ok/err per-test via setSupabaseError().

const { updateSpy, setSupabaseError } = vi.hoisted(() => {
  let nextError: { message: string } | null = null;
  const updateSpy = vi.fn((payload: Record<string, unknown>) => {
    const chain: { eq: (col: string, val: unknown) => typeof chain; _payload?: unknown } = {
      _payload: payload,
      eq(_col: string, _val: unknown) {
        return chain;
      },
    };
    // The mutation awaits the chain, so we attach `then` to resolve.
    return Object.assign(chain, {
      then(resolve: (v: { error: { message: string } | null }) => void) {
        resolve({ error: nextError });
      },
    });
  });
  return {
    updateSpy,
    setSupabaseError(err: { message: string } | null) {
      nextError = err;
    },
  };
});

vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    from: () => ({ update: updateSpy }),
  },
}));

vi.mock("@/hooks/rd/useSession", () => ({
  useSession: () => ({
    user: { id: "test-user-1" },
    session: {},
    loading: false,
  }),
}));

import { useUpdateLeadStage } from "../useUpdateLeadStage";

function wrapper(qc: QueryClient) {
  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={qc}>{children}</QueryClientProvider>;
  };
}

function makeClient(seedLeads: { id: string; stage: string }[]) {
  // Keep gcTime non-zero so the cache survives invalidateQueries with no
  // active observer — otherwise our post-rollback assertion sees undefined.
  const qc = new QueryClient({
    defaultOptions: { queries: { retry: false, staleTime: Infinity } },
  });
  qc.setQueryData(["rd.leads", "test-user-1"], seedLeads);
  return qc;
}

describe("useUpdateLeadStage", () => {
  beforeEach(() => {
    updateSpy.mockClear();
    setSupabaseError(null);
  });

  it("optimistically patches the cache and persists on success", async () => {
    const qc = makeClient([
      { id: "lead-a", stage: "new" },
      { id: "lead-b", stage: "contacted" },
    ]);
    const { result } = renderHook(() => useUpdateLeadStage(), { wrapper: wrapper(qc) });

    await act(async () => {
      await result.current.mutateAsync({ leadId: "lead-a", toStage: "qualified" });
    });

    const cached = qc.getQueryData<{ id: string; stage: string }[]>(["rd.leads", "test-user-1"])!;
    expect(cached.find((l) => l.id === "lead-a")?.stage).toBe("qualified");
    expect(cached.find((l) => l.id === "lead-b")?.stage).toBe("contacted");
    // Supabase update was called with the new stage.
    expect(updateSpy).toHaveBeenCalledWith(
      expect.objectContaining({ status: "qualified" })
    );
  });

  it("rolls the cache back when Supabase returns an error", async () => {
    const qc = makeClient([{ id: "lead-a", stage: "new" }]);
    setSupabaseError({ message: "row level security" });

    const { result } = renderHook(() => useUpdateLeadStage(), { wrapper: wrapper(qc) });

    await act(async () => {
      await expect(
        result.current.mutateAsync({ leadId: "lead-a", toStage: "qualified" })
      ).rejects.toThrow(/row level security/);
    });

    // onSettled invalidates which marks stale; the rolled-back payload is
    // what prev captured, so lead-a should be back to "new".
    await waitFor(() => {
      const cached = qc.getQueryData<{ id: string; stage: string }[]>([
        "rd.leads",
        "test-user-1",
      ])!;
      expect(cached.find((l) => l.id === "lead-a")?.stage).toBe("new");
    });
  });

  it("refuses to fire when there's no signed-in user", async () => {
    // Local override: re-mock useSession to return null, then re-import.
    vi.resetModules();
    vi.doMock("@/hooks/rd/useSession", () => ({
      useSession: () => ({ user: null, session: null, loading: false }),
    }));
    const { useUpdateLeadStage: freshHook } = await import("../useUpdateLeadStage");
    const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    const { result } = renderHook(() => freshHook(), { wrapper: wrapper(qc) });

    await act(async () => {
      await expect(
        result.current.mutateAsync({ leadId: "lead-a", toStage: "qualified" })
      ).rejects.toThrow(/Not signed in/);
    });
    expect(updateSpy).not.toHaveBeenCalled();

    // Clean up so later tests see the default mock again.
    vi.resetModules();
    vi.doUnmock("@/hooks/rd/useSession");
  });
});
