# Installation

## Requirements

- VSCode `>= 1.95.0`
- Node.js `>= 16`
- `pnpm` (recommended for development)
- Go installed (or configured through `rightogo.goBinaryPath`)

## Local development setup

```bash
pnpm install
pnpm run compile
```

Then press `F5` in VSCode to open the **Extension Development Host**.

## Install via `.vsix`

Packaging outputs the extension artifact to `bin/`.

```bash
pnpm run vscode:build
```

Example output:

```text
bin/rightogo-1.0.0.vsix
```

## Relevant build directories

- Compiled runtime: `dist/`
- Distribution package: `bin/*.vsix`

!!! note "Build output"
    This project uses `dist/` as the TypeScript output directory.
