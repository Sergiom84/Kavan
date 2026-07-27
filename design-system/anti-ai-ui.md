# Anti-Generic UI Rules

This document is a quality filter, not a substitute for the project's design system. The project's `design-system/MASTER.md` remains the source of truth for concrete tokens and brand decisions.

## Typography

- Choose type deliberately for the product's voice and reading conditions.
- Avoid defaulting to Inter, Roboto, Arial, Helvetica, or a system stack as the primary brand choice unless the project requires it.
- Use a controlled pairing: one strong display face, one readable body face, and an optional utility or mono face only when it has a purpose.
- Do not solve weak hierarchy by adding more weights, larger subtitles, or more uppercase labels.

## Color

- Do not default to purple-on-white SaaS gradients, pastel rainbow palettes, or arbitrary accent colors.
- Define a small, coherent system for background, surfaces, text, muted text, borders, accents, and semantic states.
- Color should support hierarchy, brand feeling, and readability rather than decorate empty space.

## Layout and density

- Do not use a generic centered hero followed by identical feature-card rows unless the product genuinely calls for it.
- Use whitespace, alignment, rhythm, and intentional asymmetry as design tools.
- Match density to the user's task. A travel catalogue, a dashboard, and an editorial landing page should not share the same skeleton by default.
- Do not make every section visually identical.

## Cards and surfaces

- Cards are one tool, not the default container for every idea.
- When cards are needed, decide their radius, border, surface, shadow, density, hover behavior, and internal spacing as one system.
- Avoid oversized shadows, floating white rectangles, generic icons, and nested cards without a clear information hierarchy.

## Motion

- Motion must clarify hierarchy, feedback, continuity, or brand character.
- Prefer a small number of coherent transitions over a catalogue of effects.
- Avoid bouncing, glowing, cursor effects, scroll-jacking, aggressive parallax, and animation used to compensate for weak layout.
- Implement a reduced-motion fallback.

## Copywriting

- Avoid vague AI-style phrases such as "Transform your experience", "Unlock your potential", "Seamless solutions", "Powerful features", and "Everything you need".
- Prefer concrete language, short confident headings, specific benefits, and copy that reflects the real product.
- Do not add explanatory microcopy that describes obvious interface actions unless the user genuinely needs the explanation.
- Do not use emojis as a substitute for hierarchy, iconography, or tone.

## Imagery and references

- Study references for composition, proportion, type, spacing, color relationships, interaction rhythm, and responsive behavior.
- Do not copy logos, proprietary illustrations, exact copy, distinctive protected identity elements, or assets without permission.
- Rebuild the underlying logic inside the project's own visual language.

## Responsive quality

- Treat mobile as a dedicated design pass.
- Decide what hides, reorders, simplifies, becomes full width, loses decoration, or changes motion.
- Check touch targets, reading measure, focus states, overflow, and interaction reachability.

## Final filter

Before shipping, ask:

1. Could this page have been generated from a generic SaaS prompt?
2. Is there a clear visual point of view?
3. Do typography, color, spacing, imagery, and motion reinforce one another?
4. Does the interface explain itself through hierarchy rather than filler text?
5. Does mobile feel designed rather than squeezed?
