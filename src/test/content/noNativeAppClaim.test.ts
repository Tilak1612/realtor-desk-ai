import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, resolve, relative } from "node:path";

// There is no native mobile app, and the site must not imply one.
//
// EVIDENCE, checked 2026-09-29: no `ios/` or `android/` project directory in
// the repo; no App Store or Google Play URL anywhere in src/ or public/;
// capacitor.config.ts still carries the default `app.lovable.*` appId pointing
// at a scaffold URL; and the roadmap FAQ in src/i18n/config.ts states in both
// languages that a native iOS/Android app is not planned for 2026.
//
// Despite that, five places claimed one — including
// `"operatingSystem": "Web, iOS, Android"` in the Organization/SoftwareApplication
// JSON-LD emitted on EVERY page, and "Mobile app included" on /billing, shown
// to paying customers. A sixth block in the i18n bundle advertised App Store
// downloads, an offline mode and voice commands; nothing rendered it, but it
// shipped in the JS and was one import away from looking true.
//
// The first assertion below is the one that matters: if a native app ever does
// ship, this test starts failing and whoever ships it updates the claims
// deliberately instead of the claims having quietly run ahead of the product.

const ROOT = resolve(__dirname, "../../../");
const SRC = join(ROOT, "src");

const walk = (dir: string, out: string[] = []): string[] => {
  for (const e of readdirSync(dir)) {
    const full = join(dir, e);
    if (statSync(full).isDirectory()) {
      if (e === "__tests__" || e === "test" || e === "node_modules") continue;
      walk(full, out);
    } else if (/\.(ts|tsx)$/.test(full)) {
      out.push(full);
    }
  }
  return out;
};

const stripComments = (s: string) =>
  s
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, "")
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/^\s*\/\/.*$/gm, "");

describe("native mobile app claims", () => {
  it("still has no native app project, so the claims below must stay false", () => {
    expect(existsSync(join(ROOT, "ios")), "an ios/ project appeared").toBe(false);
    expect(existsSync(join(ROOT, "android")), "an android/ project appeared").toBe(false);
  });

  it("links to no app store", () => {
    const offenders = walk(SRC)
      .filter((f) => /apps\.apple\.com|play\.google\.com\/store/.test(stripComments(readFileSync(f, "utf8"))))
      .map((f) => relative(ROOT, f));
    expect(offenders, `app store links with no app behind them:\n${offenders.join("\n")}`).toEqual([]);
  });

  it("does not advertise a download, an offline mode, or voice commands", () => {
    const banned: [RegExp, string][] = [
      [/Download from App Store|Téléchargez depuis l'App Store/i, "app store download"],
      [/Available on iOS|Disponible sur iOS/i, "availability on iOS"],
      [/\boffline mode\b|mode hors ligne/i, "offline mode — data is not cached for offline use"],
      [/voice commands?|commandes? vocales?/i, "voice commands — no such feature"],
    ];
    // A disclaimer is the opposite of a claim. /blog/open-house-digital-sign-in
    // lists "No offline mode" as a limitation of paper-replacement apps, and a
    // guard that cannot tell that from advertising one would push people to
    // delete honest caveats to get green.
    const NEGATED = /\b(no|not|without|never|lacks?|aucun|aucune|pas de|sans)\s+$/i;

    const offenders: string[] = [];
    for (const f of walk(SRC)) {
      const body = stripComments(readFileSync(f, "utf8"));
      for (const [re, what] of banned) {
        const g = new RegExp(re.source, re.flags.includes("g") ? re.flags : re.flags + "g");
        for (const m of body.matchAll(g)) {
          const before = body.slice(Math.max(0, m.index - 24), m.index);
          if (NEGATED.test(before)) continue;
          offenders.push(`${relative(ROOT, f)}: ${what}`);
        }
      }
    }
    expect(offenders, `claims with no product behind them:\n${offenders.join("\n")}`).toEqual([]);
  });

  it("declares only the web in structured data", () => {
    // This one is machine-readable and sits on every page, so a wrong value
    // here is the version search engines and AI crawlers actually believe.
    // TWO copies of this schema exist: src/lib/structuredData.ts and a static
    // block in index.html. They had already drifted — index.html said "Web",
    // structuredData.ts said "Web, iOS, Android" — so check both, or fixing one
    // leaves the other shipping the wrong answer.
    for (const file of ["src/lib/structuredData.ts", "index.html"]) {
      const body = readFileSync(join(ROOT, file), "utf8");
      const m = body.match(/"operatingSystem":\s*"([^"]+)"/);
      expect(m, `operatingSystem missing from ${file}`).toBeTruthy();
      expect(m?.[1], `${file} declares a native platform`).not.toMatch(/iOS|Android/);
    }
  });

  it("keeps comparison tables from ticking a native app for us", () => {
    const offenders: string[] = [];
    for (const f of walk(SRC)) {
      const body = stripComments(readFileSync(f, "utf8"));
      // `rdai:` / `us:` is the "our column" key used across the comparison
      // tables. A checkmark plus iOS/Android in our own cell is the claim.
      for (const m of body.matchAll(/\b(rdai|us)\s*:\s*"([^"]*)"/g)) {
        if (/iOS|Android/i.test(m[2])) offenders.push(`${relative(ROOT, f)}: ${m[0]}`);
      }
    }
    expect(offenders, `our column claims a native app:\n${offenders.join("\n")}`).toEqual([]);
  });
});
