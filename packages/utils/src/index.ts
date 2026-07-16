// import tracking & scopes
export { createZodSchemaImportTrack } from './track-zod-schema-imports.js';
export { zodCoreImportScope, zodImportScope, zodMiniImportScope } from './zod-import-scope.js';

// schema detection & navigation
export { isZodNumberSchemaCallExpression } from './detect-zod-schema-root-node.js';
export { findParentSchemaMatchingCondition } from './find-parent-schema-matching-condition.js';
export { getZodSchemaBaseType } from './get-zod-schema-base-type.js';
export type { ZodSchemaBaseType } from './get-zod-schema-base-type.js';
export type {
  ZodChainedConstraint,
  ZodCheckArgumentConstraint,
  ZodSchemaConstraint,
} from './collect-zod-schema-constraints.js';

// fixer helpers
export { buildZodChainRemoveMethodFix } from './build-zod-chain-remove-method-fix.js';
export { buildZodChainReplacementFix } from './build-zod-chain-replacement-fix.js';
export { buildZodConstraintsRemoveFix } from './build-zod-constraints-remove-fix.js';
export { buildZodWrapperUnwrapFix } from './build-zod-wrapper-unwrap-fix.js';

// zod vocabulary tables
export { ZOD_IMMUTABLE_SCHEMA_TYPES } from './zod-immutable-schema-types.js';
export { ZOD_MUTATING_CHECK_NAMES } from './zod-mutating-check-names.js';
export { ZOD_NON_SCHEMA_PRODUCING_METHODS } from './zod-non-schema-producing-methods.js';
export { ZOD_STRING_FORMAT_NAMES } from './zod-string-format-names.js';
