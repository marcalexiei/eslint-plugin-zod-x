import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    setupFiles: ['./tests-setup/setup.ts'],
    typecheck: {
      enabled: true,
      include: ['src/**/*.spec.ts'],
    },
  },
});
