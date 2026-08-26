---
'eslint-plugin-zod': minor
---

feat: add `prefer-map-set-size-over-min-max` rule, which collapses `.min(n).max(n)` with the same value on a set or map schema into `.size(n)`
