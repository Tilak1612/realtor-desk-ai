import { describe, it, expect, vi, beforeEach } from "vitest";

const h = vi.hoisted(() => ({
  native: true,
  listeners: [] as Array<(state: { isActive: boolean }) => void>,
  removed: 0,
  calls: [] as string[],
  failStart: false,
}));

vi.mock("@/lib/native/platform", async (original) => ({
  ...(await original<typeof import("@/lib/native/platform")>()),
  isNativeApp: () => h.native,
}));

vi.mock("@capacitor/app", () => ({
  App: {
    addListener: vi.fn(async (_event: string, cb: (state: { isActive: boolean }) => void) => {
      h.listeners.push(cb);
      return {
        remove: async () => {
          h.removed += 1;
        },
      };
    }),
  },
}));

vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    auth: {
      startAutoRefresh: async () => {
        if (h.failStart) throw new Error("boom");
        h.calls.push("start");
      },
      stopAutoRefresh: async () => {
        h.calls.push("stop");
      },
      getSession: async () => {
        h.calls.push("getSession");
        return { data: { session: null }, error: null };
      },
    },
  },
}));

import { registerAuthLifecycle } from "@/lib/native/auth/lifecycle";
import { App } from "@capacitor/app";

let cleanup: () => void = () => {};

beforeEach(() => {
  cleanup();
  h.native = true;
  h.listeners.length = 0;
  h.removed = 0;
  h.calls.length = 0;
  h.failStart = false;
  vi.mocked(App.addListener).mockClear();
  vi.spyOn(console, "warn").mockImplementation(() => {});
});

describe("session refresh across backgrounding", () => {
  it("does nothing in a browser", () => {
    h.native = false;
    cleanup = registerAuthLifecycle();
    expect(App.addListener).not.toHaveBeenCalled();
  });

  it("listens for appStateChange, once", () => {
    cleanup = registerAuthLifecycle();
    registerAuthLifecycle();
    expect(App.addListener).toHaveBeenCalledTimes(1);
    expect(vi.mocked(App.addListener).mock.calls[0][0]).toBe("appStateChange");
  });

  it("restarts auto-refresh and re-checks the session when the app returns", async () => {
    cleanup = registerAuthLifecycle();
    h.listeners[0]({ isActive: true });
    // getSession is what refreshes an already-expired token on the spot, so a
    // returning user is not shown signed-in screens over a dead session.
    await vi.waitFor(() => expect(h.calls).toEqual(["start", "getSession"]));
  });

  it("stops auto-refresh when the app goes to the background", async () => {
    cleanup = registerAuthLifecycle();
    h.listeners[0]({ isActive: false });
    await vi.waitFor(() => expect(h.calls).toEqual(["stop"]));
  });

  it("never throws into the native bridge", async () => {
    h.failStart = true;
    cleanup = registerAuthLifecycle();
    expect(() => h.listeners[0]({ isActive: true })).not.toThrow();
    await vi.waitFor(() => expect(console.warn).toHaveBeenCalled());
  });

  it("removes its listener on cleanup and can be registered again", async () => {
    const off = registerAuthLifecycle();
    off();
    await vi.waitFor(() => expect(h.removed).toBe(1));
    cleanup = registerAuthLifecycle();
    expect(App.addListener).toHaveBeenCalledTimes(2);
  });
});
