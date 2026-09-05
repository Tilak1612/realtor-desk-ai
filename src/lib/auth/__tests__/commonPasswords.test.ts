import { describe, it, expect } from "vitest";
import { isCommonPassword, emailLocalPart } from "../commonPasswords";
import { validatePassword } from "@/components/ui/password-input";

/**
 * The five composition rules are satisfied by the most-breached passwords in
 * existence. Worse, they *steer* users toward them: capitalise the first
 * letter, append a digit, append "!" is the cheapest way for a person to
 * satisfy all five at once.
 */
describe("passwords that pass every composition rule and are still terrible", () => {
  const decoyed = ["Password1!", "Welcome1!", "Summer2024!", "P@ssw0rd1", "Qwerty123!", "Letmein1!"];

  it.each(decoyed)("%s satisfies the old rules", (pwd) => {
    // Establishes the premise: these are not caught by length/case/digit/symbol.
    expect(pwd.length).toBeGreaterThanOrEqual(8);
    expect(/[A-Z]/.test(pwd) && /[a-z]/.test(pwd) && /[0-9]/.test(pwd)).toBe(true);
  });

  it.each(decoyed)("%s is now rejected", (pwd) => {
    expect(isCommonPassword(pwd)).toBe(true);
  });

  it("rejects them through the shared validator the forms actually call", () => {
    // Signup and ResetPassword both gate on validatePassword. If the UI
    // requirement and the zod schema disagreed, one would block while the
    // other allowed -- the user would see green ticks and a failed submit.
    for (const pwd of decoyed) expect(validatePassword(pwd)).toBe(false);
  });
});

describe("passwords that are fine and must not be blocked", () => {
  // Over-blocking is the real risk of a denylist: it is invisible to us and
  // infuriating to the user, who sees a rule they have satisfied marked red.
  const good = [
    "Tr0ub4dor&3",
    "Redwood99!",
    "Kx7#mQp2vL",
    "Chinook-Ridge4!",
    "correcthorse!7B",
    "Maple9$Harbour",
  ];

  it.each(good)("%s is accepted", (pwd) => {
    expect(isCommonPassword(pwd)).toBe(false);
    expect(validatePassword(pwd)).toBe(true);
  });

  it("does not reject on a short reduced root", () => {
    // "a1b2c3d4!" reduces to almost nothing; that is not evidence of weakness
    // and must not trip the root check.
    expect(isCommonPassword("aXbY7c!Q")).toBe(false);
  });
});

describe("context the generic list cannot know", () => {
  it("blocks a password built from the user's own email", () => {
    const disallow = emailLocalPart("jane.mccarthy@example.ca");
    expect(disallow).toContain("jane");
    expect(disallow).toContain("mccarthy");
    expect(isCommonPassword("Mccarthy2024!", disallow)).toBe(true);
  });

  it("ignores email fragments too short to mean anything", () => {
    // "jd" must not blocklist every password containing those letters.
    expect(emailLocalPart("jd@example.ca")).toEqual([]);
  });

  it("leaves unrelated passwords alone for the same user", () => {
    const disallow = emailLocalPart("jane.mccarthy@example.ca");
    expect(isCommonPassword("Chinook-Ridge4!", disallow)).toBe(false);
  });
});

describe("leetspeak and repetition", () => {
  it("sees through character substitution", () => {
    expect(isCommonPassword("P@$$w0rd!")).toBe(true);
    expect(isCommonPassword("R3@lt0r1!")).toBe(true);
  });

  it("rejects long single-character runs", () => {
    expect(isCommonPassword("Aaaaaaaa1!")).toBe(true);
  });
});
