/**
 * Generates on-brand SVG article headers.
 *
 * Replaces AI-generated raster filler -- garbled CRM interfaces, invented
 * people, a stopwatch whose face has two 10s, a monitor exploding because the
 * generator read "BoomTown" literally. None of those made a claim, so none had
 * to go on honesty grounds; they were simply bad, and off-brand.
 *
 * The template is taken from blog-database-reactivation.jpg, the one asset in
 * the repo already doing this properly: navy ground, terracotta accent,
 * correct legible typography, and abstract shapes that read as placeholders
 * rather than pretending to be a screenshot.
 *
 * A generator rather than hand-authored files because there are a dozen of
 * these and consistency is the entire point. Adding one is a row in HEADERS.
 *
 *   node scripts/make-brand-headers.mjs
 *
 * Writes to src/assets/brand/. SVG, so no optimize-images pass is needed.
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";

const OUT = join(process.cwd(), "src/assets/brand");
mkdirSync(OUT, { recursive: true });

const NAVY = "#0B2540";
const NAVY_DEEP = "#071A2E";
const TERRA = "#D7714E";
const TERRA_SOFT = "#E8A98F";
const MUTED = "#AFC2D6";
const DIM = "#7E93AA";

/** SVG text is XML: these five characters must be escaped or the file breaks. */
const esc = (t) =>
  String(t)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

/**
 * Two stacked cards with a dotted connector. Reads as "this becomes that"
 * without naming what either is.
 */
const motifFlow = (topLabel, bottomLabel) => `
  <g transform="translate(690 150)">
    <rect x="0" y="0" width="300" height="86" rx="16" fill="#FFFFFF" fill-opacity="0.07"/>
    <circle cx="34" cy="43" r="17" fill="#FFFFFF" fill-opacity="0.16"/>
    <rect x="64" y="30" width="176" height="9" rx="4.5" fill="#FFFFFF" fill-opacity="0.30"/>
    <rect x="64" y="49" width="120" height="9" rx="4.5" fill="#FFFFFF" fill-opacity="0.18"/>
    <text x="0" y="112" font-family="Inter, Helvetica Neue, Arial, sans-serif"
          font-size="15" fill="${DIM}">${esc(topLabel)}</text>

    <path d="M150 132 C150 168, 232 168, 232 196" stroke="${TERRA}" stroke-width="2.5"
          fill="none" stroke-dasharray="1 9" stroke-linecap="round"/>
    <path d="M232 196 l-6.5 -9 h13 z" fill="${TERRA}"/>

    <g transform="translate(82 206)">
      <rect x="0" y="0" width="300" height="86" rx="16" fill="#FFFFFF"/>
      <circle cx="34" cy="43" r="17" fill="${TERRA}"/>
      <rect x="64" y="30" width="196" height="9" rx="4.5" fill="${NAVY}" fill-opacity="0.78"/>
      <rect x="64" y="49" width="132" height="9" rx="4.5" fill="${NAVY}" fill-opacity="0.34"/>
      <text x="0" y="112" font-family="Inter, Helvetica Neue, Arial, sans-serif"
            font-size="15" font-weight="600" fill="${TERRA_SOFT}">${esc(bottomLabel)}</text>
    </g>
  </g>`;

/**
 * Two columns side by side. For comparison articles. Deliberately unlabelled
 * beyond a caption: naming a competitor inside artwork is how the removed
 * kvCORE image went wrong.
 */
const motifCompare = (leftLabel, rightLabel) => `
  <g transform="translate(676 158)">
    <g>
      <rect x="0" y="0" width="196" height="238" rx="18" fill="#FFFFFF" fill-opacity="0.06"/>
      ${[0, 1, 2, 3]
        .map(
          (i) =>
            `<rect x="26" y="${44 + i * 42}" width="${144 - i * 22}" height="9" rx="4.5" fill="#FFFFFF" fill-opacity="${0.26 - i * 0.05}"/>`
        )
        .join("\n      ")}
      <text x="0" y="266" font-family="Inter, Helvetica Neue, Arial, sans-serif"
            font-size="15" fill="${DIM}">${esc(leftLabel)}</text>
    </g>
    <g transform="translate(232 -14)">
      <rect x="0" y="0" width="196" height="266" rx="18" fill="#FFFFFF"/>
      <rect x="26" y="34" width="64" height="9" rx="4.5" fill="${TERRA}"/>
      ${[0, 1, 2, 3]
        .map(
          (i) =>
            `<rect x="26" y="${72 + i * 42}" width="${144 - i * 16}" height="9" rx="4.5" fill="${NAVY}" fill-opacity="${0.7 - i * 0.13}"/>`
        )
        .join("\n      ")}
      <text x="0" y="294" font-family="Inter, Helvetica Neue, Arial, sans-serif"
            font-size="15" font-weight="600" fill="${TERRA_SOFT}">${esc(rightLabel)}</text>
    </g>
  </g>`;

/**
 * A sequence of ticks along a rule. For timing and process articles. Carries
 * no numerals: a clock face or a duration is a performance claim, and this
 * codebase has already shipped one of those by accident.
 */
const motifSequence = (label) => `
  <g transform="translate(690 214)">
    <rect x="0" y="46" width="392" height="3" rx="1.5" fill="#FFFFFF" fill-opacity="0.14"/>
    ${[0, 1, 2, 3, 4]
      .map((i) => {
        const x = i * 92;
        // The emphasised tick is the FIRST, not the last. The only caller
        // labels it "First reply", and highlighting the far end read as
        // "eventually" -- the opposite of the article's point.
        const active = i === 0;
        return `<circle cx="${x + 12}" cy="47" r="${active ? 13 : 8}" fill="${active ? TERRA : "#FFFFFF"}" fill-opacity="${active ? 1 : 0.22}"/>`;
      })
      .join("\n    ")}
    <rect x="0" y="0" width="240" height="9" rx="4.5" fill="#FFFFFF" fill-opacity="0.24"/>
    <rect x="0" y="20" width="150" height="9" rx="4.5" fill="#FFFFFF" fill-opacity="0.14"/>
    <text x="0" y="98" font-family="Inter, Helvetica Neue, Arial, sans-serif"
          font-size="15" font-weight="600" fill="${TERRA_SOFT}">${esc(label)}</text>
  </g>`;

const MOTIFS = { flow: motifFlow, compare: motifCompare, sequence: motifSequence };

function render({ title, subtitle, motif, labels }) {
  const build = MOTIFS[motif];
  const art = build(...labels);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630" role="img" aria-label="${esc(title.join(" "))}">
  <!--
    Generated by scripts/make-brand-headers.mjs. Do not hand-edit; change the
    spec and re-run.

    Abstract shapes only. No fabricated names, figures, interface text or
    people, and no competitor named inside the artwork.
  -->
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${NAVY}"/>
      <stop offset="100%" stop-color="${NAVY_DEEP}"/>
    </linearGradient>
    <radialGradient id="b" cx="0.82" cy="0.18" r="0.55">
      <stop offset="0%" stop-color="${TERRA}" stop-opacity="0.28"/>
      <stop offset="100%" stop-color="${TERRA}" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <rect width="1200" height="630" fill="url(#g)"/>
  <rect width="1200" height="630" fill="url(#b)"/>

  <text x="72" y="86" font-family="Inter, Helvetica Neue, Arial, sans-serif" font-size="19"
        font-weight="700" letter-spacing="3.4" fill="${TERRA}">REALTORDESK AI</text>

  <text x="72" y="238" font-family="Georgia, Times New Roman, serif" font-size="66"
        font-weight="700" fill="#FFFFFF">${esc(title[0])}</text>
  <text x="72" y="312" font-family="Georgia, Times New Roman, serif" font-size="66"
        font-weight="700" fill="#FFFFFF">${esc(title[1] ?? "")}</text>

  <rect x="72" y="348" width="86" height="5" rx="2.5" fill="${TERRA}"/>

  <text x="72" y="400" font-family="Inter, Helvetica Neue, Arial, sans-serif"
        font-size="22" fill="${MUTED}">${esc(subtitle[0])}</text>
  <text x="72" y="432" font-family="Inter, Helvetica Neue, Arial, sans-serif"
        font-size="22" fill="${MUTED}">${esc(subtitle[1] ?? "")}</text>
${art}
</svg>
`;
}

/**
 * One row per replaced header. Copy is descriptive of the article subject and
 * makes no performance claim -- no durations, no percentages, no counts.
 */
const HEADERS = [
  {
    // Hand-authored first in PR #193, before this generator existed, which
    // meant it was the one brand SVG with no raster twin -- unusable as an
    // og:image and caught only by the guard added afterwards. Folded in here
    // so there is one way of making these, not two.
    file: "blog-ai-chatbot",
    title: ["AI Chatbot", "for Agents"],
    subtitle: ["Answers every enquiry the instant it lands,", "in English or French."],
    motif: "flow",
    labels: ["New enquiry", "Replied automatically"],
  },
  {
    file: "blog-lead-response-time",
    title: ["Lead Response", "Time"],
    subtitle: ["Why the first reply decides the deal,", "and what to do about it."],
    motif: "sequence",
    labels: ["First reply"],
  },
  {
    file: "blog-cost-missed-leads",
    title: ["The Cost of a", "Missed Lead"],
    subtitle: ["What slips away between the enquiry", "and the callback."],
    motif: "flow",
    labels: ["Enquiry arrives", "Followed up"],
  },
  {
    file: "blog-ai-transformation",
    title: ["AI in Canadian", "Real Estate"],
    subtitle: ["What is actually changing in the", "day-to-day work."],
    motif: "flow",
    labels: ["Manual follow-up", "Handled for you"],
  },
  {
    file: "blog-ai-vs-traditional",
    title: ["AI CRM vs a", "Traditional One"],
    subtitle: ["Where the difference shows up, and", "where it does not."],
    motif: "compare",
    labels: ["Traditional", "AI-assisted"],
  },
  {
    file: "blog-ai-automation-realtor",
    title: ["Automation for", "Canadian Agents"],
    subtitle: ["The work worth handing over, and", "the work worth keeping."],
    motif: "flow",
    labels: ["Repetitive work", "Automated"],
  },
  {
    file: "blog-ai-crm-guide",
    title: ["The AI CRM", "Buying Guide"],
    subtitle: ["How to evaluate one without taking", "the vendor's word for it."],
    motif: "sequence",
    labels: ["Start here"],
  },
  {
    file: "blog-pipeda-privacy",
    title: ["PIPEDA and", "Your Client Data"],
    subtitle: ["What Canadian privacy law asks of a", "brokerage, in plain terms."],
    motif: "flow",
    labels: ["Data collected", "Handled lawfully"],
  },
  {
    file: "blog-lead-conversion",
    title: ["Converting", "More Leads"],
    subtitle: ["What happens between the enquiry and", "the signed agreement."],
    motif: "sequence",
    labels: ["First contact"],
  },
  {
    file: "blog-vs-followupboss",
    title: ["Follow Up Boss", "Compared"],
    subtitle: ["An honest look at where each tool", "fits a Canadian brokerage."],
    motif: "compare",
    labels: ["Elsewhere", "Realtor Desk"],
  },
  {
    file: "blog-vs-lofty",
    title: ["Lofty", "Compared"],
    subtitle: ["An honest look at where each tool", "fits a Canadian brokerage."],
    motif: "compare",
    labels: ["Elsewhere", "Realtor Desk"],
  },
  {
    file: "blog-voice-ai",
    title: ["Voice AI", "for Agents"],
    subtitle: ["What happens to a call you cannot", "take right now."],
    motif: "flow",
    labels: ["Call comes in", "Answered and logged"],
  },
  {
    file: "blog-ai-crm",
    title: ["An AI CRM for", "Canadian Agents"],
    subtitle: ["What the software should be doing", "while you are showing a property."],
    motif: "flow",
    labels: ["Lead lands", "Handled"],
  },
  {
    file: "blog-best-crm-2025",
    title: ["Choosing a CRM", "in 2025"],
    subtitle: ["What actually matters when you are", "comparing them side by side."],
    motif: "compare",
    labels: ["Elsewhere", "Realtor Desk"],
  },
  {
    file: "blog-vs-propertybase",
    title: ["Propertybase", "Compared"],
    subtitle: ["An honest look at where each tool", "fits a Canadian brokerage."],
    motif: "compare",
    labels: ["Elsewhere", "Realtor Desk"],
  },
  {
    file: "blog-ixact-alternatives",
    title: ["IXACT Contact", "Alternatives"],
    subtitle: ["What to weigh when you are", "considering a move."],
    motif: "compare",
    labels: ["Elsewhere", "Realtor Desk"],
  },
];

for (const spec of HEADERS) {
  const svg = render(spec);
  writeFileSync(join(OUT, `${spec.file}.svg`), svg, "utf8");

  // A raster twin, because these assets also feed og:image and SOCIAL
  // PLATFORMS DO NOT RENDER SVG. Facebook, LinkedIn and X all require raster;
  // pointing og:image at an SVG produces a card with no image at all, and
  // nothing reports an error.
  //
  // 1200x630 is the canonical Open Graph size, which is also this artboard's
  // aspect, so nothing crops.
  //
  // JPEG, not PNG. These are full-bleed gradients, which is the case PNG is
  // worst at -- measured on one header: 77KB as full-colour PNG, 60KB with a
  // 64-entry palette, 28KB as mozjpeg q86. The artwork has no transparency
  // and no hard-edged screenshot detail to preserve, so lossless buys nothing
  // here. flatten() sets the navy ground explicitly because JPEG has no alpha
  // and would otherwise composite onto black.
  const jpg = join(OUT, `${spec.file}.jpg`);
  await sharp(Buffer.from(svg))
    .flatten({ background: NAVY })
    .jpeg({ quality: 86, mozjpeg: true })
    .toFile(jpg);

  console.log(`  wrote ${spec.file}.svg (${(svg.length / 1024).toFixed(1)}KB) + .jpg`);
}
console.log(`\n${HEADERS.length} header(s) generated in src/assets/brand/`);
console.log("  .svg for on-page use, .jpg for og:image — social does not render SVG.");
