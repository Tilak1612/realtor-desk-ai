import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const calls: Record<string, unknown[]> = {};
let result: { data: unknown; error: unknown } = { data: [], error: null };

// Chainable stub that records every filter so the test can assert the query is
// actually scoped, rather than only that it returned something.
function chain() {
  const c: Record<string, unknown> = {};
  for (const m of ["select", "eq", "not", "lte", "order", "limit"]) {
    c[m] = vi.fn((...args: unknown[]) => {
      (calls[m] ??= []).push(args);
      return m === "limit" ? Promise.resolve(result) : c;
    });
  }
  return c;
}
vi.mock("@/integrations/supabase/client", () => ({
  supabase: { from: vi.fn((t: string) => { (calls.from ??= []).push([t]); return chain(); }) },
}));
vi.mock("../rd/useSession", () => ({
  useSession: () => ({ user: { id: "agent-1" }, loading: false }),
}));

import { useDueTasks } from "../useDueTasks";

const wrap = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
    {children}
  </QueryClientProvider>
);

/**
 * The bell in DashboardNavbar read `const notificationCount = 0` with a TODO
 * beside it, so it asserted "No new notifications" to every user on every
 * page -- including an agent with overdue showings. A control that always
 * returns the same answer reads as a checked negative result, which is worse
 * than no control at all.
 */
describe("useDueTasks", () => {
  beforeEach(() => { for (const k in calls) delete calls[k]; });

  it("asks only for this user's pending tasks that are already due", async () => {
    result = { data: [], error: null };
    renderHook(() => useDueTasks(), { wrapper: wrap });

    await waitFor(() => expect(calls.limit).toBeDefined());
    expect(calls.from?.[0]).toEqual(["tasks"]);
    // Scoped to the signed-in user rather than relying on RLS alone.
    expect(calls.eq).toContainEqual(["user_id", "agent-1"]);
    expect(calls.eq).toContainEqual(["status", "pending"]);
    // Only tasks that have actually come due.
    expect(calls.lte?.[0]?.[0]).toBe("due_date");
  });

  it("uses the local calendar day, not UTC", async () => {
    // Pinned to a moment where the two genuinely disagree: 23:30 in Vancouver
    // is already the next calendar day in UTC. Without pinning, this assertion
    // passes for ~17 hours a day no matter how the date is computed, so it
    // would have been a test that could not fail.
    const tz = process.env.TZ;
    process.env.TZ = "America/Vancouver";
    vi.useFakeTimers({ shouldAdvanceTime: true });
    vi.setSystemTime(new Date(2026, 2, 10, 23, 30));
    try {
      result = { data: [], error: null };
      renderHook(() => useDueTasks(), { wrapper: wrap });
      await waitFor(() => expect(calls.lte).toBeDefined());

      // toISOString() would yield 2026-03-11 here and show a west coast agent
      // tomorrow's tasks as already due, every evening.
      expect(calls.lte?.[0]?.[1]).toBe("2026-03-10");
    } finally {
      vi.useRealTimers();
      process.env.TZ = tz;
    }
  });

  it("separates overdue from due-today", async () => {
    result = {
      data: [
        { id: "a", title: "Call vendor", due_date: "2000-01-01", priority: "high" },
        { id: "b", title: "Showing prep", due_date: null, priority: null },
      ],
      error: null,
    };
    const { result: r } = renderHook(() => useDueTasks(), { wrapper: wrap });

    await waitFor(() => expect(r.current.count).toBe(2));
    expect(r.current.tasks[0].overdue).toBe(true);
    expect(r.current.tasks[1].overdue).toBe(false);
  });

  it("surfaces a failure instead of reporting an empty inbox", async () => {
    result = { data: null, error: { message: "permission denied" } };
    const { result: r } = renderHook(() => useDueTasks(), { wrapper: wrap });

    await waitFor(() => expect(r.current.error).toBeTruthy());
    // The count is 0, but `error` is set so the UI can say so rather than
    // claiming there is nothing to see.
    expect(r.current.error?.message).toMatch(/permission denied/);
  });
});
