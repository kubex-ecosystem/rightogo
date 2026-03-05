# File Execution

## Current behavior

Execution is orchestrated by the extension and run in the Integrated Terminal.

## UX entry points

- Play button in editor title.
- Command Palette.
- Editor context menu.
- Explorer context menu (`.go` file).

## Fast argument input

Use:

- `RighToGo: Run Current Go Script (With Args)`

RighToGo opens a quick input box and forwards arguments to:

```bash
go run <file.go> <args...>
```

## Sequence with `go.mod`

```bash
cd <file-directory>
go run <file.go>
```

## Sequence without `go.mod` (ephemeral)

```bash
mktemp -d
cp <file.go> <temp>
cd <temp>
go mod init rightogo_temp_run
go mod tidy
go run <file.go>
# cleanup at the end (if enabled)
```

## Cleanup guarantee

The ephemeral run script uses an exit-trap strategy equivalent to `finally`, ensuring cleanup even on failure.

## Why Integrated Terminal

`OutputChannel` is read-only and does not support `stdin`.

Example that needs terminal input:

```go
package main

import "fmt"

func main() {
    var name string
    fmt.Print("Name: ")
    fmt.Scanln(&name)
    fmt.Println("Hello", name)
}
```

## New window execution

Use:

- `RighToGo: Run Current Go Script (New Window)`

Or enable `rightogo.runInNewWindowTerminalByDefault = true`.

RighToGo tries to move the terminal to a new VSCode window. If unsupported in the current VSCode build, it falls back to the panel terminal.
