import type { TSESLint, TSESTree } from '@typescript-eslint/utils';
import { AST_NODE_TYPES } from '@typescript-eslint/utils';

import { createZodSchemaImportTrack } from '../track-zod-schema-imports.js';
import type { ZodSchemaImportTracker } from '../track-zod-schema-imports.js';
import type { ZodImportScope } from '../zod-import-scope.js';

type MessageIds = 'preferTuple';

/** The kind of length constraint applied to a `z.array(...)` schema. */
export type LengthConstraintKind = 'length' | 'min' | 'max';

/** Subset of the import tracker passed to {@link PreferTupleOverArrayLengthOptions.findLengthConstraint}. */
export type FindLengthConstraintHelpers = Pick<
  ZodSchemaImportTracker,
  'detectZodSchemaRootNode' | 'collectZodChainMethods'
>;

export interface FoundLengthConstraint {
  /** Which kind of length constraint was found on the array schema. */
  kind: LengthConstraintKind;

  /**
   * For `kind: 'length'`, the AST node of the count argument (e.g. the `2` in
   * `.length(2)`); the builder validates it is a non-negative integer literal
   * before autofixing. `null` for `min`/`max` (report-only, no autofix).
   */
  countArgument: TSESTree.Node | null;

  /**
   * Removes the length constraint from the chain as part of the autofix, or
   * returns `null` to signal it cannot be removed safely (report-only).
   */
  buildRemoveFix: (fixer: TSESLint.RuleFixer) => TSESLint.RuleFix | null;
}

export interface PreferTupleOverArrayLengthOptions {
  /**
   * Strategy that inspects an array schema chain and returns the length
   * constraint to flag (or `null` if none is present). Plugins use this to
   * encode the API-specific way they express length constraints: chained
   * `.length()`/`.min()`/`.max()` for `eslint-plugin-zod`, standalone
   * `.check(z.length()/z.minLength()/z.maxLength())` for `eslint-plugin-zod-mini`.
   */
  findLengthConstraint: (
    schemaRootNode: TSESTree.CallExpression,
    helpers: FindLengthConstraintHelpers,
  ) => FoundLengthConstraint | null;
}

/** Reads a non-negative integer literal, or `null` when the node isn't one. */
function readIntegerLiteralValue(node: TSESTree.Node | null): number | null {
  if (node?.type !== AST_NODE_TYPES.Literal) {
    return null;
  }

  const { value } = node;
  if (typeof value !== 'number' || !Number.isInteger(value) || value < 0) {
    return null;
  }

  return value;
}

/**
 * Builds the `create` function for the `prefer-tuple-over-array-length` rule.
 *
 * Owns the shared scaffolding — import tracking, the `ImportDeclaration`
 * listener, `z.array()` detection, the `z.tuple([...])` autofix construction,
 * and the `context.report` call — and delegates length-constraint detection
 * and removal to `options.findLengthConstraint`.
 */
export function buildPreferTupleOverArrayLengthCreate(
  scope: ZodImportScope,
  options: PreferTupleOverArrayLengthOptions,
): (context: Readonly<TSESLint.RuleContext<MessageIds, []>>) => TSESLint.RuleListener {
  const { trackZodSchemaImports } = createZodSchemaImportTrack(scope);
  const { findLengthConstraint } = options;

  return function create(context) {
    const { importDeclarationListener, detectZodSchemaRootNode, collectZodChainMethods } =
      trackZodSchemaImports();

    return {
      ImportDeclaration: importDeclarationListener,
      CallExpression(node): void {
        const zodSchemaMeta = detectZodSchemaRootNode(node);

        if (zodSchemaMeta?.schemaType !== 'array') {
          return;
        }

        const constraint = findLengthConstraint(zodSchemaMeta.node, {
          detectZodSchemaRootNode,
          collectZodChainMethods,
        });

        if (!constraint) {
          return;
        }

        context.report({
          node,
          messageId: 'preferTuple',
          fix(fixer) {
            // Only a fixed-length constraint maps 1:1 to a tuple; `min`/`max`
            // are report-only.
            if (constraint.kind !== 'length') {
              return null;
            }

            const count = readIntegerLiteralValue(constraint.countArgument);
            if (count === null) {
              return null;
            }

            // Bail on named imports (e.g. `array(...)`): rewriting to `tuple(...)`
            // would require a `tuple` import we cannot safely add.
            if (zodSchemaMeta.schemaDecl === 'named') {
              return null;
            }

            const arrayNode = collectZodChainMethods(zodSchemaMeta.node).find(
              (it) => it.name === 'array',
            )?.node;

            // Need exactly one argument (the element schema) to build the tuple.
            if (arrayNode?.arguments.length !== 1) {
              return null;
            }

            const [element] = arrayNode.arguments;
            if (element.type === AST_NODE_TYPES.SpreadElement) {
              return null;
            }

            const arrayCallee = arrayNode.callee;
            if (
              arrayCallee.type !== AST_NODE_TYPES.MemberExpression ||
              arrayCallee.property.type !== AST_NODE_TYPES.Identifier
            ) {
              return null;
            }

            const removeFix = constraint.buildRemoveFix(fixer);
            if (!removeFix) {
              return null;
            }

            const elementText = context.sourceCode.getText(element);
            const tupleElements = Array.from({ length: count }, () => elementText).join(', ');

            return [
              fixer.replaceText(arrayCallee.property, 'tuple'),
              fixer.replaceText(element, `[${tupleElements}]`),
              removeFix,
            ];
          },
        });
      },
    };
  };
}
