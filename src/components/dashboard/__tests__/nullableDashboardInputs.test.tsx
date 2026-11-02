import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { waitFor } from "@testing-library/react";
import { renderWithProviders } from "@/test/render";

/**
 * The legacy dashboard's widgets receive database rows whose fields are
 * nullable (tasks and their contact / deal joins, contacts' email and score,
 * profiles' city). None of them may render a literal "null" / "undefined" or
 * build a link from a missing value, and a dashboard whose figures failed to
 * load must show a neutral trend rather than an accidental "down". The legacy
 * Dashboard page itself is not routed; it is mounted here directly. All data
 * is mocked.
 */

const h = vi.hoisted(() => ({
  statCards: [] as Array<{ title: string; change?: number; trend?: string }>,
  marketCity: [] as Array<string | undefined>,
  profile: { id: "u1", full_name: "Ann Agent", city: null as string | null, onboarding_completed: true },
  failFirstQuery: false,
}));

vi.mock("@/integrations/supabase/client", () => {
  const ok = { data: [], count: 0, error: null };
  const builder = (table: string) => {
    const b: Record<string, unknown> = {};
    for (const k of ["select", "eq", "gte", "lte", "order", "limit", "in", "update"]) b[k] = () => b;
    b.single = async () => ({ data: table === "profiles" ? h.profile : null, error: null });
    b.maybeSingle = b.single;
    b.then = (resolve: (v: unknown) => unknown, reject: (e: unknown) => unknown) => {
      if (h.failFirstQuery && table === "contacts") return Promise.reject(new Error("offline")).then(resolve, reject);
      return Promise.resolve(ok).then(resolve, reject);
    };
    return b;
  };
  return {
    supabase: {
      from: builder,
      auth: { getSession: async () => ({ data: { session: { user: { id: "u1" } } } }) },
      storage: { from: () => ({}) },
    },
  };
});
vi.mock("@/contexts/SubscriptionContext", () => ({ useSubscription: () => ({ subscribed: true, trialDaysLeft: 0 }) }));
vi.mock("@/components/layout/AppLayout", () => ({ default: ({ children }: { children: React.ReactNode }) => <div>{children}</div> }));
vi.mock("@/components/dashboard/StatCard", () => ({
  default: (p: { title: string; change?: number; trend?: string }) => {
    h.statCards.push({ title: p.title, change: p.change, trend: p.trend });
    return null;
  },
}));
vi.mock("@/components/dashboard/MarketWidget", () => ({
  default: (p: { defaultCity?: string }) => {
    h.marketCity.push(p.defaultCity);
    return null;
  },
}));
for (const w of ["HotLeadsWidget", "TasksWidget", "DealsWidget", "TrialBanner", "TodayOnboardingChecklist", "TodayFocusWidget", "RecentActivityWidget", "RevenueBreakdownWidget", "DataImportCard"]) {
  vi.doMock(`@/components/dashboard/${w}`, () => ({ default: () => null }));
}

beforeEach(() => {
  h.statCards.length = 0;
  h.marketCity.length = 0;
  h.profile = { ...h.profile, city: null };
  h.failFirstQuery = false;
});

describe("legacy Dashboard boundaries", () => {
  it("shows a neutral leads trend, with no change figure, when the figures failed to load", async () => {
    h.failFirstQuery = true;
    const { default: Dashboard } = await import("@/pages/Dashboard");
    renderWithProviders(<Dashboard />, { route: "/dashboard" });

    // Four StatCards per render; the leads card is the first of the latest
    // render, once loading has ended with the figures missing.
    await waitFor(() => expect(h.statCards.length).toBeGreaterThan(0));
    const leads = h.statCards.slice(-4)[0];
    expect(leads.title).toBe("New Leads (This Month)");
    expect(leads.trend).toBe("neutral");
    expect(leads.change).toBeUndefined();
  });

  it("keeps the loaded trend as before: 0% change reads as up", async () => {
    const { default: Dashboard } = await import("@/pages/Dashboard");
    renderWithProviders(<Dashboard />, { route: "/dashboard" });

    await waitFor(() => expect(h.statCards.slice(-4)[0]).toMatchObject({ title: "New Leads (This Month)", trend: "up", change: 0 }));
  });

  it("passes no city for a profile without one, so MarketWidget uses its own default", async () => {
    const { default: Dashboard } = await import("@/pages/Dashboard");
    renderWithProviders(<Dashboard />, { route: "/dashboard" });

    await waitFor(() => expect(h.marketCity.length).toBeGreaterThan(0));
    expect(h.marketCity.every((c) => c === undefined)).toBe(true);
  });
});
