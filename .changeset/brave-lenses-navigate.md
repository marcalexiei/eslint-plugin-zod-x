---
'@eslint-zod/utils': minor
---

feat: add `collectZodSchemaConstraints` tracker helper and `buildZodConstraintsRemoveFix` fixer

`collectZodSchemaConstraints(node)` flattens a schema chain into a normalized `ZodSchemaConstraint` list covering both API styles,
chained methods (`zod`) and `.check(...)` arguments (`zod/mini`) — so shared rule builders navigate a schema's checks through one surface.

`buildZodConstraintsRemoveFix` builds the fixes that remove constraints of either origin, deleting a `.check(...)` call only when every one of its arguments is targeted.
