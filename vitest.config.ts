import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    projects: ['plugins/*/vitest.config.ts', 'packages/*/vitest.config.ts'],
  },
});
