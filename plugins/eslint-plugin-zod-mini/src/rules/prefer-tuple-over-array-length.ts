import { buildZodChainRemoveMethodFix, zodMiniImportScope } from '@eslint-zod/utils';
import { buildPreferTupleOverArrayLengthCreate } from '@eslint-zod/utils/rule-builders/prefer-tuple-over-array-length';
import type {
  FoundLengthConstraint,
  LengthConstraintKind,
} from '@eslint-zod/utils/rule-builders/prefer-tuple-over-array-length';
import { AST_NODE_TYPES } from '@typescript-eslint/utils';

import { createZodMiniPluginRule } from '../utils/create-plugin-rule.js';

const LENGTH_CHECK_KINDS: Record<string, LengthConstraintKind> = {
  length: 'length',
  minLength: 'min',
  maxLength: 'max',
};

export const preferTupleOverArrayLength = createZodMiniPluginRule({
  name: 'prefer-tuple-over-array-length',
  meta: {
    type: 'suggestion',
    fixable: 'code',
    docs: {
      description:
        'Prefer `z.tuple()` over a length-constrained `z.array()` so the length is preserved in the inferred type.',
    },
    messages: {
      preferTuple:
        'Prefer `z.tuple()` over a length-constrained `z.array()` so the length is preserved in the inferred type.',
    },
    schema: [],
  },
  defaultOptions: [],
  create: buildPreferTupleOverArrayLengthCreate(zodMiniImportScope, {
    findLengthConstraint(schemaRootNode, { detectZodSchemaRootNode, collectZodChainMethods }) {
      const methods = collectZodChainMethods(schemaRootNode);

      const candidates: Array<FoundLengthConstraint> = [];

      for (const [checkIndex, method] of methods.entries()) {
        if (method.name !== 'check') {
          continue;
        }

        const checkArguments = method.node.arguments;

        for (const argument of checkArguments) {
          if (argument.type !== AST_NODE_TYPES.CallExpression) {
            continue;
          }

          const checkMeta = detectZodSchemaRootNode(argument);
          const kind = checkMeta ? LENGTH_CHECK_KINDS[checkMeta.schemaType] : undefined;

          if (!checkMeta || !kind) {
            continue;
          }

          candidates.push({
            kind,
            countArgument: checkMeta.node.arguments.at(0) ?? null,
            buildRemoveFix: (fixer) => {
              // Only safe to autofix when `z.length(n)` is the sole check
              // argument; keeping sibling checks while converting to a tuple is
              // left to the user.
              if (checkArguments.length !== 1) {
                return null;
              }

              return buildZodChainRemoveMethodFix({ fixer, methods, removeIndex: checkIndex });
            },
          });
        }
      }

      // Prefer a fixed-length `z.length()` (the only autofixable form) over
      // `z.minLength()` / `z.maxLength()`.
      return candidates.find((it) => it.kind === 'length') ?? candidates.at(0) ?? null;
    },
  }),
});
