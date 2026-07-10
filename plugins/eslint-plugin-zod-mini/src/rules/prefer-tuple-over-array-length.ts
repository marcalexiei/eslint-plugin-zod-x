import { buildZodChainRemoveMethodFix, zodMiniImportScope } from '@eslint-zod/utils';
import {
  buildPreferTupleOverArrayLengthCreate,
  readIntegerLiteralValue,
} from '@eslint-zod/utils/rule-builders/prefer-tuple-over-array-length';
import type { LengthConstraintKind } from '@eslint-zod/utils/rule-builders/prefer-tuple-over-array-length';
import type { TSESLint, TSESTree } from '@typescript-eslint/utils';
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

      interface Candidate {
        kind: LengthConstraintKind;
        countArgument: TSESTree.Node | null;
        checkIndex: number;
        checkArgCount: number;
      }

      const candidates: Array<Candidate> = [];

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
            checkIndex,
            checkArgCount: checkArguments.length,
          });
        }
      }

      if (candidates.length === 0) {
        return null;
      }

      // Removes the `.check()` call(s) containing the given candidates, but only
      // when every involved check contains *only* those candidates — removing a
      // whole `.check()` must not orphan an unrelated check argument.
      const buildRemove =
        (targets: Array<Candidate>) =>
        (fixer: TSESLint.RuleFixer): Array<TSESLint.RuleFix> | null => {
          const byCheck = new Map<number, { targeted: number; argCount: number }>();
          for (const target of targets) {
            const entry = byCheck.get(target.checkIndex);
            if (entry) {
              entry.targeted += 1;
            } else {
              byCheck.set(target.checkIndex, { targeted: 1, argCount: target.checkArgCount });
            }
          }

          const fixes: Array<TSESLint.RuleFix> = [];
          for (const [checkIndex, { targeted, argCount }] of byCheck) {
            if (argCount !== targeted) {
              return null;
            }
            const fix = buildZodChainRemoveMethodFix({ fixer, methods, removeIndex: checkIndex });
            if (fix === null) {
              return null;
            }
            fixes.push(fix);
          }

          return fixes;
        };

      const reportOnly = (): null => null;

      const lengthCandidates = candidates.filter((it) => it.kind === 'length');
      const minCandidates = candidates.filter((it) => it.kind === 'min');
      const maxCandidates = candidates.filter((it) => it.kind === 'max');

      // `z.length(n)` sole → fixed-length tuple.
      if (candidates.length === 1 && lengthCandidates.length === 1) {
        const [only] = lengthCandidates;
        return {
          kind: 'length',
          countArgument: only.countArgument,
          buildRemoveFix: buildRemove([only]),
        };
      }

      // `z.minLength(n)` + `z.maxLength(n)` with equal literal bounds ≡ exact
      // length → fixed-length tuple.
      if (candidates.length === 2 && minCandidates.length === 1 && maxCandidates.length === 1) {
        const [min] = minCandidates;
        const [max] = maxCandidates;
        const minValue = readIntegerLiteralValue(min.countArgument);
        const maxValue = readIntegerLiteralValue(max.countArgument);
        const isEqualBounds = minValue !== null && minValue === maxValue;

        return {
          kind: 'length',
          countArgument: min.countArgument,
          buildRemoveFix: isEqualBounds ? buildRemove([min, max]) : reportOnly,
        };
      }

      // `z.minLength(n)` sole → rest tuple.
      if (candidates.length === 1 && minCandidates.length === 1) {
        const [only] = minCandidates;
        return {
          kind: 'min',
          countArgument: only.countArgument,
          buildRemoveFix: buildRemove([only]),
        };
      }

      // Everything else (`z.maxLength()` alone, multiple/unequal, mixed) →
      // report-only.
      const chosen = candidates.find((it) => it.kind === 'length') ?? candidates[0];
      return {
        kind: chosen.kind,
        countArgument: chosen.countArgument,
        buildRemoveFix: reportOnly,
      };
    },
  }),
});
