---
'@eslint-zod/utils': major
'eslint-plugin-zod': patch
'eslint-plugin-zod-mini': patch
---

refactor: `buildNoTransformInRecordKeyCreate` now takes the transform names instead of a `findTransformNode` strategy, and the report points at the offending method or check rather than the whole key schema.
