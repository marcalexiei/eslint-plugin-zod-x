import type { TSESTree } from '@typescript-eslint/utils';
import { AST_NODE_TYPES, ESLintUtils } from '@typescript-eslint/utils';

import { isZodAtTheBeginningOfMemberExpression } from '../utils/is-zod-expression.js';
import { getRuleURL } from '../meta.js';
import { collectZodChainMethods } from '../utils/collect-zod-chain-methods.js';

interface Options {
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
      VariableDeclarator(node: TSESTree.VariableDeclarator): void {
        const initNode = node.init;
        if (
          !initNode ||
          initNode.type !== AST_NODE_TYPES.CallExpression ||
          initNode.callee.type !== AST_NODE_TYPES.MemberExpression ||
          // Check that the initializer is a zod schema declaration
          !isZodAtTheBeginningOfMemberExpression(initNode.callee)
        ) {
          return;
        }

        // Collect all methods from the chain
        const chainMethods = collectZodChainMethods(initNode).map(
          (it) => it.name,
        );

        // Methods that either produce non-schema outputs or are unrelated to schemas (e.g., codecs)
        const methodsThatProduceSomethingThatShouldNotBeValidated = [
          // parse methods
          'parse',
          'parseAsync',
          'safeParse',
          'safeParseAsync',
          'spa', // alias for `safeParseAsync`
          'encode',
          'encodeAsync',
          'decode',
          'decodeAsync',
          'safeEncode',
          'safeEncodeAsync',
          'safeDecode',
          'safeDecodeAsync',

          // codec
          'codec',
        ];

        if (
          methodsThatProduceSomethingThatShouldNotBeValidated.some((it) =>
            chainMethods.includes(it),
          )
        ) {
          return;
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
