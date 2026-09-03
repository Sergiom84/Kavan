import type { Activity, City, Pack, TravelTip } from '../lib/types'

/**
 * Contenido de demostración. Las imágenes usan tokens "art:<motivo>:<semilla>"
 * que renderiza el componente Pic como ilustración SVG. Al conectar Supabase
 * con fotos reales, basta con guardar URLs http en su lugar.
 */

export const cities: City[] = [
  {
    id: 'c-merzouga',
    slug: 'merzouga',
    name: 'Merzouga',
    shortDescription: 'Puertas del desierto del Sahara. Dunas doradas y cielos infinitos.',
    longDescription:
      'Merzouga es la entrada al Erg Chebbi, un mar de dunas que alcanza los 150 metros de altura. Aquí el día termina con el sol cayendo sobre la arena y comienza con un amanecer que lo cambia todo. Noches en jaima, paseos en dromedario y un silencio que no se olvida.',
    heroImageUrl: 'art:dunes:merzouga-hero',
    gallery: ['art:dunes:merzouga-1', 'art:camel:merzouga-2', 'art:jaima:merzouga-3', 'art:dunes:merzouga-4', 'art:stars:merzouga-5'],
    pois: [
      { id: 'p-erg', title: 'Erg Chebbi', description: 'El gran mar de dunas, imprescindible al amanecer.', imageUrl: 'art:dunes:erg-chebbi' },
      { id: 'p-khamlia', title: 'Khamlia', description: 'El pueblo de la música gnawa y sus ritmos ancestrales.', imageUrl: 'art:medina:khamlia' },
      { id: 'p-lago', title: 'Lago Dayet Srji', description: 'Flamencos y aves migratorias a las puertas del desierto.', imageUrl: 'art:oasis:dayet-srji' },
    ],
  },
  {
    id: 'c-ouarzazate',
    slug: 'ouarzazate',
    name: 'Ouarzazate',
    shortDescription: 'La puerta del desierto y del cine. Kasbahs, paisajes y cultura bereber.',
    longDescription:
      'Conocida como la puerta del desierto, Ouarzazate reúne kasbahs centenarias, estudios de cine donde se han rodado grandes producciones y una luz que atrae a viajeros y cineastas por igual. Desde aquí parten las rutas hacia el valle del Draa y las gargantas del Todra.',
    heroImageUrl: 'art:kasbah:ouarzazate-hero',
    gallery: ['art:kasbah:ouarzazate-1', 'art:arch:ouarzazate-2', 'art:kasbah:ouarzazate-3', 'art:oasis:ouarzazate-4', 'art:medina:ouarzazate-5'],
    pois: [
      { id: 'p-ait', title: 'Ait Ben Haddou', description: 'Ksar Patrimonio de la Humanidad, la kasbah más célebre del sur.', imageUrl: 'art:kasbah:ait-ben-haddou' },
      { id: 'p-atlas', title: 'Estudios Atlas', description: 'El gran plató de cine del desierto marroquí.', imageUrl: 'art:arch:atlas-studios' },
      { id: 'p-taourirt', title: 'Kasbah Taourirt', description: 'Laberinto de adobe en el corazón de la ciudad.', imageUrl: 'art:kasbah:taourirt' },
    ],
  },
  {
    id: 'c-marrakech',
    slug: 'marrakech',
    name: 'Marrakech',
    shortDescription: 'La ciudad roja que despierta los sentidos. Historia, tradición y vida vibrante.',
    longDescription:
      'Marrakech es un torbellino de color: la plaza de Jemaa el-Fna al atardecer, los zocos infinitos, los palacios y jardines que esconden siglos de historia. La ciudad roja es el punto de partida perfecto para entender Marruecos.',
    heroImageUrl: 'art:medina:marrakech-hero',
    gallery: ['art:medina:marrakech-1', 'art:arch:marrakech-2', 'art:oasis:marrakech-3', 'art:medina:marrakech-4', 'art:arch:marrakech-5'],
    pois: [
      { id: 'p-jemaa', title: 'Jemaa el-Fna', description: 'La plaza más viva de África, teatro al aire libre cada noche.', imageUrl: 'art:medina:jemaa' },
      { id: 'p-majorelle', title: 'Jardín Majorelle', description: 'El azul más famoso de Marruecos entre palmeras y cactus.', imageUrl: 'art:oasis:majorelle' },
      { id: 'p-bahia', title: 'Palacio de la Bahía', description: 'Patios, mosaicos y la elegancia de la arquitectura andalusí.', imageUrl: 'art:arch:bahia' },
    ],
  },
  {
    id: 'c-erfoud',
    slug: 'erfoud',
    name: 'Erfoud',
    shortDescription: 'Capital del oasis del Tafilalet. Fósiles, palmerales y hospitalidad.',
    longDescription:
      'Erfoud vive entre palmerales y yacimientos de fósiles marinos que cuentan la historia de un Sahara que fue océano. Es parada obligada camino de las dunas y un lugar donde probar los dátiles del Tafilalet, considerados de los mejores del mundo.',
    heroImageUrl: 'art:oasis:erfoud-hero',
    gallery: ['art:oasis:erfoud-1', 'art:dunes:erfoud-2', 'art:medina:erfoud-3', 'art:oasis:erfoud-4', 'art:arch:erfoud-5'],
    pois: [
      { id: 'p-fosiles', title: 'Talleres de fósiles', description: 'Mármoles con ammonites de hace 350 millones de años.', imageUrl: 'art:arch:fosiles' },
      { id: 'p-palmeral', title: 'Palmeral del Tafilalet', description: 'Uno de los oasis más extensos del norte de África.', imageUrl: 'art:oasis:tafilalet' },
      { id: 'p-rissani', title: 'Rissani', description: 'El zoco rural más auténtico de la región.', imageUrl: 'art:medina:rissani' },
    ],
  },
  {
    id: 'c-essaouira',
    slug: 'essaouira',
    name: 'Essaouira',
    shortDescription: 'La perla del Atlántico. Murallas, gaviotas y brisa marina.',
    longDescription:
      'Essaouira mira al océano desde sus murallas portuguesas. Ciudad de pescadores, artesanos y músicos, su medina blanca y azul invita a perderse sin prisa. El viento del Atlántico la convierte además en meca del windsurf y el kitesurf.',
    heroImageUrl: 'art:coast:essaouira-hero',
    gallery: ['art:coast:essaouira-1', 'art:medina:essaouira-2', 'art:coast:essaouira-3', 'art:arch:essaouira-4', 'art:coast:essaouira-5'],
    pois: [
      { id: 'p-skala', title: 'Skala de la Kasbah', description: 'Cañones frente al Atlántico y atardeceres de postal.', imageUrl: 'art:coast:skala' },
      { id: 'p-puerto', title: 'Puerto pesquero', description: 'Barcas azules y el mejor pescado a la brasa.', imageUrl: 'art:coast:puerto' },
      { id: 'p-medina-ess', title: 'Medina de Essaouira', description: 'Patrimonio de la Humanidad entre talleres de taracea.', imageUrl: 'art:medina:essaouira-poi' },
    ],
  },
  {
    id: 'c-agafay',
    slug: 'agafay',
    name: 'Agafay',
    shortDescription: 'El desierto a las puertas de Marrakech. Piedra lunar y calma absoluta.',
    longDescription:
      'A menos de una hora de Marrakech, el desierto de Agafay despliega colinas de piedra y arcilla que parecen otro planeta. Campamentos con encanto, cenas bajo las estrellas y el Atlas nevado en el horizonte.',
    heroImageUrl: 'art:stone:agafay-hero',
    gallery: ['art:stone:agafay-1', 'art:jaima:agafay-2', 'art:stone:agafay-3', 'art:stars:agafay-4', 'art:stone:agafay-5'],
    pois: [
      { id: 'p-camp', title: 'Campamentos del Agafay', description: 'Glamping con vistas al Atlas.', imageUrl: 'art:jaima:agafay-camp' },
      { id: 'p-lalla', title: 'Lago Lalla Takerkoust', description: 'Aguas tranquilas al pie de las montañas.', imageUrl: 'art:oasis:lalla' },
      { id: 'p-atlas-view', title: 'Miradores del Atlas', description: 'La cordillera nevada sobre el desierto de piedra.', imageUrl: 'art:stone:mirador' },
    ],
  },
]

const detallesComunes = (extra: string[] = []): Pack['details'] => [
  { type: 'incluye', content: 'Alojamiento y desayuno' },
  { type: 'incluye', content: 'Cena (bebidas no incluidas)' },
  { type: 'incluye', content: 'Traslados de llegada y salida' },
  { type: 'incluye', content: 'Circuito exclusivo con asistencia en su idioma' },
  { type: 'incluye', content: 'Visita privada' },
  { type: 'no_incluye', content: 'Seguro de viaje' },
  { type: 'no_incluye', content: 'Bebidas en las cenas' },
  { type: 'nota_importante', content: 'Pack en hotel con encanto, en muchos casos sin categoría hotelera.' },
  { type: 'nota_importante', content: 'Habitaciones privadas: conviene hacer la reserva con antelación.' },
  { type: 'nota_importante', content: 'Circuito exclusivo para su grupo.' },
  { type: 'nota_importante', content: 'Consultar condiciones especiales en festivos y puentes.' },
  { type: 'nota_importante', content: 'Sujeto a disponibilidad en el momento de la reserva.' },
  ...extra.map((content) => ({ type: 'nota_importante' as const, content })),
]

const highlightsComunes: Pack['highlights'] = [
  {
    title: 'Circuito exclusivo en vehículo 4x4 con chófer',
    description: 'Hablamos su idioma y viajamos con usted. Hasta 6 pasajeros. Viaje cómodo, seguro y personalizado.',
  },
  {
    title: 'En Merzouga, duerma en jaima con baño privado',
    description: 'Opcional en hotel o en jaima con baño privado, a pie de las dunas.',
  },
]

export const packs: Pack[] = [
  {
    id: 'pk-marrakech',
    slug: 'marrakech',
    title: 'Marrakech',
    subtitle: 'La ciudad roja, cuatro días',
    description:
      'Marrakech a fondo: la medina y sus zocos, los palacios saadíes y de la Bahía, los jardines de Majorelle y el atardecer en Jemaa el-Fna. Un viaje corto para entender de dónde viene todo lo demás.',
    days: 4,
    nights: 3,
    maxPax: 6,
    priceFrom: 355,
    priceAdult: 355,
    priceChild: 240,
    childAgeMax: 11,
    featured: true,
    featuredRank: 1,
    heroImageUrl: 'art:medina:marrakech-hero',
    gallery: ['art:arch:marrakech-2', 'art:oasis:marrakech-3', 'art:medina:marrakech-4', 'art:arch:marrakech-5'],
    citySlugs: ['marrakech'],
    routeLabel: 'Marrakech',
    itinerary: [
      { dayNumber: 1, title: 'Llegada a Marrakech', description: 'Recepción en el aeropuerto, traslado al riad y primer atardecer en Jemaa el-Fna.', imageUrl: 'art:medina:d1-mar', citySlug: 'marrakech' },
      { dayNumber: 2, title: 'Marrakech monumental', description: 'Palacio de la Bahía, tumbas saadíes, Koutoubia y zocos con guía local.', imageUrl: 'art:arch:d2-mar', citySlug: 'marrakech' },
      { dayNumber: 3, title: 'Jardines y medina', description: 'Jardín Majorelle, Menara y tarde libre entre talleres de artesanía.', imageUrl: 'art:oasis:d3-mar', citySlug: 'marrakech' },
      { dayNumber: 4, title: 'Marrakech — Salida', description: 'Mañana libre en la medina y traslado al aeropuerto.', imageUrl: 'art:medina:d4-mar', citySlug: 'marrakech' },
    ],
    details: detallesComunes(),
    highlights: [
      highlightsComunes[0],
      {
        title: 'Alojamiento en riad dentro de la medina',
        description: 'A pasos de Jemaa el-Fna, con patio, azotea y desayuno casero.',
      },
    ],
    stays: [
      {
        id: 'st-mar-marrakech',
        citySlug: 'marrakech',
        cityName: 'Marrakech',
        nights: 3,
        options: [
          { id: 'op-mar-mar-std', hotelName: 'Riad Dar Zellige', category: 'estandar', stars: 4, description: 'Riad en la medina con azotea y desayuno casero.', thumbnailUrl: 'art:medina:hotel-mar-only-std', supplementPpNight: 0, isDefault: true },
          { id: 'op-mar-mar-supa', hotelName: 'Palais Rouge', category: 'superior_a', stars: 5, description: 'Palacete con hammam, piscina y servicio de mayordomo.', thumbnailUrl: 'art:arch:hotel-mar-only-supa', supplementPpNight: 28, isDefault: false },
          { id: 'op-mar-mar-supb', hotelName: 'La Mamounia Garden Suite', category: 'superior_b', stars: 5, description: 'La leyenda hotelera de Marrakech, jardines centenarios.', thumbnailUrl: 'art:oasis:hotel-mar-only-supb', supplementPpNight: 65, isDefault: false },
        ],
      },
    ],
  },
  {
    id: 'pk-ourika-agafay',
    slug: 'marrakech-ourika-agafay',
    title: 'Marrakech, Ourika, Agafay, Marrakech',
    subtitle: 'Valle del Ourika y desierto de piedra, con opción Essaouira',
    description:
      'Marrakech como base, el valle del Ourika a los pies del Atlas y una noche en el desierto de piedra del Agafay, con cena bajo las estrellas. Se puede sustituir el Agafay por un día completo en Essaouira.',
    days: 5,
    nights: 4,
    maxPax: 6,
    priceFrom: 445,
    priceAdult: 445,
    priceChild: 300,
    childAgeMax: 11,
    featured: true,
    featuredRank: 2,
    heroImageUrl: 'art:stone:pack-agafay-hero',
    gallery: ['art:medina:pack-agafay-1', 'art:stone:pack-agafay-2', 'art:jaima:pack-agafay-3', 'art:stars:pack-agafay-4'],
    citySlugs: ['marrakech', 'agafay'],
    routeLabel: 'Marrakech, Ourika, Agafay, Marrakech - (Essaouira)',
    itinerary: [
      { dayNumber: 1, title: 'Llegada a Marrakech', description: 'Traslado al riad y atardecer en Jemaa el-Fna.', imageUrl: 'art:medina:d1-agafay', citySlug: 'marrakech' },
      { dayNumber: 2, title: 'Marrakech con guía local', description: 'Palacios, zocos y jardines. Tarde libre y cena en la medina.', imageUrl: 'art:arch:d2-agafay', citySlug: 'marrakech' },
      { dayNumber: 3, title: 'Valle del Ourika', description: 'Día en el Atlas: aldeas bereberes, cascadas de Setti Fatma y comida junto al río. Regreso a Marrakech.', imageUrl: 'art:oasis:d3-ourika', citySlug: 'marrakech' },
      { dayNumber: 4, title: 'Desierto de Agafay', description: 'Salida hacia el desierto de piedra, tarde de calma y cena bajo las estrellas en el campamento. Opción: día completo en Essaouira.', imageUrl: 'art:stone:d3-agafay', citySlug: 'agafay' },
      { dayNumber: 5, title: 'Amanecer en Agafay — Marrakech', description: 'Desayuno con vistas al Atlas, regreso a Marrakech y traslado al aeropuerto.', imageUrl: 'art:stars:d4-agafay', citySlug: 'marrakech' },
    ],
    details: detallesComunes(['La opción Essaouira sustituye la noche en el Agafay por una excursión de día completo a la costa.']),
    highlights: [
      highlightsComunes[0],
      {
        title: 'Noche en campamento del Agafay',
        description: 'Jaima con baño privado, cena a la luz de las velas y el cielo más estrellado a 40 minutos de Marrakech.',
      },
    ],
    stays: [
      {
        id: 'st-agafay-marrakech',
        citySlug: 'marrakech',
        cityName: 'Marrakech',
        nights: 3,
        options: [
          { id: 'op-aga-mar-std', hotelName: 'Riad Dar Zellige', category: 'estandar', stars: 4, description: 'Riad en la medina con azotea y desayuno casero.', thumbnailUrl: 'art:medina:hotel-aga-std', supplementPpNight: 0, isDefault: true },
          { id: 'op-aga-mar-supa', hotelName: 'Palais Rouge', category: 'superior_a', stars: 5, description: 'Palacete con hammam y piscina.', thumbnailUrl: 'art:arch:hotel-aga-supa', supplementPpNight: 28, isDefault: false },
        ],
      },
      {
        id: 'st-agafay-camp',
        citySlug: 'agafay',
        cityName: 'Agafay',
        nights: 1,
        options: [
          { id: 'op-aga-camp-std', hotelName: 'Agafay Camp', category: 'estandar', stars: 4, description: 'Campamento con jaimas de piedra y lona, baño privado.', thumbnailUrl: 'art:jaima:hotel-camp-std', supplementPpNight: 0, isDefault: true },
          { id: 'op-aga-camp-supa', hotelName: 'Agafay Luxury Lodge', category: 'superior_a', stars: 5, description: 'Lodge con piscina infinita frente al Atlas.', thumbnailUrl: 'art:stone:hotel-camp-supa', supplementPpNight: 40, isDefault: false },
        ],
      },
    ],
  },
  {
    id: 'pk-essaouira',
    slug: 'marrakech-essaouira',
    title: 'Marrakech, Essaouira',
    subtitle: 'La ciudad roja y la brisa atlántica',
    description:
      'Marrakech y la costa atlántica en un solo viaje: la medina blanca y azul de Essaouira, el puerto pesquero, las murallas portuguesas y los argánales del camino. Un recorrido para bajar el ritmo.',
    days: 5,
    nights: 4,
    maxPax: 6,
    priceFrom: 425,
    priceAdult: 425,
    priceChild: 285,
    childAgeMax: 11,
    featured: true,
    featuredRank: 3,
    heroImageUrl: 'art:coast:pack-essa-hero',
    gallery: ['art:coast:pack-essa-1', 'art:medina:pack-essa-2', 'art:coast:pack-essa-3', 'art:arch:pack-essa-4'],
    citySlugs: ['marrakech', 'essaouira'],
    routeLabel: 'Marrakech, Essaouira',
    itinerary: [
      { dayNumber: 1, title: 'Llegada a Marrakech', description: 'Traslado al riad y tarde libre en la medina.', imageUrl: 'art:medina:d1-essa', citySlug: 'marrakech' },
      { dayNumber: 2, title: 'Marrakech con guía local', description: 'Palacio de la Bahía, tumbas saadíes, Majorelle y zocos.', imageUrl: 'art:arch:d2-essa-mar', citySlug: 'marrakech' },
      { dayNumber: 3, title: 'Marrakech — Essaouira', description: 'Ruta entre argánales con parada en una cooperativa de aceite de argán.', imageUrl: 'art:coast:d2-essa', citySlug: 'essaouira' },
      { dayNumber: 4, title: 'Essaouira a fondo', description: 'Skala, puerto, medina y tarde de playa o windsurf.', imageUrl: 'art:coast:d3-essa', citySlug: 'essaouira' },
      { dayNumber: 5, title: 'Regreso y salida', description: 'Mañana libre frente al mar y traslado al aeropuerto de Marrakech.', imageUrl: 'art:medina:d4-essa', citySlug: 'marrakech' },
    ],
    details: detallesComunes(),
    highlights: [
      highlightsComunes[0],
      {
        title: 'Essaouira, Patrimonio de la Humanidad',
        description: 'Alojamiento dentro de la medina, a pasos de la Skala y del puerto pesquero.',
      },
    ],
    stays: [
      {
        id: 'st-essa-marrakech',
        citySlug: 'marrakech',
        cityName: 'Marrakech',
        nights: 2,
        options: [
          { id: 'op-essa-mar-std', hotelName: 'Riad Dar Zellige', category: 'estandar', stars: 4, description: 'Riad en la medina con azotea.', thumbnailUrl: 'art:medina:hotel-essa-mar-std', supplementPpNight: 0, isDefault: true },
          { id: 'op-essa-mar-supa', hotelName: 'Palais Rouge', category: 'superior_a', stars: 5, description: 'Palacete con hammam y piscina.', thumbnailUrl: 'art:arch:hotel-essa-mar-supa', supplementPpNight: 28, isDefault: false },
        ],
      },
      {
        id: 'st-essa-essaouira',
        citySlug: 'essaouira',
        cityName: 'Essaouira',
        nights: 2,
        options: [
          { id: 'op-essa-ess-std', hotelName: 'Riad Mar y Medina', category: 'estandar', stars: 4, description: 'Riad frente a las murallas, desayuno en la azotea.', thumbnailUrl: 'art:coast:hotel-ess-std', supplementPpNight: 0, isDefault: true },
          { id: 'op-essa-ess-supa', hotelName: 'Heure Bleue Palais', category: 'superior_a', stars: 5, description: 'Palacete colonial con piscina en la azotea.', thumbnailUrl: 'art:arch:hotel-ess-supa', supplementPpNight: 30, isDefault: false },
        ],
      },
    ],
  },
  {
    id: 'pk-dunas',
    slug: 'marrakech-zagora-dunas',
    title: 'Marrakech, Zagora, dunas',
    subtitle: 'El valle del Draa hasta el mar de arena',
    description:
      'De Marrakech al desierto cruzando el Alto Atlas y el valle del Draa: Zagora, palmerales infinitos y noche en jaima a pie de duna, con amanecer en dromedario y regreso por la ruta de las mil kasbahs.',
    days: 5,
    nights: 4,
    maxPax: 6,
    priceFrom: 495,
    priceAdult: 495,
    priceChild: 330,
    childAgeMax: 11,
    featured: false,
    heroImageUrl: 'art:dunes:pack-dunas-hero',
    gallery: ['art:dunes:pack-dunas-1', 'art:camel:pack-dunas-2', 'art:jaima:pack-dunas-3', 'art:kasbah:pack-dunas-4'],
    citySlugs: ['marrakech', 'ouarzazate', 'merzouga', 'erfoud'],
    routeLabel: 'Marrakech, Zagora, dunas',
    itinerary: [
      { dayNumber: 1, title: 'Marrakech — Alto Atlas — Ait Ben Haddou', description: 'Salida por el puerto de Tizi n\'Tichka, visita del ksar de Ait Ben Haddou y noche en Ouarzazate.', imageUrl: 'art:kasbah:d1-dunas', citySlug: 'ouarzazate' },
      { dayNumber: 2, title: 'Valle del Draa — Zagora', description: 'Palmerales infinitos del Draa, parada en Agdz y llegada a Zagora, puerta del Sahara.', imageUrl: 'art:oasis:d2-dunas', citySlug: 'ouarzazate' },
      { dayNumber: 3, title: 'Zagora — Erfoud — Dunas', description: 'Ruta hacia el oasis del Tafilalet, entrada a las dunas en 4x4 y noche en jaima.', imageUrl: 'art:dunes:d3-dunas', citySlug: 'merzouga' },
      { dayNumber: 4, title: 'Amanecer en las dunas — Gargantas del Todra', description: 'Amanecer sobre la arena, paseo en dromedario y ruta hacia las gargantas del Todra.', imageUrl: 'art:arch:d4-dunas', citySlug: 'erfoud' },
      { dayNumber: 5, title: 'Ruta de las mil kasbahs — Marrakech', description: 'Regreso por Skoura y el valle de las rosas. Llegada a Marrakech al atardecer.', imageUrl: 'art:medina:d5-dunas', citySlug: 'marrakech' },
    ],
    details: detallesComunes(),
    highlights: highlightsComunes,
    stays: [
      {
        id: 'st-dunas-ouarzazate',
        citySlug: 'ouarzazate',
        cityName: 'Ouarzazate',
        nights: 2,
        options: [
          { id: 'op-dunas-ouar-std', hotelName: 'Riad Dar Kasbah', category: 'estandar', stars: 4, description: 'Riad tradicional junto a la kasbah Taourirt, patio con piscina.', thumbnailUrl: 'art:kasbah:hotel-ouar-std', supplementPpNight: 0, isDefault: true },
          { id: 'op-dunas-ouar-supa', hotelName: 'Kasbah Palace Ouarzazate', category: 'superior_a', stars: 5, description: 'Resort de adobe con spa y vistas al Atlas.', thumbnailUrl: 'art:kasbah:hotel-ouar-supa', supplementPpNight: 22, isDefault: false },
        ],
      },
      {
        id: 'st-dunas-erfoud',
        citySlug: 'erfoud',
        cityName: 'Erfoud',
        nights: 1,
        options: [
          { id: 'op-dunas-erf-std', hotelName: 'Hotel Palmeral Tafilalet', category: 'estandar', stars: 4, description: 'Entre palmerales, cocina tradicional y piscina exterior.', thumbnailUrl: 'art:oasis:hotel-erf-std', supplementPpNight: 0, isDefault: true },
          { id: 'op-dunas-erf-supa', hotelName: 'Dar Fósil Lodge', category: 'superior_a', stars: 5, description: 'Antigua casa señorial restaurada con mármoles fósiles.', thumbnailUrl: 'art:arch:hotel-erf-supa', supplementPpNight: 18, isDefault: false },
        ],
      },
      {
        id: 'st-dunas-merzouga',
        citySlug: 'merzouga',
        cityName: 'Merzouga',
        nights: 1,
        options: [
          { id: 'op-dunas-mer-std', hotelName: 'Jaima Erg Chebbi', category: 'estandar', stars: 4, description: 'Jaima con baño privado a pie de las dunas.', thumbnailUrl: 'art:jaima:hotel-mer-std', supplementPpNight: 0, isDefault: true },
          { id: 'op-dunas-mer-supa', hotelName: 'Jaima Luxury Dunes', category: 'superior_a', stars: 5, description: 'Campamento de lujo con cena gourmet y telescopio.', thumbnailUrl: 'art:stars:hotel-mer-supa', supplementPpNight: 35, isDefault: false },
        ],
      },
    ],
  },
  {
    id: 'pk-zagora-merzouga',
    slug: 'marrakech-zagora-merzouga-ouarzazate',
    title: 'Marrakech, Zagora, Merzouga, Ouarzazate',
    subtitle: 'Siete días de valles, dunas y kasbahs',
    description:
      'El circuito completo del sur por el valle del Draa: Zagora, el Tafilalet y dos noches en el gran mar de dunas del Erg Chebbi, con regreso por las gargantas del Todra, el valle del Dades y Ouarzazate.',
    days: 7,
    nights: 6,
    maxPax: 6,
    priceFrom: 715,
    priceAdult: 715,
    priceChild: 475,
    childAgeMax: 11,
    featured: false,
    heroImageUrl: 'art:kasbah:pack-kasbahs-hero',
    gallery: ['art:kasbah:pack-kasbahs-1', 'art:arch:pack-kasbahs-2', 'art:dunes:pack-kasbahs-3', 'art:medina:pack-kasbahs-4'],
    citySlugs: ['marrakech', 'ouarzazate', 'merzouga', 'erfoud'],
    routeLabel: 'Marrakech, Zagora, Merzouga, Ouarzazate',
    itinerary: [
      { dayNumber: 1, title: 'Llegada a Marrakech', description: 'Recepción en el aeropuerto, traslado al riad y primer paseo por la medina.', imageUrl: 'art:medina:d1-kasbahs', citySlug: 'marrakech' },
      { dayNumber: 2, title: 'Marrakech — Alto Atlas — Zagora', description: 'Tizi n\'Tichka, Ait Ben Haddou y descenso por el valle del Draa hasta Zagora.', imageUrl: 'art:kasbah:d3-kasbahs', citySlug: 'ouarzazate' },
      { dayNumber: 3, title: 'Zagora — Erfoud — Merzouga', description: 'Palmerales del Draa, talleres de fósiles del Tafilalet y llegada al desierto. Noche en jaima.', imageUrl: 'art:dunes:d5-kasbahs', citySlug: 'merzouga' },
      { dayNumber: 4, title: 'Día completo en Merzouga', description: 'Amanecer en las dunas, Khamlia, lago Dayet Srji y segunda noche en jaima.', imageUrl: 'art:camel:d6-kasbahs', citySlug: 'merzouga' },
      { dayNumber: 5, title: 'Merzouga — Todra — Dades', description: 'Gargantas del Todra y llegada al valle del Dades.', imageUrl: 'art:arch:d5b-kasbahs', citySlug: 'erfoud' },
      { dayNumber: 6, title: 'Dades — Skoura — Ouarzazate', description: 'Valle de las rosas, palmeral de Skoura y kasbah Taourirt.', imageUrl: 'art:oasis:d4-kasbahs', citySlug: 'ouarzazate' },
      { dayNumber: 7, title: 'Ouarzazate — Marrakech', description: 'Regreso por el Atlas y traslado al aeropuerto.', imageUrl: 'art:medina:d7-kasbahs', citySlug: 'marrakech' },
    ],
    details: detallesComunes(['Ruta con etapas largas de carretera: recomendable para quienes disfrutan del viaje por etapas.']),
    highlights: highlightsComunes,
    stays: [
      {
        id: 'st-kasbahs-marrakech',
        citySlug: 'marrakech',
        cityName: 'Marrakech',
        nights: 2,
        options: [
          { id: 'op-kas-mar-std', hotelName: 'Riad Dar Zellige', category: 'estandar', stars: 4, description: 'Riad en la medina con azotea y desayuno casero.', thumbnailUrl: 'art:medina:hotel-mar-std', supplementPpNight: 0, isDefault: true },
          { id: 'op-kas-mar-supa', hotelName: 'Palais Rouge', category: 'superior_a', stars: 5, description: 'Palacete con hammam, piscina y servicio de mayordomo.', thumbnailUrl: 'art:arch:hotel-mar-supa', supplementPpNight: 28, isDefault: false },
          { id: 'op-kas-mar-supb', hotelName: 'La Mamounia Garden Suite', category: 'superior_b', stars: 5, description: 'La leyenda hotelera de Marrakech, jardines centenarios.', thumbnailUrl: 'art:oasis:hotel-mar-supb', supplementPpNight: 65, isDefault: false },
        ],
      },
      {
        id: 'st-kasbahs-ouarzazate',
        citySlug: 'ouarzazate',
        cityName: 'Ouarzazate',
        nights: 2,
        options: [
          { id: 'op-kas-ouar-std', hotelName: 'Riad Dar Kasbah', category: 'estandar', stars: 4, description: 'Riad tradicional junto a la kasbah Taourirt.', thumbnailUrl: 'art:kasbah:hotel-ouar2-std', supplementPpNight: 0, isDefault: true },
          { id: 'op-kas-ouar-supa', hotelName: 'Kasbah Palace Ouarzazate', category: 'superior_a', stars: 5, description: 'Resort de adobe con spa y vistas al Atlas.', thumbnailUrl: 'art:kasbah:hotel-ouar2-supa', supplementPpNight: 22, isDefault: false },
        ],
      },
      {
        id: 'st-kasbahs-merzouga',
        citySlug: 'merzouga',
        cityName: 'Merzouga',
        nights: 2,
        options: [
          { id: 'op-kas-mer-std', hotelName: 'Jaima Erg Chebbi', category: 'estandar', stars: 4, description: 'Jaima con baño privado a pie de las dunas.', thumbnailUrl: 'art:jaima:hotel-mer2-std', supplementPpNight: 0, isDefault: true },
          { id: 'op-kas-mer-supa', hotelName: 'Jaima Luxury Dunes', category: 'superior_a', stars: 5, description: 'Campamento de lujo con cena gourmet.', thumbnailUrl: 'art:stars:hotel-mer2-supa', supplementPpNight: 35, isDefault: false },
        ],
      },
    ],
  },
  {
    id: 'pk-dades-merzouga',
    slug: 'marrakech-ouarzazate-dades-merzouga',
    title: 'Marrakech, Ouarzazate, valle del Dades, Merzouga, Ouarzazate (2 noches de desierto)',
    subtitle: 'Siete días por la ruta de las mil kasbahs',
    description:
      'La ruta clásica del sur con tiempo para vivirla: el Atlas y Ait Ben Haddou, el valle del Dades y las gargantas del Todra, dos noches en el desierto de Merzouga y regreso por Skoura y Ouarzazate.',
    days: 7,
    nights: 6,
    maxPax: 6,
    priceFrom: 745,
    priceAdult: 745,
    priceChild: 495,
    childAgeMax: 11,
    featured: false,
    heroImageUrl: 'art:kasbah:pack-gran-3',
    gallery: ['art:coast:pack-gran-1', 'art:dunes:pack-gran-2', 'art:kasbah:pack-gran-3', 'art:medina:pack-gran-4'],
    citySlugs: ['marrakech', 'ouarzazate', 'merzouga', 'erfoud'],
    routeLabel: 'Marrakech, Ouarzazate - Valle del Dades, Merzouga, Ouarzazate',
    itinerary: [
      { dayNumber: 1, title: 'Llegada a Marrakech', description: 'Recepción, traslado al riad y paseo de orientación por la medina.', imageUrl: 'art:medina:d1-gran', citySlug: 'marrakech' },
      { dayNumber: 2, title: 'Marrakech — Atlas — Ouarzazate', description: 'El puerto del Tizi n\'Tichka y el ksar de Ait Ben Haddou.', imageUrl: 'art:kasbah:d3-gran', citySlug: 'ouarzazate' },
      { dayNumber: 3, title: 'Ouarzazate — Skoura — Valle del Dades', description: 'Palmeral de Skoura, valle de las rosas y gargantas del Dades.', imageUrl: 'art:oasis:d4-gran', citySlug: 'ouarzazate' },
      { dayNumber: 4, title: 'Todra — Erfoud — Merzouga', description: 'Gargantas del Todra, oasis del Tafilalet y primera noche en el desierto.', imageUrl: 'art:dunes:d5-gran', citySlug: 'merzouga' },
      { dayNumber: 5, title: 'Día completo en Merzouga', description: 'Amanecer en las dunas, Khamlia, lago Dayet Srji y segunda noche en jaima.', imageUrl: 'art:camel:d6-gran', citySlug: 'merzouga' },
      { dayNumber: 6, title: 'Merzouga — Ouarzazate', description: 'Regreso por el Tafilalet y la ruta de las mil kasbahs hasta Ouarzazate.', imageUrl: 'art:oasis:d7-gran', citySlug: 'ouarzazate' },
      { dayNumber: 7, title: 'Ouarzazate — Marrakech — Salida', description: 'Cruce del Atlas y traslado al aeropuerto de Marrakech.', imageUrl: 'art:medina:d8-gran', citySlug: 'marrakech' },
    ],
    details: detallesComunes(['Dos noches consecutivas en el desierto: se recomienda equipaje de mano flexible.']),
    highlights: highlightsComunes,
    stays: [
      {
        id: 'st-gran-marrakech',
        citySlug: 'marrakech',
        cityName: 'Marrakech',
        nights: 2,
        options: [
          { id: 'op-gran-mar-std', hotelName: 'Riad Dar Zellige', category: 'estandar', stars: 4, description: 'Riad en la medina con azotea y desayuno casero.', thumbnailUrl: 'art:medina:hotel-gran-std', supplementPpNight: 0, isDefault: true },
          { id: 'op-gran-mar-supa', hotelName: 'Palais Rouge', category: 'superior_a', stars: 5, description: 'Palacete con hammam, piscina y mayordomo.', thumbnailUrl: 'art:arch:hotel-gran-supa', supplementPpNight: 28, isDefault: false },
          { id: 'op-gran-mar-supb', hotelName: 'La Mamounia Garden Suite', category: 'superior_b', stars: 5, description: 'La leyenda hotelera de Marrakech.', thumbnailUrl: 'art:oasis:hotel-gran-supb', supplementPpNight: 65, isDefault: false },
        ],
      },
      {
        id: 'st-gran-ouarzazate',
        citySlug: 'ouarzazate',
        cityName: 'Ouarzazate',
        nights: 2,
        options: [
          { id: 'op-gran-ouar-std', hotelName: 'Riad Dar Kasbah', category: 'estandar', stars: 4, description: 'Riad tradicional junto a la kasbah Taourirt.', thumbnailUrl: 'art:kasbah:hotel-gran-ouar-std', supplementPpNight: 0, isDefault: true },
          { id: 'op-gran-ouar-supa', hotelName: 'Kasbah Palace Ouarzazate', category: 'superior_a', stars: 5, description: 'Resort de adobe con spa.', thumbnailUrl: 'art:kasbah:hotel-gran-ouar-supa', supplementPpNight: 22, isDefault: false },
        ],
      },
      {
        id: 'st-gran-merzouga',
        citySlug: 'merzouga',
        cityName: 'Merzouga',
        nights: 2,
        options: [
          { id: 'op-gran-mer-std', hotelName: 'Jaima Erg Chebbi', category: 'estandar', stars: 4, description: 'Jaima con baño privado a pie de las dunas.', thumbnailUrl: 'art:jaima:hotel-gran-mer-std', supplementPpNight: 0, isDefault: true },
          { id: 'op-gran-mer-supa', hotelName: 'Jaima Luxury Dunes', category: 'superior_a', stars: 5, description: 'Campamento de lujo con cena gourmet.', thumbnailUrl: 'art:stars:hotel-gran-mer-supa', supplementPpNight: 35, isDefault: false },
        ],
      },
    ],
  },
  {
    // Misma ruta que el pack anterior con una sola noche en el desierto: es la
    // variante corta que pide la agencia, no un circuito distinto.
    id: 'pk-dades-merzouga-1n',
    slug: 'marrakech-ouarzazate-dades-merzouga-1-noche',
    title: 'Marrakech, Ouarzazate, valle del Dades, Merzouga, Ouarzazate (1 noche de desierto)',
    subtitle: 'Seis días por la ruta de las mil kasbahs',
    description:
      'La ruta clásica del sur en formato corto: el Atlas y Ait Ben Haddou, el valle del Dades y las gargantas del Todra, una noche en el desierto de Merzouga y regreso por Skoura y Ouarzazate.',
    days: 6,
    nights: 5,
    maxPax: 6,
    priceFrom: 665,
    priceAdult: 665,
    priceChild: 445,
    childAgeMax: 11,
    featured: false,
    heroImageUrl: 'art:dunes:pack-gran-2',
    gallery: ['art:coast:pack-gran-1', 'art:dunes:pack-gran-2', 'art:kasbah:pack-gran-3', 'art:medina:pack-gran-4'],
    citySlugs: ['marrakech', 'ouarzazate', 'merzouga', 'erfoud'],
    routeLabel: 'Marrakech, Ouarzazate - valle del Dades, Merzouga, Ouarzazate (1 noche desierto)',
    itinerary: [
      { dayNumber: 1, title: 'Llegada a Marrakech', description: 'Recepción, traslado al riad y paseo de orientación por la medina.', imageUrl: 'art:medina:d1-gran1n', citySlug: 'marrakech' },
      { dayNumber: 2, title: 'Marrakech — Atlas — Ouarzazate', description: 'El puerto del Tizi n\'Tichka y el ksar de Ait Ben Haddou.', imageUrl: 'art:kasbah:d2-gran1n', citySlug: 'ouarzazate' },
      { dayNumber: 3, title: 'Ouarzazate — Skoura — Valle del Dades', description: 'Palmeral de Skoura, valle de las rosas y gargantas del Dades.', imageUrl: 'art:oasis:d3-gran1n', citySlug: 'ouarzazate' },
      { dayNumber: 4, title: 'Todra — Erfoud — Merzouga', description: 'Gargantas del Todra, oasis del Tafilalet y noche en jaima a pie de duna.', imageUrl: 'art:dunes:d4-gran1n', citySlug: 'merzouga' },
      { dayNumber: 5, title: 'Amanecer en Merzouga — Ouarzazate', description: 'Amanecer sobre las dunas y regreso por la ruta de las mil kasbahs.', imageUrl: 'art:camel:d5-gran1n', citySlug: 'ouarzazate' },
      { dayNumber: 6, title: 'Ouarzazate — Marrakech — Salida', description: 'Cruce del Atlas y traslado al aeropuerto de Marrakech.', imageUrl: 'art:medina:d6-gran1n', citySlug: 'marrakech' },
    ],
    details: detallesComunes(),
    highlights: highlightsComunes,
    stays: [
      {
        id: 'st-gran1n-marrakech',
        citySlug: 'marrakech',
        cityName: 'Marrakech',
        nights: 2,
        options: [
          { id: 'op-gran1n-mar-std', hotelName: 'Riad Dar Zellige', category: 'estandar', stars: 4, description: 'Riad en la medina con azotea y desayuno casero.', thumbnailUrl: 'art:medina:hotel-gran1n-std', supplementPpNight: 0, isDefault: true },
          { id: 'op-gran1n-mar-supa', hotelName: 'Palais Rouge', category: 'superior_a', stars: 5, description: 'Palacete con hammam, piscina y mayordomo.', thumbnailUrl: 'art:arch:hotel-gran1n-supa', supplementPpNight: 28, isDefault: false },
          { id: 'op-gran1n-mar-supb', hotelName: 'La Mamounia Garden Suite', category: 'superior_b', stars: 5, description: 'La leyenda hotelera de Marrakech.', thumbnailUrl: 'art:oasis:hotel-gran1n-supb', supplementPpNight: 65, isDefault: false },
        ],
      },
      {
        id: 'st-gran1n-ouarzazate',
        citySlug: 'ouarzazate',
        cityName: 'Ouarzazate',
        nights: 2,
        options: [
          { id: 'op-gran1n-ouar-std', hotelName: 'Riad Dar Kasbah', category: 'estandar', stars: 4, description: 'Riad tradicional junto a la kasbah Taourirt.', thumbnailUrl: 'art:kasbah:hotel-gran1n-ouar-std', supplementPpNight: 0, isDefault: true },
          { id: 'op-gran1n-ouar-supa', hotelName: 'Kasbah Palace Ouarzazate', category: 'superior_a', stars: 5, description: 'Resort de adobe con spa.', thumbnailUrl: 'art:kasbah:hotel-gran1n-ouar-supa', supplementPpNight: 22, isDefault: false },
        ],
      },
      {
        id: 'st-gran1n-merzouga',
        citySlug: 'merzouga',
        cityName: 'Merzouga',
        nights: 1,
        options: [
          { id: 'op-gran1n-mer-std', hotelName: 'Jaima Erg Chebbi', category: 'estandar', stars: 4, description: 'Jaima con baño privado a pie de las dunas.', thumbnailUrl: 'art:jaima:hotel-gran1n-mer-std', supplementPpNight: 0, isDefault: true },
          { id: 'op-gran1n-mer-supa', hotelName: 'Jaima Luxury Dunes', category: 'superior_a', stars: 5, description: 'Campamento de lujo con cena gourmet.', thumbnailUrl: 'art:stars:hotel-gran1n-mer-supa', supplementPpNight: 35, isDefault: false },
        ],
      },
    ],
  },
]

export const activities: Activity[] = [
  { id: 'ac-globo', title: 'Amanecer en globo', description: 'Vuelo al amanecer sobre el palmeral y el Atlas con desayuno bereber.', imageUrl: 'art:stars:act-globo', citySlug: 'marrakech', durationLabel: 'Medio día', priceAdult: null, priceChild: null },
  { id: 'ac-quad', title: 'Ruta en quad por las dunas', description: 'Dos horas de quad por el Erg Chebbi con monitor.', imageUrl: 'art:dunes:act-quad', citySlug: 'merzouga', durationLabel: '2 horas', priceAdult: null, priceChild: null },
  { id: 'ac-hammam', title: 'Hammam y masaje tradicional', description: 'Ritual completo con jabón negro y aceite de argán.', imageUrl: 'art:arch:act-hammam', citySlug: 'marrakech', durationLabel: '2 horas', priceAdult: null, priceChild: null },
  { id: 'ac-cocina', title: 'Taller de cocina marroquí', description: 'Del zoco a la mesa: prepara tu propio tajine con una cocinera local.', imageUrl: 'art:medina:act-cocina', citySlug: 'marrakech', durationLabel: 'Medio día', priceAdult: null, priceChild: null },
  { id: 'ac-surf', title: 'Clase de windsurf', description: 'Iniciación al windsurf en la bahía de Essaouira, material incluido.', imageUrl: 'art:coast:act-surf', citySlug: 'essaouira', durationLabel: '3 horas', priceAdult: null, priceChild: null },
  { id: 'ac-sandboard', title: 'Sandboard en el Erg Chebbi', description: 'Desciende las dunas sobre una tabla al atardecer.', imageUrl: 'art:dunes:act-sand', citySlug: 'merzouga', durationLabel: '2 horas', priceAdult: null, priceChild: null },
]

export const travelTips: TravelTip[] = [
  { slug: 'moneda', title: 'Moneda', content: 'El dírham marroquí (MAD). 1 euro equivale aproximadamente a 10,5 MAD. Se recomienda cambiar en destino y llevar efectivo para zocos y propinas.' },
  { slug: 'clima', title: 'Clima', content: 'Primavera y otoño son ideales. En el desierto los días son cálidos y las noches frescas; en verano las temperaturas superan los 40 grados.' },
  { slug: 'telefono', title: 'Teléfono', content: 'Prefijo +212. Hay cobertura 4G en las ciudades y en buena parte de las rutas. Las tarjetas SIM locales son económicas.' },
  { slug: 'horaria', title: 'Diferencia horaria', content: 'Marruecos comparte huso con España peninsular la mayor parte del año; durante el Ramadán se atrasa una hora.' },
  { slug: 'electricidad', title: 'Electricidad', content: '220 V con enchufes tipo europeo de dos clavijas. No se necesita adaptador viajando desde España.' },
  { slug: 'propinas', title: 'Propinas', content: 'Son parte de la cultura. Orientación: 10-20 MAD en restaurantes, 20-50 MAD por día para chóferes y guías.' },
  { slug: 'religion', title: 'Religión', content: 'País musulmán y acogedor. Durante el Ramadán la vida cambia de ritmo; conviene informarse de las fechas antes de viajar.' },
  { slug: 'idioma', title: 'Idioma', content: 'Árabe y bereber son oficiales. El francés está muy extendido y el español se habla en el norte y en zonas turísticas.' },
  { slug: 'compras', title: 'Compras y artesanía', content: 'Alfombras, cuero, cerámica, especias y aceite de argán. Regatear es costumbre y se espera: empieza por la mitad del precio.' },
  { slug: 'indumentaria', title: 'Indumentaria', content: 'Ropa cómoda y discreta, calzado cerrado para el desierto y una prenda de abrigo para las noches. En las mezquitas, hombros y rodillas cubiertos.' },
  { slug: 'sanitarios', title: 'Requisitos sanitarios', content: 'No se exigen vacunas para viajar desde Europa. Se recomienda beber agua embotellada y llevar un pequeño botiquín.' },
  { slug: 'embajada', title: 'Embajada y consulado', content: 'Embajada de España en Rabat: Ambassade d\'Espagne, Rue Ain Khalouiya. Consulados en Casablanca, Tánger, Tetuán, Nador, Agadir y Rabat.' },
  { slug: 'visado', title: 'Visado y requisitos de entrada', content: 'Pasaporte en vigor con validez mínima de seis meses. Los ciudadanos españoles no necesitan visado para estancias de hasta 90 días.' },
]

export const marruecosIntro = {
  title: 'Marruecos, a un estrecho de distancia',
  body: 'Entre el Atlántico y el Sahara, Marruecos concentra en pocos kilómetros medinas milenarias, cumbres nevadas del Atlas, valles de palmeras y el mayor mar de dunas del norte de África. Un país de té a la menta, hospitalidad bereber y ciudades imperiales donde cada puerta esconde un patio. A menos de tres horas de vuelo, otro mundo.',
}
