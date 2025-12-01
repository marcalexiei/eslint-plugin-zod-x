import type { TSESLint, TSESTree } from '@typescript-eslint/utils';
import { ESLintUtils } from '@typescript-eslint/utils';

import { getRuleURL } from '../meta.js';
import { trackZodSchemaImports } from '../utils/track-zod-schema-imports.js';

export const requireBrandTypeParameter = ESLintUtils.RuleCreator(getRuleURL)({
  name: 'require-brand-type-parameter',
  meta: {
    hasSuggestions: true,
    type: 'problem',
    docs: {
      description: 'Require type parameter on `.brand()` functions',
    },
    messages: {
      missingTypeParameter: 'Type parameter is required when using `.brand()`',
      removeBrandFunction:
        'Brand is a static-only construct. If not parameter is required consider removal',
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

        const methods = collectZodChainMethods(zodSchemaMeta.node);

        const brandMethod = methods.find((it) => it.name === 'brand');

        if (!brandMethod) {
          return;
        }

        const brandNode = brandMethod.node;

        const { typeArguments } = brandNode;

        if (typeArguments && typeArguments.params.length > 0) {
          return;
        }

        const brandCalleeNode = brandNode.callee as TSESTree.MemberExpression;

        context.report({
          messageId: 'missingTypeParameter',
          node: brandCalleeNode.property,
          suggest: [
            {
              messageId: 'removeBrandFunction',
              fix(fixer): TSESLint.RuleFix {
                return fixer.removeRange([
                  brandCalleeNode.object.range[1],
                  brandNode.range[1],
                ]);
              },
            },
          ],
        });
      },
    };
  },
});
