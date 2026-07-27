# Kavan — Web de viajes a Marruecos

Web de agencia de viajes: el usuario elige un pack, lo personaliza (fechas, habitaciones, categoría de hotel) y obtiene una cotización. Sin pago online: la reserva se cierra por WhatsApp o correo.

## Stack

- **Frontend**: React 19 + Vite + TypeScript, `react-router`, `@tanstack/react-query`, GSAP (ScrollTrigger, Flip) y Lenis. Estilos con CSS variables ([tokens](src/styles/tokens.css)) — dos familias tipográficas y tres tamaños, paleta Sáhara.
- **Backend**: Supabase (Postgres + RLS + Storage). La app funciona sin credenciales con el catálogo local de [seed.ts](src/data/seed.ts); con `.env.local` configurado, las cotizaciones se insertan además en la tabla `quotes`.
- **Deploy**: Render Static Site ([render.yaml](render.yaml)).

## Desarrollo

```bash
npm install
npm run dev        # http://localhost:5173
npm test           # tests del motor de precios
npm run build      # producción en dist/
```

## Mapa de páginas (numeración del cliente)

| # | Ruta | Página |
|---|------|--------|
| 1 | `/` | Home |
| 2 | `/destinos` | Descubre Marruecos |
| 3 | `/destinos/:slug` | Ciudad / actividad-destino |
| 4 | `/packs` | Todos los viajes |
| 5 | `/puntos-de-interes` | Puntos de interés |
| 6 | `/packs/:slug/itinerario` | Itinerario del pack |
| 7 | `/packs/:slug/detalles` | Detalles / qué incluye |
| 8 | `/packs/:slug/viaje` | El viaje (ficha completa) |
| 9 | `/reserva/:slug` | Crea tu viaje (layout propio) |
| 10 | `/consejos` | Consejos Marruecos |
| 11 | `/packs/:slug` | Hub del pack (nueva) |
| 12 | `/viaje/:quoteId` | Tu viaje comienza (nueva, layout propio) |
| 13 | — | Itinerario embebido (pestaña de la 12) |

## Reglas del cliente

1. Páginas estándar: Cabecera → Hero → bloques → Footer (excepto 9, 11, 12, 13).
2. Máximo tres tamaños de texto (título / subtítulo / texto) y una o dos familias, nunca las habituales (Inter, Roboto, Arial, system-ui quedan descartadas). Implementado con **Cormorant Garamond** (títulos) y **JetBrains Mono** (texto y etiquetas), autoalojadas en `public/fonts/` bajo licencia SIL OFL. La dirección visual completa está en [design-system/MASTER.md](design-system/MASTER.md).
3. Cero emojis.
4. Cero microcopys explicativos.

## Datos

- Contenido de demostración en [src/data/seed.ts](src/data/seed.ts). Las imágenes son ilustraciones SVG generativas ([Pic.tsx](src/components/ui/Pic.tsx), tokens `art:motivo:semilla`); se sustituyen por fotos reales guardando URLs http.
- Esquema completo de Supabase en [supabase/migrations/0001_initial_schema.sql](supabase/migrations/0001_initial_schema.sql) y seed espejo en [supabase/seed.sql](supabase/seed.sql). Guía de puesta en marcha: [supabase/config.example.md](supabase/config.example.md).
- Motor de precios en [src/lib/pricing.ts](src/lib/pricing.ts): tarifa por persona + suplemento hotelero por persona y noche. Los precios reales llegarán más adelante: son UPDATEs de datos, no cambios de código.

## Fase posterior prevista

Panel de administración (patrón FreeExperience): tabla `admins`, RPC `is_admin()`, edición de contenido e imágenes vía Storage. El esquema ya lo deja preparado (RLS de escritura `is_admin()` en todas las tablas de contenido).
