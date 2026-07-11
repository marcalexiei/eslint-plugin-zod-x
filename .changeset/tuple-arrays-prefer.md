---
'eslint-plugin-zod': minor
---

feat: add `prefer-tuple-over-array-length` rule

Flags a length-constrained `z.array()` (`.length()`, `.min()`, `.max()`) and suggests `z.tuple()`, which preserves the element count in the inferred type.

Autofixes `.length(n)` (and equal-bound `.min(n).max(n)`) to a fixed-length tuple and `.min(n)` to a rest tuple (`z.tuple([...], x)`); `.max()` alone and unequal/mixed constraints are report-only.
