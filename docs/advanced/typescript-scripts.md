# TypeScript Scripts

This repository supports a standard `tsc` pipeline and an optional TypeScript-Go (`tsgo`) pipeline when available on the developer machine.

## Available scripts

=== "Standard pipeline (tsc)"

    ```bash
    pnpm run check-types
    pnpm run compile
    pnpm run watch
    ```

=== "Alternative pipeline (tsgo)"

    ```bash
    pnpm run check-types:tsgo
    pnpm run compile:tsgo
    pnpm run watch:tsgo
    ```

## Full build

=== "With tsc"

    ```bash
    pnpm run build
    ```

=== "With tsgo"

    ```bash
    pnpm run build:tsgo
    ```

## Artifacts

- Compiled extension output: `dist/`
- VSCode package (`.vsix`): `bin/`
