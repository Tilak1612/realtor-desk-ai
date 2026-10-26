import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, act, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Route, Routes } from "react-router-dom";
import { renderWithProviders } from "@/test/render";

/**
 * What the iOS / Android app is allowed to show.
 *
 * The app is a sign-in companion to a subscription bought on the website
 * (App Store guideline 3.1.3(f), Google Play payments policy): no purchase, no
 * price, no sign-up, and no link to any of them. Each block renders a real
 * component twice, as the app and as the website, because the second half of
 * the rule is that the website does not change.
 */

const h = vi.hoisted(() => ({
  native: true,
  platform: "ios" as "ios" | "android" | "web",
  sub: {
    subscribed: false,
    subscriptionUnknown: false,
    loading: false,
    refreshSubscription: vi.fn(async () => {}),
    trialExpired: true,
    trialDaysLeft: 5,
    productId: null,
    priceId: null,
    subscriptionEnd: null,
    subscriptionTier: "trial" as const,
    trialEndsAt: null,
  },
  identity: { isDemo: false, loading: false },
  session: { user: { id: "u1", email: "agent@example.com" } } as unknown,
  signOut: vi.fn(async () => ({ error: null })),
}));

vi.mock("@/lib/native/platform", async (original) => ({
  ...(await original<typeof import("@/lib/native/platform")>()),
  isNativeApp: () => h.native,
  nativePlatform: () => (h.native ? h.platform : "web"),
}));

vi.mock("@/contexts/SubscriptionContext", () => ({
  useSubscription: () => h.sub,
  SUBSCRIPTION_PRODUCTS: {
    agent: { monthly_price_id: "pm", yearly_price_id: "py", monthly_product_id: "a", yearly_product_id: "a", name: "Solo Plan", yearlyPrice: 999, monthlyPrice: 149 },
    team: { monthly_price_id: "tm", yearly_price_id: "ty", monthly_product_id: "t", yearly_product_id: "t", name: "Team Plan", yearlyPrice: 2997, monthlyPrice: 299 },
  },
}));

vi.mock("@/hooks/rd/useWorkspaceIdentity", () => ({
  useWorkspaceIdentity: () => h.identity,
}));

vi.mock("@/lib/auth/signOut", async (original) => ({
  ...(await original<typeof import("@/lib/auth/signOut")>()),
  signOutIntentionally: () => h.signOut(),
}));

vi.mock("@/integrations/supabase/client", () => {
  const chain = {
    select: () => chain,
    eq: () => chain,
    single: async () => ({ data: null, error: null }),
    maybeSingle: async () => ({ data: null, error: null }),
  };
  return {
    supabase: {
      auth: {
        getSession: async () => ({ data: { session: h.session }, error: null }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
        signInWithPassword: async () => ({ data: { user: null }, error: null }),
      },
      from: () => chain,
      functions: { invoke: async () => ({ data: null, error: null }) },
    },
  };
});

// Words that would turn a status screen into a sales screen. "subscription" /
// "abonnement" as a statement of fact is allowed; the verbs and the money are
// not.
const SELLING_EN = /\$|\bpric|\bsubscribe\b|\bupgrade|\bbuy\b|\bpurchase|\btrial\b|\bplans?\b|checkout|\bpay\b|payment/i;
const SELLING_FR = /\$|\bprix\b|\btarif|abonnez|s'abonner|mise à niveau|\bachet|\bachat|\bessai\b|\bforfait|paiement|\bpayer\b/i;

async function setLanguage(lng: "en" | "fr") {
  await act(async () => {
    await (await import("@/i18n/config")).default.changeLanguage(lng);
  });
}

beforeEach(async () => {
  h.native = true;
  h.platform = "ios";
  h.sub.subscribed = false;
  h.sub.subscriptionUnknown = false;
  h.sub.loading = false;
  h.sub.refreshSubscription.mockClear();
  h.identity.isDemo = false;
  h.identity.loading = false;
  h.session = { user: { id: "u1", email: "agent@example.com" } };
  h.signOut.mockClear();
  await setLanguage("en");
});

/* ── the billing gate ─────────────────────────────────────────────────── */

async function renderGate(route = "/app") {
  const { default: RequireBilling } = await import("@/components/RequireBilling");
  return renderWithProviders(
    <Routes>
      <Route
        path="/app"
        element={
          <RequireBilling>
            <div>THE PRODUCT</div>
          </RequireBilling>
        }
      />
      <Route path="/billing" element={<div>BILLING PAGE</div>} />
      <Route path="/login" element={<div>LOGIN PAGE</div>} />
      <Route path="/app/settings" element={<div>SETTINGS PAGE</div>} />
    </Routes>,
    { route },
  );
}

describe("an account without a subscription, in the app", () => {
  it("is told so on a neutral screen and is never sent to /billing", async () => {
    await renderGate();
    expect(screen.getByRole("heading", { name: "No active subscription on this account" })).toBeInTheDocument();
    expect(screen.queryByText("BILLING PAGE")).toBeNull();
    expect(screen.queryByText("THE PRODUCT")).toBeNull();
  });

  it("names the account that is signed in, so a wrong account is obvious", async () => {
    await renderGate();
    await waitFor(() => expect(screen.getByText("Signed in as agent@example.com")).toBeInTheDocument());
  });

  it("carries no price, plan, purchase wording or link out of the app", async () => {
    const { container } = await renderGate();
    await waitFor(() => expect(screen.getByText(/Signed in as/)).toBeInTheDocument());
    const text = (container.textContent ?? "").replace("agent@example.com", "");
    expect(text).not.toMatch(SELLING_EN);
    const hrefs = [...container.querySelectorAll("a")].map((a) => a.getAttribute("href"));
    expect(hrefs).toEqual(["/app/settings"]);
    expect(container.querySelector('[target="_blank"]')).toBeNull();
  });

  it("re-runs the subscription check on Check again", async () => {
    const user = userEvent.setup();
    await renderGate();
    await user.click(screen.getByRole("button", { name: "Check again" }));
    expect(h.sub.refreshSubscription).toHaveBeenCalledTimes(1);
  });

  it("signs out through the helper and lands on the sign-in screen", async () => {
    const user = userEvent.setup();
    await renderGate();
    await user.click(screen.getByRole("button", { name: "Sign out" }));
    await waitFor(() => expect(screen.getByText("LOGIN PAGE")).toBeInTheDocument());
    expect(h.signOut).toHaveBeenCalledTimes(1);
  });

  it("keeps Settings reachable, for exporting or deleting data", async () => {
    const user = userEvent.setup();
    await renderGate();
    await user.click(screen.getByRole("link", { name: "Account settings" }));
    expect(screen.getByText("SETTINGS PAGE")).toBeInTheDocument();
  });

  it("says all of it in French too, with the same restraint", async () => {
    const { container } = await renderGate();
    await setLanguage("fr");
    expect(screen.getByRole("heading", { name: "Aucun abonnement actif pour ce compte" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Vérifier de nouveau" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Se déconnecter" })).toBeInTheDocument();
    expect((container.textContent ?? "").replace("agent@example.com", "")).not.toMatch(SELLING_FR);
  });
});

describe("the billing gate's other answers are the same in the app", () => {
  it("lets a subscribed account in", async () => {
    h.sub.subscribed = true;
    await renderGate();
    expect(screen.getByText("THE PRODUCT")).toBeInTheDocument();
  });

  it("lets a demo account in without a subscription", async () => {
    h.identity.isDemo = true;
    await renderGate();
    expect(screen.getByText("THE PRODUCT")).toBeInTheDocument();
  });

  it("fails open when the check itself failed, exactly as on the web", async () => {
    h.sub.subscriptionUnknown = true;
    await renderGate();
    expect(screen.getByText("THE PRODUCT")).toBeInTheDocument();
    expect(screen.queryByText(/No active subscription/)).toBeNull();
  });

  it("waits while the check is in flight", async () => {
    h.sub.loading = true;
    await renderGate();
    expect(screen.queryByText("THE PRODUCT")).toBeNull();
    expect(screen.queryByText(/No active subscription/)).toBeNull();
  });
});

describe("the billing gate on the website is unchanged", () => {
  it("still redirects an unsubscribed account to /billing", async () => {
    h.native = false;
    await renderGate();
    expect(screen.getByText("BILLING PAGE")).toBeInTheDocument();
    expect(screen.queryByText(/No active subscription/)).toBeNull();
  });
});

/* ── the strings themselves ───────────────────────────────────────────── */

describe("the app's auth copy", () => {
  const flatten = (node: unknown, prefix = ""): Array<[string, string]> =>
    typeof node === "string"
      ? [[prefix, node]]
      : Object.entries(node as Record<string, unknown>).flatMap(([k, v]) =>
          flatten(v, prefix ? prefix + "." + k : k),
        );

  it("has French for every English string, with the same placeholders", async () => {
    const { nativeAuthEn, nativeAuthFr } = await import("@/i18n/nativeAuth");
    const en = flatten(nativeAuthEn);
    const fr = new Map(flatten(nativeAuthFr));
    expect(en.length).toBeGreaterThan(0);
    for (const [key, value] of en) {
      const french = fr.get(key);
      expect(french, key).toBeTruthy();
      expect(french, key + " is still English").not.toBe(value);
      expect((french ?? "").match(/{{\w+}}/g) ?? [], key).toEqual(value.match(/{{\w+}}/g) ?? []);
    }
    expect(fr.size).toBe(en.length);
  });

  it("is registered with i18next in both languages", async () => {
    await import("@/i18n/nativeAuth");
    const i18n = (await import("@/i18n/config")).default;
    expect(i18n.getResource("en", "translation", "nativeAuth.noAccess.checkAgain")).toBe("Check again");
    expect(i18n.getResource("fr", "translation", "nativeAuth.noAccess.checkAgain")).toBe("Vérifier de nouveau");
    // Merged in, not swapped in: the website's own strings are still there.
    expect(i18n.getResource("en", "translation", "auth.login.rememberMe")).toBe("Remember me");
  });

  it("sells nothing, in either language", async () => {
    const { nativeAuthEn, nativeAuthFr } = await import("@/i18n/nativeAuth");
    for (const [key, value] of flatten(nativeAuthEn)) expect(value, key).not.toMatch(SELLING_EN);
    for (const [key, value] of flatten(nativeAuthFr)) expect(value, key).not.toMatch(SELLING_FR);
  });
});

/* ── the sign-in screen ───────────────────────────────────────────────── */

async function renderLogin() {
  const { default: Login } = await import("@/pages/Login");
  return renderWithProviders(<Login />, { route: "/login" });
}

describe("the sign-in screen in the app", () => {
  it("offers no sign-up, no trial and no way back to the website", async () => {
    const { container } = await renderLogin();
    expect(screen.queryByText(/Start your free trial/i)).toBeNull();
    expect(screen.queryByText(/Don't have an account/i)).toBeNull();
    expect(screen.queryByText(/Back to realtordesk\.ai/i)).toBeNull();
    const hrefs = [...container.querySelectorAll("a")].map((a) => a.getAttribute("href"));
    expect(hrefs).not.toContain("/signup");
    expect(hrefs).not.toContain("/");
    expect(hrefs).not.toContain("/pricing");
  });

  it("says which account to use, and nothing about getting one", async () => {
    await renderLogin();
    expect(screen.getByText("Sign in with your Realtor Desk account.")).toBeInTheDocument();
  });

  it("shows no provider buttons and no divider by default", async () => {
    await renderLogin();
    expect(screen.queryByText("Continue with Google")).toBeNull();
    expect(screen.queryByText("Continue with Apple")).toBeNull();
    expect(screen.queryByText("Or continue with email")).toBeNull();
  });

  it("hides Remember me: the app always keeps the session, in the keystore", async () => {
    await renderLogin();
    expect(screen.queryByLabelText("Remember me")).toBeNull();
  });

  it("keeps email, password and forgot-password", async () => {
    await renderLogin();
    expect(screen.getByLabelText(/Email address/)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Password/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Forgot password?" })).toHaveAttribute("href", "/forgot-password");
  });

  it("opens Terms and Privacy inside the app, not in a new browser tab", async () => {
    await renderLogin();
    const terms = screen.getByRole("link", { name: "Terms of Service" });
    const privacy = screen.getByRole("link", { name: "Privacy Policy" });
    expect(terms).toHaveAttribute("href", "/terms-of-service");
    expect(privacy).toHaveAttribute("href", "/privacy-policy");
    expect(terms).not.toHaveAttribute("target");
    expect(privacy).not.toHaveAttribute("target");
  });

  it("reads the same in French", async () => {
    await renderLogin();
    await setLanguage("fr");
    expect(screen.getByText("Connectez-vous avec votre compte Realtor Desk.")).toBeInTheDocument();
    expect(screen.queryByText(/essai gratuit/i)).toBeNull();
  });
});

describe("the sign-in screen on the website is unchanged", () => {
  it("still has sign-up, the provider button, Remember me and the way back", async () => {
    h.native = false;
    await renderLogin();
    expect(screen.getByRole("link", { name: "Start your free trial" })).toHaveAttribute("href", "/signup");
    expect(screen.getByText("Continue with Google")).toBeInTheDocument();
    expect(screen.queryByText("Continue with Apple")).toBeNull();
    expect(screen.getByText("Or continue with email")).toBeInTheDocument();
    expect(screen.getByLabelText("Remember me")).toBeInTheDocument();
    expect(screen.getByText("Back to realtordesk.ai")).toBeInTheDocument();
    expect(screen.queryByText("Sign in with your Realtor Desk account.")).toBeNull();
    expect(screen.getByRole("link", { name: "Terms of Service" })).toHaveAttribute("target", "_blank");
  });
});

/* ── navigation ───────────────────────────────────────────────────────── */

describe("the /app sidebar", () => {
  const HIDDEN = ["Calendar", "Campaigns", "Market", "Integrations"];
  const KEPT = ["Dashboard", "Leads", "Conversations", "Pipeline", "Automation", "Reports", "Tasks", "Properties", "AI Assistant", "Settings"];

  it("drops the unfinished screens in the app and keeps everything else", async () => {
    const { Sidebar } = await import("@/components/rd/layout/Sidebar");
    renderWithProviders(<Sidebar open />);
    for (const label of HIDDEN) expect(screen.queryByText(label), label).toBeNull();
    for (const label of KEPT) expect(screen.getByText(label), label).toBeInTheDocument();
  });

  it("filters items passed in by a caller too", async () => {
    const { Sidebar } = await import("@/components/rd/layout/Sidebar");
    renderWithProviders(
      <Sidebar
        open
        items={[
          { label: "Home", to: "/app", icon: null },
          { label: "Billing", to: "/billing", icon: null },
          { label: "Plans", to: "/pricing", icon: null },
        ]}
      />,
    );
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.queryByText("Billing")).toBeNull();
    expect(screen.queryByText("Plans")).toBeNull();
  });

  it("shows every item on the website", async () => {
    h.native = false;
    const { Sidebar } = await import("@/components/rd/layout/Sidebar");
    renderWithProviders(<Sidebar open />);
    for (const label of [...HIDDEN, ...KEPT]) expect(screen.getByText(label), label).toBeInTheDocument();
  });
});

describe("the account menu", () => {
  async function openMenu() {
    const user = userEvent.setup();
    const { TopNav } = await import("@/components/rd/layout/TopNav");
    renderWithProviders(<TopNav agent={{ name: "Sarah K." }} />);
    await user.click(screen.getByLabelText("Account menu"));
    return within(await screen.findByRole("menu"));
  }

  it("has no billing entry in the app, and still has Settings and Sign out", async () => {
    const menu = await openMenu();
    expect(menu.queryByText("Plan & billing")).toBeNull();
    expect(menu.getByText("Settings")).toBeInTheDocument();
    expect(menu.getByText("Sign out")).toBeInTheDocument();
  });

  it("keeps the billing entry on the website", async () => {
    h.native = false;
    const menu = await openMenu();
    expect(menu.getByText("Plan & billing")).toBeInTheDocument();
  });
});

describe("the legacy sidebar", () => {
  async function renderLegacy() {
    const { default: DashboardSidebar } = await import("@/components/dashboard/DashboardSidebar");
    return renderWithProviders(<DashboardSidebar trialDaysLeft={5} />);
  }
  const hrefs = (container: HTMLElement) =>
    [...container.querySelectorAll("a")].map((a) => a.getAttribute("href"));

  it("has no billing, upgrade or unfinished-screen links in the app", async () => {
    const { container } = await renderLegacy();
    const links = hrefs(container);
    for (const gone of ["/billing", "/calendar", "/campaigns", "/market", "/dashboard/integrations"]) {
      expect(links, gone).not.toContain(gone);
    }
    for (const kept of ["/tasks", "/properties", "/ai-assistant", "/settings", "/app/inbox"]) {
      expect(links, kept).toContain(kept);
    }
    expect(container.textContent ?? "").not.toMatch(/upgrade/i);
  });

  it("is unchanged on the website", async () => {
    h.native = false;
    const { container } = await renderLegacy();
    const links = hrefs(container);
    for (const there of ["/billing", "/calendar", "/campaigns", "/market", "/dashboard/integrations"]) {
      expect(links, there).toContain(there);
    }
    // The trial badge links to /billing as well as the nav item.
    expect(links.filter((l) => l === "/billing")).toHaveLength(2);
  });
});

/* ── the two screens that sell ────────────────────────────────────────── */

describe("the trial-expired dialog", () => {
  it("renders nothing at all in the app", async () => {
    const { default: TrialExpiredModal } = await import("@/components/dashboard/TrialExpiredModal");
    renderWithProviders(<TrialExpiredModal isOpen />);
    expect(document.body.textContent ?? "").not.toMatch(/Subscribe|\$|Free Trial/);
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("still opens on the website", async () => {
    h.native = false;
    const { default: TrialExpiredModal } = await import("@/components/dashboard/TrialExpiredModal");
    renderWithProviders(<TrialExpiredModal isOpen />);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Subscribe Monthly")).toBeInTheDocument();
  });
});

describe("the billing page", () => {
  it("never mounts in the app: it leaves for /app without rendering a plan", async () => {
    const { default: Billing } = await import("@/pages/Billing");
    renderWithProviders(
      <Routes>
        <Route path="/billing" element={<Billing />} />
        <Route path="/app" element={<div>APP HOME</div>} />
      </Routes>,
      { route: "/billing?required=1" },
    );
    expect(screen.getByText("APP HOME")).toBeInTheDocument();
    expect(document.body.textContent ?? "").not.toMatch(/\$|Solo plan|Team plan|Manage Billing/);
  });
});

describe("the sign-up page", () => {
  it("never mounts in the app: it leaves for the sign-in screen", async () => {
    const { default: Signup } = await import("@/pages/Signup");
    renderWithProviders(
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<div>LOGIN PAGE</div>} />
      </Routes>,
      { route: "/signup" },
    );
    expect(screen.getByText("LOGIN PAGE")).toBeInTheDocument();
  });
});
