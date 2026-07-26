import {
  ZOD_STRING_FORMAT_METHODS,
  buildZodChainReplacementFix,
  zodImportScope,
} from '@eslint-zod/utils';
import type { ZodStringFormatMethodName } from '@eslint-zod/utils';

import { createZodPluginRule } from '../utils/create-plugin-rule.js';

const TOP_LEVEL_STRING_FORMATS_URL = 'https://zod.dev/v4?id=top-level-string-formats';

interface Options {
  ignore?: ReadonlyArray<ZodStringFormatMethodName>;
}

type MessageIds = 'preferTopLevelStringFormat';

const ZOD_STRING_FORMAT_METHOD_NAMES = ZOD_STRING_FORMAT_METHODS.map(
  ({ sourceMethodName }) => sourceMethodName,
);

const ZOD_STRING_FORMAT_METHODS_BY_SOURCE = Object.fromEntries(
  ZOD_STRING_FORMAT_METHODS.map((format) => [format.sourceMethodName, format]),
) as Record<ZodStringFormatMethodName, (typeof ZOD_STRING_FORMAT_METHODS)[number]>;

function isZodStringFormatMethodName(value: string): value is ZodStringFormatMethodName {
  return ZOD_STRING_FORMAT_METHOD_NAMES.includes(value as ZodStringFormatMethodName);
}

export const preferTopLevelStringFormats = createZodPluginRule<[Options], MessageIds>({
  name: 'prefer-top-level-string-formats',
  meta: {
    type: 'suggestion',
    fixable: 'code',
    docs: {
      description:
        'Prefer top-level string format schemas over deprecated `z.string().<format>()` methods',
      url: TOP_LEVEL_STRING_FORMATS_URL,
    },
    messages: {
      preferTopLevelStringFormat:
        'Use `z.{{replacementMethod}}()` instead of `z.string().{{sourceMethod}}()`.',
    },
    schema: [
      {
        type: 'object',
        properties: {
          ignore: {
            type: 'array',
            description: 'Top-level string format methods to ignore for this rule.',
            items: {
              type: 'string',
              enum: [...ZOD_STRING_FORMAT_METHOD_NAMES],
            },
            uniqueItems: true,
          },
        },
        additionalProperties: false,
      },
    ],
  },
  defaultOptions: [{}],
  create(context, [{ ignore = [] }]) {
    const { sourceCode } = context;

    const ignoredMethods = new Set<ZodStringFormatMethodName>(ignore);

    const { importDeclarationListener, detectZodSchemaRootNode, collectZodChainMethods } =
      zodImportScope.createTracker();

    return {
      ImportDeclaration: importDeclarationListener,

      CallExpression(node): void {
        const zodSchemaMeta = detectZodSchemaRootNode(node);

        if (zodSchemaMeta?.schemaType !== 'string') {
          return;
        }

        const methods = collectZodChainMethods(node);

        const stringIndex = methods.findIndex((method) => method.name === 'string');

        if (stringIndex === -1) {
          return;
        }

        const formatMethod = methods.find(
          (method, index) =>
            index > stringIndex &&
            isZodStringFormatMethodName(method.name) &&
            !ignoredMethods.has(method.name),
        );

        if (!formatMethod) {
          return;
        }

        // The `find` predicate above already checked the name against the
        // format list; TS just cannot carry a type guard through `find`.
        const { replacementMethodName, sourceMethodName } =
          ZOD_STRING_FORMAT_METHODS_BY_SOURCE[formatMethod.name as ZodStringFormatMethodName];

        context.report({
          node,
          messageId: 'preferTopLevelStringFormat',
          data: {
            replacementMethod: replacementMethodName,
            sourceMethod: sourceMethodName,
          },
          fix(fixer) {
            if (zodSchemaMeta.schemaDecl === 'named') {
              return null;
            }

            return buildZodChainReplacementFix({
              sourceCode,
              fixer,
              methods,
              fromIndex: stringIndex,
              toIndex: methods.indexOf(formatMethod),
              toMethodName: replacementMethodName,
            });
          },
        });
      },
    };
  },
});
