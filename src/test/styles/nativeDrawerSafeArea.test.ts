import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * The navigation drawers inside the iOS / Android app.
 *
 * Both drawers are position: fixed, so the safe-area padding on <body> does
 * not reach them and src/index.css spells their insets out. They were inset at
 * the bottom by the home-indicator height, which left a band of dimmed page
 * under the navy panel. The box now runs to the bottom edge and the inset is
 * padding inside it.
 *
 * As in motionAndHover.test.ts this asserts the CSS contract, not the rendered
 * result: jsdom has no layout, and a dropped declaration here fails silently.
 * Comments are stripped first, because the rule's own comment quotes the old
 * declaration.
 */

const css = readFileSync(join(process.cwd(), "src/index.css"), "utf8").replace(/\/\*[\s\S]*?\*\//g, "");

/** Declarations of the first rule whose selector list is exactly `selector`. */
function rule(selector: string): string {
  const normal = (s: string) => s.replace(/\s+/g, " ").trim();
  const re = /([^{}]+)\{([^{}]*)\}/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(css))) {
    if (normal(m[1]) === normal(selector)) return normal(m[2]);
  }
  throw new Error("No rule for " + selector);
}

describe("native app: navigation drawers and the safe area", () => {
  it("runs both drawers to the bottom edge of the screen", () => {
    const both = rule("html.native #rd-app-nav, html.native #app-sidebar");
    expect(both).toContain("bottom: 0;");
    expect(both).not.toContain("bottom: var(--rd-safe-bottom)");
  });

  it("keeps their content above the home indicator with padding", () => {
    // The /app drawer keeps its own 1.25rem (py-5) and adds the inset to it.
    expect(rule("html.native #rd-app-nav")).toContain("padding-bottom: calc(1.25rem + var(--rd-safe-bottom));");
    const legacy = rule("html.native #app-sidebar");
    expect(legacy).toContain("padding-bottom: var(--rd-safe-bottom);");
    // h-screen would cap the legacy drawer at the height between the insets.
    expect(legacy).toContain("height: auto;");
  });

  it("starts them below the status bar, where the strip above is painted", () => {
    expect(rule("html.native #rd-app-nav, html.native #app-sidebar")).toContain("top: var(--rd-safe-top);");
    // The opaque strip that makes the top inset safe: fixed, as tall as the
    // inset, and above both shells' backdrops (z-30 and z-40).
    const strip = rule("html.native body::before");
    expect(strip).toContain("position: fixed;");
    expect(strip).toContain("height: var(--rd-safe-top);");
    expect(strip).toContain("background: hsl(var(--background));");
    expect(strip).toContain("z-index: 45;");
  });
});
