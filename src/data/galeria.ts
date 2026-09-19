/**
 * Galería del país: una fotografía por pantalla, pensada para el bloque
 * `FullGallery`. Vivía dentro de `HomePage` hasta el 2026-07-29, cuando Sergio
 * sacó el carrusel de la portada para colocarlo en otra página todavía por
 * decidir. Se guarda aquí —y no en la página— precisamente porque ya no tiene
 * página: cuando se decida el destino basta con importarla.
 *
 *   import { FullGallery } from '../components/ui/FullGallery'
 *   import { GALERIA } from '../data/galeria'
 *   <FullGallery fotos={GALERIA} auto={3000} />
 *
 * Las rutas van directas a public/images y no por `Pic`: aquí la foto concreta
 * importa, no es un motivo intercambiable.
 */
export interface FotoGaleria {
  src: string
  pie: string
  alt: string
}

export const GALERIA: FotoGaleria[] = [
  { src: '/images/ait-ben-haddou.webp', pie: 'Aït Ben Haddou', alt: 'Ksar de Aït Ben Haddou al atardecer' },
  { src: '/images/dunas-erg-chebbi.webp', pie: 'Erg Chebbi', alt: 'Dunas del Erg Chebbi' },
  { src: '/images/medina.webp', pie: 'Medina de Marrakech', alt: 'Calle de la medina de Marrakech' },
  { src: '/images/todra-garganta.webp', pie: 'Gargantas del Todra', alt: 'Paredes verticales de las gargantas del Todra' },
  { src: '/images/kasbah-taourirt.webp', pie: 'Kasbah Taourirt', alt: 'Kasbah Taourirt en Ouarzazate' },
  { src: '/images/essaouira-puerto.webp', pie: 'Essaouira', alt: 'Barcas azules en el puerto de Essaouira' },
  { src: '/images/dades-kasbah.webp', pie: 'Valle del Dadés', alt: 'Kasbah de adobe en el valle del Dadés' },
  { src: '/images/jemaa-el-fna.webp', pie: 'Jemaa el-Fna', alt: 'Plaza de Jemaa el-Fna al anochecer' },
]
