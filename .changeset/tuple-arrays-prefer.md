---
'eslint-plugin-zod': minor
---

feat: add `prefer-tuple-over-array-length` rule

Flags a length-constrained `z.array()` (`.length()`, `.min()`, `.max()`) and suggests `z.tuple()`, which preserves the element count in the inferred type.

Autofixes the fixed-length `.length(n)` form to `z.tuple([...])`.
