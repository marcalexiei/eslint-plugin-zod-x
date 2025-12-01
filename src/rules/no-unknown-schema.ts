import { ESLintUtils } from '@typescript-eslint/utils';

import { getRuleURL } from '../meta.js';
import { trackZodSchemaImports } from '../utils/track-zod-schema-imports.js';

export const noUnknownSchema = ESLintUtils.RuleCreator(getRuleURL)({
  name: 'no-unknown-schema',
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Disallow usage of `z.unknown()` in Zod schemas',
    },
    messages: {
      noZUnknown:
        'Using `z.unknown()` is not allowed. Please use a more specific schema.',
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    const {
      //
      importDeclarationListener,
      detectZodSchemaRootNode,
    } = trackZodSchemaImports();

    return {
      ImportDeclaration: importDeclarationListener,
      CallExpression(node): void {
        const zodSchemaMeta = detectZodSchemaRootNode(node);

        if (zodSchemaMeta?.schemaType === 'unknown') {
          context.report({
            node,
            messageId: 'noZUnknown',
          });
        }
      },
    };
  },
});
