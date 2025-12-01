import type { TSESTree } from '@typescript-eslint/utils';
import { AST_NODE_TYPES, ESLintUtils } from '@typescript-eslint/utils';

import { getRuleURL } from '../meta.js';
import { isZodExpressionEndingWithMethod } from '../utils/is-zod-expression.js';
import { trackZodSchemaImports } from '../utils/track-zod-schema-imports.js';
import { getOutermostCall } from '../utils/get-outermost-call.js';

export const preferMetaLast = ESLintUtils.RuleCreator(getRuleURL)({
  name: 'prefer-meta-last',
  meta: {
    type: 'suggestion',
    docs: { description: 'Enforce `.meta()` as last method' },
    fixable: 'code',
    messages: {
      metaNotLast: 'The `.meta()` methods should be the last one called',
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    const {
      importDeclarationListener,
      detectZodSchemaRootNode,
      collectZodChainMethods,
    } = trackZodSchemaImports();

    return {
      ImportDeclaration: importDeclarationListener,

      CallExpression(node): void {
        // Only interested in calls that don't end with `.meta(...)`
        if (
          node.callee.type !== AST_NODE_TYPES.MemberExpression ||
          !isZodExpressionEndingWithMethod(node.callee, 'meta')
        ) {
          return;
        }

        // Try to see if we're inside a schema root (existing behavior)

        // Get the outermost call for the whole chain
        const outer = getOutermostCall(node);
        if (!outer) {
          return;
        }

        const zodSchemaMeta = detectZodSchemaRootNode(outer);

        // Collect the full chain methods
        const chain = collectZodChainMethods(outer);

        // If not inside a schema root AND doesn't look like a zod chain, bail out.
        // This preserves previous behavior while allowing standalone zod chains to be processed.
        if (!zodSchemaMeta) {
          return;
        }

        // Find the first meta() in the chain
        const metaIndex = chain.findIndex((c) => c.name === 'meta');
        if (metaIndex === -1) {
          return;
        }

        // If there are only meta() calls after the first meta -> valid (allow multiple metas at end)
        const hasAnyNonMetaAfter = chain
          .slice(metaIndex + 1)
          .some((c) => c.name !== 'meta');
        if (!hasAnyNonMetaAfter) {
          return;
        }

        // Report the first offending `.meta(...)`
        const metaCall = chain[metaIndex].node;

        const metaCallCallee = metaCall.callee as TSESTree.MemberExpression;

        context.report({
          node: metaCallCallee.property,
          messageId: 'metaNotLast',
          fix: (fixer) => {
            const source = context.sourceCode;

            // "z.string().meta({...})"
            const metaCallText = source.getText(metaCall);

            // Extract ONLY ".meta(...)" from the call text:
            // The metaCall.callee.object gives us the part BEFORE `.meta`
            const objectText = source.getText(metaCallCallee.object);
            const onlyMetaSuffix = metaCallText.slice(objectText.length); // => ".meta({...})"

            // Remove `.meta(...)` where it currently is
            const [, removeStart] = metaCallCallee.object.range;
            const [, removeEnd] = metaCall.range;

            // Last call in the chain:
            const lastCall = chain[chain.length - 1].node;

            return [
              fixer.removeRange([removeStart, removeEnd]),
              fixer.insertTextAfterRange(lastCall.range, onlyMetaSuffix),
            ];
          },
        });
      },
    };
  },
});
