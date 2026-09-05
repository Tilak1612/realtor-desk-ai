import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const config = readFileSync(join(process.cwd(), "src/i18n/config.ts"), "utf8");

/**
 * Guards against re-introducing performance claims the product cannot support.
 *
 * Context, measured against production on 2026-09-05: 15 auth users (several
 * of them internal demo accounts), 55 contacts, ONE active subscription, and
 * zero rows in `deals` and zero in `tasks` since the first signup on
 * 2026-04-08.
 *
 * With no deal ever recorded, no conversion rate, fall-through rate or
 * revenue outcome has ever been observed. Copy asserting one is not
 * "unverified" -- it is describing something that did not happen. Competition
 * Act s.74.01 requires an adequate and proper test BEFORE a performance
 * representation is made, and CLAUDE.md forbids fabricating customer counts,
 * revenue and uptime outright.
 *
 * The FAQ already answers this correctly under "Do you publish conversion
 * statistics?" -- "we do not have a defensible sample yet". Two other FAQ
 * answers contradicted it on the same page until this was cleaned up.
 *
 * If a claim below becomes true and substantiated, delete its line here and
 * record the substantiation in the runbook. Do not weaken the pattern.
 */
const FORBIDDEN: Array<[RegExp, string]> = [
  [/50\+?\s*(active\s*)?(realtors|beta users|beta participants)/i,
   "user count -- production had 15 users, 1 paying"],
  [/plus de 50 agents/i, "user count (fr)"],
  [/Beta Participant Since/i,
   "testimonial badge dated before the first signup (2026-04-08)"],
  [/500,?000\+?\s*Canadian transactions/i,
   "training-corpus size -- `deals` has never held a row"],
  [/Converts 18%\s*vs\s*industry 5%/i, "conversion rate -- no deal recorded"],
  [/fall-?through reduced from 12% to 4%/i, "no deal recorded"],
  [/\d+%\s*fewer missed deadlines/i, "`tasks` has never held a row"],
  [/90%\s*of agents approve/i, "no such measurement exists"],
  [/90 ?%\s*des agents approuvent/i, "no such measurement exists (fr)"],
  [/Based on our beta user data/i,
   "contradicts the honest answer in the same FAQ"],
  [/données de nos utilisateurs bêta/i, "same, fr"],
];

describe("marketing copy makes no claim the data cannot support", () => {
  it.each(FORBIDDEN)("does not assert %s", (pattern, why) => {
    const hit = config.match(pattern);
    expect(
      hit,
      `src/i18n/config.ts asserts ${hit?.[0]} -- ${why}. See this file's header.`
    ).toBeNull();
  });

  it("keeps the honest answer that the others contradicted", () => {
    // The correct position, already written. If this disappears, the cleanup
    // has been reverted rather than superseded.
    expect(config).toMatch(/do not have a defensible sample/i);
  });
});
