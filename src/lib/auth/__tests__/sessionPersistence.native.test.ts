import { describe, it, expect, vi, beforeEach } from "vitest";

/**
 * sessionPersistence.ts and signOut.ts inside the iOS / Android app.
 *
 * The web behaviour of both is pinned in src/test/auth/authHardening.test.tsx
 * and must keep passing untouched. This file flips isNativeApp() and checks
 * the other branch: the keystore, no "remember me", and a sign-out that leaves
 * nothing behind even when the network call fails.
 */

const KEY = "sb-testref-auth-token";

const h = vi.hoisted(() => ({
  native: true,
  secure: new Map<string, string>(),
  signOut: vi.fn(async () => ({ error: null as Error | null })),
  hardNavigate: vi.fn((_path: string) => {}),
}));

vi.mock("@/lib/native/auth/hardNavigate", () => ({
  hardNavigate: (path: string) => h.hardNavigate(path),
}));

vi.mock("@/lib/native/platform", async (original) => ({
  ...(await original<typeof import("@/lib/native/platform")>()),
  isNativeApp: () => h.native,
}));

vi.mock("@aparajita/capacitor-secure-storage", () => ({
  KeychainAccess: { afterFirstUnlockThisDeviceOnly: 3 },
  SecureStorage: {
    setDefaultKeychainAccess: async () => {},
    getItem: async (key: string) => h.secure.get(key) ?? null,
    setItem: async (key: string, value: string) => void h.secure.set(key, value),
    removeItem: async (key: string) => void h.secure.delete(key),
    remove: async (key: string) => h.secure.delete(key),
    keys: async () => [...h.secure.keys()],
  },
}));

vi.mock("@/integrations/supabase/client", () => ({
  supabase: { auth: { signOut: () => h.signOut() } },
}));

import { authStorage, isRemembered, setRememberMe } from "@/lib/auth/sessionPersistence";
import { signOutIntentionally, signedOutLanding } from "@/lib/auth/signOut";
import { __resetNativeAuthStorageForTests } from "@/lib/native/auth/secureSessionStorage";

beforeEach(() => {
  h.native = true;
  h.secure.clear();
  h.signOut.mockReset();
  h.signOut.mockResolvedValue({ error: null });
  h.hardNavigate.mockClear();
  localStorage.clear();
  sessionStorage.clear();
  localStorage.setItem("rd.native.installed", "1");
  __resetNativeAuthStorageForTests();
});

describe("session storage in the app", () => {
  it("writes to the keystore and to neither web store", async () => {
    await authStorage.setItem(KEY, "token");
    expect(h.secure.get(KEY)).toBe("token");
    expect(localStorage.getItem(KEY)).toBeNull();
    expect(sessionStorage.getItem(KEY)).toBeNull();
  });

  it("reads asynchronously from the keystore", async () => {
    h.secure.set(KEY, "token");
    const pending = authStorage.getItem(KEY);
    expect(pending).toBeInstanceOf(Promise);
    expect(await pending).toBe("token");
  });

  it("does not read a session that is sitting in localStorage", async () => {
    localStorage.setItem(KEY, "web-token");
    expect(await authStorage.getItem(KEY)).toBeNull();
  });

  it("removes from the keystore", async () => {
    h.secure.set(KEY, "token");
    await authStorage.removeItem(KEY);
    expect(h.secure.has(KEY)).toBe(false);
  });
});

describe("remember me in the app", () => {
  it("is always on", () => {
    expect(isRemembered()).toBe(true);
  });

  it("cannot be switched to a session-only mode", async () => {
    setRememberMe(false);
    expect(isRemembered()).toBe(true);
    // Nothing was recorded, so a later web build of the same origin is not
    // left with a preference nobody chose.
    expect(localStorage.getItem("rd.auth.persist")).toBeNull();
    await authStorage.setItem(KEY, "token");
    expect(h.secure.get(KEY)).toBe("token");
    expect(sessionStorage.getItem(KEY)).toBeNull();
  });
});

describe("the same module in a browser", () => {
  it("is synchronous and uses localStorage, as before", () => {
    h.native = false;
    authStorage.setItem(KEY, "token");
    expect(authStorage.getItem(KEY)).toBe("token");
    expect(localStorage.getItem(KEY)).toBe("token");
    expect(h.secure.size).toBe(0);
  });
});

describe("signing out in the app", () => {
  it("clears the keystore entry", async () => {
    h.secure.set(KEY, "session");
    h.secure.set(KEY + "-code-verifier", "verifier");
    const { error } = await signOutIntentionally();
    expect(error).toBeNull();
    expect(h.signOut).toHaveBeenCalledTimes(1);
    expect(h.secure.size).toBe(0);
    // The library announced SIGNED_OUT itself; the caller navigates as usual.
    expect(h.hardNavigate).not.toHaveBeenCalled();
  });

  it("still clears it when the revoke request fails, and reports success", async () => {
    // supabase-js leaves the stored session in place on a network failure.
    h.signOut.mockResolvedValue({ error: new Error("Failed to fetch") });
    h.secure.set(KEY, "session");
    const { error } = await signOutIntentionally();
    expect(h.secure.size).toBe(0);
    expect(error).toBeNull();
  });

  it("restarts at the sign-in screen when the library could not announce the sign-out", async () => {
    // No SIGNED_OUT event means the subscription state and cached queries of
    // the previous account are still in memory. The next person to sign in on
    // this phone must not inherit them.
    h.signOut.mockResolvedValue({ error: new Error("Failed to fetch") });
    await signOutIntentionally();
    expect(h.hardNavigate).toHaveBeenCalledWith("/login");
    // And the "I meant to" marker is not left behind to swallow the next real
    // expiry message.
    expect(sessionStorage.getItem("rd.auth.signed-out")).toBeNull();
  });

  it("still clears it when the revoke request throws", async () => {
    h.signOut.mockRejectedValue(new Error("offline"));
    h.secure.set(KEY, "session");
    await expect(signOutIntentionally()).resolves.toEqual({ error: null });
    expect(h.secure.size).toBe(0);
    expect(h.hardNavigate).toHaveBeenCalledWith("/login");
  });

  it("always lands on the sign-in screen", () => {
    expect(signedOutLanding("/")).toBe("/login");
    expect(signedOutLanding()).toBe("/login");
  });
});

describe("signing out in a browser", () => {
  it("returns the library's error unchanged and touches no keystore", async () => {
    h.native = false;
    const failure = new Error("Failed to fetch");
    h.signOut.mockResolvedValue({ error: failure });
    h.secure.set(KEY, "should not be touched");
    const { error } = await signOutIntentionally();
    expect(error).toBe(failure);
    expect(h.secure.get(KEY)).toBe("should not be touched");
    expect(h.hardNavigate).not.toHaveBeenCalled();
  });

  it("keeps the website's own landing page", () => {
    h.native = false;
    expect(signedOutLanding("/")).toBe("/");
    expect(signedOutLanding()).toBe("/login");
  });
});
