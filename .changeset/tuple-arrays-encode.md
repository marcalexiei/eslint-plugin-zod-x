---
'eslint-plugin-zod-mini': minor
---

feat: add `prefer-tuple-over-array-length` rule

Flags a length-constrained `z.array()` (`.check(z.length())`, `.check(z.minLength())`, `.check(z.maxLength())`) and suggests `z.tuple()`, which preserves the element count in the inferred type.

Autofixes the fixed-length `.check(z.length(n))` form to `z.tuple([...])`.
