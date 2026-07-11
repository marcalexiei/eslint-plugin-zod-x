---
'eslint-plugin-zod-mini': minor
---

feat: add `no-unnecessary-readonly` rule

Flags `z.readonly()` on schemas whose output is already immutable — primitives/scalars, number sub-types, top-level string formats, and doubled `readonly` — and autofixes by unwrapping the schema.
