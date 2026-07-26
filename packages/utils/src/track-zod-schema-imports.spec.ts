import { AST_NODE_TYPES } from '@typescript-eslint/utils';
import type { TSESTree } from '@typescript-eslint/utils';
import { describe, expect, it } from 'vitest';

import { zodImportScope, zodMiniImportScope } from './zod-import-scope.js';

// --- minimal AST mock helpers ---

function makeIdent(name: string): TSESTree.Identifier {
  return {
    type: AST_NODE_TYPES.Identifier,
    name,
  } as unknown as TSESTree.Identifier;
}

function makeME(object: TSESTree.Expression, propertyName: string): TSESTree.MemberExpression {
  return {
    type: AST_NODE_TYPES.MemberExpression,
    object,
    property: makeIdent(propertyName),
    computed: false,
  } as unknown as TSESTree.MemberExpression;
}

function makeCall(
  callee: TSESTree.Expression,
  args: Array<TSESTree.Expression> = [],
): TSESTree.CallExpression {
  return {
    type: AST_NODE_TYPES.CallExpression,
    callee,
    arguments: args,
  } as unknown as TSESTree.CallExpression;
}

function mockImportDecl(
  source: string,
  specifiers: Array<TSESTree.ImportClause>,
): TSESTree.ImportDeclaration {
  return {
    type: AST_NODE_TYPES.ImportDeclaration,
    source: { value: source } as TSESTree.StringLiteral,
    specifiers,
  } as unknown as TSESTree.ImportDeclaration;
}

function mockNamespaceSpec(localName: string): TSESTree.ImportNamespaceSpecifier {
  return {
    type: AST_NODE_TYPES.ImportNamespaceSpecifier,
    local: makeIdent(localName),
  } as unknown as TSESTree.ImportNamespaceSpecifier;
}

function mockDefaultSpec(localName: string): TSESTree.ImportDefaultSpecifier {
  return {
    type: AST_NODE_TYPES.ImportDefaultSpecifier,
    local: makeIdent(localName),
  } as unknown as TSESTree.ImportDefaultSpecifier;
}

function mockNamedSpec(localName: string, originalName?: string): TSESTree.ImportSpecifier {
  return {
    type: AST_NODE_TYPES.ImportSpecifier,
    local: makeIdent(localName),
    imported: makeIdent(originalName ?? localName),
  } as unknown as TSESTree.ImportSpecifier;
}

/** `import { 'string' as s } from 'zod'` — an arbitrary module namespace name. */
function mockStringLiteralNamedSpec(
  localName: string,
  importedValue: string,
): TSESTree.ImportSpecifier {
  return {
    type: AST_NODE_TYPES.ImportSpecifier,
    local: makeIdent(localName),
    imported: { type: AST_NODE_TYPES.Literal, value: importedValue },
  } as unknown as TSESTree.ImportSpecifier;
}

// --- tests ---

describe('createTracker', () => {
  it('each createTracker() call returns an independent instance', () => {
    const a = zodImportScope.createTracker();
    const b = zodImportScope.createTracker();

    a.importDeclarationListener(mockImportDecl('zod', [mockNamespaceSpec('z')]));

    expect(a.isZodNamespace('z')).toBe(true);
    expect(b.isZodNamespace('z')).toBe(false);
  });
});

describe('importDeclarationListener', () => {
  it('tracks namespace import (import * as z)', () => {
    const tracker = zodImportScope.createTracker();
    tracker.importDeclarationListener(mockImportDecl('zod', [mockNamespaceSpec('z')]));
    expect(tracker.isZodNamespace('z')).toBe(true);
  });

  it('tracks default import (import z from "zod")', () => {
    const tracker = zodImportScope.createTracker();
    tracker.importDeclarationListener(mockImportDecl('zod', [mockDefaultSpec('z')]));
    expect(tracker.isZodNamespace('z')).toBe(true);
  });

  it('treats named import of z as a namespace (import { z } from "zod")', () => {
    const tracker = zodImportScope.createTracker();
    tracker.importDeclarationListener(mockImportDecl('zod', [mockNamedSpec('z', 'z')]));
    expect(tracker.isZodNamespace('z')).toBe(true);
  });

  it('tracks named import (import { string } from "zod")', () => {
    const tracker = zodImportScope.createTracker();
    tracker.importDeclarationListener(mockImportDecl('zod', [mockNamedSpec('string')]));
    expect(tracker.getNamedImportOriginal('string')).toBe('string');
    expect(tracker.getNamedImportLocal('string')).toBe('string');
  });

  it('tracks aliased named import (import { string as zodString })', () => {
    const tracker = zodImportScope.createTracker();
    tracker.importDeclarationListener(
      mockImportDecl('zod', [mockNamedSpec('zodString', 'string')]),
    );
    expect(tracker.getNamedImportOriginal('zodString')).toBe('string');
    expect(tracker.getNamedImportLocal('string')).toBe('zodString');
  });

  it('falls back to the local name for a string-literal import name', () => {
    // `import { 'string' as s } from 'zod'` — the imported name is a
    // StringLiteral, which carries no `name`, so the local name is used.
    const tracker = zodImportScope.createTracker();
    tracker.importDeclarationListener(
      mockImportDecl('zod', [mockStringLiteralNamedSpec('s', 'string')]),
    );
    expect(tracker.getNamedImportOriginal('s')).toBe('s');
  });

  it('ignores imports from non-zod sources', () => {
    const tracker = zodMiniImportScope.createTracker();
    tracker.importDeclarationListener(mockImportDecl('lodash', [mockNamespaceSpec('_')]));
    expect(tracker.isZodNamespace('_')).toBe(false);
  });

  it('respects allowedSource boundary (zod-mini tracker ignores zod imports)', () => {
    const tracker = zodMiniImportScope.createTracker();
    tracker.importDeclarationListener(mockImportDecl('zod', [mockNamespaceSpec('z')]));
    expect(tracker.isZodNamespace('z')).toBe(false);
  });

  it('tracks zod-mini namespace import when allowedSource is zod-mini', () => {
    const tracker = zodMiniImportScope.createTracker();
    tracker.importDeclarationListener(mockImportDecl('zod/mini', [mockNamespaceSpec('z')]));
    expect(tracker.isZodNamespace('z')).toBe(true);
  });
});

describe('collectZodChainMethods', () => {
  it('collects namespace chain: z.number().min(1)', () => {
    const tracker = zodImportScope.createTracker();

    const zIdent = makeIdent('z');
    const numberCall = makeCall(makeME(zIdent, 'number'));
    const minCall = makeCall(makeME(numberCall, 'min'), [
      { type: AST_NODE_TYPES.Literal, value: 1 } as unknown as TSESTree.Literal,
    ]);

    const methods = tracker.collectZodChainMethods(minCall);

    expect(methods.map((m) => m.name)).toStrictEqual(['number', 'min']);
    expect(methods[0]?.node).toBe(numberCall);
    expect(methods[1]?.node).toBe(minCall);
  });

  it('collects single named import: string()', () => {
    const tracker = zodImportScope.createTracker();

    const stringCall = makeCall(makeIdent('string'));
    const methods = tracker.collectZodChainMethods(stringCall);

    expect(methods.map((m) => m.name)).toStrictEqual(['string']);
    expect(methods[0]?.node).toBe(stringCall);
  });

  it('collects named import chain: string().optional()', () => {
    const tracker = zodImportScope.createTracker();

    const stringCall = makeCall(makeIdent('string'));
    const optCall = makeCall(makeME(stringCall, 'optional'));
    const methods = tracker.collectZodChainMethods(optCall);

    expect(methods.map((m) => m.name)).toStrictEqual(['string', 'optional']);
  });
});
