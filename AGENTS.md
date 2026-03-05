# Repository Guidelines

## Project Structure & Module Organization

- `src/`: extension source code (entrypoint: `src/extension.ts`).
- `src/services/`: focused logic modules (eligibility, ephemeral runner, args parsing).
- `src/test/`: VSCode integration test harness and Mocha suites (`src/test/suite/*.test.ts`).
- `dist/`: compiled output (generated; do not edit manually).
- `docs/`: MkDocs content source.
- `docs-site/`: built static site output (generated).
- `support/docs/mkdocs.yml`: documentation navigation/theme config.
- `bin/`: packaged `.vsix` artifacts.

## Build, Test, and Development Commands

- `pnpm install`: install dependencies.
- `pnpm run compile`: compile TypeScript to `dist/`.
- `pnpm test`: run extension tests (`@vscode/test-electron` + Mocha/Chai).
- `pnpm run lint`: run ESLint on `src`.
- `pnpm run build`: type-check + lint + compile + package flow.
- `pnpm run vscode:build`: create VSIX in `bin/`.
- `make build-docs`: build docs site from `docs/`.
- `make serve-docs`: serve docs locally.

## Coding Style & Naming Conventions

- Language: TypeScript (`strict` mode enabled in `tsconfig.json`).
- Indentation: 2 spaces; keep functions small and service-oriented.
- Naming:
  - files: `camelCase.ts` in services (e.g., `scriptEligibility.ts`)
  - tests: `*.test.ts`
  - command IDs/config keys: `rightogo.*`
- Keep shell command construction escaped/safe (`toSingleQuotedShellArg`).

## Testing Guidelines

- Frameworks: Mocha + Chai, executed through VSCode Extension Testing API.
- Add tests for behavior changes in `src/services/*` and command flow regressions.
- Minimum expectation for PRs: all existing tests pass and new logic includes focused tests.
- Run locally: `pnpm test`.

## Commit & Pull Request Guidelines

- Follow Conventional Commits seen in history: `feat:`, `fix:`, `docs:`, `test:`, `chore:`.
- Use imperative, scoped messages (example: `feat: add quick args runner command`).
- PR should include:
  - clear summary and motivation
  - linked issue (if any)
  - test evidence (`pnpm test`, relevant command output)
  - screenshots/GIFs for UI/menu changes
  - docs updates when commands/config/UX change

## Security & Configuration Notes

- Do not commit secrets or machine-specific credentials.
- Prefer `rightogo.goBinaryPath` with supported templates (`${userHome}`, `${env:VAR}`, `~`).
- Keep temporary execution cleanup enabled unless debugging.
