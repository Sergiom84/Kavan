# Project Design System Master — Kavan (web de viajes a Marruecos)

> Este archivo documenta la dirección visual objetivo del proyecto. La rama actual
> (`cowork/kavan-village`, construida sobre `horizonte/restyle`) todavía implementa la
> paleta monocroma importada de Horizonte Village en `src/styles/tokens.css` — este
> documento define lo que debe implementarse a continuación, no lo que hay hoy en
> código. Ver "Estado de implementación" al final.

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

- Background (papel cálido): `#f5f0ea`
- Elevated surface (arena clara, fondo alterno de sección): `#ebe1cd`
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
- Motions to avoid: parallax agresivo, scroll-jacking, cursor effects — ninguno de
  estos está en el restyle actual; no introducirlos.

## Responsive behavior

- Mobile navigation / elementos ocultos o reordenados / spacing: pendiente de
  auditoría dedicada — ver `KANVAN_PREMIUM_AUDIT.md` § "Diseño móvil" para el
  detalle de qué rutas ya tienen evidencia (390×844) y cuáles no.
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
      Viaje → El Viaje) en 390/768/1024 — pendiente, señalada como Prioridad 2 en
      `KANVAN_PREMIUM_AUDIT.md`.
- [ ] Congelar qué commit/captura de `_restyle-evidencia/` se considera la
      referencia válida actual antes de seguir iterando (Prioridad 1 del informe).

## Estado de implementación (no confundir con la dirección objetivo de arriba)

A fecha de este documento, `src/styles/tokens.css` en la rama `cowork/kavan-village`
todavía usa la paleta monocroma de Horizonte (crema/verde petróleo) y las
tipografías Canela/ApercuMono. Este `MASTER.md` define el objetivo (paleta Sáhara +
Cormorant Garamond/JetBrains Mono); aplicar el cambio de tokens es trabajo de
implementación pendiente, fuera del alcance de esta sesión de documentación.
