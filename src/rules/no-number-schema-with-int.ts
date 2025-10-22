import type { TSESTree } from '@typescript-eslint/utils';
import { ESLintUtils } from '@typescript-eslint/utils';

import { getRuleURL } from '../meta.js';
import { isZodExpression } from '../utils/is-zod-expression.js';
import { collectZodChainMethods } from '../utils/collect-zod-chain-methods.js';

export const noNumberSchemaWithInt = ESLintUtils.RuleCreator(getRuleURL)({
  name: 'no-number-schema-with-int',
  meta: {
    fixable: 'code',
    type: 'problem',
    docs: {
      description:
        'Disallow usage of `z.number().int()` as it is considered legacy',
    },
    messages: {
      removeNumber:
        '`z.number().int()` is considered legacy. Use `z.int()` instead.',
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    const { sourceCode } = context;

    return {
      CallExpression(node): void {
        // match only zod expressions with .int()
        if (!isZodExpression(node.callee, 'int')) {
          return;
        }

        // We expect objectNode to be a CallExpression (result of previous chain),
        // but it could be nested; pass the whole CallExpression node for traversal.
        const methods = collectZodChainMethods(node);

        const numberMethodData = methods.find((it) => it.name === 'number');
        if (!numberMethodData) {
          return;
        }

        const intNode = node.callee.property;
        const numberNode = numberMethodData.node;

        context.report({
          node: intNode,
          messageId: 'removeNumber',
          fix(fixer) {
            const numberCallee = numberNode.callee as TSESTree.MemberExpression;
            const [start] = numberNode.range;
            const [, end] = node.range;

            // Get the chain prefix (z)
            const prefix = sourceCode.getText(numberCallee.object);

            // Get the intermediate chain methods by taking everything after number()
            // up to but not including .int()
            const afterNumber = sourceCode.text.slice(numberNode.range[1], end);
            const beforeInt = afterNumber.slice(
              0,
              afterNumber.lastIndexOf('.int()'),
            );

            return fixer.replaceTextRange(
              [start, end],
              `${prefix}.int()${beforeInt}`,
            );
          },
        });
      },
    };
  },
});
