/* eslint import-x/no-extraneous-dependencies: ['error', { devDependencies: true }] */
import { RuleTester } from '@typescript-eslint/rule-tester';
import { test, afterAll } from 'vitest';

/** @see https://eslint.org/docs/latest/integrate/nodejs-api#customizing-ruletester */

RuleTester.describe = function describe(
  _,
  method: (...args: Array<unknown>) => unknown,
): unknown {
  return method.call(this);
};

RuleTester.it = function it(
  text: string,
  method: (...args: Array<unknown>) => unknown,
): void {
  test(text, method);
};

RuleTester.afterAll = afterAll;
