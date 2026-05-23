/**
 * Defines the set of import source strings (e.g. `'zod'`, `'zod/mini'`) that a
 * plugin considers in-scope. Used by each plugin's rules to ignore files that
 * import from a different Zod surface.
 *
 * @example
 * ```ts
 * const scope = new ZodImportScope(['zod', 'zod/v4'] as const);
 * scope.isAllowed('zod');      // true
 * scope.isAllowed('zod/mini'); // false
 * ```
 */
export class ZodImportScope<TSources extends Array<string> = Array<string>> {
  /** The list of import source strings recognised by this scope. */
  readonly sources: TSources;

  constructor(sources: TSources) {
    this.sources = sources;
  }

  /** Returns `true` if `source` is one of the scope's recognised import sources. */
  isAllowed(source: string): source is TSources[number] {
    return this.sources.includes(source);
  }
}

/** Pre-built scope for `eslint-plugin-zod`. Recognises `'zod'`, `'zod/v4'`, `'zod/v3'`. */
export const zodImportScope = new ZodImportScope(['zod', 'zod/v4', 'zod/v3'] as const);

/** Pre-built scope for `eslint-plugin-zod-mini`. Recognises `'zod/mini'`, `'zod/v4-mini'`. */
export const zodMiniImportScope = new ZodImportScope(['zod/mini', 'zod/v4-mini'] as const);

/** Pre-built scope for `eslint-plugin-zod-core`. Recognises `'zod/v4/core'`. */
export const zodCoreImportScope = new ZodImportScope(['zod/v4/core'] as const);
