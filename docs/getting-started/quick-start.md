# Quick Start

## 1. Open an eligible Go script

The run button is shown for Go files with `package main`.

```go
package main

import "fmt"

func main() {
    fmt.Println("hello from RighToGo")
}
```

## 2. Run from UI or context menus

Use the editor title button, Command Palette, or context menu.

- `RighToGo: Run Current Go Script`
- `RighToGo: Run Current Go Script (With Args)`
- `RighToGo: Run Current Go Script (New Window)`

## 3. Check output in Integrated Terminal

RighToGo uses **RighToGo Terminal** for:

- `stdout/stderr`
- `stdin` (interactive scripts, e.g. `fmt.Scanln`)

## 4. Test the analysis command (stub)

- `RighToGo: Ask LLM About This Script`

It collects:

- active editor content
- latest captured run error (when available)

## 5. Run automated tests

```bash
pnpm test
```
