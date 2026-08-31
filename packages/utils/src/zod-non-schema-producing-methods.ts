/**
 * Zod method names that consume a schema rather than return a new one — parse
 * methods, validation predicates, codec helpers, and error formatters. Useful
 * for filtering out terminal calls when traversing a chain (e.g. to detect the
 * last "schema-shaped" node in `z.string().parse(input)`).
 */
export const ZOD_NON_SCHEMA_PRODUCING_METHODS = Object.freeze([
  // parse methods
  'parse',
  'parseAsync',
  'safeParse',
  'safeParseAsync',
  'spa', // alias for `safeParseAsync`
  'encode',
  'encodeAsync',
  'decode',
  'decodeAsync',
  'safeEncode',
  'safeEncodeAsync',
  'safeDecode',
  'safeDecodeAsync',

  // validation predicates (zod 4.5) — `boolean` / `Promise<boolean>`, not a schema
  'validate',
  'validateAsync',

  // codec
  'codec',

  // error formatting
  'treeifyError',
  'prettifyError',
  'formatError',
  'flattenError',
]);
