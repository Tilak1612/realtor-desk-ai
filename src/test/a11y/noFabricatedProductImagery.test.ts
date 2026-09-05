import { describe, it, expect } from "vitest";
import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";

const ASSETS = join(process.cwd(), "src/assets");

/**
 * Three AI-generated "screenshots" of the product shipped in this repo. One
 * was live on /how-it-works as the priority LCP image of a section headed
 * "Dashboard Preview", with alt text asserting it was "The Realtor Desk
 * dashboard, showing the lead pipeline and Desk AI activity feed".
 *
 * It was not. It showed garbled interface text ("Masnual by eda new
 * peraslidng"), a fabricated agent named Sarah Johnson -- the same invented
 * persona deleted from the testimonials in PR #171 -- invented figures, and
 * purple/blue chrome that is not this product's navy and terracotta. The
 * other two were unreferenced and included invented human faces presented as
 * users.
 *
 * A generated picture of software, captioned as the software, is the image
 * equivalent of a fabricated testimonial. The brief prohibits it explicitly
 * and so does CLAUDE.md.
 *
 * If a real screenshot is captured to one of these names later, delete the
 * entry here -- do not weaken the check.
 */
const REMOVED_FABRICATIONS = [
  "hero-dashboard",
  "hero-dashboard-ai",
  "dashboard-unified",
];

describe("no fabricated product imagery", () => {
  it.each(REMOVED_FABRICATIONS)("%s is not back in src/assets", (stem) => {
    const found = [".jpg", ".jpeg", ".png", ".avif", ".webp"]
      .map((ext) => `${stem}${ext}`)
      .filter((f) => existsSync(join(ASSETS, f)));
    expect(
      found,
      `${found.join(", ")} — these were AI-generated fakes of the product. ` +
        `Real screenshots come from npm run capture:screenshots.`
    ).toEqual([]);
  });

  it("no asset is named as a dashboard screenshot without coming from the capture script", () => {
    // The capture script writes to src/assets/product/. Anything claiming to
    // be a dashboard elsewhere in src/assets did not come from the running
    // application.
    const suspicious = readdirSync(ASSETS)
      .filter((f) => /^(hero-)?dashboard/i.test(f));
    expect(
      suspicious,
      `${suspicious.join(", ")} — product screenshots belong in src/assets/product/, written by scripts/capture-screenshots.mjs`
    ).toEqual([]);
  });
});
