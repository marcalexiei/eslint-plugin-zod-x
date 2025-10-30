import { RuleTester } from '@typescript-eslint/rule-tester';

import { preferMetaLast } from './prefer-meta-last.js';

const ruleTester = new RuleTester();

ruleTester.run('prefer-meta-last', preferMetaLast, {
  valid: [
    {
      name: 'valid usage',
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
      name: 'multiple chained meta at the end (still valid)',
      code: 'z.string().min(5).max(10).meta({ a: 1 }).meta({ b: 2 });',
    },
    {
      // https://github.com/marcalexiei/eslint-plugin-zod-x/issues/42
      name: 'meta not belonging to zod',
      code: `
        export const t = initTRPC
          .meta<Meta>()
          .context<typeof createTRPCContext>()
          .create({});
      `,
    },
    {
      name: 'meta not belonging to zod',
      code: 'const t = meta<Meta>()',
    },
    {
      // https://github.com/marcalexiei/eslint-plugin-zod-x/issues/70
      name: 'inside object',
      code: `
        export const baseEventPayloadSchema = z.object({
          type: z.string(),
          action: z.string().meta({ description: "a" }),
        })
      `,
    },
    {
      // https://github.com/marcalexiei/eslint-plugin-zod-x/issues/42
      name: 'inside looseObject',
      code: `
        export const baseEventPayloadSchema = z.looseObject({
          type: z.string(),
          action: z.string().meta({ description: "a" }),
        })
      `,
    },
    {
      // https://github.com/marcalexiei/eslint-plugin-zod-x/issues/42
      name: 'inside strictObject',
      code: `
        export const baseEventPayloadSchema = z.strictObject({
          type: z.string(),
          action: z.string().meta({ description: "a" }),
        })
      `,
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
      errors: [
        { messageId: 'metaNotLast', line: 1, column: 19, endColumn: 23 },
      ],
      output: 'z.string().min(5).max(10).meta({ foo: "bar" });',
    },
    {
      // https://github.com/marcalexiei/eslint-plugin-zod-x/issues/42
      name: 'inside strictObject',
      code: `
        export const baseEventPayloadSchema = z.strictObject({
          type: z.string(),
          action: z.string().meta({ description: "a" }).min(1),
        })
      `,
      errors: [
        { messageId: 'metaNotLast', line: 4, column: 30, endColumn: 34 },
      ],
      output: `
        export const baseEventPayloadSchema = z.strictObject({
          type: z.string(),
          action: z.string().min(1).meta({ description: "a" }),
        })
      `,
    },
  ],
});
