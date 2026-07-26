import { findParentSchemaMatchingCondition, zodImportScope } from '@eslint-zod/utils';

import { createZodPluginRule } from '../utils/create-plugin-rule.js';

export const preferStringSchemaWithTrim = createZodPluginRule({
  name: 'prefer-string-schema-with-trim',
  meta: {
    type: 'problem',
    fixable: 'code',
    docs: {
      description: 'Enforce `z.string().trim()` to prevent accidental leading/trailing whitespace',
    },
    messages: {
      addTrim: '`z.string()` schemas should use `.trim()`.',
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    const { importDeclarationListener, detectZodSchemaRootNode, collectZodChainMethods } =
      zodImportScope.createTracker();

    return {
      ImportDeclaration: importDeclarationListener,
      CallExpression(node): void {
        const zodSchemaMeta = detectZodSchemaRootNode(node);

        if (zodSchemaMeta?.schemaType !== 'string') {
          return;
        }

        // Skip if this string schema is the key schema of z.record()
        // because transforms on record keys cause data loss
        // https://github.com/marcalexiei/eslint-zod/issues/242
        if (
          findParentSchemaMatchingCondition(zodSchemaMeta.node, {
            schemaName: 'record',
            condition: (callParent) =>
              callParent.arguments.length > 0 && callParent.arguments[0] === zodSchemaMeta.node,
          })
        ) {
          return;
        }

        const methods = collectZodChainMethods(zodSchemaMeta.node);

        if (methods.some((it) => it.name === 'trim')) {
          return;
        }

        context.report({
          node,
          messageId: 'addTrim',
          fix(fixer) {
            if (zodSchemaMeta.schemaDecl === 'named') {
              return null;
            }

            const lastMethod = methods.at(0)!;
            return fixer.insertTextAfter(lastMethod.node, '.trim()');
          },
        });
      },
    };
  },
});
