import { describe, it, expect, beforeEach } from "vitest";
import {
  readReferralCookie,
  writeReferralCookie,
  clearReferralCookie,
  getReferralParamFromUrl,
} from "../cookie";
import { ATTRIBUTION_COOKIE } from "../constants";

// jsdom provides document.cookie; each test cleans it via clearReferralCookie().

function wipeAllCookies() {
  const cookies = document.cookie.split(";");
  for (const c of cookies) {
    const eq = c.indexOf("=");
    const name = eq > -1 ? c.substring(0, eq).trim() : c.trim();
    if (name) document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
  }
}

describe("affiliate cookie", () => {
  beforeEach(() => {
    wipeAllCookies();
  });

  describe("readReferralCookie", () => {
    it("returns null when no cookie is set", () => {
      expect(readReferralCookie()).toBeNull();
    });

    it("returns the decoded slug after write", () => {
      writeReferralCookie("alice-campaign");
      expect(readReferralCookie()).toBe("alice-campaign");
    });

    it("handles URL-encoded special characters", () => {
      writeReferralCookie("bob+co");
      expect(readReferralCookie()).toBe("bob+co");
    });
  });

  describe("writeReferralCookie", () => {
    it("writes a cookie with the attribution name", () => {
      writeReferralCookie("carol");
      expect(document.cookie).toContain(`${ATTRIBUTION_COOKIE.name}=carol`);
    });

    it("rejects empty or whitespace-only slugs (prevents attribution nuke via XSS)", () => {
      writeReferralCookie("alice");
      writeReferralCookie("");
      expect(readReferralCookie()).toBe("alice"); // still alice

      writeReferralCookie("   ");
      expect(readReferralCookie()).toBe("alice"); // still alice
    });

    it("trims whitespace", () => {
      writeReferralCookie("  dave  ");
      expect(readReferralCookie()).toBe("dave");
    });

    it("overwrites on re-write (last-click attribution)", () => {
      writeReferralCookie("alice");
      writeReferralCookie("bob");
      expect(readReferralCookie()).toBe("bob");
    });
  });

  describe("clearReferralCookie", () => {
    it("removes the cookie", () => {
      writeReferralCookie("alice");
      clearReferralCookie();
      expect(readReferralCookie()).toBeNull();
    });
  });

  describe("getReferralParamFromUrl", () => {
    it("extracts ref from a query string", () => {
      expect(getReferralParamFromUrl("?ref=alice")).toBe("alice");
      expect(getReferralParamFromUrl("?ref=bob&utm_source=email")).toBe("bob");
    });

    it("returns null when missing", () => {
      expect(getReferralParamFromUrl("")).toBeNull();
      expect(getReferralParamFromUrl("?utm_source=email")).toBeNull();
    });

    it("returns null on empty/whitespace-only ref", () => {
      expect(getReferralParamFromUrl("?ref=")).toBeNull();
      expect(getReferralParamFromUrl("?ref=   ")).toBeNull();
    });

    it("accepts a URLSearchParams instance", () => {
      const p = new URLSearchParams("ref=eve");
      expect(getReferralParamFromUrl(p)).toBe("eve");
    });

    it("trims whitespace on extraction", () => {
      expect(getReferralParamFromUrl("?ref=%20frank%20")).toBe("frank");
    });
  });
});
