import { beforeEach, describe, expect, it, vi } from "vitest";
import { act, screen } from "@testing-library/react";
import { renderWithProviders } from "@/test/render";

/**
 * The "Subscription Status" card on Settings, inside the iOS / Android app.
 *
 * The app is a sign-in companion to a subscription bought on the website and
 * shows no purchase path (App Store guideline 3.1.3(f), Google Play payments
 * policy). RequireBilling already sends an account without a Stripe
 * subscription to NoAccessScreen ("No active subscription on this account").
 * Settings sits outside that gate, so it is the one product screen such an
 * account can open; the card there used to say "Trial Active, 14 days left"
 * or "Trial Expired" (the database's own trial, which grants no access),
 * which contradicts the no-access screen and reads as a prompt to buy. In the
 * app the card is now rendered only for a subscribed account. On the web
 * nothing changes.
 */

const h = vi.hoisted(() => ({
  native: false,
  sub: { subscribed: false, subscriptionUnknown: false, trialDaysLeft: 9, trialExpired: false, subscriptionTier: null as string | null, trialEndsAt: "2026-11-04T00:00:00Z" as string | null, subscriptionEnd: null as string | null },
  profile: { id: "u1", full_name: "Maya Singh", email: "maya@example.com", is_demo: false } as Record<string, unknown>,
}));

vi.mock("@/lib/native/platform", async (original) => ({
  ...(await original<typeof import("@/lib/native/platform")>()),
  isNativeApp: () => h.native,
}));
vi.mock("@/integrations/supabase/client", () => {
  const chain: Record<string, unknown> = {};
  for (const k of ["select", "eq", "update", "order", "limit"]) chain[k] = () => chain;
  chain.single = async () => ({ data: h.profile, error: null });
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
  useSubscription: () => h.sub,
}));
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

const trial = { subscribed: false, subscriptionUnknown: false, trialDaysLeft: 9, trialExpired: false, subscriptionTier: null, trialEndsAt: "2026-11-04T00:00:00Z", subscriptionEnd: null };
const expired = { ...trial, trialDaysLeft: 0, trialExpired: true };
const paid = { subscribed: true, subscriptionUnknown: false, trialDaysLeft: 0, trialExpired: false, subscriptionTier: "agent", trialEndsAt: null, subscriptionEnd: "2026-12-01T00:00:00Z" };
// check-subscription counts Stripe's past_due as entitled (access is kept
// through the retry window), so the client sees it as subscribed.
const pastDue = { ...paid };
// The check itself failed. RequireBilling fails open on this; Settings has to
// stay usable and must not guess a trial or an upsell either.
const unknown = { ...trial, subscriptionUnknown: true, trialDaysLeft: 0 };
const baseProfile = { id: "u1", full_name: "Maya Singh", email: "maya@example.com", is_demo: false };

beforeEach(async () => {
  h.native = false;
  h.sub = { ...trial };
  h.profile = { ...baseProfile };
  await act(async () => {
    await (await import("@/i18n/config")).default.changeLanguage("en");
  });
});

describe("Settings subscription card in the app", () => {
  it.each([
    ["an unpaid trial", trial, /days left in your trial/],
    ["an expired trial", expired, /Trial expired/i],
  ])("is not rendered for %s", async (_what, sub, marker) => {
    h.native = true;
    h.sub = { ...sub };
    renderWithProviders(<Settings appChrome />, { route: "/app/settings" });

    expect(await screen.findByText("Export my data")).toBeInTheDocument();
    expect(screen.queryByText(/Subscription status/i)).not.toBeInTheDocument();
    expect(screen.queryByText(marker)).not.toBeInTheDocument();
    // Nothing on the page may read as a way to pay.
    expect(screen.queryByText(/Upgrade now|Subscribe now|Manage billing/i)).not.toBeInTheDocument();
  });

  it("still shows a subscribed account its plan, with no billing link", async () => {
    h.native = true;
    h.sub = { ...paid };
    renderWithProviders(<Settings appChrome />, { route: "/app/settings" });

    expect(await screen.findByText(/Subscription status/i)).toBeInTheDocument();
    expect(screen.getByText("Solo plan")).toBeInTheDocument();
    expect(screen.queryByText(/Manage billing|Upgrade now/i)).not.toBeInTheDocument();
  });
});

describe("Settings subscription card on the web", () => {
  it("is unchanged: the trial countdown and the Billing link stay", async () => {
    h.native = false;
    h.sub = { ...trial };
    renderWithProviders(<Settings appChrome />, { route: "/app/settings" });

    expect(await screen.findByText(/Subscription status/i)).toBeInTheDocument();
    expect(screen.getByText(/days left in your trial/)).toBeInTheDocument();
    expect(screen.getByText(/Upgrade now/i)).toBeInTheDocument();
  });
});

// Every link actually rendered on the page, as a URL, so a renamed label or a
// new button cannot slip a purchase path past text-only assertions.
const PURCHASE_HREF = /\/billing|\/pricing|\/signup|checkout|stripe\.com|\/upgrade/i;
const purchaseLinks = () =>
  Array.from(document.querySelectorAll("a[href]"))
    .map((a) => a.getAttribute("href") ?? "")
    .filter((href) => PURCHASE_HREF.test(href));

const setLanguage = async (lng: "en" | "fr") => {
  await act(async () => {
    await (await import("@/i18n/config")).default.changeLanguage(lng);
  });
};

describe("Settings in the app, across every subscription state", () => {
  it.each([
    ["an unpaid database trial", trial, {}, false],
    ["an expired trial", expired, {}, false],
    ["an unknown status (the check failed)", unknown, {}, false],
    ["an unpaid demo account", trial, { is_demo: true }, false],
    ["a paid subscription", paid, {}, true],
    ["a past-due subscription", pastDue, {}, true],
  ])("%s: no purchase link, and export and delete stay reachable", async (_what, sub, profile, cardShown) => {
    h.native = true;
    h.sub = { ...sub };
    h.profile = { ...baseProfile, ...profile };
    renderWithProviders(<Settings appChrome />, { route: "/app/settings" });

    expect(await screen.findByText("Export my data")).toBeInTheDocument();
    expect(screen.getByText("delete account control")).toBeInTheDocument();
    expect(purchaseLinks()).toEqual([]);
    expect(screen.queryByText(/Upgrade|Subscribe now|Manage billing|Choose (your )?plan/i)).not.toBeInTheDocument();
    if (cardShown) expect(screen.getByText(/Subscription status/i)).toBeInTheDocument();
    else expect(screen.queryByText(/Subscription status/i)).not.toBeInTheDocument();
  });
});

describe("Settings in the app, in French", () => {
  it.each([
    ["essai non payé", trial, false],
    ["essai expiré", expired, false],
    ["abonnement payé", paid, true],
  ])("%s : aucun lien d'achat, export et suppression accessibles", async (_what, sub, cardShown) => {
    h.native = true;
    h.sub = { ...sub };
    await setLanguage("fr");
    renderWithProviders(<Settings appChrome />, { route: "/app/settings" });

    expect(await screen.findByText("Exporter mes données")).toBeInTheDocument();
    expect(screen.getByText("delete account control")).toBeInTheDocument();
    expect(purchaseLinks()).toEqual([]);
    expect(
      screen.queryByText(/Mettre à niveau|Passer à l'offre supérieure|Gérer la facturation|jours restants dans votre essai/i),
    ).not.toBeInTheDocument();
    if (cardShown) expect(screen.getByText(/Statut de l'abonnement/i)).toBeInTheDocument();
    else expect(screen.queryByText(/Statut de l'abonnement/i)).not.toBeInTheDocument();
  });
});

describe("Settings on the website keeps its billing link", () => {
  it.each([
    ["an unpaid trial", trial, /Upgrade now/i],
    ["a paid subscription", paid, /Manage billing/i],
  ])("%s links to /billing", async (_what, sub, label) => {
    h.sub = { ...sub };
    renderWithProviders(<Settings appChrome />, { route: "/app/settings" });

    expect(await screen.findByText(label)).toBeInTheDocument();
    expect(purchaseLinks()).toContain("/billing");
  });

  it("does so in French too", async () => {
    h.sub = { ...trial };
    await setLanguage("fr");
    renderWithProviders(<Settings appChrome />, { route: "/app/settings" });

    expect(await screen.findByText(/Statut de l'abonnement/i)).toBeInTheDocument();
    expect(purchaseLinks()).toContain("/billing");
  });
});
