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
[lintBadge]: https://img.shields.io/badge/lint-eslint-3A33D1?logo=eslint&style=for-the-badge
[lintURL]: https://eslint.org
[npmVersionURL]: https://www.npmjs.com/package/eslint-plugin-zod-x
[issuesBadge]: https://img.shields.io/github/issues/marcalexiei/eslint-plugin-zod-x.svg?style=for-the-badge
[issuesURL]: https://github.com/marcalexiei/eslint-plugin-zod-x/issues

Custom ESLint rules for [Zod](https://github.com/colinhacks/zod).

## Rules

<!-- begin auto-generated rules list -->

💼 Configurations enabled in.\
✅ Set in the `recommended` configuration.\
🔧 Automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/user-guide/command-line-interface#--fix).

| Name                                                             | Description                                                             | 💼  | 🔧  |
| :--------------------------------------------------------------- | :---------------------------------------------------------------------- | :-- | :-- |
| [array-style](docs/rules/array-style.md)                         | Enforce consistent Zod array style                                      | ✅  | 🔧  |
| [no-any](docs/rules/no-any.md)                                   | Disallow usage of z.any() in Zod schemas                                | ✅  |     |
| [no-throw-in-refine](docs/rules/no-throw-in-refine.md)           | Disallow throwing errors directly inside Zod refine callbacks           | ✅  |     |
| [prefer-meta](docs/rules/prefer-meta.md)                         | Enforce usage of .meta() over .describe()                               | ✅  | 🔧  |
| [prefer-namespace-import](docs/rules/prefer-namespace-import.md) | Enforce importing zod as a namespace import (import \* as z from 'zod') | ✅  | 🔧  |

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

> [!NOTE]
> In order to replace all type occurrences typescript parser should be used

```js
// eslint.config.js
import eslintPluginZodX from 'eslint-plugin-zod-x';
import typescriptEslintParser from '@typescript-eslint/parser';

export default [
  // other configs
  // ...
  {
    ...eslintPluginZodX.configs.recommended,
    languageOptions: {
      ...eslintPluginZodX.configs.recommended.languageOptions,
      parser: typescriptEslintParser,
    },
  },
];
```

### Javascript

TODO (?)
