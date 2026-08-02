---
'eslint-plugin-zod': patch
---

fix: `no-conflicting-checks` no longer flags a narrowed string format as impossible

`z.string().uuid().uuidv4()` and `z.string().guid().uuid()` are refinements, not
contradictions — the GUID/UUID family nests. Two different UUID versions still
conflict.

Also fixes `no-number-schema-with-safe`/`-step`/`-finite` matching the factory of
an aliased import (`import { number as safe }`), and stops `no-native-enum` and
`prefer-string-schema-with-trim` crashing on a computed factory.
