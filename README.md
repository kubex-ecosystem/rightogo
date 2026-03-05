# RighToGo

RighToGo é uma extensão para VSCode criada para reduzir a fricção de executar scripts Go efêmeros. O objetivo é permitir ciclos rápidos de teste sem obrigar setup manual de projeto em cada snippet.

## Propósito

- Executar scripts Go com um clique em contexto de editor.
- Eliminar o bloqueio de `go.mod` para arquivos soltos.
- Preservar experiência interativa com `stdin` e `stdout` via Terminal Integrado.

## Como Funciona

### 1) Arquivo dentro de projeto com `go.mod`

- A extensão detecta `go.mod` no diretório do arquivo.
- Executa `go run <arquivo.go>` no `RighToGo Terminal`.

### 2) Arquivo solto sem `go.mod`

- Cria diretório temporário.
- Copia o arquivo Go.
- Executa sequência:
  - `go mod init rightogo_temp_run`
  - `go mod tidy`
  - `go run <arquivo.go>`
- Remove o diretório temporário ao final quando `rightogo.cleanupTemporaryDirectory = true` (default).

## Comandos

- `RighToGo: Run Current Go Script`
- `RighToGo: Run Current Go Script (With Args)`
- `RighToGo: Run Current Go Script (New Window)`
- `RighToGo: Ask LLM About This Script` (stub local, sem rede)

## Configurações

- `rightogo.goBinaryPath`: caminho do binário Go.
  - default: `${userHome}/.go/bin/go`
  - suporte a `${userHome}`, `${env:VAR}`, `${workspaceFolder}`, `~`
- `rightogo.cleanupTemporaryDirectory`: remove pasta temporária após execução.
  - default: `true`
- `rightogo.promptForArgumentsOnRun`: abre input de argumentos no comando padrão.
  - default: `false`
- `rightogo.runInNewWindowTerminalByDefault`: tenta mover terminal para nova janela.
  - default: `false`

## Build, Teste e Execução Local

1. `pnpm install`
2. `pnpm run compile`
3. `pnpm test`
4. Pressione `F5` no VSCode para abrir o Extension Development Host.
5. Abra um `.go` com `package main` e use o botão Play no título do editor.

## Real Cases de Produtividade

- Teste rápido de parser, regex, payload transformer ou helper de infra sem criar projeto completo.
- Reproduzir bug em script curto com dependência externa e validar correção em minutos.
- Rodar snippets de troubleshooting com entrada interativa (`fmt.Scanln`) direto no terminal.
- Criar prova de conceito local para API/client e descartar ambiente efêmero automaticamente.

## Roadmap / V2

### Integração nativa e interativa com GoSetup (Kubex-Ecosystem)

Quando o Go não estiver disponível no host, RighToGo deixará de apenas emitir erro e oferecerá provisionamento seguro no perfil do usuário.

Fluxo proposto:

1. Buscar versões em `https://go.dev/dl/?mode=json`.
2. Extrair `version` e remover prefixo `go` (ex.: `go1.26.0` -> `1.26.0`).
3. Mostrar versões em `vscode.window.showQuickPick`.
4. Ao confirmar, abrir Terminal Integrado e executar:
   - Unix/Mac:
     - `bash -c "$(curl -sSfL 'https://raw.githubusercontent.com/kubex-ecosystem/gosetup/main/go.sh')" -s install <VERSAO_ESCOLHIDA>`
   - Windows:
     - fluxo equivalente em PowerShell usando:
     - `https://raw.githubusercontent.com/kubex-ecosystem/gosetup/main/go.ps1`
     - comando `install <VERSAO_ESCOLHIDA>`

Resultado esperado da V2:

- Resiliência total no onboarding do runtime Go.
- Operação `batteries-included` sem depender de setup manual prévio.
- Preservação de controle explícito do usuário sobre versão instalada.
