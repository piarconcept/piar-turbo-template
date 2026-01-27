import { defineWorkspace } from 'vitest/config';

export default defineWorkspace([
  'apps/**/vitest.config.ts',
  'apps/*/*/vitest.config.ts',
  'packages/*/vitest.config.ts',
  'packages/**/vitest.config.ts',
  'packages/*/*/vitest.config.ts', // For nested packages like packages/domain/models
  {
    test: {
      globals: true,
      environment: 'node',
    },
    cacheDir: '../../node_modules/.vitest',
  },
]);
