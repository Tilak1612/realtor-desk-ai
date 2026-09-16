import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * robots.txt is easy to write and easy to get silently, totally wrong.
 *
 * The version live before 2026-09-16 had three independent defects, each of
 * which alone was enough to void the entire block list:
 *
 *   1. A BLANK LINE after "Crawl-delay: 1" ended the "*" group, so every
 *      Disallow beneath it belonged to no user-agent at all.
 *   2. A blanket "Allow: /" sat above the Disallow lines. Google resolves by
 *      longest match so Disallow: /app would have won, but a first-match-wins
 *      parser takes the Allow and cancels the list.
 *   3. Named groups for Googlebot, Bingbot, GPTBot, ClaudeBot,
 *      Google-Extended and CCBot each contained only "Allow: /". A crawler
 *      obeys exactly one group -- the most specific match -- so those six
 *      were exempt from the block list by construction.
 *
 * Net effect: /app, /admin, /billing and /settings were crawlable by every
 * crawler that mattered. None of that is visible by reading the file; it only
 * shows up when something parses it. So this parses it.
 */

const ROOT = join(__dirname, "..", "..", "..");
const robots = readFileSync(join(ROOT, "public/robots.txt"), "utf8");
const sitemap = readFileSync(join(ROOT, "public/sitemap.xml"), "utf8");

/** Minimal robots.txt evaluator using first-match-wins, the stricter reading. */
function canFetch(agent: string, path: string): boolean {
  const groups: { agents: string[]; rules: [string, string][] }[] = [];
  let current: (typeof groups)[number] | null = null;
  let readingAgents = false;

  for (const raw of robots.split("\n")) {
    // A COMMENT is not a blank line. Strip-then-test collapses "# note" to ""
    // and would end the group at every comment -- which is how this checker
    // first "found" a defect that was not there.
    if (!raw.trim()) {
      current = null; // a genuinely blank line ends the group
      readingAgents = false;
      continue;
    }
    const line = raw.replace(/#.*$/, "").trim();
    if (!line) continue; // comment-only line: ignored, group continues
    const [k, ...rest] = line.split(":");
    const key = k.trim().toLowerCase();
    const value = rest.join(":").trim();
    if (key === "user-agent") {
      if (!current || !readingAgents) {
        current = { agents: [], rules: [] };
        groups.push(current);
        readingAgents = true;
      }
      current.agents.push(value.toLowerCase());
    } else if (current && (key === "allow" || key === "disallow")) {
      readingAgents = false;
      current.rules.push([key, value]);
    }
  }

  const lower = agent.toLowerCase();
  const exact = groups.find((g) => g.agents.some((a) => a !== "*" && lower.startsWith(a)));
  const group = exact ?? groups.find((g) => g.agents.includes("*"));
  if (!group) return true;

  for (const [kind, value] of group.rules) {
    if (value && path.startsWith(value)) return kind === "allow";
  }
  return true;
}

const PRIVATE = [
  "/app", "/app/leads", "/app/settings", "/dashboard", "/admin", "/billing",
  "/settings", "/onboarding", "/profile", "/market-intelligence",
  "/unsubscribe", "/reset-password", "/verify-email", "/forgot-password",
];

const PUBLIC = [
  "/", "/features", "/pricing", "/how-it-works", "/integrations", "/faq",
  "/demo", "/contact", "/resources", "/roadmap", "/signup", "/login",
  "/vs/ixact", "/switch-from-liondesk", "/blog/crea-ddf", "/privacy-policy",
];

/** Search, AI-search and training crawlers we expect to behave identically. */
const CRAWLERS = [
  "Googlebot", "Bingbot", "DuckDuckBot", "Slurp", "Applebot",
  "OAI-SearchBot", "ChatGPT-User", "PerplexityBot", "Perplexity-User",
  "Claude-SearchBot", "Claude-User", "Amazonbot",
  "GPTBot", "ClaudeBot", "Google-Extended", "Applebot-Extended",
  "CCBot", "SomeCrawlerWeHaveNeverHeardOf",
];

describe("robots.txt", () => {
  it("keeps the authenticated app out of reach of every crawler", () => {
    for (const agent of CRAWLERS) {
      const leaks = PRIVATE.filter((p) => canFetch(agent, p));
      expect(leaks, `${agent} can crawl private paths`).toEqual([]);
    }
  });

  it("leaves every public page crawlable by every crawler", () => {
    for (const agent of CRAWLERS) {
      const blocked = PUBLIC.filter((p) => !canFetch(agent, p));
      expect(blocked, `${agent} is blocked from public pages`).toEqual([]);
    }
  });

  it("has no blank line inside a group", () => {
    // This is defect 1, guarded structurally: a rule may only follow a
    // User-agent line with no empty line between them.
    let sawAgent = false;
    for (const raw of robots.split("\n")) {
      if (!raw.trim()) {
        sawAgent = false;
        continue;
      }
      const line = raw.replace(/#.*$/, "").trim();
      if (!line) continue; // comment inside a group is fine
      const key = line.split(":")[0].trim().toLowerCase();
      if (key === "user-agent") sawAgent = true;
      else if (key === "disallow" || key === "allow") {
        expect(sawAgent, `orphaned rule outside any group: "${line}"`).toBe(true);
      }
    }
  });

  it("carries no blanket Allow directive", () => {
    // Defect 2. The comment block quotes the string deliberately, so only
    // directive lines count.
    const directives = robots
      .split("\n")
      .filter((l) => l.trim() && !l.trimStart().startsWith("#"));
    expect(directives.filter((l) => /^allow:\s*\/\s*$/i.test(l.trim()))).toEqual([]);
  });

  it("names a sitemap that exists and is well-formed", () => {
    expect(robots).toContain("Sitemap: https://www.realtordesk.ai/sitemap.xml");
    expect(sitemap).toContain("<urlset");
    expect(sitemap.trimEnd().endsWith("</urlset>")).toBe(true);
  });
});

describe("sitemap.xml", () => {
  const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);

  it("lists every URL exactly once, absolute and on the canonical host", () => {
    expect(locs.length).toBeGreaterThan(60);
    expect(new Set(locs).size).toBe(locs.length);
    for (const u of locs) expect(u.startsWith("https://www.realtordesk.ai")).toBe(true);
  });

  it("contains nothing robots.txt disallows", () => {
    // A sitemap should only ever offer canonical, indexable URLs. Listing a
    // blocked path asks a crawler to fetch what it has been told not to.
    const conflicts = locs
      .map((u) => new URL(u).pathname)
      .filter((p) => !canFetch("Googlebot", p));
    expect(conflicts).toEqual([]);
  });

  it("includes the public pages that were missing from it", () => {
    for (const p of [
      "/switch-from-follow-up-boss",
      "/switch-from-liondesk",
      "/compare/boldtrail",
      "/resources/slow-follow-up-calculator-canadian-realtors",
      "/blog/best-liondesk-alternative-canadian-realtors",
      "/blog/real-estate-crm-buying-guide",
    ]) {
      expect(locs, `sitemap is missing ${p}`).toContain(`https://www.realtordesk.ai${p}`);
    }
  });
});
