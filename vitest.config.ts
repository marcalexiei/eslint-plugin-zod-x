import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    projects: [
      //
      'plugins/*/vitest.config.ts',
      'packages/*/vitest.config.ts',
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      reportsDirectory: './coverage',
      // `packages/tooling` is test/build infrastructure, so it is not included.
      include: [
        //
        'plugins/*/src/**/*.ts',
        'packages/utils/src/**/*.ts',
      ],
      exclude: ['**/*.spec.ts'],
      // No-regression floors — raise them as coverage improves, never lower them.
      thresholds: {
        statements: 99,
        branches: 97,
        functions: 100,
        lines: 99,
      },
    },
  },
});
