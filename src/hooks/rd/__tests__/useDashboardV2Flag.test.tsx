import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ReactNode } from "react";
import { renderHook, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

/**
 * Which dashboard /app shows.
 *
 * On the web v1 is the default and v2 is opt-in (?v=2, or a flag on the
 * account). Inside the iOS / Android app it is the other way round: v2 is the
 * default for everyone, because v1 words its feed as "Desk AI replied to …"
 * under a "Live" badge and nothing in the product replies on its own. The web
 * half of this file exists to prove the app's rule did not move the website.
 */

const h = vi.hoisted(() => ({
  native: false,
  accountFlag: false as boolean,
  profileReads: 0,
}));

vi.mock("@/lib/native/platform", async (original) => ({
  ...(await original<typeof import("@/lib/native/platform")>()),
  isNativeApp: () => h.native,
}));
vi.mock("@/hooks/rd/useSession", () => ({
  useSession: () => ({ user: { id: "u1" }, session: null, loading: false }),
}));
vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    from: () => ({
      select: () => ({
        eq: () => ({
          maybeSingle: async () => {
            h.profileReads += 1;
            return { data: { business_preferences: { dashboard_v2: h.accountFlag } }, error: null };
          },
        }),
      }),
    }),
  },
}));

import { useDashboardV2Flag } from "../useDashboardV2Flag";

function flagAt(route: string) {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false, gcTime: 0 } } });
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={qc}>
      <MemoryRouter initialEntries={[route]}>{children}</MemoryRouter>
    </QueryClientProvider>
  );
  return renderHook(() => useDashboardV2Flag(), { wrapper });
}

beforeEach(() => {
  h.native = false;
  h.accountFlag = false;
  h.profileReads = 0;
  window.localStorage.clear();
});

describe("dashboard v2 flag on the web (unchanged)", () => {
  it("is off by default, once the account has been read", async () => {
    const { result } = flagAt("/app");
    await waitFor(() => expect(result.current.resolving).toBe(false));
    expect(result.current).toEqual({ enabled: false, resolving: false, source: null });
    expect(h.profileReads).toBe(1);
  });

  it("turns on with ?v=2 and remembers it for this browser", () => {
    expect(flagAt("/app?v=2").result.current).toEqual({ enabled: true, resolving: false, source: "url" });
    expect(flagAt("/app").result.current).toEqual({ enabled: true, resolving: false, source: "local" });
  });

  it("turns off with ?v=1 and forgets the remembered choice", async () => {
    flagAt("/app?v=2");
    expect(flagAt("/app?v=1").result.current).toEqual({ enabled: false, resolving: false, source: null });
    const { result } = flagAt("/app");
    await waitFor(() => expect(result.current.resolving).toBe(false));
    expect(result.current.enabled).toBe(false);
  });

  it("turns on for an account that has the flag", async () => {
    h.accountFlag = true;
    const { result } = flagAt("/app");
    await waitFor(() => expect(result.current.enabled).toBe(true));
    expect(result.current.source).toBe("account");
  });
});

describe("dashboard v2 flag inside the app", () => {
  beforeEach(() => {
    h.native = true;
  });

  it("is on by default, from the first render, without reading the account", async () => {
    const { result } = flagAt("/app");
    // First render, not "eventually": resolving true here would paint v1 first.
    expect(result.current).toEqual({ enabled: true, resolving: false, source: "native" });
    await new Promise((r) => setTimeout(r, 20));
    expect(h.profileReads).toBe(0);
    expect(result.current.enabled).toBe(true);
  });

  it("does not depend on the account flag or on anything stored", () => {
    h.accountFlag = false;
    window.localStorage.removeItem("rd.dashboardV2");
    expect(flagAt("/app").result.current.enabled).toBe(true);
  });

  it("can still be overridden with ?v=1", () => {
    expect(flagAt("/app?v=1").result.current).toEqual({ enabled: false, resolving: false, source: null });
  });

  it("does not remember ?v=1: the next visit without it is v2 again", () => {
    flagAt("/app?v=1");
    expect(flagAt("/app").result.current).toEqual({ enabled: true, resolving: false, source: "native" });
  });

  it("keeps ?v=2 working", () => {
    expect(flagAt("/app?v=2").result.current).toEqual({ enabled: true, resolving: false, source: "url" });
  });
});
