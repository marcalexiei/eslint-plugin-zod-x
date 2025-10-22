import { ESLintUtils } from '@typescript-eslint/utils';

import { isZodExpression } from '../utils/is-zod-expression.js';
import { getRuleURL } from '../meta.js';

export const preferMeta = ESLintUtils.RuleCreator(getRuleURL)({
  name: 'prefer-meta',
  meta: {
    type: 'suggestion',
    fixable: 'code',
    docs: {
      description: 'Enforce usage of `.meta()` over `.describe()`',
    },
    messages: {
      preferMeta:
        'The `.describe()` method still exists for compatibility with Zod 3, but `.meta()` is now the recommended approach.',
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    return {
      CallExpression(node): void {
        if (isZodExpression(node.callee, 'describe')) {
          const {
            callee,
            arguments: [describeArg],
          } = node;

          context.report({
            node,
            messageId: 'preferMeta',
            fix(fixer) {
              return [
                fixer.replaceText(callee.property, 'meta'),
                fixer.replaceText(
                  describeArg,
                  `{ description: ${context.sourceCode.getText(describeArg)} }`,
                ),
              ];
            },
          });
        }
      },
    };
  },
});
