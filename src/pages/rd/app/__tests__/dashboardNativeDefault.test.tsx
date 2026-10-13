import { beforeEach, describe, expect, it, vi } from "vitest";
import { act, screen } from "@testing-library/react";
import { renderWithProviders } from "@/test/render";

/**
 * /app inside the iOS / Android app.
 *
 * The v1 dashboard counts "Showings booked" and titles its feed "Desk AI
 * activity"; nothing in the product books or replies on its own. The app
 * therefore opens on v2. Two things are easy to get wrong and are pinned here:
 * v1 must not be what paints while the v2 chunk loads, and v2 must not call
 * itself a "Preview" (or link back to v1) where it is the only dashboard.
 */

const h = vi.hoisted(() => ({ native: true }));

vi.mock("@/lib/native/platform", async (original) => ({
  ...(await original<typeof import("@/lib/native/platform")>()),
  isNativeApp: () => h.native,
}));
// The shell drags in auth, billing and nav; none of it is under test.
vi.mock("@/components/rd/layout/AppShell", () => ({
  AppShell: ({ children }: { children: React.ReactNode }) => <main>{children}</main>,
}));
vi.mock("@/components/rd/AddLeadDialog", () => ({ AddLeadDialog: () => null }));
vi.mock("@/hooks/rd/useSession", () => ({
  useSession: () => ({ user: { id: "u1", email: "maya@example.com", user_metadata: { full_name: "Maya Singh" } }, loading: false }),
}));
vi.mock("@/hooks/rd/useLeads", () => ({
  useLeads: () => ({ loading: false, error: null, leads: [] }),
  useLead: () => ({ loading: false, error: null, lead: undefined }),
}));
vi.mock("@/hooks/rd/useDashboardFeed", () => ({
  useActivityFeed: () => ({ activity: [], loading: false, error: null }),
  useLeadsPerDay: () => ({ points: [], loading: false }),
}));
vi.mock("@/hooks/rd/useDashboardData", () => ({
  useDashboardData: () => ({ summary: null, queue: [], names: {}, loading: true, error: null, refetch: vi.fn(), updatedAt: null }),
}));
vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    from: () => ({
      select: () => ({ eq: () => ({ maybeSingle: async () => ({ data: { business_preferences: {} }, error: null }) }) }),
    }),
  },
}));

import Dashboard from "../Dashboard";
import DashboardV2 from "../DashboardV2";

// Text only v1 renders, and the heading only v2 renders.
const V1_ONLY = /Showings booked|Desk AI activity/;
const V2_REGION = "Key numbers";

beforeEach(async () => {
  h.native = true;
  window.localStorage.clear();
  await act(async () => {
    await (await import("@/i18n/config")).default.changeLanguage("en");
  });
});

describe("/app in the app", () => {
  it("opens on dashboard v2 and never paints v1 on the way", async () => {
    const { container } = renderWithProviders(<Dashboard />, { route: "/app" });
    // What is on screen before the v2 chunk has loaded.
    expect(container.textContent).not.toMatch(V1_ONLY);

    expect(await screen.findByRole("region", { name: V2_REGION })).toBeInTheDocument();
    expect(container.textContent).not.toMatch(V1_ONLY);
  });

  it("still shows v1 for ?v=1", () => {
    const { container } = renderWithProviders(<Dashboard />, { route: "/app?v=1" });
    expect(container.textContent).toMatch(V1_ONLY);
    expect(screen.queryByRole("region", { name: V2_REGION })).toBeNull();
  });

  it("does not label v2 a preview or link back to v1", () => {
    const { container } = renderWithProviders(<DashboardV2 />, { route: "/app" });
    expect(screen.queryByText("Preview")).toBeNull();
    expect(screen.queryByText("Back to the current dashboard")).toBeNull();
    expect(container.querySelector('a[href*="v=1"]')).toBeNull();
  });
});

describe("/app on the web (unchanged)", () => {
  beforeEach(() => {
    h.native = false;
  });

  it("opens on v1", () => {
    const { container } = renderWithProviders(<Dashboard />, { route: "/app" });
    expect(container.textContent).toMatch(V1_ONLY);
    expect(screen.queryByRole("region", { name: V2_REGION })).toBeNull();
  });

  it("labels v2 a preview, with the link back to v1", () => {
    renderWithProviders(<DashboardV2 />, { route: "/app?v=2" });
    expect(screen.getByText("Preview")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Back to the current dashboard" })).toHaveAttribute("href", "/app?v=1");
  });
});
