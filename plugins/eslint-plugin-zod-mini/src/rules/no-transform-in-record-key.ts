import { ZOD_MUTATING_CHECK_NAMES, zodMiniImportScope } from '@eslint-zod/utils';
import { buildNoTransformInRecordKeyCreate } from '@eslint-zod/utils/rule-builders/no-transform-in-record-key';
import { AST_NODE_TYPES } from '@typescript-eslint/utils';

import { createZodMiniPluginRule } from '../utils/create-plugin-rule.js';

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
  create: buildNoTransformInRecordKeyCreate(zodMiniImportScope, {
    findTransformNode(keySchema, { detectZodSchemaRootNode, collectZodChainMethods }) {
      if (keySchema.type !== AST_NODE_TYPES.CallExpression) {
        return null;
      }

      for (const method of collectZodChainMethods(keySchema)) {
        if (method.name !== 'check') {
          continue;
        }

        for (const argument of method.node.arguments) {
          if (argument.type !== AST_NODE_TYPES.CallExpression) {
            continue;
          }

          const zodCheck = detectZodSchemaRootNode(argument);

          if (zodCheck && ZOD_MUTATING_CHECK_NAMES.includes(zodCheck.schemaType)) {
            return argument;
          }
        }
      }

      return null;
    },
  }),
});
