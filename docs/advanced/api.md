# Extension API

## Pontos de extensão atuais

- Comandos VSCode registrados em `activate()`.
- Serviços internos para elegibilidade e sequência efêmera.
- Ponte local para análise LLM/MCP (stub).

## Contratos internos relevantes

```ts
isMainPackageScript(fileText: string): boolean
buildEphemeralCommandSequence(goBinaryPath: string, targetFileName: string): CommandInvocation[]
executeEphemeralCommandSequence(sequence, executor): Promise<void>
```

## Estratégia para evolução

- Manter contratos puros para teste unitário/integrado.
- Isolar lógica de shell/script em serviços dedicados.
- Evoluir `llmBridge` para interface de provider sem acoplamento de vendor.
