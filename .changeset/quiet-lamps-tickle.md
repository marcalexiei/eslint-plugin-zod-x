---
'eslint-plugin-zod-mini': minor
---

feat: add `prefer-map-set-size-over-min-max` rule, which collapses `z.minSize(n)` and `z.maxSize(n)` with the same value into `z.size(n)`
