# Best Practices

## For users

- Keep scripts short and hypothesis-driven.
- Prefer ephemeral mode for disposable experiments.
- Use full projects with `go.mod` for persistent workflows.

## For maintainers

- Keep eligibility checks in both UI and command runtime.
- Prioritize terminal-based execution for `stdin` compatibility.
- Maintain coverage on decision services (eligibility, ephemeral sequence, args parser).

## Minimum observability

- Log relevant failures to the extension output channel.
- Preserve concise error previews for the LLM/MCP analysis flow.

## Quality gate

```bash
pnpm run check-types
pnpm run lint
pnpm test
```
