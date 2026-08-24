---
'eslint-plugin-zod-mini': minor
---

feat: add `prefer-string-length-over-min-max` rule

Collapses `z.minLength(n)` and `z.maxLength(n)` with the same value on a string schema to `z.length(n)`.
Not enabled in `recommended`.
