import { defineConfig } from 'eslint/config';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';
import importPlugin from 'eslint-plugin-import';

/**
 * Root ESLint configuration for PIAR monorepo
 * Base configuration for TypeScript packages
 * Next.js apps extend this with their own configs
 */
export default defineConfig([
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        // Note: No project/tsconfigRootDir configured here
        // Each package can override if they need type-aware linting
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
      'import': importPlugin,
    },
    rules: {
      // TypeScript rules (syntax-only, no type information needed)
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-non-null-assertion': 'warn',

      // Import rules - Disabled for easier AI workflow
      // 'import/order': 'off',
      // 'import/no-duplicates': 'off',

      // General rules
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'prefer-const': 'error',
      'no-var': 'error',
    },
  },
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/.turbo/**',
      '**/coverage/**',
      '**/.next/**',
      '**/out/**',
      '**/build/**',
      './vite.config.*',
      '**/vite.config.*',
      './rollup.config.*',
      '**/rollup.config.*',
      './webpack.config.*',
      './eslint.config.*',
      './**/*.config.*',
      './**/*.test.*',
      './**/*.spec.*',
      'apps/**', // Apps have their own eslint configs
    ],
  },
]);
