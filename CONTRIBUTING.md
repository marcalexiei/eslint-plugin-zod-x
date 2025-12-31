# Contributing

Thank you for considering a contribution!

This document explains how to set up the project locally, run tests and linters, update documentation, and send changes via pull requests.

## Quick start ✅

Detailed setup instructions are available here:

<https://marcalexiei.github.io/contribute/setup-pnpm-nvm.html>

To install dependencies and verify your environment:

```shell
pnpm install
pnpm run check-all
```

---

## Run tests 🧪

- Run the full test suite:

```shell
pnpm test
```

- Run tests without type-checking (faster for quick iteration):

```shell
pnpm run test --typecheck=false
```

---

## Linting & formatting 🔧

- Run all linters and checks:

```shell
pnpm run lint
pnpm run format
```

- Fix JS lint issues and formatting automatically:

```shell
pnpm run lint:js:fix
pnpm run format:fix
```

- Make sure docs are in sync:

```shell
pnpm run lint:docs
```

To _update_ generated rule docs from the source code:

```shell
pnpm run lint:docs:update
```

(This command runs a build first, so you don't need to run `pnpm run build` manually.)

---

## Rule documentation

If you change a rule's behavior, update its documentation in the `docs/rules/` folder and run `pnpm run lint:docs:update` to regenerate the docs.

---

## Commit rules & commit messages ✍️

We follow the commit rules described here:

<https://marcalexiei.github.io/contribute/commit-rules.html>

Please ensure your commit messages are clear and follow the repository conventions.

---

## Pull requests & workflow 🔁

- Fork the repository and create a branch with a descriptive name.
- Open a pull request against `main` and include a short description of the changes and the reasoning.
- Run `pnpm run check-all`.
- If your change affects docs, include the updated docs or run `pnpm run lint:docs:update` and include the generated files.

---

## Release 🚀

Releases are handled via Changesets. See the release guide for details:

<https://marcalexiei.github.io/contribute/release-changesets.html>

---

Thank you for helping improve the project — contributions are welcome! 🙏
