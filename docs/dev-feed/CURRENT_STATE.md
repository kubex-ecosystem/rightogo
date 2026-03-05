# CURRENT_STATE — RighToGo

## Overall status

The MVP is implemented, compiled, and tested. Primary execution uses the Integrated Terminal to support full `stdin`/`stdout` behavior.

## Current module map (`src/`)

- `src/extension.ts`
  - Extension entrypoint.
  - Registers commands:
    - `rightogo.runScript`
    - `rightogo.runScriptWithArgs`
    - `rightogo.runScriptInNewWindow`
    - `rightogo.askLlmAboutScript`
  - Coordinates validation, mode selection (`project` vs `ephemeral`), terminal execution, and run monitoring.

- `src/services/scriptEligibility.ts`
  - `extractFirstCodeLine(fileText)`
  - `isMainPackageScript(fileText)`

- `src/services/ephemeralRunner.ts`
  - `buildEphemeralCommandSequence(...)`
  - `executeEphemeralCommandSequence(...)`
  - `runEphemeralWithoutGoMod(...)`

- `src/services/programArgs.ts`
  - `parseProgramArguments(rawInput)`

- `src/test/runTest.ts`
  - VSCode extension testing bootstrap (`@vscode/test-electron`).

- `src/test/suite/*.test.ts`
  - Eligibility, ephemeral sequence, and argument parser coverage.

## Consolidated decisions

1. Primary channel: **Integrated Terminal** (`RighToGo Terminal`).
2. Temporary cleanup default: `rightogo.cleanupTemporaryDirectory = true`.
3. Cleanup guarantee: shell `trap ... EXIT` in ephemeral flow.
4. LLM/MCP integration: local interface stub only in MVP.
5. Go binary setting: `rightogo.goBinaryPath` with placeholder resolution and fallback.

## Known technical notes

- Run button visibility now relies on context key `rightogo.canRunActiveGoFile`.
- New-window terminal behavior depends on VSCode command availability and has safe fallback.

## Formal V2 spec — Interactive GoSetup

Goal: when Go is unavailable, offer safe user-profile installation instead of only showing an error.

### Business rules

1. Detect missing Go (`goLocator` failure).
2. Fetch versions from `https://go.dev/dl/?mode=json`.
3. Parse `version` and remove `go` prefix.
4. Show options in `vscode.window.showQuickPick`.
5. On approval, run installer script in Integrated Terminal.

- Unix/Mac:
  - `bash -c "$(curl -sSfL 'https://raw.githubusercontent.com/kubex-ecosystem/gosetup/main/go.sh')" -s install <SELECTED_VERSION>`
- Windows:
  - equivalent PowerShell flow using:
  - `https://raw.githubusercontent.com/kubex-ecosystem/gosetup/main/go.ps1`
  - command `install <SELECTED_VERSION>`

### Expected V2 outcome

- Batteries-included runtime provisioning without requiring global admin privileges.
