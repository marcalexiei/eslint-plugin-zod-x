import { ESLintUtils } from '@typescript-eslint/utils';

import { getRuleURL } from '../meta.js';

const ZOD_IMPORT_SOURCES = ['zod', 'zod/v4', 'zod/v3'] as const;

type ZodImportSource = (typeof ZOD_IMPORT_SOURCES)[number];

type MessageIds = 'sourceNotAllowed';

export const consistentImportSource = ESLintUtils.RuleCreator(getRuleURL)<
  [{ sources: Array<ZodImportSource> }],
  MessageIds
>({
  name: 'consistent-import-source',
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Enforce consistent source from Zod imports',
    },
    messages: {
      sourceNotAllowed:
        '"{{source}}" is not allowed. Available values are: {{sources}}',
    },
    schema: [
      {
        type: 'object',
        properties: {
          sources: {
            type: 'array',
            description: 'An array of allowed Zod import sources.',
            items: {
              type: 'string',
              enum: [...ZOD_IMPORT_SOURCES],
            },
            minItems: 1,
            uniqueItems: true,
          },
        },
        additionalProperties: false,
      },
    ],
  },
  defaultOptions: [{ sources: ['zod'] }],
  create(context, [{ sources }]) {
    return {
      ImportDeclaration(node): void {
        const sourceValue = node.source.value;
        if (!sourceValue.startsWith('zod')) {
          return;
        }

        if (sources.includes(sourceValue as ZodImportSource)) {
          return;
        }

        context.report({
          node,
          messageId: 'sourceNotAllowed',
          data: {
            source: sourceValue,
            sources: sources.map((s) => `"${s}"`).join(', '),
          },
        });
      },
    };
  },
});
