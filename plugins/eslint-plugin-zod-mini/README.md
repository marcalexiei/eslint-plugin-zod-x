# eslint-plugin-zod-mini

[![CI Status][CIBadge]][CIURL]
[![Code style: prettier][CodeStyleBadge]][CodeStyleURL]
[![Lint: eslint][lintBadge]][lintURL]
[![Open on npmx][npmVersionBadge]][npmVersionURL]
[![Open issue tracker][issuesBadge]][issuesURL]

[CIBadge]: https://img.shields.io/github/actions/workflow/status/marcalexiei/eslint-zod/ci.yml?style=for-the-badge&logo=github&event=push&label=CI
[CIURL]: https://github.com/marcalexiei/eslint-zod/actions/workflows/CI.yml/badge.svg
[CodeStyleBadge]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=for-the-badge&logo=prettier
[CodeStyleURL]: https://prettier.io
[npmVersionBadge]: https://img.shields.io/npm/v/eslint-plugin-zod-mini.svg?style=for-the-badge&logo=npm
[npmVersionURL]: https://npmx.dev/package/eslint-plugin-zod-mini
[lintBadge]: https://img.shields.io/badge/lint-eslint-3A33D1?logo=eslint&style=for-the-badge
[lintURL]: https://eslint.org
[issuesBadge]: https://img.shields.io/github/issues/marcalexiei/eslint-zod.svg?style=for-the-badge
[issuesURL]: https://github.com/marcalexiei/eslint-zod/issues

[ESLint](https://eslint.org) plugin that adds custom linting rules to enforce best practices when using [Zod Mini](https://zod.dev/packages/mini) (`zod/mini`).

It can also work with [Oxlint](https://oxc.rs/docs/guide/usage/linter.html)!\
Find out more about [Oxlint's `jsPLugins`](https://oxc.rs/docs/guide/usage/linter/js-plugins.html).

## Rules

<!-- begin auto-generated rules list -->

💼 Configurations enabled in.\
✅ Set in the `recommended` configuration.\
🔧 Automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/user-guide/command-line-interface#--fix).\
💡 Manually fixable by [editor suggestions](https://eslint.org/docs/latest/use/core-concepts#rule-suggestions).

| Name                                                                                     | Description                                                                                                              | 💼  | 🔧  | 💡  |
| :--------------------------------------------------------------------------------------- | :----------------------------------------------------------------------------------------------------------------------- | :-- | :-- | :-- |
| [consistent-import](docs/rules/consistent-import.md)                                     | Enforce a consistent import style for Zod Mini                                                                           | ✅  | 🔧  |     |
| [consistent-import-source](docs/rules/consistent-import-source.md)                       | Enforce consistent source from Zod Mini imports                                                                          |     |     | 💡  |
| [consistent-object-schema-type](docs/rules/consistent-object-schema-type.md)             | Enforce consistent usage of Zod Mini schema methods                                                                      |     |     | 💡  |
| [consistent-schema-output-type-style](docs/rules/consistent-schema-output-type-style.md) | Enforce consistent use of z.infer or z.output for schema type inference                                                  |     | 🔧  |     |
| [consistent-schema-var-name](docs/rules/consistent-schema-var-name.md)                   | Enforce a consistent naming convention for Zod Mini schema variables                                                     | ✅  |     |     |
| [no-any-schema](docs/rules/no-any-schema.md)                                             | Disallow usage of `z.any()` in Zod Mini schemas                                                                          | ✅  |     | 💡  |
| [no-empty-custom-schema](docs/rules/no-empty-custom-schema.md)                           | Disallow usage of `z.custom()` without arguments                                                                         | ✅  |     |     |
| [no-throw-in-refine](docs/rules/no-throw-in-refine.md)                                   | Disallow throwing errors directly inside Zod Mini refine callbacks                                                       | ✅  |     |     |
| [no-transform-in-record-key](docs/rules/no-transform-in-record-key.md)                   | Disallow transforms in z.record() key schemas, which can cause silent key mutations and data loss through key collisions |     |     |     |
| [no-unknown-schema](docs/rules/no-unknown-schema.md)                                     | Disallow usage of `z.unknown()` in Zod Mini schemas                                                                      |     |     |     |
| [prefer-enum-over-literal-union](docs/rules/prefer-enum-over-literal-union.md)           | Prefer `z.enum()` over `z.union()` when all members are string literals.                                                 | ✅  | 🔧  |     |
| [prefer-meta](docs/rules/prefer-meta.md)                                                 | Enforce usage of `z.meta()` over `z.describe()`                                                                          | ✅  | 🔧  |     |
| [require-brand-type-parameter](docs/rules/require-brand-type-parameter.md)               | Require type parameter on `.brand()` functions                                                                           | ✅  |     | 💡  |
| [require-error-message](docs/rules/require-error-message.md)                             | Enforce that custom refinements include an error message                                                                 | ✅  | 🔧  |     |
| [schema-error-property-style](docs/rules/schema-error-property-style.md)                 | Enforce consistent style for error messages in Zod Mini schema validation (using ESQuery patterns)                       |     |     |     |

<!-- end auto-generated rules list -->

## Installation

### ESLint

Install `eslint` and `eslint-plugin-zod-mini` using your preferred package manager:

```shell
npm i --save-dev eslint eslint-plugin-zod-mini
```

```shell
yarn add --dev eslint eslint-plugin-zod-mini
```

```shell
pnpm add --save-dev eslint eslint-plugin-zod-mini
```

#### ESLint Configuration

1. Import the plugin

   ```ts
   import eslintPluginZodMini from 'eslint-plugin-zod-mini';
   ```

2. Add `recommended` config to your ESLint setup

   ```ts
   eslintPluginZodMini.configs.recommended,
   ```

Here's a minimal example using the flat config format:

```ts
// eslint.config.js
import { defineConfig } from 'eslint/config';
import eslint from '@eslint/js';
import eslintPluginZodMini from 'eslint-plugin-zod-mini';

export default defineConfig(eslint.configs.recommended, eslintPluginZodMini.configs.recommended);
```

### Oxlint

Install `oxlint` and `eslint-plugin-zod-mini` using your preferred package manager:

```shell
npm i --save-dev oxlint eslint-plugin-zod-mini
```

```shell
yarn add --dev oxlint eslint-plugin-zod-mini
```

```shell
pnpm add --save-dev oxlint eslint-plugin-zod-mini
```

#### Oxlint Configuration

1. Import the plugin

   ```ts
   import eslintPluginZodMini from 'eslint-plugin-zod-mini';
   ```

2. Add `eslint-plugin-zod-mini` to the `jsPlugins` key

   ```ts
   {
     jsPlugins: ['eslint-plugin-zod-mini'],
     // ...
   }
   ```

3. Add `eslintPluginZodMini.configs.recommended.rules` to your Oxlint config.\
   Alternatively you can specify the rules manually

Here's a minimal example using the flat config format:

```ts
// oxlint.config.ts
import eslintPluginZodMini from 'eslint-plugin-zod-mini';
import { defineConfig } from 'oxlint';

export default defineConfig({
  jsPlugins: ['eslint-plugin-zod-mini'],
  rules: {
    ...eslintPluginZodMini.configs.recommended.rules,
  },
});
```

## Zod peer dependency version

`eslint-plugin-zod-mini` is designed for projects that use `zod@^4` (specifically `zod/mini`).
While the plugin analyzes Zod Mini schemas in your code,
it doesn't import or depend on Zod at runtime.
To document this relationship without forcing installation,
Zod is declared as an optional peer dependency in the plugin's `package.json`.

If your project uses Zod Mini, the plugin will automatically lint your schemas.
If you're not using Zod (for example, in a separate ESLint workspace), you don't need to install it.
