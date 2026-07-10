---
'eslint-plugin-zod-mini': minor
---

feat: add `prefer-tuple-over-array-length` rule

Flags a length-constrained `z.array()` (`.check(z.length())`, `.check(z.minLength())`, `.check(z.maxLength())`) and suggests `z.tuple()`, which preserves the element count in the inferred type.

Autofixes `.check(z.length(n))` (and equal-bound `z.minLength(n)` + `z.maxLength(n)`) to a fixed-length tuple and `.check(z.minLength(n))` to a rest tuple (`z.tuple([...], x)`); `z.maxLength()` alone and unequal/mixed checks are report-only.
