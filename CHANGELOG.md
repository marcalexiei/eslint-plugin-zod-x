# eslint-plugin-zod-x

## 1.12.0

### Minor Changes

- [#132](https://github.com/marcalexiei/eslint-plugin-zod-x/pull/132) [`d559140`](https://github.com/marcalexiei/eslint-plugin-zod-x/commit/d559140264d6024fcb079d8ad1a55b52f01da65a) Thanks [@marcalexiei](https://github.com/marcalexiei)! - feat(no-unknown-schema): add new rule

### Patch Changes

- [#133](https://github.com/marcalexiei/eslint-plugin-zod-x/pull/133) [`49c73fe`](https://github.com/marcalexiei/eslint-plugin-zod-x/commit/49c73fecd210471016896da23f27e29f3580602e) Thanks [@marcalexiei](https://github.com/marcalexiei)! - docs: ensure consistent structure across rules documentation

## 1.11.2

### Patch Changes

- [#125](https://github.com/marcalexiei/eslint-plugin-zod-x/pull/125) [`62b8ce3`](https://github.com/marcalexiei/eslint-plugin-zod-x/commit/62b8ce30212b981f3db818e122b9a59d8fdbc839) Thanks [@marcalexiei](https://github.com/marcalexiei)! - fix(require-schema-suffix): remove unsafe autofix

  If you previously relied on this feature, you can safely update your code by using your IDE’s rename functionality.

  For more details, see the [`require-schema-suffix` documentation](https://github.com/marcalexiei/eslint-plugin-zod-x/blob/main/docs/rules/require-schema-suffix.md).

## 1.11.1

### Patch Changes

- [#122](https://github.com/marcalexiei/eslint-plugin-zod-x/pull/122) [`85a1ec7`](https://github.com/marcalexiei/eslint-plugin-zod-x/commit/85a1ec72e7508b8c1e0e7a4908b20d1b072186a7) Thanks [@marcalexiei](https://github.com/marcalexiei)! - fix(prefer-meta): do not process non-zod expressions

## 1.11.0

### Minor Changes

- [#119](https://github.com/marcalexiei/eslint-plugin-zod-x/pull/119) [`725c4de`](https://github.com/marcalexiei/eslint-plugin-zod-x/commit/725c4de6fb004489ef12bb0410b4a6f3104c6e7a) Thanks [@marcalexiei](https://github.com/marcalexiei)! - feat(consistent-object-schema-type): add new rule

## 1.10.0

### Minor Changes

- [#110](https://github.com/marcalexiei/eslint-plugin-zod-x/pull/110) [`d54bade`](https://github.com/marcalexiei/eslint-plugin-zod-x/commit/d54bade9949834e53c11c50aef31961c2af2d3bf) Thanks [@marcalexiei](https://github.com/marcalexiei)! - This release adds support for Zod named exports.
  All rules should now work with default, namespace, and named import styles,
  this required a major rewrite.

  ***

  Some rules do not yet provide automatic fixes when using named imports.
  Fixes for those cases are more complex because they often require modifying import statements.

  ***

  🤕🤕🤕
  This is not a major release since doesn't add any breaking change,
  however there might be some issues due to the major refactor.

### Patch Changes

- [#112](https://github.com/marcalexiei/eslint-plugin-zod-x/pull/112) [`bbbb147`](https://github.com/marcalexiei/eslint-plugin-zod-x/commit/bbbb147433e554a11ad7193e0ffa7286dc8f9f0a) Thanks [@marcalexiei](https://github.com/marcalexiei)! - feat: new find logic perf improvements

## 1.9.0

### Minor Changes

- [#103](https://github.com/marcalexiei/eslint-plugin-zod-x/pull/103) [`44fb4bf`](https://github.com/marcalexiei/eslint-plugin-zod-x/commit/44fb4bfc20b0afb3d205cb1d9f2bc3556778c949) Thanks [@marcalexiei](https://github.com/marcalexiei)! - feat(consistent-import-source): add suggestion

## 1.8.3

### Patch Changes

- [#105](https://github.com/marcalexiei/eslint-plugin-zod-x/pull/105) [`3dfcd52`](https://github.com/marcalexiei/eslint-plugin-zod-x/commit/3dfcd525464018da8e89003d4cee7058ac5be767) Thanks [@marcalexiei](https://github.com/marcalexiei)! - fix(meta): make zod an optional peer dependency

## 1.8.2

### Patch Changes

- [#102](https://github.com/marcalexiei/eslint-plugin-zod-x/pull/102) [`8dd776d`](https://github.com/marcalexiei/eslint-plugin-zod-x/commit/8dd776dd2bdca0ddbf81489a7eb394cb64499220) Thanks [@marcalexiei](https://github.com/marcalexiei)! - fix(array-style): correct rule name

- [#99](https://github.com/marcalexiei/eslint-plugin-zod-x/pull/99) [`a07e3fc`](https://github.com/marcalexiei/eslint-plugin-zod-x/commit/a07e3fc52272d8165c0816abf23dd67ee41beffd) Thanks [@V1RE](https://github.com/V1RE)! - fix(schema-error-property-style): correct rule name from 'consistent-import-source'

- [#101](https://github.com/marcalexiei/eslint-plugin-zod-x/pull/101) [`0642e50`](https://github.com/marcalexiei/eslint-plugin-zod-x/commit/0642e5001d1fcaf566dc871e5cc326acd1ccf3f7) Thanks [@marcalexiei](https://github.com/marcalexiei)! - fix(require-brand-type-parameter): correct `removeBrandFunction` message typo

## 1.8.1

### Patch Changes

- [#96](https://github.com/marcalexiei/eslint-plugin-zod-x/pull/96) [`6b282b4`](https://github.com/marcalexiei/eslint-plugin-zod-x/commit/6b282b4076801556c4fdbc20be2fd650d75ddca2) Thanks [@andreww2012](https://github.com/andreww2012)! - fix(array-style): disallow extra properties in rule options

- [#95](https://github.com/marcalexiei/eslint-plugin-zod-x/pull/95) [`7b28d3a`](https://github.com/marcalexiei/eslint-plugin-zod-x/commit/7b28d3a28ae91ae0a3ff55f3ad530d2691cecf2a) Thanks [@marcalexiei](https://github.com/marcalexiei)! - fix(prefer-namespace-import): treat each source as standalone group to allow using multiple versions

- [#96](https://github.com/marcalexiei/eslint-plugin-zod-x/pull/96) [`6b282b4`](https://github.com/marcalexiei/eslint-plugin-zod-x/commit/6b282b4076801556c4fdbc20be2fd650d75ddca2) Thanks [@andreww2012](https://github.com/andreww2012)! - fix(prefer-strict-object): disallow extra properties in rule options

- [#97](https://github.com/marcalexiei/eslint-plugin-zod-x/pull/97) [`4ae924f`](https://github.com/marcalexiei/eslint-plugin-zod-x/commit/4ae924f488e8305d2bf5d6a2e9de7f3bb87e3eac) Thanks [@andreww2012](https://github.com/andreww2012)! - fix(meta): remove anchor from rule url prefix

## 1.8.0

### Minor Changes

- [#90](https://github.com/marcalexiei/eslint-plugin-zod-x/pull/90) [`13653a6`](https://github.com/marcalexiei/eslint-plugin-zod-x/commit/13653a68372779dea5ef626b997d109d487580b7) Thanks [@marcalexiei](https://github.com/marcalexiei)! - feat(schema-error-property-style): add new rule

- [#89](https://github.com/marcalexiei/eslint-plugin-zod-x/pull/89) [`56e9aff`](https://github.com/marcalexiei/eslint-plugin-zod-x/commit/56e9aff6086ea3c76e8b7bdffbba54662b93bea9) Thanks [@marcalexiei](https://github.com/marcalexiei)! - feat: support Node 25

- [#92](https://github.com/marcalexiei/eslint-plugin-zod-x/pull/92) [`707ee6f`](https://github.com/marcalexiei/eslint-plugin-zod-x/commit/707ee6f6ca054432879a970f7db7e38196638e32) Thanks [@marcalexiei](https://github.com/marcalexiei)! - feat(require-brand-type-parameter): add new rule

## 1.7.1

### Patch Changes

- [#69](https://github.com/marcalexiei/eslint-plugin-zod-x/pull/69) [`fb209b7`](https://github.com/marcalexiei/eslint-plugin-zod-x/commit/fb209b79d5e17ef68f6d10232ebf61b2909a575b) Thanks [@marcalexiei](https://github.com/marcalexiei)! - fix(package.json): add hash to readme in `homepage` field

- [#75](https://github.com/marcalexiei/eslint-plugin-zod-x/pull/75) [`c8718d8`](https://github.com/marcalexiei/eslint-plugin-zod-x/commit/c8718d85b221fe901a286c9020e7df92ed4fc6de) Thanks [@marcalexiei](https://github.com/marcalexiei)! - fix(require-schema-suffix): false positive if last method in chain is not a parse-like method

- [#73](https://github.com/marcalexiei/eslint-plugin-zod-x/pull/73) [`01820c0`](https://github.com/marcalexiei/eslint-plugin-zod-x/commit/01820c0bb414b0b1da820eb379572b7be6b2d77e) Thanks [@marcalexiei](https://github.com/marcalexiei)! - fix(prefer-meta-last): handle meta inside objects

## 1.7.0

### Minor Changes

- [#61](https://github.com/marcalexiei/eslint-plugin-zod-x/pull/61) [`926b6bd`](https://github.com/marcalexiei/eslint-plugin-zod-x/commit/926b6bdd12902bb68e0c689b8f7c58e09f38e5aa) Thanks [@marcalexiei](https://github.com/marcalexiei)! - feat(no-number-schema-with-int): add new rule

  Thanks to @ulrichstark for the proposal

### Patch Changes

- [#67](https://github.com/marcalexiei/eslint-plugin-zod-x/pull/67) [`e1b3955`](https://github.com/marcalexiei/eslint-plugin-zod-x/commit/e1b3955a12ecdcdd92b438e3a759906d3beae008) Thanks [@marcalexiei](https://github.com/marcalexiei)! - docs: format rules descriptions consistently marking methods with “`”

- [#68](https://github.com/marcalexiei/eslint-plugin-zod-x/pull/68) [`ce8132a`](https://github.com/marcalexiei/eslint-plugin-zod-x/commit/ce8132a2c021c94edf4dffbb88ed726b6a0ba08d) Thanks [@marcalexiei](https://github.com/marcalexiei)! - docs(README): improve install and configuration

- [#65](https://github.com/marcalexiei/eslint-plugin-zod-x/pull/65) [`45dbdc8`](https://github.com/marcalexiei/eslint-plugin-zod-x/commit/45dbdc81f1e9f43955c5c41232858ad39ace4e54) Thanks [@marcalexiei](https://github.com/marcalexiei)! - fix: create compatible plugin/config types to avoid external types references

## 1.6.0

### Minor Changes

- [#53](https://github.com/marcalexiei/eslint-plugin-zod-x/pull/53) [`2dba641`](https://github.com/marcalexiei/eslint-plugin-zod-x/commit/2dba641334936362e95a8d802ff8a182344434fd) Thanks [@ulrichstark](https://github.com/ulrichstark)! - feat(no-optional-and-default-together): add new rule

- [#57](https://github.com/marcalexiei/eslint-plugin-zod-x/pull/57) [`fd12dcb`](https://github.com/marcalexiei/eslint-plugin-zod-x/commit/fd12dcbfaf63a6be90416184e0924d1c5895cadd) Thanks [@marcalexiei](https://github.com/marcalexiei)! - feat(no-optional-and-default-together): add different message when `preferredMethod` !== `none`

## 1.5.1

### Patch Changes

- [#45](https://github.com/marcalexiei/eslint-plugin-zod-x/pull/45) [`caee00f`](https://github.com/marcalexiei/eslint-plugin-zod-x/commit/caee00fc60cb29193ea90d696969dd9ab9ab96b6) Thanks [@marcalexiei](https://github.com/marcalexiei)! - fix: simplify plugin type

  Refactor plugin `rules` object to use `Record<string, TSESLint.LooseRuleDefinition>` type.
  This eliminates the need to export rule options from individual rule files, fixing the `TS4023` TypeScript error:

  ```text
  Exported variable 'eslintPluginZodX' has or is using name 'Options' from external module "./src/rules/array-style" but cannot be named.
  ```

- [#50](https://github.com/marcalexiei/eslint-plugin-zod-x/pull/50) [`65f6dc8`](https://github.com/marcalexiei/eslint-plugin-zod-x/commit/65f6dc809179e444329e812fe4b8a9800478f9ca) Thanks [@marcalexiei](https://github.com/marcalexiei)! - fix: plugin type is incompatible with `eslint#defineConfig`

## 1.5.0

### Minor Changes

- [#41](https://github.com/marcalexiei/eslint-plugin-zod-x/pull/41) [`0e7b30a`](https://github.com/marcalexiei/eslint-plugin-zod-x/commit/0e7b30aeddacdcc37308dd741af5a280a6646214) Thanks [@SimonVadier](https://github.com/SimonVadier)! - feat(consistent-import-source): add support for `zod/mini` and `zod/v4-mini`

### Patch Changes

- [#40](https://github.com/marcalexiei/eslint-plugin-zod-x/pull/40) [`8dff683`](https://github.com/marcalexiei/eslint-plugin-zod-x/commit/8dff6836adbf9a22952a498f180c58d214404053) Thanks [@marcalexiei](https://github.com/marcalexiei)! - fix(prefer-namespace-import): account for type imports

- [#36](https://github.com/marcalexiei/eslint-plugin-zod-x/pull/36) [`da86f6f`](https://github.com/marcalexiei/eslint-plugin-zod-x/commit/da86f6f84cbb91cca411d281402d57a4c1fcd261) Thanks [@marcalexiei](https://github.com/marcalexiei)! - docs: improve description meta

- [#43](https://github.com/marcalexiei/eslint-plugin-zod-x/pull/43) [`66f2ab5`](https://github.com/marcalexiei/eslint-plugin-zod-x/commit/66f2ab56674853d0fb580b2d153c990a1416088e) Thanks [@marcalexiei](https://github.com/marcalexiei)! - fix(prefer-meta-last): Matching meta() from other packages

## 1.4.0

### Minor Changes

- [#26](https://github.com/marcalexiei/eslint-plugin-zod-x/pull/26) [`426005f`](https://github.com/marcalexiei/eslint-plugin-zod-x/commit/426005f3ca646051309968ad38131a25908a3628) Thanks [@marcalexiei](https://github.com/marcalexiei)! - feat(require-error-message): add new rule

### Patch Changes

- [#28](https://github.com/marcalexiei/eslint-plugin-zod-x/pull/28) [`5156928`](https://github.com/marcalexiei/eslint-plugin-zod-x/commit/5156928b8fe2713e193d1f7a8d46f3d031a0c09a) Thanks [@marcalexiei](https://github.com/marcalexiei)! - fix(require-schema-suffix): some data returning methods are missing

- [#29](https://github.com/marcalexiei/eslint-plugin-zod-x/pull/29) [`2cf9d64`](https://github.com/marcalexiei/eslint-plugin-zod-x/commit/2cf9d64f641e00fc632151a93583cb2735eca900) Thanks [@marcalexiei](https://github.com/marcalexiei)! - fix(require-schema-suffix): ignore codec

## 1.3.0

### Minor Changes

- [#21](https://github.com/marcalexiei/eslint-plugin-zod-x/pull/21) [`530182d`](https://github.com/marcalexiei/eslint-plugin-zod-x/commit/530182d3d135aa85dc042ba322da551f23ae3f51) Thanks [@marcalexiei](https://github.com/marcalexiei)! - feat(require-schema-suffix): add new rule

## 1.2.0

### Minor Changes

- [#19](https://github.com/marcalexiei/eslint-plugin-zod-x/pull/19) [`f2b43dd`](https://github.com/marcalexiei/eslint-plugin-zod-x/commit/f2b43dd52faba9253a2f8610d3c7ae30c9b6c73a) Thanks [@marcalexiei](https://github.com/marcalexiei)! - feat(consistent-import-source): add new rule

## 1.1.0

### Minor Changes

- [#15](https://github.com/marcalexiei/eslint-plugin-zod-x/pull/15) [`70057a3`](https://github.com/marcalexiei/eslint-plugin-zod-x/commit/70057a31517f17a0e24566e3782025aa1b47b7d4) Thanks [@marcalexiei](https://github.com/marcalexiei)! - feat(no-empty-custom-schema): add new rule

- [#17](https://github.com/marcalexiei/eslint-plugin-zod-x/pull/17) [`978b12f`](https://github.com/marcalexiei/eslint-plugin-zod-x/commit/978b12f04ae359bfdc2da504b249b9f13b8f272a) Thanks [@marcalexiei](https://github.com/marcalexiei)! - docs: uniform rules documentation

## 1.0.2

### Patch Changes

- [`4ad66fc`](https://github.com/marcalexiei/eslint-plugin-zod-x/commit/4ad66fcaa29c0d214a0b204bec39a8ea21c45d2b) Thanks [@marcalexiei](https://github.com/marcalexiei)! - chore: refine `.npmrc` (userland not affected)

## 1.0.1

### Patch Changes

- [`dccc798`](https://github.com/marcalexiei/eslint-plugin-zod-x/commit/dccc798bffad3300e1da7de4f48d73afa7696e22) Thanks [@marcalexiei](https://github.com/marcalexiei)! - chore: retry trusted publising

## 1.0.0

### Major Changes

- [`97b9d55`](https://github.com/marcalexiei/eslint-plugin-zod-x/commit/97b9d55ad27fea0d2e4e90653bacee4f38d1ddfd) Thanks [@marcalexiei](https://github.com/marcalexiei)! - feat!: initial release

### Minor Changes

- [`f2b3200`](https://github.com/marcalexiei/eslint-plugin-zod-x/commit/f2b3200344bbf673fb432fa991a0d6b48263f74a) Thanks [@marcalexiei](https://github.com/marcalexiei)! - feat(no-any): add new rule

- [`25e049f`](https://github.com/marcalexiei/eslint-plugin-zod-x/commit/25e049fbcbb090c6b42e9bf43687a88ec2c05eb1) Thanks [@marcalexiei](https://github.com/marcalexiei)! - feat(no-throw-in-refine): add new rule

- [`44f370f`](https://github.com/marcalexiei/eslint-plugin-zod-x/commit/44f370f4d9c7594c33ff19d48991072c3b1ed2fb) Thanks [@marcalexiei](https://github.com/marcalexiei)! - feat(array-style): add new rule

- [`35ae1ad`](https://github.com/marcalexiei/eslint-plugin-zod-x/commit/35ae1ad6e9a8c2438afc17a6584bacd01334f5c7) Thanks [@marcalexiei](https://github.com/marcalexiei)! - feat(prefer-namespace-import): add new rule

- [`bcedf76`](https://github.com/marcalexiei/eslint-plugin-zod-x/commit/bcedf76533b3efc2c1a20db7c50354f5f8ae262a) Thanks [@marcalexiei](https://github.com/marcalexiei)! - feat(prefer-strict-object): add new rule

- [`aa189ea`](https://github.com/marcalexiei/eslint-plugin-zod-x/commit/aa189ea5f6a1da8f2cb79853842a2c5db60ce961) Thanks [@marcalexiei](https://github.com/marcalexiei)! - feat(prefer-meta-last): new rule

- [`672f6ee`](https://github.com/marcalexiei/eslint-plugin-zod-x/commit/672f6ee368ad3dd9a762b68542a43f705dadf6bc) Thanks [@marcalexiei](https://github.com/marcalexiei)! - feat(prefer-meta): add new rule
