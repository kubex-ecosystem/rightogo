# Installation

## Requisitos

- VSCode `>= 1.95.0`
- Node.js `>= 16`
- `pnpm` recomendado para desenvolvimento
- Go instalado (ou caminho configurado em `rightogo.goBinaryPath`)

## Instalação para desenvolvimento local

```bash
pnpm install
pnpm run compile
```

Depois, pressione `F5` no VSCode para abrir o **Extension Development Host**.

## Instalação por pacote `.vsix`

O empacotamento da extensão gera o artefato em `bin/`.

```bash
pnpm run vscode:build
```

Exemplo de saída:

```text
bin/rightogo-1.0.0.vsix
```

## Diretórios de build relevantes

- Runtime compilado: `dist/`
- Arquivo de extensão para distribuição: `bin/*.vsix`

!!! note "Sobre saída de build"
    A base atual usa `dist/` como diretório de output para o código compilado da extensão.
