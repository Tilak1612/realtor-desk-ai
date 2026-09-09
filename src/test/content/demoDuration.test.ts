import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

/**
 * The site must not advertise a demo length that contradicts the Cal.com event.
 *
 * The booking at cal.com/team/brainfy-ai/realtordesk-demo is a 30-minute event
 * -- its own page says "A 30-minute walkthrough" and shows 30m. The hero CTA
 * said "Book a 15-min demo", so a visitor was told fifteen minutes, clicked
 * through, and was offered thirty. Nothing errors on a mismatch like that; it
 * just quietly makes the page wrong.
 *
 * The /demo "What to Expect" list had the same fault from the other direction:
 * "Discovery Call (15 min)" plus "Live Demo (30 min)" advertised 45 minutes of
 * agenda inside a 30-minute slot.
 *
 * If the Cal.com event is ever changed, change DEMO_MINUTES here in the same
 * commit -- this test is the only thing tying the two together.
 */
const DEMO_MINUTES = 30;

function walk(dir: string): string[] {
  const out: string[] = [];
  for (const e of readdirSync(dir)) {
    const full = join(dir, e);
    if (statSync(full).isDirectory()) out.push(...walk(full));
    else if (/\.tsx?$/.test(full) && !full.includes("__tests__") && !full.includes("/test/"))
      out.push(full);
  }
  return out;
}

describe("demo duration", () => {
  it("never advertises a demo length other than the Cal.com event's", () => {
    const offenders: string[] = [];
    // Only durations attached to the word demo/démo count. Setup times, MLS
    // refresh intervals, blog read times and competitor response figures are
    // different facts and are none of this test's business.
    const re =
      /(\d{1,3})\s*-?\s*(?:min|minute|minutes)[^.\n]{0,24}(?:demo|démo)|(?:demo|démo)[^.\n]{0,24}?(\d{1,3})\s*-?\s*(?:min|minute|minutes)/gi;
    for (const file of walk(join(process.cwd(), "src"))) {
      const src = readFileSync(file, "utf8");
      for (const m of src.matchAll(re)) {
        const mins = Number(m[1] ?? m[2]);
        if (Number.isFinite(mins) && mins !== DEMO_MINUTES) {
          offenders.push(`${file.split("/src/")[1]}: "${m[0].replace(/\s+/g, " ").trim()}"`);
        }
      }
    }
    expect(
      offenders,
      `demo length disagrees with the ${DEMO_MINUTES}-minute Cal.com event:\n${offenders.join("\n")}`
    ).toEqual([]);
  });
});
