import type { TSESTree } from '@typescript-eslint/utils';
import { AST_NODE_TYPES } from '@typescript-eslint/utils';

interface DetectData {
  /**
   * How the schema is declared:
   * - `namespace` -> `z.string()`
   * - `named` -> `string()`
   */
  schemaDecl: 'namespace' | 'named';

  /** the "factory" for the outer expression */
  schemaType: string;

  /** full chain in call order, e.g. ["number", "int", "min"] */
  methods: Array<string>;

  /** the outer call expression analyzed */
  node: TSESTree.CallExpression;
}

/**
 * Return type: includes outer schema info and any inner schema infos extracted
 * from arguments (useful for array(string()), union([a(), b()]) etc).
 */
export type DetectResult =
  | (DetectData & {
      // innerSchemas: Array<{
      //   schemaDecl: 'namespace' | 'named';
      //   schemaType: string;
      //   methods: Array<string>;
      //   node: TSESTree.CallExpression;
      // }>;
    })
  | null;

/**
 * Helper: extract static property names (Identifier | Literal | simple template literal)
 */
function getPropertyName(
  prop: TSESTree.Expression | TSESTree.PrivateIdentifier | undefined,
): string | null {
  if (!prop) {
    return null;
  }
  if (prop.type === AST_NODE_TYPES.Identifier) {
    return prop.name;
  }
  if (prop.type === AST_NODE_TYPES.Literal) {
    return prop.value == null ? null : String(prop.value);
  }
  if (prop.type === AST_NODE_TYPES.TemplateLiteral) {
    if (prop.expressions.length === 0 && prop.quasis.length === 1) {
      return prop.quasis[0].value.cooked;
    }
    return null;
  }
  return null;
}

/** Quick check: only process outermost call in a chain */
function isOutermostCallExpression(node: TSESTree.CallExpression): boolean {
  const { parent } = node;

  // If parent is CallExpression and parent.callee === node => this node is inner
  if (parent.type === AST_NODE_TYPES.CallExpression && parent.callee === node) {
    return false;
  }

  // If parent is MemberExpression and parent.object === node => node is part of chain
  if (parent.type === AST_NODE_TYPES.MemberExpression && parent.object === node) {
    return false;
  }

  return true;
}

/**
 * Parse a CallExpression to detect whether it's a zod schema expression (namespace or named).
 * This helper DOES NOT require the call to be outermost.
 *
 * Returns:
 *  { schemaDecl, schemaType, methods, node } if successful
 *  null otherwise
 */
function parseZodCallExpression(
  call: TSESTree.CallExpression,
  zodNamespaces: Set<string>,
  zodNamedImports: Map<string, string>,
): {
  schemaDecl: 'namespace' | 'named';
  schemaType: string;
  methods: Array<string>;
  node: TSESTree.CallExpression;
} | null {
  let cur: TSESTree.Node = call.callee;

  // Collect names in right-to-left order, then reverse at the end
  const methodsRightToLeft: Array<string> = [];
  // eslint-disable-next-line no-useless-assignment
  let leftmostIdentifier: string | null = null;

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  while (true) {
    if (cur.type === AST_NODE_TYPES.CallExpression) {
      // unwrap: foo().bar -> go into callee
      cur = cur.callee;
      continue;
    }

    if (cur.type === AST_NODE_TYPES.MemberExpression) {
      const name = getPropertyName(cur.property);
      if (!name) {
        return null;
      } // dynamic/computed property — can't reason
      methodsRightToLeft.push(name);
      cur = cur.object;
      continue;
    }

    if (cur.type === AST_NODE_TYPES.Identifier) {
      leftmostIdentifier = cur.name;
      break;
    }

    // unsupported left shape (e.g. complex expression) — bail
    return null;
  }

  const methods = methodsRightToLeft.slice().reverse(); // left -> right order

  if (!leftmostIdentifier) {
    return null;
  }

  // Namespace style: z.number().int()
  if (zodNamespaces.has(leftmostIdentifier)) {
    // the factory for namespace style is typically the first method
    const factory = methods[0] ?? null;
    if (!factory) {
      return null;
    }
    return {
      schemaDecl: 'namespace',
      schemaType: factory,
      methods,
      node: call,
    };
  }

  // Named import style: number().int() or array(...)
  if (zodNamedImports.has(leftmostIdentifier)) {
    // prettier-ignore
    const factory = zodNamedImports.get(leftmostIdentifier) ?? leftmostIdentifier;
    return {
      schemaDecl: 'named',
      schemaType: factory,
      methods,
      node: call,
    };
  }

  return null;
}

/**
 * True when `node` is a zod number schema call chain (e.g. `z.number().min(1)`) or `number().min(1)`.
 * Used for member access like `z.number().isInt` where the call is not the outermost expression
 * in the file (so {@link detectZodSchemaRootNode} does not apply).
 */
export function isZodNumberSchemaCallExpression(
  node: TSESTree.Node,
  zodNamespaces: Set<string>,
  zodNamedImports: Map<string, string>,
): boolean {
  if (node.type !== AST_NODE_TYPES.CallExpression) {
    return false;
  }
  const parsed = parseZodCallExpression(node, zodNamespaces, zodNamedImports);
  return parsed !== null && parsed.schemaType === 'number';
}

/** Examine an expression (argument) for zod schema CallExpressions.
 * Supports:
 *  - direct CallExpression (string(), z.string(), etc)
 *  - ArrayExpression where elements may be CallExpressions (e.g. union([a(), b()]))
 *
 * Returns list of parsed inner schema infos (may be empty).
 */
// function extractInnerSchemasFromExpression(
//   expr: TSESTree.Expression,
//   zodNamespaces: Set<string>,
//   zodNamedImports: Set<string>,
// ): Array<DetectData> {
//   const found: Array<DetectData> = [];

//   if (expr.type === AST_NODE_TYPES.CallExpression) {
//     const parsed = parseZodCallExpression(expr, zodNamespaces, zodNamedImports);
//     if (parsed) {
//       found.push(parsed);
//     }
//     return found;
//   }

//   if (expr.type === AST_NODE_TYPES.ArrayExpression) {
//     for (const el of expr.elements) {
//       if (!el) {
//         continue;
//       }
//       if (el.type === AST_NODE_TYPES.CallExpression) {
//         const parsed = parseZodCallExpression(
//           el,
//           zodNamespaces,
//           zodNamedImports,
//         );
//         if (parsed) {
//           found.push(parsed);
//         }
//       }
//       // nested arrays or nested structures are intentionally not deeply recursed beyond array elements;
//       // add more recursion if needed for your codebase.
//     }
//     return found;
//   }

//   // If it's an Identifier, MemberExpression, or other, there's nothing to extract here.
//   return found;
// }

/**
 * Finds the outermost Zod call expression in a chain and returns metadata about it
 * (declaration style, factory name, methods, AST node). Includes calls in argument
 * position (e.g. inside `.check(...)`), so a standalone check call is treated as the
 * root of its own expression.
 *
 * Returns `null` if the node is not a Zod schema call or not the outermost call in its chain.
 *
 * @param node - The AST node to analyze (typically a `CallExpression` from an ESLint visitor)
 * @param zodNamespaces - Local names of `z` namespace imports (e.g. `new Set(['z'])`)
 * @param zodNamedImports - Map of local name → original Zod export name (e.g. `'string' -> 'string'`)
 */
export function detectZodSchemaRootNode(
  node: TSESTree.Node,
  zodNamespaces: Set<string>,
  zodNamedImports: Map<string, string>,
): DetectResult {
  if (node.type !== AST_NODE_TYPES.CallExpression) {
    return null;
  }
  const call = node;

  // Only process the *outermost* call expression for this chain
  if (!isOutermostCallExpression(call)) {
    return null;
  }

  // Parse the outer call expression into zod schema info
  const outer = parseZodCallExpression(call, zodNamespaces, zodNamedImports);
  if (!outer) {
    return null;
  }

  // Extract inner schema(s) from the arguments (if any)
  // const innerSchemas: Array<DetectResult> = [];

  // for (const arg of call.arguments) {
  //   if (arg.type === AST_NODE_TYPES.SpreadElement) {
  //     // skip spread for now; cannot safely reason
  //     continue;
  //   }
  //   // Only expressions are supported here
  //   if (arg.type === AST_NODE_TYPES.Expression) {
  //     const inner = extractInnerSchemasFromExpression(
  //       arg,
  //       zodNamespaces,
  //       zodNamedImports,
  //     );
  //     for (const i of inner) {
  //       innerSchemas.push(i);
  //     }
  //   }
  // }

  return {
    schemaDecl: outer.schemaDecl,
    schemaType: outer.schemaType,
    methods: outer.methods,
    node: call,
    // innerSchemas,
  };
}
