# Design QA — Hero logo and compact desired trips

## Evidence

- Source visual truth:
  - `C:\Users\sergi\AppData\Local\Temp\codex-clipboard-cf27f523-0839-4c54-b9ab-9fb29c665f80.png` — requested hero logo relationship to the dunes, 1857×860 px.
  - `C:\Users\sergi\AppData\Local\Temp\codex-clipboard-7beff9d7-2e16-460c-9f08-dfcefd051fe5.png` — compact three-column block with complete copy, 1840×766 px.
  - `C:\Users\sergi\AppData\Local\Temp\codex-clipboard-9aa4b93c-4f82-4ec9-aa74-88155f57cc8f.png` — requested rectangular image proportion and text density, 1838×730 px.
- Browser-rendered implementation:
  - `C:\Users\sergi\AppData\Local\Temp\kavan-design-qa\implementation-hero-logo-1cm-desktop.png` — desktop hero, 1858×860 viewport.
  - `C:\Users\sergi\AppData\Local\Temp\kavan-design-qa\implementation-packs-compact-desktop.png` — first three complete journeys, 1858×860 viewport.
  - `C:\Users\sergi\AppData\Local\Temp\kavan-design-qa\implementation-packs-last-two-desktop.png` — carousel end exposing both added journeys.
  - `C:\Users\sergi\AppData\Local\Temp\kavan-design-qa\implementation-packs-single-band-desktop.png` — final zero-gap photographic band.
  - `C:\Users\sergi\AppData\Local\Temp\kavan-design-qa\implementation-hero-logo-1cm-mobile-390x844.png` and `implementation-packs-compact-mobile-390x844.png` — dedicated mobile pass.
  - `C:\Users\sergi\AppData\Local\Temp\kavan-design-qa\implementation-packs-single-band-mobile-top-390x844.png` — zero-gap mobile carousel state.

## State and interactions tested

- Fresh load at scroll zero and settled Lenis position.
- Hero logo placement against the central main dune crest.
- Five-trip carousel at its start and end positions.
- Previous/next controls, keyboard focus and complete card copy.
- Desktop 1858×860 and mobile 390×844.
- Horizontal document overflow and carousel-contained overflow.
- Tests, production build and whitespace diff.

## Full-view comparison evidence

- The logo is no longer positioned by an arbitrary five-centimetre translation. Its visible lower edge is anchored approximately one CSS centimetre above the central dune crest while preserving the supplied logo size and hero crop.
- The desired-trips block now follows the supplied compact composition: three adjacent elongated photographs, narrow internal gaps, larger outer margins and the full descriptive/decision text within the same viewport-height block.
- The carousel contains all five existing journeys. Its final position shows `Gran Tour del Sur` and `Essaouira y la Costa` without inventing destinations, copy or prices.

## Focused region comparison evidence

- Desktop logo DOM bounds: 141.95–430.90 px. Accounting for the transparent bottom of the PNG, the visible gold edge lands near 411 px; the central main dune crest is near 449 px.
- Desktop showcase: side margins approximately 92.9 px, zero-pixel seams between photographs, card width approximately 552.45 px and an 8:5 image ratio. The three images form one uninterrupted band.
- Mobile showcase: first card width 286.86 px, image height 179.29 px and body height 147.25 px. The next card remains partially visible as a carousel cue, without document overflow.
- Carousel maximum scroll position measured 1111 px; at that state the third, fourth and fifth journeys are visible and the controls remain operable.

## Required fidelity surfaces

- Typography, palette and image assets remain the existing Kavan system.
- No new trip data, price or city label was invented; the two additional entries already existed in the seed catalogue.
- Existing `Carousel` and `PackCard` components are reused.
- Image proportion changes only in the Home showcase; catalogue cards elsewhere are unchanged.
- Mobile layout uses a single-card horizontal rail with a visible next-card cue.
- Reduced-motion behavior remains owned by the existing motion components; the carousel does not autoplay.

## Findings

- No actionable P0, P1 or P2 mismatch remains.
- P3: “one centimetre” is implemented as one CSS centimetre relative to a calibrated hero focal point; physical screen size and browser zoom can change its real-world perceived distance.

## Comparison history

1. The supplied current block used tall 4:5 images, consumed too much vertical space and exposed only three journeys.
2. The Home showcase changed to 8:5 images, compact body spacing and an existing five-item carousel.
3. Desktop and mobile comparison confirmed three close cards on desktop, complete card text, both additional journeys, stable logo placement and no horizontal document overflow.
4. The remaining 5 px seam was removed. Final DevTools measurements report `gap: 0px`, shared image edges and zero document overflow on desktop and mobile.

## Implementation checklist

- [x] Lower the large hero logo to approximately one centimetre above the dunes.
- [x] Keep rectangular elongated trip images while reducing their height.
- [x] Show image and complete text in the same compact block.
- [x] Keep three desktop cards close together with larger outer margins.
- [x] Include two additional existing journeys.
- [x] Preserve responsive behavior, accessibility and reduced motion.
- [x] Verify desktop, mobile, carousel controls, overflow, tests and production build.

## Addendum — Zagora map typography

- Source: `C:\Users\sergi\AppData\Local\Temp\codex-clipboard-213da09c-7b8d-437d-9587-e69a0b5d244e.png`, supplied map crop at 1362×526 px.
- Implementation: `C:\Users\sergi\AppData\Local\Temp\kavan-design-qa\implementation-map-zagora-typography-desktop.png`, desktop map state at 1440×900 px.
- The comparison used the same closed-marker state and the same map region. The surrounding page chrome is outside the fidelity target.
- Zagora now uses the project's loaded Cormorant Garamond Regular at 24 px, weight 400, uppercase and -0.01em tracking. Its visible cap height and serif contrast match the baked destination labels closely enough that no regenerated map asset is required.
- The existing Zagora position, marker, hover/focus image, click-outside dismissal and Escape dismissal remain unchanged.
- Browser console: zero warnings or errors in the verified state.
- Remaining P3: the original labels are rasterized into the map while Zagora remains live HTML, so subpixel antialiasing can differ slightly at non-native zoom levels.

final result: passed
