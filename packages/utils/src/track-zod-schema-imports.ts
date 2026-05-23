import type { TSESTree } from '@typescript-eslint/utils';
import { AST_NODE_TYPES } from '@typescript-eslint/utils';

import {
  detectZodSchemaRootNode,
  isZodNumberSchemaCallExpression,
} from './detect-zod-schema-root-node.js';
import type { DetectResult } from './detect-zod-schema-root-node.js';
import type { ZodImportScope } from './zod-import-scope.js';

interface ZodChainItem {
  name: string;
  node: TSESTree.CallExpression;
}

export interface ZodSchemaImportTracker {
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
   * Returns true if the given name was imported as a zod namespace
   * (e.g. `import * as z` or `import { z }`).
   * Must be called after `importDeclarationListener` has processed the file's imports.
   */
  isZodNamespace: (name: string) => boolean;

  /**
   * Given a local name used in code, returns the original zod export name, or
   * undefined if the name was not imported from zod as a named import.
   *
   * @example `import { output as ZodOutput } from 'zod'` → getNamedImportOriginal('ZodOutput') === 'output'
   */
  getNamedImportOriginal: (localName: string) => string | undefined;

  /**
   * Given an original zod export name, returns the local name used in code, or
   * undefined if that export was not imported.
   *
   * @example `import { output as ZodOutput } from 'zod'` → getNamedImportLocal('output') === 'ZodOutput'
   */
  getNamedImportLocal: (originalName: string) => string | undefined;

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
  collectZodChainMethods: (node: TSESTree.CallExpression) => Array<ZodChainItem>;

  /**
   * True if `node` is a `z.number()…` (or `number()…`) zod call chain, including inner
   * calls such as the object of `z.number().min(0).isInt`.
   */
  isZodNumberSchemaCallExpression: (node: TSESTree.Node) => boolean;
}

/**
 * Function to create helpers that allow to manage default, namespace and named `zod`
 * imports without too much hassle.
 */
function trackZodSchemaImports(importScope: ZodImportScope): ZodSchemaImportTracker {
  const scope = importScope;
  const zodNamespaces = new Set<string>();
  // localName → original export name
  const zodNamedImports = new Map<string, string>();
  // original export name → localName (last import wins)
  const zodNamedImportsByOriginal = new Map<string, string>();

  function collectZodChainMethods(node: TSESTree.CallExpression): Array<ZodChainItem> {
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

  const result: ZodSchemaImportTracker = {
    // to be inserted into rule.create()
    importDeclarationListener(node): void {
      if (!scope.isAllowed(node.source.value)) {
        return;
      }

      for (const spec of node.specifiers) {
        switch (spec.type) {
          case AST_NODE_TYPES.ImportDefaultSpecifier:
          case AST_NODE_TYPES.ImportNamespaceSpecifier:
            zodNamespaces.add(spec.local.name);
            break;

          case AST_NODE_TYPES.ImportSpecifier: {
            // If the user imports `z` via a named import, it acts as a namespace.
            // Therefore, it must be recorded in the appropriate set.
            // We check the imported identifier because the user may alias it.
            const originalName = 'name' in spec.imported ? spec.imported.name : spec.local.name;

            if (originalName === 'z') {
              zodNamespaces.add(spec.local.name);
            } else {
              zodNamedImports.set(spec.local.name, originalName);
              zodNamedImportsByOriginal.set(originalName, spec.local.name);
            }

            break;
          }

          // no default
        }
      }
    },

    isZodNamespace: (name) => zodNamespaces.has(name),

    getNamedImportOriginal: (localName) => zodNamedImports.get(localName),

    getNamedImportLocal: (originalName) => zodNamedImportsByOriginal.get(originalName),

    detectZodSchemaRootNode: (node) =>
      detectZodSchemaRootNode(node, zodNamespaces, zodNamedImports),

    collectZodChainMethods,

    isZodNumberSchemaCallExpression: (node) =>
      isZodNumberSchemaCallExpression(node, zodNamespaces, zodNamedImports),
  };

  return result;
}

/**
 * Creates a per-rule factory for tracking namespace and named imports from a
 * Zod source. Call `trackZodSchemaImports()` once at the top of `create(...)` to
 * get a fresh tracker for the file being linted, then wire its
 * `importDeclarationListener` into the visitor.
 *
 * The returned tracker exposes:
 * - `importDeclarationListener` — visitor for `ImportDeclaration` nodes
 * - `isZodNamespace(name)` — whether `name` was imported as the `z` namespace
 * - `getNamedImportOriginal(localName)` / `getNamedImportLocal(originalName)` — alias lookups
 * - `detectZodSchemaRootNode(node)` — see {@link detectZodSchemaRootNode}
 * - `collectZodChainMethods(node)` — walks a chain and returns `{ name, node }` items
 * - `isZodNumberSchemaCallExpression(node)` — see {@link isZodNumberSchemaCallExpression}
 *
 * @example
 * ```ts
 * const { trackZodSchemaImports } = createZodSchemaImportTrack(zodImportScope);
 *
 * function create(context) {
 *   const { importDeclarationListener, detectZodSchemaRootNode } = trackZodSchemaImports();
 *   return {
 *     ImportDeclaration: importDeclarationListener,
 *     CallExpression(node) { ... },
 *   };
 * }
 * ```
 */
export function createZodSchemaImportTrack(scope: ZodImportScope): {
  trackZodSchemaImports: () => ReturnType<typeof trackZodSchemaImports>;
} {
  return {
    trackZodSchemaImports: () => trackZodSchemaImports(scope),
  };
}
