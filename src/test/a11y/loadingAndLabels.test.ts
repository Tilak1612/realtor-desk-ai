import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

/**
 * Two patterns that were everywhere, and are silent failures in both cases.
 *
 * 1. THE UNANNOUNCED SPINNER. 33 of them across 23 files, all shaped like
 *    `<div className="animate-spin rounded-full h-8 w-8 border-b-2" />`. No
 *    text, no role, nothing in the accessibility tree. Worse under
 *    prefers-reduced-motion, where index.css sets animation-duration to
 *    0.01ms globally: the ring stops, and a border-b-only ring becomes a
 *    stationary quarter-line that reads as a rendering artefact.
 *
 * 2. THE PLACEHOLDER-ONLY INPUT. A placeholder is not a label -- it vanishes
 *    on first keystroke, is skipped by some screen readers, and fails 2.4.6.
 *    The worst instance was the two-factor code field.
 *
 * Both checks skip src/components/ui: those are vendored shadcn primitives,
 * and a caller supplies the label. src/components/rd/Spinner.tsx is the
 * sanctioned implementation and is exempt from the first rule.
 */

function walk(dir: string): string[] {
  const out: string[] = [];
  for (const e of readdirSync(dir)) {
    const full = join(dir, e);
    if (statSync(full).isDirectory()) out.push(...walk(full));
    else if (/\.tsx$/.test(full)) out.push(full);
  }
  return out;
}

const FILES = walk(join(process.cwd(), "src")).filter(
  (f) =>
    !f.includes("__tests__") &&
    !f.includes("/components/ui/") &&
    // Dead code: zero imports anywhere. Excluded so it does not mask real
    // findings; delete the file and this line goes with it.
    !f.endsWith("ChatWidget.tsx")
);

const rel = (f: string) => f.split("/src/")[1];

describe("loading states and labels", () => {
  it("routes every spinner through the announced Spinner component", () => {
    const offenders: string[] = [];
    for (const f of FILES) {
      if (f.endsWith("/rd/Spinner.tsx")) continue;
      const src = readFileSync(f, "utf8");
      for (const m of src.matchAll(/animate-spin/g)) {
        const window_ = src.slice(Math.max(0, m.index! - 420), m.index! + 420);
        // aria-hidden counts: a decorative icon inside a button whose label
        // changes ("Sign in" -> "Signing in...") is already announced by the
        // button. Marking the icon hidden is the correct handling there, not a
        // gap -- flagging it would push callers toward announcing twice.
        const announced =
          /role="status"|aria-label|aria-live|aria-hidden|sr-only|<Spinner\b/.test(window_);
        if (!announced) {
          offenders.push(`${rel(f)}:${src.slice(0, m.index).split("\n").length}`);
        }
      }
    }
    expect(
      offenders,
      `spinner with nothing in the accessibility tree:\n  ${offenders.join("\n  ")}`
    ).toEqual([]);
  });

  it("never labels an input with only a placeholder", () => {
    const offenders: string[] = [];
    for (const f of FILES) {
      const src = readFileSync(f, "utf8");
      // Raw <input> counts too. The /app/inbox search was a lowercase <input>
      // with only a placeholder and slipped straight through a scan that only
      // looked for the <Input> primitive.
      //
      // Arrow functions are neutralised first. `onChange={(e) => ...}` contains
      // a ">", so an [^>] scan stops at the arrow and never sees attributes
      // that follow it -- which is exactly how the Inbox search read as
      // unlabelled after it had been labelled.
      const scan = src.replace(/=>/g, "@@");
      for (const m of scan.matchAll(/<[Ii]nput\b([^>]*?)\/?>/gs)) {
        const attrs = m[1];
        // A primitive that spreads caller props cannot know its own label; the
        // call site supplies it. Same reasoning as the components/ui exclusion.
        if (/\{\.\.\.rest\}|\{\.\.\.props\}/.test(attrs)) continue;
        if (!/placeholder/.test(attrs)) continue;
        if (/\bid=|aria-label|aria-labelledby/.test(attrs)) continue;
        // shadcn <FormControl> injects id and aria-describedby through context,
        // so an Input inside one is labelled by its sibling <FormLabel>.
        if (scan.slice(Math.max(0, m.index! - 260), m.index!).includes("<FormControl>")) continue;
        offenders.push(`${rel(f)}:${scan.slice(0, m.index).split("\n").length}`);
      }
    }
    expect(
      offenders,
      `placeholder used as the only label:\n  ${offenders.join("\n  ")}`
    ).toEqual([]);
  });
});
