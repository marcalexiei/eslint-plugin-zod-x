import { describe, expect, it } from 'vitest';

import type { ZodSchemaMeta } from './detect-zod-schema-root-node.js';
import { getZodChainedMethodNames } from './get-zod-chained-method-names.js';

function meta(schemaDecl: ZodSchemaMeta['schemaDecl'], methods: Array<string>): ZodSchemaMeta {
  return { schemaDecl, schemaType: methods.at(0) ?? '', methods };
}

describe('getZodChainedMethodNames', () => {
  it('drops the factory for a namespace schema: z.number().safe()', () => {
    expect(getZodChainedMethodNames(meta('namespace', ['number', 'safe']))).toStrictEqual(['safe']);
  });

  it("drops a computed factory too: z['number']().safe()", () => {
    // Detection resolves the literal key, so the factory is still `methods[0]`.
    expect(getZodChainedMethodNames(meta('namespace', ['number', 'safe']))).toStrictEqual(['safe']);
  });

  it('keeps every name for a named import, whose factory is the callee: number().safe()', () => {
    expect(getZodChainedMethodNames(meta('named', ['safe']))).toStrictEqual(['safe']);
  });

  it('does not treat an aliased factory as a chained method', () => {
    // `import { number as safe }; safe().min(0)` — `safe` is the callee
    // identifier and never reaches `methods`, so only `min` is chained.
    expect(getZodChainedMethodNames(meta('named', ['min']))).toStrictEqual(['min']);
  });

  it('returns an empty list for a bare namespace factory: z.string()', () => {
    expect(getZodChainedMethodNames(meta('namespace', ['string']))).toStrictEqual([]);
  });

  it('returns an empty list for a bare named factory: string()', () => {
    expect(getZodChainedMethodNames(meta('named', []))).toStrictEqual([]);
  });

  it('does not mutate the source metadata', () => {
    const source = meta('namespace', ['number', 'safe']);
    getZodChainedMethodNames(source);
    expect(source.methods).toStrictEqual(['number', 'safe']);
  });
});
