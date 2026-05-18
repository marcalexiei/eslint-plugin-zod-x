import { createZodSchemaImportTrack, zodMiniImportScope } from '@eslint-zod/utils';
import type { TSESTree } from '@typescript-eslint/utils';
import { AST_NODE_TYPES } from '@typescript-eslint/utils';

import { createZodMiniPluginRule } from '../utils/create-plugin-rule.js';

const { trackZodSchemaImports } = createZodSchemaImportTrack(zodMiniImportScope);

/**
 * Methods that mutate/transform the value and should not be used in z.record() key schemas
 */
const TRANSFORM_CHECKS = new Set(['normalize', 'overwrite', 'toLowerCase', 'toUpperCase', 'trim']);

export const noTransformInRecordKey = createZodMiniPluginRule({
  name: 'no-transform-in-record-key',
  meta: {
    type: 'problem',
    docs: {
      description:
        'Disallow transforms in z.record() key schemas, which can cause silent key mutations and data loss through key collisions',
    },
    messages: {
      noTransformInRecordKey:
        'Transforms in z.record() key schemas cause silent key mutation and potential data loss. Use validators like z.minLength() instead of mutating checks like z.trim() or z.toLowerCase().',
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    const { importDeclarationListener, detectZodSchemaRootNode, collectZodChainMethods } =
      trackZodSchemaImports();

    // In Zod Mini, key mutations are passed as standalone checks into .check(...),
    // so scan each check argument and return the first mutating one we find.
    function getTransformCheck(
      schema: TSESTree.Expression | TSESTree.SpreadElement,
    ): TSESTree.CallExpression | null {
      if (schema.type !== AST_NODE_TYPES.CallExpression) {
        return null;
      }

      for (const method of collectZodChainMethods(schema)) {
        if (method.name !== 'check') {
          continue;
        }

        for (const argument of method.node.arguments) {
          if (argument.type !== AST_NODE_TYPES.CallExpression) {
            continue;
          }

          const zodCheck = detectZodSchemaRootNode(argument);

          if (zodCheck && TRANSFORM_CHECKS.has(zodCheck.schemaType)) {
            return argument;
          }
        }
      }

      return null;
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

        const transformCheck = getTransformCheck(keySchemaArg);

        if (!transformCheck) {
          return;
        }

        context.report({
          node: transformCheck,
          messageId: 'noTransformInRecordKey',
        });
      },
    };
  },
});
