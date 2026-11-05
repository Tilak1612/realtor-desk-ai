import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { act, fireEvent, screen, waitFor } from "@testing-library/react";
import { Route, Routes } from "react-router-dom";
import { renderWithProviders } from "@/test/render";

/**
 * The app's purchase paths, checked at the sinks rather than at the screens.
 *
 * nativeAuthSurface.test.tsx checks what the billing page and the trial-expired
 * dialog *render* in the app. This file checks what they *do*: in the iOS /
 * Android app no Stripe Checkout or customer-portal request is made and no
 * server-returned checkout URL is opened, while on the website both still work.
 * It also pins the source inventory, so a new checkout call site, or a legacy
 * screen with an unguarded upgrade button being mounted again, fails here
 * instead of in App Review (guideline 3.1.3(f), Google Play payments policy).
 *
 * Everything is mocked: no network, no Stripe, no session.
 */

const CHECKOUT_URL = "https://checkout.stripe.test/c/pay/cs_test_synthetic";
const PORTAL_URL = "https://billing.stripe.test/p/session/test_synthetic";

const h = vi.hoisted(() => ({
  native: false,
  invoke: vi.fn(),
  getSession: vi.fn(),
  sub: {
    subscribed: false,
    subscriptionUnknown: false,
    loading: false,
    productId: null as string | null,
    priceId: null as string | null,
    subscriptionEnd: null as string | null,
    subscriptionTier: null as string | null,
    trialDaysLeft: 0,
    trialExpired: true,
    trialEndsAt: null as string | null,
    refreshSubscription: async () => {},
  },
}));

vi.mock("@/lib/native/platform", async (original) => ({
  ...(await original<typeof import("@/lib/native/platform")>()),
  isNativeApp: () => h.native,
}));
vi.mock("@/contexts/SubscriptionContext", async (original) => ({
  ...(await original<typeof import("@/contexts/SubscriptionContext")>()),
  useSubscription: () => h.sub,
}));
vi.mock("@/components/layout/AppLayout", () => ({
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));
vi.mock("@/utils/analytics", () => ({ trackEvent: () => {} }));
vi.mock("@/integrations/supabase/client", () => {
  const chain: Record<string, unknown> = {};
  for (const k of ["select", "eq", "update", "order", "limit"]) chain[k] = () => chain;
  chain.single = async () => ({ data: { id: "u1", full_name: "Maya Singh", email: "maya@example.com" }, error: null });
  chain.maybeSingle = chain.single;
  return {
    supabase: {
      from: () => chain,
      auth: {
        getSession: (...a: unknown[]) => h.getSession(...a),
        getUser: async () => ({ data: { user: { id: "u1" } }, error: null }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      },
      functions: { invoke: (...a: unknown[]) => h.invoke(...a) },
    },
  };
});

let openSpy: ReturnType<typeof vi.spyOn>;

beforeEach(async () => {
  h.native = false;
  h.sub = { ...h.sub, subscribed: false, subscriptionTier: null, subscriptionEnd: null, trialExpired: true };
  h.invoke.mockReset();
  h.invoke.mockImplementation(async (name: string) => ({
    data: { url: name === "customer-portal" ? PORTAL_URL : CHECKOUT_URL },
    error: null,
  }));
  h.getSession.mockReset();
  h.getSession.mockResolvedValue({ data: { session: { user: { id: "u1", email: "maya@example.com" } } }, error: null });
  openSpy?.mockRestore();
  openSpy = vi.spyOn(window, "open").mockImplementation(() => null);
  await act(async () => {
    await (await import("@/i18n/config")).default.changeLanguage("en");
  });
});

// ---------- source inventory ----------

const SRC = join(process.cwd(), "src");

function sourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) return name === "__tests__" || name === "test" ? [] : sourceFiles(p);
    return /\.(ts|tsx)$/.test(name) && !/\.test\.(ts|tsx)$/.test(name) ? [p] : [];
  });
}

const files = sourceFiles(SRC).map((p) => ({ path: relative(process.cwd(), p), text: readFileSync(p, "utf8") }));

describe("purchase sinks in the source", () => {
  it("only the billing page and the trial-expired dialog call create-checkout or customer-portal", () => {
    const callers = files
      .filter((f) => /functions\.invoke\(\s*['"`](create-checkout|customer-portal)['"`]/.test(f.text))
      .map((f) => f.path)
      .sort();
    expect(callers).toEqual(["src/components/dashboard/TrialExpiredModal.tsx", "src/pages/Billing.tsx"]);
  });

  it("both of them leave before mounting anything in the app", () => {
    const text = (p: string) => files.find((f) => f.path === p)!.text;
    // The exported Billing wrapper redirects before BillingPage, and so its
    // handlers, ever mount.
    expect(text("src/pages/Billing.tsx")).toMatch(
      /const Billing = \(\) => \{\s*if \(isNativeApp\(\)\) return <Navigate to="\/app" replace \/>;/,
    );
    expect(text("src/pages/Billing.tsx")).toMatch(/export default Billing;/);
    expect(text("src/components/dashboard/TrialExpiredModal.tsx")).toMatch(/if \(isNativeApp\(\)\) return null;/);
  });

  it("no source file links to a Stripe-hosted page directly", () => {
    const direct = files.filter((f) => /(checkout|billing|buy)\.stripe\.com/.test(f.text)).map((f) => f.path);
    expect(direct).toEqual([]);
  });

  it("the legacy dashboard, whose trial banner has an unguarded upgrade button, stays unmounted", () => {
    // TrialBanner links to /billing with "Upgrade now" and has no native check.
    // It is only reachable through pages/Dashboard, which App.tsx imports
    // lazily but never renders (/dashboard redirects to /app). If that ever
    // changes, the banner needs the same isNativeApp guard as its siblings.
    const app = files.find((f) => f.path === "src/App.tsx")!.text;
    expect(app).not.toMatch(/<Dashboard[\s/>]/);
    const bannerUsers = files.filter((f) => /from ["']@\/components\/dashboard\/TrialBanner["']/.test(f.text)).map((f) => f.path);
    expect(bannerUsers).toEqual(["src/pages/Dashboard.tsx"]);
  });
});

// ---------- behaviour ----------

describe("the trial-expired dialog's checkout", () => {
  it("in the app: renders nothing, so no checkout request is made and nothing is opened", async () => {
    h.native = true;
    const { default: TrialExpiredModal } = await import("@/components/dashboard/TrialExpiredModal");
    renderWithProviders(<TrialExpiredModal isOpen />);

    expect(screen.queryAllByRole("button")).toHaveLength(0);
    expect(document.querySelectorAll("a[href]")).toHaveLength(0);
    expect(h.invoke).not.toHaveBeenCalled();
    expect(openSpy).not.toHaveBeenCalled();
  });

  it("on the website: still starts Stripe Checkout and opens the returned URL", async () => {
    const { default: TrialExpiredModal } = await import("@/components/dashboard/TrialExpiredModal");
    renderWithProviders(<TrialExpiredModal isOpen />);

    fireEvent.click(screen.getByText("Subscribe Monthly"));
    await waitFor(() => expect(openSpy).toHaveBeenCalledWith(CHECKOUT_URL, "_blank"));
    expect(h.invoke).toHaveBeenCalledWith("create-checkout", expect.objectContaining({ body: expect.any(Object) }));
  });
});

describe("the billing page's checkout and portal", () => {
  const renderBilling = async (route: string) => {
    const { default: Billing } = await import("@/pages/Billing");
    return renderWithProviders(
      <Routes>
        <Route path="/billing" element={<Billing />} />
        <Route path="/app" element={<div>APP HOME</div>} />
        <Route path="/login" element={<div>SIGN IN</div>} />
      </Routes>,
      { route },
    );
  };

  it.each(["/billing", "/billing?required=1", "/billing?success=true"])(
    "in the app, %s never mounts the page: no session read, no request, nothing opened",
    async (route) => {
      h.native = true;
      await renderBilling(route);

      expect(screen.getByText("APP HOME")).toBeInTheDocument();
      expect(h.getSession).not.toHaveBeenCalled();
      expect(h.invoke).not.toHaveBeenCalled();
      expect(openSpy).not.toHaveBeenCalled();
    },
  );

  it.each([
    ["in the app", true, "APP HOME"],
    ["on the website", false, "SIGN IN"],
  ])("signed out %s: no checkout request and nothing opened", async (_where, native, landing) => {
    h.native = native;
    h.getSession.mockResolvedValue({ data: { session: null }, error: null });
    await renderBilling("/billing");

    expect(await screen.findByText(landing)).toBeInTheDocument();
    expect(h.invoke).not.toHaveBeenCalled();
    expect(openSpy).not.toHaveBeenCalled();
  });

  it("on the website, an unpaid account still starts Stripe Checkout", async () => {
    await renderBilling("/billing");

    fireEvent.click(await screen.findByText("Upgrade to Solo plan"));
    await waitFor(() => expect(openSpy).toHaveBeenCalledWith(CHECKOUT_URL, "_blank"));
    expect(h.invoke).toHaveBeenCalledWith("create-checkout", expect.objectContaining({ body: expect.any(Object) }));
  });

  it("on the website, a subscribed account still opens the Stripe portal", async () => {
    h.sub = { ...h.sub, subscribed: true, subscriptionTier: "agent", subscriptionEnd: "2026-12-01T00:00:00Z", trialExpired: false };
    await renderBilling("/billing");

    fireEvent.click(await screen.findByText(/Manage Billing/i));
    await waitFor(() => expect(openSpy).toHaveBeenCalledWith(PORTAL_URL, "_blank"));
    expect(h.invoke).toHaveBeenCalledWith("customer-portal");
  });
});
