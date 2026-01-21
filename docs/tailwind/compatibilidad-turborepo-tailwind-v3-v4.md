# Compatibilidad entre Turborepo y Tailwind CSS (v3 vs v4)

## Vision general

Turborepo es un sistema de build de alto rendimiento para monorepos. Tailwind CSS es un framework de utilidades CSS. Tailwind v4 introduce una arquitectura CSS-first (sin tailwind.config.js por defecto) y un motor de compilacion rapido (Oxide). En monorepos, el cambio principal es la deteccion de clases: por defecto solo se escanea el directorio actual y sus subcarpetas, por lo que los paquetes hermanos no se detectan a menos que se indiquen rutas adicionales.

## Cambios principales en Tailwind v4

- Configuracion
  - v3: tailwind.config.js define content, theme, plugins, etc.
  - v4: CSS-first con `@import "tailwindcss";` y tokens en `@theme`.
- Ejecucion
  - v3: CLI `npx tailwindcss -i ... -o ...`.
  - v4: PostCSS plugin `@tailwindcss/postcss` dentro del bundler.
- Deteccion de clases
  - v3: content indica rutas.
  - v4: escaneo automatico limitado al directorio actual.
- Monorepos
  - v3: se añadian rutas de packages en content.
  - v4: requiere `@source` o `base` en PostCSS.
- Preprocesadores
  - v4 prioriza CSS nativo; Sass/Less no estan recomendados.

## Problemas habituales en monorepos con v4

- Componentes compartidos sin estilos: `packages/ui` no se escanea si el build ocurre en `apps/web`.
- `base` en PostCSS: versiones anteriores requerian rutas absolutas.
- VS Code IntelliSense: sin tailwind.config.js puede no detectar clases en paquetes.
- Ecosistema de plugins y herramientas: algunas plantillas (ej. shadcn) siguen ancladas a v3.

## Opciones de configuracion en monorepos

### 1) Usar `@source` en hojas de estilo

Recomendado por los mantenedores. Indica carpetas adicionales para el escaneo.

Ejemplo de estructura:

- /
  - apps/web/app/globals.css
  - packages/ui/components/Button.tsx
  - packages/ui/styles/tailwind.css

**packages/ui/styles/tailwind.css**

```css
@import "tailwindcss";
@theme {
  /* tokens de diseno */
}
@source "./components/**/*.{ts,tsx}";
```

Exponer el CSS desde `packages/ui`:

```json
"exports": {
  "./tailwind.css": "./styles/tailwind.css"
}
```

**apps/web/app/globals.css**

```css
@import "tailwindcss";
@import "@repo/ui/tailwind.css";
@source "../app/**/*.{ts,tsx}";
@source "../../../packages/ui/**/*.{ts,tsx}";
```

### 2) Configurar `base` en `@tailwindcss/postcss`

Define el directorio raiz desde el que Tailwind empieza a buscar clases.

**apps/web/postcss.config.mjs**

```js
const config = {
  plugins: {
    "@tailwindcss/postcss": {
      base: process.cwd() + "/../..",
    },
  },
};
export default config;
```

Despues de cambiarlo, limpia la cache de build y recompila.

### 3) Compartir tokens y estilos

Crear un paquete compartido (ej. `@repo/tailwind-config`) con un CSS que importe Tailwind y defina `@theme`. Las apps importan ese CSS en `globals.css`, y el paquete de UI puede reutilizarlo.

### 4) Configuracion minima por paquete

Para paquetes que solo usan Tailwind y PostCSS:

```sh
npm install tailwindcss @tailwindcss/postcss postcss
```

**packages/ui/postcss.config.mjs**

```js
export default { plugins: { "@tailwindcss/postcss": {} } };
```

**packages/ui/src/styles/globals.css**

```css
@import "tailwindcss";
```

## Consejos para casos especificos

- VS Code: puedes apuntar `tailwindCSS.experimental.configFile` al CSS principal:

```json
{
  "tailwindCSS.experimental.configFile": "apps/web/app/globals.css"
}
```

- Shadcn UI: la CLI sigue anclada a v3; con v4 hay que instalar y configurar manualmente.
- Errores de escaneo: si se parsean archivos de `node_modules`, elimina la cache o limita fuentes con `@source`.

## Pasos recomendados para montar Turborepo con Tailwind v4

1. Crear el monorepo (create-turbo o manualmente).
2. Instalar Tailwind v4 + `@tailwindcss/postcss` en cada paquete que lo use.
3. Crear `postcss.config.mjs` y un CSS que importe Tailwind.
4. Definir tokens en `@theme` (opcional).
5. Extender la deteccion con `@source` o `base`.
6. Importar estilos en las apps (ej. `globals.css`).
7. Ejecutar `pnpm dev` y `pnpm build`.

## Conclusiones

Tailwind v4 es compatible con Turborepo, pero requiere ajustar la deteccion de clases en monorepos. Las soluciones clave son `@source` en CSS o `base` en PostCSS. Centralizar tokens y estilos en un paquete compartido ayuda a mantener consistencia. El ecosistema esta evolucionando, por lo que algunas herramientas y extensiones pueden requerir configuraciones adicionales.
