import type { ZodSchemaMeta } from './detect-zod-schema-root-node.js';

/**
 * The names of the methods chained *onto* a schema, with the factory removed.
 *
 * `ZodSchemaMeta.methods` is asymmetric: for a namespace schema the factory is
 * itself a member (`z.number().safe()` → `['number', 'safe']`), while for a
 * named import it is the callee identifier and never appears
 * (`number().safe()` → `['safe']`). Testing `methods.includes(name)` therefore
 * matches the factory of an aliased import — `import { number as safe }` makes
 * `safe().min(0)` look like it chains `.safe()`.
 *
 * Use this whenever a rule asks "does this schema chain method X?".
 *
 * @example
 * z.number().safe()                        → ['safe']
 * z['number']().safe()                     → ['safe']
 * number().safe()                          → ['safe']
 * import { number as safe }; safe().min(0) → ['min']
 */
export function getZodChainedMethodNames(meta: ZodSchemaMeta): Array<string> {
  return meta.schemaDecl === 'namespace' ? meta.methods.slice(1) : [...meta.methods];
}
