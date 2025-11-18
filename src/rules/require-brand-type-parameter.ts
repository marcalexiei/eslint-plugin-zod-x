import type { TSESLint, TSESTree } from '@typescript-eslint/utils';
import { ESLintUtils } from '@typescript-eslint/utils';

import { isZodExpressionEndingWithMethod } from '../utils/is-zod-expression.js';
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
      importDeclarationNodeHandler,
      detectZodSchemaRootNode,
    } = trackZodSchemaImports();

    return {
      ImportDeclaration: importDeclarationNodeHandler,
      CallExpression(node): void {
        const zodSchemaMeta = detectZodSchemaRootNode(node);
        if (!zodSchemaMeta) {
          return;
        }

        if (!isZodExpressionEndingWithMethod(node.callee, 'brand')) {
          return;
        }

        const { typeArguments } = node;

        if (typeArguments && typeArguments.params.length > 0) {
          return;
        }

        context.report({
          messageId: 'missingTypeParameter',
          node: node.callee.property,
          suggest: [
            {
              messageId: 'removeBrandFunction',
              fix(fixer): TSESLint.RuleFix {
                const brandCalleeNode =
                  node.callee as TSESTree.MemberExpression;
                return fixer.removeRange([
                  brandCalleeNode.object.range[1],
                  node.range[1],
                ]);
              },
            },
          ],
        });
      },
    };
  },
});
