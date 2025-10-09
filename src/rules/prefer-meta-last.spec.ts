import { RuleTester } from '@typescript-eslint/rule-tester';

import { preferMetaLast } from './prefer-meta-last.js';

const ruleTester = new RuleTester();

ruleTester.run('prefer-meta-last', preferMetaLast, {
  valid: [
    {
      name: 'Correct usage',
      code: 'z.string().meta({ description: "desc" })',
    },
    {
      name: 'No meta... no error',
      code: 'z.string().min(5).max(10);',
    },
    {
      name: 'multiple methods, but meta() is last',
      code: 'z.string().min(5).max(10).meta({ description: "my string" });',
    },

    {
      name: 'multiple chained metas at the end (still valid)',
      code: 'z.string().min(5).max(10).meta({ a: 1 }).meta({ b: 2 });',
    },
    {
      // https://github.com/marcalexiei/eslint-plugin-zod-x/issues/42
      name: 'meta not belonging to zod',
      code: `export const t = initTRPC
              .meta<Meta>()
              .context<typeof createTRPCContext>()
              .create({});`,
    },
    {
      name: 'meta not belonging to zod',
      code: 'const t = meta<Meta>()',
    },
  ],

  invalid: [
    {
      name: 'meta() before another method',
      code: 'z.string().meta({ description: "desc" }).trim()',
      errors: [{ messageId: 'metaNotLast' }],
      output: `z.string().trim().meta({ description: "desc" })`,
    },
    {
      name: 'meta() followed by transform()',
      code: 'z.string().meta({ foo: "bar" }).transform(x => x.toUpperCase());',
      errors: [{ messageId: 'metaNotLast' }],
      output:
        'z.string().transform(x => x.toUpperCase()).meta({ foo: "bar" });',
    },
    {
      name: 'meta() in the middle of the chain',
      code: 'z.string().min(5).meta({ foo: "bar" }).max(10);',
      errors: [{ messageId: 'metaNotLast' }],
      output: 'z.string().min(5).max(10).meta({ foo: "bar" });',
    },
  ],
});
