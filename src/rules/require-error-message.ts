import type { TSESTree } from '@typescript-eslint/utils';
import { AST_NODE_TYPES, ESLintUtils } from '@typescript-eslint/utils';

import { getRuleURL } from '../meta.js';
import { trackZodSchemaImports } from '../utils/track-zod-schema-imports.js';

export const requireErrorMessage = ESLintUtils.RuleCreator(getRuleURL)({
  name: 'require-error-message',
  meta: {
    type: 'suggestion',
    fixable: 'code',
    docs: {
      description: 'Enforce that custom refinements include an error message',
    },
    messages: {
      requireErrorMessage: 'Custom refinements must include an error message',
      preferError:
        'Use the "error" property instead of the deprecated "message" property',
      removeMessage: 'The "message" property is deprecated; use "error"',
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

        const refine = collectZodChainMethods(node).find(
          (it) => it.name === 'refine' || it.name === 'custom',
        );

        if (!refine) {
          return;
        }

        const refineNode = refine.node;

        // A valid error message requires 2 arguments; otherwise, it's missing
        if (refineNode.arguments.length < 2) {
          context.report({
            messageId: 'requireErrorMessage',
            node: node.callee,
          });
          return;
        }

        const [, params] = refineNode.arguments;

        // Since the user passes a string, an error message is always included
        if (params.type === AST_NODE_TYPES.Literal) {
          return;
        }

        // If user is providing an object we search for error and message
        if (params.type === AST_NODE_TYPES.ObjectExpression) {
          let errorPropertyNode: TSESTree.Property | undefined;
          let messagePropertyNode: TSESTree.Property | undefined;
          for (const property of params.properties) {
            if (
              property.type === AST_NODE_TYPES.Property &&
              property.key.type === AST_NODE_TYPES.Identifier
            ) {
              if (property.key.name === 'error') {
                errorPropertyNode = property;
              }

              if (property.key.name === 'message') {
                messagePropertyNode = property;
              }

              if (errorPropertyNode && messagePropertyNode) {
                break;
              }
            }
          }

          if (errorPropertyNode && messagePropertyNode) {
            context.report({
              messageId: 'removeMessage',
              node: messagePropertyNode,
              fix: (fixer) => {
                const { sourceCode } = context;
                const nextToken = sourceCode.getTokenAfter(messagePropertyNode);
                let [, end] = messagePropertyNode.range;

                // If there’s a comma after the property, include it
                if (nextToken?.value === ',') {
                  end = nextToken.range[1];
                }

                return fixer.removeRange([messagePropertyNode.range[0], end]);
              },
            });
            return;
          }

          if (messagePropertyNode && !errorPropertyNode) {
            context.report({
              messageId: 'preferError',
              node: params,
              fix: (fixer) =>
                fixer.replaceTextRange(messagePropertyNode.key.range, 'error'),
            });
            return;
          }

          if (!errorPropertyNode) {
            context.report({
              messageId: 'requireErrorMessage',
              node: params,
            });
          }
        }
      },
    };
  },
});
