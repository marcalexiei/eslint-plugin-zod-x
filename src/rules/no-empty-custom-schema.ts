import { ESLintUtils } from '@typescript-eslint/utils';

import { isZodSchemaDeclaration } from '../utils/is-zod-expression.js';
import { getRuleURL } from '../meta.js';

export const noEmptyCustomSchema = ESLintUtils.RuleCreator(getRuleURL)({
  name: 'no-empty-custom-schema',
  meta: {
    hasSuggestions: false,
    type: 'suggestion',
    docs: {
      description: 'Disallow usage of z.custom() without arguments',
    },
    messages: {
      noEmptyCustomSchema:
        'You should provide a validate function within z.custom() ',
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    return {
      CallExpression(node): void {
        if (
          isZodSchemaDeclaration(node.callee, 'custom') &&
          node.arguments.length === 0
        ) {
          context.report({
            node,
            messageId: 'noEmptyCustomSchema',
          });
        }
      },
    };
  },
});
