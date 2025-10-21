import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, it, expect, expectTypeOf } from 'vitest';

import plugin from './index.js';

describe('plugin export', async () => {
  const dirname = path.dirname(fileURLToPath(import.meta.url));

  const allRuleNames = (
    await fs.readdir(path.join(dirname, 'rules'), {
      withFileTypes: true,
    })
  )
    .filter((item) => item.isFile() && !item.name.includes('.spec'))
    .map((item) => path.basename(item.name, '.ts'));

  it('should include all rules created inside `src/rules` folder', () => {
    const _plugin = plugin as typeof plugin & {
      rules: Record<string, unknown>;
    };
    expect(_plugin.rules).toBeTypeOf('object');
    expect(_plugin.meta.name).toBeTypeOf('string');
    expect(_plugin.meta.version).toBeTypeOf('string');
    expect(Object.keys(_plugin.rules)).toEqual(
      expect.arrayContaining(allRuleNames),
    );
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
