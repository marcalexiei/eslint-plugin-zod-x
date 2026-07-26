import { zodImportScope } from '@eslint-zod/utils';
import type { TSESTree } from '@typescript-eslint/utils';

import { createZodPluginRule } from '../utils/create-plugin-rule.js';

export const preferMeta = createZodPluginRule({
  name: 'prefer-meta',
  meta: {
    type: 'suggestion',
    fixable: 'code',
    docs: {
      description: 'Enforce usage of `.meta()` over `.describe()`',
    },
    messages: {
      preferMeta:
        'The `.describe()` method still exists for compatibility with Zod 3, but `.meta()` is now the recommended approach.',
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

        if (!zodSchemaMeta) {
          return;
        }

        const describe = collectZodChainMethods(node).find((it) => it.name === 'describe');

        if (!describe) {
          return;
        }

        const {
          callee,
          arguments: [describeArg],
        } = describe.node;

        context.report({
          node,
          messageId: 'preferMeta',
          fix(fixer) {
            return [
              fixer.replaceText((callee as TSESTree.MemberExpression).property, 'meta'),
              fixer.replaceText(
                describeArg,
                `{ description: ${context.sourceCode.getText(describeArg)} }`,
              ),
            ];
          },
        });
      },
    };
  },
});
