import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync, statSync } from "fs";
import path from "path";
import i18n from "@/i18n/config";

// Defense against the R-38 bug class: a t('some.key') call in code
// with no corresponding entry in the i18n bundle.
//
// This test walks src/ recursively, extracts every t('...') / t("...")
// literal (falls back to static keys only — dynamic t(`${x}`) can't be
// verified statically), and asserts that each key resolves in the EN
// locale. The shape-parity test catches EN/FR drift; this one catches
// "called key never existed" — the kind of bug that renders the raw
// key into the DOM.
//
// To suppress a false positive (e.g. runtime-built keys), prefix the
// call with the RESOLVE_IGNORE comment: `/* i18n-ignore */ t(name)`.

const SRC = path.resolve(__dirname, "../..");
const EXT = /\.(tsx?|jsx?)$/;
// Only flag calls that would render the raw key as user-visible text
// if the key is missing: `t('key')` with no fallback. Calls with a
// fallback — `t('key', 'Fallback')` — degrade gracefully to English
// and belong to the wider R-5 / ghost-English backlog, not the R-38
// raw-key-leak class that is actually user-breaking.
//
// The trailing `)` match on a non-comma character is the giveaway:
// anything followed by `)` closes the call with one argument only.
const T_CALL_NO_FALLBACK = /\bt\(\s*['"]([a-zA-Z_][a-zA-Z0-9_]*(?:\.[a-zA-Z_][a-zA-Z0-9_]*)+)['"]\s*\)/g;

function walk(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    if (entry === "node_modules" || entry === "dist" || entry.startsWith(".")) continue;
    const p = path.join(dir, entry);
    const s = statSync(p);
    if (s.isDirectory()) walk(p, out);
    else if (EXT.test(entry)) out.push(p);
  }
  return out;
}

function collectTCalls(): Map<string, string[]> {
  const calls = new Map<string, string[]>();
  for (const file of walk(SRC)) {
    // Skip test files — they can reference fake keys for coverage.
    if (file.includes("__tests__") || file.includes(".test.")) continue;
    const source = readFileSync(file, "utf8");
    let m: RegExpExecArray | null;
    while ((m = T_CALL_NO_FALLBACK.exec(source))) {
      const key = m[1];
      // Heuristic: require at least one dot so we skip t(name) where
      // `name` happens to look like an identifier. Already enforced by
      // the regex but double-checked for clarity.
      if (!key.includes(".")) continue;
      const hits = calls.get(key) ?? [];
      hits.push(path.relative(SRC, file));
      calls.set(key, hits);
    }
  }
  return calls;
}

describe("i18n key resolution", () => {
  it("every t('static.key') in src/ resolves in the en bundle", () => {
    const calls = collectTCalls();
    const missing: string[] = [];
    for (const [key, files] of calls) {
      // i18next's `exists` tells us whether the key lives in the
      // current store, ignoring fallbacks. We want that exact check
      // because fallbacks mask the bug we're trying to catch.
      if (!i18n.exists(key, { lng: "en" })) {
        missing.push(`${key}  ← referenced in: ${files.slice(0, 3).join(", ")}`);
      }
    }
    expect(
      missing,
      `${missing.length} i18n key(s) referenced in code but missing from the en bundle:\n  - ${missing.join("\n  - ")}\n\n` +
        `Each missing key renders the raw key string to users. Either add it to src/i18n/config.ts ` +
        `or pass a fallback string as the second argument to t(): t('foo.bar', 'Foo Bar').`
    ).toEqual([]);
  });
});
