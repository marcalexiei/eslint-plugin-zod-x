import { AST_NODE_TYPES, ESLintUtils } from '@typescript-eslint/utils';

import { getRuleURL } from '../meta.js';
import { trackZodSchemaImports } from '../utils/track-zod-schema-imports.js';

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
    docs: {
      description: 'Require schema suffix when declaring a Zod schema',
    },
    messages: {
      noSchemaSuffix:
        'Use the "{{suffix}}" suffix for Zod schemas. Rename this to "{{expected}}"',
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
    const {
      importDeclarationNodeHandler,
      detectZodSchemaRootNode,
      collectZodChainMethods,
    } = trackZodSchemaImports();

    return {
      ImportDeclaration: importDeclarationNodeHandler,
      VariableDeclarator(node): void {
        const initNode = node.init;

        if (
          !initNode ||
          initNode.type !== AST_NODE_TYPES.CallExpression ||
          !detectZodSchemaRootNode(initNode)
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

        if (
          node.id.type !== AST_NODE_TYPES.Identifier ||
          node.id.name.endsWith(suffix)
        ) {
          return;
        }

        context.report({
          node,
          messageId: 'noSchemaSuffix',
          data: { suffix, expected: `${node.id.name}${suffix}` },
        });
      },
    };
  },
});
