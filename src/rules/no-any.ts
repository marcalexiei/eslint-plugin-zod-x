import { ESLintUtils } from '@typescript-eslint/utils';

import { isZodSchemaDeclaration } from '../utils/is-zod-expression.js';
import { getRuleURL } from '../meta.js';

export const noAny = ESLintUtils.RuleCreator(getRuleURL)({
  name: 'no-any',
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Disallow usage of z.any() in Zod schemas',
    },
    messages: {
      noZAny:
        'Using z.any() is not allowed. Please use a more specific schema.',
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    return {
      CallExpression(node): void {
        if (isZodSchemaDeclaration(node.callee, 'any')) {
          context.report({ node, messageId: 'noZAny' });
        }
      },
    };
  },
});
