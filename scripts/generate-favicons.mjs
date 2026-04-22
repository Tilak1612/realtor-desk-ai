// Generates favicons from the same RDMark paths the landing page renders.
// Single source of truth: the SVG literal below must mirror
// src/components/rd/Logo.tsx <RDMark>. When the mark changes, update both
// and re-run `node scripts/generate-favicons.mjs`.
//
// Output:
//   public/favicon.svg          — primary favicon (modern browsers)
//   public/favicon.ico          — ICO bundle for legacy Windows
//   public/favicon-16x16.png    — explicit small raster
//   public/favicon-32x32.png    — standard desktop size
//   public/favicon-192x192.png  — Android / PWA
//   public/favicon-512x512.png  — PWA large
//   public/apple-touch-icon.png — iOS 180×180
//   public/favicon.png          — legacy catch-all at 32×32

import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import sharp from "sharp";

const NAVY  = "#0B2540"; // var(--rd-navy-800)
const TERRA = "#D7714E"; // var(--rd-terra-600)

// Exact path data mirrored from RDMark in src/components/rd/Logo.tsx.
// 40×40 artboard, navy roof + R on paper, terra accent dot on the roof window.
// Wrapped in a white-rounded-square background for favicon legibility at 16×16
// (the raw mark on a transparent canvas disappears against dark OS chrome).
const SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40">
  <rect width="40" height="40" rx="8" fill="#FAFAF7"/>
  <path d="M20 4L4 15v2.6L20 7.4L36 17.6V15L20 4z" fill="${NAVY}"/>
  <rect x="26.5" y="6" width="3" height="4.2" fill="${NAVY}"/>
  <path d="M9 15.5h11.2c3.6 0 6.2 2.3 6.2 5.9 0 2.5-1.3 4.4-3.4 5.3L27 34.5h-4.4l-3.3-6.6H13V34.5H9V15.5zm4 4v4.8h6.6c1.5 0 2.5-.9 2.5-2.4s-1-2.4-2.5-2.4H13z" fill="${NAVY}"/>
  <circle cx="20" cy="13.2" r="1.4" fill="${TERRA}"/>
</svg>`;

const out = (name) => resolve("public", name);
writeFileSync(out("favicon.svg"), SVG);

const buffer = Buffer.from(SVG);
const targets = [
  { size: 16,  name: "favicon-16x16.png" },
  { size: 32,  name: "favicon-32x32.png" },
  { size: 32,  name: "favicon.png" },
  { size: 180, name: "apple-touch-icon.png" },
  { size: 192, name: "favicon-192x192.png" },
  { size: 512, name: "favicon-512x512.png" },
];

for (const { size, name } of targets) {
  await sharp(buffer).resize(size, size).png({ compressionLevel: 9 }).toFile(out(name));
  console.log(`→ ${name} (${size}×${size})`);
}

// ICO: pack 16, 32, 48 multi-res. sharp doesn't emit ICO natively;
// cheapest solid path is to keep the existing favicon.ico on disk and
// let modern browsers choose SVG/PNG ahead of ICO. If you need a matching
// ICO, regenerate separately (png-to-ico or imagemagick — not adding to
// devDeps for one file).
console.log("✓ Favicons generated. favicon.ico left as-is — see script comment.");
