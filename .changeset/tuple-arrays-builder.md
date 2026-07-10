---
'@eslint-zod/utils': minor
---

feat: add `prefer-tuple-over-array-length` rule builder

New `@eslint-zod/utils/rule-builders/prefer-tuple-over-array-length` export.

`buildPreferTupleOverArrayLengthCreate(scope, options)` owns the shared `z.array()` detection, `z.tuple([...])` autofix construction, and reporting, delegating the API-specific length-constraint detection to `options.findLengthConstraint`.
