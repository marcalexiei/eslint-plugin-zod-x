import { ESLintUtils } from '@typescript-eslint/utils';

import { getRuleURL } from '../meta.js';
import { trackZodSchemaImports } from '../utils/track-zod-schema-imports.js';

export const noEmptyCustomSchema = ESLintUtils.RuleCreator(getRuleURL)({
  name: 'no-empty-custom-schema',
  meta: {
    hasSuggestions: false,
    type: 'suggestion',
    docs: {
      description: 'Disallow usage of `z.custom()` without arguments',
    },
    messages: {
      noEmptyCustomSchema:
        'You should provide a validate function within `z.custom()`',
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
        if (!zodSchemaMeta) {
          return;
        }
        if (
          zodSchemaMeta.schemaType === 'custom' &&
          node.arguments.length === 0
        ) {
          context.report({
            node,
            messageId: 'noEmptyCustomSchema',
          });
        }
      },
    };
  },
});
