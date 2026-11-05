import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, resolve, relative } from "node:path";

// The site must not say there is a mobile app until one can be installed.
//
// THE RULE, as of 2026-10-13. Native projects now exist in this repo: `ios/`
// and `android/` are Capacitor wrappers around this same web app
// (capacitor.config.ts, appId com.brainfyai.realtordesk, bundle built by
// `npm run build:mobile`). That is a build target, not a product a customer
// can get. Until the App Store and Google Play listings are actually live,
// every claim below is still false and still banned: no store links, no
// "available on iOS", no "mobile app included", no iOS/Android in structured
// data or in our column of a comparison table. The roadmap FAQ in
// src/i18n/config.ts still says a native app is not planned, and the public
// copy stays as it is until someone changes it on purpose.
//
// What changed in this file: it used to assert that `ios/` and `android/` did
// not exist, as a tripwire ("if an app ever ships, this fails and whoever
// ships it updates the claims deliberately"). The tripwire has done its job
// and that one assertion is gone, because the directories are about to exist
// long before the listing does. Nothing else was loosened. The copy assertions
// are what protect the site, and they do not care whether a project directory
// is present; they pass or fail on what the pages say.
//
// When the listings ARE live, the change is deliberate and made here: allow
// the two store URLs, update "operatingSystem", and revise the roadmap FAQ in
// the same commit, so the claims and the product move together.
//
// HISTORY, checked 2026-09-29, and the reason this file exists. With no app at
// all, five places claimed one -- including
// `"operatingSystem": "Web, iOS, Android"` in the Organization/SoftwareApplication
// JSON-LD emitted on EVERY page, and "Mobile app included" on /billing, shown
// to paying customers. A sixth block in the i18n bundle advertised App Store
// downloads, an offline mode and voice commands; nothing rendered it, but it
// shipped in the JS and was one import away from looking true.
//
// The scan covers all of src/, which includes the app-only code under
// src/lib/native, src/components/native and src/i18n/native*.ts. That is
// intended: strings written for the app are held to the same wording rules.

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
    // The live copy is the static block in index.html. A second copy used to
    // sit in src/lib/structuredData.ts and had drifted — index.html said "Web",
    // structuredData.ts said "Web, iOS, Android". That export was unused and was
    // deleted on 2026-10-11; if a SoftwareApplication block is ever added back
    // there, it is held to the same rule.
    const html = readFileSync(join(ROOT, "index.html"), "utf8");
    const live = html.match(/"operatingSystem":\s*"([^"]+)"/);
    expect(live, "operatingSystem missing from index.html").toBeTruthy();
    expect(live?.[1], "index.html declares a native platform").not.toMatch(/iOS|Android/);

    const lib = readFileSync(join(ROOT, "src/lib/structuredData.ts"), "utf8");
    for (const m of lib.matchAll(/"operatingSystem":\s*"([^"]+)"/g)) {
      expect(m[1], "src/lib/structuredData.ts declares a native platform").not.toMatch(/iOS|Android/);
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
