import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";

// The company's social profiles are declared in three places: the static
// Organization block in index.html, the exported organizationSchema in
// structuredData.ts, and the footer links. They disagreed. structuredData.ts
// named a LinkedIn page nobody had verified and an X handle spelled differently
// from the real one, so two Organization nodes described the same company with
// different identities.
//
// sameAs is how answer engines connect a site to the accounts that belong to it,
// so a wrong entry can attach the brand to someone else's profile. Nothing in
// the file proves a profile is real; the footer is the one place a person looks
// at every link, so it is the reference the other two must match.

const ROOT = path.resolve(__dirname, "../../..");
const read = (f: string) => fs.readFileSync(path.join(ROOT, f), "utf8");

const norm = (u: string) =>
  u
    .toLowerCase()
    .replace("https://twitter.com/", "https://x.com/")
    .replace("https://www.", "https://")
    .replace(/\/+$/, "");

const social = (src: string) =>
  [...src.matchAll(/https:\/\/(?:www\.)?(?:youtube|x|twitter|facebook|instagram|linkedin)\.com[^"'\s)\]]*/g)].map((m) =>
    norm(m[0]),
  );

describe("organization sameAs", () => {
  const footer = new Set(social(read("src/components/rd/marketing/MarketingFooter.tsx")));
  const sameAs = (src: string) => {
    const block = src.match(/"sameAs":\s*\[([\s\S]*?)\]/)?.[1] ?? "";
    return social(block);
  };

  it("finds the footer profiles to compare against", () => {
    expect(footer.size).toBeGreaterThanOrEqual(4);
  });

  it("lists in index.html only profiles the footer links", () => {
    const listed = sameAs(read("index.html"));
    expect(listed.length).toBeGreaterThan(0);
    expect(listed.filter((u) => !footer.has(u))).toEqual([]);
  });

  it("lists in structuredData.ts only profiles the footer links", () => {
    const listed = sameAs(read("src/lib/structuredData.ts"));
    expect(listed.length).toBeGreaterThan(0);
    expect(listed.filter((u) => !footer.has(u))).toEqual([]);
  });
});
