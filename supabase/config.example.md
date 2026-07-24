# Supabase — puesta en marcha

## 1. Crear el proyecto

1. Entra en [supabase.com](https://supabase.com) y crea un proyecto nuevo (region EU recomendada).
2. Guarda la contraseña de la base de datos.

## 2. Aplicar migracion y seed

**Opcion A — SQL Editor (mas rapido):**

1. En el dashboard, abre *SQL Editor*.
2. Pega y ejecuta `supabase/migrations/0001_initial_schema.sql`.
3. Pega y ejecuta `supabase/seed.sql` (es idempotente: se puede re-ejecutar).

**Opcion B — Supabase CLI:**

```bash
supabase login
supabase link --project-ref <PROJECT_REF>
supabase db push          # aplica supabase/migrations/
# el seed:
supabase db query --file supabase/seed.sql
# (o pegar seed.sql en el SQL Editor)
```

## 3. Dar permisos de admin (fase posterior)

Tras crear un usuario en Authentication, desde el SQL Editor (rol service):

```sql
select private.grant_admin('email@ejemplo.com');
```

## 4. Obtener credenciales

En *Project Settings → API*:

- **Project URL** → `VITE_SUPABASE_URL` (ej. `https://abcd1234.supabase.co`)
- **Publishable key** (o `anon` key en proyectos antiguos) → `VITE_SUPABASE_PUBLISHABLE_KEY`

Ambas son publicas y seguras de exponer en el front: la seguridad la aplican las politicas RLS.

## 5. Variables de entorno

**Local** — crea `.env.local` en la raiz (copia de `.env.example`):

```
VITE_SUPABASE_URL=https://<project-ref>.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=<publishable-key>
```

**Render** — en el Static Site, *Environment → Environment Variables*, añade las
mismas dos variables (declaradas en `render.yaml` con `sync: false`, hay que
rellenar su valor en el dashboard de Render). Tras cambiarlas, redespliega:
Vite las embebe en el build.

## 6. Storage

La migracion crea el bucket publico `media`. Carpetas sugeridas:
`packs/{id}/`, `cities/{id}/`, `hotels/{id}/`, `activities/{id}/`.
Lectura publica; subida/borrado solo admins.
