import { ESLintUtils } from '@typescript-eslint/utils';

import { getRuleURL } from '../meta.js';
import { isZodExpressionEndingWithMethod } from '../utils/is-zod-expression.js';
import { trackZodSchemaImports } from '../utils/track-zod-schema-imports.js';

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

    const {
      //
      importDeclarationNodeHandler,
      detectZodSchemaRootNode,
    } = trackZodSchemaImports();

    return {
      ImportDeclaration: importDeclarationNodeHandler,
      CallExpression(node): void {
        const zodSchema = detectZodSchemaRootNode(
          node,
          sourceCode.getAncestors(node),
        );
        if (!zodSchema) {
          return;
        }

        const { importType, schemaType } = zodSchema;

        if (style === 'method') {
          // match all z.array(z.string()) and convert them into
          // z.string().array()
          if (schemaType === 'array') {
            if (importType === 'namespace') {
              context.report({
                node,
                messageId: 'useMethod',
                fix: (fixer) => {
                  // extract inner schema
                  const argText = sourceCode.getText(node.arguments[0]);
                  return fixer.replaceText(node, `${argText}.array()`);
                },
              });
              return;
            }

            context.report({
              node,
              messageId: 'useMethod',
            });
          }
          return;
        }

        const { callee } = node;
        if (
          isZodExpressionEndingWithMethod(callee, 'array') &&
          // if there is a param the array has already a schema inside
          node.arguments.length === 0
        ) {
          if (importType === 'namespace') {
            context.report({
              node,
              messageId: 'useFunction',
              fix: (fixer) => {
                const objText = sourceCode.getText(callee.object);
                return fixer.replaceText(node, `z.array(${objText})`);
              },
            });
            return;
          }

          context.report({
            node,
            messageId: 'useFunction',
          });
        }
      },
    };
  },
});
