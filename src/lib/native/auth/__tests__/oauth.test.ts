import { describe, it, expect, vi, beforeEach } from "vitest";

const h = vi.hoisted(() => ({
  signIn: vi.fn(),
  opened: [] as string[],
  finished: [] as Array<() => void>,
  removed: 0,
}));

vi.mock("@/integrations/supabase/client", () => ({
  supabase: { auth: { signInWithOAuth: (args: unknown) => h.signIn(args) } },
}));

vi.mock("@capacitor/browser", () => ({
  Browser: {
    open: vi.fn(async ({ url }: { url: string }) => {
      h.opened.push(url);
    }),
    addListener: vi.fn(async (_event: string, cb: () => void) => {
      h.finished.push(cb);
      return {
        remove: async () => {
          h.removed += 1;
        },
      };
    }),
  },
}));

import { resolveOAuthOffer, startNativeOAuth, NATIVE_OAUTH_REDIRECT } from "@/lib/native/auth/oauth";

beforeEach(() => {
  h.signIn.mockReset();
  h.signIn.mockResolvedValue({ data: { url: "https://accounts.example/authorize?x=1" }, error: null });
  h.opened.length = 0;
  h.finished.length = 0;
  h.removed = 0;
});

describe("which provider buttons may be shown", () => {
  const offer = resolveOAuthOffer;

  it("leaves the website exactly as it is, whatever the flags say", () => {
    for (const nativeOAuth of [true, false]) {
      for (const appleSignIn of [true, false]) {
        expect(offer({ native: false, platform: "web", nativeOAuth, appleSignIn })).toEqual({
          thirdParty: true,
          apple: false,
        });
      }
    }
  });

  it("shows nothing in the app by default", () => {
    for (const platform of ["ios", "android"] as const) {
      expect(offer({ native: true, platform, nativeOAuth: false, appleSignIn: false })).toEqual({
        thirdParty: false,
        apple: false,
      });
      // The Apple flag alone does not switch provider sign-in on.
      expect(offer({ native: true, platform, nativeOAuth: false, appleSignIn: true })).toEqual({
        thirdParty: false,
        apple: false,
      });
    }
  });

  it("shows Google on Android with the flag", () => {
    expect(offer({ native: true, platform: "android", nativeOAuth: true, appleSignIn: false })).toEqual({
      thirdParty: true,
      apple: false,
    });
  });

  it("keeps iOS empty until Sign in with Apple is on too (App Store guideline 4.8)", () => {
    expect(offer({ native: true, platform: "ios", nativeOAuth: true, appleSignIn: false })).toEqual({
      thirdParty: false,
      apple: false,
    });
    expect(offer({ native: true, platform: "ios", nativeOAuth: true, appleSignIn: true })).toEqual({
      thirdParty: true,
      apple: true,
    });
  });
});

describe("starting a provider sign-in from the app", () => {
  it("returns to the app's own URL scheme", () => {
    expect(NATIVE_OAUTH_REDIRECT).toBe("com.brainfyai.realtordesk://auth/callback");
  });

  it("asks for the URL only and opens it in the system browser", async () => {
    await startNativeOAuth("google");
    expect(h.signIn).toHaveBeenCalledWith({
      provider: "google",
      options: { redirectTo: NATIVE_OAUTH_REDIRECT, skipBrowserRedirect: true },
    });
    expect(h.opened).toEqual(["https://accounts.example/authorize?x=1"]);
  });

  it("passes scopes through (Microsoft needs offline_access to refresh)", async () => {
    await startNativeOAuth("azure", { scopes: "openid profile email offline_access" });
    expect(h.signIn.mock.calls[0][0].options.scopes).toBe("openid profile email offline_access");
  });

  it("throws the provider error and opens nothing", async () => {
    h.signIn.mockResolvedValue({ data: { url: null }, error: new Error("Unsupported provider") });
    await expect(startNativeOAuth("google")).rejects.toThrow("Unsupported provider");
    expect(h.opened).toEqual([]);
  });

  it("throws when no URL comes back, rather than opening a blank browser", async () => {
    h.signIn.mockResolvedValue({ data: { url: null }, error: null });
    await expect(startNativeOAuth("google")).rejects.toThrow();
    expect(h.opened).toEqual([]);
  });

  it("tells the caller once when the browser is dismissed, then stops listening", async () => {
    const onDismissed = vi.fn();
    await startNativeOAuth("google", { onDismissed });
    expect(h.finished).toHaveLength(1);
    h.finished[0]();
    expect(onDismissed).toHaveBeenCalledTimes(1);
    expect(h.removed).toBe(1);
  });
});
