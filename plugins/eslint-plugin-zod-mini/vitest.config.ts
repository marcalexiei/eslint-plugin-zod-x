import { defineProject } from 'vitest/config';

export default defineProject({
  resolve: {
    conditions: ['@eslint-zod/source'],
  },
  ssr: {
    resolve: {
      conditions: ['@eslint-zod/source'],
    },
  },
  test: {
    name: 'zod-mini',
    setupFiles: ['./tests/setup.ts'],
  },
});
