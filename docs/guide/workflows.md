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

## Fluxo 5: Execução com argumentos

1. Abra o arquivo `.go` elegível.
2. Execute `RighToGo: Run Current Go Script (With Args)`.
3. Informe argumentos no input rápido (ex: `--port 8080 --name "John Doe"`).
4. Valide o comportamento no terminal.

## Fluxo 6: Execução destacada em nova janela

1. Use `RighToGo: Run Current Go Script (New Window)`.
2. A extensão tenta mover o terminal para uma nova janela do VSCode.
3. Se a build não suportar o comando de mover janela, a execução continua no painel principal.
