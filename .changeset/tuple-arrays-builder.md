---
'@eslint-zod/utils': minor
---

feat: add `prefer-tuple-over-array-length` rule builder

New `@eslint-zod/utils/rule-builders/prefer-tuple-over-array-length` export.

`buildPreferTupleOverArrayLengthCreate(scope, options)` owns the shared `z.array()` detection, `z.tuple([...])` autofix construction, and reporting, delegating the API-specific length-constraint detection to `options.findLengthConstraint`. The module also exports `readIntegerLiteralValue` for validating count arguments. `findLengthConstraint`'s `buildRemoveFix` may return one fix or several (e.g. to strip both `min` and `max` for an equal-bounds constraint).
