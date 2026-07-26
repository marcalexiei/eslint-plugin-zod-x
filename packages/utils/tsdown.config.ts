import { defineConfig } from 'tsdown';

export default defineConfig({
  // `!` excludes specs: the glob would otherwise publish them and vitest would
  // then collect the built copies alongside the sources.
  entry: ['src/index.ts', 'src/rule-builders/*.ts', 'src/rule-patterns/*.ts', '!src/**/*.spec.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  outDir: 'dist',
  target: 'node20',
  unbundle: true,
});
