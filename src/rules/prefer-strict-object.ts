import { AST_NODE_TYPES, ESLintUtils } from '@typescript-eslint/utils';

import { isZodSchemaDeclaration } from '../utils/is-zod-expression.js';
import { getRuleURL } from '../meta.js';

const methodsPoll = ['object', 'looseObject'] as const;

interface Options {
  allow: Array<(typeof methodsPoll)[number]>;
}
type MessageIds = 'useStrictObject';

const defaultOptions: Options = { allow: [] };

export const preferStrictObjet = ESLintUtils.RuleCreator(getRuleURL)<
  [Options],
  MessageIds
>({
  name: 'prefer-strict-object',
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Enforce usage of `.strictObject()` over `.object()` and/or `.looseObject()`',
    },
    messages: {
      useStrictObject: 'Use `.strictObject()` instead of `.{{method}}()`',
    },
    schema: [
      {
        type: 'object',
        additionalProperties: false,
        properties: {
          allow: {
            description: 'Decides which style for zod array function',
            type: 'array',
            items: {
              type: 'string',
              enum: [...methodsPoll],
            },
          },
        },
      },
    ],
  },
  defaultOptions: [defaultOptions],
  create(context, [{ allow }]) {
    return {
      CallExpression(node): void {
        if (node.callee.type !== AST_NODE_TYPES.MemberExpression) {
          return;
        }

        // Exclude allowed methods from the check
        const bannedMethods = methodsPoll.filter((it) => !allow.includes(it));

        if (
          node.callee.property.type === AST_NODE_TYPES.Identifier &&
          bannedMethods.some((it) => isZodSchemaDeclaration(node.callee, it))
        ) {
          context.report({
            node,
            messageId: 'useStrictObject',
            data: { method: node.callee.property.name },
          });
        }
      },
    };
  },
});
