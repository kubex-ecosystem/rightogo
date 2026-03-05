# Changelog

## [1.0.0] - 2026-03-04

### Added

- Comando de execução de script Go ativo.
- Modo de execução em projeto (`go.mod` presente).
- Modo efêmero para arquivos soltos (`go mod init`, `go mod tidy`, `go run`).
- Limpeza configurável de diretório temporário.
- Comando `Ask LLM` com stub local.
- Testes automatizados iniciais para elegibilidade e sequência efêmera.
- Base de doc-site em MkDocs Material.

### Changed

- Padronização de output de build em `dist/`.
- Empacotamento `.vsix` em `bin/`.
- Scripts de build com opção TypeScript-Go (`tsgo`) quando disponível.
