import { describe, it, expect } from "vitest";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const ASSETS = join(process.cwd(), "src/assets");

/**
 * Three AI-generated "screenshots" of the product shipped in this repo. One
 * was live on /how-it-works as the priority LCP image of a section headed
 * "Dashboard Preview", with alt text asserting it was "The Realtor Desk
 * dashboard, showing the lead pipeline and Desk AI activity feed".
 *
 * It was not. It showed garbled interface text ("Masnual by eda new
 * peraslidng"), a fabricated agent named Sarah Johnson -- the same invented
 * persona deleted from the testimonials in PR #171 -- invented figures, and
 * purple/blue chrome that is not this product's navy and terracotta. The
 * other two were unreferenced and included invented human faces presented as
 * users.
 *
 * A generated picture of software, captioned as the software, is the image
 * equivalent of a fabricated testimonial. The brief prohibits it explicitly
 * and so does CLAUDE.md.
 *
 * If a real screenshot is captured to one of these names later, delete the
 * entry here -- do not weaken the check.
 */
const REMOVED_FABRICATIONS = [
  // Generated pictures of the product, captioned as the product.
  "hero-dashboard",
  "hero-dashboard-ai",
  "dashboard-unified",
  // Generated portraits of the three invented testimonial personas whose
  // quotes were deleted in PR #171. The quotes went; the faces stayed, so
  // anyone rebuilding a testimonials section would have attached a fake face
  // to a fake quote and shipped both.
  "realtor-sarah",
  "realtor-marc",
  "realtor-jennifer",
  // Generated headshots used as "agent profiles".
  "agent-profile-broker",
  "agent-profile-female",
  "agent-profile-team",
  // A generated monitor legibly rendering "KvCORE" -- a real competitor's
  // trademark -- above invented charts, on a card for an article comparing
  // against them. Depicting a NAMED competitor's product with fabricated
  // content is a different order of risk from generic stock imagery.
  "blog-vs-kvcore",
  // The generator read "BoomTown" literally: a fiery explosion bursting out
  // of a monitor, on a card for an article about that named competitor.
  "blog-boomtown-alternative",
  // A humanoid ROBOT on a laptop over a fake chat interface -- a dated and
  // inaccurate metaphor for a text and voice assistant. Replaced with an
  // on-brand SVG at src/assets/brand/.
  "blog-ai-chatbot",
];

describe("no fabricated product imagery", () => {
  it.each(REMOVED_FABRICATIONS)("%s is not back in src/assets", (stem) => {
    const found = [".jpg", ".jpeg", ".png", ".avif", ".webp"]
      .map((ext) => `${stem}${ext}`)
      .filter((f) => existsSync(join(ASSETS, f)));
    expect(
      found,
      `${found.join(", ")} — these were AI-generated fakes of the product. ` +
        `Real screenshots come from npm run capture:screenshots.`
    ).toEqual([]);
  });

  it("no page carries an invented customer testimonial", () => {
    // Fabricated testimonials have been found in FIVE separate places in this
    // codebase now: the i18n personas (PR #171), their portraits (#188), the
    // "Canadian Success Stories" section, a "Real Agent Experiences" block
    // citing G2 with star ratings, and twelve loose quotes across five more
    // pages. So this is a standing check rather than another one-off removal.
    //
    // The signature is precise on purpose: an ITALIC paragraph containing a
    // long quoted string. That is how every one of them was rendered, and it
    // does not match section headings, feature copy or pricing, which an
    // earlier broader heuristic did -- it flagged sixteen files, all false
    // positives, and a guard that cries wolf gets deleted.
    const ALLOWED = [
      // Script and example dialogue, not customer claims. These are the
      // product demonstrating what it says, not someone vouching for it.
      "Hi! Looking at properties in Calgary",
      "This call may be recorded for quality",
      "The first agent to respond wins",
    ];

    const walkPages = (dir: string): string[] => {
      const out: string[] = [];
      for (const e of readdirSync(dir)) {
        const full = join(dir, e);
        if (statSync(full).isDirectory()) out.push(...walkPages(full));
        else if (full.endsWith(".tsx")) out.push(full);
      }
      return out;
    };

    const offenders: string[] = [];
    for (const file of walkPages(join(process.cwd(), "src/pages"))) {
      const code = readFileSync(file, "utf8").replace(/\{\/\*[\s\S]*?\*\/\}/g, "");
      for (const m of code.matchAll(/italic[^>]*>\s*\n?\s*"([^"]{40,})"/g)) {
        const body = m[1];
        if (ALLOWED.some((a) => body.includes(a))) continue;
        offenders.push(`${file.split("/src/")[1]}: "${body.slice(0, 50)}…"`);
      }
    }

    expect(
      offenders,
      `italic quoted claims that read as testimonials:\n  ${offenders.join("\n  ")}`
    ).toEqual([]);
  });

  it("no page rates a product out of five stars", () => {
    // Star scorecards rated NAMED competitors two or three while awarding this
    // product five, with no methodology and no disclosure that the vendor was
    // scoring its own rival. The brief prohibits generating ratings.
    //
    // A single decorative star in a phrase like "Top Pick" is marketing voice,
    // not a rating, so the pattern requires two or more.
    const walkPages = (dir: string): string[] => {
      const out: string[] = [];
      for (const e of readdirSync(dir)) {
        const full = join(dir, e);
        if (statSync(full).isDirectory()) out.push(...walkPages(full));
        else if (full.endsWith(".tsx")) out.push(full);
      }
      return out;
    };
    const offenders: string[] = [];
    for (const file of walkPages(join(process.cwd(), "src/pages"))) {
      const code = readFileSync(file, "utf8").replace(/\{\/\*[\s\S]*?\*\/\}/g, "");
      // The emoji is only one of the two spellings. /blog/best-crm-canada-2025
      // rendered its ratings as lucide <Star> components -- ten of them, from
      // array literals, each with a trailing grey star completing an
      // out-of-five -- and sailed past a check that only looked for the
      // character. That page scored eight NAMED competitors between 63 and 82
      // out of 100 and placed itself first at 94, with no methodology and no
      // disclosure that the ranker was a rival.
      //
      // An array literal mapped to <Star> is unambiguously a rating: nobody
      // writes [1,2,3,4].map for decoration. A lone <Star> beside a heading
      // still passes, which keeps this from flagging marketing voice.
      const emojiStars = /\u2b50{2,}/.test(code);
      const mappedStars = /\[[\s\d,]+\]\.map\([^)]*<Star/.test(code);
      const outOfHundred = /\b\d{1,3}\/100\b/.test(code);
      if (emojiStars || mappedStars || outOfHundred) {
        offenders.push(file.split("/src/")[1]);
      }
    }
    expect(
      offenders,
      `pages rendering multi-star ratings: ${offenders.join(", ")}`
    ).toEqual([]);
  });

  it("no image asserts customer usage it cannot support", () => {
    // An image of invented people captioned "professionals USING Realtor Desk
    // AI" is social proof, not decoration. Generic illustrative imagery is
    // fine; a caption that turns it into a customer claim is not.
    const src = readdirSync(join(process.cwd(), "src/pages"))
      .filter((f) => f.endsWith(".tsx"))
      .map((f) => readFileSync(join(process.cwd(), "src/pages", f), "utf8"))
      .join("\n");
    const claims = src.match(/alt="[^"]*\b(using|utilisant)\s+Realtor\s*Desk[^"]*"/gi);
    expect(claims, `alt text asserting customer usage: ${claims?.join(" | ")}`).toBeNull();
  });

  it("brand SVGs carry no fabricated interface text", () => {
    // The whole point of replacing generated raster headers with authored SVG
    // is that we control every glyph. If a <text> element inside one starts
    // carrying invented names, figures or interface strings, it has become
    // the thing it replaced.
    const dir = join(process.cwd(), "src/assets/brand");
    if (!existsSync(dir)) return;
    for (const file of readdirSync(dir).filter((f) => f.endsWith(".svg"))) {
      const svg = readFileSync(join(dir, file), "utf8");
      const texts = [...svg.matchAll(/<text[^>]*>([^<]*)<\/text>/g)].map((m) => m[1].trim());
      for (const t of texts) {
        // A calendar year in a title is not a metric. "Choosing a CRM in 2025"
        // tripped the first version of this rule, and a guard that fires on
        // legitimate content is a guard someone deletes.
        const withoutYears = t.replace(/\b(19|20)\d{2}\b/g, "");

        // What must never appear: currency, percentages, or any other
        // multi-digit figure posing as a measurement.
        expect(
          withoutYears,
          `${file}: "${t}" contains what looks like a fabricated figure`
        ).not.toMatch(/[$€£]\s?\d|\d+\s?%|\b\d{2,}\b/);
      }
    }
  });

  it("no asset is named as a dashboard screenshot without coming from the capture script", () => {
    // The capture script writes to src/assets/product/. Anything claiming to
    // be a dashboard elsewhere in src/assets did not come from the running
    // application.
    const suspicious = readdirSync(ASSETS)
      .filter((f) => /^(hero-)?dashboard/i.test(f));
    expect(
      suspicious,
      `${suspicious.join(", ")} — product screenshots belong in src/assets/product/, written by scripts/capture-screenshots.mjs`
    ).toEqual([]);
  });
});
