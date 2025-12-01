import type { TSESLint } from '@typescript-eslint/utils';
import { AST_NODE_TYPES, ESLintUtils } from '@typescript-eslint/utils';

import { getRuleURL } from '../meta.js';
import { trackZodSchemaImports } from '../utils/track-zod-schema-imports.js';

const ZOD_OBJECT_METHODS = ['object', 'looseObject', 'strictObject'] as const;

type ZodObjectMethod = (typeof ZOD_OBJECT_METHODS)[number];

interface Options {
  allow: Array<ZodObjectMethod>;
}
type MessageIds = 'consistentMethod' | 'useMethod';

const defaultOptions: Options = { allow: ['object'] };

export const consistentObjectSchemaType = ESLintUtils.RuleCreator(getRuleURL)<
  [Options],
  MessageIds
>({
  name: 'consistent-object-schema-type',
  meta: {
    hasSuggestions: true,
    type: 'suggestion',
    docs: {
      description: 'Enforce consistent usage of Zod schema methods',
    },
    messages: {
      consistentMethod:
        "Inconsistent Zod object schema method '{{actual}}'. Allowed: {{allowedList}}.",
      useMethod: "Replace with '{{expected}}'.",
    },
    schema: [
      {
        type: 'object',
        properties: {
          allow: {
            type: 'array',
            description: 'Decides which object methods are allowed',
            items: {
              type: 'string',
              enum: [...ZOD_OBJECT_METHODS],
            },
            minItems: 1,
            uniqueItems: true,
          },
        },
        additionalProperties: false,
      },
    ],
  },
  defaultOptions: [defaultOptions],
  create(context, [{ allow: allowedList }]) {
    const {
      //
      importDeclarationListener,
      detectZodSchemaRootNode,
    } = trackZodSchemaImports();

    return {
      ImportDeclaration: importDeclarationListener,
      CallExpression(node): void {
        const zodSchemaMeta = detectZodSchemaRootNode(node);

        const schemaType = zodSchemaMeta?.schemaType as
          | ZodObjectMethod
          | undefined;

        if (!schemaType || !ZOD_OBJECT_METHODS.includes(schemaType)) {
          return;
        }

        if (allowedList.includes(schemaType)) {
          return;
        }

        const { callee } = node;

        if (callee.type === AST_NODE_TYPES.Identifier) {
          context.report({
            node,
            messageId: 'consistentMethod',
            data: { actual: schemaType, allowedList: allowedList.join(',') },
          });
          return;
        }

        if (callee.type === AST_NODE_TYPES.MemberExpression) {
          context.report({
            node,
            messageId: 'consistentMethod',
            data: {
              actual: schemaType,
              allowedList: allowedList.join(','),
            },
            suggest: allowedList.map<
              TSESLint.ReportSuggestionArray<MessageIds>[number]
            >((it) => ({
              messageId: 'useMethod',
              data: { expected: it },
              fix(fixer): TSESLint.RuleFix {
                return fixer.replaceText(callee.property, it);
              },
            })),
          });
        }
      },
    };
  },
});
