import { RuleTester } from '@typescript-eslint/rule-tester';

import { noOptionalAndDefaultTogether } from './no-optional-and-default-together.js';

const ruleTester = new RuleTester();

ruleTester.run(
  'no-optional-and-default-together',
  noOptionalAndDefaultTogether,
  {
    valid: [
      {
        name: 'schema with only default',
        code: 'z.string().default("Hello World")',
      },
      {
        name: 'schema with only optional',
        code: 'z.string().optional()',
      },
      {
        name: 'schema with neither default nor optional',
        code: 'z.string()',
      },
      {
        name: 'schema with other methods',
        code: 'z.string().min(5).max(10)',
      },
      {
        name: 'complex schema with only default',
        code: 'z.string().trim().toLowerCase().default("hello")',
      },
      {
        name: 'complex schema with only optional',
        code: 'z.string().trim().toLowerCase().optional()',
      },
      {
        name: 'object schema with different properties',
        code: 'z.object({ a: z.string().optional(), b: z.string().default("b") })',
      },
      {
        name: 'with nullable - should not error',
        code: 'z.string().nullable().default("hello")',
      },
      {
        name: 'with nullish - should not error',
        code: 'z.string().nullish()',
      },
      {
        name: 'should not report non-z chaining',
        code: 'something.string().optional().default("Test")',
      },
    ],
    invalid: [
      {
        name: 'optional then default - preferredMethod: none (explicit)',
        code: 'z.string().optional().default("Hello World")',
        options: [{ preferredMethod: 'none' }],
        errors: [{ messageId: 'noOptionalAndDefaultTogether' }],
        output: null,
      },
      {
        name: 'optional then default - default option (no fix)',
        code: 'z.string().optional().default("Hello World")',
        errors: [{ messageId: 'noOptionalAndDefaultTogether' }],
        output: null,
      },
      {
        name: 'default then optional - default option (no fix)',
        code: 'z.string().default("Hello World").optional()',
        errors: [{ messageId: 'noOptionalAndDefaultTogether' }],
        output: null,
      },
      {
        name: 'optional then default - preferredMethod: default',
        code: 'z.string().optional().default("Hello World")',
        options: [{ preferredMethod: 'default' }],
        errors: [
          {
            messageId: 'noOptionalAndDefaultTogetherRemoveMethod',
            data: { method: 'optional' },
          },
        ],
        output: `z.string().default("Hello World")`,
      },
      {
        name: 'default then optional - preferredMethod: default',
        code: 'z.string().default("Hello World").optional()',
        options: [{ preferredMethod: 'default' }],
        errors: [
          {
            messageId: 'noOptionalAndDefaultTogetherRemoveMethod',
            data: { method: 'optional' },
          },
        ],
        output: `z.string().default("Hello World")`,
      },
      {
        name: 'optional then default - preferredMethod: optional',
        code: 'z.string().optional().default("Hello World")',
        options: [{ preferredMethod: 'optional' }],
        errors: [
          {
            messageId: 'noOptionalAndDefaultTogetherRemoveMethod',
            data: { method: 'default' },
          },
        ],
        output: `z.string().optional()`,
      },
      {
        name: 'default then optional - preferredMethod: optional',
        code: 'z.string().default("Hello World").optional()',
        options: [{ preferredMethod: 'optional' }],
        errors: [
          {
            messageId: 'noOptionalAndDefaultTogetherRemoveMethod',
            data: { method: 'default' },
          },
        ],
        output: `z.string().optional()`,
      },
      {
        name: 'with other methods in between - preferredMethod: default',
        code: 'z.string().optional().trim().default("Hello World")',
        options: [{ preferredMethod: 'default' }],
        errors: [
          {
            messageId: 'noOptionalAndDefaultTogetherRemoveMethod',
            data: { method: 'optional' },
          },
        ],
        output: `z.string().trim().default("Hello World")`,
      },
      {
        name: 'with other methods in between - preferredMethod: optional',
        code: 'z.string().default("Hello World").trim().optional()',
        options: [{ preferredMethod: 'optional' }],
        errors: [
          {
            messageId: 'noOptionalAndDefaultTogetherRemoveMethod',
            data: { method: 'default' },
          },
        ],
        output: `z.string().trim().optional()`,
      },
      {
        name: 'complex chain - optional then default - preferredMethod: default',
        code: 'z.string().trim().toLowerCase().optional().default("hello")',
        options: [{ preferredMethod: 'default' }],
        errors: [
          {
            messageId: 'noOptionalAndDefaultTogetherRemoveMethod',
            data: { method: 'optional' },
          },
        ],
        output: `z.string().trim().toLowerCase().default("hello")`,
      },
      {
        name: 'complex chain - default then optional - preferredMethod: optional',
        code: 'z.string().trim().toLowerCase().default("hello").optional()',
        options: [{ preferredMethod: 'optional' }],
        errors: [
          {
            messageId: 'noOptionalAndDefaultTogetherRemoveMethod',
            data: { method: 'default' },
          },
        ],
        output: `z.string().trim().toLowerCase().optional()`,
      },
      {
        name: 'number schema - optional then default',
        code: 'z.number().optional().default(42)',
        options: [{ preferredMethod: 'default' }],
        errors: [
          {
            messageId: 'noOptionalAndDefaultTogetherRemoveMethod',
            data: { method: 'optional' },
          },
        ],
        output: `z.number().default(42)`,
      },
      {
        name: 'boolean schema - default then optional',
        code: 'z.boolean().default(true).optional()',
        options: [{ preferredMethod: 'default' }],
        errors: [
          {
            messageId: 'noOptionalAndDefaultTogetherRemoveMethod',
            data: { method: 'optional' },
          },
        ],
        output: `z.boolean().default(true)`,
      },
    ],
  },
);
