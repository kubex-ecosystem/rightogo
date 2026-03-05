# Commands Reference

## `rightogo.runScript`

Display name:

- `RighToGo: Run Current Go Script`

Behavior:

- Runs the active Go file in project or ephemeral mode.
- Available in editor title, command palette, and context menus.

## `rightogo.runScriptWithArgs`

Display name:

- `RighToGo: Run Current Go Script (With Args)`

Behavior:

- Opens a quick input box for arguments.
- Forwards args to program execution (`go run <file> <args...>`).

## `rightogo.runScriptInNewWindow`

Display name:

- `RighToGo: Run Current Go Script (New Window)`

Behavior:

- Executes normally, then attempts to move the terminal into a new VSCode window.
- Falls back to panel terminal when unsupported.

## `rightogo.askLlmAboutScript`

Display name:

- `RighToGo: Ask LLM About This Script`

Behavior:

- Collects local context for future provider integration.
- MVP uses a local no-network stub.

## Command Palette list

```text
> RighToGo: Run Current Go Script
> RighToGo: Run Current Go Script (With Args)
> RighToGo: Run Current Go Script (New Window)
> RighToGo: Ask LLM About This Script
```
