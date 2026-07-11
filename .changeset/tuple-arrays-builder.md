---
'@eslint-zod/utils': minor
---

feat: add `prefer-tuple-over-array-length` rule builder

New `@eslint-zod/utils/rule-builders/prefer-tuple-over-array-length` export.

`buildPreferTupleOverArrayLengthCreate(scope)` owns the whole rule — length-constraint detection via `collectZodSchemaConstraints` (both API styles), the `z.tuple([...])` autofix, and reporting. Plugins only supply their import scope.
