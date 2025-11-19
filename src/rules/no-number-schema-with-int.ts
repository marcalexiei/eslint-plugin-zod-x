import type { TSESTree } from '@typescript-eslint/utils';
import { ESLintUtils } from '@typescript-eslint/utils';

import { getRuleURL } from '../meta.js';
import { trackZodSchemaImports } from '../utils/track-zod-schema-imports.js';

export const noNumberSchemaWithInt = ESLintUtils.RuleCreator(getRuleURL)({
  name: 'no-number-schema-with-int',
  meta: {
    fixable: 'code',
    type: 'problem',
    docs: {
      description:
        'Disallow usage of `z.number().int()` as it is considered legacy',
    },
    messages: {
      removeNumber:
        '`z.number().int()` is considered legacy. Use `z.int()` instead.',
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    const { sourceCode } = context;
    const {
      //
      importDeclarationNodeHandler,
      detectZodSchemaRootNode,
      collectZodChainMethods,
    } = trackZodSchemaImports();

    return {
      ImportDeclaration: importDeclarationNodeHandler,
      CallExpression(node): void {
        const zodSchemaMeta = detectZodSchemaRootNode(
          node,
          sourceCode.getAncestors(node),
        );

        if (zodSchemaMeta?.schemaType !== 'number') {
          return;
        }

        // We expect objectNode to be a CallExpression (result of previous chain),
        // but it could be nested; pass the whole CallExpression node for traversal.
        const methods = collectZodChainMethods(node);

        const intMethod = methods.find((it) => it.name === 'int');
        if (!intMethod) {
          return;
        }

        const intNode = intMethod.node;
        // Only report once: ensure we're handling the CallExpression that *is* `.int()`,
        // not a parent call further up the chain (e.g. `.min()`).
        if (intNode !== node) {
          return;
        }
        const numberNode = methods.find((it) => it.name === 'number')!.node;

        if (zodSchemaMeta.importType === 'named') {
          context.report({
            node: intNode,
            messageId: 'removeNumber',
          });
          return;
        }

        context.report({
          node: intNode,
          messageId: 'removeNumber',
          fix(fixer) {
            const numberCallee = numberNode.callee;
            const [start] = numberNode.range;
            const [, end] = node.range;

            // Get the chain prefix (z)
            const prefix = sourceCode.getText(
              (numberCallee as TSESTree.MemberExpression).object,
            );

            // Get the intermediate chain methods by taking everything after number()
            // up to but not including .int()
            const afterNumber = sourceCode.text.slice(numberNode.range[1], end);
            const beforeInt = afterNumber.slice(
              0,
              afterNumber.lastIndexOf('.int()'),
            );

            return fixer.replaceTextRange(
              [start, end],
              `${prefix}.int()${beforeInt}`,
            );
          },
        });
      },
    };
  },
});
