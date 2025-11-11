import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, it, expect, expectTypeOf, assert } from 'vitest';
import type { TSESLint } from '@typescript-eslint/utils';

import plugin from './index.js';

describe('plugin export', async () => {
  const dirname = path.dirname(fileURLToPath(import.meta.url));

  const allRulesPaths = (
    await fs.readdir(path.join(dirname, 'rules'), {
      withFileTypes: true,
    })
  ).filter((item) => item.isFile() && !item.name.includes('.spec'));

  const _plugin = plugin as typeof plugin & {
    rules: Record<string, unknown>;
  };

  it('should include all meta', () => {
    expect(_plugin.meta.name).toBeTypeOf('string');
    expect(_plugin.meta.version).toBeTypeOf('string');
  });

  it('should include all rules created inside `src/rules` folder', () => {
    const allRuleNames = allRulesPaths.map((item) =>
      path.basename(item.name, '.ts'),
    );
    expect(_plugin.rules).toBeTypeOf('object');
    expect(Object.keys(_plugin.rules)).toEqual(
      expect.arrayContaining(allRuleNames),
    );
  });

  /**
   * @see https://github.com/marcalexiei/eslint-plugin-zod-x/pull/99
   * @see https://github.com/marcalexiei/eslint-plugin-zod-x/pull/102
   */
  it('all rules should the name matching their documentation file', () => {
    for (const [ruleName, rule] of Object.entries(_plugin.rules)) {
      const ruleDocsURL = (rule as TSESLint.RuleModule<string>).meta.docs?.url;

      assert(ruleDocsURL);

      const docsFileName = ruleDocsURL.split('/').pop()!;

      expect(path.basename(docsFileName, '.md')).toBe(ruleName);
    }
  });
});

describe('recommended config', () => {
  it('has correct shape', () => {
    const recommendedConfig = plugin.configs.recommended;
    expect(recommendedConfig).toBeTypeOf('object');
    expect(recommendedConfig.name).toBe('eslint-plugin-zod-x/recommended');
    expect(recommendedConfig.plugins).toHaveProperty('zod-x');
    expect(recommendedConfig.rules).toBeTypeOf('object');
  });

  it('has correct type shape', () => {
    expectTypeOf(plugin.configs).toHaveProperty('recommended').toBeObject();

    // keys different from recommended should not be types
    expectTypeOf(plugin.configs).not.toMatchObjectType<{
      otherObject: object;
    }>();

    expect(1).toBe(1);
  });
});
