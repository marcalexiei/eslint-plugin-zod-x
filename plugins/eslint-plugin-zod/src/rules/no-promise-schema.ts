import { zodImportScope } from '@eslint-zod/utils';

import { createZodPluginRule } from '../utils/create-plugin-rule.js';

export const noPromiseSchema = createZodPluginRule({
  name: 'no-promise-schema',
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow deprecated `z.promise()` schemas.',
    },
    messages: {
      noPromiseSchema:
        '`z.promise()` is deprecated in Zod 4. Await the value before parsing it instead.',
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    const { importDeclarationListener, detectZodSchemaRootNode } = zodImportScope.createTracker();

    return {
      ImportDeclaration: importDeclarationListener,

      CallExpression(node): void {
        const zodSchemaMeta = detectZodSchemaRootNode(node);

        if (zodSchemaMeta?.schemaType !== 'promise') {
          return;
        }

        context.report({
          node,
          messageId: 'noPromiseSchema',
        });
      },
    };
  },
});
