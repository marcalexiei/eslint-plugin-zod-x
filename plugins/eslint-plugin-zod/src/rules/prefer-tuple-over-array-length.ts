import { buildZodChainRemoveMethodFix, zodImportScope } from '@eslint-zod/utils';
import {
  buildPreferTupleOverArrayLengthCreate,
  readIntegerLiteralValue,
} from '@eslint-zod/utils/rule-builders/prefer-tuple-over-array-length';
import type { TSESLint } from '@typescript-eslint/utils';

import { createZodPluginRule } from '../utils/create-plugin-rule.js';

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

      const lengthMethod = methods.find((it) => it.name === 'length');
      const minMethod = methods.find((it) => it.name === 'min');
      const maxMethod = methods.find((it) => it.name === 'max');
      const nonemptyMethod = methods.find((it) => it.name === 'nonempty');

      // Nothing to flag. (`nonempty` on its own is the idiomatic typed form.)
      if (!lengthMethod && !minMethod && !maxMethod) {
        return null;
      }

      const reportOnly = (): null => null;

      const removeMethods =
        (...targets: Array<(typeof methods)[number]>) =>
        (fixer: TSESLint.RuleFixer): Array<TSESLint.RuleFix> | null => {
          const fixes: Array<TSESLint.RuleFix> = [];
          for (const target of targets) {
            const fix = buildZodChainRemoveMethodFix({
              fixer,
              methods,
              removeIndex: methods.indexOf(target),
            });
            if (fix === null) {
              return null;
            }
            fixes.push(fix);
          }
          return fixes;
        };

      // `.length(n)` → fixed-length tuple, when it is the sole array-only method.
      if (lengthMethod) {
        const isSole = !minMethod && !maxMethod && !nonemptyMethod;
        return {
          kind: 'length',
          countArgument: lengthMethod.node.arguments.at(0) ?? null,
          buildRemoveFix: isSole ? removeMethods(lengthMethod) : reportOnly,
        };
      }

      // `.min(n).max(n)` with equal literal bounds ≡ exact length → fixed tuple.
      if (minMethod && maxMethod) {
        const minValue = readIntegerLiteralValue(minMethod.node.arguments.at(0) ?? null);
        const maxValue = readIntegerLiteralValue(maxMethod.node.arguments.at(0) ?? null);
        const isEqualBounds = !nonemptyMethod && minValue !== null && minValue === maxValue;

        return {
          kind: 'length',
          countArgument: minMethod.node.arguments.at(0) ?? null,
          buildRemoveFix: isEqualBounds ? removeMethods(minMethod, maxMethod) : reportOnly,
        };
      }

      // `.min(n)` alone → rest tuple, when it is the sole array-only method.
      if (minMethod) {
        const isSole = !nonemptyMethod;
        return {
          kind: 'min',
          countArgument: minMethod.node.arguments.at(0) ?? null,
          buildRemoveFix: isSole ? removeMethods(minMethod) : reportOnly,
        };
      }

      // `.max(n)` alone → report-only (no behavior-preserving tuple form).
      return {
        kind: 'max',
        countArgument: maxMethod?.node.arguments.at(0) ?? null,
        buildRemoveFix: reportOnly,
      };
    },
  }),
});
