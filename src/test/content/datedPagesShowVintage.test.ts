import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";

// A page whose title carries a year must say when it was written.
//
// Four pages had a year in the title — "Canada Housing Market Forecast
// 2025-2026", "Edmonton Real Estate Market 2025", "Toronto vs Vancouver Real
// Estate 2025", "First-Time Home Buyer Guide for Canada 2025" — and none said
// when. They were authored in January 2026, so by late 2026 a reader met
// market commentary of unknown vintage presented as current.
//
// The fix was to date them, not to bump the year in the title. Relabelling
// makes stale analysis look fresh, which is worse than looking old.
//
// Checked against dist/ so it tests what a crawler actually receives: the
// disclosure first shipped inside a lazy chunk, visible in the browser and
// absent from every prerendered page, which is the reader most likely to
// mistake old analysis for current.

const DIST = path.resolve(__dirname, "../../../dist");
const built = fs.existsSync(DIST);

// Two halves, because they live in different places.
//
// The month renders from an interpolated {label}, and the prerenderer skips a
// JSX element containing an expression — so the crawlable half is the standing
// sentence, which is also the substantive honesty signal. The date itself is
// checked at source, where it is a literal.
const CRAWLABLE_DISCLOSURE = /this page has not been revised since/;
const ISO_DATE = /published="(\d{4})-(\d{2})-(\d{2})"/;

describe.skipIf(!built)("dated editorial pages", () => {
  const collect = (dir: string, out: string[] = []): string[] => {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) collect(full, out);
      else if (e.name === "index.html") out.push(full);
    }
    return out;
  };

  it("discloses when a page with a year in its title was written", () => {
    const offenders: string[] = [];

    for (const file of collect(DIST)) {
      const html = fs.readFileSync(file, "utf8");
      const title = html.match(/<title>([^<]*)<\/title>/)?.[1] ?? "";
      // A year in the TITLE is the signal. A year in the URL slug is a
      // published address and must not be changed, so it is not the test.
      if (!/\b20\d{2}\b/.test(title)) continue;

      const route = "/" + path.relative(DIST, path.dirname(file));
      if (!CRAWLABLE_DISCLOSURE.test(html)) {
        offenders.push(`${route} — title says "${title.trim()}" but the page carries no vintage disclosure a crawler can read`);
      }
    }

    expect(offenders.join("\n")).toBe("");
  });
});

describe("ContentVintage callers", () => {
  it("passes a real, past ISO date", () => {
    const SRC = path.resolve(__dirname, "../../");
    const walk = (dir: string, out: string[] = []): string[] => {
      for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, e.name);
        if (e.isDirectory()) {
          if (e.name === "__tests__" || e.name === "test") continue;
          walk(full, out);
        } else if (/\.tsx$/.test(e.name)) out.push(full);
      }
      return out;
    };

    const offenders: string[] = [];
    for (const file of walk(SRC)) {
      const body = fs.readFileSync(file, "utf8");
      if (!/<ContentVintage/.test(body)) continue;
      const rel = path.relative(SRC, file);
      const m = body.match(ISO_DATE);
      if (!m) {
        offenders.push(`${rel}: <ContentVintage> with no published="YYYY-MM-DD"`);
        continue;
      }
      const [, y, mo, d] = m;
      const when = Date.parse(`${y}-${mo}-${d}T00:00:00Z`);
      if (Number.isNaN(when)) offenders.push(`${rel}: unparseable date ${m[1]}`);
      // A future date would mean someone typed a placeholder.
      else if (when > Date.now()) offenders.push(`${rel}: published date is in the future`);
    }
    expect(offenders.join("\n")).toBe("");
  });
});
