---
'@eslint-zod/utils': major
---

refactor: replace `createZodSchemaImportTrack(scope)` with `scope.createTracker()`

Migration: `const { trackZodSchemaImports } = createZodSchemaImportTrack(scope)`

- `trackZodSchemaImports()` becomes `scope.createTracker()`.
