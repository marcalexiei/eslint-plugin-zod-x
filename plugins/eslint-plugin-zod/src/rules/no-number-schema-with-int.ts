import { buildZodChainReplacementFix, zodImportScope } from '@eslint-zod/utils';

import { createZodPluginRule } from '../utils/create-plugin-rule.js';

export const noNumberSchemaWithInt = createZodPluginRule({
  name: 'no-number-schema-with-int',
  meta: {
    fixable: 'code',
    type: 'problem',
    docs: {
      description: 'Disallow usage of `z.number().int()` as it is considered legacy',
    },
    messages: {
      removeNumber: '`z.number().int()` is considered legacy. Use `z.int()` instead.',
    },
    schema: [],
  },
  defaultOptions: [],

  create(context) {
    const { sourceCode } = context;

    const { importDeclarationListener, detectZodSchemaRootNode, collectZodChainMethods } =
      zodImportScope.createTracker();

    return {
      ImportDeclaration: importDeclarationListener,

      CallExpression(node): void {
        const zodSchemaMeta = detectZodSchemaRootNode(node);

        // Only care about number schemas
        if (zodSchemaMeta?.schemaType !== 'number') {
          return;
        }

        // Collect the full chain from the outermost call (left-to-right)
        const methods = collectZodChainMethods(node);

        // find int position
        const intIndex = methods.findIndex((m) => m.name === 'int');
        if (intIndex === -1) {
          return;
        }

        const numberIndex = methods.findIndex((m) => m.name === 'number');

        context.report({
          node,
          messageId: 'removeNumber',
          fix(fixer) {
            // If it's a named import usage (e.g. `import { number } from 'zod'`), report but do not fix.
            if (zodSchemaMeta.schemaDecl === 'named') {
              return null;
            }

            // Namespace import (e.g. z.number()) — prepare a fixer
            return buildZodChainReplacementFix({
              sourceCode,
              fixer,
              methods,
              fromIndex: numberIndex,
              toIndex: intIndex,
              toMethodName: 'int',
            });
          },
        });
      },
    };
  },
});
