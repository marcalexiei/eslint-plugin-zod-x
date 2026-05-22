import { RuleTester } from '@typescript-eslint/rule-tester';
import dedent from 'dedent';

import { noTransformInRecordKey } from './no-transform-in-record-key.js';

const ruleTester = new RuleTester();

ruleTester.run(noTransformInRecordKey.name, noTransformInRecordKey, {
  valid: [
    {
      name: 'plain string key without transforms',
      code: dedent`
        import * as z from 'zod';
        const config = z.record(z.string(), z.unknown());
      `,
    },
    {
      name: 'string key with validator (no transform)',
      code: dedent`
        import * as z from 'zod';
        const config = z.record(z.string().min(1), z.unknown());
      `,
    },
    {
      name: 'string key with multiple validators',
      code: dedent`
        import * as z from 'zod';
        const config = z.record(z.string().min(1).max(100), z.unknown());
      `,
    },
    {
      name: 'enum key without transforms',
      code: dedent`
        import * as z from 'zod';
        const config = z.record(z.enum(['a', 'b', 'c']), z.number());
      `,
    },
    {
      name: 'number key',
      code: dedent`
        import * as z from 'zod';
        const config = z.record(z.number(), z.string());
      `,
    },
    {
      name: 'transform on value schema (not key) is fine',
      code: dedent`
        import * as z from 'zod';
        const config = z.record(z.string(), z.string().trim());
      `,
    },
    {
      name: 'transform on value schema with multiple methods',
      code: dedent`
        import * as z from 'zod';
        const config = z.record(z.string(), z.string().trim().toLowerCase());
      `,
    },
    {
      name: 'normalize on value schema (not key) is fine',
      code: dedent`
        import * as z from 'zod';
        const config = z.record(z.string(), z.string().normalize());
      `,
    },
    {
      name: 'overwrite on value schema (not key) is fine',
      code: dedent`
        import * as z from 'zod';
        const config = z.record(z.string(), z.string().overwrite((value) => value.trim()));
      `,
    },
    {
      name: 'not zod.record',
      code: 'const config = someOtherLib.record(z.string().trim(), z.unknown());',
    },
    {
      name: 'named import without transforms',
      code: dedent`
        import { record, string } from 'zod';
        const config = record(string(), string());
      `,
    },
    {
      name: 'named imports with validators',
      code: dedent`
        import { record, string } from 'zod';
        const config = record(string().min(1), string());
      `,
    },
    {
      name: 'named imports with enum key',
      code: dedent`
        import { record } from 'zod';
        import { z } from 'zod';
        const config = record(z.enum(['a', 'b']), z.unknown());
      `,
    },
    {
      name: 'named imports with number key',
      code: dedent`
        import { record, number } from 'zod';
        const config = record(number(), string());
      `,
    },
    {
      name: 'named imports with transform on value schema',
      code: dedent`
        import { record, string } from 'zod';
        const config = record(string(), string().trim());
      `,
    },
    {
      name: 'named z import (acts as namespace)',
      code: dedent`
        import { z } from 'zod';
        const config = z.record(z.string(), z.unknown());
      `,
    },
    {
      name: 'named z import with validators',
      code: dedent`
        import { z } from 'zod';
        const config = z.record(z.string().min(1), z.unknown());
      `,
    },
  ],
  invalid: [
    {
      name: 'trim on key schema',
      code: dedent`
        import * as z from 'zod';
        const config = z.record(z.string().trim(), z.unknown());
      `,
      errors: [{ messageId: 'noTransformInRecordKey' }],
    },
    {
      name: 'toLowerCase on key schema',
      code: dedent`
        import * as z from 'zod';
        const config = z.record(z.string().toLowerCase(), z.unknown());
      `,
      errors: [{ messageId: 'noTransformInRecordKey' }],
    },
    {
      name: 'toUpperCase on key schema',
      code: dedent`
        import * as z from 'zod';
        const config = z.record(z.string().toUpperCase(), z.number());
      `,
      errors: [{ messageId: 'noTransformInRecordKey' }],
    },
    {
      name: 'transform method on key schema',
      code: dedent`
        import * as z from 'zod';
        const config = z.record(z.string().transform((v) => v.trim()), z.unknown());
      `,
      errors: [{ messageId: 'noTransformInRecordKey' }],
    },
    {
      name: 'normalize on key schema',
      code: dedent`
        import * as z from 'zod';
        const config = z.record(z.string().normalize(), z.unknown());
      `,
      errors: [{ messageId: 'noTransformInRecordKey' }],
    },
    {
      name: 'overwrite on key schema',
      code: dedent`
        import * as z from 'zod';
        const config = z.record(z.string().overwrite((value) => value.trim()), z.unknown());
      `,
      errors: [{ messageId: 'noTransformInRecordKey' }],
    },
    {
      name: 'chained transforms on key schema',
      code: dedent`
        import * as z from 'zod';
        const config = z.record(z.string().trim().toLowerCase(), z.unknown());
      `,
      errors: [{ messageId: 'noTransformInRecordKey' }],
    },
    {
      name: 'transform after validator on key schema',
      code: dedent`
        import * as z from 'zod';
        const config = z.record(z.string().min(1).trim(), z.unknown());
      `,
      errors: [{ messageId: 'noTransformInRecordKey' }],
    },
    {
      name: 'named import with trim',
      code: dedent`
        import { record, string } from 'zod';
        const config = record(string().trim(), string());
      `,
      errors: [{ messageId: 'noTransformInRecordKey' }],
    },
    {
      name: 'named import with toLowerCase',
      code: dedent`
        import { record, string } from 'zod';
        const config = record(string().toLowerCase(), string());
      `,
      errors: [{ messageId: 'noTransformInRecordKey' }],
    },
    {
      name: 'named import with toUpperCase',
      code: dedent`
        import { record, string } from 'zod';
        const config = record(string().toUpperCase(), string());
      `,
      errors: [{ messageId: 'noTransformInRecordKey' }],
    },
    {
      name: 'named import with chained transforms',
      code: dedent`
        import { record, string } from 'zod';
        const config = record(string().trim().toLowerCase(), string());
      `,
      errors: [{ messageId: 'noTransformInRecordKey' }],
    },
    {
      name: 'named import with map method',
      code: dedent`
        import { record, string } from 'zod';
        const config = record(string().map((v) => v.trim()), string());
      `,
      errors: [{ messageId: 'noTransformInRecordKey' }],
    },
    {
      name: 'named import with normalize',
      code: dedent`
        import { record, string } from 'zod';
        const config = record(string().normalize(), string());
      `,
      errors: [{ messageId: 'noTransformInRecordKey' }],
    },
    {
      name: 'named z import with trim',
      code: dedent`
        import { z } from 'zod';
        const config = z.record(z.string().trim(), z.unknown());
      `,
      errors: [{ messageId: 'noTransformInRecordKey' }],
    },
    {
      name: 'named z import with toLowerCase',
      code: dedent`
        import { z } from 'zod';
        const config = z.record(z.string().toLowerCase(), z.unknown());
      `,
      errors: [{ messageId: 'noTransformInRecordKey' }],
    },
    {
      name: 'named z import with chained transforms',
      code: dedent`
        import { z } from 'zod';
        const config = z.record(z.string().trim().toUpperCase(), z.unknown());
      `,
      errors: [{ messageId: 'noTransformInRecordKey' }],
    },
    {
      name: 'named z import with overwrite',
      code: dedent`
        import { z } from 'zod';
        const config = z.record(z.string().overwrite((value) => value.trim()), z.unknown());
      `,
      errors: [{ messageId: 'noTransformInRecordKey' }],
    },
    {
      name: 'real-world example with data loss',
      code: dedent`
        import * as z from 'zod';
        const schema = z.record(z.string().trim(), z.unknown());
        const input = { " id ": "abc-123", "id": "def-456" };
        const result = schema.parse(input);
      `,
      errors: [{ messageId: 'noTransformInRecordKey' }],
    },
    {
      name: 'map method on key schema',
      code: dedent`
        import * as z from 'zod';
        const config = z.record(z.string().map((v) => v.trim()), z.unknown());
      `,
      errors: [{ messageId: 'noTransformInRecordKey' }],
    },
  ],
});
