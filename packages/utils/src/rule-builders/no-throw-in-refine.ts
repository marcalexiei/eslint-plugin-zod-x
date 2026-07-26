import type { TSESLint, TSESTree } from '@typescript-eslint/utils';
import { AST_NODE_TYPES } from '@typescript-eslint/utils';

import type { ZodImportScope } from '../zod-import-scope.js';

type MessageIds = 'noThrowInRefine';

export function buildNoThrowInRefineCreate(
  scope: ZodImportScope,
): (context: Readonly<TSESLint.RuleContext<MessageIds, []>>) => TSESLint.RuleListener {
  return function create(context) {
    const { importDeclarationListener, detectZodSchemaRootNode, collectZodChainMethods } =
      scope.createTracker();

    function checkNode(node: TSESTree.Node): void {
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
          break;
        // `BlockStatement` is the only statement carrying a list of statements,
        // and it has its own case above — nothing else to descend into.
        // no default
      }
    }

    return {
      ImportDeclaration: importDeclarationListener,
      CallExpression(node): void {
        const zodSchemaMeta = detectZodSchemaRootNode(node);

        if (!zodSchemaMeta) {
          return;
        }

        const refineMethod = collectZodChainMethods(node).find((it) => it.name === 'refine');

        if (!refineMethod) {
          return;
        }

        const [callback] = refineMethod.node.arguments;
        if (
          callback.type === AST_NODE_TYPES.ArrowFunctionExpression ||
          callback.type === AST_NODE_TYPES.FunctionExpression
        ) {
          checkNode(callback.body);
        }
      },
    };
  };
}
