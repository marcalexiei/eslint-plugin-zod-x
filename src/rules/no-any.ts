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
      importDeclarationNodeHandler,
      detectZodSchemaRootNode,
    } = trackZodSchemaImports();

    return {
      ImportDeclaration: importDeclarationNodeHandler,
      CallExpression(node): void {
        const zodSchemaMeta = detectZodSchemaRootNode(
          node,
          context.sourceCode.getAncestors(node),
        );

        if (zodSchemaMeta?.schemaType === 'any') {
          const { callee } = node;

          if (callee.type === AST_NODE_TYPES.Identifier) {
            context.report({
              node,
              messageId: 'noZAny',
            });
            return;
          }

          if (callee.type === AST_NODE_TYPES.MemberExpression) {
            context.report({
              node,
              messageId: 'noZAny',
              suggest: [
                {
                  messageId: 'useUnknown',
                  fix(fixer): TSESLint.RuleFix {
                    return fixer.replaceText(callee.property, 'unknown');
                  },
                },
              ],
            });
          }
        }
      },
    };
  },
});
