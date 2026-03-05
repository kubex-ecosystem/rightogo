# Workflows

## Flow 1: Quick standalone snippet

1. Create `snippet.go`.
2. Ensure `package main`.
3. Run with Play.
4. Validate output in terminal.
5. Discard or migrate to formal project.

## Flow 2: Dependency bug reproduction

1. Create minimal failing script.
2. Run in ephemeral mode to resolve dependencies automatically.
3. Iterate and rerun quickly.

## Flow 3: Interactive script

1. Build script with `fmt.Scanln`.
2. Run via RighToGo.
3. Provide input in `RighToGo Terminal`.

## Flow 4: Extension development cycle

```bash
pnpm install
pnpm run compile
pnpm test
pnpm run lint
```

Packaging:

```bash
pnpm run vscode:build
```

Expected outputs:

- compiled JS in `dist/`
- `.vsix` in `bin/`

## Flow 5: Run with arguments

1. Open an eligible `.go` file.
2. Execute `RighToGo: Run Current Go Script (With Args)`.
3. Enter args (e.g. `--port 8080 --name "John Doe"`).
4. Validate behavior in terminal.

## Flow 6: Run in new window

1. Execute `RighToGo: Run Current Go Script (New Window)`.
2. Extension attempts to move terminal to a new window.
3. If unsupported, execution continues in panel.
