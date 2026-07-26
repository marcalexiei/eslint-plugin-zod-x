import { buildZodChainReplacementFix, zodImportScope } from '@eslint-zod/utils';

import { createZodPluginRule } from '../utils/create-plugin-rule.js';

export const noNumberSchemaWithSafe = createZodPluginRule({
  name: 'no-number-schema-with-safe',
  meta: {
    fixable: 'code',
    type: 'problem',
    docs: {
      description:
        'Disallow deprecated `z.number().safe()`. Use `z.int()`; `.safe()` is now identical to `.int()`.',
    },
    messages: {
      useInt:
        '`.safe()` is deprecated; it is identical to `.int()`. Use `z.int()` (or the equivalent) instead of chaining `.safe()` on `z.number()`.',
    },
    schema: [],
  },
  defaultOptions: [],

  create(context) {
    const { sourceCode } = context;

    const { createSchemaVisitor, collectZodChainMethods } = zodImportScope.createTracker();

    return createSchemaVisitor({
      schemaType: 'number',
      onSchema(node, zodSchemaMeta): void {
        const methods = collectZodChainMethods(node);
        const safeIndex = methods.findIndex((m) => m.name === 'safe');
        if (safeIndex === -1) {
          return;
        }

        const numberIndex = methods.findIndex((m) => m.name === 'number');

        context.report({
          node,
          messageId: 'useInt',
          fix(fixer) {
            // For named imports (e.g., `number().safe()`), we cannot safely auto-fix
            // because replacing the entire chain would require access to the namespace prefix.
            // Report the error without a fix in this case.
            if (zodSchemaMeta.schemaDecl === 'named') {
              return null;
            }

            return buildZodChainReplacementFix({
              sourceCode,
              fixer,
              methods,
              fromIndex: numberIndex,
              toIndex: safeIndex,
              toMethodName: 'int',
            });
          },
        });
      },
    });
  },
});
