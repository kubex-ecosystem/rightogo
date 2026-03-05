# Contributing

## Guidelines

- Keep PRs focused and small.
- Preserve compatibility with terminal-based execution flow.
- Do not introduce breaking changes without prior proposal.

## Recommended flow

```bash
git checkout -b feat/my-change
pnpm install
pnpm run check-types
pnpm run lint
pnpm test
```

## PR checklist

- [ ] Tests passing
- [ ] Documentation updated
- [ ] Build references aligned with `dist/`
- [ ] If applicable, validate packaging in `bin/*.vsix`

## Current collaboration scope

- V1: robustness and maintainability.
- V2: interactive GoSetup integration when Go is unavailable.
