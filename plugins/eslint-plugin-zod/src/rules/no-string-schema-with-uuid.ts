import { buildZodChainReplacementFix, zodImportScope } from '@eslint-zod/utils';

import { createZodPluginRule } from '../utils/create-plugin-rule.js';

export const noStringSchemaWithUuid = createZodPluginRule({
  name: 'no-string-schema-with-uuid',
  meta: {
    fixable: 'code',
    type: 'problem',
    deprecated: {
      message: 'Use `zod/prefer-top-level-string-formats` instead',
    },
    docs: {
      description:
        'Disallow usage of `z.string().uuid()` in favor of the dedicated `z.uuid()` schema',
      url: 'https://zod.dev/api#uuids',
    },
    messages: {
      useUuid: '`z.string().uuid()` is redundant. Use `z.uuid()` instead.',
    },
    schema: [],
  },
  defaultOptions: [],

  create(context) {
    const { sourceCode } = context;

    const { createSchemaVisitor, collectZodChainMethods } = zodImportScope.createTracker();

    return createSchemaVisitor({
      // Only care about string schemas
      schemaType: 'string',
      onSchema(node, zodSchemaMeta): void {
        // Collect the full chain from the outermost call (left-to-right)
        const methods = collectZodChainMethods(node);

        // find uuid position
        const uuidIndex = methods.findIndex((m) => m.name === 'uuid');

        if (uuidIndex === -1) {
          return;
        }

        const stringIndex = methods.findIndex((m) => m.name === 'string');

        context.report({
          node,
          messageId: 'useUuid',
          fix(fixer) {
            // If it's a named import usage (e.g. `import { string } from 'zod'`), report but do not fix.
            if (zodSchemaMeta.schemaDecl === 'named') {
              return null;
            }

            // Namespace import (e.g. z.string()) — prepare a fixer
            return buildZodChainReplacementFix({
              sourceCode,
              fixer,
              methods,
              fromIndex: stringIndex,
              toIndex: uuidIndex,
              toMethodName: 'uuid',
            });
          },
        });
      },
    });
  },
});
