import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { readdirSync, existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { DashboardPreview } from "../DashboardPreview";
import { SHOTS, hasShot } from "../dashboardShots";

/**
 * The point of DashboardPreview is that it renders a real screenshot when one
 * exists and NOTHING when one does not -- so capturing the screenshots is the
 * whole procedure, with no follow-up edit to place them.
 *
 * The failure that matters is the absent case rendering something: an empty
 * bezel, a broken <img>, or an alt string describing a screenshot that is not
 * there. Any of those puts a claim about the product on the page without the
 * evidence behind it, which is the exact thing the fake screenshot removed from
 * this page was doing.
 */
describe("DashboardPreview", () => {
  const dir = join(process.cwd(), "src/assets/product");
  const captured = existsSync(dir)
    ? readdirSync(dir).filter((f) => /\.(png|jpe?g)$/i.test(f))
    : [];

  it("renders nothing at all when the screenshot has not been captured", () => {
    const missing = (Object.keys(SHOTS) as (keyof typeof SHOTS)[]).filter(
      (s) => !hasShot(s)
    );
    // If every shot happens to be present this assertion has nothing to prove,
    // and saying so is better than passing vacuously.
    if (!missing.length) {
      expect(captured.length, "all shots captured, nothing absent to check").toBeGreaterThan(0);
      return;
    }
    for (const shot of missing) {
      const { container } = render(
        <DashboardPreview shot={shot} alt="should never be rendered" />
      );
      expect(container.innerHTML, `${shot} rendered markup while absent`).toBe("");
    }
  });

  it("never renders an empty device bezel", () => {
    // A frame with no screenshot inside is worse than no frame: it reads as a
    // product image that failed to load.
    for (const shot of Object.keys(SHOTS) as (keyof typeof SHOTS)[]) {
      const { container } = render(<DashboardPreview shot={shot} alt="x" />);
      const frame = container.querySelector("[data-device-frame]");
      if (frame) {
        expect(
          frame.querySelector("img"),
          `${shot} rendered a bezel with no image inside`
        ).not.toBeNull();
      }
    }
  });

  it("declares the capture dimensions the script actually produces", () => {
    // These sizes exist so the browser can reserve the box before the bytes
    // arrive. If the capture script changes viewport and this does not, every
    // preview ships the wrong aspect ratio and reflows on load.
    const script = join(process.cwd(), "scripts/capture-screenshots.mjs");
    expect(
      existsSync(script),
      "capture-screenshots.mjs is gone; these dimensions now check nothing"
    ).toBe(true);

    const text = readFileSync(script, "utf8");
    for (const [name, { w, h }] of Object.entries(SHOTS)) {
      const line = text
        .split("\n")
        .find((l) => l.includes(`"${name}"`));
      expect(line, `${name} is not produced by capture-screenshots.mjs`).toBeTruthy();
      expect(line, `${name} width disagrees with the capture script`).toContain(`w: ${w}`);
      expect(line, `${name} height disagrees with the capture script`).toContain(`h: ${h}`);
    }
  });
});
