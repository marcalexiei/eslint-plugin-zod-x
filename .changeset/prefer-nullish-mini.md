---
'eslint-plugin-zod-mini': minor
---

feat: add `prefer-nullish` rule

Flags nesting `z.optional()` and `z.nullable()` (in either order) when the outer wrapper's single argument is directly the other bare wrapper, and autofixes it to `z.nullish()`. Enabled in `recommended`.
