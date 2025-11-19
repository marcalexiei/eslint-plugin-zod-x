import { RuleTester } from '@typescript-eslint/rule-tester';
import { afterAll, describe, it } from 'vitest';

/** @see https://eslint.org/docs/latest/integrate/nodejs-api#customizing-ruletester */

RuleTester.describe = describe;
RuleTester.describeSkip = describe.skip;

RuleTester.it = it;
RuleTester.itOnly = it.only;
RuleTester.itSkip = it.skip;

RuleTester.afterAll = afterAll;
