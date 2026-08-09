# eslint-plugin-zod-core

## 1.0.10

### Patch Changes

- [#376](https://github.com/marcalexiei/eslint-zod/pull/376) [`b1f666a`](https://github.com/marcalexiei/eslint-zod/commit/b1f666a0c86b7cfb335d60307aa0b9aa697bb1dd) Thanks [@marcalexiei](https://github.com/marcalexiei)! - fix: `consistent-import` alias collision between two zod sources

  Every rewritten import group received the alias `z`, so a file importing from two sources was fixed into two `import * as z` declarations.
  Each group now gets a distinct alias.

- Updated dependencies [[`dfa974b`](https://github.com/marcalexiei/eslint-zod/commit/dfa974b3bde278fee13f5e0fc2b2f8f7fffc4e50), [`dfa974b`](https://github.com/marcalexiei/eslint-zod/commit/dfa974b3bde278fee13f5e0fc2b2f8f7fffc4e50), [`dfa974b`](https://github.com/marcalexiei/eslint-zod/commit/dfa974b3bde278fee13f5e0fc2b2f8f7fffc4e50), [`dfa974b`](https://github.com/marcalexiei/eslint-zod/commit/dfa974b3bde278fee13f5e0fc2b2f8f7fffc4e50), [`fb49a63`](https://github.com/marcalexiei/eslint-zod/commit/fb49a639c3bee68268861b6c44ea9626c0cac6c6), [`b1f666a`](https://github.com/marcalexiei/eslint-zod/commit/b1f666a0c86b7cfb335d60307aa0b9aa697bb1dd), [`dfa974b`](https://github.com/marcalexiei/eslint-zod/commit/dfa974b3bde278fee13f5e0fc2b2f8f7fffc4e50), [`b1f666a`](https://github.com/marcalexiei/eslint-zod/commit/b1f666a0c86b7cfb335d60307aa0b9aa697bb1dd), [`fb49a63`](https://github.com/marcalexiei/eslint-zod/commit/fb49a639c3bee68268861b6c44ea9626c0cac6c6), [`4d8edae`](https://github.com/marcalexiei/eslint-zod/commit/4d8edae60e525cd1816f87600d1f825b3146fa35)]:
  - @eslint-zod/utils@3.0.0

## 1.0.9

### Patch Changes

- Updated dependencies [[`6bbcdf0`](https://github.com/marcalexiei/eslint-zod/commit/6bbcdf06cb37a151e36af25146297c24897846d0)]:
  - @eslint-zod/utils@2.5.0

## 1.0.8

### Patch Changes

- Updated dependencies [[`0913e38`](https://github.com/marcalexiei/eslint-zod/commit/0913e3886976ed138f6a060cead6297be14e8e8d), [`5547b24`](https://github.com/marcalexiei/eslint-zod/commit/5547b24ef00a084a8aa943b6c57fd7d0cacbf8d3), [`dc8e969`](https://github.com/marcalexiei/eslint-zod/commit/dc8e9696f37cf00404bd78b5d38c6268009b9c1b), [`250e526`](https://github.com/marcalexiei/eslint-zod/commit/250e526df7c0870b9f7a98177fc0d9e8e0b78278)]:
  - @eslint-zod/utils@2.4.0

## 1.0.7

### Patch Changes

- Updated dependencies [[`de44e4c`](https://github.com/marcalexiei/eslint-zod/commit/de44e4cefcc64d8aae394081d777a90d3f4f283d)]:
  - @eslint-zod/utils@2.3.0

## 1.0.6

### Patch Changes

- Updated dependencies [[`d183319`](https://github.com/marcalexiei/eslint-zod/commit/d1833192088a28d9db1595d6bc90d02c29cb1ba5)]:
  - @eslint-zod/utils@2.2.0

## 1.0.5

### Patch Changes

- [#327](https://github.com/marcalexiei/eslint-zod/pull/327) [`a10f137`](https://github.com/marcalexiei/eslint-zod/commit/a10f137ffcd03f6e04f6c88e53124836e0375cb6) Thanks [@marcalexiei](https://github.com/marcalexiei)! - chore: use GitHub env for OIDC publishing

- Updated dependencies [[`a10f137`](https://github.com/marcalexiei/eslint-zod/commit/a10f137ffcd03f6e04f6c88e53124836e0375cb6)]:
  - @eslint-zod/utils@2.1.2

## 1.0.4

### Patch Changes

- Updated dependencies [[`6faef20`](https://github.com/marcalexiei/eslint-zod/commit/6faef206f23c703bc2a06d8378f04fe660268a07)]:
  - @eslint-zod/utils@2.1.1

## 1.0.3

### Patch Changes

- Updated dependencies [[`b084557`](https://github.com/marcalexiei/eslint-zod/commit/b08455769d81682e32feae0cc3306e62d5b3c549), [`0544a19`](https://github.com/marcalexiei/eslint-zod/commit/0544a197af5859b8a48615e49ff09bf6bcaaf884)]:
  - @eslint-zod/utils@2.1.0

## 1.0.2

### Patch Changes

- [#315](https://github.com/marcalexiei/eslint-zod/pull/315) [`a89b181`](https://github.com/marcalexiei/eslint-zod/commit/a89b1815b75ec735abf96dd1f5ebdada1487ee35) Thanks [@nimaebra](https://github.com/nimaebra)! - refactor: update rule builder imports to per-file `@eslint-zod/utils/rule-builders/*` paths

- Updated dependencies [[`a89b181`](https://github.com/marcalexiei/eslint-zod/commit/a89b1815b75ec735abf96dd1f5ebdada1487ee35)]:
  - @eslint-zod/utils@2.0.0

## 1.0.1

### Patch Changes

- Updated dependencies [[`b073f04`](https://github.com/marcalexiei/eslint-zod/commit/b073f0404c06a808aa6f0712020728d97b39a26f)]:
  - @eslint-zod/utils@1.3.0

## 1.0.0

### Major Changes

- [#293](https://github.com/marcalexiei/eslint-zod/pull/293) [`74117f9`](https://github.com/marcalexiei/eslint-zod/commit/74117f9ad94697911f42f77b958e59b4d2239017) Thanks [@marcalexiei](https://github.com/marcalexiei)! - feat: initial release

### Patch Changes

- Updated dependencies [[`74117f9`](https://github.com/marcalexiei/eslint-zod/commit/74117f9ad94697911f42f77b958e59b4d2239017)]:
  - @eslint-zod/utils@1.2.0
