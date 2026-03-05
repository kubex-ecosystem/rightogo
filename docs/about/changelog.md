# Changelog

## [Unreleased]

### Added

- `Run Current Go Script (With Args)` for fast argument input.
- `Run Current Go Script (New Window)` to attempt terminal focus in a separate window.
- Editor and Explorer context-menu entries for direct execution.
- `rightogo.promptForArgumentsOnRun` setting.
- `rightogo.runInNewWindowTerminalByDefault` setting.

### Changed

- `rightogo.goBinaryPath` now supports placeholders (`${userHome}`, `${env:VAR}`, `${workspaceFolder}`, `~`) with resilient fallback resolution.

## [1.0.0] - 2026-03-04

### Added

- Active Go script execution command.
- Project-mode execution (`go.mod` present).
- Ephemeral mode for standalone files (`go mod init`, `go mod tidy`, `go run`).
- Configurable temporary cleanup.
- `Ask LLM` command with local stub.
- Initial automated tests for eligibility and ephemeral sequence.
- MkDocs Material doc-site base.

### Changed

- Standardized build output in `dist/`.
- `.vsix` packaging output in `bin/`.
- Build scripts include optional TypeScript-Go (`tsgo`) path.
