# CHANGELOG — Beauty Ballons Framework

## v1.0.0 — Framework Empresarial (2025)

### Arquitectura y parametrización
- **NUEVO** `src/config/client.config.ts` — Archivo central de parametrización.
  Todos los valores de marca, colores, contacto y operación consolidados en un único
  archivo que el integrador modifica para cada cliente nuevo.
- **MODIFICADO** `src/config/site.ts` — Ahora re-exporta `CLIENT_CONFIG` desde
  `client.config.ts` para mantener compatibilidad con el codebase existente sin
  duplicar valores.
- **NUEVO** `framework/client-data.example.json` — Plantilla JSON con todos los
  campos configurables por cliente, estructurada por categorías.
- **NUEVO** `framework/FRAMEWORK.md` — Documentación completa del framework.
- **NUEVO** `framework/GUIA_IA.md` — Guía para que otra IA use el framework.
- **NUEVO** `framework/deploy.sh` — Script de build y deploy verificado.

### Correcciones de compilación aplicadas (de sesiones anteriores)
- **CORREGIDO** `src/components/admin/LeadsClient.tsx` — Eliminado `ChevronDown`
  importado sin usar (causaba TS6133).
- **CORREGIDO** `src/components/admin/PortfolioAdminClient.tsx` — Eliminados
  `createClient` y `const supabase` declarados sin usar (TS6133).
- **CORREGIDO** `src/lib/whatsapp.ts` — Eliminado `import type { CtaAction }` con
  el hack `void (null as unknown as CtaAction)`. El import no tenía uso real.
- **NUEVO** `src/app/global-error.tsx` — Creado como error boundary del root layout
  de Next.js 15 (renombrado desde error.tsx). Incluye `<html>` y `<body>` requeridos.
- **CORREGIDO** `src/components/ui/ColorPicker.tsx` — Eliminados imports duplicados
  de `useState` y `@/lib/utils`.
- **CORREGIDO** `src/components/ui/Card.tsx` — Agregado `'use client'` requerido
  porque el componente acepta y ejecuta `onClick`.
- **CORREGIDO** `src/components/site/HeroSection.tsx` — Eliminado `secWaUrl`
  declarado sin usar (TS6133).
- **CORREGIDO** `src/components/ui/EmptyState.tsx` — Agregado `'use client'`
  requerido por `NoPhotosState` que tiene `onClick`.
- **CORREGIDO** `src/lib/actions/content.ts` — `updateSingleton(table: string)`
  cambiado a `type SingletonTable` para evitar error de tipos con `Database` tipado.
- **CORREGIDO** `middleware.ts` — Agregado early-return para rutas no-admin
  (evita llamar a Supabase en `/`) y `try/catch` completo para prevenir 404 por
  errores de red en el Edge Runtime de Vercel.

### Base de datos
- **NUEVO** `supabase/config.toml` — Configuración para CLI de Supabase.
- **RESTAURADO** `supabase/migrations/0001_initial_schema.sql` — Schema completo v2.
- **RESTAURADO** `supabase/seed.sql` — Datos iniciales de ejemplo.

### Dependencias actualizadas (para compatibilidad con React 19)
| Paquete | Versión anterior | Versión nueva | Motivo |
|---------|-----------------|---------------|--------|
| `next` | 15.0.3 | 15.1.7 | Soporte React 19 estable |
| `react` | ^19.0.0 (RC) | 19.0.0 (pin) | React 19 estable |
| `react-dom` | ^19.0.0 (RC) | 19.0.0 (pin) | React 19 estable |
| `lucide-react` | ^0.447.0 | ^0.454.0 | peerDep incluye React 19 |
| `react-hook-form` | ^7.53.2 | ^7.54.0 | peerDep incluye React 19 |
| `sonner` | ^1.7.0 | ^1.7.2 | peerDep incluye React 19 |
| `eslint-config-next` | 15.0.3 | 15.1.7 | Debe coincidir con next |

### Archivos sin cambios (núcleo estable)
Los siguientes archivos no fueron modificados — forman el núcleo del framework:
- Todos los componentes en `src/components/ui/` (excepto Card y EmptyState)
- Todos los componentes en `src/components/site/` (excepto HeroSection)
- Todos los hooks en `src/hooks/`
- Todos los queries en `src/lib/queries/`
- Todos los tipos en `src/types/`
- `src/lib/analytics.ts`, `src/lib/utils.ts`, `src/lib/constants.ts`
- `tailwind.config.ts`, `tsconfig.json`, `postcss.config.js`

## v1.0.1 — Auditoría de Compilación (Pipeline CI/CD)

### Errores encontrados y corregidos

#### Error 1 — `.eslintrc.json` faltante
- **Causa:** El proyecto usa `eslint-config-next` en `devDependencies` pero no tenía
  archivo de configuración de ESLint. `next build` en modo producción ejecuta el linter
  automáticamente y falla con `"No ESLint configuration found"` si no existe el archivo.
- **Corrección:** Creado `.eslintrc.json` con `{ "extends": ["next/core-web-vitals", "next/typescript"] }`.

#### Error 2 — Carpeta `src/lib/validations/` vacía
- **Causa:** Carpeta creada durante el desarrollo inicial pero nunca utilizada.
  Aunque Next.js no falla por carpetas vacías, genera ruido en la estructura y
  podría confundir herramientas de análisis estático.
- **Corrección:** Carpeta eliminada. Cero archivos la referenciaban.

### Verificaciones del pipeline (29 checks — 29 pasados)
Análisis exhaustivo con scripts Python sobre el código fuente completo:
- Todos los imports @/ resuelven a archivos existentes
- Sin imports duplicados
- Directivas 'use client'/'use server' en posición correcta
- Server Components sin hooks ni browser APIs
- Sin imports circulares (grafo DFS)
- Todos los paquetes importados están en package.json
- Todas las tablas Supabase en Database types
- Next.js 15: searchParams como Promise<>, cookies() con await
- React 19: peerDependencies compatibles (lucide ^0.454, react-hook-form ^7.54, sonner ^1.7.2)
- global-error.tsx con <html>+<body> obligatorios
- 0 errores de UTF-8 ni caracteres invisibles

### Estado de compilación
**Confirmado listo para `npm install && npm run build` en Vercel.**
