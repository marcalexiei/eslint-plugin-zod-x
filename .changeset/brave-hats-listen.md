---
'eslint-plugin-zod': patch
---

fix: remove deprecated `no-string-schema-with-uuid` rule from the `recommended` config

The rule is deprecated and superseded by `prefer-top-level-string-formats`, which is also enabled in `recommended`.
With both rules enabled `z.string().uuid()` produced duplicate reports.
