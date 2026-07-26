import { createZodSchemaImportTrack, zodImportScope } from '@eslint-zod/utils';
import type { TSESTree } from '@typescript-eslint/utils';

import { createZodPluginRule } from '../utils/create-plugin-rule.js';

const { trackZodSchemaImports } = createZodSchemaImportTrack(zodImportScope);

export const preferStrictObject = createZodPluginRule({
  name: 'prefer-strict-object',
  meta: {
    type: 'suggestion',
    fixable: 'code',
    docs: {
      description: 'Prefer `z.strictObject()` over `z.object().strict()`',
    },
    messages: {
      preferStrictObject: 'Use `z.strictObject()` instead of `.strict()`.',
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    const { importDeclarationListener, detectZodSchemaRootNode, collectZodChainMethods } =
      trackZodSchemaImports();

    return {
      ImportDeclaration: importDeclarationListener,
      CallExpression(node): void {
        const zodSchemaMeta = detectZodSchemaRootNode(node);

        if (zodSchemaMeta?.schemaType !== 'object') {
          return;
        }

        const methods = collectZodChainMethods(zodSchemaMeta.node);
        const strictMethod = methods.find((it) => it.name === 'strict');

        if (!strictMethod) {
          return;
        }

        context.report({
          node: strictMethod.node,
          messageId: 'preferStrictObject',
          fix(fixer) {
            if (zodSchemaMeta.schemaDecl === 'named') {
              return null;
            }

            if (strictMethod.node.arguments.length !== 0) {
              return null;
            }

            const objectMethod = methods.find((it) => it.name === 'object');
            if (!objectMethod) {
              return null;
            }

            const { sourceCode } = context;

            // Named declarations returned above, so both calls are `<ns>.<name>(…)`
            // member expressions — a bare identifier callee is unreachable here.
            const objectCallee = objectMethod.node.callee as TSESTree.MemberExpression;
            const strictCallee = strictMethod.node.callee as TSESTree.MemberExpression;

            const fixes = [
              fixer.replaceText(
                objectCallee,
                `${sourceCode.getText(objectCallee.object)}.strictObject`,
              ),
            ];

            const tokenBefore = sourceCode.getTokenBefore(strictCallee.property);

            if (tokenBefore?.value === '.') {
              fixes.push(fixer.removeRange([tokenBefore.range[0], strictMethod.node.range[1]]));
            }

            return fixes;
          },
        });
      },
    };
  },
});
