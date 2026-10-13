// Source images for the iOS and Android app icon and splash screen.
//
//   node scripts/generate-mobile-assets.mjs
//   npx capacitor-assets generate --ios --android
//
// The first command writes the five source files @capacitor/assets expects into
// resources/; the second cuts every size both platforms need and writes them
// into ios/ and android/.
//
// The mark is the same path data as scripts/generate-favicons.mjs and
// src/components/rd/Logo.tsx <RDMark>. If the mark changes, change all three.
//
// Why these shapes:
//   icon-only        full-bleed square, no rounded corners and no transparency.
//                    iOS rejects an icon with an alpha channel and applies its
//                    own corner mask.
//   icon-foreground  the mark alone on transparency, inside the centre 60% so
//                    Android's adaptive-icon masks (circle, squircle) never clip it.
//   icon-background  the flat paper colour behind it.
//   splash(-dark)    the mark centred, small, on the app's own background, so the
//                    hand-off from splash to the first screen is not a flash.

import { mkdirSync } from "node:fs";
import { resolve } from "node:path";
import sharp from "sharp";

const NAVY = "#0B2540";
const TERRA = "#D7714E";
const PAPER = "#FAFAF7";
const NIGHT = "#0F1720";

// 40x40 artboard.
const mark = (ink) => `
  <path d="M20 4L4 15v2.6L20 7.4L36 17.6V15L20 4z" fill="${ink}"/>
  <rect x="26.5" y="6" width="3" height="4.2" fill="${ink}"/>
  <path d="M9 15.5h11.2c3.6 0 6.2 2.3 6.2 5.9 0 2.5-1.3 4.4-3.4 5.3L27 34.5h-4.4l-3.3-6.6H13V34.5H9V15.5zm4 4v4.8h6.6c1.5 0 2.5-.9 2.5-2.4s-1-2.4-2.5-2.4H13z" fill="${ink}"/>
  <circle cx="20" cy="13.2" r="1.4" fill="${TERRA}"/>`;

// The mark scaled to `fraction` of a square canvas and centred.
const canvas = (size, fraction, { bg, ink }) => {
  const s = (size * fraction) / 40;
  const o = (size - size * fraction) / 2;
  return Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">` +
      (bg ? `<rect width="${size}" height="${size}" fill="${bg}"/>` : "") +
      `<g transform="translate(${o} ${o}) scale(${s})">${mark(ink)}</g></svg>`,
  );
};

mkdirSync(resolve("resources"), { recursive: true });
const out = (name) => resolve("resources", name);

const files = [
  ["icon-only.png", canvas(1024, 0.7, { bg: PAPER, ink: NAVY }), { flatten: PAPER }],
  ["icon-foreground.png", canvas(1024, 0.5, { ink: NAVY }), {}],
  ["icon-background.png", canvas(1024, 0, { bg: PAPER, ink: NAVY }), { flatten: PAPER }],
  ["splash.png", canvas(2732, 0.16, { bg: PAPER, ink: NAVY }), { flatten: PAPER }],
  ["splash-dark.png", canvas(2732, 0.16, { bg: NIGHT, ink: "#F4F1EA" }), { flatten: NIGHT }],
];

for (const [name, svg, { flatten }] of files) {
  let img = sharp(svg);
  // Flattening removes the alpha channel, which App Store Connect requires of the icon.
  if (flatten) img = img.flatten({ background: flatten });
  await img.png({ compressionLevel: 9 }).toFile(out(name));
  console.log("-> resources/" + name);
}
