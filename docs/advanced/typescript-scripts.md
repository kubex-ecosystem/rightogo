# TypeScript Scripts

A base atual expõe scripts para `tsc` e alternativa com TypeScript-Go (`tsgo`) quando disponível na máquina do desenvolvedor.

## Scripts disponíveis

=== "Pipeline padrão (tsc)"

    ```bash
    pnpm run check-types
    pnpm run compile
    pnpm run watch
    ```

=== "Pipeline alternativo (tsgo)"

    ```bash
    pnpm run check-types:tsgo
    pnpm run compile:tsgo
    pnpm run watch:tsgo
    ```

## Build completo

=== "Com tsc"

    ```bash
    pnpm run build
    ```

=== "Com tsgo"

    ```bash
    pnpm run build:tsgo
    ```

## Artefatos

- Código compilado: `dist/`
- Pacote VSCode (`vsix`): `bin/`
