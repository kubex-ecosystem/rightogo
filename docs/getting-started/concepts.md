# Basic Concepts

## Script eligibility

RighToGo only runs files that match executable script criteria:

- Go language file
- `.go` extension
- first valid code line is `package main`

## Two execution modes

=== "Project Mode"

    Uses the file directory when `go.mod` exists.

    ```bash
    go run <file.go>
    ```

=== "Ephemeral Mode"

    Creates a temporary environment when `go.mod` is missing.

    ```bash
    go mod init rightogo_temp_run
    go mod tidy
    go run <file.go>
    ```

## Local error context

The latest failed run snapshot is persisted for the LLM/MCP bridge flow (local MVP placeholder).

## Temporary cleanup

`rightogo.cleanupTemporaryDirectory` controls whether ephemeral directories are removed after execution.

- default: `true`
