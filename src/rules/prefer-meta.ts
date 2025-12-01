import type { TSESTree } from '@typescript-eslint/utils';
import { ESLintUtils } from '@typescript-eslint/utils';

import { getRuleURL } from '../meta.js';
import { trackZodSchemaImports } from '../utils/track-zod-schema-imports.js';

export const preferMeta = ESLintUtils.RuleCreator(getRuleURL)({
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
    const {
      //
      importDeclarationListener,
      detectZodSchemaRootNode,
      collectZodChainMethods,
    } = trackZodSchemaImports();

    return {
      ImportDeclaration: importDeclarationListener,
      CallExpression(node): void {
        const zodSchemaMeta = detectZodSchemaRootNode(node);

        if (!zodSchemaMeta) {
          return;
        }

        const describe = collectZodChainMethods(zodSchemaMeta.node).find(
          (it) => it.name === 'describe',
        );

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
              fixer.replaceText(
                (callee as TSESTree.MemberExpression).property,
                'meta',
              ),
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
