---
'eslint-plugin-zod': minor
---

feat: add `prefer-string-length-over-min-max` rule

Collapses `.min(n).max(n)` with the same value on a string schema to `.length(n)`.
Not enabled in `recommended`.
