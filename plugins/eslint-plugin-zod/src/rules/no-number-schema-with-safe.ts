import {
  buildZodChainReplacementFix,
  getZodChainedMethodNames,
  zodImportScope,
} from '@eslint-zod/utils';

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
        // Detect on the names alone: they exclude the factory, so an aliased
        // named import (`import { number as safe }`) is not mistaken for a
        // `.safe()` call, and a computed factory (`z['number']().safe()`) is
        // still caught even though the chain walker cannot name it.
        if (!getZodChainedMethodNames(zodSchemaMeta).includes('safe')) {
          return;
        }

        const methods = collectZodChainMethods(node);
        // Skip index 0 — that item is the `number()` factory itself.
        const safeIndex = methods.findIndex((m, index) => index > 0 && m.name === 'safe');

        context.report({
          node,
          messageId: 'useInt',
          fix(fixer) {
            // For named imports (e.g., `number().safe()`), we cannot safely auto-fix
            // because replacing the entire chain would require access to the namespace prefix.
            // A computed factory leaves `safeIndex` at -1 — also unfixable.
            if (zodSchemaMeta.schemaDecl === 'named' || safeIndex === -1) {
              return null;
            }

            return buildZodChainReplacementFix({
              sourceCode,
              fixer,
              methods,
              // The factory is always the first chain item.
              fromIndex: 0,
              toIndex: safeIndex,
              toMethodName: 'int',
            });
          },
        });
      },
    });
  },
});
