import { zodImportScope } from '@eslint-zod/utils';
import { AST_NODE_TYPES } from '@typescript-eslint/utils';

import { createZodPluginRule } from '../utils/create-plugin-rule.js';

export const noNativeEnum = createZodPluginRule({
  name: 'no-native-enum',
  meta: {
    type: 'problem',
    fixable: 'code',
    docs: {
      description: 'Disallow deprecated `z.nativeEnum()` in favor of `z.enum()`.',
    },
    messages: {
      useEnum: '`z.nativeEnum()` is deprecated in Zod 4. Use `z.enum()` instead.',
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    const { createSchemaVisitor, collectZodChainMethods } = zodImportScope.createTracker();

    return createSchemaVisitor({
      schemaType: 'nativeEnum',
      onSchema(node) {
        // Empty for a computed factory (`z['nativeEnum'](Foo)`), which detection
        // still resolves — report it, just without a fix.
        const rootMethodNode = collectZodChainMethods(node).at(0)?.node;

        context.report({
          node,
          messageId: 'useEnum',
          fix(fixer) {
            // For named imports (e.g., `nativeEnum().optional()`), we cannot safely auto-fix
            // because replacing the entire chain would require access to the namespace prefix.
            // Report the error without a fix in this case.
            if (rootMethodNode?.callee.type !== AST_NODE_TYPES.MemberExpression) {
              return null;
            }

            return fixer.replaceText(rootMethodNode.callee.property, 'enum');
          },
        });
      },
    });
  },
});
