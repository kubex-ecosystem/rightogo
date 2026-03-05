# Development

## Local setup

```bash
pnpm install
pnpm run compile
pnpm test
```

## Run extension in development mode

- Open the workspace in VSCode.
- Press `F5`.
- Validate `RighToGo: Run Current Go Script` and related commands.

## Linting and type checks

```bash
pnpm run check-types
pnpm run lint
```

## Packaging

```bash
pnpm run package
pnpm run vscode:build
```

## Output structure

- TypeScript build output: `dist/`
- Distribution package: `bin/*.vsix`

## Documentation commands

```bash
make build-docs
make serve-docs
```
