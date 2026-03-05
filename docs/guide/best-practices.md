# Best Practices

## Para usuários

- Mantenha scripts curtos e focados em uma hipótese por execução.
- Prefira modo efêmero para experimentos descartáveis.
- Use projetos com `go.mod` para fluxos persistentes.

## Para mantenedores

- Preserve validações de elegibilidade na UI e no comando.
- Priorize execução no Terminal para compatibilidade com stdin.
- Mantenha cobertura de testes em módulos de decisão (eligibilidade, sequência efêmera).

## Observabilidade mínima

- Registrar falhas relevantes no canal de output da extensão.
- Preservar preview do erro para o comando de análise LLM/MCP.

## Qualidade

```bash
pnpm run check-types
pnpm run lint
pnpm test
```
