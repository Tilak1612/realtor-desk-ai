import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { screen, act, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Route, Routes } from "react-router-dom";
import { renderWithProviders } from "@/test/render";

/**
 * Password reset and provider sign-in, as the app and as the website.
 *
 * The reset is the subtle one. The website's Supabase client uses PKCE, where
 * the emailed link only works in the storage that asked for it. A reset asked
 * for inside the app and opened in the phone's browser would land on a page
 * with no session. So the app asks for a link that carries its own one-time
 * credentials, and the reset page (which runs on the website, in that browser)
 * picks them up.
 */

type AuthListener = (event: string, session: unknown) => void;

const h = vi.hoisted(() => ({
  native: true,
  platform: "android" as "ios" | "android" | "web",
  listeners: [] as AuthListener[],
  resetPasswordForEmail: vi.fn(),
  setSession: vi.fn(),
  exchangeCodeForSession: vi.fn(),
  signInWithOAuth: vi.fn(),
  createClient: vi.fn(),
  recoveryReset: vi.fn(),
  browserOpen: vi.fn(async (_options: { url: string }) => {}),
}));

vi.mock("@/lib/native/platform", async (original) => ({
  ...(await original<typeof import("@/lib/native/platform")>()),
  isNativeApp: () => h.native,
  nativePlatform: () => (h.native ? h.platform : "web"),
  authLinkOrigin: () => (h.native ? "https://www.realtordesk.ai" : window.location.origin),
}));

vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    auth: {
      resetPasswordForEmail: (...args: unknown[]) => h.resetPasswordForEmail(...args),
      setSession: (...args: unknown[]) => h.setSession(...args),
      exchangeCodeForSession: (...args: unknown[]) => h.exchangeCodeForSession(...args),
      signInWithOAuth: (...args: unknown[]) => h.signInWithOAuth(...args),
      updateUser: async () => ({ error: null }),
      getSession: async () => ({ data: { session: null }, error: null }),
      onAuthStateChange: (cb: AuthListener) => {
        h.listeners.push(cb);
        return { data: { subscription: { unsubscribe: () => {} } } };
      },
    },
  },
}));

vi.mock("@supabase/supabase-js", () => ({
  createClient: (...args: unknown[]) => {
    h.createClient(...args);
    return { auth: { resetPasswordForEmail: (...a: unknown[]) => h.recoveryReset(...a) } };
  },
}));

vi.mock("@capacitor/browser", () => ({
  Browser: {
    open: (options: { url: string }) => h.browserOpen(options),
    addListener: async () => ({ remove: async () => {} }),
    close: async () => {},
  },
}));

beforeEach(async () => {
  h.native = true;
  h.platform = "android";
  h.listeners.length = 0;
  for (const fn of [
    h.resetPasswordForEmail, h.setSession, h.exchangeCodeForSession, h.signInWithOAuth,
    h.createClient, h.recoveryReset, h.browserOpen,
  ]) fn.mockReset();
  h.resetPasswordForEmail.mockResolvedValue({ data: {}, error: null });
  h.recoveryReset.mockResolvedValue({ data: {}, error: null });
  h.setSession.mockResolvedValue({ data: {}, error: null });
  h.exchangeCodeForSession.mockResolvedValue({ data: {}, error: null });
  h.signInWithOAuth.mockResolvedValue({ data: { url: "https://accounts.example/o/oauth2" }, error: null });
  window.history.replaceState({}, "", "/");
  await act(async () => {
    await (await import("@/i18n/config")).default.changeLanguage("en");
  });
});

afterEach(() => {
  vi.unstubAllEnvs();
});

/* ── asking for the reset email ───────────────────────────────────────── */

async function submitForgot() {
  const user = userEvent.setup();
  const { default: ForgotPassword } = await import("@/pages/ForgotPassword");
  renderWithProviders(<ForgotPassword />, { route: "/forgot-password" });
  await user.type(screen.getByLabelText(/Email/), "agent@example.com");
  await user.click(screen.getByRole("button", { name: "Send reset link" }));
  await waitFor(() => expect(screen.getByText("Check your email")).toBeInTheDocument());
}

describe("forgot password in the app", () => {
  it("asks for a link to the public website, without a PKCE challenge", async () => {
    await submitForgot();
    // Not through the main (PKCE) client: its link would only work in the app.
    expect(h.resetPasswordForEmail).not.toHaveBeenCalled();
    expect(h.recoveryReset).toHaveBeenCalledWith("agent@example.com", {
      redirectTo: "https://www.realtordesk.ai/reset-password",
    });
    const options = h.createClient.mock.calls[0][2] as { auth: Record<string, unknown> };
    expect(options.auth.flowType).toBe("implicit");
    // A throwaway client: it must not hold, refresh or pick up a session.
    expect(options.auth.persistSession).toBe(false);
    expect(options.auth.autoRefreshToken).toBe(false);
    expect(options.auth.detectSessionInUrl).toBe(false);
  });

  it("says plainly that the link opens the website and to come back afterwards", async () => {
    await submitForgot();
    expect(
      screen.getByText(/The link opens realtordesk\.ai in your browser\. Set your new password there, then come back to this app/),
    ).toBeInTheDocument();
  });

  it("says it in French", async () => {
    await submitForgot();
    await act(async () => {
      await (await import("@/i18n/config")).default.changeLanguage("fr");
    });
    expect(screen.getByText(/Le lien s'ouvre sur realtordesk\.ai dans votre navigateur/)).toBeInTheDocument();
  });
});

describe("forgot password on the website is unchanged", () => {
  it("uses the main client and links back to the page's own origin", async () => {
    h.native = false;
    await submitForgot();
    expect(h.resetPasswordForEmail).toHaveBeenCalledWith("agent@example.com", {
      redirectTo: window.location.origin + "/reset-password",
    });
    expect(h.createClient).not.toHaveBeenCalled();
    expect(screen.queryByText(/come back to this app/)).toBeNull();
  });
});

/* ── opening the emailed link ─────────────────────────────────────────── */

async function renderReset(url: string) {
  window.history.replaceState({}, "", url);
  const { default: ResetPassword } = await import("@/pages/ResetPassword");
  return renderWithProviders(
    <Routes>
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/today" element={<div>SIGNED IN HOME</div>} />
    </Routes>,
    { route: "/reset-password" },
  );
}

const FRAGMENT = "#access_token=aaaaaaaa.bbbbbbbb.cccccccc&expires_in=3600&refresh_token=rrrrrrrrrrrr&token_type=bearer&type=recovery";

describe("the reset page, opened from a link the app asked for (in a browser)", () => {
  beforeEach(() => {
    // The page that receives the link is the website, not the app.
    h.native = false;
  });

  it("establishes the session from the link's own credentials", async () => {
    await renderReset("/reset-password" + FRAGMENT);
    await waitFor(() =>
      expect(h.setSession).toHaveBeenCalledWith({
        access_token: "aaaaaaaa.bbbbbbbb.cccccccc",
        refresh_token: "rrrrrrrrrrrr",
      }),
    );
  });

  it("takes the credentials out of the address bar straight away", async () => {
    await renderReset("/reset-password" + FRAGMENT);
    expect(window.location.hash).toBe("");
    expect(window.location.href).not.toContain("access_token");
  });

  it("stays on the form when that sign-in fires, instead of announcing success", async () => {
    await renderReset("/reset-password" + FRAGMENT);
    await waitFor(() => expect(h.setSession).toHaveBeenCalled());
    act(() => h.listeners.forEach((cb) => cb("SIGNED_IN", { user: { id: "u1" } })));
    expect(screen.queryByText("SIGNED IN HOME")).toBeNull();
    expect(screen.getByText("Set new password")).toBeInTheDocument();
  });

  it("does not try to exchange a ?code= itself on the website", async () => {
    await renderReset("/reset-password?code=3f6c1a52-9b1e-4c0a-8a53-0f2d6e1b7c44");
    expect(h.exchangeCodeForSession).not.toHaveBeenCalled();
    expect(h.setSession).not.toHaveBeenCalled();
  });
});

describe("the reset page for a reset started on the website is unchanged", () => {
  it("touches nothing when the URL carries no recovery fragment", async () => {
    h.native = false;
    await renderReset("/reset-password");
    expect(h.setSession).not.toHaveBeenCalled();
    expect(h.exchangeCodeForSession).not.toHaveBeenCalled();
    // And the existing listener behaves as it always did.
    act(() => h.listeners.forEach((cb) => cb("SIGNED_IN", { user: { id: "u1" } })));
    await waitFor(() => expect(screen.getByText("SIGNED IN HOME")).toBeInTheDocument());
  });

  it("ignores a fragment that is not a recovery", async () => {
    h.native = false;
    await renderReset("/reset-password#access_token=aaaaaaaa&refresh_token=bbbbbbbb&type=signup");
    expect(h.setSession).not.toHaveBeenCalled();
  });
});

describe("the reset page inside the app", () => {
  it("exchanges a ?code= delivered by a universal link, since the client does not read its own URL there", async () => {
    await renderReset("/reset-password?code=3f6c1a52-9b1e-4c0a-8a53-0f2d6e1b7c44");
    await waitFor(() =>
      expect(h.exchangeCodeForSession).toHaveBeenCalledWith("3f6c1a52-9b1e-4c0a-8a53-0f2d6e1b7c44"),
    );
    expect(window.location.search).toBe("");
  });
});

/* ── provider sign-in ─────────────────────────────────────────────────── */

async function renderButtons() {
  const { OAuthButtons } = await import("@/components/auth/OAuthButtons");
  return renderWithProviders(<OAuthButtons redirectPath="/today" />);
}

describe("provider buttons on the website are unchanged", () => {
  it("redirects the page itself, back to the page's own origin", async () => {
    h.native = false;
    const user = userEvent.setup();
    await renderButtons();
    await user.click(screen.getByRole("button", { name: "Continue with Google" }));
    expect(h.signInWithOAuth).toHaveBeenCalledWith({
      provider: "google",
      options: { redirectTo: window.location.origin + "/today" },
    });
    expect(h.browserOpen).not.toHaveBeenCalled();
    expect(screen.queryByText("Continue with Apple")).toBeNull();
  });

  it("is not affected by the app's build flags", async () => {
    h.native = false;
    vi.stubEnv("VITE_NATIVE_OAUTH", "true");
    vi.stubEnv("VITE_NATIVE_APPLE_SIGNIN", "true");
    await renderButtons();
    expect(screen.getByRole("button", { name: "Continue with Google" })).toBeInTheDocument();
    expect(screen.queryByText("Continue with Apple")).toBeNull();
  });
});

describe("provider buttons in the app", () => {
  it("render nothing by default", async () => {
    const { container } = await renderButtons();
    expect(container.querySelector("button")).toBeNull();
  });

  it("with the flag, on Android: open the system browser and never redirect the webview", async () => {
    vi.stubEnv("VITE_NATIVE_OAUTH", "true");
    const user = userEvent.setup();
    await renderButtons();
    await user.click(screen.getByRole("button", { name: "Continue with Google" }));
    await waitFor(() => expect(h.browserOpen).toHaveBeenCalledWith({ url: "https://accounts.example/o/oauth2" }));
    expect(h.signInWithOAuth).toHaveBeenCalledWith({
      provider: "google",
      options: { redirectTo: "com.brainfyai.realtordesk://auth/callback", skipBrowserRedirect: true },
    });
    expect(screen.queryByText("Continue with Apple")).toBeNull();
  });

  it("with only that flag, on iOS: still nothing (Apple requires Sign in with Apple alongside)", async () => {
    h.platform = "ios";
    vi.stubEnv("VITE_NATIVE_OAUTH", "true");
    const { container } = await renderButtons();
    expect(container.querySelector("button")).toBeNull();
  });

  it("with both flags, on iOS: Apple first, then Google", async () => {
    h.platform = "ios";
    vi.stubEnv("VITE_NATIVE_OAUTH", "true");
    vi.stubEnv("VITE_NATIVE_APPLE_SIGNIN", "true");
    const user = userEvent.setup();
    await renderButtons();
    const names = screen.getAllByRole("button").map((b) => b.textContent);
    expect(names).toEqual(["Continue with Apple", "Continue with Google"]);
    await user.click(screen.getByRole("button", { name: "Continue with Apple" }));
    await waitFor(() => expect(h.browserOpen).toHaveBeenCalled());
    expect(h.signInWithOAuth.mock.calls[0][0].provider).toBe("apple");
  });
});
