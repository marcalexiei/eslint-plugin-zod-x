import { ESLintUtils } from '@typescript-eslint/utils';

import { getRuleURL } from '../meta.js';
import {
  isZodExpression,
  isZodIdentifier,
  isZodSchemaDeclaration,
} from '../utils/is-zod-expression.js';

interface Options {
  style: 'function' | 'method';
}
type MessageIds = 'useFunction' | 'useMethod';

const defaultOptions: Options = { style: 'function' };

export const arrayStyle = ESLintUtils.RuleCreator(getRuleURL)<
  [Options],
  MessageIds
>({
  name: 'array-style',
  meta: {
    type: 'suggestion',
    fixable: 'code',
    docs: {
      description: 'Enforce consistent Zod array style',
    },
    messages: {
      useFunction: 'Use z.array(schema) instead of schema.array().',
      useMethod: 'Use schema.array() instead of z.array(schema).',
    },
    schema: [
      {
        type: 'object',
        properties: {
          style: {
            description: 'Decides which style for zod array function',
            type: 'string',
            enum: ['function', 'method'],
          },
        },
        additionalProperties: false,
      },
    ],
  },
  defaultOptions: [defaultOptions],
  create(context, [{ style }]) {
    const { sourceCode } = context;

    return {
      CallExpression(node): void {
        const { callee } = node;

        if (style === 'method') {
          // z.array(...)
          if (isZodSchemaDeclaration(callee, 'array')) {
            context.report({
              node,
              messageId: 'useMethod',
              fix: (fixer) => {
                // extract inner schema
                const argText = sourceCode.getText(node.arguments[0]);
                return fixer.replaceText(node, `${argText}.array()`);
              },
            });
          }
          return;
        }

        // z.something().array()
        if (
          isZodExpression(callee, 'array') &&
          !isZodIdentifier(callee.object)
        ) {
          context.report({
            node,
            messageId: 'useFunction',
            fix: (fixer) => {
              const objText = sourceCode.getText(callee.object);
              return fixer.replaceText(node, `z.array(${objText})`);
            },
          });
        }
      },
    };
  },
});
