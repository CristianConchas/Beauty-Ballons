# 🎈 Beauty Ballons Framework

Framework web empresarial para negocios de eventos y servicios locales.
Generación de leads via WhatsApp + Panel CMS completo.

**Stack:** Next.js 15.1 · React 19 · Tailwind CSS · Supabase · Vercel

## Inicio rápido

```bash
# 1. Clonar e instalar
git clone https://github.com/tu-usuario/beauty-ballons.git
cd beauty-ballons
npm install

# 2. Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con credenciales de Supabase

# 3. Configurar el cliente
# Editar src/config/client.config.ts con los datos del negocio

# 4. Ejecutar en desarrollo
npm run dev
```

## Personalizar para un nuevo cliente

El único archivo que debes editar para adaptar el framework:

```
src/config/client.config.ts
```

Todos los valores de marca, textos, colores y contacto están centralizados ahí.
El contenido real (servicios, testimonios, fotos) se gestiona desde `/admin`.

## Estructura

```
src/
├── app/
│   ├── (site)/        # Sitio público
│   ├── admin/         # Panel CMS
│   └── api/           # API routes
├── components/
│   ├── ui/            # Design system (16 componentes)
│   ├── site/          # Secciones del sitio
│   └── admin/         # Paneles del CMS
├── config/
│   ├── client.config.ts   # ← EDITAR ESTE para nuevo cliente
│   ├── site.ts            # Re-exporta client.config (no editar)
│   └── fonts.ts           # Fuentes Google (no editar)
├── lib/
│   ├── actions/       # Server Actions
│   ├── queries/       # Consultas Supabase
│   └── supabase/      # Clientes
└── hooks/             # React hooks
```

## Scripts

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Desarrollo local |
| `npm run build` | Build de producción |
| `npm run type-check` | Verificar tipos TypeScript |
| `npm run lint` | Linting ESLint |
| `npm run db:types` | Regenerar tipos desde Supabase |

## Variables de entorno requeridas

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_SITE_URL=
REVALIDATE_SECRET=
```

Ver `.env.example` para la lista completa con descripciones.

## Documentación completa

Ver `DEPLOY.md` para el checklist de puesta en marcha.
Ver `framework/FRAMEWORK.md` para la guía de adaptación a nuevos clientes.
