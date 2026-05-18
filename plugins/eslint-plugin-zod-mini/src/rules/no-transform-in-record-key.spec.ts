import { RuleTester } from '@typescript-eslint/rule-tester';
import dedent from 'dedent';

import { noTransformInRecordKey } from './no-transform-in-record-key.js';

const ruleTester = new RuleTester();

ruleTester.run(noTransformInRecordKey.name, noTransformInRecordKey, {
  valid: [
    {
      name: 'plain string key without transforms',
      code: dedent`
        import * as z from 'zod/mini';
        const config = z.record(z.string(), z.unknown());
      `,
    },
    {
      name: 'string key with validators',
      code: dedent`
        import * as z from 'zod/mini';
        const config = z.record(z.string().check(z.minLength(1), z.maxLength(100)), z.unknown());
      `,
    },
    {
      name: 'enum key without transforms',
      code: dedent`
        import * as z from 'zod/mini';
        const config = z.record(z.enum(['a', 'b', 'c']), z.number());
      `,
    },
    {
      name: 'lowercase validator does not mutate keys',
      code: dedent`
        import * as z from 'zod/mini';
        const config = z.record(z.string().check(z.lowercase()), z.unknown());
      `,
    },
    {
      name: 'transform on value schema is fine',
      code: dedent`
        import * as z from 'zod/mini';
        const config = z.record(z.string(), z.string().check(z.trim()));
      `,
    },
    {
      name: 'named import without transforms',
      code: dedent`
        import { record, string, unknown } from 'zod/mini';
        const config = record(string(), unknown());
      `,
    },
    {
      name: 'named import with validators',
      code: dedent`
        import { maxLength, minLength, record, string, unknown } from 'zod/mini';
        const config = record(string().check(minLength(1), maxLength(100)), unknown());
      `,
    },
    {
      name: 'named import lowercase validator',
      code: dedent`
        import { lowercase, record, string, unknown } from 'zod/mini';
        const config = record(string().check(lowercase()), unknown());
      `,
    },
    {
      name: 'named z import',
      code: dedent`
        import { z } from 'zod/mini';
        const config = z.record(z.string().check(z.minLength(1)), z.unknown());
      `,
    },
    {
      name: 'zod/v4-mini import',
      code: dedent`
        import * as z from 'zod/v4-mini';
        const config = z.record(z.string().check(z.minLength(1)), z.unknown());
      `,
    },
    {
      name: 'not triggered on zod import',
      code: dedent`
        import * as z from 'zod';
        const config = z.record(z.string().trim(), z.unknown());
      `,
    },
  ],
  invalid: [
    {
      name: 'trim on key schema',
      code: dedent`
        import * as z from 'zod/mini';
        const config = z.record(z.string().check(z.trim()), z.unknown());
      `,
      errors: [{ messageId: 'noTransformInRecordKey' }],
    },
    {
      name: 'toLowerCase on key schema',
      code: dedent`
        import * as z from 'zod/mini';
        const config = z.record(z.string().check(z.toLowerCase()), z.unknown());
      `,
      errors: [{ messageId: 'noTransformInRecordKey' }],
    },
    {
      name: 'toUpperCase on key schema',
      code: dedent`
        import * as z from 'zod/mini';
        const config = z.record(z.string().check(z.toUpperCase()), z.number());
      `,
      errors: [{ messageId: 'noTransformInRecordKey' }],
    },
    {
      name: 'normalize on key schema',
      code: dedent`
        import * as z from 'zod/mini';
        const config = z.record(z.string().check(z.normalize()), z.unknown());
      `,
      errors: [{ messageId: 'noTransformInRecordKey' }],
    },
    {
      name: 'overwrite on key schema',
      code: dedent`
        import * as z from 'zod/mini';
        const config = z.record(
          z.string().check(z.overwrite((value) => value.trim())),
          z.unknown(),
        );
      `,
      errors: [{ messageId: 'noTransformInRecordKey' }],
    },
    {
      name: 'transform after validators on key schema',
      code: dedent`
        import * as z from 'zod/mini';
        const config = z.record(z.string().check(z.minLength(1), z.trim()), z.unknown());
      `,
      errors: [{ messageId: 'noTransformInRecordKey' }],
    },
    {
      name: 'chained check calls with trim',
      code: dedent`
        import * as z from 'zod/mini';
        const config = z.record(z.string().check(z.minLength(1)).check(z.trim()), z.unknown());
      `,
      errors: [{ messageId: 'noTransformInRecordKey' }],
    },
    {
      name: 'named import with trim',
      code: dedent`
        import { record, string, trim, unknown } from 'zod/mini';
        const config = record(string().check(trim()), unknown());
      `,
      errors: [{ messageId: 'noTransformInRecordKey' }],
    },
    {
      name: 'named import with toLowerCase',
      code: dedent`
        import { record, string, toLowerCase, unknown } from 'zod/mini';
        const config = record(string().check(toLowerCase()), unknown());
      `,
      errors: [{ messageId: 'noTransformInRecordKey' }],
    },
    {
      name: 'named z import with toUpperCase',
      code: dedent`
        import { z } from 'zod/mini';
        const config = z.record(z.string().check(z.minLength(1), z.toUpperCase()), z.unknown());
      `,
      errors: [{ messageId: 'noTransformInRecordKey' }],
    },
    {
      name: 'zod/v4-mini import',
      code: dedent`
        import * as z from 'zod/v4-mini';
        const config = z.record(z.string().check(z.trim()), z.unknown());
      `,
      errors: [{ messageId: 'noTransformInRecordKey' }],
    },
    {
      name: 'real-world example with data loss',
      code: dedent`
        import * as z from 'zod/mini';
        const schema = z.record(z.string().check(z.trim()), z.unknown());
        const input = { " id ": "abc-123", id: "def-456" };
        const result = schema.parse(input);
      `,
      errors: [{ messageId: 'noTransformInRecordKey' }],
    },
  ],
});
