# Workflows

## Fluxo 1: Snippet rápido sem projeto

1. Criar arquivo `snippet.go`.
2. Garantir `package main`.
3. Executar com Play.
4. Validar resultado no terminal.
5. Descartar arquivo ou evoluir para projeto formal.

## Fluxo 2: Reproduzir bug com dependência externa

1. Criar script mínimo que reproduz erro.
2. Rodar em modo efêmero para resolver dependências automaticamente.
3. Ajustar código e reexecutar rapidamente.

## Fluxo 3: Script interativo

1. Criar programa com `fmt.Scanln`.
2. Executar via RighToGo.
3. Inserir dados no `RighToGo Terminal`.

## Fluxo 4: Ciclo de desenvolvimento da extensão

```bash
pnpm install
pnpm run compile
pnpm test
pnpm run lint
```

Empacotamento:

```bash
pnpm run vscode:build
```

Saída esperada:

- JS compilado em `dist/`
- `.vsix` em `bin/`
