# Development

## Setup local

```bash
pnpm install
pnpm run compile
pnpm test
```

## Execução em modo desenvolvimento

- Abrir workspace no VSCode.
- Pressionar `F5`.
- Validar comando `RighToGo: Run Current Go Script`.

## Lint e tipagem

```bash
pnpm run check-types
pnpm run lint
```

## Empacotamento

```bash
pnpm run package
pnpm run vscode:build
```

## Estrutura de saída

- Build TypeScript: `dist/`
- Pacote de distribuição: `bin/*.vsix`

## Documentação do projeto

```bash
make build-docs
make serve-docs
```
