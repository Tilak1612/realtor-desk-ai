import { describe, it, expect, vi, beforeEach } from "vitest";

/**
 * Links that open the app from outside it.
 *
 * Any app or web page on the phone can ask the OS to open one of these, so the
 * URL is hostile input. The parser is an allow-list and these tests are mostly
 * a list of things that must be ignored.
 */

const h = vi.hoisted(() => ({
  native: true,
  listeners: [] as Array<(event: { url: string }) => void>,
  closed: 0,
  exchange: vi.fn(async (_code: string) => ({ data: {}, error: null as Error | null })),
}));

vi.mock("@/lib/native/platform", async (original) => ({
  ...(await original<typeof import("@/lib/native/platform")>()),
  isNativeApp: () => h.native,
}));

vi.mock("@capacitor/app", () => ({
  App: {
    addListener: vi.fn(async (_event: string, cb: (event: { url: string }) => void) => {
      h.listeners.push(cb);
      return { remove: async () => {} };
    }),
  },
}));

vi.mock("@capacitor/browser", () => ({
  Browser: {
    close: vi.fn(async () => {
      h.closed += 1;
    }),
  },
}));

vi.mock("@/integrations/supabase/client", () => ({
  supabase: { auth: { exchangeCodeForSession: (code: string) => h.exchange(code) } },
}));

import {
  parseAuthDeepLink,
  loginErrorPath,
  handleAuthDeepLink,
  registerAuthDeepLinks,
  __resetAuthDeepLinksForTests,
} from "@/lib/native/auth/deepLinks";
import { App } from "@capacitor/app";

const SCHEME = "com.brainfyai.realtordesk";
const CODE = "3f6c1a52-9b1e-4c0a-8a53-0f2d6e1b7c44";

beforeEach(() => {
  h.native = true;
  h.listeners.length = 0;
  h.closed = 0;
  h.exchange.mockReset();
  h.exchange.mockResolvedValue({ data: {}, error: null });
  vi.mocked(App.addListener).mockClear();
  __resetAuthDeepLinksForTests();
});

describe("parseAuthDeepLink: the provider callback", () => {
  it("takes the code from the custom-scheme callback", () => {
    expect(parseAuthDeepLink(`${SCHEME}://auth/callback?code=${CODE}`)).toEqual({
      kind: "oauth-callback",
      code: CODE,
    });
  });

  it("tolerates a trailing slash and a mixed-case scheme", () => {
    expect(parseAuthDeepLink(`${SCHEME}://auth/callback/?code=${CODE}`).kind).toBe("oauth-callback");
    expect(parseAuthDeepLink(`COM.BrainfyAI.RealtorDesk://auth/callback?code=${CODE}`).kind).toBe(
      "oauth-callback",
    );
  });

  it("reports an error from the query string", () => {
    expect(
      parseAuthDeepLink(
        `${SCHEME}://auth/callback?error=access_denied&error_description=The+user+denied+the+request`,
      ),
    ).toEqual({
      kind: "oauth-error",
      error: "access_denied",
      description: "The user denied the request",
    });
  });

  it("reports an error that arrives in the fragment instead", () => {
    const action = parseAuthDeepLink(`${SCHEME}://auth/callback#error=server_error&error_description=boom`);
    expect(action).toEqual({ kind: "oauth-error", error: "server_error", description: "boom" });
  });

  it("prefers the error over a code when both are present", () => {
    expect(parseAuthDeepLink(`${SCHEME}://auth/callback?code=${CODE}&error=access_denied`).kind).toBe(
      "oauth-error",
    );
  });

  it("treats a callback with no usable code as a failed sign-in, not as silence", () => {
    expect(parseAuthDeepLink(`${SCHEME}://auth/callback`)).toEqual({
      kind: "oauth-error",
      error: "missing_code",
      description: "",
    });
    expect(parseAuthDeepLink(`${SCHEME}://auth/callback?code=`).kind).toBe("oauth-error");
    expect(parseAuthDeepLink(`${SCHEME}://auth/callback?code=%3Cscript%3E`).kind).toBe("oauth-error");
    expect(parseAuthDeepLink(`${SCHEME}://auth/callback?code=https://evil.example/x`).kind).toBe(
      "oauth-error",
    );
  });

  it("caps the length of provider-supplied error text", () => {
    const action = parseAuthDeepLink(`${SCHEME}://auth/callback?error=${"x".repeat(900)}`);
    expect(action.kind).toBe("oauth-error");
    if (action.kind === "oauth-error") expect(action.error.length).toBeLessThanOrEqual(200);
  });
});

describe("parseAuthDeepLink: the custom scheme is not a way to navigate the app", () => {
  it.each([
    `${SCHEME}://app`,
    `${SCHEME}://app/leads/123`,
    `${SCHEME}://billing`,
    `${SCHEME}://pricing`,
    `${SCHEME}://signup`,
    `${SCHEME}://reset-password?code=${CODE}`,
    `${SCHEME}://auth/callback/extra?code=${CODE}`,
    `${SCHEME}://auth/other?code=${CODE}`,
    `${SCHEME}://auth/../billing`,
    `${SCHEME}://`,
    `${SCHEME}:auth/callback?code=${CODE}`,
  ])("ignores %s", (url) => {
    expect(parseAuthDeepLink(url)).toEqual({ kind: "ignore" });
  });
});

describe("parseAuthDeepLink: links to the website", () => {
  it("routes the product", () => {
    expect(parseAuthDeepLink("https://www.realtordesk.ai/app")).toEqual({ kind: "route", to: "/app" });
    expect(parseAuthDeepLink("https://www.realtordesk.ai/app/leads/abc-123")).toEqual({
      kind: "route",
      to: "/app/leads/abc-123",
    });
    expect(parseAuthDeepLink("https://realtordesk.ai/app/inbox?lead=42")).toEqual({
      kind: "route",
      to: "/app/inbox?lead=42",
    });
    expect(parseAuthDeepLink("https://www.realtordesk.ai/app/")).toEqual({ kind: "route", to: "/app" });
  });

  it("routes the reset page with its one-time credentials intact", () => {
    expect(parseAuthDeepLink(`https://www.realtordesk.ai/reset-password?code=${CODE}`)).toEqual({
      kind: "route",
      to: `/reset-password?code=${CODE}`,
    });
    expect(
      parseAuthDeepLink("https://www.realtordesk.ai/reset-password#access_token=aaa&refresh_token=bbb&type=recovery"),
    ).toEqual({
      kind: "route",
      to: "/reset-password#access_token=aaa&refresh_token=bbb&type=recovery",
    });
  });

  it("routes the verify-email page and drops anything attached to it", () => {
    expect(parseAuthDeepLink("https://www.realtordesk.ai/verify-email?x=1#y")).toEqual({
      kind: "route",
      to: "/verify-email",
    });
  });

  it.each([
    // Everything the app must never show, even when the website has it.
    "https://www.realtordesk.ai/",
    "https://www.realtordesk.ai/pricing",
    "https://www.realtordesk.ai/billing",
    "https://www.realtordesk.ai/billing?required=1",
    "https://www.realtordesk.ai/signup",
    "https://www.realtordesk.ai/contact",
    "https://www.realtordesk.ai/login",
    "https://www.realtordesk.ai/calendar",
    "https://www.realtordesk.ai/dashboard/integrations",
    // Look-alike paths.
    "https://www.realtordesk.ai/apple",
    "https://www.realtordesk.ai/application",
    "https://www.realtordesk.ai/reset-password-2",
    "https://www.realtordesk.ai/app/../billing",
    "https://www.realtordesk.ai/app/%2e%2e/billing",
    "https://www.realtordesk.ai/app/..%2fbilling",
    "https://www.realtordesk.ai/app%2f..%2fpricing",
    "https://www.realtordesk.ai/app//leads",
    "https://www.realtordesk.ai/app/\\billing",
    // Look-alike hosts.
    "https://realtordesk.ai.evil.example/app",
    "https://evil.example/app",
    "https://www.realtordesk.ai@evil.example/app",
    "https://user:pw@www.realtordesk.ai/app",
    "https://www.realtordesk.ai:8443/app",
    "https://app.realtordesk.ai/app",
    // Wrong scheme entirely.
    "http://www.realtordesk.ai/app",
    "javascript:alert(1)",
    "data:text/html,<script>alert(1)</script>",
    "file:///etc/passwd",
    "capacitor://localhost/app",
    "otherapp://auth/callback?code=abc",
    "/app",
    "",
    "   ",
  ])("ignores %s", (url) => {
    expect(parseAuthDeepLink(url)).toEqual({ kind: "ignore" });
  });

  it("ignores input that is not a string, or is absurdly long", () => {
    expect(parseAuthDeepLink(undefined)).toEqual({ kind: "ignore" });
    expect(parseAuthDeepLink(null)).toEqual({ kind: "ignore" });
    expect(parseAuthDeepLink(42)).toEqual({ kind: "ignore" });
    expect(parseAuthDeepLink("https://www.realtordesk.ai/app/" + "a".repeat(5000))).toEqual({
      kind: "ignore",
    });
  });
});

describe("loginErrorPath", () => {
  it("builds the same ?error= shape Login.tsx already reads from a web round-trip", () => {
    const path = loginErrorPath("access_denied", "The user denied the request");
    const url = new URL(path, "https://x.invalid");
    expect(url.pathname).toBe("/login");
    expect(url.searchParams.get("error")).toBe("access_denied");
    expect(url.searchParams.get("error_description")).toBe("The user denied the request");
  });

  it("never produces an empty error code, which the login page would ignore", () => {
    expect(new URL(loginErrorPath("", ""), "https://x.invalid").searchParams.get("error")).toBe(
      "oauth_failed",
    );
  });
});

describe("the listener", () => {
  it("does nothing in a browser", () => {
    h.native = false;
    registerAuthDeepLinks(vi.fn());
    expect(App.addListener).not.toHaveBeenCalled();
  });

  it("registers exactly one native listener however often it is called", () => {
    registerAuthDeepLinks(vi.fn());
    registerAuthDeepLinks(vi.fn());
    registerAuthDeepLinks(vi.fn());
    expect(App.addListener).toHaveBeenCalledTimes(1);
    expect(vi.mocked(App.addListener).mock.calls[0][0]).toBe("appUrlOpen");
  });

  it("uses the most recent navigate function", async () => {
    const first = vi.fn();
    const second = vi.fn();
    registerAuthDeepLinks(first);
    registerAuthDeepLinks(second);
    await handleAuthDeepLink("https://www.realtordesk.ai/app/leads");
    expect(first).not.toHaveBeenCalled();
    expect(second).toHaveBeenCalledWith("/app/leads");
  });

  it("exchanges the code, closes the browser and lands on /app", async () => {
    const navigate = vi.fn();
    registerAuthDeepLinks(navigate);
    await handleAuthDeepLink(`${SCHEME}://auth/callback?code=${CODE}`);
    expect(h.exchange).toHaveBeenCalledWith(CODE);
    expect(h.closed).toBe(1);
    expect(navigate).toHaveBeenCalledWith("/app", { replace: true });
  });

  it("is driven by the native event, not only by direct calls", async () => {
    const navigate = vi.fn();
    registerAuthDeepLinks(navigate);
    await vi.waitFor(() => expect(h.listeners).toHaveLength(1));
    h.listeners[0]({ url: `${SCHEME}://auth/callback?code=${CODE}` });
    await vi.waitFor(() => expect(navigate).toHaveBeenCalledWith("/app", { replace: true }));
  });

  it("sends a refused sign-in to the login page with the provider's code", async () => {
    const navigate = vi.fn();
    registerAuthDeepLinks(navigate);
    await handleAuthDeepLink(`${SCHEME}://auth/callback?error=access_denied`);
    expect(h.exchange).not.toHaveBeenCalled();
    expect(h.closed).toBe(1);
    expect(navigate).toHaveBeenCalledWith("/login?error=access_denied", { replace: true });
  });

  it("sends a failed exchange to the login page without leaking the reason", async () => {
    h.exchange.mockResolvedValue({ data: {}, error: new Error("invalid flow state, no valid flow state found") });
    const navigate = vi.fn();
    registerAuthDeepLinks(navigate);
    await handleAuthDeepLink(`${SCHEME}://auth/callback?code=${CODE}`);
    expect(navigate).toHaveBeenCalledWith("/login?error=exchange_failed", { replace: true });
  });

  it("survives the exchange throwing", async () => {
    h.exchange.mockRejectedValue(new Error("network"));
    const navigate = vi.fn();
    registerAuthDeepLinks(navigate);
    await expect(handleAuthDeepLink(`${SCHEME}://auth/callback?code=${CODE}`)).resolves.toBeTruthy();
    expect(navigate).toHaveBeenCalledWith("/login?error=exchange_failed", { replace: true });
  });

  it("exchanges a code once even if the OS delivers the link twice", async () => {
    const navigate = vi.fn();
    registerAuthDeepLinks(navigate);
    await handleAuthDeepLink(`${SCHEME}://auth/callback?code=${CODE}`);
    await handleAuthDeepLink(`${SCHEME}://auth/callback?code=${CODE}`);
    expect(h.exchange).toHaveBeenCalledTimes(1);
    expect(navigate).toHaveBeenCalledTimes(1);
  });

  it("does not navigate, exchange or close anything for an ignored link", async () => {
    const navigate = vi.fn();
    registerAuthDeepLinks(navigate);
    await handleAuthDeepLink("https://www.realtordesk.ai/pricing");
    await handleAuthDeepLink(`${SCHEME}://billing`);
    expect(navigate).not.toHaveBeenCalled();
    expect(h.exchange).not.toHaveBeenCalled();
    expect(h.closed).toBe(0);
  });
});
