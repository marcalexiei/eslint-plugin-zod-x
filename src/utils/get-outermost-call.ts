import { AST_NODE_TYPES } from '@typescript-eslint/utils';
import type { TSESTree } from '@typescript-eslint/utils';

/**
 * climb to the OUTERMOST call-expression in a member-call chain
 */
export function getOutermostCall(
  node: TSESTree.Node,
): TSESTree.CallExpression | null {
  let current: TSESTree.Node = node;

  while (
    current.parent &&
    current.parent.type === AST_NODE_TYPES.MemberExpression &&
    current.parent.object === current &&
    current.parent.parent.type === AST_NODE_TYPES.CallExpression
  ) {
    current = current.parent.parent;
  }

  return current.type === AST_NODE_TYPES.CallExpression ? current : null;
}
