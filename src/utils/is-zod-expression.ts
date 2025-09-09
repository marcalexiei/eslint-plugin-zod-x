import { AST_NODE_TYPES } from '@typescript-eslint/utils';
import type { TSESTree } from '@typescript-eslint/utils';

export function isZodIdentifier(
  node: TSESTree.Node,
): node is TSESTree.Identifier {
  return node.type === AST_NODE_TYPES.Identifier && node.name === 'z';
}

function isZodAtTheBeginningOfMemberExpression(
  node: TSESTree.MemberExpression,
): boolean {
  // CHeck if we are at the beginning of the expression and it starts with zod
  if (isZodIdentifier(node.object)) {
    return true;
  }

  // if not continue navigate the member expression
  if (
    node.object.type === AST_NODE_TYPES.CallExpression &&
    node.object.callee.type === AST_NODE_TYPES.MemberExpression
  ) {
    return isZodAtTheBeginningOfMemberExpression(node.object.callee);
  }

  return false;
}

/**
 * Type guard that checks whether a given AST {@link node} is a zod member expression
 * ending with the specified property name.
 * Returns `true`
 * - if the {@link node} is a `MemberExpression`,
 * - the chain starts with `zod`
 * - the final property matches {@link propName}.
 */
export function isZodExpression(
  node: TSESTree.Node,
  propName: string,
): node is TSESTree.MemberExpression {
  if (node.type !== AST_NODE_TYPES.MemberExpression) {
    return false;
  }

  // Ensure that there is zod at the beginning of member expression chain
  if (!isZodAtTheBeginningOfMemberExpression(node)) {
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

/**
 * Check if the given {@link node} is a zod schema declaration like:
 * `z.string` or `z.strictObject` were `string` and `strictObject`
 * are provided as {@link schemaTypeName}
 */
export function isZodSchemaDeclaration(
  node: TSESTree.Expression,
  schemaTypeName: string,
): boolean {
  return (
    node.type === AST_NODE_TYPES.MemberExpression &&
    isZodIdentifier(node.object) &&
    node.property.type === AST_NODE_TYPES.Identifier &&
    node.property.name === schemaTypeName
  );
}
