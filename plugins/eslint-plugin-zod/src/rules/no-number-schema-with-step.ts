import { zodImportScope } from '@eslint-zod/utils';
import type { TSESTree } from '@typescript-eslint/utils';
import { AST_NODE_TYPES } from '@typescript-eslint/utils';

import { createZodPluginRule } from '../utils/create-plugin-rule.js';

export const noNumberSchemaWithStep = createZodPluginRule({
  name: 'no-number-schema-with-step',
  meta: {
    fixable: 'code',
    type: 'problem',
    docs: {
      description: 'Disallow deprecated `z.number().step()`. Use `.multipleOf()` instead.',
    },
    messages: {
      useMultipleOf: '`.step()` is deprecated. Use `.multipleOf()` with the same argument instead.',
    },
    schema: [],
  },
  defaultOptions: [],

  create(context) {
    const { createSchemaVisitor, collectZodChainMethods } = zodImportScope.createTracker();

    return createSchemaVisitor({
      schemaType: 'number',
      onSchema(node): void {
        const methods = collectZodChainMethods(node);
        const stepIndex = methods.findIndex((m) => m.name === 'step');
        if (stepIndex === -1) {
          return;
        }

        // Rename the `step` call's own property, not the chain's outermost one:
        // in `z.number().step(5).min(0)` the outermost callee is `.min`.
        const { callee } = methods[stepIndex].node;
        // A named import aliased to `step` (`import { number as step }`) also
        // yields a chain item called `step`, but its callee is a bare
        // identifier with no property to rename.
        if (callee.type !== AST_NODE_TYPES.MemberExpression) {
          return;
        }

        // `collectZodChainMethods` only names a member-expression call when its
        // property is an identifier, so reaching here guarantees the narrowing.
        const property = callee.property as TSESTree.Identifier;

        context.report({
          node,
          messageId: 'useMultipleOf',
          fix(fixer) {
            return fixer.replaceText(property, 'multipleOf');
          },
        });
      },
    });
  },
});
