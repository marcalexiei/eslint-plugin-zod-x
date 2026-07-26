---
'@eslint-zod/utils': patch
---

fix: declare `types` conditions in the exports map

Collapses the per-builder subpath entries into a `rule-builders/*` wildcard and
adds `"sideEffects": false`.
