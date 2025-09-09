import { AST_NODE_TYPES, ESLintUtils } from '@typescript-eslint/utils';
import type { TSESTree } from '@typescript-eslint/utils';

import { getRuleURL } from '../meta.js';
import { isZodExpression } from '../utils/is-zod-expression.js';

export const noThrowInRefine = ESLintUtils.RuleCreator(getRuleURL)({
  name: 'no-throw-in-refine',
  meta: {
    type: 'problem',
    docs: {
      description:
        'Disallow throwing errors directly inside Zod refine callbacks',
    },
    messages: {
      noThrowInRefine:
        'Do not throw errors directly inside a z.refine callback.',
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    function checkNode(node: TSESTree.Node | null): void {
      if (!node) {
        return;
      }

      switch (node.type) {
        case AST_NODE_TYPES.ThrowStatement:
          context.report({ node, messageId: 'noThrowInRefine' });
          break;
        case AST_NODE_TYPES.BlockStatement:
          node.body.forEach(checkNode);
          break;
        case AST_NODE_TYPES.IfStatement:
          checkNode(node.consequent);
          if (node.alternate) {
            checkNode(node.alternate);
          }
          break;
        case AST_NODE_TYPES.ForStatement:
        case AST_NODE_TYPES.ForInStatement:
        case AST_NODE_TYPES.ForOfStatement:
        case AST_NODE_TYPES.WhileStatement:
        case AST_NODE_TYPES.DoWhileStatement:
          checkNode(node.body);
          break;
        case AST_NODE_TYPES.TryStatement:
          checkNode(node.block);
          if (node.handler) {
            checkNode(node.handler.body);
          }
          if (node.finalizer) {
            checkNode(node.finalizer);
          }
          break;
        // Ignore nested functions
        case AST_NODE_TYPES.FunctionExpression:
        case AST_NODE_TYPES.ArrowFunctionExpression:
        case AST_NODE_TYPES.FunctionDeclaration:
          return;
        default:
          if ('body' in node && Array.isArray(node.body)) {
            node.body.forEach(checkNode);
          }
          break;
      }
    }

    return {
      CallExpression(node): void {
        if (isZodExpression(node.callee, 'refine')) {
          const [callback] = node.arguments;
          if (
            callback.type === AST_NODE_TYPES.ArrowFunctionExpression ||
            callback.type === AST_NODE_TYPES.FunctionExpression
          ) {
            checkNode(callback.body);
          }
        }
      },
    };
  },
});
