import type { TSESLint, TSESTree } from '@typescript-eslint/utils';

import { createZodSchemaImportTrack } from '../track-zod-schema-imports.js';
import type { ZodSchemaImportTracker } from '../track-zod-schema-imports.js';
import type { ZodImportScope } from '../zod-import-scope.js';

type MessageIds = 'noTransformInRecordKey';

/** Subset of the import tracker passed to {@link NoTransformInRecordKeyOptions.findTransformNode}. */
export type FindTransformNodeHelpers = Pick<
  ZodSchemaImportTracker,
  'detectZodSchemaRootNode' | 'collectZodChainMethods'
>;

export interface NoTransformInRecordKeyOptions {
  /**
   * Strategy that inspects a `z.record(...)` key-schema argument and returns the
   * AST node to flag (or `null` if no transform is present). Plugins use this to
   * encode the API-specific way they detect transforms: chained methods for
   * `eslint-plugin-zod`, standalone `.check(...)` arguments for `eslint-plugin-zod-mini`.
   */
  findTransformNode: (
    keySchema: TSESTree.Expression | TSESTree.SpreadElement,
    helpers: FindTransformNodeHelpers,
  ) => TSESTree.Node | null;
}

/**
 * Builds the `create` function for the `no-transform-in-record-key` rule.
 *
 * Owns the shared scaffolding — import tracking, the `ImportDeclaration` listener,
 * `z.record()` detection, key-arg extraction, and the `context.report` call —
 * and delegates transform detection to `options.findTransformNode`.
 */
export function buildNoTransformInRecordKeyCreate(
  scope: ZodImportScope,
  options: NoTransformInRecordKeyOptions,
): (context: Readonly<TSESLint.RuleContext<MessageIds, []>>) => TSESLint.RuleListener {
  const { trackZodSchemaImports } = createZodSchemaImportTrack(scope);

  return function create(context) {
    const { importDeclarationListener, detectZodSchemaRootNode, collectZodChainMethods } =
      trackZodSchemaImports();

    return {
      ImportDeclaration: importDeclarationListener,
      CallExpression(node): void {
        const zodSchemaMeta = detectZodSchemaRootNode(node);

        if (zodSchemaMeta?.schemaType !== 'record') {
          return;
        }

        const keySchemaArg = node.arguments.at(0);

        if (!keySchemaArg) {
          return;
        }

        const reportNode = options.findTransformNode(keySchemaArg, {
          detectZodSchemaRootNode,
          collectZodChainMethods,
        });

        if (reportNode) {
          context.report({
            node: reportNode,
            messageId: 'noTransformInRecordKey',
          });
        }
      },
    };
  };
}
