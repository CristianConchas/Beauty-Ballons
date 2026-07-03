# Beauty Ballons Framework — Guía de Deploy

## Requisitos previos

- Node.js 18.17.0 LTS o superior
- Cuenta en Supabase (supabase.com)
- Cuenta en Vercel (vercel.com)
- Git

## 1. Instalación local

```bash
git clone https://github.com/tu-usuario/beauty-ballons.git
cd beauty-ballons
npm install
cp .env.example .env.local
# Editar .env.local con valores reales
npm run dev
# → http://localhost:3000
```

## 2. Configurar Supabase

### Crear el proyecto
1. Ir a supabase.com → New project
2. Guardar la contraseña de base de datos en un gestor de contraseñas
3. Región recomendada: us-east-1

### Ejecutar el schema
En Dashboard → SQL Editor → New query:
```sql
-- Paso 1: Ejecutar el schema completo
-- Contenido de: supabase/migrations/0001_initial_schema.sql

-- Paso 2: Ejecutar los datos iniciales
-- Contenido de: supabase/seed.sql
```

### Crear el usuario administrador
```sql
-- 1. En Dashboard → Authentication → Users → Add user
-- 2. Copiar el UUID generado
-- 3. Ejecutar:
INSERT INTO public.admin_users (id, role)
VALUES ('TU-UUID-AQUI', 'owner');
```

### Crear el bucket de Storage
1. Dashboard → Storage → New bucket
2. Name: `beauty-ballons` (o el valor de `site.storageBucket` en client.config.ts)
3. Public: ✓ activado
4. File size limit: 20 MB
5. Allowed types: image/jpeg, image/png, image/webp, image/heic

### Verificar el setup
```sql
-- Verificar 14 tablas creadas
SELECT count(*) FROM information_schema.tables
WHERE table_schema = 'public';

-- Verificar RLS activo
SELECT tablename, rowsecurity FROM pg_tables
WHERE schemaname = 'public' ORDER BY tablename;

-- Verificar funciones helper
SELECT routine_name FROM information_schema.routines
WHERE routine_schema = 'public'
AND routine_name IN ('is_admin', 'is_owner');
```

## 3. Configurar y desplegar en Vercel

### Variables de entorno (obligatorias)
En Vercel Dashboard → Project → Settings → Environment Variables:

```
NEXT_PUBLIC_SUPABASE_URL       = https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY  = eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY      = eyJhbGci...  ← marcar como "Sensitive"
NEXT_PUBLIC_SITE_URL           = https://tu-dominio.com
REVALIDATE_SECRET              = cadena-aleatoria-larga
```

### Deploy desde CLI
```bash
npm install -g vercel
vercel login
vercel --prod
```

### Deploy desde GitHub (recomendado)
1. Subir código a GitHub
2. Vercel → New Project → Import Git Repository
3. Framework Preset: Next.js (auto-detectado)
4. Agregar variables de entorno antes de hacer clic en "Deploy"

## 4. Checklist de verificación post-deploy

- [ ] `/` carga sin 404
- [ ] `/admin/login` carga el formulario
- [ ] Login con credenciales del Owner funciona
- [ ] Botón WhatsApp abre conversación correcta
- [ ] Formulario de contacto guarda lead en `/admin/leads`
- [ ] Upload de foto desde `/admin/portafolio` funciona
- [ ] Cambio de color en `/admin/ajustes` se refleja en el sitio (~60s)

## 5. Dominio personalizado

```
Vercel → Project → Settings → Domains → Add domain
```

Después de agregar el dominio:
1. Actualizar `NEXT_PUBLIC_SITE_URL` en Vercel → redeploy
2. Actualizar `canonical_url` en `/admin/ajustes → SEO`

## 6. Scripts útiles

```bash
# Desarrollo
npm run dev

# Verificar tipos sin compilar
npm run type-check

# Build de producción
npm run build

# Regenerar tipos TypeScript desde Supabase
SUPABASE_PROJECT_ID=tu-id npm run db:types

# Backup de base de datos
supabase db dump --project-id TU_PROJECT_ID > backup_$(date +%Y%m%d).sql
```

## 7. Prueba de la base de datos en local

```bash
# Instalar CLI de Supabase
npm install -g supabase

# Iniciar Supabase local
supabase start

# Aplicar migrations y seed
supabase db reset

# Ver estado
supabase status

# Detener
supabase stop
```
