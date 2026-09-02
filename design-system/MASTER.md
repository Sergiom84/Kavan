# Project Design System Master — Kavan (web de viajes a Marruecos)

> Este archivo documenta la dirección visual y el estado actual del proyecto. La rama
> `cowork/kavan-village` mantiene la estructura, el ritmo y el lenguaje de motion de
> Horizonte Village, pero la implementación actual ya usa la paleta Sáhara y las
> fuentes Cormorant Garamond + JetBrains Mono descritas aquí.

## Project identity

- Product: agencia de viajes a Marruecos — el usuario elige un pack, lo personaliza
  (fechas, habitaciones, categoría de hotel) y obtiene una cotización. Sin pago
  online: la reserva se cierra por WhatsApp o correo.
- Audience: viajero que busca un producto premium, curado, no low-cost genérico.
- Primary task: descubrir un pack, entenderlo, personalizarlo, pedir cotización.
- Core feeling: editorial, cálido, terroso — un catálogo de viajes con calidad de
  revista, no una landing SaaS de reservas.
- Three words that describe the experience: editorial, cálido, preciso.
- Three words to avoid: genérico, saturado, decorativo.

## Visual references

- Reference A: [Horizonte Village](https://horizonte-village.com) — **solo** para
  layout, ritmo de composición, densidad y animaciones/motion (GSAP, Lenis). No para
  color ni tipografía.
- Reference B: rama propia `visual/editorial-sahara` de este mismo repo (commit
  `9dbbf87`) — fuente de la paleta terrosa/Sáhara y de la lógica "una familia
  tipográfica, tres tamaños".
- Reference C: `RESTYLE.md` — historial completo de decisiones del restyle Horizonte,
  incluyendo qué se copió literal y qué se descartó.
- What to extract from Horizonte: escalado fluido del root contra maqueta de 1440px,
  material plano (cero sombras, cero radios salvo círculos), gradientes solo sobre
  fotografía para legibilidad, ritmo de secciones.
- What not to copy: su paleta monocroma (crema/verde petróleo) y sus tipografías
  comerciales (Canela, ApercuMono) — sustituidas según decisión del cliente/Sergio,
  ver abajo.

## Typography

- Display / heading family: **Cormorant Garamond** — sustituta libre de Canela,
  misma familia de sensación serif editorial sin coste de licencia.
- Body / label family: **JetBrains Mono** — sustituta libre de ApercuMono, mismo rol
  técnico/mono para texto corrido y etiquetas.
- Utility / mono family: no aplica — JetBrains Mono cubre ambos roles.
- Approved weights: mantener un peso por rol (no coleccionar variantes); definir el
  peso final al implementar, siguiendo el espíritu "un peso, no una escala completa"
  que ya usaba Canela Thin en Horizonte.
- Case and tracking: mantener el criterio editorial del restyle (versales en algunos
  titulares, tracking negativo sutil en h1/h2) — a definir en implementación.
- Body measure: seguir el criterio de `visual/editorial-sahara` (medidas de línea
  generosas, 52-62ch) para que el texto no se parta cada tres palabras.
- **Regla dura del cliente**: máximo 3 tamaños de texto (título / subtítulo / texto),
  1-2 tipologías, nunca las tipografías habituales (Inter/Roboto/Arial/system-ui
  quedan descartadas de raíz). Con 2 familias (Cormorant Garamond + JetBrains Mono)
  se respeta el límite.
- Accessibility notes: verificar tamaño mínimo legible de JetBrains Mono en texto
  corrido a 12-14px real en pantalla — el mono tiende a leerse más pequeño que un
  humanist sans al mismo tamaño nominal.

## Color system

Paleta fijada a partir de `visual/editorial-sahara` (valores exactos, ya diseñados
y probados en una rama real de este proyecto):

- Background (papel, el fondo de todo el sitio): `#f7f6f4` — **decisión de
  Sergio, 2026-09-01**: el blanco de Lucy Lara (`codex/lucy-lara-hero-redesign`,
  `.site-surface` / `bg-[#f7f6f4]`). Sustituye el crema `#ebe1cd` y el intento
  `#f6f3ee`, que se leían cálidos de más.
- Banda alterna de sección (un paso bajo el papel): `#efece8`.
- Surface secundaria (arena): `#d9bfa0`
- Surface terciaria (terracota clara): `#c9926a`
- Primary text (ink): `#2a2119`
- Secondary text: `color-mix(in srgb, var(--ink) 64%, transparent)`
- Muted text: `color-mix(in srgb, var(--ink) 40%, transparent)`
- Border: `color-mix(in srgb, var(--ink) 16%, transparent)`
- Border strong: `color-mix(in srgb, var(--ink) 32%, transparent)`
- Primary accent (terracota intensa, acciones/CTA): `#c4622d`
- Secondary accent (terracota profunda, hover): `#8a4b2b`
- Accent sun (sol del desierto, uso puntual): `#e2a13a`
- Card / superficie elevada: `#faf6ee`
- Success: `#4a6741`
- Error / danger: `#9d3c23`
- On-photo (rótulos sobre fotografía): `#f8f3ea`
- Contrast notes: verificar contraste AA de `--ink` sobre `bg-3`/`bg-4` (arena y
  terracota clara) antes de usar texto pequeño sobre esos fondos — son los tonos
  más claros de la escala y los que más riesgo tienen.

## Shape and density

- Radius philosophy: ángulos rectos — cero radio salvo elementos circulares
  deliberados (heredado de `visual/editorial-sahara`, coherente con el material
  plano de Horizonte).
- Border philosophy: líneas finas de baja opacidad (`--line`, `--line-strong`), no
  bordes gruesos ni sombras decorativas.
- Shadow philosophy: sombra mínima solo en tarjetas elevadas cuando aporte
  separación real, no como decoración por defecto.
- Container width: ancho generoso, casi a sangre — el contenido no vive en una
  columna estrecha (criterio ya establecido en editorial-sahara, `--container` amplio).
- Grid rhythm / Section rhythm: heredar el ritmo de secciones alto de Horizonte
  (secciones grandes, con transición clara entre bloques).
- Card density: **regla dura del cliente — no dejar mucho aire entre bloques**. Esto
  es una desviación deliberada respecto al espaciado generoso que usa Horizonte
  Village; priorizar densidad sobre respiración amplia en este proyecto.

## Components

- Header: común a (casi) todas las páginas — ver regla de estructura abajo.
- Hero: común a (casi) todas las páginas.
- Buttons: acento terracota (`--accent`) para acción primaria, hover a terracota
  profunda (`--accent-2`).
- Cards: usar con moderación — nunca como contenedor por defecto para cualquier idea
  (regla general de `anti-ai-ui.md`), y con espaciado interno ajustado a la regla de
  densidad del cliente.
- Forms: sin microcopy explicativo (ver Copy).
- Navigation: a definir en implementación, coherente con el header común.
- Footer: común a (casi) todas las páginas.
- Empty / loading / error states: usar el `Preloader` ya existente en el proyecto
  (`src/components/fx/Preloader.tsx`) como referencia de tono.

## Motion

- Entry motion / Scroll motion: GSAP + ScrollTrigger + Lenis, heredados del restyle
  Horizonte — mantener el lenguaje de motion ya validado en la Home actual.
- Hover / focus motion: sutil, sin rebote ni glow.
- Page transitions: a definir en implementación.
- Reduced-motion fallback: obligatorio (ver `web-workflow/design-system/anti-ai-ui.md`).
- Motions to avoid: parallax agresivo y scroll-jacking. No introducirlos.
- **Excepción aprobada (Sergio, 2026-07-27; retirada y repuesta el 2026-07-29):
  un único efecto de cursor.** El bloque de la frase sobre Marruecos en la Home
  (`ParticleClaim`) deshace el boceto en arena WebGL que reacciona a la inercia
  del puntero. Se retiró a mediodía del 2026-07-29 porque el tratamiento de
  entonces oscurecía el dibujo, y se repuso el mismo día una vez el boceto pasó
  a recorte con canal alfa y el efecto se recalibró en Lab-FX
  (`Partículas.labfx.json`). Los valores viven en `AJUSTES`, dentro de
  `fx/DesertParticles.ts`, y viajan como uniforms: se afinan sin tocar GLSL.
  Está acotado: sólo ese bloque, sólo en pantalla ≥1024px con puntero fino, y
  con estas condiciones de retirada — sin WebGL2, con `prefers-reduced-motion`
  o en móvil la frase se queda escrita y el motor ni se descarga (va en su
  propio chunk por import dinámico). **Fuera de ese bloque la regla sigue en
  pie: no hay efectos de cursor en ninguna otra parte del sitio.**

## Responsive behavior

- Mobile navigation / elementos ocultos o reordenados / spacing: pendiente de
  auditoría dedicada. La evidencia disponible hoy son las capturas de
  `_restyle-evidencia/` (`final-home-390x844.png`, `final-home-768x1024.png`):
  solo cubren la Home, el resto de rutas no tiene evidencia móvil.
- Full-width elements: heredar criterio de Horizonte (elementos a sangre en móvil).
- Decorative elements removed: a decidir por sección durante implementación.

## Copy and imagery

- Voice: concreta, editorial, sin relleno.
- **Regla dura del cliente**: 0 emojis en toda la interfaz.
- **Regla dura del cliente**: 0 microcopy explicativo del tipo "Aquí se pulsa para
  pagar" — la interfaz debe explicarse por jerarquía visual, no por texto de ayuda.
- Words or claims to avoid: ver lista genérica en `anti-ai-ui.md` ("Transform your
  experience", "Unlock your potential", etc.) — no aplica copy real del cliente
  todavía, mismo criterio de raíz.
- Image treatment: fotografía a sangre con scrim para legibilidad de texto (heredado
  de Horizonte). Contenido de demostración actual son ilustraciones SVG generativas
  (`src/components/ui/Pic.tsx`) — sustituir por fotos reales cuando estén disponibles.
- Content that must be real: precios (ver Open decisions — demo permitido pero
  marcado).

## Page structure rule (regla dura del cliente)

Todas las páginas siguen: **Cabecera → Hero → bloques específicos de la página →
Footer**, EXCEPTO las páginas 9 (`/reserva/:slug`), 11 (`/packs/:slug` hub), 12
(`/viaje/:quoteId`) y 13 (itinerario embebido en la 12), que tienen layout propio.

## Open decisions

- [ ] Pesos tipográficos exactos de Cormorant Garamond y tamaños finales en rem —
      definir al implementar, siguiendo la escala de `visual/editorial-sahara` como
      punto de partida (`--text-1/2/3`).
- [ ] Precios reales del cliente — mientras tanto, **se permite mostrar precios de
      demostración, siempre marcados como demo** (visual o internamente) para no
      enseñar cifras que luego cambien sin aviso.
- [ ] Auditoría móvil completa del flujo comercial (Home → Packs → Reserva → Tu
      Viaje → El Viaje) en 390/768/1024 — pendiente.
- [ ] Congelar qué commit/captura de `_restyle-evidencia/` se considera la
      referencia válida actual antes de seguir iterando.

## Estado de implementación

- [x] `src/styles/tokens.css` usa la paleta Sáhara/terracota definida arriba.
- [x] `src/styles/global.css` carga Cormorant Garamond y JetBrains Mono desde
      `public/fonts/`.
- [x] `index.html` precarga las nuevas fuentes.
- [x] `npm test` y `npm run build` pasan en el estado actual.
- [ ] Definir pesos tipográficos y tamaños finales en rem.
- [ ] Completar la auditoría móvil del flujo comercial.
- [ ] Congelar la captura/commit de `_restyle-evidencia/` que será la referencia válida.

Las fuentes antiguas de Canela/ApercuMono permanecen en `public/fonts/` como archivos
heredados no utilizados por la implementación actual. Su retirada es una limpieza
posterior independiente y no se hace automáticamente en esta fase.
