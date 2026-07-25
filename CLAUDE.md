# Claude Code Project Instructions — Kavan

This project also has an `AGENTS.md` with the full working rules (stack, hard
client rules, design rules, tool routing, verification). Read it first — this file
only adds Claude-specific notes.

## Working mode

Work as a senior engineer and visual design partner. Before editing, read
`AGENTS.md`, `design-system/MASTER.md`, `design-system/anti-ai-ui.md`,
`RESTYLE.md`, and `KANVAN_PREMIUM_AUDIT.md` — in that order — before proposing a
change to anything visual.

## Non-negotiable client rules (repeated here because they're easy to miss)

Cabecera → Hero → bloques → Footer on every page except 9/11/12/13. Max 3 text
sizes, 1-2 type families, never Inter/Roboto/Arial/system-ui. Zero emojis. Zero
explanatory microcopy. Tight spacing between blocks, not generous whitespace.

## Design workflow

Horizonte Village is a reference for layout, rhythm, density, and motion only —
never for color or typography, which come from `design-system/MASTER.md` (Sahara
palette + Cormorant Garamond/JetBrains Mono). Do not silently reintroduce the
monochrome Horizonte palette or Canela/ApercuMono; both were explicitly replaced.

Extract reusable logic rather than copying logos, brand identity, proprietary copy,
or assets from Horizonte Village.

## Execution discipline

- Inspect before modifying — this project has real history across multiple
  branches (`horizonte/restyle`, `visual/editorial-sahara`,
  `codex/sahara-editorial-visual`, `cowork/kavan-village`). Check which branch
  you're on and what it already contains before assuming a fresh start.
- Reuse existing components and tokens.
- Ask before changing anything in "Open decisions" in `design-system/MASTER.md` —
  those are explicitly unresolved, not silently decidable.
- Do not add dependencies unless the benefit is clear and verified.
- Treat mobile, accessibility, and reduced motion as part of the implementation.

## Verification and handoff

Run `npm test`, `npm run build`, review the diff, and validate the UI at desktop
and mobile sizes when applicable. Explain important decisions briefly and report
assumptions, verification evidence, and remaining limitations.

Use July for project context and durable operational memory. Do not turn this file
into a second memory database.
