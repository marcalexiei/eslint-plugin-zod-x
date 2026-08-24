import { RuleTester } from '@typescript-eslint/rule-tester';
import { afterAll, describe, it } from 'vitest';

/** @see https://eslint.org/docs/latest/integrate/nodejs-api#customizing-ruletester */

RuleTester.describe = (...args): void => {
  describe(...args);
};
RuleTester.describeSkip = (...args): void => {
  describe.skip(...args);
};

RuleTester.it = it;
RuleTester.itOnly = it.only;
RuleTester.itSkip = it.skip;

RuleTester.afterAll = afterAll;
