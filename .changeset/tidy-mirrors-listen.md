---
'eslint-plugin-zod': patch
---

fix: report deprecated methods reached through a computed member

`no-number-schema-with-int`, `no-string-schema-with-uuid` and `prefer-top-level-string-formats` now report `z['string']().uuid()` and friends, without offering a fix — matching `no-number-schema-with-safe`.
