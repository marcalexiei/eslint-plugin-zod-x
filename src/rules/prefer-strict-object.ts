import { ESLintUtils } from '@typescript-eslint/utils';

import { getRuleURL } from '../meta.js';
import { trackZodSchemaImports } from '../utils/track-zod-schema-imports.js';

const methodsPoll = ['object', 'looseObject'] as const;

interface Options {
  allow: Array<(typeof methodsPoll)[number]>;
}
type MessageIds = 'useStrictObject';

const defaultOptions: Options = { allow: [] };

export const preferStrictObjet = ESLintUtils.RuleCreator(getRuleURL)<
  [Options],
  MessageIds
>({
  name: 'prefer-strict-object',
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Enforce usage of `.strictObject()` over `.object()` and/or `.looseObject()`',
    },
    messages: {
      useStrictObject: 'Prefer `.strictObject()`',
    },
    schema: [
      {
        type: 'object',
        properties: {
          allow: {
            description: 'Decides which style for zod array function',
            type: 'array',
            items: {
              type: 'string',
              enum: [...methodsPoll],
            },
          },
        },
        additionalProperties: false,
      },
    ],
  },
  defaultOptions: [defaultOptions],
  create(context, [{ allow }]) {
    const {
      //
      importDeclarationListener,
      detectZodSchemaRootNode,
    } = trackZodSchemaImports();

    return {
      ImportDeclaration: importDeclarationListener,
      CallExpression(node): void {
        const zodSchemaMeta = detectZodSchemaRootNode(node);
        if (!zodSchemaMeta) {
          return;
        }

        // Exclude allowed methods from the check
        const bannedMethods = methodsPoll.filter((it) => !allow.includes(it));

        if (bannedMethods.some((it) => zodSchemaMeta.schemaType === it)) {
          context.report({
            node,
            messageId: 'useStrictObject',
          });
        }
      },
    };
  },
});
