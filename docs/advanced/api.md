# Extension API

## Current extension points

- VSCode commands registered in `activate()`.
- Internal service modules for eligibility and ephemeral sequence planning.
- Local bridge for LLM/MCP analysis (MVP stub).

## Relevant internal contracts

```ts
isMainPackageScript(fileText: string): boolean
buildEphemeralCommandSequence(goBinaryPath: string, targetFileName: string): CommandInvocation[]
executeEphemeralCommandSequence(sequence, executor): Promise<void>
parseProgramArguments(rawInput: string): ParsedArgsResult
```

## Evolution strategy

- Keep pure contracts for testability.
- Isolate shell generation and process execution logic.
- Evolve `llmBridge` into provider-agnostic integration.
