import { AST_NODE_TYPES, ESLintUtils } from '@typescript-eslint/utils';
import type { TSESTree, TSESLint } from '@typescript-eslint/utils';

import { getRuleURL } from '../meta.js';
import { isZodAtTheBeginningOfMemberExpression } from '../utils/is-zod-expression.js';

interface Options {
  preferredMethod: 'none' | 'default' | 'optional';
}
type MessageIds = 'noOptionalAndDefaultTogether';

const defaultOptions: Options = { preferredMethod: 'none' };

export const noOptionalAndDefaultTogether = ESLintUtils.RuleCreator(getRuleURL)<
  [Options],
  MessageIds
>({
  name: 'no-optional-and-default-together',
  meta: {
    type: 'problem',
    fixable: 'code',
    docs: {
      description:
        'Disallow using both `.optional()` and `.default()` on the same Zod schema',
    },
    messages: {
      noOptionalAndDefaultTogether:
        'Using both `.optional()` and `.default()` is redundant. A schema with a default value is already optional.',
    },
    schema: [
      {
        type: 'object',
        properties: {
          preferredMethod: {
            description:
              'Determines which method to keep when both are present',
            type: 'string',
            enum: ['none', 'default', 'optional'],
          },
        },
        additionalProperties: false,
      },
    ],
  },
  defaultOptions: [defaultOptions],
  create(context, [{ preferredMethod }]) {
    const { sourceCode } = context;

    /**
     * Recursively walks up a chain of method calls to collect all method names
     */
    function collectMethodsInChain(
      node: TSESTree.Node,
    ): Array<{ name: string; node: TSESTree.CallExpression }> {
      if (node.type !== AST_NODE_TYPES.CallExpression) {
        return [];
      }

      const { callee } = node;
      if (callee.type !== AST_NODE_TYPES.MemberExpression) {
        return [];
      }

      // Check if this is a zod expression
      if (!isZodAtTheBeginningOfMemberExpression(callee)) {
        return [];
      }

      const methods: Array<{ name: string; node: TSESTree.CallExpression }> =
        [];

      // Add current method if it's an identifier
      if (callee.property.type === AST_NODE_TYPES.Identifier) {
        methods.push({ name: callee.property.name, node });
      }

      // Recursively collect methods from the object (previous part of the chain)
      if (callee.object.type === AST_NODE_TYPES.CallExpression) {
        methods.push(...collectMethodsInChain(callee.object));
      }

      return methods;
    }

    return {
      CallExpression(node): void {
        const { callee } = node;

        if (callee.type !== AST_NODE_TYPES.MemberExpression) {
          return;
        }

        // Only check if this is a zod expression
        if (!isZodAtTheBeginningOfMemberExpression(callee)) {
          return;
        }

        // Collect all methods in the chain
        const methods = collectMethodsInChain(node);
        const methodNames = methods.map((m) => m.name);

        // Check if both optional and default are present
        const hasOptional = methodNames.includes('optional');
        const hasDefault = methodNames.includes('default');

        if (hasOptional && hasDefault) {
          const optionalMethod = methods.find((m) => m.name === 'optional');
          const defaultMethod = methods.find((m) => m.name === 'default');

          if (!optionalMethod || !defaultMethod) {
            return;
          }

          // Determine which node to report on (the one that appears later in the chain)
          const reportNode =
            methods.indexOf(optionalMethod) > methods.indexOf(defaultMethod)
              ? optionalMethod.node
              : defaultMethod.node;

          context.report({
            node: reportNode,
            messageId: 'noOptionalAndDefaultTogether',
            fix:
              preferredMethod === 'none'
                ? undefined
                : (fixer): TSESLint.RuleFix => {
                    // Determine which method to remove
                    const nodeToRemove =
                      preferredMethod === 'default'
                        ? optionalMethod.node
                        : defaultMethod.node;

                    // Get the callee of the node to remove
                    const calleeToRemove =
                      nodeToRemove.callee as TSESTree.MemberExpression;

                    // Replace the entire call expression with just its object
                    return fixer.replaceText(
                      nodeToRemove,
                      sourceCode.getText(calleeToRemove.object),
                    );
                  },
          });
        }
      },
    };
  },
});
