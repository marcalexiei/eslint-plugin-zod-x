# eslint-plugin-zod-x

[![CI][CIBadge]][CIURL]
[![Code style: prettier][CodeStyleBadge]][CodeStyleURL]
[![Lint: eslint][lintBadge]][lintURL]
[![npm version][npmVersionBadge]][npmVersionURL]
[![issues][issuesBadge]][issuesURL]

[CIBadge]: https://img.shields.io/github/actions/workflow/status/marcalexiei/eslint-plugin-zod-x/ci.yml?style=for-the-badge&logo=github&event=push&label=CI
[CIURL]: https://github.com/marcalexiei/eslint-plugin-zod-x/actions/workflows/CI.yml/badge.svg
[CodeStyleBadge]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=for-the-badge&logo=prettier
[CodeStyleURL]: https://prettier.io
[npmVersionBadge]: https://img.shields.io/npm/v/eslint-plugin-zod-x.svg?style=for-the-badge&logo=npm
[npmVersionURL]: https://www.npmjs.com/package/eslint-plugin-zod-x
[lintBadge]: https://img.shields.io/badge/lint-eslint-3A33D1?logo=eslint&style=for-the-badge
[lintURL]: https://eslint.org
[issuesBadge]: https://img.shields.io/github/issues/marcalexiei/eslint-plugin-zod-x.svg?style=for-the-badge
[issuesURL]: https://github.com/marcalexiei/eslint-plugin-zod-x/issues

Custom ESLint rules for [Zod](https://github.com/colinhacks/zod) and [ESLint@9](https://eslint.org).

## Rules

<!-- begin auto-generated rules list -->

💼 Configurations enabled in.\
✅ Set in the `recommended` configuration.\
🔧 Automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/user-guide/command-line-interface#--fix).\
💡 Manually fixable by [editor suggestions](https://eslint.org/docs/latest/use/core-concepts#rule-suggestions).

| Name                                                             | Description                                                             | 💼  | 🔧  | 💡  |
| :--------------------------------------------------------------- | :---------------------------------------------------------------------- | :-- | :-- | :-- |
| [array-style](docs/rules/array-style.md)                         | Enforce consistent Zod array style                                      | ✅  | 🔧  |     |
| [no-any](docs/rules/no-any.md)                                   | Disallow usage of z.any() in Zod schemas                                | ✅  |     | 💡  |
| [no-empty-custom-schema](docs/rules/no-empty-custom-schema.md)   | Disallow usage of z.custom() without arguments                          | ✅  |     |     |
| [no-throw-in-refine](docs/rules/no-throw-in-refine.md)           | Disallow throwing errors directly inside Zod refine callbacks           | ✅  |     |     |
| [prefer-meta](docs/rules/prefer-meta.md)                         | Enforce usage of .meta() over .describe()                               | ✅  | 🔧  |     |
| [prefer-meta-last](docs/rules/prefer-meta-last.md)               | Enforce .meta() as last method                                          | ✅  | 🔧  |     |
| [prefer-namespace-import](docs/rules/prefer-namespace-import.md) | Enforce importing zod as a namespace import (import \* as z from 'zod') | ✅  | 🔧  |     |
| [prefer-strict-object](docs/rules/prefer-strict-object.md)       | Enforce usage of .strictObject() over .object() and/or .looseObject()   |     |     |     |

<!-- end auto-generated rules list -->

## Installation

```shell
npm i --save-dev eslint eslint-plugin-zod-x
```

```shell
yarn add --dev eslint eslint-plugin-zod-x
```

```shell
pnpm add --save-dev eslint eslint-plugin-zod-x
```

## Configuration

### Typescript

```js
// eslint.config.js
import eslint from '@eslint/js';
import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';
import eslintPluginZodX from 'eslint-plugin-zod-x';

export default defineConfig(
  eslint.configs.recommended,
  tseslint.configs.recommendedTypeChecked,
  eslintPluginZodX.configs.recommended,
  {
    languageOptions: {
      // ...
    },
  },
);
```

### Javascript

TODO (?)
