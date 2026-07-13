---
'eslint-plugin-zod': minor
---

feat: add `no-unnecessary-readonly` rule

Flags `.readonly()` on schemas whose output is already immutable — primitives/scalars, number sub-types, top-level string formats, and doubled `readonly`.

Autofix removes the call.
