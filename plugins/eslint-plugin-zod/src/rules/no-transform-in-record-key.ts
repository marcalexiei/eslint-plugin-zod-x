import { createZodSchemaImportTrack, zodImportScope } from '@eslint-zod/utils';
import type { TSESTree } from '@typescript-eslint/utils';
import { AST_NODE_TYPES } from '@typescript-eslint/utils';

import { createZodPluginRule } from '../utils/create-plugin-rule.js';

const { trackZodSchemaImports } = createZodSchemaImportTrack(zodImportScope);

/**
 * Methods that mutate/transform the value and should not be used in z.record() key schemas
 */
const TRANSFORM_METHODS = [
  'transform',
  'map',
  'trim',
  'toLowerCase',
  'toUpperCase',
  'normalize',
  'overwrite',
];

export const noTransformInRecordKey = createZodPluginRule({
  name: 'no-transform-in-record-key',
  meta: {
    type: 'problem',
    docs: {
      description:
        'Disallow transforms in z.record() key schemas, which can cause silent key mutations and data loss through key collisions',
    },
    messages: {
      noTransformInRecordKey:
        'Transforms in z.record() key schemas cause silent key mutation and potential data loss. Use validators like .min() instead of transforms like .trim() or .toLowerCase()',
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    const { importDeclarationListener, detectZodSchemaRootNode, collectZodChainMethods } =
      trackZodSchemaImports();

    /**
     * Check if a schema (as an expression) contains any transform methods in its chain
     */
    function hasTransformMethods(schema: TSESTree.Expression | TSESTree.SpreadElement): boolean {
      // Only process Expression nodes, not SpreadElements
      if (schema.type === AST_NODE_TYPES.SpreadElement) {
        return false;
      }

      // If it's a call expression, it could be a Zod schema
      if (schema.type === AST_NODE_TYPES.CallExpression) {
        const methods = collectZodChainMethods(schema);
        return methods.some((method) => TRANSFORM_METHODS.includes(method.name));
      }

      return false;
    }

    return {
      ImportDeclaration: importDeclarationListener,
      CallExpression(node): void {
        const zodSchemaMeta = detectZodSchemaRootNode(node);

        // Only care about z.record() calls
        if (zodSchemaMeta?.schemaType !== 'record') {
          return;
        }

        // Get the first argument, which is the key schema
        const keySchemaArg = node.arguments.at(0);

        // Skip if there's no key schema
        if (!keySchemaArg) {
          return;
        }

        // Check if the key schema contains transforms
        if (hasTransformMethods(keySchemaArg)) {
          context.report({
            node: keySchemaArg,
            messageId: 'noTransformInRecordKey',
          });
        }
      },
    };
  },
});
