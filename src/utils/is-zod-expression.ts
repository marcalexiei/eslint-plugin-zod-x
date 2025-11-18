import { AST_NODE_TYPES } from '@typescript-eslint/utils';
import type { TSESTree } from '@typescript-eslint/utils';

/**
 * Type guard that checks whether a given AST {@link node} is a zod member expression
 * ending with the specified property name.
 * Returns `true`
 * - if the {@link node} is a `MemberExpression`,
 * - the chain starts with `z.`
 * - the final property matches {@link propName}.
 */
export function isZodExpressionEndingWithMethod(
  node: TSESTree.Node,
  propName: string,
): node is TSESTree.MemberExpression {
  if (node.type !== AST_NODE_TYPES.MemberExpression) {
    return false;
  }

  // if zod is at the beginning of the chain,
  // check that the prop name is the one we are searching
  if (
    node.property.type === AST_NODE_TYPES.Identifier &&
    node.property.name === propName
  ) {
    return true;
  }

  return false;
}
