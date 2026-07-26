---
'@eslint-zod/utils': major
---

feat!: replace `createZodSchemaImportTrack(scope)` with `scope.createTracker()`

Migration: `const { trackZodSchemaImports } = createZodSchemaImportTrack(scope)`

- `trackZodSchemaImports()` becomes `scope.createTracker()`.

The `ZOD_*` vocabulary tables are now `ReadonlyArray<string>` rather than `Array<string>`, and `ZodImportScope` accepts a `ReadonlyArray<string>` of sources.
