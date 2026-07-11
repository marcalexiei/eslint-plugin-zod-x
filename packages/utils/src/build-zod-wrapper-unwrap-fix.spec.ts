import type { TSESLint, TSESTree } from '@typescript-eslint/utils';
import { AST_NODE_TYPES } from '@typescript-eslint/utils';
import { describe, expect, it } from 'vitest';

import { buildZodWrapperUnwrapFix } from './build-zod-wrapper-unwrap-fix.js';

function makeFixer(): {
  fixer: TSESLint.RuleFixer;
  calls: { replaced?: { node: TSESTree.Node; text: string } };
} {
  const calls: { replaced?: { node: TSESTree.Node; text: string } } = {};
  const fixer = {
    replaceText(node: TSESTree.Node, text: string) {
      calls.replaced = { node, text };
      return { range: node.range, text };
    },
  } as unknown as TSESLint.RuleFixer;
  return { fixer, calls };
}

function makeSourceCode(text: string): Readonly<TSESLint.SourceCode> {
  return { getText: () => text } as unknown as Readonly<TSESLint.SourceCode>;
}

function makeCall(args: Array<TSESTree.CallExpressionArgument>): TSESTree.CallExpression {
  return {
    type: AST_NODE_TYPES.CallExpression,
    arguments: args,
    range: [0, 20],
  } as unknown as TSESTree.CallExpression;
}

function makeArgument(type: AST_NODE_TYPES): TSESTree.CallExpressionArgument {
  return { type, range: [11, 19] } as unknown as TSESTree.CallExpressionArgument;
}

describe('buildZodWrapperUnwrapFix', () => {
  it('replaces the wrapper call with its argument text', () => {
    const inner = makeArgument(AST_NODE_TYPES.CallExpression);
    const wrapperCall = makeCall([inner]);
    const { fixer, calls } = makeFixer();

    const fix = buildZodWrapperUnwrapFix({
      fixer,
      sourceCode: makeSourceCode('z.string()'),
      wrapperCall,
    });

    expect(fix).not.toBeNull();
    expect(calls.replaced).toStrictEqual({ node: wrapperCall, text: 'z.string()' });
  });

  it('returns null when the call has no arguments', () => {
    const { fixer } = makeFixer();

    const fix = buildZodWrapperUnwrapFix({
      fixer,
      sourceCode: makeSourceCode(''),
      wrapperCall: makeCall([]),
    });

    expect(fix).toBeNull();
  });

  it('returns null when the call has more than one argument', () => {
    const { fixer } = makeFixer();

    const fix = buildZodWrapperUnwrapFix({
      fixer,
      sourceCode: makeSourceCode(''),
      wrapperCall: makeCall([
        makeArgument(AST_NODE_TYPES.CallExpression),
        makeArgument(AST_NODE_TYPES.Literal),
      ]),
    });

    expect(fix).toBeNull();
  });

  it('returns null for a spread argument', () => {
    const { fixer } = makeFixer();

    const fix = buildZodWrapperUnwrapFix({
      fixer,
      sourceCode: makeSourceCode(''),
      wrapperCall: makeCall([makeArgument(AST_NODE_TYPES.SpreadElement)]),
    });

    expect(fix).toBeNull();
  });
});
