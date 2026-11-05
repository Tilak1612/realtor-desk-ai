/**
 * Where the Supabase session lives inside the iOS / Android app.
 *
 * On the web the session sits in localStorage (see sessionPersistence.ts). In
 * the app that would leave a long-lived refresh token in a plain file inside
 * the webview's data directory, readable from a device backup or a rooted
 * phone. Here it goes to the platform keystore instead:
 *
 *   iOS      Keychain item, scoped to this app's bundle id
 *   Android  AES-GCM ciphertext in SharedPreferences, key held by the Android
 *            KeyStore and never exportable
 *
 * through @aparajita/capacitor-secure-storage (8.x, built for Capacitor 8).
 *
 * The adapter is async. supabase-js accepts a storage whose methods return
 * promises, which is the only reason this can be a drop-in for localStorage.
 *
 * FAILURE POLICY. The keystore can refuse: a restored backup whose key no
 * longer exists, a corrupted item, an OS error. None of those may crash the
 * app or wedge it on a spinner.
 *   - a read that fails is reported as "no session": the person is signed out
 *     and signs in again, which rewrites the item;
 *   - a write that fails keeps the session in memory for this run, so signing
 *     in still works and only the next cold start asks again;
 *   - the session is NEVER written to localStorage as a fallback. Falling back
 *     to the store this module exists to avoid would make the protection
 *     optional exactly when something is already wrong with the device.
 */

type SecureStorageModule = typeof import("@aparajita/capacitor-secure-storage");

// Set on first launch. localStorage is wiped when the app is uninstalled; the
// iOS Keychain is not. Without this marker, deleting the app and installing it
// again (or handing the phone to someone else who does) would open straight
// into the previous person's account.
const INSTALL_MARKER = "rd.native.installed";

// supabase-js names its entries sb-<project-ref>-auth-token, plus
// "-code-verifier" (PKCE) and "-user" suffixes. Only these are ever removed in
// bulk, so another plugin's keystore items are left alone.
const isSupabaseAuthKey = (key: string): boolean => /^sb-.+-auth-token/.test(key);

// Sessions whose keystore write failed. Lives only as long as the process.
const memory = new Map<string, string>();

let ready: Promise<SecureStorageModule> | null = null;

// Log the failure class, never the value: these are credentials.
function report(operation: string, err: unknown): void {
  const code =
    typeof err === "object" && err !== null && "code" in err
      ? String((err as { code: unknown }).code)
      : err instanceof Error
        ? err.name
        : "unknown";
  console.warn("[auth] secure storage " + operation + " failed: " + code);
}

async function removeAuthKeys(mod: SecureStorageModule): Promise<void> {
  // sync = false throughout: the session must never reach iCloud Keychain.
  const keys = await mod.SecureStorage.keys(false);
  await Promise.all(
    keys.filter(isSupabaseAuthKey).map((key) => mod.SecureStorage.remove(key, false)),
  );
}

async function clearLeftoversFromPreviousInstall(mod: SecureStorageModule): Promise<void> {
  let seen = false;
  try {
    seen = localStorage.getItem(INSTALL_MARKER) === "1";
  } catch {
    // Cannot tell. Do not sign a real user out on a guess.
    return;
  }
  if (seen) return;
  try {
    await removeAuthKeys(mod);
  } catch (err) {
    report("first-run cleanup", err);
  }
  try {
    localStorage.setItem(INSTALL_MARKER, "1");
  } catch {
    /* marker not written: the cleanup simply runs again next launch */
  }
}

// Loaded on demand so the plugin is not in the website's entry bundle, and
// configured exactly once before any read or write can reach it.
function plugin(): Promise<SecureStorageModule> {
  if (!ready) {
    ready = (async () => {
      const mod = await import("@aparajita/capacitor-secure-storage");
      // afterFirstUnlockThisDeviceOnly, not the plugin's default whenUnlocked:
      //   - "ThisDeviceOnly" keeps the token out of iCloud and out of a backup
      //     restored onto a different phone;
      //   - "afterFirstUnlock" lets a token refresh that finishes just as the
      //     screen locks still be saved. With whenUnlocked that write fails,
      //     the rotated refresh token is lost, and the person is signed out
      //     the next time they open the app.
      await mod.SecureStorage.setDefaultKeychainAccess(
        mod.KeychainAccess.afterFirstUnlockThisDeviceOnly,
      );
      await clearLeftoversFromPreviousInstall(mod);
      return mod;
    })().catch((err) => {
      // Do not cache a failed load: the next call gets a fresh attempt.
      ready = null;
      throw err;
    });
  }
  return ready;
}

/** The storage object handed to supabase-js when isNativeApp() is true. */
export const nativeAuthStorage = {
  async getItem(key: string): Promise<string | null> {
    const held = memory.get(key);
    if (held !== undefined) return held;
    try {
      const { SecureStorage } = await plugin();
      return await SecureStorage.getItem(key);
    } catch (err) {
      // Unreadable is treated as absent: signed out, not crashed. The item is
      // deliberately left in place, because the failure may be transient and
      // deleting a valid session on a blip would be worse than asking twice.
      report("read", err);
      return null;
    }
  },

  async setItem(key: string, value: string): Promise<void> {
    try {
      const { SecureStorage } = await plugin();
      await SecureStorage.setItem(key, value);
      memory.delete(key);
    } catch (err) {
      report("write", err);
      memory.set(key, value);
    }
  },

  async removeItem(key: string): Promise<void> {
    memory.delete(key);
    try {
      const { SecureStorage } = await plugin();
      await SecureStorage.removeItem(key);
    } catch (err) {
      report("remove", err);
    }
  },
};

/**
 * Remove every trace of the session from the device. Used by sign-out, which
 * cannot rely on supabase-js alone: when the revoke request fails (no signal),
 * the library returns the error and leaves the stored session where it is.
 */
export async function clearNativeAuthSession(): Promise<void> {
  memory.clear();
  try {
    await removeAuthKeys(await plugin());
  } catch (err) {
    report("clear", err);
  }
}

/** Test seam: forget the loaded plugin and any in-memory session. */
export function __resetNativeAuthStorageForTests(): void {
  ready = null;
  memory.clear();
}
