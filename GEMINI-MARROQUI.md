# Exploración `visual/gemini-marroqui`

Rama de comparación frente a un restyle que respetara el wire rectangular
al pie de la letra. Base: `main` @ `796ee05`.

La estructura de página no cambia: cabecera → hero → bloques de información
→ carrusel de packs → mapa → footer. No se ha borrado ninguna sección ni
ruta.

## Cómo probar

```bash
npm install
npm run dev        # http://localhost:5173
npm test
npm run build
```

Rutas mínimas: `/`, `/packs`, `/destinos`, `/nosotros`, `/contacto`.

## Dependencias nuevas

No hay paquetes npm nuevos. Sólo assets locales:

| Asset | Uso |
|---|---|
| `public/fonts/Montserrat-Regular.woff2` | Cuerpo y rótulos (SIL OFL, latin) |
| `public/fonts/Montserrat-Medium.woff2` | Peso 500 puntual |
| `public/fonts/Marcellus-Regular.woff2` | Ya estaba; ahora es la familia de títulos |
| `public/images/dune-wash.svg` | Ondas/dunas beige de fondo |

Marcellus ya vivía en el repo. Cormorant Garamond y JetBrains Mono no se
cargan en esta rama.

## Archivos tocados

- Sistema: `src/styles/tokens.css`, `src/styles/global.css`, `index.html`
- Nuevo bloque: `src/components/ui/ImpactStrip.tsx` + `.css`
- Home y destinos: `HomePage.tsx`, `DestinosPage.tsx`
- Tarjetas y carril: `PackCard`, `PackShowcase`, `DiscoverMorocco`, `CityCard`
- Mapa: `MoroccoMap.tsx` + `.css`
- Chrome: `Header`, `Footer`, `AdvisorButton`
- Hero: `BurstGallery.tsx` (escala de profundidad 1.14)
- Texto de bloques: `MoroccoIntroduction.css`, `HomeQuickLinks.css`, `PageHero.css`, `HomePage.css`

## Desviaciones explícitas respecto al wire rectangular plano

Estas son las que hay que comparar con la rama estricta:

1. **Arcos marroquíes en la fotografía.** La celda/tarjeta externa sigue
   rectangular (radio 0). El recorte `--portico` (herradura superior) se
   aplica sólo a la foto: efecto ventana.
2. **Ondas/dunas de fondo.** `dune-wash.svg` en el `body` y en el pie.
   No desplazan el layout ni interceptan clics.
3. **Sombras difusas.** `--shadow-card` / `--shadow-card-hover` en packs,
   destinos, accesos rápidos y mapa. El wire plano no lleva sombra.
4. **Hover con zoom y elevación.** La foto escala ~1.10 y la tarjeta sube
   0.4 rem. Con `prefers-reduced-motion` se anula.
5. **Franjas full-width.** `ImpactStrip` a sangre, con puntos discretos,
   intercaladas en Home (Atlas/kasbahs y Atlántico/desierto) y en
   `/destinos`. Fes y Chefchaouen no están en el catálogo: se usan
   Ouarzazate, Ait Ben Haddou, Todra, Essaouira, Merzouga y Agafay.
6. **Profundidad al scroll.** El hero pasa de escala 1.06 a 1.14. El
   carrusel de packs conserva el pin GSAP existente.
7. **Pines dinámicos de marca.** Chinchetas CSS doradas/terracota sobre
   Marrakech, Merzouga, Essaouira y el resto del catálogo; pulso al hover.
8. **Tipografía y color.** Títulos Marcellus en dorado/terracota;
   descripciones Montserrat en dark slate `#2c353c`. El wire canónico
   usa Cormorant + JetBrains y tinta marrón.
9. **Papel beige `#F5EFEB`** en lugar del blanco puro de `main`.
10. **Nav sticky siempre visible.** Ya no se retira al despegar el hero.
    Al salir de la foto pasa a beige limpio, sin grano de cristal.
11. **Medallón dorado** alrededor del isotipo del botón de asesoría.

Lo que se conserva del wire: orden de bloques, cajas rectangulares de la
rejilla, navegación y contenidos, cero emojis, cero microcopy, dos
familias y tres tamaños de texto.
