---
'eslint-plugin-zod': patch
---

fix: `no-number-schema-with-safe`, `-finite` and `-step` missed the deprecated method mid-chain

All three required the deprecated call to be the last one in the chain, so `z.number().safe().min(0)` went unreported while `z.number().safe()` was flagged.
`-step` additionally renamed the chain's outermost property, which would have rewritten `.min()` instead of `.step()`.
