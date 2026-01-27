/**
 * PostCSS configuration for Tailwind CSS v4
 * Shared across all apps and packages in the PIAR monorepo
 *
 * The `base` option points to the monorepo root to ensure
 * Tailwind scans all packages for class names
 */
export default {
  plugins: {
    '@tailwindcss/postcss': {
      base: new URL('../../..', import.meta.url).pathname,
    },
    autoprefixer: {},
  },
};
