---
'eslint-plugin-zod-mini': patch
---

fix: `no-conflicting-checks` no longer flags a narrowed string format as impossible

`z.string().check(z.uuid(), z.uuidv4())` is a refinement, not a contradiction —
the GUID/UUID family nests. Two different UUID versions still conflict.

Also stops `no-coerce-boolean`, `no-throw-in-refine` and
`prefer-enum-over-literal-union` crashing on `z.coerce['boolean']()`,
`z.string().check(z.refine())` and `z.literal()`.
