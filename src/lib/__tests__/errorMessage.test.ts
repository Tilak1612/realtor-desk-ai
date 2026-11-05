import { describe, expect, it } from "vitest";
import { errorMessage } from "../errorMessage";

describe("errorMessage", () => {
  it("reads an Error, including subclasses", () => {
    expect(errorMessage(new Error("boom"))).toBe("boom");
    expect(errorMessage(new TypeError("Failed to fetch"))).toBe("Failed to fetch");
  });

  it("reads a plain Supabase-style error object", () => {
    // PostgrestError and AuthError arrive as objects with a string message.
    expect(errorMessage({ message: "Invalid login credentials", status: 400 })).toBe("Invalid login credentials");
  });

  it("keeps an empty message empty, so `|| fallback` still falls back", () => {
    expect(errorMessage(new Error(""))).toBe("");
    expect(errorMessage(new Error("") ) || "fallback").toBe("fallback");
  });

  it.each([
    ["undefined", undefined],
    ["null", null],
    ["a thrown string", "boom"],
    ["a number", 42],
    ["an object without a message", { code: "PGRST116" }],
    ["an object with a non-string message", { message: { nested: true } }],
  ])("gives undefined for %s, as `(e as any).message` did", (_what, value) => {
    expect(errorMessage(value)).toBeUndefined();
  });
});
