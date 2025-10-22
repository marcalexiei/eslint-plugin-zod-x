import type { TSESLint } from '@typescript-eslint/utils';
import { ESLintUtils } from '@typescript-eslint/utils';

import { isZodSchemaDeclaration } from '../utils/is-zod-expression.js';
import { getRuleURL } from '../meta.js';

export const noAny = ESLintUtils.RuleCreator(getRuleURL)({
  name: 'no-any',
  meta: {
    hasSuggestions: true,
    type: 'suggestion',
    docs: {
      description: 'Disallow usage of `z.any()` in Zod schemas',
    },
    messages: {
      noZAny:
        'Using `z.any()` is not allowed. Please use a more specific schema.',
      useUnknown: 'Replace `z.any()` with `z.unknown()`',
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    return {
      CallExpression(node): void {
        if (isZodSchemaDeclaration(node.callee, 'any')) {
          const { callee } = node;

          context.report({
            node,
            messageId: 'noZAny',
            suggest: [
              {
                messageId: 'useUnknown',
                fix(fixer): TSESLint.RuleFix {
                  return fixer.replaceText(callee.property, 'unknown');
                },
              },
            ],
          });
        }
      },
    };
  },
});
