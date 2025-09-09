import { AST_NODE_TYPES, ESLintUtils } from '@typescript-eslint/utils';

import { getRuleURL } from '../meta.js';
import { isZodSchemaDeclaration } from '../utils/is-zod-expression.js';

export interface Options {
  style: 'function' | 'method';
}
type MessageIds = 'useFunction' | 'useMethod';

const defaultOptions: Options = { style: 'function' };

export const arrayStyle = ESLintUtils.RuleCreator(getRuleURL)<
  [Options],
  MessageIds
>({
  name: 'consistent-array-style',
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
                const argText = node.arguments.length
                  ? sourceCode.getText(node.arguments[0])
                  : 'z.any()';
                return fixer.replaceText(node, `${argText}.array()`);
              },
            });
          }
          return;
        }

        // z.something().array()
        if (
          callee.type === AST_NODE_TYPES.MemberExpression &&
          callee.property.type === AST_NODE_TYPES.Identifier &&
          callee.property.name === 'array' &&
          !(
            callee.object.type === AST_NODE_TYPES.Identifier &&
            callee.object.name === 'z'
          )
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
