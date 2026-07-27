# Project Working Rules — Kavan (travel agency, Morocco)

## Role

Act as a senior engineer and visual design partner for this repository. Make the
requested change work inside the project's existing architecture and make the
result intentional, maintainable, accessible, and responsive.

## Stack

React 19 + Vite + TypeScript, `react-router`, `@tanstack/react-query`, GSAP
(ScrollTrigger, Flip), Lenis for smooth scroll. Supabase (Postgres + RLS + Storage)
as backend — the app works without credentials using the local seed catalogue
(`src/data/seed.ts`); with `.env.local` configured, quotes also insert into the
`quotes` table. Deploy target: Render Static Site.

## Before changing anything

1. Inspect the repository structure, package scripts, current stack, and this file.
2. Read `design-system/MASTER.md` — it is the visual source of truth for this
   project and records both the approved direction and the current implementation
   status. Do not introduce tokens, fonts, or visual rules that contradict it.
3. Read `RESTYLE.md` and `KANVAN_PREMIUM_AUDIT.md` before repeating prior restyle
   work — there is real history here across multiple branches
   (`horizonte/restyle`, `visual/editorial-sahara`, `codex/sahara-editorial-visual`).
4. Define the smallest implementation unit that proves the requested outcome.

## Hard client rules (non-negotiable, confirmed by Sergio)

- All pages follow **Cabecera → Hero → page-specific blocks → Footer**, EXCEPT
  pages 9 (`/reserva/:slug`), 11 (`/packs/:slug` hub), 12 (`/viaje/:quoteId`), and
  13 (itinerary tab inside 12), which have their own layout.
- Maximum 3 text sizes (título / subtítulo / texto), 1-2 type families, never the
  usual defaults (Inter, Roboto, Arial, system-ui are out).
- Zero emojis anywhere in the interface.
- Zero explanatory microcopy (e.g. no "tap here to pay" style helper text) — the
  interface must explain itself through hierarchy.
- Keep spacing tight between blocks — do not default to generous whitespace between
  sections; this project intentionally prioritizes density over breathing room.

## Design rules

- Follow `design-system/MASTER.md` first, then `design-system/anti-ai-ui.md` for the
  general quality filter (only where it doesn't conflict with the hard client rules
  above — MASTER.md wins on density and card usage).
- Reuse the canonical components, tokens, and layout patterns already present.
- The visual reference is Horizonte Village for layout/rhythm/motion only — never
  for color or typography. Color and typography come from `design-system/MASTER.md`
  (Sahara/terracotta palette, Cormorant Garamond + JetBrains Mono).
- Do not clone reference websites. Extract hierarchy, rhythm, density, interaction
  patterns, and responsive behavior, then reinterpret them for this product.
- Treat mobile as a dedicated design pass, not a compressed desktop layout.
- Respect `prefers-reduced-motion`.

## Tool routing

- Use `extract-design` to extract visual DNA from new references.
- Use `ui-ux-pro-max` or the project's approved design-review workflow for UI/UX
  decisions and audits.
- This project already uses GSAP (ScrollTrigger, Flip) and Lenis — use the GSAP
  skills when extending motion; do not introduce a second animation library.
- Use Playwright or an approved QA workflow to verify desktop and mobile behavior.
- Use July for project context and operational memory when available.

## Implementation rules

- Keep the change within the approved scope.
- Avoid unnecessary dependencies and speculative abstractions.
- Preserve existing behavior unless the request explicitly changes it.
- Prices are currently demo data from `src/data/seed.ts` / `src/lib/pricing.ts`.
  Demo prices may be shown but must be clearly marked as demo — real prices arrive
  later as data updates, not code changes.
- Do not expose secrets or copy values from `.env.local` into documentation.

## Verification

Run `npm test` (pricing engine tests), `npm run build` (tsc -b && vite build), and
review the diff. For UI work, verify at least one desktop and one mobile viewport
and inspect interactive states.

Report:

- what changed;
- what was verified;
- assumptions or unresolved limits;
- any follow-up that is genuinely outside the current scope.
