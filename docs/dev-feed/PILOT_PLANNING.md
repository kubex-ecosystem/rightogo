# PILOT_PLANNING — Go QuickRun (Historical)

This file captures the original pilot planning baseline created before implementation and naming updates.

## Pilot objective

Build a VSCode extension to remove friction from running quick Go scripts, including standalone files that do not have `go.mod`.

## MVP baseline scope

1. Play button in editor title for eligible Go scripts.
2. Project-mode execution when `go.mod` exists.
3. Ephemeral execution when `go.mod` is missing:
   - create temp dir
   - copy file
   - `go mod init`
   - `go mod tidy`
   - `go run`
   - cleanup
4. LLM/MCP bridge command (stub only).
5. Robust error handling through VSCode messages.

## Initial architecture notes

- `run` command orchestrator.
- `goLocator` with configurable binary path.
- script eligibility service.
- project and ephemeral runner services.
- dedicated output/terminal strategy.
- LLM bridge placeholder.

## Acceptance goals (pilot)

- Correct run behavior in project and standalone contexts.
- Clear errors and logs.
- Compilable and testable extension host execution.

## Follow-up evolution considered in planning

- Ephemeral cache by import hash.
- Error auto-explain flow.
- Reproducible temp snapshots.
- GoSetup-assisted runtime onboarding.

## Notes

- This planning document is intentionally preserved as a historical record.
- Current product name and architecture details are documented in:
  - `docs/dev-feed/CURRENT_STATE.md`
