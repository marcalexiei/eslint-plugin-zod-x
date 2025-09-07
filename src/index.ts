import type { TSESLint } from '@typescript-eslint/utils';

import { PLUGIN_NAME, PLUGIN_VERSION } from './meta.js';
import { arrayStyle } from './rules/array-style.js';
import { preferNamespaceImport } from './rules/prefer-namespace-import.js';

const eslintPluginZodX: TSESLint.FlatConfig.Plugin = {
  meta: {
    name: PLUGIN_NAME,
    version: PLUGIN_VERSION,
  },
  configs: {},
  rules: {
    /* eslint-disable @typescript-eslint/naming-convention */
    'array-style': arrayStyle,
    'prefer-namespace-import': preferNamespaceImport,
    /* eslint-enable @typescript-eslint/naming-convention */
  },
};

Object.assign(eslintPluginZodX.configs!, {
  recommended: {
    name: `${PLUGIN_NAME}/recommended`,
    files: ['**/*.{js,mjs,cjs,jsx,mjsx,ts,tsx,mtsx}'],
    /* eslint-disable @typescript-eslint/naming-convention */
    plugins: {
      'zod-x': eslintPluginZodX,
    },
    rules: {
      'zod-x/array-style': ['error'],
      'zod-x/prefer-namespace-import': ['error'],
    },
    /* eslint-enable @typescript-eslint/naming-convention */
  },
});

export default eslintPluginZodX;
