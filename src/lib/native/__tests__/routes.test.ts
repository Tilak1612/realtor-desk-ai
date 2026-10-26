import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  NATIVE_HOME,
  isAllowedInNative,
  isHiddenInNative,
  nativeRedirectFor,
  normalizePath,
} from "../routes";

// The allow-list is the thing standing between the iOS / Android app and the
// website's pricing, sign-up and marketing pages, all of which are in the same
// bundle. These tests pin both directions: the product stays reachable, and
// nothing commercial or unfinished becomes reachable by accident.

describe("isAllowedInNative", () => {
  it.each([
    "/app",
    "/app/",
    "/app/leads",
    "/app/leads/123",
    "/app/leads/123?tab=notes#timeline",
    "/app/pipeline",
    "/app/inbox",
    "/app/automation",
    "/app/reports",
    "/app/settings",
    "/app/some-route-that-does-not-exist",
    "/login",
    "/login?next=%2Fapp%2Fleads",
    "/forgot-password",
    "/reset-password",
    "/reset-password#access_token=abc",
    "/verify-email",
    "/onboarding",
    "/tasks",
    "/properties",
    "/ai-assistant",
    "/contacts",
    "/contacts/42",
    "/deals",
    "/call-workflow",
    "/call-workflow/42",
    "/settings",
    "/privacy-policy",
    "/terms-of-service",
    "/Terms-Of-Service/",
  ])("allows the product path %s", (path) => {
    expect(isAllowedInNative(path)).toBe(true);
  });

  it.each([
    // The start route: the marketing homepage must never render in the app.
    "/",
    "",
    // Commercial: no purchase, price or sign-up inside the app.
    "/pricing",
    "/pricing?lang=fr",
    "/signup",
    "/signup?plan=solo",
    "/sign-up",
    "/billing",
    "/billing?required=1",
    "/demo",
    // Unfinished legacy screens.
    "/calendar",
    "/campaigns",
    "/market",
    "/market-intelligence",
    "/dashboard/integrations",
    // Marketing.
    "/features",
    "/features/pipeline",
    "/compare/boldtrail",
    "/blog/crea-ddf",
    "/fr/crm-immobilier",
    "/resources",
    "/contact",
    "/faq",
    "/integrations",
    "/partners/apply",
    "/unsubscribe",
    "/admin/demo-requests",
    "/pipeda-compliance",
    // Prefix look-alikes: "/app" must not admit "/apple" or "/application".
    "/apple",
    "/application",
    "/appx/leads",
    "/login/extra",
    "/tasks/1",
    "/settings/billing",
    "/privacy-policy/anything",
    // Not in-app paths at all.
    "https://www.realtordesk.ai/app",
    "//evil.example/app",
    "app",
    "javascript:alert(1)",
  ])("blocks %s", (path) => {
    expect(isAllowedInNative(path)).toBe(false);
  });

  it("is not fooled by doubled slashes", () => {
    expect(isAllowedInNative("/app//leads")).toBe(true);
    expect(normalizePath("/app//leads/")).toBe("/app/leads");
  });
});

describe("isHiddenInNative", () => {
  it.each([
    "/calendar",
    "/campaigns",
    "/market",
    "/dashboard/integrations",
    "/billing",
    "/billing?required=1",
    "/pricing",
    "/signup",
    "/signup/",
  ])("hides %s from navigation", (path) => {
    expect(isHiddenInNative(path)).toBe(true);
  });

  it.each([
    "/app",
    "/app/leads",
    "/app/settings",
    "/tasks",
    "/properties",
    "/ai-assistant",
    "/login",
    // Look-alikes of hidden paths.
    "/marketing",
    "/market-intelligence",
    "/dashboard",
  ])("keeps %s in navigation", (path) => {
    expect(isHiddenInNative(path)).toBe(false);
  });

  it("never hides something the app is allowed to show, or allows something it hides", () => {
    for (const path of ["/calendar", "/campaigns", "/market", "/dashboard/integrations", "/billing", "/pricing", "/signup"]) {
      expect(isHiddenInNative(path), path).toBe(true);
      expect(isAllowedInNative(path), path).toBe(false);
    }
  });
});

describe("nativeRedirectFor", () => {
  it("sends blocked paths to the dashboard by default", () => {
    expect(NATIVE_HOME).toBe("/app");
    expect(nativeRedirectFor("/")).toBe("/app");
    expect(nativeRedirectFor("/pricing")).toBe("/app");
    expect(nativeRedirectFor("/signup")).toBe("/app");
    expect(nativeRedirectFor("/blog/crea-ddf")).toBe("/app");
  });

  it("keeps the precise target for legacy aliases", () => {
    expect(nativeRedirectFor("/reports")).toBe("/app/reports");
    expect(nativeRedirectFor("/automations")).toBe("/app/automation");
    expect(nativeRedirectFor("/profile")).toBe("/app/settings");
  });

  // RequireBilling redirects an unpaid account to /billing?required=1. If the
  // guard answered that with a route that is itself behind RequireBilling, the
  // two redirects would chase each other forever.
  it("sends /billing somewhere that is NOT behind RequireBilling", () => {
    const target = nativeRedirectFor("/billing?required=1");
    expect(target).toBe("/app/settings");

    const app = readFileSync(resolve(__dirname, "../../../App.tsx"), "utf8");
    const route = app.split("\n").find((line) => line.includes('path="/app/settings"'));
    expect(route, "the /app/settings route is missing from App.tsx").toBeTruthy();
    expect(route, "/app/settings is now behind RequireBilling: /billing would loop in the app").not.toContain(
      "RequireBilling",
    );
  });

  it("only ever redirects to a path the app is allowed to show", () => {
    const blocked = ["/", "/pricing", "/signup", "/billing", "/profile", "/reports", "/automations", "/calendar", "/nope"];
    for (const path of blocked) {
      expect(isAllowedInNative(nativeRedirectFor(path)), path).toBe(true);
    }
  });
});

// The allow-list names paths; App.tsx owns the routes. If a product route is
// renamed there, the list would silently keep admitting a path that no longer
// exists while blocking the new one.
describe("allow-list against the route table", () => {
  const app = readFileSync(resolve(__dirname, "../../../App.tsx"), "utf8");
  const routePaths = [...app.matchAll(/<Route path="([^"]+)"/g)].map((m) => m[1]);

  it("finds the route table", () => {
    expect(routePaths.length).toBeGreaterThan(100);
  });

  it.each([
    "/app",
    "/app/leads/:id",
    "/app/settings",
    "/login",
    "/forgot-password",
    "/reset-password",
    "/verify-email",
    "/onboarding",
    "/tasks",
    "/properties",
    "/ai-assistant",
    "/contacts",
    "/contacts/:id",
    "/deals",
    "/call-workflow/:contactId",
    "/settings",
    "/privacy-policy",
    "/terms-of-service",
  ])("%s is a real route and is allowed", (path) => {
    expect(routePaths).toContain(path);
    expect(isAllowedInNative(path.replace(/:\w+/g, "123"))).toBe(true);
  });

  it("blocks every route outside the product", () => {
    const reachable = routePaths
      .filter((p) => p !== "*")
      .filter((p) => isAllowedInNative(p.replace(/:\w+/g, "123").replace(/\/\*$/, "/x")));
    // Everything the app can reach, spelled out. A new route only lands in this
    // list by someone adding it to routes.ts on purpose.
    expect(reachable.sort()).toEqual(
      [
        "/ai-assistant",
        "/app",
        "/app/*",
        "/app/automation",
        "/app/inbox",
        "/app/leads",
        "/app/leads/:id",
        "/app/pipeline",
        "/app/reports",
        "/app/settings",
        "/call-workflow/:contactId",
        "/contacts",
        "/contacts/:id",
        "/deals",
        "/forgot-password",
        "/login",
        "/onboarding",
        "/privacy-policy",
        "/properties",
        "/reset-password",
        "/settings",
        "/tasks",
        "/terms-of-service",
        "/verify-email",
      ].sort(),
    );
  });
});
