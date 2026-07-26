import type { TSESLint, TSESTree } from '@typescript-eslint/utils';
import { AST_NODE_TYPES } from '@typescript-eslint/utils';

import { collectZodSchemaConstraints } from './collect-zod-schema-constraints.js';
import type { ZodSchemaConstraint } from './collect-zod-schema-constraints.js';
import { detectZodSchemaRootNode, isZodSchemaOfType } from './detect-zod-schema-root-node.js';
import type { ZodImports, ZodSchemaMeta } from './detect-zod-schema-root-node.js';
import type { ZodImportScope } from './zod-import-scope.js';

/** One call in a zod chain: the method's name and the call expression carrying it. */
export interface ZodChainItem {
  name: string;
  node: TSESTree.CallExpression;
}

/** Options for {@link ZodSchemaImportTracker.createSchemaVisitor}. */
export interface ZodSchemaVisitorOptions<TSchemaType extends string> {
  /**
   * Only run `onSchema` for these factories — one name (`'string'`) or a list
   * (`ZOD_OBJECT_METHODS`). Omit to receive every zod schema.
   */
  schemaType?: TSchemaType | ReadonlyArray<TSchemaType>;

  /** Called with each matching schema root and its detection metadata. */
  onSchema: (
    node: TSESTree.CallExpression,
    meta: ZodSchemaMeta & { schemaType: TSchemaType },
  ) => void;
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
   * Builds the `{ ImportDeclaration, CallExpression }` visitor almost every
   * rule needs: it wires `importDeclarationListener`, detects the schema root
   * and applies the `schemaType` filter, so `onSchema` only sees matches.
   *
   * Prefer this over hand-wiring the two listeners — forgetting
   * `ImportDeclaration` silently disables detection for the whole file.
   * Spread it to add more visitor keys.
   *
   * @example
   * ```ts
   * return tracker.createSchemaVisitor({
   *   schemaType: 'string',
   *   onSchema(node, meta) { ... },
   * });
   * ```
   */
  createSchemaVisitor: <TSchemaType extends string = string>(
    options: ZodSchemaVisitorOptions<TSchemaType>,
  ) => TSESLint.RuleListener;

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
  detectZodSchemaRootNode: (node: TSESTree.Node) => ZodSchemaMeta | null;

  /**
   * Walks up a chain of method calls and returns each call with its node.
   * Use this over `detectZodSchemaRootNode(...).methods` when the nodes are
   * needed: it only names plain-identifier properties, so every item is safe
   * to rewrite, while `methods` also covers computed members (`z['uuid']()`).
   *
   * Returns an empty array if the expression isn't a navigable zod chain.
   */
  collectZodChainMethods: (node: TSESTree.CallExpression) => Array<ZodChainItem>;

  /**
   * Flattens a zod call chain into the constraints applied to the schema,
   * seen uniformly across API styles: chained methods (`z.string().min(2)`,
   * `zod`) become `chained` constraints, recognized zod calls among
   * `.check(...)` arguments (`z.string().check(z.minLength(2))`, `zod/mini`)
   * become `check-argument` constraints.
   */
  collectZodSchemaConstraints: (node: TSESTree.CallExpression) => Array<ZodSchemaConstraint>;

  /**
   * True if `node` is a zod call chain built from `schemaType`, including inner
   * calls such as the object of `z.number().min(0).isInt`.
   */
  isZodSchemaOfType: (node: TSESTree.Node, schemaType: string) => boolean;
}

/**
 * Creates a tracker for one file, scoped to `importScope`. Rules normally
 * reach it through {@link ZodImportScope.createTracker}.
 */
export function trackZodSchemaImports(scope: ZodImportScope): ZodSchemaImportTracker {
  const imports: ZodImports = {
    namespaces: new Set<string>(),
    // localName → original export name
    named: new Map<string, string>(),
  };
  // original export name → localName (last import wins)
  const zodNamedImportsByOriginal = new Map<string, string>();

  // Safe to cache: the walk is purely syntactic and never reads the import
  // maps, which keep filling up as `ImportDeclaration` nodes are visited.
  const chainCache = new WeakMap<TSESTree.CallExpression, Array<ZodChainItem>>();

  function collectZodChainMethods(node: TSESTree.CallExpression): Array<ZodChainItem> {
    const cached = chainCache.get(node);
    if (cached) {
      return cached;
    }

    const methods: Array<ZodChainItem> = [];
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

    chainCache.set(node, methods);
    return methods;
  }

  // to be inserted into rule.create()
  function importDeclarationListener(node: TSESTree.ImportDeclaration): void {
    if (!scope.isAllowed(node.source.value)) {
      return;
    }

    for (const spec of node.specifiers) {
      switch (spec.type) {
        case AST_NODE_TYPES.ImportDefaultSpecifier:
        case AST_NODE_TYPES.ImportNamespaceSpecifier:
          imports.namespaces.add(spec.local.name);
          break;

        case AST_NODE_TYPES.ImportSpecifier: {
          // If the user imports `z` via a named import, it acts as a namespace.
          // Therefore, it must be recorded in the appropriate set.
          // We check the imported identifier because the user may alias it.
          const originalName = 'name' in spec.imported ? spec.imported.name : spec.local.name;

          if (originalName === 'z') {
            imports.namespaces.add(spec.local.name);
          } else {
            imports.named.set(spec.local.name, originalName);
            zodNamedImportsByOriginal.set(originalName, spec.local.name);
          }

          break;
        }

        // no default
      }
    }
  }

  const result: ZodSchemaImportTracker = {
    importDeclarationListener,

    createSchemaVisitor<TSchemaType extends string>({
      schemaType,
      onSchema,
    }: ZodSchemaVisitorOptions<TSchemaType>): TSESLint.RuleListener {
      const allowed: ReadonlyArray<string> | undefined =
        typeof schemaType === 'string' ? [schemaType] : schemaType;

      return {
        ImportDeclaration: importDeclarationListener,
        CallExpression(node): void {
          const meta = detectZodSchemaRootNode(node, imports);
          if (!meta) {
            return;
          }
          if (allowed && !allowed.includes(meta.schemaType)) {
            return;
          }
          // `includes` cannot narrow, and with no filter `TSchemaType` is `string`.
          onSchema(node, meta as ZodSchemaMeta & { schemaType: TSchemaType });
        },
      };
    },

    isZodNamespace: (name) => imports.namespaces.has(name),

    getNamedImportOriginal: (localName) => imports.named.get(localName),

    getNamedImportLocal: (originalName) => zodNamedImportsByOriginal.get(originalName),

    detectZodSchemaRootNode: (node) => detectZodSchemaRootNode(node, imports),

    collectZodChainMethods,

    collectZodSchemaConstraints: (node) =>
      collectZodSchemaConstraints({
        methods: collectZodChainMethods(node),
        detectZodSchemaRootNode: (argument) => detectZodSchemaRootNode(argument, imports),
      }),

    isZodSchemaOfType: (node, schemaType) => isZodSchemaOfType(node, schemaType, imports),
  };

  return result;
}
