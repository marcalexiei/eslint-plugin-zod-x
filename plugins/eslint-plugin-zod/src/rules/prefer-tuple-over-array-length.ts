import { buildZodChainRemoveMethodFix, zodImportScope } from '@eslint-zod/utils';
import { buildPreferTupleOverArrayLengthCreate } from '@eslint-zod/utils/rule-builders/prefer-tuple-over-array-length';
import type { LengthConstraintKind } from '@eslint-zod/utils/rule-builders/prefer-tuple-over-array-length';
import type { TSESLint } from '@typescript-eslint/utils';

import { createZodPluginRule } from '../utils/create-plugin-rule.js';

const LENGTH_METHOD_KINDS: Record<string, LengthConstraintKind> = {
  length: 'length',
  min: 'min',
  max: 'max',
};

export const preferTupleOverArrayLength = createZodPluginRule({
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
  create: buildPreferTupleOverArrayLengthCreate(zodImportScope, {
    findLengthConstraint(schemaRootNode, { collectZodChainMethods }) {
      const methods = collectZodChainMethods(schemaRootNode);

      // Prefer a fixed-length `.length()` (the only autofixable form) over
      // `.min()` / `.max()`.
      const lengthIndex = methods.findIndex((it) => it.name === 'length');
      const index =
        lengthIndex === -1
          ? methods.findIndex((it) => it.name === 'min' || it.name === 'max')
          : lengthIndex;

      if (index === -1) {
        return null;
      }

      const method = methods[index];

      return {
        kind: LENGTH_METHOD_KINDS[method.name],
        countArgument: method.node.arguments.at(0) ?? null,
        buildRemoveFix: (fixer): TSESLint.RuleFix | null =>
          buildZodChainRemoveMethodFix({ fixer, methods, removeIndex: index }),
      };
    },
  }),
});
