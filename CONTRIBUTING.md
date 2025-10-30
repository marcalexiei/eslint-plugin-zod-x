# Contributing

## Setup instructions

<https://marcalexiei.github.io/contribute/setup-pnpm-nvm.html>

To check that every thing works correctly run:

```shell
pnpm run check-all
```

## Test your changes

If you need to test your changes use

```shell
pnpm test
```

To run only runtime tests you can use

```shell
pnpm test --typecheck=false
```

## Documentation changes

```shell
pnpm run update:eslint-docs
```

Be sure to check documentation lint via

```shell
pnpm run lint:docs
```

## Commit rules

<https://marcalexiei.github.io/contribute/commit-rules.html>

## Release

<https://marcalexiei.github.io/contribute/release-changesets.html>
