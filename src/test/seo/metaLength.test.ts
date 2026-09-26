import { describe, expect, it } from 'vitest';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

// The 2026-09-21 crawl found 37 titles over 60 characters and 16 descriptions
// over 160 — long enough that Google truncates them in the SERP, so the part
// carrying the keyword is often the part that gets cut. Both are now within
// budget; this keeps them there.
//
// The check runs against the prerenderer's own extraction rather than the
// built dist/, so it needs no build step and cannot pass just because dist is
// stale. If the build output exists it is preferred, since that is what ships.

const repoRoot = path.join(__dirname, '../../..');
const TITLE_MAX = 60;
const DESC_MAX = 160;

type Meta = { route: string; title: string; description: string };

function fromDist(): Meta[] | null {
  const dist = path.join(repoRoot, 'dist');
  if (!fs.existsSync(dist)) return null;
  const out: Meta[] = [];
  const walk = (dir: string) => {
    for (const e of fs.readdirSync(dir)) {
      const full = path.join(dir, e);
      if (fs.statSync(full).isDirectory()) walk(full);
      else if (e === 'index.html') {
        const html = fs.readFileSync(full, 'utf-8');
        const t = html.match(/<title>([\s\S]*?)<\/title>/);
        const d = html.match(/<meta name="description" content="([\s\S]*?)"/);
        out.push({
          route: full.slice(dist.length).replace(/\/index\.html$/, '') || '/',
          title: t?.[1] ?? '',
          description: d?.[1] ?? '',
        });
      }
    }
  };
  walk(dist);
  return out.length ? out : null;
}

function fromPrerenderer(): Meta[] {
  // Same extraction the prerender uses, so this cannot pass against a stale
  // build. Resolved synchronously via a child process because the script is
  // ESM and this suite is CJS-interop.
  const json = execFileSync(
    'node',
    [
      '--input-type=module',
      '-e',
      "import { collectMeta } from './scripts/prerender-pages.js'; process.stdout.write(JSON.stringify(collectMeta()));",
    ],
    { cwd: repoRoot, encoding: 'utf-8' }
  );
  return JSON.parse(json);
}

const pages = fromDist() ?? fromPrerenderer();

describe('SERP metadata budgets', () => {
  it('has pages to check', () => {
    expect(pages.length).toBeGreaterThan(50);
  });

  it(`keeps every title within ${TITLE_MAX} characters`, () => {
    const over = pages
      .filter((p) => p.title.length > TITLE_MAX)
      .map((p) => `${p.title.length} ${p.route} — ${p.title}`);
    expect(over, `titles Google will truncate:\n${over.join('\n')}`).toEqual([]);
  });

  it(`keeps every description within ${DESC_MAX} characters`, () => {
    const over = pages
      .filter((p) => p.description.length > DESC_MAX)
      .map((p) => `${p.description.length} ${p.route}`);
    expect(over, `descriptions Google will truncate:\n${over.join('\n')}`).toEqual([]);
  });

  it('gives every page its own title and description', () => {
    const dupTitle = pages.length - new Set(pages.map((p) => p.title)).size;
    const dupDesc = pages.length - new Set(pages.map((p) => p.description)).size;
    expect(dupTitle, 'duplicate titles').toBe(0);
    expect(dupDesc, 'duplicate descriptions').toBe(0);
  });
});
