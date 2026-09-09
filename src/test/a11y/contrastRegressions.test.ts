import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

/**
 * Source-level guards for contrast bugs that shipped and were invisible to the
 * automated sweep.
 *
 * These are cheap string checks, not a substitute for the rendered contrast
 * measurement in scripts/axe-local.mjs. They exist because each of these bugs
 * has a distinctive SOURCE signature, and catching the signature in CI is
 * faster and more reliable than re-deriving it from a browser every time.
 */

const read = (rel: string) => readFileSync(join(process.cwd(), rel), "utf8");

function walk(dir: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) out.push(...walk(full));
    else if (full.endsWith(".tsx")) out.push(full);
  }
  return out;
}

describe("contrast regressions", () => {
  it("does not pair a gradient with --secondary, which is a surface token", () => {
    // --secondary is `60 9% 94%` (#F1F1EE), a near-white SURFACE. It was a
    // saturated accent before the rd rebrand, and 20 CTA bands kept using it
    // as a gradient end-stop with white text on top. Measured live: the fade
    // ended at 1.13:1, so headings lost their last words and an outline
    // button -- white text, white border -- disappeared entirely.
    const offenders = walk(join(process.cwd(), "src"))
      .filter((f) => /from-primary\s+to-secondary/.test(readFileSync(f, "utf8")))
      .map((f) => f.split("/src/")[1]);
    expect(
      offenders,
      `gradient fading to a near-white surface token: ${offenders.join(", ")}`
    ).toEqual([]);
  });

  it("keeps the auth surfaces on the light theme they were migrated to", () => {
    // AuthLayout moved from a near-black shell to the light rd-* paper theme,
    // and two children were left behind carrying dark-theme classes. The
    // result was a headline at 1.05:1 and a billing line at 1.00:1 -- white
    // text on white -- on the only conversion form on the site.
    for (const file of [
      "src/components/auth/SignupAside.tsx",
      "src/components/auth/BillingDisclosure.tsx",
    ]) {
      const src = read(file).replace(/\{\/\*[\s\S]*?\*\/\}/g, "");
      // text-white is legitimate ON a dark surface; these components render on
      // #FAFAF7 paper, so any bare text-white here is the migration bug.
      const bare = src.match(/className="[^"]*\btext-white\b[^"]*"/g) ?? [];
      const onDark = bare.filter((c) => /bg-rd-navy|bg-rd-ink-9|bg-black/.test(c));
      expect(
        bare.length - onDark.length,
        `${file} has text-white on the light auth surface`
      ).toBe(0);

      // 4% white over paper renders no visible card at all.
      expect(src, `${file} still uses a dark-theme translucent fill`).not.toMatch(
        /bg-white\/\[0\.0\d\]/
      );
    }
  });

  it("does not use pastel-300 colours for meaning on light surfaces", () => {
    // emerald-300 on cream measured 1.46:1; red-300 for validation errors on
    // white measured 1.9:1 -- and that red is the aria-live slot, so someone
    // mistyping an email saw a pale pink line most people never register.
    // Login.tsx is in this list because the first pass covered only Signup and
    // missed it: Login's required-field asterisks were text-red-400, which is
    // 2.77:1 on white. A guard that checks one of two auth forms is a guard
    // with a hole in it.
    // Comments stripped. The fix for the red-200 case documents the class it
    // replaced, and scanning the explanation reported the fix as the bug --
    // the same false positive the harness guard below already works around.
    const strip = (t: string) =>
      t.replace(/\{\/\*[\s\S]*?\*\/\}/g, "").replace(/^\s*\/\/.*$/gm, "");
    const src = strip(
      read("src/pages/Signup.tsx") +
        read("src/pages/Login.tsx") +
        read("src/components/auth/SignupAside.tsx")
    );
    // text-red-200 was added after it shipped and was missed: the guard listed
    // 300 and 400 but not 200, and the signup submit-error alert -- the
    // role="alert" a user sees when signup fails -- was text-red-200 on
    // bg-red-500/10, measuring 1.27:1 over paper. A guard that enumerates
    // shades will always have the hole of whichever shade nobody thought of,
    // so the translucent dark-theme FILL is checked separately below.
    for (const cls of [
      "text-red-100",
      "text-red-200",
      "text-red-300",
      "text-red-400",
      "text-emerald-300",
      "text-green-300",
    ]) {
      expect(src, `${cls} is not legible on a light surface`).not.toContain(cls);
    }
  });

  it("does not use dark-theme translucent status fills on the light auth pages", () => {
    // bg-red-500/10 and friends are dark-theme surfaces: 10% of a saturated
    // colour over near-black gives a readable tinted panel, but over #FAFAF7
    // paper it is almost exactly the paper colour. Whatever text sits on it
    // then needs to be dark, and the pairing that shipped was pale-on-pale.
    // This catches the SURFACE regardless of which text shade accompanies it.
    for (const file of [
      "src/pages/Signup.tsx",
      "src/pages/Login.tsx",
      "src/pages/ForgotPassword.tsx",
      "src/pages/ResetPassword.tsx",
    ]) {
      const src = read(file).replace(/\{\/\*[\s\S]*?\*\/\}/g, "").replace(/^\s*\/\/.*$/gm, "");
      const bad = src.match(/bg-(red|green|emerald|amber|yellow)-\d00\/(5|10|15|20)\b/g) ?? [];
      expect(bad, `${file} uses a dark-theme translucent status fill: ${bad.join(", ")}`).toEqual(
        []
      );
    }
  });

  it("does not use the ghost button variant on a dark band", () => {
    // ghost is documented in Button.tsx as "transparent, slate text
    // (nav / toolbar)" -- a LIGHT-surface variant. On the near-black pipeline
    // band it rendered at 1.37:1. `light` is the variant defined for that job.
    const home = read("src/pages/rd/Home.tsx");
    const darkSection = home.includes("bg-rd-ink-900");
    if (!darkSection) return;
    // The CTA inside the dark band must not be ghost.
    const band = home.slice(home.indexOf("bg-rd-ink-900"));
    const nextSection = band.indexOf("bg-white");
    const scope = nextSection > 0 ? band.slice(0, nextSection) : band;
    expect(
      /variant="ghost"/.test(scope),
      "a ghost-variant CTA sits inside the dark pipeline band"
    ).toBe(false);
  });

  it("surfaces contrast results axe could not decide", () => {
    // The reason all of the above shipped: the harness ran axe with
    // resultTypes:["violations"], which throws away `incomplete` -- and axe
    // puts "background could not be determined" there. /signup had 24 such
    // nodes and ZERO violations while carrying white-on-white text.
    // Comments stripped: the file explains what resultTypes:["violations"]
    // used to discard, and scanning the explanation flagged the fix itself.
    const harness = read("scripts/axe-local.mjs")
      .replace(/\/\*[\s\S]*?\*\//g, "")
      .replace(/^\s*\/\/.*$/gm, "");
    expect(
      harness,
      "axe-local.mjs is discarding everything axe could not decide"
    ).not.toMatch(/resultTypes:\s*\[\s*"violations"\s*\]/);
    expect(harness, "no direct contrast computation for undecided nodes").toContain(
      "computed-contrast"
    );
  });
});
