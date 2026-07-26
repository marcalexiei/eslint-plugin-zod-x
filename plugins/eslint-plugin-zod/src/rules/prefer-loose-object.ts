import { zodImportScope } from '@eslint-zod/utils';
import { buildPreferDedicatedFactoryCreate } from '@eslint-zod/utils/rule-patterns/prefer-dedicated-factory';

import { createZodPluginRule } from '../utils/create-plugin-rule.js';

export const preferLooseObject = createZodPluginRule({
  name: 'prefer-loose-object',
  meta: {
    type: 'suggestion',
    fixable: 'code',
    docs: {
      description:
        'Prefer `z.looseObject()` over `z.object().passthrough()` and `z.object().loose()`',
    },
    messages: {
      preferLooseObject: 'Use `z.looseObject()` instead of `.passthrough()` or `.loose()`.',
    },
    schema: [],
  },
  defaultOptions: [],
  create: buildPreferDedicatedFactoryCreate({
    scope: zodImportScope,
    factoryName: 'object',
    modifierMethods: ['passthrough', 'loose'],
    replacementFactoryName: 'looseObject',
    messageId: 'preferLooseObject',
  }),
});
