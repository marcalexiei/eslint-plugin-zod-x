import { zodImportScope } from '@eslint-zod/utils';
import { buildNoDuplicateSchemaMethodsCreate } from '@eslint-zod/utils/rule-builders/no-duplicate-schema-methods';

import { createZodPluginRule } from '../utils/create-plugin-rule.js';

/**
 * Methods excluded from duplicate-call detection because they are intentionally
 * called more than once in a single schema chain in the `zod` (full) API.
 *
 * - `and` / `or` — each call adds an intersection / union branch
 * - `array` — each call wraps the previous schema in another array layer
 * - `check` — each call registers additional `$ZodCheck` validators
 * - `pipe` — each call pipes the output through another schema
 * - `refine` / `superRefine` — each call adds an independent refinement
 * - `register` — each call registers the schema in a different registry
 * - `transform` — each call adds a transformation step
 */
const EXCLUDED_METHODS = [
  'and',
  'array',
  'check',
  'or',
  'pipe',
  'refine',
  'register',
  'superRefine',
  'transform',
] as const;

export const noDuplicateSchemaMethods = createZodPluginRule({
  name: 'no-duplicate-schema-methods',
  meta: {
    hasSuggestions: false,
    type: 'problem',
    docs: {
      description: 'Disallow calling the same schema method more than once in a single chain',
    },
    messages: {
      noDuplicateSchemaMethod:
        'Method `.{{method}}()` is called more than once in this schema chain.',
    },
    schema: [],
  },
  defaultOptions: [],
  create: buildNoDuplicateSchemaMethodsCreate(zodImportScope, EXCLUDED_METHODS),
});
