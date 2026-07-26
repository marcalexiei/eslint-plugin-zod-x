import { zodMiniImportScope } from '@eslint-zod/utils';
import type { TSESTree } from '@typescript-eslint/utils';

import { createZodMiniPluginRule } from '../utils/create-plugin-rule.js';

export const preferMeta = createZodMiniPluginRule({
  name: 'prefer-meta',
  meta: {
    type: 'suggestion',
    fixable: 'code',
    docs: {
      description: 'Enforce usage of `z.meta()` over `z.describe()`',
    },
    messages: {
      preferMeta:
        'The `z.describe()` function still exists for compatibility with Zod 3, but `z.meta()` is now the recommended approach.',
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    const { importDeclarationListener, detectZodSchemaRootNode } =
      zodMiniImportScope.createTracker();

    return {
      ImportDeclaration: importDeclarationListener,
      CallExpression(node): void {
        const zodSchemaMeta = detectZodSchemaRootNode(node);

        if (zodSchemaMeta?.schemaType !== 'describe') {
          return;
        }

        context.report({
          node,
          messageId: 'preferMeta',
          fix(fixer) {
            if (zodSchemaMeta.schemaDecl === 'named') {
              return null;
            }

            const { callee } = node;
            const [describeArg] = node.arguments;

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
