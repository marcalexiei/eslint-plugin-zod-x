import { AST_NODE_TYPES } from '@typescript-eslint/utils';
import type { TSESTree } from '@typescript-eslint/utils';

import { isZodAtTheBeginningOfMemberExpression } from './is-zod-expression.js';

/**
 * Recursively walks up a chain of method calls to collect all method names
 * in a zod expression.
 *
 * Returns an empty array if the expression isn't a zod chain.
 */
export function collectZodChainMethods(
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

  const methods: Array<{ name: string; node: TSESTree.CallExpression }> = [];

  // Add current method if it's an identifier
  if (callee.property.type === AST_NODE_TYPES.Identifier) {
    methods.push({ name: callee.property.name, node });
  }

  // Recursively collect methods from the object (previous part of the chain)
  if (callee.object.type === AST_NODE_TYPES.CallExpression) {
    methods.push(...collectZodChainMethods(callee.object));
  }

  return methods;
}
