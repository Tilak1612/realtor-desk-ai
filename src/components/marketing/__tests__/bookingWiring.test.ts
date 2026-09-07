import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { CAL_EVENT_URL, CAL_LINK, CAL_ROUTE, CAL_NAMESPACE } from "@/config/booking";

/**
 * The booking funnel is wired across six files, and the ways it silently
 * breaks are all invisible at runtime:
 *
 *  - a CTA quietly points somewhere else, so a surface stops feeding the page
 *  - a CTA renders as <Link><Button/></Link>, which emits no analytics, so the
 *    click vanishes from the funnel while still working for the visitor
 *  - the CSP forgets cal.com, so the embed is blocked in production only --
 *    it works perfectly in dev, where no CSP header is served
 *
 * None of those fail a build or show up on screen. Hence a test.
 */

const read = (rel: string) => readFileSync(join(process.cwd(), rel), "utf8");

const SURFACES = [
  ["header + mobile menu", "src/components/rd/layout/MarketingHeader.tsx"],
  ["marketing footer", "src/components/rd/marketing/MarketingFooter.tsx"],
  ["legacy footer", "src/components/Footer.tsx"],
  ["homepage hero + closing CTA", "src/pages/rd/Home.tsx"],
  ["pricing", "src/pages/rd/Pricing.tsx"],
] as const;

describe("demo booking wiring", () => {
  it("routes every Book-a-Demo surface through the shared constant", () => {
    for (const [name, file] of SURFACES) {
      const src = read(file);
      expect(src, `${name} does not reference the booking route`).toContain("CAL_ROUTE");
      // A hardcoded "/demo" is not wrong for the visitor, but it drifts: the
      // route can then be changed in one place and missed in another.
      expect(src, `${name} still hardcodes "/demo"`).not.toMatch(/to="\/demo"/);
    }
  });

  it("emits an analytics event from every Book-a-Demo surface", () => {
    for (const [name, file] of SURFACES) {
      const src = read(file);
      const tracks = src.includes("CtaLink") || src.includes("trackEvent");
      expect(tracks, `${name} has a booking CTA that reports nothing`).toBe(true);
    }
  });

  it("does not reintroduce <Link><RDButton/></Link> on a booking CTA", () => {
    // That pattern is why the pricing CTA -- the click closest to revenue --
    // was the one nobody could attribute.
    for (const [name, file] of SURFACES) {
      const src = read(file).replace(/\{\/\*[\s\S]*?\*\/\}/g, "");
      const nested = /<Link[^>]*>\s*<RDButton/.test(src);
      expect(nested, `${name} nests a button inside an anchor`).toBe(false);
    }
  });

  it("allows cal.com in the production CSP", () => {
    // The embed is same-origin in dev and cross-origin in production, so a
    // missing directive here fails ONLY on the live site.
    const vercel = JSON.parse(read("vercel.json")) as {
      headers?: { headers: { key: string; value: string }[] }[];
    };
    const csp = vercel.headers
      ?.flatMap((h) => h.headers)
      .find((h) => h.key === "Content-Security-Policy")?.value;
    expect(csp, "no Content-Security-Policy header is configured").toBeTruthy();

    for (const directive of ["script-src", "frame-src", "connect-src"]) {
      const part = csp!.split(";").find((d) => d.trim().startsWith(directive));
      expect(part, `${directive} missing from the CSP`).toBeTruthy();
      expect(
        /cal\.com/.test(part!),
        `${directive} does not allow cal.com — the embed will be blocked in production only`
      ).toBe(true);
    }
  });

  it("keeps the fallback link and the embed pointing at the same event", () => {
    // The fallback exists for when the embed fails. If the two drift apart it
    // sends people to a different calendar than the one the page shows, which
    // is worse than no fallback.
    expect(CAL_EVENT_URL).toMatch(/^https:\/\/cal\.com\//);
    expect(CAL_LINK).toBe("team/brainfy-ai/realtordesk-demo");
    expect(CAL_EVENT_URL.endsWith(CAL_LINK)).toBe(true);
    expect(CAL_ROUTE).toBe("/demo");
    expect(CAL_NAMESPACE).toBeTruthy();
  });

  it("keeps the Supabase demo-request form on the booking page", () => {
    // /admin/demo-requests reads the rows this form writes. Replacing the page
    // with only a calendar would break a workflow that lives off this page.
    const demo = read("src/pages/Demo.tsx");
    expect(demo, "the demo request form was removed").toContain("onSubmit");
    expect(demo, "the calendar is not on the demo page").toContain("CalEmbed");
  });

  it("adds no API key or secret for the embed", () => {
    // The Cal embed is unauthenticated. A VITE_ variable here would imply a
    // secret that does not exist and give the page a way to break per-env.
    // Comments stripped first: the file explains that the URL is public and
    // NOT a secret, and scanning the prose flagged the word in that sentence.
    const booking = read("src/config/booking.ts")
      .replace(/\/\*[\s\S]*?\*\//g, "")
      .replace(/^\s*\/\/.*$/gm, "");
    expect(booking).not.toMatch(/import\.meta\.env/);
    expect(booking).not.toMatch(/API_KEY|SECRET|TOKEN/i);
  });
});
