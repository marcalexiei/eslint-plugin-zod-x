import { AST_NODE_TYPES } from '@typescript-eslint/utils';
import type { TSESTree } from '@typescript-eslint/utils';

export function isZodExpression(
  node: TSESTree.Node,
): node is TSESTree.MemberExpression {
  if (node.type !== AST_NODE_TYPES.MemberExpression) {
    return false;
  }

  // Check if expression starts with z.
  if (
    node.object.type === AST_NODE_TYPES.Identifier &&
    node.object.name === 'z'
  ) {
    return true;
  }

  // For chained calls: z.number().min(0).refine(...)
  if (
    node.object.type === AST_NODE_TYPES.CallExpression &&
    node.object.callee.type === AST_NODE_TYPES.MemberExpression
  ) {
    return isZodExpression(node.object.callee);
  }

  return false;
}
