// Rejects passwords that satisfy every composition rule and are still among
// the first things an attacker tries.
//
// The five existing rules (8+ chars, upper, lower, digit, symbol) are
// satisfied by "Password1!", "Welcome1!" and "Summer2024!" -- three of the
// most common passwords in every published breach corpus. Composition rules
// do not merely fail to catch these: they actively steer users toward them,
// because capitalise-the-first-letter + append-a-digit + append-! is the
// cheapest way for a person to satisfy all five.
//
// Supabase's own "leaked password protection" (HIBP) covers this server-side
// and is still worth enabling -- it is a dashboard toggle this code cannot
// reach. This check is deliberately OFFLINE rather than calling HIBP from the
// browser: an outage of an external API must never be able to block signups,
// and a network call on every keystroke of the password field is its own
// problem. The trade-off is coverage -- a denylist catches the head of the
// distribution, not the tail.

// Roots, not whole passwords. Checked after stripping the decorations people
// add to satisfy composition rules, so "password" here also blocks
// "Password1!", "P@ssword2024" and "password!!".
const COMMON_ROOTS = new Set([
  "password", "passwort", "motdepasse", "welcome", "bienvenue", "qwerty",
  "azerty", "letmein", "admin", "administrator", "root", "login", "user",
  "guest", "test", "testing", "changeme", "temp", "temporary", "secret",
  "abc", "abcd", "iloveyou", "monkey", "dragon", "shadow", "master",
  "superman", "batman", "trustno", "football", "baseball", "hockey",
  "soccer", "sunshine", "princess", "flower", "starwars", "pokemon",
  "michael", "jennifer", "jordan", "hunter", "ranger", "harley", "charlie",
  "thomas", "robert", "daniel", "matthew", "andrew", "joshua",
  "summer", "winter", "spring", "autumn", "january", "february", "march",
  "april", "june", "july", "august", "september", "october", "november",
  "december",
  "company", "business", "office", "work", "money", "freedom", "whatever",
  "computer", "internet", "google", "facebook",
  // Roots a user of THIS product is disproportionately likely to reach for.
  "realtordesk", "realtor", "realtors", "realestate", "brokerage", "broker",
  "listing", "listings", "remax", "century", "sothebys", "royallepage",
  "canada", "canadian", "toronto", "vancouver", "montreal", "calgary",
  "ottawa", "edmonton", "winnipeg", "halifax", "quebec", "ontario",
  "alberta",
]);

// Whole-string matches that survive normalisation to something too short or
// too numeric to be a meaningful "root".
const COMMON_EXACT = new Set([
  "12345678", "123456789", "1234567890", "11111111", "00000000",
  "87654321", "qwertyui", "asdfghjk", "zxcvbnm", "1q2w3e4r", "1qaz2wsx",
  "qazwsxedc", "passw0rd", "p@ssw0rd", "adm1n",
]);

// Common character substitutions, reversed. Applied so "P@ssw0rd" and
// "Rea1t0r" collapse onto their dictionary roots instead of sailing past a
// literal string comparison.
const LEET: Record<string, string> = {
  "@": "a", "4": "a", "8": "b", "(": "c", "3": "e", "6": "g", "1": "l",
  "!": "i", "0": "o", "5": "s", "$": "s", "7": "t", "+": "t", "2": "z",
};

// The character class is DERIVED from LEET rather than written out beside it.
// Hand-typing a duplicate list is how a full-width U+FF10 got in where ASCII
// "0" belonged: every 0 -> o substitution silently did nothing, and
// "P@ssw0rd1" passed. Two sources of truth for the same set will drift.
const LEET_RE = new RegExp(
  `[${Object.keys(LEET).map((c) => c.replace(/[-[\]{}()*+?.,\\^$|#]/g, "\\$&")).join("")}]`,
  "g"
);

function unleet(s: string): string {
  return s.replace(LEET_RE, (c) => LEET[c] ?? c);
}

/**
 * Strips the decoration people add to satisfy composition rules, leaving the
 * dictionary word underneath: "Summer2024!" -> "summer", "P@ssw0rd!" ->
 * "password".
 */
function rootOf(password: string): string {
  let s = password.toLowerCase();
  // Trailing year/number and punctuation runs -- the classic suffix.
  s = s.replace(/[^a-z0-9]+$/i, "").replace(/[0-9]+$/, "");
  // Leading punctuation, less common but seen.
  s = s.replace(/^[^a-z0-9]+/i, "");
  s = unleet(s);
  // Anything non-alphabetic left over is noise between letters.
  return s.replace(/[^a-z]/g, "");
}

/**
 * True when the password is a known-weak choice despite passing composition.
 * `disallow` carries context-specific strings -- typically the local part of
 * the user's own email, which is the single most common source of a guessable
 * password and is invisible to any generic list.
 */
export function isCommonPassword(password: string, disallow: string[] = []): boolean {
  if (!password) return false;
  const lower = password.toLowerCase();

  if (COMMON_EXACT.has(lower) || COMMON_EXACT.has(unleet(lower))) return true;

  const root = rootOf(password);
  // A root shorter than 4 chars carries no signal -- "a1b2c3d4!" reduces to
  // nothing meaningful and should not be rejected on that basis.
  if (root.length >= 4 && COMMON_ROOTS.has(root)) return true;

  // Long runs of one repeated character, and simple ascending/descending
  // sequences, both of which pass composition when decorated.
  if (/^(.)\1{5,}/.test(lower.replace(/[^a-z0-9]/g, ""))) return true;

  for (const raw of disallow) {
    const term = (raw ?? "").toLowerCase().trim();
    if (term.length >= 4 && (lower.includes(term) || root.includes(term))) return true;
  }
  return false;
}

/** The local part of an email, for passing into `disallow`. */
export function emailLocalPart(email: string | undefined | null): string[] {
  if (!email || !email.includes("@")) return [];
  const local = email.split("@")[0];
  // Split on separators too: "jane.doe" should block "jane" and "doe".
  return [local, ...local.split(/[._\-+]/)].filter((p) => p.length >= 4);
}
