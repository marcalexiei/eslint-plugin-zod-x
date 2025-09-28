import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, it, expect } from 'vitest';

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
    expect(plugin.rules).toBeTypeOf('object');
    expect(plugin.meta.name).toBeTypeOf('string');
    expect(plugin.meta.version).toBeTypeOf('string');
    expect(Object.keys(plugin.rules)).toEqual(
      expect.arrayContaining(allRuleNames),
    );
  });

  it('should include recommend config', () => {
    const recommendedConfig = plugin.configs.recommended;
    expect(recommendedConfig).toBeTypeOf('object');
    expect(recommendedConfig.name).toBe('eslint-plugin-zod-x/recommended');
    expect(recommendedConfig.plugins).toHaveProperty('zod-x');
    expect(recommendedConfig.rules).toBeTypeOf('object');
  });
});
