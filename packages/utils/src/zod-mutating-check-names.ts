/**
 * Zod check names that mutate the validated value instead of just asserting on it.
 * Used in `zod` as chained methods on a schema; used in `zod-mini` as standalone
 * `$ZodCheck` calls passed to `.check(...)`.
 */
export const ZOD_MUTATING_CHECK_NAMES = [
  'normalize',
  'overwrite',
  'toLowerCase',
  'toUpperCase',
  'trim',
];
