---
'@eslint-zod/utils': patch
---

fix: `buildConsistentImportCreate` generating the same namespace alias for every group

The alias counter was only incremented inside the branch that required it to be non-zero, so it never advanced past `z`.
