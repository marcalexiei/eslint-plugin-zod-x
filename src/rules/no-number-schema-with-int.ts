import type { TSESTree } from '@typescript-eslint/utils';
import { ESLintUtils } from '@typescript-eslint/utils';

import { getRuleURL } from '../meta.js';
import { getOutermostCall } from '../utils/get-outermost-call.js';
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
      importDeclarationListener,
      detectZodSchemaRootNode,
      collectZodChainMethods,
    } = trackZodSchemaImports();

    return {
      ImportDeclaration: importDeclarationListener,

      CallExpression(node): void {
        const outer = getOutermostCall(node) ?? node;

        const zodSchemaMeta = detectZodSchemaRootNode(outer);
        if (!zodSchemaMeta) {
          return;
        }

        // Only care about number schemas
        if (zodSchemaMeta.schemaType !== 'number') {
          return;
        }

        // Collect the full chain from the outermost call (left-to-right)
        const methods = collectZodChainMethods(outer);

        // find number and int positions
        const numberIndex = methods.findIndex((m) => m.name === 'number');
        const intIndex = methods.findIndex((m) => m.name === 'int');

        if (numberIndex === -1 || intIndex === -1) {
          return;
        }

        const numberMethod = methods[numberIndex];
        const intMethod = methods[intIndex];

        // We only report once — when ESLint visits the `.int()` call-expression itself.
        if (node !== intMethod.node) {
          return;
        }

        // If it's a named import usage (e.g. `import { number } from 'zod'`), report but do not fix.
        if (zodSchemaMeta.importType === 'named') {
          context.report({
            node,
            messageId: 'removeNumber',
          });
          return;
        }

        // Namespace import (e.g. z.number()) — prepare a fixer
        context.report({
          node,
          messageId: 'removeNumber',
          fix(fixer) {
            const numberNode = numberMethod.node;
            const intNode = intMethod.node;

            // prefix is the namespace (e.g. "z")
            const numberCallee = numberNode.callee as TSESTree.MemberExpression;
            const prefixObj = numberCallee.object;
            const prefixText = sourceCode.getText(prefixObj);

            // Methods between number and int should be moved after .int()
            // Example: z.number().min(1).int() -> methodsBetween = [min]
            const methodsBetween = methods.slice(numberIndex + 1, intIndex);

            // For each intermediate method, extract only its ".name(args…)" suffix.
            // We do this by taking full text of the call expression and slicing off
            // the text of its callee.object (the part before the dot).
            const betweenSuffixes = methodsBetween.map((m) => {
              // m.node is a CallExpression with MemberExpression callee (e.g. X.min(1))
              const callee = m.node.callee as TSESTree.MemberExpression;
              const objText = sourceCode.getText(callee.object);
              const fullText = sourceCode.getText(m.node);
              return fullText.slice(objText.length); // starts with ".min(...)" or similar
            });

            // Construct replacement text:
            // from `numberNode.range[0]` through `intNode.range[1]` we will replace with:
            // `${prefix}.int()` + betweenSuffixes.join('')
            const replacement = `${prefixText}.int()${betweenSuffixes.join('')}`;

            // Replace the whole span from the start of `z.number()` up to the end of `.int()`.
            return fixer.replaceTextRange(
              [numberNode.range[0], intNode.range[1]],
              replacement,
            );
          },
        });
      },
    };
  },
});
