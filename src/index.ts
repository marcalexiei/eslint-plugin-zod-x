import type { TSESLint } from '@typescript-eslint/utils';

import { PLUGIN_NAME, PLUGIN_VERSION } from './meta.js';
import { createRecommendedConfig } from './configs/recommended.js';
import { preferNamespaceImport } from './rules/prefer-namespace-import.js';
import { arrayStyle } from './rules/array-style.js';

const eslintPluginZodX: TSESLint.FlatConfig.Plugin = {
  meta: {
    name: PLUGIN_NAME,
    version: PLUGIN_VERSION,
  },
  rules: {
    /* eslint-disable @typescript-eslint/naming-convention */
    'prefer-namespace-import': preferNamespaceImport,
    'array-style': arrayStyle,
    /* eslint-enable @typescript-eslint/naming-convention */
  },
  processors: {},
};

Object.assign(eslintPluginZodX, {
  configs: {
    recommended: createRecommendedConfig({
      plugin: eslintPluginZodX,
    }),
  },
});

export { eslintPluginZodX };
