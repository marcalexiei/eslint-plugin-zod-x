import type { ESLint, Linter, Rule } from 'eslint';

import { PLUGIN_NAME, PLUGIN_VERSION } from './meta.js';
import { arrayStyle } from './rules/array-style.js';
import { consistentImportSource } from './rules/consistent-import-source.js';
import { noAny } from './rules/no-any.js';
import { noEmptyCustomSchema } from './rules/no-empty-custom-schema.js';
import { noNumberSchemaWithInt } from './rules/no-number-schema-with-int.js';
import { noOptionalAndDefaultTogether } from './rules/no-optional-and-default-together.js';
import { noThrowInRefine } from './rules/no-throw-in-refine.js';
import { preferMeta } from './rules/prefer-meta.js';
import { preferMetaLast } from './rules/prefer-meta-last.js';
import { preferNamespaceImport } from './rules/prefer-namespace-import.js';
import { preferStrictObjet } from './rules/prefer-strict-object.js';
import { requireErrorMessage } from './rules/require-error-message.js';
import { requireSchemaSuffix } from './rules/require-schema-suffix.js';
import { schemaErrorPropertyStyle } from './rules/schema-error-property-style.js';
import { requireBrandTypeParameter } from './rules/require-brand-type-parameter.js';

interface CompatibleConfig {
  name?: string;
  rules?: object;
  plugins?: Record<string, CompatiblePlugin>;
}

interface CompatiblePlugin {
  meta: {
    name: string;
    version: string;
  };
}

const eslintPluginZodX = {
  meta: {
    name: PLUGIN_NAME,
    version: PLUGIN_VERSION,
  },
  rules: {
    /* eslint-disable @typescript-eslint/naming-convention */
    'array-style': arrayStyle,
    'consistent-import-source': consistentImportSource,
    'no-any': noAny,
    'no-empty-custom-schema': noEmptyCustomSchema,
    'no-number-schema-with-int': noNumberSchemaWithInt,
    'no-optional-and-default-together': noOptionalAndDefaultTogether,
    'no-throw-in-refine': noThrowInRefine,
    'prefer-meta': preferMeta,
    'prefer-meta-last': preferMetaLast,
    'prefer-namespace-import': preferNamespaceImport,
    'prefer-strict-object': preferStrictObjet,
    'require-brand-type-parameter': requireBrandTypeParameter,
    'require-error-message': requireErrorMessage,
    'require-schema-suffix': requireSchemaSuffix,
    'schema-error-property-style': schemaErrorPropertyStyle,
    /* eslint-enable @typescript-eslint/naming-convention */
  } as unknown as Record<string, Rule.RuleModule>,
} satisfies ESLint.Plugin as CompatiblePlugin;

const recommendedConfig = {
  name: `${PLUGIN_NAME}/recommended`,
  files: ['**/*.{js,mjs,cjs,jsx,mjsx,ts,tsx,mtsx}'],
  /* eslint-disable @typescript-eslint/naming-convention */
  plugins: {
    'zod-x': eslintPluginZodX,
  },
  rules: {
    'zod-x/array-style': 'error',
    'zod-x/no-any': 'error',
    'zod-x/no-empty-custom-schema': 'error',
    'zod-x/no-number-schema-with-int': 'error',
    'zod-x/no-optional-and-default-together': 'error',
    'zod-x/no-throw-in-refine': 'error',
    'zod-x/prefer-meta': 'error',
    'zod-x/prefer-meta-last': 'error',
    'zod-x/prefer-namespace-import': 'error',
    'zod-x/require-brand-type-parameter': 'error',
    'zod-x/require-error-message': 'error',
    'zod-x/require-schema-suffix': 'error',
  },
  /* eslint-enable @typescript-eslint/naming-convention */
} satisfies Linter.Config as CompatibleConfig;

export default {
  ...eslintPluginZodX,
  configs: {
    recommended: recommendedConfig,
  },
} satisfies ESLint.Plugin;
/**
 * why `satisfies`?
 * @see https://github.com/marcalexiei/eslint-plugin-zod-x/issues/49
 */
