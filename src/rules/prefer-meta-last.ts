import type { TSESTree } from '@typescript-eslint/utils';
import { AST_NODE_TYPES, ESLintUtils } from '@typescript-eslint/utils';

import { getRuleURL } from '../meta.js';

export const preferMetaLast = ESLintUtils.RuleCreator(getRuleURL)({
  name: 'prefer-meta-last',
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Enforce .meta() as last method',
    },
    fixable: 'code',
    messages: {
      metaNotLast: 'The .meta() methods should be the last one called',
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    return {
      CallExpression(node): void {
        if (
          node.callee.type === AST_NODE_TYPES.MemberExpression &&
          node.callee.property.type === AST_NODE_TYPES.Identifier &&
          node.callee.property.name === 'meta'
        ) {
          // Walk up the AST to see if there's any chained member call after .meta()
          let current: TSESTree.Node | undefined = node.parent;
          let hasFollowingMethod = false;

          while (current) {
            if (
              current.type === AST_NODE_TYPES.CallExpression &&
              current.callee.type === AST_NODE_TYPES.MemberExpression
            ) {
              const prop = current.callee.property;
              if (
                prop.type === AST_NODE_TYPES.Identifier &&
                prop.name !== 'meta'
              ) {
                hasFollowingMethod = true;
                break;
              }
            }
            current = current.parent ?? undefined;
          }

          if (hasFollowingMethod) {
            const { callee } = node;
            const { sourceCode } = context;

            context.report({
              node: callee.property,
              messageId: 'metaNotLast',
              fix: (fixer) => {
                const metaText = sourceCode.getText(node);
                const metaRange = node.range;

                // Find the last call in the chain
                let last = node.parent as TSESTree.CallExpression;
                while (
                  last.parent.type === AST_NODE_TYPES.CallExpression &&
                  last.parent.callee.type === AST_NODE_TYPES.MemberExpression
                ) {
                  last = last.parent;
                }

                const lastRange = last.range;

                return [
                  // remove the `.meta(...)` from its current spot
                  fixer.removeRange([callee.object.range[1], metaRange[1]]),
                  // append `.meta(...)` at the end
                  fixer.insertTextAfterRange(
                    lastRange,
                    `.${/meta\(.*\)/.exec(metaText)![0]}`,
                  ),
                ];
              },
            });
          }
        }
      },
    };
  },
});
