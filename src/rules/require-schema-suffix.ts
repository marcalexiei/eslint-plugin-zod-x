import { AST_NODE_TYPES, ESLintUtils } from '@typescript-eslint/utils';

import { isZodAtTheBeginningOfMemberExpression } from '../utils/is-zod-expression.js';
import { getRuleURL } from '../meta.js';

export interface Options {
  suffix: string;
}

type MessageIds = 'noSchemaSuffix';

export const requireSchemaSuffix = ESLintUtils.RuleCreator(getRuleURL)<
  [Options],
  MessageIds
>({
  name: 'require-schema-suffix',
  meta: {
    type: 'suggestion',
    fixable: 'code',
    docs: {
      description: 'Require schema suffix when declaring a Zod schema',
    },
    messages: {
      noSchemaSuffix:
        'Variable declaring Zod schema must have a {{suffix}} suffix',
    },
    schema: [
      {
        type: 'object',
        properties: {
          suffix: {
            type: 'string',
            description: 'The required suffix for Zod schema variables',
          },
        },
        additionalProperties: false,
      },
    ],
  },
  defaultOptions: [{ suffix: 'Schema' }],
  create(context, [{ suffix }]) {
    return {
      VariableDeclarator(node): void {
        if (node.init?.type !== AST_NODE_TYPES.CallExpression) {
          return;
        }

        const {
          init: { callee },
        } = node;

        // Check that the initializer is a zod schema declaration
        if (
          callee.type !== AST_NODE_TYPES.MemberExpression ||
          !isZodAtTheBeginningOfMemberExpression(callee)
        ) {
          return;
        }

        if (callee.property.type === AST_NODE_TYPES.Identifier) {
          // Bail if a codec property is used is detected
          if (callee.property.name === 'codec') {
            return;
          }

          // Check that the expression doesn't have a method
          // returning data instead of a schema declaration
          const zodMethodNotReturningASchema = [
            'parse',
            'safeParse',
            'parseAsync',
            'safeParseAsync',
            'spa', // alias for `safeParseAsync`
            'encode',
            'decode',
            'encodeAsync',
            'decodeAsync',
            'safeEncode',
            'safeDecode',
            'safeEncodeAsync',
            'safeDecodeAsync',
          ];
          if (zodMethodNotReturningASchema.includes(callee.property.name)) {
            return;
          }
        }

        if (node.id.type === AST_NODE_TYPES.Identifier) {
          if (!node.id.name.endsWith(suffix)) {
            context.report({
              node,
              messageId: 'noSchemaSuffix',
              data: { suffix },
              fix: (fixer) => fixer.insertTextAfter(node.id, suffix),
            });
          }
        }
      },
    };
  },
});
