import { createZodSchemaImportTrack, zodImportScope } from '@eslint-zod/utils';
import type { TSESTree } from '@typescript-eslint/utils';

import { createZodPluginRule } from '../utils/create-plugin-rule.js';

const { trackZodSchemaImports } = createZodSchemaImportTrack(zodImportScope);

export const preferLooseObject = createZodPluginRule({
  name: 'prefer-loose-object',
  meta: {
    type: 'suggestion',
    fixable: 'code',
    docs: {
      description:
        'Prefer `z.looseObject()` over `z.object().passthrough()` and `z.object().loose()`',
    },
    messages: {
      preferLooseObject: 'Use `z.looseObject()` instead of `.passthrough()` or `.loose()`.',
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
        const looseMethod = methods.find((it) => it.name === 'passthrough' || it.name === 'loose');

        if (!looseMethod) {
          return;
        }

        context.report({
          node: looseMethod.node,
          messageId: 'preferLooseObject',
          fix(fixer) {
            if (zodSchemaMeta.schemaDecl === 'named') {
              return null;
            }

            if (looseMethod.node.arguments.length !== 0) {
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
            const looseCallee = looseMethod.node.callee as TSESTree.MemberExpression;

            const fixes = [
              fixer.replaceText(
                objectCallee,
                `${sourceCode.getText(objectCallee.object)}.looseObject`,
              ),
            ];

            const tokenBefore = sourceCode.getTokenBefore(looseCallee.property);

            if (tokenBefore?.value === '.') {
              fixes.push(fixer.removeRange([tokenBefore.range[0], looseMethod.node.range[1]]));
            }

            return fixes;
          },
        });
      },
    };
  },
});
