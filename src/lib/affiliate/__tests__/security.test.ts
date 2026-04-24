import { describe, it, expect } from "vitest";
import {
  hashIpAddress,
  generateAffiliateSlug,
  slugifyDisplayName,
} from "../security";
import { MIN_IP_SALT_LENGTH } from "../constants";

describe("hashIpAddress", () => {
  const SALT = "x".repeat(MIN_IP_SALT_LENGTH);

  it("produces a 64-char lowercase hex SHA-256", async () => {
    const h = await hashIpAddress("192.0.2.10", SALT);
    expect(h).toHaveLength(64);
    expect(h).toMatch(/^[0-9a-f]{64}$/);
  });

  it("is deterministic for the same input + salt", async () => {
    const a = await hashIpAddress("192.0.2.10", SALT);
    const b = await hashIpAddress("192.0.2.10", SALT);
    expect(a).toBe(b);
  });

  it("changes when IP changes", async () => {
    const a = await hashIpAddress("192.0.2.10", SALT);
    const b = await hashIpAddress("192.0.2.11", SALT);
    expect(a).not.toBe(b);
  });

  it("changes when salt rotates", async () => {
    const a = await hashIpAddress("192.0.2.10", SALT);
    const b = await hashIpAddress("192.0.2.10", "y".repeat(MIN_IP_SALT_LENGTH));
    expect(a).not.toBe(b);
  });

  it("rejects short salts loudly", async () => {
    await expect(hashIpAddress("192.0.2.10", "tooshort")).rejects.toThrow(
      /salt must be/,
    );
    await expect(hashIpAddress("192.0.2.10", "")).rejects.toThrow();
  });
});

describe("generateAffiliateSlug", () => {
  it("returns a string of the requested length", () => {
    expect(generateAffiliateSlug(8)).toHaveLength(8);
    expect(generateAffiliateSlug(16)).toHaveLength(16);
  });

  it("uses only the unambiguous alphabet (no 0/o/1/l/i)", () => {
    const slug = generateAffiliateSlug(64);
    expect(slug).toMatch(/^[abcdefghjkmnpqrstuvwxyz23456789]+$/);
    expect(slug).not.toMatch(/[01loi]/);
  });

  it("is non-trivially random (10 consecutive calls all distinct)", () => {
    const set = new Set<string>();
    for (let i = 0; i < 10; i++) set.add(generateAffiliateSlug(10));
    expect(set.size).toBe(10);
  });

  it("rejects non-positive lengths", () => {
    expect(() => generateAffiliateSlug(0)).toThrow();
    expect(() => generateAffiliateSlug(-1)).toThrow();
  });
});

describe("slugifyDisplayName", () => {
  it("lowercases + hyphenates", () => {
    expect(slugifyDisplayName("Sarah Khoury")).toBe("sarah-khoury");
  });

  it("strips diacritics for Canadian French names", () => {
    expect(slugifyDisplayName("Jérémie Côté")).toBe("jeremie-cote");
    expect(slugifyDisplayName("Émilie Tremblay")).toBe("emilie-tremblay");
  });

  it("collapses repeated separators", () => {
    expect(slugifyDisplayName("A    B — C!")).toBe("a-b-c");
  });

  it("trims leading/trailing hyphens", () => {
    expect(slugifyDisplayName("  Alice  ")).toBe("alice");
    expect(slugifyDisplayName("!!!Bob!!!")).toBe("bob");
  });

  it("caps at 32 characters", () => {
    const long = "x".repeat(100);
    expect(slugifyDisplayName(long).length).toBe(32);
  });

  it("returns empty string when input has no alphanumerics", () => {
    expect(slugifyDisplayName("!!!!")).toBe("");
    expect(slugifyDisplayName("   ")).toBe("");
  });
});
