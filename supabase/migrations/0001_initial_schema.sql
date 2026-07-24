-- =============================================================================
-- Kavan Tours — 0001_initial_schema.sql
-- Esquema inicial: contenido (ciudades, packs, hoteles, actividades, consejos),
-- precios (temporadas), cotizaciones y capa admin. Diseño según Anexo A.
-- =============================================================================

create extension if not exists pgcrypto;

-- -----------------------------------------------------------------------------
-- Enums
-- -----------------------------------------------------------------------------
create type public.publish_status as enum ('draft', 'published');
create type public.hotel_category as enum ('estandar', 'superior_a', 'superior_b', 'superior_c');
create type public.quote_status as enum ('borrador', 'enviada', 'contactada', 'confirmada', 'descartada');
create type public.detail_type as enum ('incluye', 'no_incluye', 'nota_importante');

-- -----------------------------------------------------------------------------
-- Admins + is_admin() + private.grant_admin()
-- -----------------------------------------------------------------------------
create table public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  email text not null unique,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.admins where user_id = auth.uid()
  );
$$;

grant execute on function public.is_admin() to anon, authenticated;

create schema if not exists private;

-- Solo service_role (via SQL editor / backend). Da permisos de admin por email.
create or replace function private.grant_admin(p_email text)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid;
begin
  select id into v_user_id
  from auth.users
  where lower(email) = lower(p_email)
  limit 1;

  if v_user_id is null then
    raise exception 'No existe usuario auth con email %', p_email;
  end if;

  insert into public.admins (user_id, email)
  values (v_user_id, lower(p_email))
  on conflict (user_id) do nothing;
end;
$$;

revoke execute on function private.grant_admin(text) from public;
revoke execute on function private.grant_admin(text) from anon;
revoke execute on function private.grant_admin(text) from authenticated;

-- -----------------------------------------------------------------------------
-- Trigger updated_at
-- -----------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- -----------------------------------------------------------------------------
-- Ciudades
-- -----------------------------------------------------------------------------
create table public.cities (
  id uuid primary key default gen_random_uuid(),
  client_id text unique,                      -- id usado por el front (ej. 'c-merzouga')
  slug text not null unique,
  name text not null,
  short_description text not null default '',
  long_description text not null default '',
  hero_image_url text not null default '',
  status public.publish_status not null default 'draft',
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger trg_cities_updated_at
  before update on public.cities
  for each row execute function public.set_updated_at();

create table public.city_images (
  id uuid primary key default gen_random_uuid(),
  city_id uuid not null references public.cities (id) on delete cascade,
  image_url text not null,
  sort_order int not null default 0,
  unique (city_id, sort_order)
);

create table public.city_pois (
  id uuid primary key default gen_random_uuid(),
  client_id text unique,                      -- id usado por el front (ej. 'p-erg')
  city_id uuid not null references public.cities (id) on delete cascade,
  title text not null,
  description text not null default '',
  image_url text not null default '',
  sort_order int not null default 0,
  unique (city_id, sort_order)
);

-- -----------------------------------------------------------------------------
-- Packs
-- -----------------------------------------------------------------------------
create table public.packs (
  id uuid primary key default gen_random_uuid(),
  client_id text unique,                      -- id usado por el front (ej. 'pk-dunas')
  slug text not null unique,
  title text not null,
  subtitle text not null default '',
  description text not null default '',
  days int not null check (days > 0),
  nights int not null check (nights >= 0),
  max_pax int not null default 6 check (max_pax > 0),
  price_from numeric(10,2) not null default 0,     -- denormalizado para listados
  price_adult numeric(10,2) not null default 0,    -- usado por el front
  price_child numeric(10,2) not null default 0,    -- usado por el front
  child_age_max int not null default 11,
  featured boolean not null default false,
  featured_rank int,
  hero_image_url text not null default '',
  status public.publish_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger trg_packs_updated_at
  before update on public.packs
  for each row execute function public.set_updated_at();

create table public.pack_images (
  id uuid primary key default gen_random_uuid(),
  pack_id uuid not null references public.packs (id) on delete cascade,
  image_url text not null,
  sort_order int not null default 0,
  unique (pack_id, sort_order)
);

create table public.pack_cities (
  pack_id uuid not null references public.packs (id) on delete cascade,
  city_id uuid not null references public.cities (id) on delete cascade,
  sort_order int not null default 0,          -- orden de visita
  primary key (pack_id, city_id)
);

create table public.pack_itinerary_days (
  id uuid primary key default gen_random_uuid(),
  pack_id uuid not null references public.packs (id) on delete cascade,
  day_number int not null check (day_number > 0),
  title text not null,
  description text not null default '',
  image_url text not null default '',
  city_id uuid references public.cities (id) on delete set null,
  unique (pack_id, day_number)
);

create table public.pack_details (
  id uuid primary key default gen_random_uuid(),
  pack_id uuid not null references public.packs (id) on delete cascade,
  type public.detail_type not null,
  content text not null,
  sort_order int not null default 0,
  unique (pack_id, sort_order)
);

create table public.pack_highlights (
  id uuid primary key default gen_random_uuid(),
  pack_id uuid not null references public.packs (id) on delete cascade,
  title text not null,
  description text not null default '',
  sort_order int not null default 0,
  unique (pack_id, sort_order)
);

-- -----------------------------------------------------------------------------
-- Consejos de viaje (clave-valor editable sin migraciones)
-- -----------------------------------------------------------------------------
create table public.travel_tips (
  id uuid primary key default gen_random_uuid(),
  country_code text not null default 'MA',
  slug text not null,
  title text not null,
  content text not null default '',
  icon text,
  sort_order int not null default 0,
  status public.publish_status not null default 'published',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (country_code, slug)
);

create trigger trg_travel_tips_updated_at
  before update on public.travel_tips
  for each row execute function public.set_updated_at();

-- -----------------------------------------------------------------------------
-- Hoteles + estancias de pack ("cascada" de hoteles por ciudad)
-- -----------------------------------------------------------------------------
create table public.hotels (
  id uuid primary key default gen_random_uuid(),
  city_id uuid not null references public.cities (id) on delete cascade,
  name text not null,
  category public.hotel_category not null default 'estandar',
  stars int not null default 4 check (stars between 1 and 5),
  description text not null default '',
  thumbnail_url text not null default '',
  status public.publish_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (city_id, name)
);

create trigger trg_hotels_updated_at
  before update on public.hotels
  for each row execute function public.set_updated_at();

create table public.pack_stays (
  id uuid primary key default gen_random_uuid(),
  client_id text unique,                      -- id usado por el front (ej. 'st-dunas-ouarzazate')
  pack_id uuid not null references public.packs (id) on delete cascade,
  city_id uuid not null references public.cities (id) on delete restrict,
  nights int not null check (nights > 0),
  sort_order int not null default 0,
  unique (pack_id, sort_order)
);

create table public.pack_stay_hotels (
  id uuid primary key default gen_random_uuid(),
  client_id text unique,                      -- id usado por el front (ej. 'op-dunas-ouar-supa')
  stay_id uuid not null references public.pack_stays (id) on delete cascade,
  hotel_id uuid not null references public.hotels (id) on delete restrict,
  category public.hotel_category not null default 'estandar',
  supplement_pp_night numeric(10,2) not null default 0,
  is_default boolean not null default false,
  sort_order int not null default 0,
  unique (stay_id, hotel_id)
);

-- Un unico hotel por defecto por estancia
create unique index pack_stay_hotels_one_default
  on public.pack_stay_hotels (stay_id)
  where is_default;

-- -----------------------------------------------------------------------------
-- Actividades
-- -----------------------------------------------------------------------------
create table public.activities (
  id uuid primary key default gen_random_uuid(),
  client_id text unique,                      -- id usado por el front (ej. 'ac-globo')
  title text not null,
  description text not null default '',
  image_url text not null default '',
  city_id uuid references public.cities (id) on delete set null,
  hotel_id uuid references public.hotels (id) on delete set null,
  duration_label text not null default '',
  price_adult numeric(10,2),                  -- null = precio pendiente, no suma
  price_child numeric(10,2),
  status public.publish_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger trg_activities_updated_at
  before update on public.activities
  for each row execute function public.set_updated_at();

-- -----------------------------------------------------------------------------
-- Precios: temporadas + tarifas por pack
-- -----------------------------------------------------------------------------
create table public.seasons (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  start_date date not null,
  end_date date not null,
  check (end_date >= start_date)
);

create table public.pack_prices (
  id uuid primary key default gen_random_uuid(),
  pack_id uuid not null references public.packs (id) on delete cascade,
  season_id uuid references public.seasons (id) on delete cascade,  -- null = tarifa base
  price_adult numeric(10,2) not null,
  price_child numeric(10,2) not null,
  unique (pack_id, season_id)
);

-- Una unica fila base (sin temporada) por pack
create unique index pack_prices_one_base_per_pack
  on public.pack_prices (pack_id)
  where season_id is null;

-- -----------------------------------------------------------------------------
-- Cotizaciones (id uuid = capability token)
-- -----------------------------------------------------------------------------
create table public.quotes (
  id uuid primary key default gen_random_uuid(),
  pack_id uuid not null references public.packs (id) on delete restrict,
  departure_date date not null,
  days int,
  flight_number text not null default '',
  rooms jsonb not null default '[]'::jsonb,             -- [{adults, children}]
  hotel_selection jsonb not null default '{}'::jsonb,   -- { stayId: optionId }
  activity_ids jsonb not null default '[]'::jsonb,      -- [activityId]
  price_breakdown jsonb,                                -- snapshot congelado del desglose
  total numeric(10,2),
  contact_name text,
  contact_email text,
  contact_phone text,
  channel text,                                         -- 'email' | 'whatsapp' | ...
  status public.quote_status not null default 'borrador',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger trg_quotes_updated_at
  before update on public.quotes
  for each row execute function public.set_updated_at();

-- Recuperacion de una cotizacion por su uuid (capability token), sin exponer select
create or replace function public.get_quote(p_id uuid)
returns setof public.quotes
language sql
security definer
stable
set search_path = public
as $$
  select * from public.quotes where id = p_id;
$$;

grant execute on function public.get_quote(uuid) to anon, authenticated;

-- =============================================================================
-- RLS
-- =============================================================================
alter table public.admins enable row level security;
alter table public.cities enable row level security;
alter table public.city_images enable row level security;
alter table public.city_pois enable row level security;
alter table public.packs enable row level security;
alter table public.pack_images enable row level security;
alter table public.pack_cities enable row level security;
alter table public.pack_itinerary_days enable row level security;
alter table public.pack_details enable row level security;
alter table public.pack_highlights enable row level security;
alter table public.travel_tips enable row level security;
alter table public.hotels enable row level security;
alter table public.pack_stays enable row level security;
alter table public.pack_stay_hotels enable row level security;
alter table public.activities enable row level security;
alter table public.seasons enable row level security;
alter table public.pack_prices enable row level security;
alter table public.quotes enable row level security;

-- admins: cada admin solo ve su propia fila
create policy admins_select_own on public.admins
  for select using (user_id = auth.uid());

-- cities: lectura publica de published
create policy cities_public_read on public.cities
  for select using (status = 'published');
create policy cities_admin_all on public.cities
  for all using (public.is_admin()) with check (public.is_admin());

-- city_images / city_pois: heredan del padre
create policy city_images_public_read on public.city_images
  for select using (exists (
    select 1 from public.cities c where c.id = city_id and c.status = 'published'
  ));
create policy city_images_admin_all on public.city_images
  for all using (public.is_admin()) with check (public.is_admin());

create policy city_pois_public_read on public.city_pois
  for select using (exists (
    select 1 from public.cities c where c.id = city_id and c.status = 'published'
  ));
create policy city_pois_admin_all on public.city_pois
  for all using (public.is_admin()) with check (public.is_admin());

-- packs: lectura publica de published
create policy packs_public_read on public.packs
  for select using (status = 'published');
create policy packs_admin_all on public.packs
  for all using (public.is_admin()) with check (public.is_admin());

-- hijas de packs: heredan del pack padre
create policy pack_images_public_read on public.pack_images
  for select using (exists (
    select 1 from public.packs p where p.id = pack_id and p.status = 'published'
  ));
create policy pack_images_admin_all on public.pack_images
  for all using (public.is_admin()) with check (public.is_admin());

create policy pack_cities_public_read on public.pack_cities
  for select using (exists (
    select 1 from public.packs p where p.id = pack_id and p.status = 'published'
  ));
create policy pack_cities_admin_all on public.pack_cities
  for all using (public.is_admin()) with check (public.is_admin());

create policy pack_itinerary_days_public_read on public.pack_itinerary_days
  for select using (exists (
    select 1 from public.packs p where p.id = pack_id and p.status = 'published'
  ));
create policy pack_itinerary_days_admin_all on public.pack_itinerary_days
  for all using (public.is_admin()) with check (public.is_admin());

create policy pack_details_public_read on public.pack_details
  for select using (exists (
    select 1 from public.packs p where p.id = pack_id and p.status = 'published'
  ));
create policy pack_details_admin_all on public.pack_details
  for all using (public.is_admin()) with check (public.is_admin());

create policy pack_highlights_public_read on public.pack_highlights
  for select using (exists (
    select 1 from public.packs p where p.id = pack_id and p.status = 'published'
  ));
create policy pack_highlights_admin_all on public.pack_highlights
  for all using (public.is_admin()) with check (public.is_admin());

-- travel_tips: lectura publica de published
create policy travel_tips_public_read on public.travel_tips
  for select using (status = 'published');
create policy travel_tips_admin_all on public.travel_tips
  for all using (public.is_admin()) with check (public.is_admin());

-- hotels: lectura publica de published
create policy hotels_public_read on public.hotels
  for select using (status = 'published');
create policy hotels_admin_all on public.hotels
  for all using (public.is_admin()) with check (public.is_admin());

-- pack_stays / pack_stay_hotels: heredan del pack padre
create policy pack_stays_public_read on public.pack_stays
  for select using (exists (
    select 1 from public.packs p where p.id = pack_id and p.status = 'published'
  ));
create policy pack_stays_admin_all on public.pack_stays
  for all using (public.is_admin()) with check (public.is_admin());

create policy pack_stay_hotels_public_read on public.pack_stay_hotels
  for select using (exists (
    select 1
    from public.pack_stays s
    join public.packs p on p.id = s.pack_id
    where s.id = stay_id and p.status = 'published'
  ));
create policy pack_stay_hotels_admin_all on public.pack_stay_hotels
  for all using (public.is_admin()) with check (public.is_admin());

-- activities: lectura publica de published
create policy activities_public_read on public.activities
  for select using (status = 'published');
create policy activities_admin_all on public.activities
  for all using (public.is_admin()) with check (public.is_admin());

-- seasons / pack_prices: lectura publica total (el calculo corre en cliente)
create policy seasons_public_read on public.seasons
  for select using (true);
create policy seasons_admin_all on public.seasons
  for all using (public.is_admin()) with check (public.is_admin());

create policy pack_prices_public_read on public.pack_prices
  for select using (true);
create policy pack_prices_admin_all on public.pack_prices
  for all using (public.is_admin()) with check (public.is_admin());

-- quotes: insert-only para anon/authenticated (siempre como borrador);
-- lectura solo admin (los anonimos recuperan via get_quote(uuid))
create policy quotes_insert_public on public.quotes
  for insert to anon, authenticated
  with check (status = 'borrador');
create policy quotes_admin_all on public.quotes
  for all using (public.is_admin()) with check (public.is_admin());

-- =============================================================================
-- Storage: bucket publico "media"
-- Carpetas sugeridas: packs/{id}/, cities/{id}/, hotels/{id}/, activities/{id}/
-- =============================================================================
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

create policy media_public_read on storage.objects
  for select using (bucket_id = 'media');

create policy media_admin_insert on storage.objects
  for insert to authenticated
  with check (bucket_id = 'media' and public.is_admin());

create policy media_admin_update on storage.objects
  for update to authenticated
  using (bucket_id = 'media' and public.is_admin())
  with check (bucket_id = 'media' and public.is_admin());

create policy media_admin_delete on storage.objects
  for delete to authenticated
  using (bucket_id = 'media' and public.is_admin());
