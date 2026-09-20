import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { screen, waitFor } from "@testing-library/react";
import { renderWithProviders } from "@/test/render";

/**
 * Sign-in hardening.
 *
 * The one that matters: MFA was enrollable from Settings but never enforced.
 * Supabase hands out an AAL1 session for a password or an OAuth return and
 * only raises it to AAL2 once a factor is verified. Nothing checked, so a
 * user who had set up an authenticator was still signed in by password alone
 * while Settings told them the account was protected.
 */

const ROOT = join(__dirname, "..", "..", "..");
const src = (p: string) => readFileSync(join(ROOT, p), "utf8");

let aal: { currentLevel: string; nextLevel: string } | null = { currentLevel: "aal1", nextLevel: "aal1" };
let aalError: Error | null = null;
let session: unknown = { user: { id: "u1" } };

vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    auth: {
      getSession: async () => ({ data: { session }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      signOut: async () => ({ error: null }),
      mfa: {
        getAuthenticatorAssuranceLevel: async () =>
          aalError ? { data: null, error: aalError } : { data: aal, error: null },
        listFactors: async () => ({ data: { totp: [{ id: "f1", status: "verified" }] }, error: null }),
        challenge: async () => ({ data: { id: "c1" }, error: null }),
        verify: async () => ({ error: null }),
      },
    },
  },
}));

async function renderGuard() {
  const { default: ProtectedRoute } = await import("@/components/ProtectedRoute");
  return renderWithProviders(
    <ProtectedRoute>
      <div>SECRET DASHBOARD</div>
    </ProtectedRoute>
  );
}

beforeEach(() => {
  aal = { currentLevel: "aal1", nextLevel: "aal1" };
  aalError = null;
  session = { user: { id: "u1" } };
});

describe("second factor enforcement", () => {
  it("asks for a code when the account has a factor and the session is only aal1", async () => {
    aal = { currentLevel: "aal1", nextLevel: "aal2" };
    await renderGuard();
    await waitFor(() => expect(screen.getByLabelText(/6-digit code|code à 6 chiffres/i)).toBeTruthy());
    // The protected content must NOT be in the tree behind the prompt.
    expect(screen.queryByText("SECRET DASHBOARD")).toBeNull();
  });

  it("lets a verified aal2 session through", async () => {
    aal = { currentLevel: "aal2", nextLevel: "aal2" };
    await renderGuard();
    await waitFor(() => expect(screen.getByText("SECRET DASHBOARD")).toBeTruthy());
  });

  it("lets an account with no factor through unchanged", async () => {
    aal = { currentLevel: "aal1", nextLevel: "aal1" };
    await renderGuard();
    await waitFor(() => expect(screen.getByText("SECRET DASHBOARD")).toBeTruthy());
  });

  it("fails open if the assurance-level call itself errors", async () => {
    // Deliberate: this call needs the network, and a blip must not lock every
    // user out of the product. It fails closed for the case that matters --
    // a known aal2 requirement that is unmet.
    aalError = new Error("network");
    await renderGuard();
    await waitFor(() => expect(screen.getByText("SECRET DASHBOARD")).toBeTruthy());
  });

  it("still redirects when there is no session at all", async () => {
    session = null;
    await renderGuard();
    await waitFor(() => expect(screen.queryByText("SECRET DASHBOARD")).toBeNull());
  });
});

describe("remember me", () => {
  const KEY = "sb-test-auth-token";
  afterEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  it("keeps the session in localStorage by default, as it always did", async () => {
    const { authStorage, isRemembered } = await import("@/lib/auth/sessionPersistence");
    expect(isRemembered()).toBe(true);
    authStorage.setItem(KEY, "token");
    expect(localStorage.getItem(KEY)).toBe("token");
    expect(sessionStorage.getItem(KEY)).toBeNull();
  });

  it("puts it in sessionStorage when the box is cleared, so it dies with the tab", async () => {
    const { authStorage, setRememberMe } = await import("@/lib/auth/sessionPersistence");
    setRememberMe(false);
    authStorage.setItem(KEY, "token");
    expect(sessionStorage.getItem(KEY)).toBe("token");
    expect(localStorage.getItem(KEY)).toBeNull();
  });

  it("does not leave a copy behind when the preference changes", async () => {
    const { authStorage, setRememberMe } = await import("@/lib/auth/sessionPersistence");
    setRememberMe(true);
    authStorage.setItem(KEY, "remembered");
    setRememberMe(false);
    // Still readable across the switch -- the user is not signed out...
    expect(authStorage.getItem(KEY)).toBe("remembered");
    authStorage.setItem(KEY, "rotated");
    // ...but the durable copy is gone, which is the whole point.
    expect(localStorage.getItem(KEY)).toBeNull();
    expect(sessionStorage.getItem(KEY)).toBe("rotated");
  });
});

describe("the login page", () => {
  const login = () => src("src/pages/Login.tsx");

  it("offers both providers as full-width buttons, not a half-width chip", () => {
    const buttons = src("src/components/auth/OAuthButtons.tsx");
    expect(login()).toContain("<OAuthButtons");
    expect(login()).not.toContain("grid-cols-2");
    expect(buttons).toContain("w-full");
    expect(buttons).toContain("auth.oauth.google");
    expect(buttons).toContain("auth.oauth.microsoft");
  });

  it("asks Microsoft for offline_access, or the session cannot be refreshed", () => {
    expect(src("src/components/auth/OAuthButtons.tsx")).toContain("offline_access");
  });

  it("has a remember-me control wired to the storage preference", () => {
    expect(login()).toContain('id="remember"');
    expect(login()).toContain("setRememberMe(remember)");
  });

  it("makes no claim it cannot substantiate", () => {
    // Strip comments first: the note explaining why each claim was removed
    // quotes the claim, and matching that would be checking the tombstone
    // rather than the page.
    const strip = (t: string) =>
      t.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");
    const card = strip(src("src/components/auth/AuthCard.tsx"));
    const i18n = src("src/i18n/config.ts");
    for (const gone of ["256-bit SSL", "Protected Session", "PIPEDA Compliant"]) {
      expect(card).not.toContain(gone);
    }
    // Not just the login card: the same wording survived on /signup, which is
    // the page where someone actually enters a card. Check every auth surface
    // and both locales at once.
    for (const claim of ["256-bit SSL", "SSL 256 bits", "256 bit SSL"]) {
      expect(strip(src("src/i18n/config.ts")), claim).not.toContain(claim);
      expect(strip(src("src/pages/Signup.tsx")), claim).not.toContain(claim);
      expect(strip(src("src/components/auth/SignupAside.tsx")), claim).not.toContain(claim);
    }
    expect(login()).not.toContain("sslNotice");
    // And the keys themselves are gone, so nothing can render them again.
    expect(i18n).not.toContain('protectedSession:');
    expect(i18n).not.toContain('sslNotice:');
    // What replaced them is true: the project runs in ca-central-1.
    expect(card).toContain("auth.canadianData");
  });

  it("keeps password-manager and accessibility affordances", () => {
    expect(login()).toContain('autoComplete="username"');
    expect(login()).toContain('autoComplete="current-password"');
    expect(src("src/components/auth/MfaChallenge.tsx")).toContain('autoComplete="one-time-code"');
  });
});

describe("tenant isolation migration", () => {
  // This repo keeps ONE generated baseline; the change that was applied to
  // production lives in _archive, and the baseline is the source of truth CI
  // compares against. Assert on the baseline, so a regenerated baseline that
  // lost the clause fails here.
  it("has WITH CHECK on every UPDATE policy that lacked one", () => {
    const baseline = src("supabase/migrations/00000000000000_baseline_production_schema.sql");
    for (const table of [
      "chatbot_settings", "contact_activities", "contacts",
      "deals", "integration_connections", "property_listings",
    ]) {
      const re = new RegExp(
        `CREATE POLICY [^\\n]*ON public\\.${table} [^\\n]*FOR UPDATE[^\\n]*WITH CHECK \\(\\(auth\\.uid\\(\\) = user_id\\)\\);`
      );
      expect(re.test(baseline), `${table} UPDATE policy without WITH CHECK`).toBe(true);
    }
  });
});

describe("session expiry versus signing out", () => {
  // Both end as SIGNED_OUT, so without a marker the app cannot explain
  // itself: a session that expired mid-task dropped the person on /login
  // with no message, looking like the app had forgotten them.
  beforeEach(() => sessionStorage.clear());

  it("reports an expiry when nobody asked to sign out", async () => {
    const { noteSessionEnded, consumeSessionExpired } = await import("@/lib/auth/signOut");
    noteSessionEnded();
    expect(consumeSessionExpired()).toBe(true);
  });

  it("stays quiet after a deliberate sign-out", async () => {
    const { signOutIntentionally, noteSessionEnded, consumeSessionExpired } =
      await import("@/lib/auth/signOut");
    await signOutIntentionally();
    noteSessionEnded();
    expect(consumeSessionExpired()).toBe(false);
  });

  it("shows the message only once", async () => {
    const { noteSessionEnded, consumeSessionExpired } = await import("@/lib/auth/signOut");
    noteSessionEnded();
    expect(consumeSessionExpired()).toBe(true);
    expect(consumeSessionExpired()).toBe(false);
  });

  it("loads the supabase client lazily, or component tests cannot render", () => {
    // TopNav and friends deliberately avoid a static import of the client:
    // constructing it throws "supabaseUrl is required" wherever the env is
    // absent, which is every component test. A static import in this helper
    // reintroduced that through the back door and turned three layout suites
    // red.
    const helper = src("src/lib/auth/signOut.ts");
    expect(helper).not.toMatch(/^import .*integrations\/supabase\/client/m);
    expect(helper).toContain('await import("@/integrations/supabase/client")');
  });

  it("routes every sign-out through the helper, so none is mistaken for an expiry", () => {
    for (const f of [
      "src/components/rd/layout/TopNav.tsx",
      "src/components/dashboard/DashboardNavbar.tsx",
      "src/components/dashboard/TrialExpiredModal.tsx",
      "src/pages/Settings.tsx",
      "src/components/auth/MfaChallenge.tsx",
    ]) {
      expect(src(f), f).not.toContain("supabase.auth.signOut()");
      expect(src(f), f).toContain("signOutIntentionally");
    }
  });
});
