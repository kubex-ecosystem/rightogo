# ![RighToGo](https://raw.githubusercontent.com/kubex-ecosystem/rightogo/refs/heads/main/docs/assets/top_banner.png)

[![License: MIT](<https://img.shields.io/badge/License-MIT-green.png?style=flat-square>)](LICENSE)
[![VSCode](https://img.shields.io/badge/VSCode-Marketplace-blue?style=flat-square&logo=visual-studio-code&logoColor=white)](https://marketplace.visualstudio.com/items?itemName=rafa-mori.rightogo)
[![OpenVSIX](https://img.shields.io/badge/OpenVSX-Marketplace-purple?style=flat-square&logo=visual-studio-code&logoColor=purple)](https://open-vsx.org/extension/rafa-mori/rightogo)
[![TypeScript](https://img.shields.io/badge/TypeScript-100%25-cyan.png)](https://www.typescriptlang.org/)
[![Release](https://img.shields.io/badge/Version-1.0.0-orange.png)](https://github.com/kubex-ecosystem/rightogo/releases/latest)

---

[🇧🇷 Portuguese documentation](https://raw.githubusercontent.com/kubex-ecosystem/rightogo/refs/heads/main/docs/README.pt-BR.md)

RighToGo is a VSCode extension designed to remove friction when running ephemeral Go scripts. It enables fast testing cycles without requiring manual project setup for every snippet.

## Purpose

- Run Go scripts with one click from the editor.
- Remove the `go.mod` blocker for standalone files.
- Preserve interactive execution (`stdin` / `stdout`) through the integrated terminal.

## How It Works

### 1) File inside a project with `go.mod`

- Detects `go.mod` in the file directory.
- Runs `go run <file.go>` in the `RighToGo Terminal`.

### 2) Standalone file without `go.mod`

- Creates a temporary directory.
- Copies the current Go file.
- Executes:
  - `go mod init rightogo_temp_run`
  - `go mod tidy`
  - `go run <file.go>`
- Cleans up the temporary directory when `rightogo.cleanupTemporaryDirectory = true` (default).

## Commands

- `RighToGo: Run Current Go Script`
- `RighToGo: Run Current Go Script (With Args)`
- `RighToGo: Run Current Go Script (New Window)`
- `RighToGo: Ask LLM About This Script` (local stub, no network call)

## Settings

- `rightogo.goBinaryPath`: Go binary path.
  - default: `${userHome}/.go/bin/go`
  - supports `${userHome}`, `${env:VAR}`, `${workspaceFolder}`, `~`
- `rightogo.cleanupTemporaryDirectory`: cleanup temporary directory after execution.
  - default: `true`
- `rightogo.promptForArgumentsOnRun`: prompt for arguments on the default run command.
  - default: `false`
- `rightogo.runInNewWindowTerminalByDefault`: try moving the run terminal to a new VSCode window.
  - default: `false`

## Build, Test, and Local Run

1. `pnpm install`
2. `pnpm run compile`
3. `pnpm test`
4. Press `F5` in VSCode to open Extension Development Host.
5. Open a `.go` file with `package main` and click Play.

## Real Productivity Cases

- Quick parser/regex/payload helper experiments without full project setup.
- Fast bug reproduction scripts with external dependencies.
- Interactive troubleshooting scripts using `fmt.Scanln`.
- Disposable proofs of concept for API/client behavior.

## Roadmap / V2

### Native Interactive GoSetup Integration (Kubex-Ecosystem)

When Go is missing, RighToGo will offer safe, user-profile installation instead of only returning an error.

Planned flow:

1. Fetch versions from `https://go.dev/dl/?mode=json`.
2. Parse `version` and remove `go` prefix (e.g. `go1.26.0` -> `1.26.0`).
3. Show versions with `vscode.window.showQuickPick`.
4. On confirmation, run installer in the integrated terminal:
   - Unix/Mac:
     - `bash -c "$(curl -sSfL 'https://raw.githubusercontent.com/kubex-ecosystem/gosetup/main/go.sh')" -s install <SELECTED_VERSION>`
   - Windows:
     - equivalent PowerShell flow using:
     - `https://raw.githubusercontent.com/kubex-ecosystem/gosetup/main/go.ps1`
     - command `install <SELECTED_VERSION>`

Expected outcome:

- Full runtime onboarding resilience.
- Batteries-included behavior with explicit user control over Go version.
