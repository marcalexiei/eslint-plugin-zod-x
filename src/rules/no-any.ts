import type { TSESLint } from '@typescript-eslint/utils';
import { AST_NODE_TYPES, ESLintUtils } from '@typescript-eslint/utils';

import { getRuleURL } from '../meta.js';
import { trackZodSchemaImports } from '../utils/track-zod-schema-imports.js';

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
    const {
      //
      importDeclarationListener,
      detectZodSchemaRootNode,
      collectZodChainMethods,
    } = trackZodSchemaImports();

    return {
      ImportDeclaration: importDeclarationListener,
      CallExpression(node): void {
        const zodSchemaMeta = detectZodSchemaRootNode(node);

        if (zodSchemaMeta?.schemaType !== 'any') {
          return;
        }

        const { callee } = node;

        if (callee.type === AST_NODE_TYPES.Identifier) {
          context.report({
            node,
            messageId: 'noZAny',
          });
          return;
        }

        if (callee.type === AST_NODE_TYPES.MemberExpression) {
          const [{ node: schemaMethod }] = collectZodChainMethods(node);

          const innerCallee = schemaMethod.callee;

          if (
            innerCallee.type === AST_NODE_TYPES.MemberExpression &&
            innerCallee.property.type === AST_NODE_TYPES.Identifier
          ) {
            context.report({
              node,
              messageId: 'noZAny',
              suggest: [
                {
                  messageId: 'useUnknown',
                  fix(fixer): TSESLint.RuleFix {
                    return fixer.replaceText(innerCallee.property, 'unknown');
                  },
                },
              ],
            });
            return;
          }

          context.report({
            node,
            messageId: 'noZAny',
          });
        }
      },
    };
  },
});
