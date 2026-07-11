---
'eslint-plugin-zod-mini': minor
---

feat: add `prefer-tuple-over-array-length` rule

Flags a length-constrained `z.array()` (`.check(z.length())`, `.check(z.minLength())`, `.check(z.maxLength())`) and suggests `z.tuple()`, which preserves the element count in the inferred type.

Autofixes `z.length(n)` and equal-bound `z.minLength(n)` + `z.maxLength(n)` to a fixed tuple, and `z.minLength(n)` to a rest tuple; everything else is report-only.
