import { beforeEach, describe, expect, it, vi } from "vitest";
import { act, screen } from "@testing-library/react";
import { renderWithProviders } from "@/test/render";

/**
 * The data card on Settings ("Export my data", "Delete my account").
 *
 * It used to end in a grey box reading "Security: PIPEDA": the name of a
 * statute with nothing after it, which says nothing about the data and can be
 * read as a claim of compliance. It was a leftover on the website as much as
 * in the app, so it is gone from both.
 */

const h = vi.hoisted(() => ({ native: false }));

vi.mock("@/lib/native/platform", async (original) => ({
  ...(await original<typeof import("@/lib/native/platform")>()),
  isNativeApp: () => h.native,
}));
vi.mock("@/integrations/supabase/client", () => {
  const chain: Record<string, unknown> = {};
  for (const k of ["select", "eq", "update", "order", "limit"]) chain[k] = () => chain;
  chain.single = async () => ({ data: { id: "u1", full_name: "Maya Singh", email: "maya@example.com" }, error: null });
  chain.maybeSingle = chain.single;
  return {
    supabase: {
      from: () => chain,
      auth: {
        getUser: async () => ({ data: { user: { id: "u1", email: "maya@example.com" } }, error: null }),
        getSession: async () => ({ data: { session: null }, error: null }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
        mfa: { listFactors: async () => ({ data: { totp: [] }, error: null }) },
      },
    },
  };
});
vi.mock("@/contexts/SubscriptionContext", () => ({
  useSubscription: () => ({
    subscribed: true, trialDaysLeft: 0, trialExpired: false, subscriptionTier: "agent", trialEndsAt: null, subscriptionEnd: null,
  }),
}));
// The chrome and the neighbouring cards are not under test.
vi.mock("@/components/layout/AppLayout", () => ({
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));
vi.mock("@/components/rd/layout/AppShell", () => ({
  AppShell: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));
vi.mock("@/components/settings/MFASetup", () => ({ default: () => null }));
vi.mock("@/components/integrations/GoogleCalendarCard", () => ({ default: () => null }));
vi.mock("@/components/settings/ChangePassword", () => ({ default: () => null, useHasPasswordAuth: () => false }));
vi.mock("@/components/settings/DeleteAccountDialog", () => ({ default: () => <p>delete account control</p> }));

import Settings from "../Settings";

beforeEach(async () => {
  h.native = false;
  await act(async () => {
    await (await import("@/i18n/config")).default.changeLanguage("en");
  });
});

describe.each([
  ["on the web", false],
  ["in the app", true],
])("Settings data card %s", (_where, native) => {
  it("has export and delete, and no bare 'Security: PIPEDA' box", async () => {
    h.native = native;
    const { container } = renderWithProviders(<Settings appChrome />, { route: "/app/settings" });

    expect(await screen.findByText("Export my data")).toBeInTheDocument();
    expect(screen.getByText("delete account control")).toBeInTheDocument();
    // The box was a <strong>Security:</strong> followed by the one word.
    expect(container.textContent).not.toMatch(/Security:\s*PIPEDA/);
    expect(Array.from(container.querySelectorAll("strong")).map((el) => el.textContent)).not.toContain("Security:");
  });
});
