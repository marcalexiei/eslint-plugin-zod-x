import {
  buildZodChainReplacementFix,
  createZodSchemaImportTrack,
  zodImportScope,
} from '@eslint-zod/utils';

import { createZodPluginRule } from '../utils/create-plugin-rule.js';

const TOP_LEVEL_STRING_FORMATS_URL = 'https://zod.dev/v4?id=top-level-string-formats';

export const TOP_LEVEL_STRING_FORMATS = [
  { sourceMethodName: 'base64', replacementMethodName: 'base64' },
  { sourceMethodName: 'base64url', replacementMethodName: 'base64url' },
  { sourceMethodName: 'cidrv4', replacementMethodName: 'cidrv4' },
  { sourceMethodName: 'cidrv6', replacementMethodName: 'cidrv6' },
  { sourceMethodName: 'cuid', replacementMethodName: 'cuid' },
  { sourceMethodName: 'cuid2', replacementMethodName: 'cuid2' },
  { sourceMethodName: 'date', replacementMethodName: 'iso.date' },
  { sourceMethodName: 'datetime', replacementMethodName: 'iso.datetime' },
  { sourceMethodName: 'duration', replacementMethodName: 'iso.duration' },
  { sourceMethodName: 'e164', replacementMethodName: 'e164' },
  { sourceMethodName: 'email', replacementMethodName: 'email' },
  { sourceMethodName: 'emoji', replacementMethodName: 'emoji' },
  { sourceMethodName: 'guid', replacementMethodName: 'guid' },
  { sourceMethodName: 'ipv4', replacementMethodName: 'ipv4' },
  { sourceMethodName: 'ipv6', replacementMethodName: 'ipv6' },
  { sourceMethodName: 'jwt', replacementMethodName: 'jwt' },
  { sourceMethodName: 'ksuid', replacementMethodName: 'ksuid' },
  { sourceMethodName: 'nanoid', replacementMethodName: 'nanoid' },
  { sourceMethodName: 'time', replacementMethodName: 'iso.time' },
  { sourceMethodName: 'ulid', replacementMethodName: 'ulid' },
  { sourceMethodName: 'url', replacementMethodName: 'url' },
  { sourceMethodName: 'uuid', replacementMethodName: 'uuid' },
  { sourceMethodName: 'uuidv4', replacementMethodName: 'uuidv4' },
  { sourceMethodName: 'uuidv6', replacementMethodName: 'uuidv6' },
  { sourceMethodName: 'uuidv7', replacementMethodName: 'uuidv7' },
  { sourceMethodName: 'xid', replacementMethodName: 'xid' },
] as const;

type TopLevelStringFormatMethodName = (typeof TOP_LEVEL_STRING_FORMATS)[number]['sourceMethodName'];

interface Options {
  ignore?: ReadonlyArray<TopLevelStringFormatMethodName>;
}

type MessageIds = 'preferTopLevelStringFormat';

const { trackZodSchemaImports } = createZodSchemaImportTrack(zodImportScope);

const TOP_LEVEL_STRING_FORMAT_METHOD_NAMES = TOP_LEVEL_STRING_FORMATS.map(
  ({ sourceMethodName }) => sourceMethodName,
);

const TOP_LEVEL_STRING_FORMATS_BY_SOURCE = Object.fromEntries(
  TOP_LEVEL_STRING_FORMATS.map((format) => [format.sourceMethodName, format]),
) as Record<TopLevelStringFormatMethodName, (typeof TOP_LEVEL_STRING_FORMATS)[number]>;

function isTopLevelStringFormatMethodName(value: string): value is TopLevelStringFormatMethodName {
  return TOP_LEVEL_STRING_FORMAT_METHOD_NAMES.includes(value as TopLevelStringFormatMethodName);
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
              enum: [...TOP_LEVEL_STRING_FORMAT_METHOD_NAMES],
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

    const ignoredMethods = new Set<TopLevelStringFormatMethodName>(ignore);

    const { importDeclarationListener, detectZodSchemaRootNode, collectZodChainMethods } =
      trackZodSchemaImports();

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
            isTopLevelStringFormatMethodName(method.name) &&
            !ignoredMethods.has(method.name),
        );

        if (!formatMethod) {
          return;
        }

        // The `find` predicate above already checked the name against the
        // format list; TS just cannot carry a type guard through `find`.
        const { replacementMethodName, sourceMethodName } =
          TOP_LEVEL_STRING_FORMATS_BY_SOURCE[formatMethod.name as TopLevelStringFormatMethodName];

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
