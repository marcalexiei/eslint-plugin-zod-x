---
'eslint-plugin-zod': minor
---

feat: add `prefer-nullish` rule

Flags chaining `.optional()` and `.nullable()` (in either order) when the two methods are directly adjacent, and autofixes the pair to `.nullish()`. Enabled in `recommended`.
