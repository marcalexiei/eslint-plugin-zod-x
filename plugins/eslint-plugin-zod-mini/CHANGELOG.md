# eslint-plugin-zod-mini

## 1.2.0

### Minor Changes

- [#320](https://github.com/marcalexiei/eslint-zod/pull/320) [`97d8c7c`](https://github.com/marcalexiei/eslint-zod/commit/97d8c7ca00ba48f55eba9b5ddd63da950cb127ef) Thanks [@nimaebra](https://github.com/nimaebra)! - feat: add `no-transform-in-record-key` rule

- [#318](https://github.com/marcalexiei/eslint-zod/pull/318) [`b084557`](https://github.com/marcalexiei/eslint-zod/commit/b08455769d81682e32feae0cc3306e62d5b3c549) Thanks [@nimaebra](https://github.com/nimaebra)! - feat(rule-builders): add `no-throw-in-refine`

  The `no-throw-in-refine` create logic has been extracted into `@eslint-zod/utils` so both
  `eslint-plugin-zod` and `eslint-plugin-zod-mini` use the same shared implementation.

### Patch Changes

- [#323](https://github.com/marcalexiei/eslint-zod/pull/323) [`0544a19`](https://github.com/marcalexiei/eslint-zod/commit/0544a197af5859b8a48615e49ff09bf6bcaaf884) Thanks [@marcalexiei](https://github.com/marcalexiei)! - refactor(no-transform-in-record-key): use `@eslint-zod/utils/rule-builders/no-transform-in-record-key`

- Updated dependencies [[`b084557`](https://github.com/marcalexiei/eslint-zod/commit/b08455769d81682e32feae0cc3306e62d5b3c549), [`0544a19`](https://github.com/marcalexiei/eslint-zod/commit/0544a197af5859b8a48615e49ff09bf6bcaaf884)]:
  - @eslint-zod/utils@2.1.0

## 1.1.1

### Patch Changes

- [#315](https://github.com/marcalexiei/eslint-zod/pull/315) [`a89b181`](https://github.com/marcalexiei/eslint-zod/commit/a89b1815b75ec735abf96dd1f5ebdada1487ee35) Thanks [@nimaebra](https://github.com/nimaebra)! - refactor: update rule builder imports to per-file `@eslint-zod/utils/rule-builders/*` paths

- Updated dependencies [[`a89b181`](https://github.com/marcalexiei/eslint-zod/commit/a89b1815b75ec735abf96dd1f5ebdada1487ee35)]:
  - @eslint-zod/utils@2.0.0

## 1.1.0

### Minor Changes

- [#314](https://github.com/marcalexiei/eslint-zod/pull/314) [`b073f04`](https://github.com/marcalexiei/eslint-zod/commit/b073f0404c06a808aa6f0712020728d97b39a26f) Thanks [@marcalexiei](https://github.com/marcalexiei)! - feat: add `prefer-enum-over-literal-union` rule

### Patch Changes

- Updated dependencies [[`b073f04`](https://github.com/marcalexiei/eslint-zod/commit/b073f0404c06a808aa6f0712020728d97b39a26f)]:
  - @eslint-zod/utils@1.3.0

## 1.0.3

### Patch Changes

- [#293](https://github.com/marcalexiei/eslint-zod/pull/293) [`74117f9`](https://github.com/marcalexiei/eslint-zod/commit/74117f9ad94697911f42f77b958e59b4d2239017) Thanks [@marcalexiei](https://github.com/marcalexiei)! - docs(README): correct `zod/mini` URL

- Updated dependencies [[`74117f9`](https://github.com/marcalexiei/eslint-zod/commit/74117f9ad94697911f42f77b958e59b4d2239017)]:
  - @eslint-zod/utils@1.2.0

## 1.0.2

### Patch Changes

- [#297](https://github.com/marcalexiei/eslint-zod/pull/297) [`66dcfca`](https://github.com/marcalexiei/eslint-zod/commit/66dcfca1aceb8c5dc2d85e4e06147561495491e6) Thanks [@marcalexiei](https://github.com/marcalexiei)! - refactor(prefer-meta): rely on `detectZodSchemaRootNode` to detect describe methods

- Updated dependencies [[`66dcfca`](https://github.com/marcalexiei/eslint-zod/commit/66dcfca1aceb8c5dc2d85e4e06147561495491e6), [`66dcfca`](https://github.com/marcalexiei/eslint-zod/commit/66dcfca1aceb8c5dc2d85e4e06147561495491e6), [`38429ee`](https://github.com/marcalexiei/eslint-zod/commit/38429ee89494bc1605d3248b10e46c8a6ec0a58c)]:
  - @eslint-zod/utils@1.1.0

## 1.0.1

### Patch Changes

- [#286](https://github.com/marcalexiei/eslint-zod/pull/286) [`9cfe2bb`](https://github.com/marcalexiei/eslint-zod/commit/9cfe2bb16ba1a70f12bf81a6bd1ed47e97200889) Thanks [@marcalexiei](https://github.com/marcalexiei)! - fix: `dist` folder is missing in published package

- Updated dependencies [[`9cfe2bb`](https://github.com/marcalexiei/eslint-zod/commit/9cfe2bb16ba1a70f12bf81a6bd1ed47e97200889)]:
  - @eslint-zod/utils@1.0.1

## 1.0.0

### Major Changes

- [#277](https://github.com/marcalexiei/eslint-zod/pull/277) [`349991f`](https://github.com/marcalexiei/eslint-zod/commit/349991fc60a7909af4830d0aa117d2878f306557) Thanks [@marcalexiei](https://github.com/marcalexiei)! - feat!: initial release

  This plugin visits only schemas coming from `zod/mini` and `zod/v4-mini`

  It supports the following rules from `eslint-plugin-zod`:
  - `consistent-import`
  - `consistent-import-source`
  - `consistent-object-schema-type`
  - `consistent-schema-output-type-style`
  - `consistent-schema-var-name`
  - `no-any-schema`
  - `no-empty-custom-schema`
  - `no-unknown-schema`
  - `prefer-meta`
  - `require-brand-type-parameter`
  - `require-error-message`
  - `schema-error-property-style`

  A `recommended` config is exposed by the plugin for easy setup

### Patch Changes

- Updated dependencies [[`349991f`](https://github.com/marcalexiei/eslint-zod/commit/349991fc60a7909af4830d0aa117d2878f306557)]:
  - @eslint-zod/utils@1.0.0
