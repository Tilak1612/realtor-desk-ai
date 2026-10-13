import { describe, it, expect, vi, beforeEach } from "vitest";

/**
 * The session's home inside the iOS / Android app.
 *
 * The plugin is mocked: these tests are about what OUR adapter does around it,
 * above all when the keystore says no. The promises it must keep:
 *   - tokens go to the keystore and never to localStorage, even as a fallback;
 *   - an unreadable keystore means "signed out", not a crash;
 *   - an unwritable keystore still lets the person sign in for this run;
 *   - signing out leaves nothing behind.
 */

const KEY = "sb-testref-auth-token";

const h = vi.hoisted(() => {
  const store = new Map<string, string>();
  return {
    store,
    fail: { get: false, set: false, remove: false, keys: false },
    access: null as number | null,
    calls: [] as string[],
  };
});

vi.mock("@aparajita/capacitor-secure-storage", () => {
  class StorageError extends Error {
    code: string;
    constructor(message: string, code: string) {
      super(message);
      this.code = code;
    }
  }
  const boom = () => new StorageError("keystore unavailable", "osError");
  return {
    KeychainAccess: {
      whenUnlocked: 0,
      whenUnlockedThisDeviceOnly: 1,
      afterFirstUnlock: 2,
      afterFirstUnlockThisDeviceOnly: 3,
      whenPasscodeSetThisDeviceOnly: 4,
    },
    SecureStorage: {
      setDefaultKeychainAccess: async (access: number) => {
        h.calls.push("setDefaultKeychainAccess");
        h.access = access;
      },
      getItem: async (key: string) => {
        h.calls.push("getItem");
        if (h.fail.get) throw boom();
        return h.store.get(key) ?? null;
      },
      setItem: async (key: string, value: string) => {
        h.calls.push("setItem");
        if (h.fail.set) throw boom();
        h.store.set(key, value);
      },
      removeItem: async (key: string) => {
        h.calls.push("removeItem");
        if (h.fail.remove) throw boom();
        h.store.delete(key);
      },
      remove: async (key: string, sync?: boolean) => {
        h.calls.push("remove:" + String(sync));
        if (h.fail.remove) throw boom();
        return h.store.delete(key);
      },
      keys: async (sync?: boolean) => {
        h.calls.push("keys:" + String(sync));
        if (h.fail.keys) throw boom();
        return [...h.store.keys()];
      },
    },
  };
});

async function load() {
  const mod = await import("@/lib/native/auth/secureSessionStorage");
  mod.__resetNativeAuthStorageForTests();
  return mod;
}

beforeEach(() => {
  h.store.clear();
  h.fail.get = h.fail.set = h.fail.remove = h.fail.keys = false;
  h.access = null;
  h.calls.length = 0;
  localStorage.clear();
  sessionStorage.clear();
  // An existing install, unless a test says otherwise.
  localStorage.setItem("rd.native.installed", "1");
  vi.spyOn(console, "warn").mockImplementation(() => {});
});

describe("the native session store", () => {
  it("round-trips a session through the keystore", async () => {
    const { nativeAuthStorage } = await load();
    await nativeAuthStorage.setItem(KEY, '{"access_token":"a"}');
    expect(h.store.get(KEY)).toBe('{"access_token":"a"}');
    expect(await nativeAuthStorage.getItem(KEY)).toBe('{"access_token":"a"}');
    await nativeAuthStorage.removeItem(KEY);
    expect(await nativeAuthStorage.getItem(KEY)).toBeNull();
  });

  it("never copies the session into localStorage or sessionStorage", async () => {
    const { nativeAuthStorage } = await load();
    await nativeAuthStorage.setItem(KEY, "secret-token");
    const dump = JSON.stringify({ ...localStorage }) + JSON.stringify({ ...sessionStorage });
    expect(dump).not.toContain("secret-token");
    expect(localStorage.getItem(KEY)).toBeNull();
  });

  it("returns null for a key that was never written", async () => {
    const { nativeAuthStorage } = await load();
    expect(await nativeAuthStorage.getItem(KEY)).toBeNull();
  });

  it("stores for this device only, readable after first unlock, before any read or write", async () => {
    const { nativeAuthStorage } = await load();
    await nativeAuthStorage.getItem(KEY);
    // 3 = afterFirstUnlockThisDeviceOnly: not in iCloud, not in a backup
    // restored to another phone, and still writable as the screen locks.
    expect(h.access).toBe(3);
    expect(h.calls[0]).toBe("setDefaultKeychainAccess");
    // Configured once, not per call.
    await nativeAuthStorage.setItem(KEY, "v");
    expect(h.calls.filter((c) => c === "setDefaultKeychainAccess")).toHaveLength(1);
  });
});

describe("when the keystore refuses", () => {
  it("treats an unreadable keystore as signed out instead of throwing", async () => {
    const { nativeAuthStorage } = await load();
    h.store.set(KEY, "token");
    h.fail.get = true;
    await expect(nativeAuthStorage.getItem(KEY)).resolves.toBeNull();
  });

  it("does not delete the item on a failed read, which may be transient", async () => {
    const { nativeAuthStorage } = await load();
    h.store.set(KEY, "token");
    h.fail.get = true;
    await nativeAuthStorage.getItem(KEY);
    expect(h.store.get(KEY)).toBe("token");
    h.fail.get = false;
    expect(await nativeAuthStorage.getItem(KEY)).toBe("token");
  });

  it("keeps a session in memory for this run when the write fails, and still not in localStorage", async () => {
    const { nativeAuthStorage } = await load();
    h.fail.set = true;
    await expect(nativeAuthStorage.setItem(KEY, "token")).resolves.toBeUndefined();
    expect(await nativeAuthStorage.getItem(KEY)).toBe("token");
    expect(localStorage.getItem(KEY)).toBeNull();
    // Once the keystore works again the next write goes there and the
    // in-memory copy is dropped.
    h.fail.set = false;
    await nativeAuthStorage.setItem(KEY, "rotated");
    expect(h.store.get(KEY)).toBe("rotated");
    expect(await nativeAuthStorage.getItem(KEY)).toBe("rotated");
  });

  it("does not throw when removal fails, and forgets the in-memory copy anyway", async () => {
    const { nativeAuthStorage } = await load();
    h.fail.set = true;
    await nativeAuthStorage.setItem(KEY, "token");
    h.fail.remove = true;
    await expect(nativeAuthStorage.removeItem(KEY)).resolves.toBeUndefined();
    expect(await nativeAuthStorage.getItem(KEY)).toBeNull();
  });

  it("never writes a token to the console", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const { nativeAuthStorage } = await load();
    h.fail.set = true;
    await nativeAuthStorage.setItem(KEY, "super-secret-refresh-token");
    expect(warn).toHaveBeenCalled();
    expect(JSON.stringify(warn.mock.calls)).not.toContain("super-secret-refresh-token");
  });
});

describe("clearing on sign-out", () => {
  it("removes every Supabase auth entry and nothing else", async () => {
    const { clearNativeAuthSession } = await load();
    h.store.set(KEY, "session");
    h.store.set(KEY + "-code-verifier", "verifier");
    h.store.set(KEY + "-user", "user");
    h.store.set("some-other-plugin-key", "keep me");
    await clearNativeAuthSession();
    expect([...h.store.keys()]).toEqual(["some-other-plugin-key"]);
  });

  it("never touches iCloud Keychain (sync is always false)", async () => {
    const { clearNativeAuthSession } = await load();
    h.store.set(KEY, "session");
    await clearNativeAuthSession();
    expect(h.calls).toContain("keys:false");
    expect(h.calls).toContain("remove:false");
    expect(h.calls.some((c) => c.endsWith(":true"))).toBe(false);
  });

  it("drops a session that only existed in memory", async () => {
    const { nativeAuthStorage, clearNativeAuthSession } = await load();
    h.fail.set = true;
    await nativeAuthStorage.setItem(KEY, "token");
    await clearNativeAuthSession();
    expect(await nativeAuthStorage.getItem(KEY)).toBeNull();
  });

  it("does not throw when the keystore cannot be listed", async () => {
    const { clearNativeAuthSession } = await load();
    h.fail.keys = true;
    await expect(clearNativeAuthSession()).resolves.toBeUndefined();
  });
});

describe("a fresh install", () => {
  // The iOS Keychain outlives the app. Without this, deleting and reinstalling
  // (or the next owner of the phone doing so) opens the previous account.
  it("discards a session left in the keychain by a previous install", async () => {
    localStorage.removeItem("rd.native.installed");
    h.store.set(KEY, "left over from the last install");
    const { nativeAuthStorage } = await load();
    expect(await nativeAuthStorage.getItem(KEY)).toBeNull();
    expect(localStorage.getItem("rd.native.installed")).toBe("1");
  });

  it("leaves the session alone on every later launch", async () => {
    h.store.set(KEY, "current session");
    const { nativeAuthStorage } = await load();
    expect(await nativeAuthStorage.getItem(KEY)).toBe("current session");
  });
});
