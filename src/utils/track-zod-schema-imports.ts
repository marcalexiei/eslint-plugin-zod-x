import type { TSESTree } from '@typescript-eslint/utils';
import { AST_NODE_TYPES } from '@typescript-eslint/utils';

import { detectZodSchemaRootNode } from './detect-zod-schema-root-node.js';
import type { DetectResult } from './detect-zod-schema-root-node.js';

interface ZodChainItem {
  name: string;
  node: TSESTree.CallExpression;
}

interface Result {
  /**
   * Add this handler to your `ImportDeclaration` node visitor to allow tracking of `zod` imports
   *
   * @example
   * ```ts
   * const { importDeclarationListener } = trackZodSchemaImports();
   *
   * return {
   *   ImportDeclaration: importDeclarationListener,
   * }
   * ```
   */
  importDeclarationListener: (node: TSESTree.ImportDeclaration) => void;

  /**
   * Check if given node is a zod schema
   */
  detectZodSchemaRootNode: (node: TSESTree.Node) => null | DetectResult;

  /**
   * Recursively walks up a chain of method calls to collect all method names
   * in a zod expression.
   *
   * Returns an empty array if the expression isn't a zod chain.
   */
  collectZodChainMethods: (
    node: TSESTree.CallExpression,
  ) => Array<ZodChainItem>;
}

/**
 * Function to create helpers that allow to manage default, namespace and named `zod`
 * imports without too much hassle.
 */
export function trackZodSchemaImports(): Result {
  const zodNamespaces = new Set<string>();
  const zodNamedImports = new Set<string>();

  function collectZodChainMethods(
    node: TSESTree.CallExpression,
  ): Array<ZodChainItem> {
    const methods: Array<{ name: string; node: TSESTree.CallExpression }> = [];
    let current: TSESTree.Expression | null = node;

    while (current.type === AST_NODE_TYPES.CallExpression) {
      const { callee } = current as { callee: TSESTree.Expression };

      // Match: z.number(), z.int(), z.min(), etc.
      if (
        callee.type === AST_NODE_TYPES.MemberExpression &&
        callee.property.type === AST_NODE_TYPES.Identifier
      ) {
        methods.unshift({
          name: callee.property.name,
          node: current,
        });

        current = callee.object;
        // eslint-disable-next-line no-continue
        continue;
      }

      // Match named import: number(), int(), etc.
      if (callee.type === AST_NODE_TYPES.Identifier) {
        methods.unshift({
          name: callee.name,
          node: current,
        });

        break;
      }

      break;
    }

    return methods;
  }

  const result: Result = {
    // to be inserted into rule.create()
    importDeclarationListener(node): void {
      if (
        node.source.value !== 'zod' &&
        !node.source.value.startsWith('zod/')
      ) {
        return;
      }

      for (const spec of node.specifiers) {
        switch (spec.type) {
          case AST_NODE_TYPES.ImportDefaultSpecifier:
          case AST_NODE_TYPES.ImportNamespaceSpecifier:
            zodNamespaces.add(spec.local.name);
            break;

          case AST_NODE_TYPES.ImportSpecifier:
            zodNamedImports.add(spec.local.name);
            break;

          // no default
        }
      }
    },

    detectZodSchemaRootNode: (node) =>
      detectZodSchemaRootNode(node, zodNamespaces, zodNamedImports),

    collectZodChainMethods,
  };

  return result;
}
