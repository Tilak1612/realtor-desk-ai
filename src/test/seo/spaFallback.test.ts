import { describe, it, expect } from 'vitest';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

// Unknown URLs used to answer 200 with the homepage shell and `index, follow`
// (a soft-404). vercel.json now rewrites only routes declared in App.tsx, and
// everything else falls through to dist/404.html. If this test fails after you
// add a route, run: node scripts/sync-vercel-rewrites.mjs

const root = path.resolve(__dirname, '../../..');
const vercel = JSON.parse(fs.readFileSync(path.join(root, 'vercel.json'), 'utf-8'));
const app = fs.readFileSync(path.join(root, 'src/App.tsx'), 'utf-8');

// Vercel's `:name` and trailing `:name*` segments, enough for the shapes we use.
function toRegex(source: string): RegExp {
  const body = source
    .replace(/\/:[A-Za-z]+\*$/, '(?:/.*)?')
    .replace(/:[A-Za-z]+/g, '[^/]+');
  return new RegExp('^' + body + '/?$');
}
const matchers = (vercel.rewrites as { source: string }[]).map((r) => toRegex(r.source));
const rewritten = (url: string) => matchers.some((m) => m.test(url));

describe('SPA fallback rewrites', () => {
  it('are in sync with the routes in App.tsx', () => {
    execFileSync('node', ['scripts/sync-vercel-rewrites.mjs', '--check'], { cwd: root, stdio: 'pipe' });
  });

  it('rewrite every router path to the app shell', () => {
    const paths = [...app.matchAll(/<Route[^>]*?\spath="([^"]+)"/g)].map((m) => m[1]).filter((p) => p !== '*');
    expect(paths.length).toBeGreaterThan(100);
    const missing = paths
      .map((p) => p.replace(/\/\*$/, '/x').replace(/:[A-Za-z]+/g, 'abc123'))
      .filter((url) => !rewritten(url));
    expect(missing).toEqual([]);
  });

  it('keep the money paths and the app reachable', () => {
    for (const url of ['/', '/login', '/signup', '/pricing', '/app', '/app/leads', '/app/leads/123', '/contacts/9']) {
      expect(rewritten(url), url).toBe(true);
    }
  });

  it('do not rewrite unknown URLs or the API', () => {
    for (const url of ['/this-page-does-not-exist', '/blog/nope-nope', '/features/voice-ai', '/api/anything', '/pricing/extra/segment']) {
      expect(rewritten(url), url).toBe(false);
    }
  });

  it('emits a noindex 404.html in the build', () => {
    const file = path.join(root, 'dist/404.html');
    if (!fs.existsSync(file)) return; // dist is only present after build:seo
    const html = fs.readFileSync(file, 'utf-8');
    expect(html).toMatch(/<meta name="robots" content="noindex, follow"/);
    expect(html).not.toMatch(/rel="canonical"/);
    expect(html).toMatch(/<div id="root">\s*<\/div>/);
  });
});
