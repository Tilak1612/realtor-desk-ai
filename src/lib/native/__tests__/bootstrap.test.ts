import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// bootstrap.ts is module-level state plus four native plugins, none of which
// exist in jsdom. Everything native is mocked; what is under test is the
// decisions: nothing happens on the web, the splash always comes down, the
// Android back button closes overlays before navigating, and this module never
// registers the deep-link listener that belongs to the auth code.

const mocks = vi.hoisted(() => ({
  platform: "web" as "web" | "ios" | "android",
  listeners: new Map<string, (event: { canGoBack: boolean }) => void>(),
  keyboardListeners: [] as string[],
  minimizeApp: vi.fn(() => Promise.resolve()),
  splashHide: vi.fn(() => Promise.resolve()),
  setStyle: vi.fn(() => Promise.resolve()),
  setAccessoryBarVisible: vi.fn(() => Promise.resolve()),
  registerNativeStrings: vi.fn(),
}));

vi.mock("../platform", () => ({
  isNativeApp: () => mocks.platform !== "web",
  nativePlatform: () => mocks.platform,
}));
vi.mock("@/i18n/native", () => ({ registerNativeStrings: mocks.registerNativeStrings }));
vi.mock("@capacitor/core", () => ({
  SystemBars: { setStyle: mocks.setStyle },
  SystemBarsStyle: { Dark: "DARK", Light: "LIGHT", Default: "DEFAULT" },
}));
vi.mock("@capacitor/app", () => ({
  App: {
    addListener: vi.fn((name: string, fn: (event: { canGoBack: boolean }) => void) => {
      mocks.listeners.set(name, fn);
      return Promise.resolve({ remove: vi.fn() });
    }),
    minimizeApp: mocks.minimizeApp,
  },
}));
vi.mock("@capacitor/keyboard", () => ({
  Keyboard: {
    addListener: vi.fn((name: string) => {
      mocks.keyboardListeners.push(name);
      return Promise.resolve({ remove: vi.fn() });
    }),
    setAccessoryBarVisible: mocks.setAccessoryBarVisible,
  },
}));
vi.mock("@capacitor/splash-screen", () => ({ SplashScreen: { hide: mocks.splashHide } }));

const load = async () => {
  vi.resetModules();
  return import("../bootstrap");
};

beforeEach(() => {
  vi.useFakeTimers();
  mocks.platform = "web";
  mocks.listeners.clear();
  mocks.keyboardListeners.length = 0;
  vi.clearAllMocks();
  document.documentElement.className = "";
  document.body.innerHTML = "";
  window.history.replaceState(null, "", "/app");
});

afterEach(() => {
  vi.useRealTimers();
});

describe("on the web", () => {
  it("does nothing at all", async () => {
    const { bootstrapNative, hideSplash } = await load();
    bootstrapNative();
    hideSplash();
    vi.runAllTimers();

    expect(document.documentElement.className).toBe("");
    expect(mocks.setStyle).not.toHaveBeenCalled();
    expect(mocks.splashHide).not.toHaveBeenCalled();
    expect(mocks.registerNativeStrings).not.toHaveBeenCalled();
    expect(mocks.listeners.size).toBe(0);
    expect(mocks.keyboardListeners).toEqual([]);
  });
});

describe("in the app", () => {
  it("marks <html> so the CSS can target the app and the platform", async () => {
    mocks.platform = "ios";
    (await load()).bootstrapNative();
    expect(document.documentElement.classList.contains("native")).toBe(true);
    expect(document.documentElement.classList.contains("native-ios")).toBe(true);
    expect(document.documentElement.classList.contains("native-android")).toBe(false);
  });

  it("asks for dark status bar content, for the app's light background", async () => {
    mocks.platform = "android";
    (await load()).bootstrapNative();
    expect(mocks.setStyle).toHaveBeenCalledWith({ style: "LIGHT" });
  });

  it("keeps the iOS accessory bar, which carries the Done button", async () => {
    mocks.platform = "ios";
    (await load()).bootstrapNative();
    expect(mocks.setAccessoryBarVisible).toHaveBeenCalledWith({ isVisible: true });
  });

  it("registers the back button on Android only", async () => {
    mocks.platform = "ios";
    (await load()).bootstrapNative();
    expect(mocks.listeners.has("backButton")).toBe(false);

    mocks.platform = "android";
    (await load()).bootstrapNative();
    expect(mocks.listeners.has("backButton")).toBe(true);
  });

  it("never registers a deep-link listener: that belongs to the auth code", async () => {
    mocks.platform = "android";
    (await load()).bootstrapNative();
    expect([...mocks.listeners.keys()]).toEqual(["backButton"]);
    expect(mocks.listeners.has("appUrlOpen")).toBe(false);
  });

  it("is safe to call twice", async () => {
    mocks.platform = "android";
    const { bootstrapNative } = await load();
    bootstrapNative();
    bootstrapNative();
    expect(mocks.setStyle).toHaveBeenCalledTimes(1);
  });
});

describe("splash screen", () => {
  it("comes down when the app says it has rendered, once", async () => {
    mocks.platform = "ios";
    const { bootstrapNative, hideSplash } = await load();
    bootstrapNative();
    expect(mocks.splashHide).not.toHaveBeenCalled();

    hideSplash();
    hideSplash();
    vi.runAllTimers();
    expect(mocks.splashHide).toHaveBeenCalledTimes(1);
  });

  it("comes down on its own if the app never renders", async () => {
    mocks.platform = "ios";
    (await load()).bootstrapNative();
    vi.advanceTimersByTime(5999);
    expect(mocks.splashHide).not.toHaveBeenCalled();
    vi.advanceTimersByTime(1);
    expect(mocks.splashHide).toHaveBeenCalledTimes(1);
  });
});

describe("Android back button", () => {
  const press = async (canGoBack: boolean) => {
    mocks.listeners.get("backButton")?.({ canGoBack });
    await vi.advanceTimersByTimeAsync(100);
  };

  const boot = async () => {
    mocks.platform = "android";
    (await load()).bootstrapNative();
  };

  it("goes back one screen when there is one", async () => {
    await boot();
    window.history.replaceState(null, "", "/app/leads/123");
    const back = vi.spyOn(window.history, "back").mockImplementation(() => {});
    await press(true);
    expect(back).toHaveBeenCalledTimes(1);
    expect(mocks.minimizeApp).not.toHaveBeenCalled();
    back.mockRestore();
  });

  it("minimises instead of exiting when there is nowhere to go back to", async () => {
    await boot();
    window.history.replaceState(null, "", "/app/leads/123");
    await press(false);
    expect(mocks.minimizeApp).toHaveBeenCalledTimes(1);
  });

  it.each(["/app", "/login"])("minimises from %s even if history has older entries", async (path) => {
    await boot();
    window.history.replaceState(null, "", path);
    const back = vi.spyOn(window.history, "back").mockImplementation(() => {});
    await press(true);
    expect(back).not.toHaveBeenCalled();
    expect(mocks.minimizeApp).toHaveBeenCalledTimes(1);
    back.mockRestore();
  });

  it("closes an open dialog first and stays on the screen", async () => {
    await boot();
    window.history.replaceState(null, "", "/app/leads");
    const dialog = document.createElement("div");
    dialog.setAttribute("role", "dialog");
    dialog.setAttribute("data-state", "open");
    document.body.appendChild(dialog);
    // Stand-in for Radix: Escape closes it.
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && dialog.remove();
    document.addEventListener("keydown", onKey);
    const back = vi.spyOn(window.history, "back").mockImplementation(() => {});

    await press(true);

    expect(document.querySelector('[role="dialog"]')).toBeNull();
    expect(back).not.toHaveBeenCalled();
    expect(mocks.minimizeApp).not.toHaveBeenCalled();
    document.removeEventListener("keydown", onKey);
    back.mockRestore();
  });

  it("ignores a navigation drawer that is closed (inert)", async () => {
    await boot();
    window.history.replaceState(null, "", "/app/leads");
    const drawer = document.createElement("aside");
    drawer.setAttribute("role", "dialog");
    drawer.setAttribute("inert", "");
    document.body.appendChild(drawer);
    const back = vi.spyOn(window.history, "back").mockImplementation(() => {});
    await press(true);
    expect(back).toHaveBeenCalledTimes(1);
    back.mockRestore();
  });

  it("still navigates when a modal refuses Escape, so back is never dead", async () => {
    await boot();
    window.history.replaceState(null, "", "/app/leads");
    const modal = document.createElement("div");
    modal.setAttribute("role", "alertdialog");
    modal.setAttribute("data-state", "open");
    document.body.appendChild(modal);
    const back = vi.spyOn(window.history, "back").mockImplementation(() => {});
    await press(true);
    expect(back).toHaveBeenCalledTimes(1);
    back.mockRestore();
  });
});
