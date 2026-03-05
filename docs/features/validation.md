# Validation System

## UI layer

The Play button is shown only when:

- the context key `rightogo.canRunActiveGoFile` is `true`
- active file satisfies Go script eligibility

## Command layer (final gate)

At execution time, RighToGo validates again:

- active/target file exists
- file is saved
- extension is `.go`
- first valid code line is `package main`
- Go binary is available

## Why dual validation

- Better visual UX.
- Runtime safety.
- Lower chance of out-of-scope execution.

!!! tip "Defense in depth"
    Command-level validation prevents reliance on UI-only state.
