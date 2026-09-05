import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const raw = readFileSync(join(process.cwd(), "src/index.css"), "utf8");

/**
 * Comments are stripped before scanning. Several of the rules below are
 * documented in prose that necessarily quotes the exact mistake it warns
 * against -- without this, the guard reports its own explanation as a
 * violation, which is how the first version of this file failed.
 */
const css = raw.replace(/\/\*[\s\S]*?\*\//g, "");

/**
 * These assert the CSS contract, not the rendered result: jsdom has no layout
 * or paint, so a computed-style check here would prove nothing.
 *
 * They exist because each rule below has a silent failure mode. A dropped
 * declaration does not error, does not fail typecheck and does not fail the
 * build -- the effect simply never happens, and nobody notices until someone
 * looks closely at the live site.
 */
/**
 * index.css contains more than one reduced-motion block. Splitting on the
 * marker and joining everything after the first sweeps in the ordinary rules
 * that sit between blocks -- so the first `.rd-card-lift:hover` found was the
 * NORMAL one, with its translate3d intact, and the guard reported a failure
 * that did not exist. Extract each block by matching braces instead.
 */
function reducedMotionBlocks(): string {
  const marker = "@media (prefers-reduced-motion: reduce)";
  let out = "";
  let from = 0;
  for (;;) {
    const start = css.indexOf(marker, from);
    if (start === -1) break;
    const open = css.indexOf("{", start);
    let depth = 0;
    let i = open;
    for (; i < css.length; i++) {
      if (css[i] === "{") depth++;
      else if (css[i] === "}") {
        depth--;
        if (depth === 0) break;
      }
    }
    out += css.slice(open + 1, i) + "\n";
    from = i + 1;
  }
  return out;
}

describe("motion and hover CSS contract", () => {
  it("uses the hex rd-* tokens directly, never wrapped in hsl()", () => {
    // The rd-* tokens are hex; the legacy shadcn --* ones are HSL triplets.
    // hsl(var(--rd-terra-300)) yields hsl(#F2C8B9), which is invalid and is
    // dropped without warning. This mistake was made and caught in review.
    const bad = css.match(/hsl\(\s*var\(\s*--rd-[a-z0-9-]+/gi);
    expect(bad, `hsl() wrapping a hex rd-* token: ${bad?.join(", ")}`).toBeNull();
  });

  it("animates only compositor-friendly properties", () => {
    // width/height/top/left in a transition force layout on every frame and
    // are what make card grids stutter on a mid-range phone.
    const blocks = css.match(/transition:[^;]+;/g) ?? [];
    const offenders = blocks.filter((b) =>
      /\b(width|height|top|left|right|bottom|margin|padding)\b/.test(b)
    );
    expect(offenders, `layout-triggering transitions: ${offenders.join(" | ")}`).toEqual([]);
  });

  it("collapses movement under prefers-reduced-motion", () => {
    const reduced = reducedMotionBlocks();
    expect(reduced).toMatch(/\.rd-reveal-hidden|\.rd-reveal-shown/);
    expect(reduced).toMatch(/\.rd-card-lift/);
  });

  it("keeps the hover colour change when motion is reduced", () => {
    // Dropping transform AND colour would leave a keyboard user with no
    // feedback at all. Only the movement should go.
    const reduced = reducedMotionBlocks();
    const liftBlock = reduced.match(/\.rd-card-lift[^{]*\{[^}]*}/)?.[0] ?? "";

    // The resting offset is LAYOUT, not motion -- the featured pricing card
    // sits at -0.5rem whether or not the reader wants animation. What must go
    // is the 2px hover delta, so the transform under reduced motion is exactly
    // the base with no calc() subtracting from it.
    expect(liftBlock).toMatch(/transform:\s*translate3d\(0,\s*var\(--rd-lift-base\),\s*0\)/);
    expect(liftBlock).not.toMatch(/calc\(/);

    // Colour must survive: it is the only feedback a keyboard user gets once
    // the movement is gone.
    expect(liftBlock).not.toMatch(/border-color|background-color/);
  });

  it("keeps @import above the @tailwind directives", () => {
    // CSS requires @import to precede every other statement. When it sat below
    // the @tailwind directives, vite warned on every build and silently
    // dropped ALL 62 --rd-* custom properties from the production bundle.
    //
    // Nothing looked broken, because tailwind.config.ts maps the rd-* colour
    // names to literal hex -- so `bg-rd-navy-800` compiles to rgb() and never
    // reads a variable. Only `var(--rd-*)` consumers failed: the lead-score
    // colours, the sparkline stroke, and 21 other inline styles were
    // resolving to nothing in production for as long as this file was ordered
    // that way.
    // Scanned on the comment-stripped copy: the explanation above quotes both
    // directive names, and on `raw` the comment's "@tailwind" appears before
    // the real @import statement, so the guard failed on a correct file.
    const importAt = css.indexOf("@import");
    const tailwindAt = css.indexOf("@tailwind");
    expect(importAt).toBeGreaterThan(-1);
    expect(tailwindAt).toBeGreaterThan(-1);
    expect(
      importAt,
      "@import must come before @tailwind or the token file is dropped from the bundle"
    ).toBeLessThan(tailwindAt);
  });

  it("gives keyboard users the same affordance as the mouse", () => {
    expect(css).toMatch(/\.rd-card-lift:focus-within/);
  });
});
