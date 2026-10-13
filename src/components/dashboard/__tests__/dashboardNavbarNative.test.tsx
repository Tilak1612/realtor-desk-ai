import { beforeEach, describe, expect, it, vi } from "vitest";
import { act, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@/test/render";

/**
 * The legacy header (Assistant, Tasks, Properties) inside the iOS / Android
 * app.
 *
 * Three of its controls do not belong in the app: the bell (the product has no
 * notifications, and the newer /app header dropped its bell for that reason),
 * the feedback button (its dialog stores nothing) and the Profile row (not a
 * screen the app has; the guard sends it to Settings, the row beneath it).
 * Everything else stays, and the website keeps all of it.
 */

const h = vi.hoisted(() => ({ native: true, tables: [] as string[] }));

vi.mock("@/lib/native/platform", async (original) => ({
  ...(await original<typeof import("@/lib/native/platform")>()),
  isNativeApp: () => h.native,
}));
vi.mock("@/hooks/rd/useSession", () => ({
  useSession: () => ({ user: { id: "u1" }, session: null, loading: false }),
}));
vi.mock("@/integrations/supabase/client", () => {
  const result = { data: [], error: null };
  const chain: Record<string, unknown> = {};
  for (const k of ["select", "eq", "not", "lte", "order", "update"]) chain[k] = () => chain;
  chain.limit = async () => result;
  return {
    supabase: {
      from: (table: string) => {
        h.tables.push(table);
        return chain;
      },
      auth: { getSession: async () => ({ data: { session: null }, error: null }) },
    },
  };
});

import DashboardNavbar from "../DashboardNavbar";

const USER = { id: "u1" };
const PROFILE = { full_name: "Maya Singh", email: "maya@example.com", avatar_url: null };
const setupUser = () => userEvent.setup({ delay: null, pointerEventsCheck: 0 });

beforeEach(async () => {
  h.native = true;
  h.tables = [];
  await act(async () => {
    await (await import("@/i18n/config")).default.changeLanguage("en");
  });
});

describe("legacy header in the app", () => {
  it("has no notification bell and does not fetch for one", async () => {
    renderWithProviders(<DashboardNavbar user={USER} profile={PROFILE} />, { route: "/tasks" });
    expect(screen.queryByRole("button", { name: "Notifications" })).toBeNull();
    await new Promise((r) => setTimeout(r, 20));
    expect(h.tables).not.toContain("tasks");
  });

  it("has no feedback button", () => {
    renderWithProviders(<DashboardNavbar user={USER} profile={PROFILE} />, { route: "/tasks" });
    expect(screen.queryByRole("button", { name: "Give Feedback" })).toBeNull();
  });

  it("keeps language, quick add and the account menu", () => {
    renderWithProviders(<DashboardNavbar user={USER} profile={PROFILE} />, { route: "/tasks" });
    for (const name of ["Change language", "Add", "Account menu"]) {
      expect(screen.getByRole("button", { name })).toBeInTheDocument();
    }
  });

  it("drops Profile from the account menu and keeps the rest", async () => {
    const user = setupUser();
    renderWithProviders(<DashboardNavbar user={USER} profile={PROFILE} />, { route: "/tasks" });
    await user.click(screen.getByRole("button", { name: "Account menu" }));

    const menu = await screen.findByRole("menu");
    const rows = Array.from(menu.querySelectorAll('[role="menuitem"]')).map((el) => el.textContent?.trim());
    expect(rows).toEqual(["Upload photo", "Settings", "Sign out"]);
  });
});

describe("legacy header on the web (unchanged)", () => {
  beforeEach(() => {
    h.native = false;
  });

  it("keeps the bell, backed by due tasks, and the feedback button", async () => {
    renderWithProviders(<DashboardNavbar user={USER} profile={PROFILE} />, { route: "/tasks" });
    expect(screen.getByRole("button", { name: "Notifications" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Give Feedback" })).toBeInTheDocument();
    await waitFor(() => expect(h.tables).toContain("tasks"));
  });

  it("keeps Profile in the account menu", async () => {
    const user = setupUser();
    renderWithProviders(<DashboardNavbar user={USER} profile={PROFILE} />, { route: "/tasks" });
    await user.click(screen.getByRole("button", { name: "Account menu" }));

    const menu = await screen.findByRole("menu");
    const rows = Array.from(menu.querySelectorAll('[role="menuitem"]')).map((el) => el.textContent?.trim());
    expect(rows).toEqual(["Upload photo", "Profile", "Settings", "Sign out"]);
  });
});
