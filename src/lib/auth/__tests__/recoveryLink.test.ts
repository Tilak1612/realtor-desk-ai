import { describe, it, expect } from "vitest";
import { parseRecoveryFragment } from "@/lib/auth/recoveryLink";

/**
 * The reset page turns a URL fragment into a signed-in session, so what it is
 * willing to read is a security boundary: recovery tokens and nothing else.
 */
describe("parseRecoveryFragment", () => {
  const ok =
    "#access_token=eyJhbGciOi.eyJzdWIiOiIx.c2lnbmF0dXJl&expires_in=3600&refresh_token=v1.Mabc_def-123&token_type=bearer&type=recovery";

  it("reads the tokens from a recovery link", () => {
    expect(parseRecoveryFragment(ok)).toEqual({
      accessToken: "eyJhbGciOi.eyJzdWIiOiIx.c2lnbmF0dXJl",
      refreshToken: "v1.Mabc_def-123",
    });
  });

  it("accepts the fragment with or without its leading #", () => {
    expect(parseRecoveryFragment(ok.slice(1))).not.toBeNull();
  });

  it.each([
    ["an empty fragment", ""],
    ["a bare #", "#"],
    ["an in-page anchor", "#pricing"],
    ["tokens with no type", "#access_token=aaaaaaaa&refresh_token=bbbbbbbb"],
    ["a sign-in, not a recovery", "#access_token=aaaaaaaa&refresh_token=bbbbbbbb&type=signup"],
    ["a magic link", "#access_token=aaaaaaaa&refresh_token=bbbbbbbb&type=magiclink"],
    ["a recovery with no refresh token", "#access_token=aaaaaaaa&type=recovery"],
    ["a recovery with no access token", "#refresh_token=bbbbbbbb&type=recovery"],
    ["an error fragment", "#error=access_denied&error_code=otp_expired&error_description=Email+link+is+invalid"],
    ["markup where a token should be", "#access_token=%3Cscript%3E&refresh_token=bbbbbbbb&type=recovery"],
    ["a URL where a token should be", "#access_token=https%3A%2F%2Fevil.example&refresh_token=bbbbbbbb&type=recovery"],
  ])("ignores %s", (_label, hash) => {
    expect(parseRecoveryFragment(hash)).toBeNull();
  });

  it("ignores non-strings", () => {
    expect(parseRecoveryFragment(null)).toBeNull();
    expect(parseRecoveryFragment(undefined)).toBeNull();
  });
});
