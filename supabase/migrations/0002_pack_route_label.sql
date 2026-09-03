-- =============================================================================
-- 0002 — Recorrido comercial del pack
-- El front muestra en la tarjeta el recorrido tal y como lo nombra la agencia
-- ("Marrakech, Ouarzazate - valle del Dades, Merzouga, Ouarzazate (2 noches
-- desierto)"). No se puede derivar de pack_cities: incluye paradas sin ficha de
-- ciudad (Ourika, Zagora, Dades) y matices comerciales. Nullable: sin valor, el
-- front cae en la lista de ciudades.
-- =============================================================================

alter table public.packs
  add column if not exists route_label text;
