import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

// vercel.json is read by Vercel BEFORE the build runs, so the ?lang=fr rewrites
// cannot be generated at build time — they are committed. If someone adds a
// page to sitemap.xml without re-running scripts/sync-fr-rewrites.mjs, that
// page's French variant would be prerendered into dist/fr but never served,
// and ?lang=fr would silently fall through to the English SPA shell.

const repoRoot = path.join(__dirname, '../../..');
const SITE = 'https://www.realtordesk.ai';

function sitemapRoutes(): string[] {
  const xml = fs.readFileSync(path.join(repoRoot, 'public/sitemap.xml'), 'utf-8');
  const routes: string[] = [];
  for (const m of xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)) {
    const url = m[1];
    if (!url.startsWith(SITE)) continue;
    const pathname = url.slice(SITE.length) || '/';
    if (pathname.includes('*') || path.extname(pathname)) continue;
    routes.push(pathname.replace(/\/$/, '') || '/');
  }
  return [...new Set(routes)];
}

type Rewrite = {
  source: string;
  destination: string;
  has?: { type: string; key: string; value?: string }[];
};

function readRewrites(): Rewrite[] {
  const cfg = JSON.parse(fs.readFileSync(path.join(repoRoot, 'vercel.json'), 'utf-8'));
  return cfg.rewrites ?? [];
}

const isFrRule = (r: Rewrite) =>
  Array.isArray(r.has) && r.has.some((h) => h.type === 'query' && h.key === 'lang');

describe('French ?lang=fr rewrites', () => {
  it('covers every route in the sitemap', () => {
    const covered = new Set(readRewrites().filter(isFrRule).map((r) => r.source));
    const missing = sitemapRoutes().filter((route) => !covered.has(route));
    expect(
      missing,
      `Run: node scripts/sync-fr-rewrites.mjs — these sitemap routes have no ?lang=fr rewrite:\n${missing.join('\n')}`,
    ).toEqual([]);
  });

  it('points each route at its own French file', () => {
    for (const r of readRewrites().filter(isFrRule)) {
      const expected = r.source === '/' ? '/fr/index.html' : `/fr${r.source}`;
      expect(r.destination).toBe(expected);
    }
  });

  it('places the French rules before the SPA catch-all', () => {
    const rewrites = readRewrites();
    const catchAll = rewrites.findIndex((r) => r.source === '/(.*)' && !isFrRule(r));
    const lastFr = rewrites.map(isFrRule).lastIndexOf(true);
    expect(catchAll).toBeGreaterThan(-1);
    expect(lastFr).toBeLessThan(catchAll);
  });

  it('never rewrites a route we do not prerender, so /login?lang=fr still loads the app', () => {
    // A blanket /:path* rule would 404 every route without a French file.
    const sources = readRewrites().filter(isFrRule).map((r) => r.source);
    expect(sources.some((s) => s.includes(':') || s.includes('*'))).toBe(false);
    expect(sources).not.toContain('/login');
  });
});
