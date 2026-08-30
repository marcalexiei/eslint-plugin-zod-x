import { zodImportScope } from '@eslint-zod/utils';
import { buildPreferTopLevelFactoryCreate } from '@eslint-zod/utils/rule-patterns/prefer-top-level-factory';

import { createZodPluginRule } from '../utils/create-plugin-rule.js';

export const noStringSchemaWithUuid = createZodPluginRule({
  name: 'no-string-schema-with-uuid',
  meta: {
    fixable: 'code',
    type: 'problem',
    deprecated: {
      message: 'Use `zod/prefer-top-level-string-formats` instead',
    },
    docs: {
      description:
        'Disallow usage of `z.string().uuid()` in favor of the dedicated `z.uuid()` schema',
      url: 'https://zod.dev/api#uuids',
    },
    messages: {
      useUuid: '`z.string().uuid()` is redundant. Use `z.uuid()` instead.',
    },
    schema: [],
  },
  defaultOptions: [],

  create: buildPreferTopLevelFactoryCreate({
    scope: zodImportScope,
    factoryName: 'string',
    replacements: [{ sourceMethodName: 'uuid', replacementMethodName: 'uuid' }],
    messageId: 'useUuid',
  }),
});
