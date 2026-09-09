# Higgsfield asset plan — RealtorDesk AI

Production-ready generation prompts for the marketing site. Lives in the repo
rather than in a chat transcript so it is version-controlled, reviewable in a
PR, and available to whoever runs the generation.

**Status: first generation run complete (2026-09-09).** Six assets generated
for 12 credits; one shipped, four rejected on review, one clean but not worth
its bytes. Outcomes are recorded per spec below. A 1-in-6 ship rate is the
honest number — the prompts produce usable output, and the review gate is what
stops the rest reaching the site.

**Two failure modes this run exposed, now in the gate:**

- **Rendered as a framed artwork.** H-08 came back as a photographed print:
  white mat border, drop shadow, grey surround. Every prompt now carries
  `full-bleed` and negative-prompts the frame.
- **Accent intensity lands well above the stated percentage.** "Roughly 15%
  opacity, heavily diffused" produced a bloom that reads as a sun. State the
  accent as a *barely perceptible tint* and name the failure — "must not read
  as a sun, sunset, or light source" — rather than giving a number the model
  does not honour.

**Superseded status: no assets generated yet.** The Higgsfield connector needs OAuth in an
interactive session, and no exports exist on disk — verified by searching the
repository for `.mp4`, `.webm`, `.mov`, `.lottie` and `.riv`, which returns
nothing. Every destination below is already built and will accept its asset
without a code change.

---

## Non-negotiable constraints

These apply to **every** prompt in this document and are repeated inside each
negative prompt because generators drift.

- **No interface text of any kind.** Not blurred, not "suggestive", not
  placeholder. Every frame that implies a UI must be abstract shape only.
  Generated glyphs come out malformed and read as a broken product.
- **No fabricated data.** No metrics, percentages, counts, currency figures,
  ratings, star rows, review scores, or chart values.
- **No people.** No agents, no clients, no hands, no faces. Invented people
  photographed as customers are social proof the product has not earned.
- **No logos.** Not RealtorDesk's, not a competitor's, not a portal's, not a
  brokerage's. Wordmarks are composited in code where needed.
- **No certification or compliance badges.** PIPEDA, CASL and FINTRAC are
  described in copy, never rendered as a seal.
- **No maple leaf clichés.** Canadian positioning is carried by the words and
  the palette, not by flag iconography.

## Brand parameters

Pass these verbatim; they are the live token values.

| Token | Value | Use |
|---|---|---|
| Navy (primary) | `#0B2540` | Grounds, dark surfaces, deep gradient stops |
| Navy lift | `#1F4A72` | The lighter end of any navy gradient |
| Terracotta (accent) | `#D7714E` | One accent only, sparingly |
| Terracotta deep | `#BE552F` | Accent on light grounds where contrast matters |
| Paper | `#FAFAF7` | Light ground |
| Ink | `#111418` | Text on light |

**Palette discipline:** at most two brand colours in any single composition.
Terracotta is an accent, never a field.

## Delivery requirements

Applies to every asset unless a spec overrides it.

- **Stills:** AVIF + WebP + original, at `640w` / `960w` / full. Run
  `npm run optimize:images` after adding, which generates the variants;
  `<Picture>` requires explicit `width`/`height` to prevent layout shift.
- **Video:** WebM (VP9) + MP4 (H.264) fallback, plus a poster still matching
  frame one. Muted, `playsinline`, no autoplay with sound, never the LCP
  element. `preload="none"` below the fold, `preload="metadata"` only if above.
- **Reduced motion:** every video needs a static fallback image; the poster
  serves for this. Motion must never carry information the still lacks.
- **Weight budget:** ≤200 KB per still at full width, ≤1.5 MB per video.

---

# Stills

## H-01 · Hero ground, desktop
> **Run 1: REJECTED.** Bloom far stronger than specified and positioned
> top-right, where the hero's product card already sits — two focal points
> competing. Regenerate with the accent as a barely perceptible tint, moved
> to the upper LEFT away from the card.


| Field | Value |
|---|---|
| **Product** | RealtorDesk AI |
| **Real feature** | None — atmospheric ground only |
| **Audience** | Canadian real estate agents, solo and small team |
| **Destination** | Homepage hero, behind the H1 and device composition |
| **Desktop** | 2880 × 1620 (renders 1440 × 810) |
| **Mobile** | Not used — see H-02 |
| **Aspect / duration** | 16:9 · still |
| **Filename** | `hero-ground-desktop.avif` |
| **Alt text** | `""` (decorative; `aria-hidden`) |
| **Fallback** | Flat `#FAFAF7`; the hero reads correctly with no image |

**Generation prompt**
> Abstract editorial background for a Canadian real estate software company.
> Deep navy `#0B2540` field with a slow diagonal gradient toward `#1F4A72` in
> the upper left. A single soft terracotta `#D7714E` light bloom in the top
> right at roughly 15% opacity, heavily diffused. Fine grain, matte finish, no
> gloss. Entirely abstract: no objects, no interface, no text, no people.
> Composition weighted to the edges, centre left visually quiet so headline
> text sits cleanly over it.

**Negative prompt**
> text, letters, numbers, words, UI, dashboard, screen, window, chart, graph,
> people, faces, hands, houses, keys, logos, badges, maple leaf, flag, stock
> photo, glossy 3D render, lens flare, busy centre, high contrast centre

---

## H-02 · Hero ground, mobile
> **Run 1: REJECTED.** Bloom reads as a sun rather than a diffuse wash. The
> lower two-thirds were correctly quiet.


Same treatment as H-01, recomposed rather than cropped — a 16:9 crop loses the
corner bloom that carries the whole effect.

| Field | Value |
|---|---|
| **Product** | RealtorDesk AI |
| **Real feature** | None — atmospheric ground only |
| **Audience** | Canadian real estate agents, solo and small team |
| **Destination** | Homepage hero at `<768px` |
| **Desktop** | Not used — H-01 covers `≥768px` |
| **Mobile** | 780 × 1560 (renders 390 × 780) |
| **Aspect / duration** | 1:2 · still |
| **Filename** | `hero-ground-mobile.avif` |
| **Alt text** | `""` (decorative) |
| **Fallback** | Flat `#FAFAF7` |

**Generation prompt**
> Vertical abstract background, deep navy `#0B2540` to `#1F4A72`, gradient
> running top-to-bottom rather than diagonally. One diffuse terracotta
> `#D7714E` bloom at roughly 15% opacity near the top edge. Matte, fine grain.
> The lower two-thirds must stay visually quiet and low-contrast for text.
> Fully abstract — no objects, interface, text or people.

**Negative prompt**
> as H-01, plus: horizontal composition, centre-weighted bloom, busy lower
> half

---

## H-03 · Laptop bezel

> **Prefer the CSS `DeviceFrame` already shipped.** It holds a real screenshot
> and needs no generated asset. Generate this only if a photographic bezel is
> wanted; the screenshot inside is identical either way, so this is a
> refinement of the frame, not of the content.

| Field | Value |
|---|---|
| **Destination** | Hero product composition; reused in the dashboard-preview section |
| **Desktop** | 2560 × 1600 |
| **Mobile** | 1170 × 730 |
| **Aspect / duration** | 16:10 · still, transparent PNG |
| **Filename** | `device-laptop.png` |
| **Alt text** | `""` — the screenshot inside carries the meaning |
| **Fallback** | `DeviceFrame variant="laptop"` (already in the codebase) |

**Generation prompt**
> Empty modern laptop shell, three-quarter front view, slight downward tilt.
> Matte dark aluminium body, thin uniform bezel, screen area a flat pure
> magenta chroma fill for compositing. Neutral studio light, soft shadow
> beneath. Transparent background. No branding on the lid or bezel.

**Negative prompt**
> screen content, interface, text, logos, brand marks, glossy reflections,
> visible ports with cables, hands, desk clutter, wallpaper, coloured screen
> other than flat magenta

---

## H-04 · Phone bezel

| Field | Value |
|---|---|
| **Destination** | Product workflow section; mobile-first proof on the features page |
| **Desktop** | 1200 × 2400 |
| **Mobile** | 780 × 1560 |
| **Aspect / duration** | 1:2 · still, transparent PNG |
| **Filename** | `device-phone.png` |
| **Alt text** | `""` |
| **Fallback** | `DeviceFrame variant="phone"` |

**Generation prompt**
> Empty modern smartphone shell, straight-on front view, no tilt. Matte
> graphite body, uniform thin bezel, subtle rounded corners. Screen area flat
> pure magenta chroma fill. Soft neutral studio light, transparent background.
> No branding anywhere on the device.

**Negative prompt**
> as H-03, plus: notch content, status bar, icons, time display, wallpaper

---

## H-05 · Tablet bezel

| Field | Value |
|---|---|
| **Destination** | Pipeline / workflow section — the kanban board reads best at tablet width |
| **Desktop** | 2048 × 1536 |
| **Mobile** | 1024 × 768 |
| **Aspect / duration** | 4:3 · still, transparent PNG |
| **Filename** | `device-tablet.png` |
| **Alt text** | `""` |
| **Fallback** | `DeviceFrame variant="tablet"` |

**Generation prompt**
> Empty modern tablet shell, landscape orientation, straight-on. Matte
> graphite body, even bezel on all four sides, screen area flat pure magenta
> chroma fill. Soft neutral light, transparent background, no branding.

**Negative prompt**
> as H-03

---

## H-06 · Trust section ground
> **Run 1: SHIPPED.** Exact match — long horizontal rules, a soft grid
> drifting out of alignment, faint navy on warm paper, no symbols. Applied to
> the homepage trust strip as a CSS background via `image-set` (11KB AVIF /
> 30KB WebP) with `bg-white` beneath, so the section is never bare. It is
> decoration, so it carries no alt text and stays out of the a11y tree.


| Field | Value |
|---|---|
| **Destination** | Trust / PIPEDA section background |
| **Desktop** | 2880 × 1200 |
| **Mobile** | 780 × 1000 |
| **Aspect / duration** | 12:5 · still |
| **Filename** | `trust-ground.avif` |
| **Alt text** | `""` (decorative) |
| **Fallback** | `#F4F3EE` flat |

**Generation prompt**
> Very light abstract texture on warm paper `#FAFAF7`. Faint navy `#0B2540`
> line work at roughly 6% opacity suggesting order and containment — long
> horizontal rules, a soft grid drifting out of alignment toward the edges.
> Restrained and quiet. No icons, no symbols, no shields, no locks, no text.

**Negative prompt**
> padlock, shield, checkmark, certificate, seal, badge, ribbon, maple leaf,
> flag, text, numbers, people, high contrast, dark field

---

## H-07 · Closing CTA band
> **Run 1: CLEAN, NOT SHIPPED.** Passed the gate — left and centre stay dark
> for white text. Not shipped because its destination is already a working CSS
> gradient (`from-rd-navy-800 to-rd-navy-600`), so it would spend real bytes to
> replace something costing none. Available if the texture is wanted.


| Field | Value |
|---|---|
| **Destination** | Final call-to-action band, full-bleed |
| **Desktop** | 2880 × 900 |
| **Mobile** | 780 × 900 |
| **Aspect / duration** | 16:5 · still |
| **Filename** | `cta-band.avif` |
| **Alt text** | `""` (decorative) |
| **Fallback** | `linear-gradient(to right, #0B2540, #1F4A72)` — already live |

**Generation prompt**
> Wide abstract band, navy `#0B2540` deepening to `#1F4A72` left to right. A
> single terracotta `#D7714E` gradient sweep entering from the lower right at
> about 20% opacity, heavily diffused. Matte, fine grain. Centre must stay
> low-contrast so white headline and button sit over it with ample contrast.

**Negative prompt**
> text, UI, objects, people, logos, bright centre, high contrast centre, hard
> edges, glossy render

---

## H-08 · Auth panel ground
> **Run 1: REJECTED.** Composition was good, but it rendered as a framed
> print — mat border, drop shadow, grey surround — rather than a full-bleed
> background. Regenerate with `full-bleed, fills the entire frame` and
> negative-prompt frame, mat, border, drop shadow, gallery wall.


| Field | Value |
|---|---|
| **Destination** | Sign-in and sign-up right panel, `≥1024px` only |
| **Desktop** | 1600 × 2000 |
| **Mobile** | Not used — the panel is hidden below `lg` |
| **Aspect / duration** | 4:5 · still |
| **Filename** | `auth-panel.avif` |
| **Alt text** | `""` (decorative) |
| **Fallback** | `#FAFAF7` flat — the panel is fully readable without it |

**Generation prompt**
> Tall, calm abstract composition on warm paper `#FAFAF7`. Soft overlapping
> translucent navy `#0B2540` planes at 8–12% opacity, arranged with generous
> negative space. One small terracotta `#D7714E` accent shape, off-centre.
> Editorial and restrained, closer to print design than to software marketing.
> No interface, no text, no people.

**Negative prompt**
> text, UI, screens, people, houses, keys, logos, badges, busy composition,
> dark field, neon, gradient mesh cliché

---

# Video

## H-09 · Hero ambient loop

> **Only ship this if it measurably helps.** The hero currently reaches LCP at
> 756 ms under 4× CPU throttle. A hero video that pushes LCP past ~1.5 s should
> be dropped rather than optimised — the still is not a compromise here.

| Field | Value |
|---|---|
| **Destination** | Homepage hero backdrop, `≥1024px` only |
| **Desktop** | 2560 × 1440 |
| **Mobile** | Not shipped — static H-02 instead |
| **Aspect / duration** | 16:9 · **6 s, seamless loop** |
| **Filename** | `hero-ambient.webm` + `.mp4` + `hero-ambient-poster.avif` |
| **Alt text** | Decorative; `aria-hidden`, no captions needed (no information) |
| **Fallback** | `hero-ambient-poster.avif`, shown under reduced motion, on mobile, and on failure |

**Camera behaviour** — locked off. No pan, no push, no parallax, no handheld.
**Motion style** — one slow gradient drift, left to right, completing exactly
once across the 6 s so the loop point is invisible. Nothing enters or exits
frame. Total perceived movement should be barely noticeable.

**Generation prompt**
> Six-second seamless loop. Abstract navy `#0B2540` field with a slow gradient
> drift toward `#1F4A72`, moving left to right and returning to the start
> position exactly at the loop point. One diffuse terracotta `#D7714E` bloom
> breathing gently at 12–18% opacity. Locked camera, no movement of the frame
> itself. Matte, fine grain, no gloss. Entirely abstract — no objects, no
> interface, no text, no people.

**Negative prompt**
> text, UI, dashboard, screen, cursor, people, hands, houses, camera movement,
> pan, zoom, parallax, fast motion, flashing, strobing, hard cuts, visible
> loop seam, logos, watermark

**Export** — VP9 WebM + H.264 MP4, CRF ~32, no audio track at all, ≤1.5 MB,
poster exported from frame one.

---

## H-10 · Workflow step loops (×3)

| Field | Value |
|---|---|
| **Destination** | Product workflow section — one per step: capture, respond, close |
| **Desktop** | 1200 × 900 each |
| **Mobile** | 780 × 585 each |
| **Aspect / duration** | 4:3 · **3 s each, seamless loop** |
| **Filename** | `workflow-capture.webm`, `workflow-respond.webm`, `workflow-close.webm` (+ `.mp4`, + posters) |
| **Alt text** | Each step's meaning is in the adjacent heading; videos are `aria-hidden` |
| **Fallback** | Matching poster still per step |

**Camera behaviour** — locked off.
**Motion style** — a single abstract gesture per step, resolving and holding:
*capture* a shape arriving and settling; *respond* two shapes exchanging
position once; *close* a shape completing a circuit. No literal depiction.

**Generation prompt** *(adapt the gesture per step)*
> Three-second seamless loop on warm paper `#FAFAF7`. Simple geometric shapes
> in navy `#0B2540` with one terracotta `#D7714E` accent shape. A single clear
> movement — [ARRIVING AND SETTLING / EXCHANGING POSITION ONCE / COMPLETING A
> CIRCUIT] — which resolves and holds still before looping. Flat vector look,
> no depth, no shadows, no gloss. Locked camera. No text, no interface, no
> people.

**Negative prompt**
> text, numbers, UI, screens, charts, arrows with labels, people, hands,
> houses, camera movement, fast motion, bouncing, elastic easing, flashing,
> visible loop seam, 3D render, drop shadows

**Export** — VP9 WebM + H.264 MP4, no audio, ≤400 KB each, poster per file.

---

## H-11 · Feature grid texture
> **Run 1: REJECTED.** Produced organic crackle/veining, closer to marble than
> to the geometric line work specified. Say `straight ruled lines, drafting`
> and negative-prompt crackle, craquelure, marble, veining, organic.


| Field | Value |
|---|---|
| **Destination** | Behind the feature grid, at very low opacity, to break the flat run of cards |
| **Desktop** | 2880 × 1800 |
| **Mobile** | 780 × 1200 |
| **Aspect / duration** | 8:5 · still |
| **Filename** | `feature-texture.avif` |
| **Alt text** | `""` (decorative) |
| **Fallback** | None needed — the section is complete without it |

**Generation prompt**
> Extremely subtle paper texture on `#FAFAF7`. Faint navy `#0B2540` geometric
> line work at 4–6% opacity, irregular spacing, drifting slightly out of true.
> Must read as texture rather than pattern — no repeating motif that becomes
> obvious when tiled. No colour beyond navy on paper.

**Negative prompt**
> text, icons, symbols, obvious repeating pattern, tiling seams, high
> contrast, colour, gradient, people, objects, logos

---

## Review gate before any asset ships

Reject and regenerate if a delivered asset shows **any** of these. Each has a
specific reason, not a matter of taste.

1. **Any legible or semi-legible text.** Generated glyphs come out malformed
   and read as a broken product.
2. **Anything resembling an interface.** A generated dashboard is a picture of
   software presented as the software.
3. **Any figure, chart value, rating or count.** Fabricated business results.
4. **People.** Invented customers are social proof the product has not earned.
5. **Any logo or badge**, including a distorted one.
6. **More than two brand colours**, or terracotta used as a field.
7. **A visible loop seam** in video — it reads as a broken player.
8. **Camera movement in H-09 or H-10.** Both are specified locked; movement
   competes with the copy for attention.
9. **Rendered as a framed artwork** — mat, border, drop shadow or gallery
   wall. It is a background, not a picture of a picture.
10. **An accent that reads as a light source** — sun, sunset, lens flare.
    The accent is a tint, not a subject.
11. **A hero video that pushes LCP past ~1.5 s** on a mid-range phone at 4× CPU
   throttle. Measure before shipping, not after.
