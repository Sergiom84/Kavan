# Kavan con el lenguaje de Horizonte Village

Copia de trabajo de Kavan para probar un tercer enfoque visual, junto a
`visual/editorial-sahara` y `codex/sahara-editorial-visual`.

- **Base:** `visual/editorial-sahara`, commit `9dbbf87` (*Rediseño visual editorial
  de la Home y del sistema de estilos*).
- **Rama:** `horizonte/restyle`. El commit `a36df5c` es la foto de partida sin tocar,
  así que `git diff a36df5c` enseña exactamente qué cambia el restyle.
- **Referencia:** `../ESTRUCTURA.md` — estructura y sistema de diseño de
  `horizonte-village.com`, extraídos con `/extract-design` y navegador headless.

El proyecto original en `Aplicaciones/Kavan` no se ha tocado.

---

## Las tres decisiones que definen el resultado

**1. El root escala con el ancho de pantalla.**

```css
:root { --viewport: 1440 }
html  { font-size: calc(16 / var(--viewport) * 100vw) }
@media (max-width: 1023px) { :root { --viewport: 375 } }
```

Copiado literal del original (`entry`, bloque `<style>` de `index.html`).
Todo el sistema está en `rem` contra una maqueta de 1440px, así que la página
entera crece y encoge en proporción en lugar de reflowear. Sin clamp, igual
que Horizonte.

**2. Cuatro colores.**

| Token | Valor | Uso |
|---|---|---|
| `--c-base-0` | `#dfd8cf` | fondo crema |
| `--c-base-1000` | `#304143` | texto, verde petróleo |
| `--c-brand-500` | `#21343e` | marca |
| `--c-pure-white` | `#fff` | sobre fotografía |

Monocromo: desaparecen la terracota y el sol del desierto. El contraste se
consigue invirtiendo fondo y texto, no metiendo un color de acento.

**3. Material plano.**

Cero sombras, cero redondeos salvo círculos. La profundidad la dan los dos
únicos gradientes del sistema (`--scrim-top`, `--scrim-bottom`), siempre sobre
fotografía y siempre para que se lea el texto.

---

## Tipografía

| | Antes | Ahora |
|---|---|---|
| Familia | Fraunces (una sola) | Canela Thin + ApercuMono |
| Peso de titular | 620 | 100 |
| Interlineado de titular | 1.02 | 100% |
| Caja | normal | versales |
| Tracking | -0.035em | -0.006em (h1) · -0.009rem (h2) |
| Texto corrido | Fraunces 16px | ApercuMono 12px, 133.3% |

Serif ligera para todo lo que titula, mono para todo lo demás. Escala calcada
del original (px sobre maqueta de 1440): h1 48 · h2 24 · texto y rótulo 12.
Se añade `--text-display` a 96px, que no existe en Horizonte, para el titular
de portada.

> ### Licencias
>
> **Canela** (Commercial Type) y **ApercuMono** (Colophon) son tipografías
> comerciales. Los archivos en `public/fonts/` salen del volcado del sitio
> original y están aquí para poder juzgar el diseño con la tipografía real.
> **No se pueden publicar sin licencia.** Para producción: licenciarlas, o
> volver a las sustitutas libres más cercanas — Cormorant Garamond y
> JetBrains Mono — cambiando `--canela` y `--apercu-mono-pro` en `tokens.css`.

## Densidad

Es la otra mitad del parecido, y la que más se nota. Las secciones de
Horizonte miden entre 34rem y 71.5rem de alto, con 8.5rem de padding
vertical. Kavan venía de 6.5rem. Los tokens `--section-tall`,
`--section-mid` y `--media-tall` recogen esas medidas.

## Movimiento

Un solo easing, `cubic-bezier(0.16, 1, 0.3, 1)`, y tres duraciones: 0.4s para
interfaz, 0.6s para imagen, 0.8s para revelados. Toda foto dentro de un enlace
o tarjeta hace un zoom lento a 1.12.

---

## Qué se ha tocado

| Archivo | Cambio |
|---|---|
| `src/styles/tokens.css` | reescrito: paleta, escala fluida, movimiento, capas |
| `src/styles/global.css` | root fluido, versales, mono en interfaz, velos, zoom de foto, botones |
| `index.html` | fuentes |
| `src/pages/HomePage.css` | velos verticales, titular a tamaño de héroe |
| `src/components/ui/PageHero.css` | mismos velos que la portada |
| `src/components/fx/StatGrid.css` | cifra grande, filete continuo |
| `src/components/layout/Header.css` | altura en rem, mono en navegación, sin desenfoque |
| `src/components/fx/DunesVideoModal.css` | sin sombra, sin desenfoque |
| Barrido en todo `src/**/*.css` | velos marrones → negro neutro · cremas → blanco · píldoras → ángulo recto · punteados → continuos |

Ningún componente `.tsx` ha cambiado: el restyle es íntegramente de hojas de
estilo. Los nombres de token antiguos (`--font`, `--accent`, `--ease-out`,
`--shadow-card`) se conservan como alias para que nada se rompa.

## Dónde me he separado de Horizonte, y por qué

1. **La prosa se queda en caja baja.** Horizonte pone versales casi en todo,
   pero su copy son rótulos cortos en inglés. El de Kavan son párrafos largos en
   español y en versales no se leerían. Las versales quedan para titulares y
   rótulos.
2. **Tamaño de héroe propio (`--text-display`, 96px).** El `.h1` de Horizonte
   son 48px; en una portada de viajes se queda corto. Es la única incorporación
   a la escala.
3. **Clamp en el root.** Horizonte escala sin límites. El clamp evita texto
   ilegible en pantallas pequeñas y desproporcionado en un ultrawide.
4. **No se ha replicado el hero de secuencia en canvas.** Los ~200 WebP de
   Horizonte bloquean su página entera tras un preloader hasta el 100%. Es su
   mayor problema de rendimiento y no compensa copiarlo.

## Verificación

- `npm run build` — compila sin errores (tsc + vite).
- Capturas antes/después en `_restyle-evidencia/` a 1440, 768 y 390.
- Rutas comprobadas: `/`, `/packs`, `/destinos`, `/puntos-de-interes`, `/consejos`.
- Consola: sólo avisos de GSAP por objetivos inexistentes, los mismos 9 que ya
  daba el original. No hay errores.

## Pendiente si esto sigue adelante

- No hay `.env`, así que los datos de Supabase no cargan. Con credenciales
  habría que revisar las páginas de detalle y reserva, que no se han podido ver.
- Faltan las páginas `/reserva`, `/tu-viaje`, `/el-viaje`, `/detalles` y
  `/ciudad/*` en la revisión visual.
- Cormorant Garamond es una sustituta razonable de Canela, pero si el proyecto
  va en serio conviene licenciar Canela o buscar una serif de peso 100 real.

## Cómo verlo

```bash
cd Kanvan_Horizonte-village && npm run dev
```
