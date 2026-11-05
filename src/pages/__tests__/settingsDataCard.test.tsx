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
import { settingsDataEn, settingsDataFr } from "@/i18n/settingsData";

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

/**
 * The card's own wording. It was titled "Security (PIPEDA)", described as
 * "PIPEDA & CASL Compliant" and its export line ended "(PIPEDA access right)":
 * three claims of compliance on a card that exports and deletes data. It now
 * says where the database is and what can be done here, in both languages.
 */
describe.each([
  ["en", settingsDataEn, "Export my data"],
  ["fr", settingsDataFr, "Exporter mes données"],
] as const)("Settings data card wording (%s)", (lng, copy, exportTitle) => {
  it("names the card, says where the database is, and claims no compliance", async () => {
    await act(async () => {
      await (await import("@/i18n/config")).default.changeLanguage(lng);
    });
    renderWithProviders(<Settings appChrome />, { route: "/app/settings" });

    expect(await screen.findByText(exportTitle)).toBeInTheDocument();
    expect(screen.getByText(copy.description)).toBeInTheDocument();
    expect(screen.getByText(copy.exportDesc)).toBeInTheDocument();

    // The whole card (shadcn Card root): heading, description, export row.
    const card = screen.getByText(copy.title).closest(".rounded-lg.border");
    expect(card).not.toBeNull();
    const text = card!.textContent ?? "";
    expect(text).toContain(copy.description);
    expect(text).toContain(copy.exportDesc);
    expect(text).not.toMatch(/PIPEDA|LPRPDE|CASL|LCAP|complian|conforme/i);
  });

  it("makes no legal claim in the strings themselves", () => {
    for (const value of Object.values(copy)) {
      expect(value).not.toMatch(/PIPEDA|LPRPDE|CASL|LCAP|complian|conforme|certif/i);
    }
    expect(copy.description).toMatch(/Canada/);
  });
});
