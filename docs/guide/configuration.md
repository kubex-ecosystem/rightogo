# Configuration

## `rightogo.goBinaryPath`

- Type: `string`
- Default: `${userHome}/.go/bin/go`
- Purpose: Go binary path used by RighToGo.
- Supported templates (resolved by extension):
  - `${userHome}`
  - `${env:VARIABLE_NAME}`
  - `${workspaceFolder}`
  - `~` and `~/...`
- Fallback when invalid: `${userHome}/.go/bin/go`, then `go` from `PATH`.

## `rightogo.cleanupTemporaryDirectory`

- Type: `boolean`
- Default: `true`
- Purpose: remove ephemeral execution directories after run.

## `rightogo.promptForArgumentsOnRun`

- Type: `boolean`
- Default: `false`
- Purpose: always prompt for CLI arguments on the default run command.

## `rightogo.runInNewWindowTerminalByDefault`

- Type: `boolean`
- Default: `false`
- Purpose: try moving run terminal to a new VSCode window by default.

## Example (`settings.json`)

```json
{
  "rightogo.goBinaryPath": "/home/user/.go/bin/go",
  "rightogo.cleanupTemporaryDirectory": true,
  "rightogo.promptForArgumentsOnRun": false,
  "rightogo.runInNewWindowTerminalByDefault": false
}
```

## Best practices

- Prefer absolute Go paths in multi-runtime environments.
- Keep cleanup enabled for day-to-day usage.
- Disable cleanup only for targeted debugging.
