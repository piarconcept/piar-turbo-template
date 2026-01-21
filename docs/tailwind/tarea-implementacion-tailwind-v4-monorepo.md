# Tarea: Implementacion de Tailwind CSS v4 en el monorepo

## Objetivo

Migrar el monorepo a Tailwind CSS v4 con una arquitectura centralizada en un nuevo paquete `packages/ui/config`. Eliminar todo CSS previo y asegurar que las apps cliente transpilen los paquetes compartidos y mantengan estilos consistentes.

## Alcance

- Crear paquetes nuevos: `packages/ui/config` y `packages/ui/components`.
- Integrar Tailwind v4 en:
  - `packages/ui/layout`
  - `packages/ui/components`
  - `packages/features/health/client`
  - `packages/features/comingSoon`
- Actualizar apps:
  - `apps/client/web`
  - `apps/client/backoffice`
- Eliminar cualquier CSS previo (globals, styles.css, etc.) y cualquier import que lo use.

## Reglas

- No usar CSS tradicional. Todo el styling debe hacerse con Tailwind.
- Usar solo Tailwind v4 con `@tailwindcss/postcss`.
- El escaneo de clases debe cubrir todos los paquetes compartidos.
- Las apps deben transpilar paquetes del monorepo.

## Paso 0 - Preparacion

- Confirmar que el repo usa pnpm (o el gestor definido en la raiz).
- Asegurar que el build actual pasa antes de tocar estilos.

## Paso 1 - Crear `packages/ui/config`

1) Crear estructura del paquete:

- `packages/ui/config/package.json`
- `packages/ui/config/postcss.config.mjs`
- `packages/ui/config/tailwind.css`
- `packages/ui/config/README.md`

2) Contenido minimo esperado:

**package.json**

- `name`: `@piar/ui-config`
- `private`: `true`
- `exports`:
  - `"./tailwind.css": "./tailwind.css"`
  - `"./postcss": "./postcss.config.mjs"`
- `devDependencies`:
  - `tailwindcss`
  - `@tailwindcss/postcss`
  - `postcss`
  - `autoprefixer`

**tailwind.css**

```css
@import "tailwindcss";

@theme {
  /* tokens base si aplica */
}
```

**postcss.config.mjs**

```js
export default {
  plugins: {
    "@tailwindcss/postcss": {
      base: new URL("../..", import.meta.url).pathname,
    },
    autoprefixer: {},
  },
};
```

Nota: el `base` debe apuntar a la raiz del monorepo para que el escaneo incluya todos los paquetes.

## Paso 2 - Crear `packages/ui/components`

1) Crear el paquete con estructura basica:

- `packages/ui/components/package.json`
- `packages/ui/components/src/index.ts`

2) Usar Tailwind en sus componentes (sin CSS). Este paquete sirve como base para componentes de UI compartidos.

## Paso 3 - Eliminar CSS previo

1) Borrar archivos CSS existentes en apps y paquetes:

- `apps/client/web/src/app/[locale]/globals.css`
- `apps/client/backoffice/src/app/[locale]/globals.css`
- `packages/ui/layout/src/styles.css`
- Cualquier otro `.css` en los paquetes objetivo.

2) Eliminar imports de CSS en:

- `apps/client/web/src/app/[locale]/layout.tsx`
- `apps/client/backoffice/src/app/[locale]/layout.tsx`
- Cualquier componente que importe CSS eliminado.

## Paso 4 - Integrar Tailwind en apps

1) En `apps/client/web` y `apps/client/backoffice`:

- Instalar dependencias si no existen:
  - `tailwindcss`
  - `@tailwindcss/postcss`
  - `postcss`
  - `autoprefixer`

2) Reemplazar `postcss.config.mjs` para que use el config compartido:

```js
import config from "@piar/ui-config/postcss";
export default config;
```

3) Crear el nuevo CSS global (reemplazo de globals.css), solo con Tailwind:

```css
@import "@piar/ui-config/tailwind.css";
```

Ubicacion recomendada: `apps/client/*/src/app/[locale]/globals.css`

4) Asegurar que el layout importa el nuevo CSS global.

## Paso 5 - Integrar Tailwind en paquetes

1) En `packages/ui/layout`:

- Migrar estilos a clases Tailwind dentro de componentes.
- Eliminar `styles.css` y cualquier referencia.

2) En `packages/features/health/client` y `packages/features/comingSoon`:

- Añadir Tailwind como dependencia si hay clases en componentes.
- Migrar cualquier estilo a clases Tailwind.

3) En `packages/ui/components`:

- Crear componentes con clases Tailwind desde el inicio.

## Paso 6 - Transpilar paquetes en las apps

Actualizar `apps/client/web/next.config.ts` y `apps/client/backoffice/next.config.ts`:

```ts
const nextConfig = {
  transpilePackages: [
    "@piar/layout",
    "@piar/messages",
    "@piar/coming-soon",
    "@piar/health-client",
    "@piar/health-configuration",
    "@piar/health-api",
    "@piar/domain-fields",
    "@piar/domain-models",
    "@piar/ui-config",
    "@piar/ui-components"
  ],
};
```

## Paso 7 - Asegurar el escaneo de clases

Confirmar que Tailwind v4 escanea todos los paquetes al usar el `base` en `@tailwindcss/postcss`. Si hay clases que no aparecen, añadir `@source` en el CSS principal:

```css
@import "@piar/ui-config/tailwind.css";
@source "../../../../packages/**/*.{ts,tsx}";
```

Ajustar la ruta segun la ubicacion real del CSS.

## Paso 8 - Verificacion

1) Instalar dependencias en root:

```sh
pnpm install
```

2) Build de paquetes:

```sh
pnpm -w build
```

3) Levantar apps:

```sh
pnpm --filter @piar/web dev
pnpm --filter @piar/backoffice dev
```

4) Checklist visual:

- Layout renderiza correctamente en ambas apps.
- Componentes de paquetes compartidos mantienen estilos.
- No hay flashes sin estilos al cambiar de ruta.

## Notas

- Eliminar CSS previo implica reescribir estilos en Tailwind; requiere trabajo manual en los componentes existentes.
- Si se detectan clases no aplicadas, revisar el `base` del PostCSS y el `@source`.
- Mantener `@piar/ui-config` como fuente unica de tokens y plugins.
