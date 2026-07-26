---
'@eslint-zod/utils': patch
---

fix: declare `types` conditions in the exports map

- collapses the per-builder subpath entries into a `rule-builders/*` wildcard
- adds `"sideEffects": false`.
