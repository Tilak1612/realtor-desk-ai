// Source images for the iOS and Android app icon and launch screen.
//
//   node scripts/generate-mobile-assets.mjs
//   npx capacitor-assets generate --ios --android
//
// The first command writes the source files @capacitor/assets expects into
// resources/, and the iOS launch mark straight into the Xcode asset catalog;
// the second cuts every icon size both platforms need, and the Android splash
// drawables, and writes them into ios/ and android/.
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
//   android/splash   the mark centred, small, on the app's own background, so the
//                    hand-off from splash to the first screen is not a flash.
//   LaunchMark       (iOS) the mark alone, at 1x/2x/3x. LaunchScreen.storyboard
//                    centres it on a view painted the paper colour.
//
// Why iOS does not get its splash from @capacitor/assets:
//   That tool writes one 2732x2732 bitmap for each of the three scales into
//   Splash.imageset, for a full-screen image view. iOS renders the launch
//   storyboard in a separate process (splashboardd) with a memory budget, and a
//   2732x2732 image decodes to 29.9 MB against a 25 MB limit ("Estimated size
//   (29900800) is over limit (25000000)" in the device log). iOS then marks the
//   app as having a bad launch image and shows a BLACK screen from the tap on
//   the icon until the app has drawn its own first frame. A background colour
//   plus a small mark costs under 1 MB. The tool has no switch for the size, so
//   the splash source lives in resources/android/, which it reads for Android
//   only, and there must be no resources/splash.png or resources/ios/splash.png.
//
// Why there is no dark splash:
//   The app is light-only (UIUserInterfaceStyle = Light on iOS, a light theme on
//   Android). A dark launch screen would flash to the light first screen. So
//   there is no splash-dark source, and none must be added while that holds.

import { mkdirSync, writeFileSync } from "node:fs";
import { relative, resolve } from "node:path";
import sharp from "sharp";

const NAVY = "#0B2540";
const TERRA = "#D7714E";
const PAPER = "#FAFAF7";

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

mkdirSync(resolve("resources", "android"), { recursive: true });
const out = (name) => resolve("resources", name);

// iOS launch mark. 152 pt is the size the mark had on a large iPhone when it
// was part of a full-screen image.
const LAUNCH_MARK_PT = 152;
const launchMarkDir = resolve("ios/App/App/Assets.xcassets/LaunchMark.imageset");
const launchMarkName = (scale) => (scale === 1 ? "LaunchMark.png" : "LaunchMark@" + scale + "x.png");
mkdirSync(launchMarkDir, { recursive: true });

const files = [
  [out("icon-only.png"), canvas(1024, 0.7, { bg: PAPER, ink: NAVY }), { flatten: PAPER }],
  [out("icon-foreground.png"), canvas(1024, 0.5, { ink: NAVY }), {}],
  [out("icon-background.png"), canvas(1024, 0, { bg: PAPER, ink: NAVY }), { flatten: PAPER }],
  [out("android/splash.png"), canvas(2732, 0.16, { bg: PAPER, ink: NAVY }), { flatten: PAPER }],
  ...[1, 2, 3].map((scale) => [
    resolve(launchMarkDir, launchMarkName(scale)),
    canvas(LAUNCH_MARK_PT * scale, 1, { ink: NAVY }),
    {},
  ]),
];

for (const [file, svg, { flatten }] of files) {
  let img = sharp(svg);
  // Flattening removes the alpha channel, which App Store Connect requires of the icon.
  if (flatten) img = img.flatten({ background: flatten });
  await img.png({ compressionLevel: 9 }).toFile(file);
  console.log("-> " + relative(resolve("."), file));
}

// No "appearances" entries: one image for both light and dark system appearance.
writeFileSync(
  resolve(launchMarkDir, "Contents.json"),
  JSON.stringify(
    {
      images: [1, 2, 3].map((scale) => ({
        idiom: "universal",
        filename: launchMarkName(scale),
        scale: scale + "x",
      })),
      info: { version: 1, author: "xcode" },
    },
    null,
    2,
  ) + "\n",
);
console.log("-> ios/App/App/Assets.xcassets/LaunchMark.imageset/Contents.json");
