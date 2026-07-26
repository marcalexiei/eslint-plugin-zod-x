---
'@eslint-zod/utils': major
---

feat!: schema detection is reachable only through a tracker

`detectZodSchemaRootNode` and `isZodNumberSchemaCallExpression` are no longer
root exports — their 2nd and 3rd parameters were the tracker's private import
maps, which no consumer can obtain. Use `scope.createTracker()`.

- `isZodNumberSchemaCallExpression` becomes `isZodSchemaOfType(node, schemaType)`
- `DetectData.node` is gone: it always returned the node you passed in
- `ZodImportScope`, `DetectData`, `DetectResult`, `ZodSchemaImportTracker` and
  `ZodChainItem` are now exported — all were already referenced by the public API
