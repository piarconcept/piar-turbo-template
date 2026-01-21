# Implementación de Tailwind CSS v4 en PIAR Monorepo

## Status
- [x] Completed - Migración completa a Tailwind CSS v4

## Objetivo

Migrar el monorepo PIAR a Tailwind CSS v4 con una arquitectura centralizada que sigue los principios de Clean Architecture y las mejores prácticas de monorepos.

## Arquitectura Implementada

### Paquete Central: `@piar/ui-config`

**Ubicación**: `packages/ui/config/`

**Propósito**: Paquete centralizado que contiene toda la configuración de Tailwind CSS v4 y tokens del sistema de diseño.

**Contenido**:
- `tailwind.css`: Configuración CSS-first con `@theme` tokens y base styles
- `postcss.config.mjs`: Configuración PostCSS con `@tailwindcss/postcss` y `base` apuntando al monorepo root
- Design tokens: Colores primarios (orange, blue), tipografía, espaciado

**Exports**:
```json
{
  "./tailwind.css": "./tailwind.css",
  "./postcss": "./postcss.config.mjs"
}
```

### Paquete de Componentes: `@piar/ui-components`

**Ubicación**: `packages/ui/components/`

**Propósito**: Biblioteca de componentes UI compartidos que usan Tailwind CSS v4.

**Estado**: Estructura creada, lista para añadir componentes.

## Migraciones Realizadas

### 1. Packages Migrados

#### `@piar/layout`
- ✅ Layout, Header, Footer convertidos a Tailwind CSS
- ✅ Eliminado `styles.css`
- ✅ Eliminado export de CSS del package.json
- ✅ Todos los estilos inline reemplazados por clases Tailwind
- ✅ Responsive design mantenido con breakpoints Tailwind (md:, lg:)

#### `@piar/coming-soon`
- ✅ Componente ComingSoon migrado a Tailwind CSS
- ✅ Estilos inline eliminados
- ✅ Responsive typography con Tailwind

#### `@piar/health-client`
- ✅ HealthBadge y HealthCard migrados a Tailwind CSS
- ✅ Estados de color usando clases Tailwind utilities
- ✅ Todos los estilos inline eliminados

### 2. Apps Actualizadas

#### `apps/client/web`
**Cambios**:
- ✅ Añadido `@piar/ui-config` a dependencies
- ✅ Añadido Tailwind v4 (`tailwindcss`, `@tailwindcss/postcss`) a devDependencies
- ✅ `postcss.config.mjs` actualizado para importar config compartida
- ✅ `globals.css` reemplazado con imports de Tailwind v4
- ✅ `next.config.ts` actualizado con `transpilePackages`
- ✅ `@source` directives añadidas para escanear paquetes compartidos

**transpilePackages**:
```typescript
[
  "@piar/layout",
  "@piar/messages",
  "@piar/coming-soon",
  "@piar/health-client",
  "@piar/health-configuration",
  "@piar/domain-fields",
  "@piar/domain-models",
  "@piar/ui-config",
  "@piar/ui-components"
]
```

#### `apps/client/backoffice`
**Cambios idénticos a web app**:
- ✅ Configuración Tailwind v4
- ✅ PostCSS config compartida
- ✅ globals.css migrado
- ✅ transpilePackages configurado

## Configuración PostCSS

Todas las apps usan la misma configuración:

```javascript
import config from "@piar/ui-config/postcss";
export default config;
```

El config compartido define:
```javascript
{
  plugins: {
    "@tailwindcss/postcss": {
      base: new URL("../../..", import.meta.url).pathname,
    },
    autoprefixer: {},
  },
}
```

**`base` apunta al root del monorepo** para que Tailwind escanee todos los paquetes automáticamente.

## Escaneo de Clases

### Método 1: `base` en PostCSS (Implementado)
El parámetro `base` en la configuración PostCSS asegura que Tailwind escanee desde el root del monorepo:

```javascript
base: new URL("../../..", import.meta.url).pathname
```

### Método 2: `@source` en CSS (Backup)
Cada app también incluye directivas `@source` en su `globals.css` como backup:

```css
@source "../../../../../../packages/ui/**/*.{ts,tsx}";
@source "../../../../../../packages/features/**/*.{ts,tsx}";
```

Esto asegura detección de clases incluso si el `base` falla.

## Design Tokens

Todos los tokens están centralizados en `@piar/ui-config/tailwind.css`:

```css
@theme {
  --color-primary-orange: #ec6b38;
  --color-primary-blue: #262b50;
  --color-background: #ffffff;
  --color-foreground: #262b50;
  --font-family-sans: var(--font-montserrat), ui-sans-serif, system-ui, sans-serif;
}
```

Uso en componentes:
```tsx
<div className="bg-[var(--color-primary-blue)] text-[var(--color-primary-orange)]">
```

## Base Styles

Los estilos base están en `@piar/ui-config/tailwind.css`:

```css
@layer base {
  html, body {
    @apply max-w-full overflow-x-hidden;
  }

  body {
    @apply text-foreground bg-background antialiased;
    font-family: var(--font-family-sans);
  }

  * {
    @apply box-border p-0 m-0;
  }

  a {
    @apply no-underline;
    color: inherit;
  }
}
```

## Patrón de Migración

Para migrar un componente de estilos inline a Tailwind:

### Antes (Inline Styles):
```tsx
<div style={{
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100vh'
}}>
```

### Después (Tailwind CSS):
```tsx
<div className="flex flex-col min-h-screen">
```

### Conversiones Comunes:
- `display: flex` → `flex`
- `flexDirection: column` → `flex-col`
- `alignItems: center` → `items-center`
- `justifyContent: space-between` → `justify-between`
- `padding: 1rem` → `p-4`
- `margin: 0 auto` → `mx-auto`
- `maxWidth: 1280px` → `max-w-7xl`
- `backgroundColor: #ec6b38` → `bg-[#ec6b38]` o `bg-[var(--color-primary-orange)]`
- `color: #999` → `text-gray-500`
- `fontSize: 1.5rem` → `text-2xl`
- `fontWeight: 700` → `font-bold`

## Responsive Design

Tailwind breakpoints:
- `sm:` - 640px (móvil grande)
- `md:` - 768px (tablet)
- `lg:` - 1024px (desktop)
- `xl:` - 1280px (desktop grande)
- `2xl:` - 1536px (pantallas muy grandes)

Ejemplo:
```tsx
<div className="hidden md:flex">  {/* Oculto en móvil, visible desde tablet */}
```

## Verificación Post-Implementación

### Checklist de Verificación:
- [x] Paquete `@piar/ui-config` creado con config compartida
- [x] Paquete `@piar/ui-components` creado (estructura base)
- [x] `@piar/layout` migrado a Tailwind CSS
- [x] `@piar/coming-soon` migrado a Tailwind CSS
- [x] `@piar/health-client` migrado a Tailwind CSS
- [x] Apps web y backoffice configuradas con Tailwind v4
- [x] PostCSS configs actualizados
- [x] globals.css reemplazados
- [x] next.config.ts con transpilePackages
- [x] Todos los archivos CSS antiguos eliminados
- [x] pnpm install ejecutado

### Comandos de Verificación:

```bash
# Instalar dependencias
pnpm install

# Build todos los paquetes
pnpm turbo build

# Verificar typecheck
pnpm typecheck

# Levantar apps para verificación visual
pnpm --filter @piar/web dev
pnpm --filter @piar/backoffice dev
```

### Puntos de Verificación Visual:
1. Layout renderiza correctamente (header, footer con colores PIAR)
2. Responsive design funciona (menu móvil/desktop)
3. ComingSoon page renderiza con tipografía responsive
4. Health components muestran colores de estado correctos
5. No hay flashes de contenido sin estilos (FOUC)
6. Transiciones hover funcionan correctamente

## Beneficios de esta Arquitectura

### 1. Centralización
- Un solo lugar para configuración Tailwind
- Un solo lugar para design tokens
- Fácil de mantener y actualizar

### 2. Type-Safety
- Tokens CSS variables accesibles desde cualquier componente
- IntelliSense funciona en todos los paquetes

### 3. Performance
- Tailwind escanea automáticamente todos los paquetes
- Dead code elimination automático (CSS no usado se elimina)
- Build optimizado por Turbo con caching

### 4. Developer Experience
- No hay conflictos de CSS
- Utility-first approach consistente
- Documentación clara de tokens y patrones

### 5. Escalabilidad
- Fácil añadir nuevos paquetes
- Nuevos componentes heredan automáticamente los estilos
- Sistema de design consistente en todo el monorepo

## Próximos Pasos

### Corto Plazo:
1. ✅ Verificar que todo compila sin errores
2. ✅ Verificar visualmente ambas apps
3. ⬜ Añadir componentes comunes a `@piar/ui-components` (Button, Input, Card, etc.)
4. ⬜ Documentar componentes con ejemplos en Storybook (opcional)

### Mediano Plazo:
1. ⬜ Extender design system con más tokens (spacing, shadows, borders)
2. ⬜ Crear variantes de componentes usando `cva` (class-variance-authority)
3. ⬜ Añadir dark mode support
4. ⬜ Optimizar `@source` paths si hay problemas de detección

### Largo Plazo:
1. ⬜ Migrar a CSS variables para todos los colores (mejor dark mode)
2. ⬜ Crear Figma design tokens sync
3. ⬜ Añadir testing visual con Chromatic
4. ⬜ Documentar guías de contribución para nuevos componentes

## Troubleshooting

### Problema: Clases Tailwind no se aplican
**Solución**:
1. Verificar que el paquete está en `transpilePackages` del next.config.ts
2. Verificar que `base` en PostCSS apunta correctamente al root
3. Añadir `@source` directive en globals.css
4. Limpiar cache: `rm -rf .next .turbo node_modules/.cache`

### Problema: CSS variables no funcionan
**Solución**:
1. Verificar que `globals.css` importa `@piar/ui-config/tailwind.css`
2. Usar sintaxis correcta: `bg-[var(--color-primary-blue)]`
3. Verificar que las variables están definidas en `@theme`

### Problema: Build falla en producción
**Solución**:
1. Verificar que todos los paquetes tienen dependencies correctas
2. Ejecutar `pnpm turbo build` para ver errores específicos
3. Verificar que Tailwind v4 está en devDependencies de apps

## Referencias

- [Tailwind CSS v4 Documentation](https://tailwindcss.com/docs)
- [Turborepo + Tailwind Guide](https://turbo.build/repo/docs/handbook/tools/tailwindcss)
- [docs/tailwind/compatibilidad-turborepo-tailwind-v3-v4.md](./compatibilidad-turborepo-tailwind-v3-v4.md)
- [docs/tailwind/tarea-implementacion-tailwind-v4-monorepo.md](./tarea-implementacion-tailwind-v4-monorepo.md)

## Notas del Desarrollador

Esta implementación sigue las mejores prácticas de:
- **Clean Architecture**: Separación clara entre configuración, lógica y presentación
- **DRY**: Un solo lugar para config, no repetición
- **Single Responsibility**: Cada paquete tiene un propósito único
- **Type Safety**: TypeScript + CSS variables tipadas
- **Performance**: Build optimizado, tree-shaking automático

La arquitectura está diseñada para escalar y mantener a largo plazo con mínimo esfuerzo.

## Last Updated
21 January 2026 - Implementación completa de Tailwind CSS v4
