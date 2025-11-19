/* eslint-disable no-continue */
import type { TSESTree } from '@typescript-eslint/utils';
import { AST_NODE_TYPES } from '@typescript-eslint/utils';

interface ZodChainItem {
  name: string;
  node: TSESTree.CallExpression;
}

interface DetectZodSchemaResult {
  importType: 'namespace' | 'named';
  schemaType: string;
}

interface Result {
  /**
   * Add this handler to your `ImportDeclaration` node visitor to allow tracking of `zod` imports
   *
   * @example
   * ```ts
   * const { importDeclarationNodeHandler } = trackZodSchemaImports();
   *
   * return {
   *   ImportDeclaration: importDeclarationNodeHandler,
   * }
   * ```
   */
  importDeclarationNodeHandler: (node: TSESTree.ImportDeclaration) => void;

  /**
   * Check if given node is a zod schema
   */
  detectZodSchemaRootNode: (
    node: TSESTree.Node,
    ancestors?: Array<TSESTree.Node>,
  ) => null | DetectZodSchemaResult;

  /**
   * Recursively walks up a chain of method calls to collect all method names
   * in a zod expression.
   *
   * Returns an empty array if the expression isn't a zod chain.
   */
  collectZodChainMethods: (node: TSESTree.Node) => Array<ZodChainItem>;
}

/**
 * Function to create helpers that allow to manage default, namespace and named `zod`
 * imports without too much hassle.
 */
export function trackZodSchemaImports(): Result {
  const zodNamespaces = new Set<string>();
  const zodNamedImports = new Set<string>();

  const detectZodSchemaRootNode: Result['detectZodSchemaRootNode'] = (node) => {
    // If ancestors contain another CallExpression, this node is nested -> not the outermost
    // if (ancestors.some((a) => a.type === AST_NODE_TYPES.CallExpression)) {
    //   return null;
    // }

    // We expect to start from a CallExpression (outermost call)
    if (node.type !== AST_NODE_TYPES.CallExpression) {
      return null;
    }

    // Start from the callee and walk left/down the chain to collect member expressions
    let cur: TSESTree.Node = node.callee;

    // Helper: get the "property name" safely from a MemberExpression.property
    const getPropertyName = (
      prop: TSESTree.Expression | TSESTree.PrivateIdentifier | undefined,
    ): string | null => {
      if (!prop) {
        return null;
      }
      // .property can be Identifier or Literal (if computed like z['object'])
      if (prop.type === AST_NODE_TYPES.Identifier) {
        return prop.name;
      }
      if (prop.type === AST_NODE_TYPES.Literal) {
        return String(prop.value);
      }
      return null;
    };

    // Collect the member-expression chain (leftwards) and the final identifier if present
    // e.g. for z.object().array() we want to find the MemberExpression whose object is Identifier 'z'
    const memberChain: Array<TSESTree.Node> = [];

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    while (true) {
      if (cur.type === AST_NODE_TYPES.CallExpression) {
        // unwrap call: e.g. (z.object()) .array -> go into the callee z.object
        cur = cur.callee;
        continue;
      }
      if (cur.type === AST_NODE_TYPES.MemberExpression) {
        memberChain.push(cur);
        cur = (cur as TSESTree.MemberExpression).object;
        continue;
      }
      // now cur might be an Identifier or something else
      if (cur.type === AST_NODE_TYPES.Identifier) {
        memberChain.push(cur);
      }
      break;
    }

    // 1) Try to find a MemberExpression where object is an Identifier that matches a zod namespace
    for (const m of memberChain) {
      if (m.type !== AST_NODE_TYPES.MemberExpression) {
        continue;
      }
      const mem = m as TSESTree.MemberExpression;
      if (
        mem.object.type === AST_NODE_TYPES.Identifier &&
        zodNamespaces.has(mem.object.name)
      ) {
        const schemaType = getPropertyName(mem.property);
        if (!schemaType) {
          return null;
        }
        return {
          importType: 'namespace' as const,
          schemaType,
        };
      }
    }

    // 2) If no namespace found, check if the final leftmost Identifier is a named zod import:
    const leftmost = memberChain.at(-1);
    if (
      leftmost?.type === AST_NODE_TYPES.Identifier &&
      zodNamedImports.has(leftmost.name)
    ) {
      return {
        importType: 'named' as const,
        schemaType: leftmost.name,
      };
    }

    return null;
  };

  const collectZodChainMethods: Result['collectZodChainMethods'] = (node) => {
    if (node.type !== AST_NODE_TYPES.CallExpression) {
      return [];
    }

    const methods: Array<ZodChainItem> = [];

    // Member-expression chains: z.number().int()
    if (node.callee.type === AST_NODE_TYPES.MemberExpression) {
      const { callee } = node;
      if (callee.property.type === AST_NODE_TYPES.Identifier) {
        methods.push({ name: callee.property.name, node });
      }
      if (callee.object.type === AST_NODE_TYPES.CallExpression) {
        methods.push(...collectZodChainMethods(callee.object));
      }
      return methods;
    }

    // Named-import call: number().int()
    if (
      node.callee.type === AST_NODE_TYPES.Identifier &&
      zodNamedImports.has(node.callee.name)
    ) {
      methods.push({ name: node.callee.name, node });
    }

    return methods;
  };

  const result: Result = {
    // to be inserted into rule.create()
    importDeclarationNodeHandler(node): void {
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

    detectZodSchemaRootNode,

    collectZodChainMethods,
  };

  return result;
}
