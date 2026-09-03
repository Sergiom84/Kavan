-- =============================================================================
-- Kavan Tours — seed.sql
-- Espejo exacto de src/data/seed.ts. Los tokens 'art:...' se insertan tal cual
-- (el front los renderiza como ilustracion SVG). Idempotente: todos los INSERT
-- usan ON CONFLICT DO NOTHING, se puede re-ejecutar sin duplicar filas.
-- Los ids de texto del front se guardan en la columna client_id.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Ciudades
-- -----------------------------------------------------------------------------
insert into public.cities (client_id, slug, name, short_description, long_description, hero_image_url, status, sort_order) values
  ('c-merzouga', 'merzouga', 'Merzouga',
   'Puertas del desierto del Sahara. Dunas doradas y cielos infinitos.',
   'Merzouga es la entrada al Erg Chebbi, un mar de dunas que alcanza los 150 metros de altura. Aquí el día termina con el sol cayendo sobre la arena y comienza con un amanecer que lo cambia todo. Noches en jaima, paseos en dromedario y un silencio que no se olvida.',
   'art:dunes:merzouga-hero', 'published', 0),
  ('c-ouarzazate', 'ouarzazate', 'Ouarzazate',
   'La puerta del desierto y del cine. Kasbahs, paisajes y cultura bereber.',
   'Conocida como la puerta del desierto, Ouarzazate reúne kasbahs centenarias, estudios de cine donde se han rodado grandes producciones y una luz que atrae a viajeros y cineastas por igual. Desde aquí parten las rutas hacia el valle del Draa y las gargantas del Todra.',
   'art:kasbah:ouarzazate-hero', 'published', 1),
  ('c-marrakech', 'marrakech', 'Marrakech',
   'La ciudad roja que despierta los sentidos. Historia, tradición y vida vibrante.',
   'Marrakech es un torbellino de color: la plaza de Jemaa el-Fna al atardecer, los zocos infinitos, los palacios y jardines que esconden siglos de historia. La ciudad roja es el punto de partida perfecto para entender Marruecos.',
   'art:medina:marrakech-hero', 'published', 2),
  ('c-erfoud', 'erfoud', 'Erfoud',
   'Capital del oasis del Tafilalet. Fósiles, palmerales y hospitalidad.',
   'Erfoud vive entre palmerales y yacimientos de fósiles marinos que cuentan la historia de un Sahara que fue océano. Es parada obligada camino de las dunas y un lugar donde probar los dátiles del Tafilalet, considerados de los mejores del mundo.',
   'art:oasis:erfoud-hero', 'published', 3),
  ('c-essaouira', 'essaouira', 'Essaouira',
   'La perla del Atlántico. Murallas, gaviotas y brisa marina.',
   'Essaouira mira al océano desde sus murallas portuguesas. Ciudad de pescadores, artesanos y músicos, su medina blanca y azul invita a perderse sin prisa. El viento del Atlántico la convierte además en meca del windsurf y el kitesurf.',
   'art:coast:essaouira-hero', 'published', 4),
  ('c-agafay', 'agafay', 'Agafay',
   'El desierto a las puertas de Marrakech. Piedra lunar y calma absoluta.',
   'A menos de una hora de Marrakech, el desierto de Agafay despliega colinas de piedra y arcilla que parecen otro planeta. Campamentos con encanto, cenas bajo las estrellas y el Atlas nevado en el horizonte.',
   'art:stone:agafay-hero', 'published', 5)
on conflict (slug) do nothing;

-- Galerias de ciudades
insert into public.city_images (city_id, image_url, sort_order)
select c.id, v.image_url, v.sort_order
from public.cities c
join (values
  ('merzouga',  'art:dunes:merzouga-1', 0), ('merzouga',  'art:camel:merzouga-2', 1), ('merzouga',  'art:jaima:merzouga-3', 2), ('merzouga',  'art:dunes:merzouga-4', 3), ('merzouga',  'art:stars:merzouga-5', 4),
  ('ouarzazate','art:kasbah:ouarzazate-1', 0), ('ouarzazate','art:arch:ouarzazate-2', 1), ('ouarzazate','art:kasbah:ouarzazate-3', 2), ('ouarzazate','art:oasis:ouarzazate-4', 3), ('ouarzazate','art:medina:ouarzazate-5', 4),
  ('marrakech', 'art:medina:marrakech-1', 0), ('marrakech', 'art:arch:marrakech-2', 1), ('marrakech', 'art:oasis:marrakech-3', 2), ('marrakech', 'art:medina:marrakech-4', 3), ('marrakech', 'art:arch:marrakech-5', 4),
  ('erfoud',    'art:oasis:erfoud-1', 0), ('erfoud',    'art:dunes:erfoud-2', 1), ('erfoud',    'art:medina:erfoud-3', 2), ('erfoud',    'art:oasis:erfoud-4', 3), ('erfoud',    'art:arch:erfoud-5', 4),
  ('essaouira', 'art:coast:essaouira-1', 0), ('essaouira', 'art:medina:essaouira-2', 1), ('essaouira', 'art:coast:essaouira-3', 2), ('essaouira', 'art:arch:essaouira-4', 3), ('essaouira', 'art:coast:essaouira-5', 4),
  ('agafay',    'art:stone:agafay-1', 0), ('agafay',    'art:jaima:agafay-2', 1), ('agafay',    'art:stone:agafay-3', 2), ('agafay',    'art:stars:agafay-4', 3), ('agafay',    'art:stone:agafay-5', 4)
) as v(city_slug, image_url, sort_order) on v.city_slug = c.slug
on conflict (city_id, sort_order) do nothing;

-- Puntos de interes
insert into public.city_pois (client_id, city_id, title, description, image_url, sort_order)
select v.client_id, c.id, v.title, v.description, v.image_url, v.sort_order
from public.cities c
join (values
  ('p-erg',        'merzouga',   'Erg Chebbi',            'El gran mar de dunas, imprescindible al amanecer.',                  'art:dunes:erg-chebbi', 0),
  ('p-khamlia',    'merzouga',   'Khamlia',               'El pueblo de la música gnawa y sus ritmos ancestrales.',             'art:medina:khamlia', 1),
  ('p-lago',       'merzouga',   'Lago Dayet Srji',       'Flamencos y aves migratorias a las puertas del desierto.',           'art:oasis:dayet-srji', 2),
  ('p-ait',        'ouarzazate', 'Ait Ben Haddou',        'Ksar Patrimonio de la Humanidad, la kasbah más célebre del sur.',    'art:kasbah:ait-ben-haddou', 0),
  ('p-atlas',      'ouarzazate', 'Estudios Atlas',        'El gran plató de cine del desierto marroquí.',                       'art:arch:atlas-studios', 1),
  ('p-taourirt',   'ouarzazate', 'Kasbah Taourirt',       'Laberinto de adobe en el corazón de la ciudad.',                     'art:kasbah:taourirt', 2),
  ('p-jemaa',      'marrakech',  'Jemaa el-Fna',          'La plaza más viva de África, teatro al aire libre cada noche.',      'art:medina:jemaa', 0),
  ('p-majorelle',  'marrakech',  'Jardín Majorelle',      'El azul más famoso de Marruecos entre palmeras y cactus.',           'art:oasis:majorelle', 1),
  ('p-bahia',      'marrakech',  'Palacio de la Bahía',   'Patios, mosaicos y la elegancia de la arquitectura andalusí.',       'art:arch:bahia', 2),
  ('p-fosiles',    'erfoud',     'Talleres de fósiles',   'Mármoles con ammonites de hace 350 millones de años.',               'art:arch:fosiles', 0),
  ('p-palmeral',   'erfoud',     'Palmeral del Tafilalet','Uno de los oasis más extensos del norte de África.',                 'art:oasis:tafilalet', 1),
  ('p-rissani',    'erfoud',     'Rissani',               'El zoco rural más auténtico de la región.',                          'art:medina:rissani', 2),
  ('p-skala',      'essaouira',  'Skala de la Kasbah',    'Cañones frente al Atlántico y atardeceres de postal.',               'art:coast:skala', 0),
  ('p-puerto',     'essaouira',  'Puerto pesquero',       'Barcas azules y el mejor pescado a la brasa.',                       'art:coast:puerto', 1),
  ('p-medina-ess', 'essaouira',  'Medina de Essaouira',   'Patrimonio de la Humanidad entre talleres de taracea.',              'art:medina:essaouira-poi', 2),
  ('p-camp',       'agafay',     'Campamentos del Agafay','Glamping con vistas al Atlas.',                                      'art:jaima:agafay-camp', 0),
  ('p-lalla',      'agafay',     'Lago Lalla Takerkoust', 'Aguas tranquilas al pie de las montañas.',                           'art:oasis:lalla', 1),
  ('p-atlas-view', 'agafay',     'Miradores del Atlas',   'La cordillera nevada sobre el desierto de piedra.',                  'art:stone:mirador', 2)
) as v(client_id, city_slug, title, description, image_url, sort_order) on v.city_slug = c.slug
on conflict (city_id, sort_order) do nothing;

-- -----------------------------------------------------------------------------
-- Hoteles (catalogo canonico por ciudad; los packs los referencian via stays)
-- -----------------------------------------------------------------------------
insert into public.hotels (city_id, name, category, stars, description, thumbnail_url, status)
select c.id, v.name, v.category::public.hotel_category, v.stars, v.description, v.thumbnail_url, 'published'
from public.cities c
join (values
  ('ouarzazate', 'Riad Dar Kasbah',           'estandar',   4, 'Riad tradicional junto a la kasbah Taourirt, patio con piscina.', 'art:kasbah:hotel-ouar-std'),
  ('ouarzazate', 'Kasbah Palace Ouarzazate',  'superior_a', 5, 'Resort de adobe con spa y vistas al Atlas.',                      'art:kasbah:hotel-ouar-supa'),
  ('erfoud',     'Hotel Palmeral Tafilalet',  'estandar',   4, 'Entre palmerales, cocina tradicional y piscina exterior.',        'art:oasis:hotel-erf-std'),
  ('erfoud',     'Dar Fósil Lodge',           'superior_a', 5, 'Antigua casa señorial restaurada con mármoles fósiles.',          'art:arch:hotel-erf-supa'),
  ('merzouga',   'Jaima Erg Chebbi',          'estandar',   4, 'Jaima con baño privado a pie de las dunas.',                      'art:jaima:hotel-mer-std'),
  ('merzouga',   'Jaima Luxury Dunes',        'superior_a', 5, 'Campamento de lujo con cena gourmet y telescopio.',               'art:stars:hotel-mer-supa'),
  ('marrakech',  'Riad Dar Zellige',          'estandar',   4, 'Riad en la medina con azotea y desayuno casero.',                 'art:medina:hotel-mar-std'),
  ('marrakech',  'Palais Rouge',              'superior_a', 5, 'Palacete con hammam, piscina y servicio de mayordomo.',           'art:arch:hotel-mar-supa'),
  ('marrakech',  'La Mamounia Garden Suite',  'superior_b', 5, 'La leyenda hotelera de Marrakech, jardines centenarios.',         'art:oasis:hotel-mar-supb'),
  ('agafay',     'Agafay Camp',               'estandar',   4, 'Campamento con jaimas de piedra y lona, baño privado.',           'art:jaima:hotel-camp-std'),
  ('agafay',     'Agafay Luxury Lodge',       'superior_a', 5, 'Lodge con piscina infinita frente al Atlas.',                     'art:stone:hotel-camp-supa'),
  ('essaouira',  'Riad Mar y Medina',         'estandar',   4, 'Riad frente a las murallas, desayuno en la azotea.',              'art:coast:hotel-ess-std'),
  ('essaouira',  'Heure Bleue Palais',        'superior_a', 5, 'Palacete colonial con piscina en la azotea.',                     'art:arch:hotel-ess-supa')
) as v(city_slug, name, category, stars, description, thumbnail_url) on v.city_slug = c.slug
on conflict (city_id, name) do nothing;

-- -----------------------------------------------------------------------------
-- Packs
-- -----------------------------------------------------------------------------
insert into public.packs (client_id, slug, title, subtitle, description, days, nights, max_pax, price_from, price_adult, price_child, child_age_max, featured, featured_rank, hero_image_url, route_label, status) values
  ('pk-marrakech', 'marrakech', 'Marrakech', 'La ciudad roja, cuatro días',
   'Marrakech a fondo: la medina y sus zocos, los palacios saadíes y de la Bahía, los jardines de Majorelle y el atardecer en Jemaa el-Fna. Un viaje corto para entender de dónde viene todo lo demás.',
   4, 3, 6, 355, 355, 240, 11, true, 1, 'art:medina:marrakech-hero',
   'Marrakech', 'published'),
  ('pk-ourika-agafay', 'marrakech-ourika-agafay', 'Marrakech, Ourika, Agafay, Marrakech', 'Valle del Ourika y desierto de piedra, con opción Essaouira',
   'Marrakech como base, el valle del Ourika a los pies del Atlas y una noche en el desierto de piedra del Agafay, con cena bajo las estrellas. Se puede sustituir el Agafay por un día completo en Essaouira.',
   5, 4, 6, 445, 445, 300, 11, true, 2, 'art:stone:pack-agafay-hero',
   'Marrakech, Ourika, Agafay, Marrakech - (Essaouira)', 'published'),
  ('pk-essaouira', 'marrakech-essaouira', 'Marrakech, Essaouira', 'La ciudad roja y la brisa atlántica',
   'Marrakech y la costa atlántica en un solo viaje: la medina blanca y azul de Essaouira, el puerto pesquero, las murallas portuguesas y los argánales del camino. Un recorrido para bajar el ritmo.',
   5, 4, 6, 425, 425, 285, 11, true, 3, 'art:coast:pack-essa-hero',
   'Marrakech, Essaouira', 'published'),
  ('pk-dunas', 'marrakech-zagora-dunas', 'Marrakech, Zagora, dunas', 'El valle del Draa hasta el mar de arena',
   'De Marrakech al desierto cruzando el Alto Atlas y el valle del Draa: Zagora, palmerales infinitos y noche en jaima a pie de duna, con amanecer en dromedario y regreso por la ruta de las mil kasbahs.',
   5, 4, 6, 495, 495, 330, 11, false, null, 'art:dunes:pack-dunas-hero',
   'Marrakech, Zagora, dunas', 'published'),
  ('pk-zagora-merzouga', 'marrakech-zagora-merzouga-ouarzazate', 'Marrakech, Zagora, Merzouga, Ouarzazate', 'Siete días de valles, dunas y kasbahs',
   'El circuito completo del sur por el valle del Draa: Zagora, el Tafilalet y dos noches en el gran mar de dunas del Erg Chebbi, con regreso por las gargantas del Todra, el valle del Dades y Ouarzazate.',
   7, 6, 6, 715, 715, 475, 11, false, null, 'art:kasbah:pack-kasbahs-hero',
   'Marrakech, Zagora, Merzouga, Ouarzazate', 'published'),
  ('pk-dades-merzouga', 'marrakech-ouarzazate-dades-merzouga', 'Marrakech, Ouarzazate, valle del Dades, Merzouga, Ouarzazate (2 noches de desierto)', 'Siete días por la ruta de las mil kasbahs',
   'La ruta clásica del sur con tiempo para vivirla: el Atlas y Ait Ben Haddou, el valle del Dades y las gargantas del Todra, dos noches en el desierto de Merzouga y regreso por Skoura y Ouarzazate.',
   7, 6, 6, 745, 745, 495, 11, false, null, 'art:kasbah:pack-gran-3',
   'Marrakech, Ouarzazate - Valle del Dades, Merzouga, Ouarzazate', 'published'),
  ('pk-dades-merzouga-1n', 'marrakech-ouarzazate-dades-merzouga-1-noche', 'Marrakech, Ouarzazate, valle del Dades, Merzouga, Ouarzazate (1 noche de desierto)', 'Seis días por la ruta de las mil kasbahs',
   'La ruta clásica del sur en formato corto: el Atlas y Ait Ben Haddou, el valle del Dades y las gargantas del Todra, una noche en el desierto de Merzouga y regreso por Skoura y Ouarzazate.',
   6, 5, 6, 665, 665, 445, 11, false, null, 'art:dunes:pack-gran-2',
   'Marrakech, Ouarzazate - valle del Dades, Merzouga, Ouarzazate (1 noche desierto)', 'published')
on conflict (slug) do nothing;

-- Galerias de packs
insert into public.pack_images (pack_id, image_url, sort_order)
select p.id, v.image_url, v.sort_order
from public.packs p
join (values
  ('marrakech',                            'art:arch:marrakech-2', 0), ('marrakech',                            'art:oasis:marrakech-3', 1), ('marrakech',                            'art:medina:marrakech-4', 2), ('marrakech',                            'art:arch:marrakech-5', 3),
  ('marrakech-ourika-agafay',              'art:medina:pack-agafay-1', 0), ('marrakech-ourika-agafay',              'art:stone:pack-agafay-2', 1), ('marrakech-ourika-agafay',              'art:jaima:pack-agafay-3', 2), ('marrakech-ourika-agafay',              'art:stars:pack-agafay-4', 3),
  ('marrakech-essaouira',                  'art:coast:pack-essa-1', 0), ('marrakech-essaouira',                  'art:medina:pack-essa-2', 1), ('marrakech-essaouira',                  'art:coast:pack-essa-3', 2), ('marrakech-essaouira',                  'art:arch:pack-essa-4', 3),
  ('marrakech-zagora-dunas',               'art:dunes:pack-dunas-1', 0), ('marrakech-zagora-dunas',               'art:camel:pack-dunas-2', 1), ('marrakech-zagora-dunas',               'art:jaima:pack-dunas-3', 2), ('marrakech-zagora-dunas',               'art:kasbah:pack-dunas-4', 3),
  ('marrakech-zagora-merzouga-ouarzazate', 'art:kasbah:pack-kasbahs-1', 0), ('marrakech-zagora-merzouga-ouarzazate', 'art:arch:pack-kasbahs-2', 1), ('marrakech-zagora-merzouga-ouarzazate', 'art:dunes:pack-kasbahs-3', 2), ('marrakech-zagora-merzouga-ouarzazate', 'art:medina:pack-kasbahs-4', 3),
  ('marrakech-ouarzazate-dades-merzouga',  'art:coast:pack-gran-1', 0), ('marrakech-ouarzazate-dades-merzouga',  'art:dunes:pack-gran-2', 1), ('marrakech-ouarzazate-dades-merzouga',  'art:kasbah:pack-gran-3', 2), ('marrakech-ouarzazate-dades-merzouga',  'art:medina:pack-gran-4', 3),
  ('marrakech-ouarzazate-dades-merzouga-1-noche', 'art:coast:pack-gran-1', 0), ('marrakech-ouarzazate-dades-merzouga-1-noche', 'art:dunes:pack-gran-2', 1), ('marrakech-ouarzazate-dades-merzouga-1-noche', 'art:kasbah:pack-gran-3', 2), ('marrakech-ouarzazate-dades-merzouga-1-noche', 'art:medina:pack-gran-4', 3)
) as v(pack_slug, image_url, sort_order) on v.pack_slug = p.slug
on conflict (pack_id, sort_order) do nothing;

-- Ciudades por pack (orden de visita)
insert into public.pack_cities (pack_id, city_id, sort_order)
select p.id, c.id, v.sort_order
from public.packs p
join (values
  ('marrakech',                            'marrakech', 0),
  ('marrakech-ourika-agafay',              'marrakech', 0), ('marrakech-ourika-agafay',              'agafay', 1),
  ('marrakech-essaouira',                  'marrakech', 0), ('marrakech-essaouira',                  'essaouira', 1),
  ('marrakech-zagora-dunas',               'marrakech', 0), ('marrakech-zagora-dunas',               'ouarzazate', 1), ('marrakech-zagora-dunas',               'merzouga', 2), ('marrakech-zagora-dunas',               'erfoud', 3),
  ('marrakech-zagora-merzouga-ouarzazate', 'marrakech', 0), ('marrakech-zagora-merzouga-ouarzazate', 'ouarzazate', 1), ('marrakech-zagora-merzouga-ouarzazate', 'merzouga', 2), ('marrakech-zagora-merzouga-ouarzazate', 'erfoud', 3),
  ('marrakech-ouarzazate-dades-merzouga',  'marrakech', 0), ('marrakech-ouarzazate-dades-merzouga',  'ouarzazate', 1), ('marrakech-ouarzazate-dades-merzouga',  'merzouga', 2), ('marrakech-ouarzazate-dades-merzouga',  'erfoud', 3),
  ('marrakech-ouarzazate-dades-merzouga-1-noche', 'marrakech', 0), ('marrakech-ouarzazate-dades-merzouga-1-noche', 'ouarzazate', 1), ('marrakech-ouarzazate-dades-merzouga-1-noche', 'merzouga', 2), ('marrakech-ouarzazate-dades-merzouga-1-noche', 'erfoud', 3)
) as v(pack_slug, city_slug, sort_order) on v.pack_slug = p.slug
join public.cities c on c.slug = v.city_slug
on conflict (pack_id, city_id) do nothing;

-- Itinerarios
insert into public.pack_itinerary_days (pack_id, day_number, title, description, image_url, city_id)
select p.id, v.day_number, v.title, v.description, v.image_url, c.id
from public.packs p
join (values
  -- Marrakech
  ('marrakech', 1, 'Llegada a Marrakech', 'Recepción en el aeropuerto, traslado al riad y primer atardecer en Jemaa el-Fna.', 'art:medina:d1-mar', 'marrakech'),
  ('marrakech', 2, 'Marrakech monumental', 'Palacio de la Bahía, tumbas saadíes, Koutoubia y zocos con guía local.', 'art:arch:d2-mar', 'marrakech'),
  ('marrakech', 3, 'Jardines y medina', 'Jardín Majorelle, Menara y tarde libre entre talleres de artesanía.', 'art:oasis:d3-mar', 'marrakech'),
  ('marrakech', 4, 'Marrakech — Salida', 'Mañana libre en la medina y traslado al aeropuerto.', 'art:medina:d4-mar', 'marrakech'),
  -- Marrakech, Ourika, Agafay, Marrakech
  ('marrakech-ourika-agafay', 1, 'Llegada a Marrakech', 'Traslado al riad y atardecer en Jemaa el-Fna.', 'art:medina:d1-agafay', 'marrakech'),
  ('marrakech-ourika-agafay', 2, 'Marrakech con guía local', 'Palacios, zocos y jardines. Tarde libre y cena en la medina.', 'art:arch:d2-agafay', 'marrakech'),
  ('marrakech-ourika-agafay', 3, 'Valle del Ourika', 'Día en el Atlas: aldeas bereberes, cascadas de Setti Fatma y comida junto al río. Regreso a Marrakech.', 'art:oasis:d3-ourika', 'marrakech'),
  ('marrakech-ourika-agafay', 4, 'Desierto de Agafay', 'Salida hacia el desierto de piedra, tarde de calma y cena bajo las estrellas en el campamento. Opción: día completo en Essaouira.', 'art:stone:d3-agafay', 'agafay'),
  ('marrakech-ourika-agafay', 5, 'Amanecer en Agafay — Marrakech', 'Desayuno con vistas al Atlas, regreso a Marrakech y traslado al aeropuerto.', 'art:stars:d4-agafay', 'marrakech'),
  -- Marrakech, Essaouira
  ('marrakech-essaouira', 1, 'Llegada a Marrakech', 'Traslado al riad y tarde libre en la medina.', 'art:medina:d1-essa', 'marrakech'),
  ('marrakech-essaouira', 2, 'Marrakech con guía local', 'Palacio de la Bahía, tumbas saadíes, Majorelle y zocos.', 'art:arch:d2-essa-mar', 'marrakech'),
  ('marrakech-essaouira', 3, 'Marrakech — Essaouira', 'Ruta entre argánales con parada en una cooperativa de aceite de argán.', 'art:coast:d2-essa', 'essaouira'),
  ('marrakech-essaouira', 4, 'Essaouira a fondo', 'Skala, puerto, medina y tarde de playa o windsurf.', 'art:coast:d3-essa', 'essaouira'),
  ('marrakech-essaouira', 5, 'Regreso y salida', 'Mañana libre frente al mar y traslado al aeropuerto de Marrakech.', 'art:medina:d4-essa', 'marrakech'),
  -- Marrakech, Zagora, dunas
  ('marrakech-zagora-dunas', 1, 'Marrakech — Alto Atlas — Ait Ben Haddou', 'Salida por el puerto de Tizi n''Tichka, visita del ksar de Ait Ben Haddou y noche en Ouarzazate.', 'art:kasbah:d1-dunas', 'ouarzazate'),
  ('marrakech-zagora-dunas', 2, 'Valle del Draa — Zagora', 'Palmerales infinitos del Draa, parada en Agdz y llegada a Zagora, puerta del Sahara.', 'art:oasis:d2-dunas', 'ouarzazate'),
  ('marrakech-zagora-dunas', 3, 'Zagora — Erfoud — Dunas', 'Ruta hacia el oasis del Tafilalet, entrada a las dunas en 4x4 y noche en jaima.', 'art:dunes:d3-dunas', 'merzouga'),
  ('marrakech-zagora-dunas', 4, 'Amanecer en las dunas — Gargantas del Todra', 'Amanecer sobre la arena, paseo en dromedario y ruta hacia las gargantas del Todra.', 'art:arch:d4-dunas', 'erfoud'),
  ('marrakech-zagora-dunas', 5, 'Ruta de las mil kasbahs — Marrakech', 'Regreso por Skoura y el valle de las rosas. Llegada a Marrakech al atardecer.', 'art:medina:d5-dunas', 'marrakech'),
  -- Marrakech, Zagora, Merzouga, Ouarzazate
  ('marrakech-zagora-merzouga-ouarzazate', 1, 'Llegada a Marrakech', 'Recepción en el aeropuerto, traslado al riad y primer paseo por la medina.', 'art:medina:d1-kasbahs', 'marrakech'),
  ('marrakech-zagora-merzouga-ouarzazate', 2, 'Marrakech — Alto Atlas — Zagora', 'Tizi n''Tichka, Ait Ben Haddou y descenso por el valle del Draa hasta Zagora.', 'art:kasbah:d3-kasbahs', 'ouarzazate'),
  ('marrakech-zagora-merzouga-ouarzazate', 3, 'Zagora — Erfoud — Merzouga', 'Palmerales del Draa, talleres de fósiles del Tafilalet y llegada al desierto. Noche en jaima.', 'art:dunes:d5-kasbahs', 'merzouga'),
  ('marrakech-zagora-merzouga-ouarzazate', 4, 'Día completo en Merzouga', 'Amanecer en las dunas, Khamlia, lago Dayet Srji y segunda noche en jaima.', 'art:camel:d6-kasbahs', 'merzouga'),
  ('marrakech-zagora-merzouga-ouarzazate', 5, 'Merzouga — Todra — Dades', 'Gargantas del Todra y llegada al valle del Dades.', 'art:arch:d5b-kasbahs', 'erfoud'),
  ('marrakech-zagora-merzouga-ouarzazate', 6, 'Dades — Skoura — Ouarzazate', 'Valle de las rosas, palmeral de Skoura y kasbah Taourirt.', 'art:oasis:d4-kasbahs', 'ouarzazate'),
  ('marrakech-zagora-merzouga-ouarzazate', 7, 'Ouarzazate — Marrakech', 'Regreso por el Atlas y traslado al aeropuerto.', 'art:medina:d7-kasbahs', 'marrakech'),
  -- Marrakech, Ouarzazate, valle del Dades, Merzouga, Ouarzazate
  ('marrakech-ouarzazate-dades-merzouga', 1, 'Llegada a Marrakech', 'Recepción, traslado al riad y paseo de orientación por la medina.', 'art:medina:d1-gran', 'marrakech'),
  ('marrakech-ouarzazate-dades-merzouga', 2, 'Marrakech — Atlas — Ouarzazate', 'El puerto del Tizi n''Tichka y el ksar de Ait Ben Haddou.', 'art:kasbah:d3-gran', 'ouarzazate'),
  ('marrakech-ouarzazate-dades-merzouga', 3, 'Ouarzazate — Skoura — Valle del Dades', 'Palmeral de Skoura, valle de las rosas y gargantas del Dades.', 'art:oasis:d4-gran', 'ouarzazate'),
  ('marrakech-ouarzazate-dades-merzouga', 4, 'Todra — Erfoud — Merzouga', 'Gargantas del Todra, oasis del Tafilalet y primera noche en el desierto.', 'art:dunes:d5-gran', 'merzouga'),
  ('marrakech-ouarzazate-dades-merzouga', 5, 'Día completo en Merzouga', 'Amanecer en las dunas, Khamlia, lago Dayet Srji y segunda noche en jaima.', 'art:camel:d6-gran', 'merzouga'),
  ('marrakech-ouarzazate-dades-merzouga', 6, 'Merzouga — Ouarzazate', 'Regreso por el Tafilalet y la ruta de las mil kasbahs hasta Ouarzazate.', 'art:oasis:d7-gran', 'ouarzazate'),
  ('marrakech-ouarzazate-dades-merzouga', 7, 'Ouarzazate — Marrakech — Salida', 'Cruce del Atlas y traslado al aeropuerto de Marrakech.', 'art:medina:d8-gran', 'marrakech'),
  -- Marrakech, Ouarzazate, valle del Dades, Merzouga, Ouarzazate (1 noche de desierto)
  ('marrakech-ouarzazate-dades-merzouga-1-noche', 1, 'Llegada a Marrakech', 'Recepción, traslado al riad y paseo de orientación por la medina.', 'art:medina:d1-gran1n', 'marrakech'),
  ('marrakech-ouarzazate-dades-merzouga-1-noche', 2, 'Marrakech — Atlas — Ouarzazate', 'El puerto del Tizi n''Tichka y el ksar de Ait Ben Haddou.', 'art:kasbah:d2-gran1n', 'ouarzazate'),
  ('marrakech-ouarzazate-dades-merzouga-1-noche', 3, 'Ouarzazate — Skoura — Valle del Dades', 'Palmeral de Skoura, valle de las rosas y gargantas del Dades.', 'art:oasis:d3-gran1n', 'ouarzazate'),
  ('marrakech-ouarzazate-dades-merzouga-1-noche', 4, 'Todra — Erfoud — Merzouga', 'Gargantas del Todra, oasis del Tafilalet y noche en jaima a pie de duna.', 'art:dunes:d4-gran1n', 'merzouga'),
  ('marrakech-ouarzazate-dades-merzouga-1-noche', 5, 'Amanecer en Merzouga — Ouarzazate', 'Amanecer sobre las dunas y regreso por la ruta de las mil kasbahs.', 'art:camel:d5-gran1n', 'ouarzazate'),
  ('marrakech-ouarzazate-dades-merzouga-1-noche', 6, 'Ouarzazate — Marrakech — Salida', 'Cruce del Atlas y traslado al aeropuerto de Marrakech.', 'art:medina:d6-gran1n', 'marrakech')
) as v(pack_slug, day_number, title, description, image_url, city_slug) on v.pack_slug = p.slug
left join public.cities c on c.slug = v.city_slug
on conflict (pack_id, day_number) do nothing;

-- Detalles comunes (los 6 packs comparten el bloque base)
insert into public.pack_details (pack_id, type, content, sort_order)
select p.id, v.type::public.detail_type, v.content, v.sort_order
from public.packs p
cross join (values
  ('incluye',         'Alojamiento y desayuno', 0),
  ('incluye',         'Cena (bebidas no incluidas)', 1),
  ('incluye',         'Traslados de llegada y salida', 2),
  ('incluye',         'Circuito exclusivo con asistencia en su idioma', 3),
  ('incluye',         'Visita privada', 4),
  ('no_incluye',      'Seguro de viaje', 5),
  ('no_incluye',      'Bebidas en las cenas', 6),
  ('nota_importante', 'Pack en hotel con encanto, en muchos casos sin categoría hotelera.', 7),
  ('nota_importante', 'Habitaciones privadas: conviene hacer la reserva con antelación.', 8),
  ('nota_importante', 'Circuito exclusivo para su grupo.', 9),
  ('nota_importante', 'Consultar condiciones especiales en festivos y puentes.', 10),
  ('nota_importante', 'Sujeto a disponibilidad en el momento de la reserva.', 11)
) as v(type, content, sort_order)
where p.slug in ('marrakech', 'marrakech-ourika-agafay', 'marrakech-essaouira', 'marrakech-zagora-dunas', 'marrakech-zagora-merzouga-ouarzazate', 'marrakech-ouarzazate-dades-merzouga', 'marrakech-ouarzazate-dades-merzouga-1-noche')
on conflict (pack_id, sort_order) do nothing;

-- Notas extra especificas
insert into public.pack_details (pack_id, type, content, sort_order)
select p.id, 'nota_importante'::public.detail_type, v.content, 12
from public.packs p
join (values
  ('marrakech-ourika-agafay',              'La opción Essaouira sustituye la noche en el Agafay por una excursión de día completo a la costa.'),
  ('marrakech-zagora-merzouga-ouarzazate', 'Ruta con etapas largas de carretera: recomendable para quienes disfrutan del viaje por etapas.'),
  ('marrakech-ouarzazate-dades-merzouga',  'Dos noches consecutivas en el desierto: se recomienda equipaje de mano flexible.')
) as v(pack_slug, content) on v.pack_slug = p.slug
on conflict (pack_id, sort_order) do nothing;

-- Highlights
insert into public.pack_highlights (pack_id, title, description, sort_order)
select p.id, 'Circuito exclusivo en vehículo 4x4 con chófer',
       'Hablamos su idioma y viajamos con usted. Hasta 6 pasajeros. Viaje cómodo, seguro y personalizado.', 0
from public.packs p
where p.slug in ('marrakech', 'marrakech-ourika-agafay', 'marrakech-essaouira', 'marrakech-zagora-dunas', 'marrakech-zagora-merzouga-ouarzazate', 'marrakech-ouarzazate-dades-merzouga', 'marrakech-ouarzazate-dades-merzouga-1-noche')
on conflict (pack_id, sort_order) do nothing;

insert into public.pack_highlights (pack_id, title, description, sort_order)
select p.id, v.title, v.description, 1
from public.packs p
join (values
  ('marrakech-zagora-dunas',               'En Merzouga, duerma en jaima con baño privado', 'Opcional en hotel o en jaima con baño privado, a pie de las dunas.'),
  ('marrakech-zagora-merzouga-ouarzazate', 'En Merzouga, duerma en jaima con baño privado', 'Opcional en hotel o en jaima con baño privado, a pie de las dunas.'),
  ('marrakech-ouarzazate-dades-merzouga',  'En Merzouga, duerma en jaima con baño privado', 'Opcional en hotel o en jaima con baño privado, a pie de las dunas.'),
  ('marrakech',                            'Alojamiento en riad dentro de la medina', 'A pasos de Jemaa el-Fna, con patio, azotea y desayuno casero.'),
  ('marrakech-ourika-agafay',              'Noche en campamento del Agafay', 'Jaima con baño privado, cena a la luz de las velas y el cielo más estrellado a 40 minutos de Marrakech.'),
  ('marrakech-ouarzazate-dades-merzouga-1-noche', 'En Merzouga, duerma en jaima con baño privado', 'Opcional en hotel o en jaima con baño privado, a pie de las dunas.'),
  ('marrakech-essaouira',                  'Essaouira, Patrimonio de la Humanidad', 'Alojamiento dentro de la medina, a pasos de la Skala y del puerto pesquero.')
) as v(pack_slug, title, description) on v.pack_slug = p.slug
on conflict (pack_id, sort_order) do nothing;

-- -----------------------------------------------------------------------------
-- Estancias por pack (cascada de hoteles)
-- -----------------------------------------------------------------------------
insert into public.pack_stays (client_id, pack_id, city_id, nights, sort_order)
select v.client_id, p.id, c.id, v.nights, v.sort_order
from public.packs p
join (values
  ('st-mar-marrakech',      'marrakech',                            'marrakech',  3, 0),
  ('st-agafay-marrakech',   'marrakech-ourika-agafay',              'marrakech',  3, 0),
  ('st-agafay-camp',        'marrakech-ourika-agafay',              'agafay',     1, 1),
  ('st-essa-marrakech',     'marrakech-essaouira',                  'marrakech',  2, 0),
  ('st-essa-essaouira',     'marrakech-essaouira',                  'essaouira',  2, 1),
  ('st-dunas-ouarzazate',   'marrakech-zagora-dunas',               'ouarzazate', 2, 0),
  ('st-dunas-erfoud',       'marrakech-zagora-dunas',               'erfoud',     1, 1),
  ('st-dunas-merzouga',     'marrakech-zagora-dunas',               'merzouga',   1, 2),
  ('st-kasbahs-marrakech',  'marrakech-zagora-merzouga-ouarzazate', 'marrakech',  2, 0),
  ('st-kasbahs-ouarzazate', 'marrakech-zagora-merzouga-ouarzazate', 'ouarzazate', 2, 1),
  ('st-kasbahs-merzouga',   'marrakech-zagora-merzouga-ouarzazate', 'merzouga',   1, 2),
  ('st-gran-marrakech',     'marrakech-ouarzazate-dades-merzouga',  'marrakech',  2, 0),
  ('st-gran-ouarzazate',    'marrakech-ouarzazate-dades-merzouga',  'ouarzazate', 2, 1),
  ('st-gran-merzouga',      'marrakech-ouarzazate-dades-merzouga',  'merzouga',   2, 2),
  ('st-gran1n-marrakech',   'marrakech-ouarzazate-dades-merzouga-1-noche',  'marrakech',  2, 0),
  ('st-gran1n-ouarzazate',  'marrakech-ouarzazate-dades-merzouga-1-noche',  'ouarzazate', 2, 1),
  ('st-gran1n-merzouga',    'marrakech-ouarzazate-dades-merzouga-1-noche',  'merzouga',   1, 2)
) as v(client_id, pack_slug, city_slug, nights, sort_order) on v.pack_slug = p.slug
join public.cities c on c.slug = v.city_slug
on conflict (client_id) do nothing;

-- Opciones de hotel por estancia
insert into public.pack_stay_hotels (client_id, stay_id, hotel_id, category, supplement_pp_night, is_default, sort_order)
select v.client_id, s.id, h.id, v.category::public.hotel_category, v.supplement, v.is_default, v.sort_order
from public.pack_stays s
join (values
  -- Marrakech
  ('op-mar-mar-std',     'st-mar-marrakech',      'Riad Dar Zellige',         'estandar',   0,  true,  0),
  ('op-mar-mar-supa',    'st-mar-marrakech',      'Palais Rouge',             'superior_a', 28, false, 1),
  ('op-mar-mar-supb',    'st-mar-marrakech',      'La Mamounia Garden Suite', 'superior_b', 65, false, 2),
  -- Marrakech, Zagora, dunas
  ('op-dunas-ouar-std',  'st-dunas-ouarzazate',   'Riad Dar Kasbah',          'estandar',   0,  true,  0),
  ('op-dunas-ouar-supa', 'st-dunas-ouarzazate',   'Kasbah Palace Ouarzazate', 'superior_a', 22, false, 1),
  ('op-dunas-erf-std',   'st-dunas-erfoud',       'Hotel Palmeral Tafilalet', 'estandar',   0,  true,  0),
  ('op-dunas-erf-supa',  'st-dunas-erfoud',       'Dar Fósil Lodge',          'superior_a', 18, false, 1),
  ('op-dunas-mer-std',   'st-dunas-merzouga',     'Jaima Erg Chebbi',         'estandar',   0,  true,  0),
  ('op-dunas-mer-supa',  'st-dunas-merzouga',     'Jaima Luxury Dunes',       'superior_a', 35, false, 1),
  -- Marrakech, Zagora, Merzouga, Ouarzazate
  ('op-kas-mar-std',     'st-kasbahs-marrakech',  'Riad Dar Zellige',         'estandar',   0,  true,  0),
  ('op-kas-mar-supa',    'st-kasbahs-marrakech',  'Palais Rouge',             'superior_a', 28, false, 1),
  ('op-kas-mar-supb',    'st-kasbahs-marrakech',  'La Mamounia Garden Suite', 'superior_b', 65, false, 2),
  ('op-kas-ouar-std',    'st-kasbahs-ouarzazate', 'Riad Dar Kasbah',          'estandar',   0,  true,  0),
  ('op-kas-ouar-supa',   'st-kasbahs-ouarzazate', 'Kasbah Palace Ouarzazate', 'superior_a', 22, false, 1),
  ('op-kas-mer-std',     'st-kasbahs-merzouga',   'Jaima Erg Chebbi',         'estandar',   0,  true,  0),
  ('op-kas-mer-supa',    'st-kasbahs-merzouga',   'Jaima Luxury Dunes',       'superior_a', 35, false, 1),
  -- Marrakech, Ourika, Agafay, Marrakech
  ('op-aga-mar-std',     'st-agafay-marrakech',   'Riad Dar Zellige',         'estandar',   0,  true,  0),
  ('op-aga-mar-supa',    'st-agafay-marrakech',   'Palais Rouge',             'superior_a', 28, false, 1),
  ('op-aga-camp-std',    'st-agafay-camp',        'Agafay Camp',              'estandar',   0,  true,  0),
  ('op-aga-camp-supa',   'st-agafay-camp',        'Agafay Luxury Lodge',      'superior_a', 40, false, 1),
  -- Marrakech, Ouarzazate, valle del Dades, Merzouga, Ouarzazate
  ('op-gran-mar-std',    'st-gran-marrakech',     'Riad Dar Zellige',         'estandar',   0,  true,  0),
  ('op-gran-mar-supa',   'st-gran-marrakech',     'Palais Rouge',             'superior_a', 28, false, 1),
  ('op-gran-mar-supb',   'st-gran-marrakech',     'La Mamounia Garden Suite', 'superior_b', 65, false, 2),
  ('op-gran-ouar-std',   'st-gran-ouarzazate',    'Riad Dar Kasbah',          'estandar',   0,  true,  0),
  ('op-gran-ouar-supa',  'st-gran-ouarzazate',    'Kasbah Palace Ouarzazate', 'superior_a', 22, false, 1),
  ('op-gran-mer-std',    'st-gran-merzouga',      'Jaima Erg Chebbi',         'estandar',   0,  true,  0),
  ('op-gran-mer-supa',   'st-gran-merzouga',      'Jaima Luxury Dunes',       'superior_a', 35, false, 1),
  -- Marrakech, Essaouira
  ('op-essa-mar-std',    'st-essa-marrakech',     'Riad Dar Zellige',         'estandar',   0,  true,  0),
  ('op-essa-mar-supa',   'st-essa-marrakech',     'Palais Rouge',             'superior_a', 28, false, 1),
  ('op-essa-ess-std',    'st-essa-essaouira',     'Riad Mar y Medina',        'estandar',   0,  true,  0),
  ('op-essa-ess-supa',   'st-essa-essaouira',     'Heure Bleue Palais',       'superior_a', 30, false, 1),
  -- Marrakech, Ouarzazate, valle del Dades, Merzouga, Ouarzazate (1 noche de desierto)
  ('op-gran1n-mar-std',  'st-gran1n-marrakech',   'Riad Dar Zellige',         'estandar',   0,  true,  0),
  ('op-gran1n-mar-supa', 'st-gran1n-marrakech',   'Palais Rouge',             'superior_a', 28, false, 1),
  ('op-gran1n-mar-supb', 'st-gran1n-marrakech',   'La Mamounia Garden Suite', 'superior_b', 65, false, 2),
  ('op-gran1n-ouar-std', 'st-gran1n-ouarzazate',  'Riad Dar Kasbah',          'estandar',   0,  true,  0),
  ('op-gran1n-ouar-supa','st-gran1n-ouarzazate',  'Kasbah Palace Ouarzazate', 'superior_a', 22, false, 1),
  ('op-gran1n-mer-std',  'st-gran1n-merzouga',    'Jaima Erg Chebbi',         'estandar',   0,  true,  0),
  ('op-gran1n-mer-supa', 'st-gran1n-merzouga',    'Jaima Luxury Dunes',       'superior_a', 35, false, 1)
) as v(client_id, stay_client_id, hotel_name, category, supplement, is_default, sort_order) on v.stay_client_id = s.client_id
join public.hotels h on h.city_id = s.city_id and h.name = v.hotel_name
on conflict (stay_id, hotel_id) do nothing;

-- -----------------------------------------------------------------------------
-- Actividades (precios null hasta que lleguen)
-- -----------------------------------------------------------------------------
insert into public.activities (client_id, title, description, image_url, city_id, duration_label, price_adult, price_child, status)
select v.client_id, v.title, v.description, v.image_url, c.id, v.duration_label, null, null, 'published'
from (values
  ('ac-globo',     'Amanecer en globo',            'Vuelo al amanecer sobre el palmeral y el Atlas con desayuno bereber.',      'art:stars:act-globo',  'marrakech', 'Medio día'),
  ('ac-quad',      'Ruta en quad por las dunas',   'Dos horas de quad por el Erg Chebbi con monitor.',                          'art:dunes:act-quad',   'merzouga',  '2 horas'),
  ('ac-hammam',    'Hammam y masaje tradicional',  'Ritual completo con jabón negro y aceite de argán.',                        'art:arch:act-hammam',  'marrakech', '2 horas'),
  ('ac-cocina',    'Taller de cocina marroquí',    'Del zoco a la mesa: prepara tu propio tajine con una cocinera local.',      'art:medina:act-cocina','marrakech', 'Medio día'),
  ('ac-surf',      'Clase de windsurf',            'Iniciación al windsurf en la bahía de Essaouira, material incluido.',       'art:coast:act-surf',   'essaouira', '3 horas'),
  ('ac-sandboard', 'Sandboard en el Erg Chebbi',   'Desciende las dunas sobre una tabla al atardecer.',                         'art:dunes:act-sand',   'merzouga',  '2 horas')
) as v(client_id, title, description, image_url, city_slug, duration_label)
left join public.cities c on c.slug = v.city_slug
on conflict (client_id) do nothing;

-- -----------------------------------------------------------------------------
-- Consejos de viaje (13)
-- -----------------------------------------------------------------------------
insert into public.travel_tips (country_code, slug, title, content, sort_order, status) values
  ('MA', 'moneda',        'Moneda',                          'El dírham marroquí (MAD). 1 euro equivale aproximadamente a 10,5 MAD. Se recomienda cambiar en destino y llevar efectivo para zocos y propinas.', 0, 'published'),
  ('MA', 'clima',         'Clima',                           'Primavera y otoño son ideales. En el desierto los días son cálidos y las noches frescas; en verano las temperaturas superan los 40 grados.', 1, 'published'),
  ('MA', 'telefono',      'Teléfono',                        'Prefijo +212. Hay cobertura 4G en las ciudades y en buena parte de las rutas. Las tarjetas SIM locales son económicas.', 2, 'published'),
  ('MA', 'horaria',       'Diferencia horaria',              'Marruecos comparte huso con España peninsular la mayor parte del año; durante el Ramadán se atrasa una hora.', 3, 'published'),
  ('MA', 'electricidad',  'Electricidad',                    '220 V con enchufes tipo europeo de dos clavijas. No se necesita adaptador viajando desde España.', 4, 'published'),
  ('MA', 'propinas',      'Propinas',                        'Son parte de la cultura. Orientación: 10-20 MAD en restaurantes, 20-50 MAD por día para chóferes y guías.', 5, 'published'),
  ('MA', 'religion',      'Religión',                        'País musulmán y acogedor. Durante el Ramadán la vida cambia de ritmo; conviene informarse de las fechas antes de viajar.', 6, 'published'),
  ('MA', 'idioma',        'Idioma',                          'Árabe y bereber son oficiales. El francés está muy extendido y el español se habla en el norte y en zonas turísticas.', 7, 'published'),
  ('MA', 'compras',       'Compras y artesanía',             'Alfombras, cuero, cerámica, especias y aceite de argán. Regatear es costumbre y se espera: empieza por la mitad del precio.', 8, 'published'),
  ('MA', 'indumentaria',  'Indumentaria',                    'Ropa cómoda y discreta, calzado cerrado para el desierto y una prenda de abrigo para las noches. En las mezquitas, hombros y rodillas cubiertos.', 9, 'published'),
  ('MA', 'sanitarios',    'Requisitos sanitarios',           'No se exigen vacunas para viajar desde Europa. Se recomienda beber agua embotellada y llevar un pequeño botiquín.', 10, 'published'),
  ('MA', 'embajada',      'Embajada y consulado',            'Embajada de España en Rabat: Ambassade d''Espagne, Rue Ain Khalouiya. Consulados en Casablanca, Tánger, Tetuán, Nador, Agadir y Rabat.', 11, 'published'),
  ('MA', 'visado',        'Visado y requisitos de entrada',  'Pasaporte en vigor con validez mínima de seis meses. Los ciudadanos españoles no necesitan visado para estancias de hasta 90 días.', 12, 'published')
on conflict (country_code, slug) do nothing;

-- -----------------------------------------------------------------------------
-- Tarifa base por pack (sin temporada; season_id null)
-- -----------------------------------------------------------------------------
insert into public.pack_prices (pack_id, season_id, price_adult, price_child)
select p.id, null, v.price_adult, v.price_child
from public.packs p
join (values
  ('marrakech',                            355, 240),
  ('marrakech-ourika-agafay',              445, 300),
  ('marrakech-essaouira',                  425, 285),
  ('marrakech-zagora-dunas',               495, 330),
  ('marrakech-zagora-merzouga-ouarzazate', 715, 475),
  ('marrakech-ouarzazate-dades-merzouga',  745, 495),
  ('marrakech-ouarzazate-dades-merzouga-1-noche', 665, 445)
) as v(pack_slug, price_adult, price_child) on v.pack_slug = p.slug
on conflict (pack_id) where season_id is null do nothing;
