# CURRENT_STATE — RighToGo

## Status Geral

MVP funcional implementado e compilando. Execução principal ocorre no Terminal Integrado para suportar `stdin`/`stdout` sem bloqueio em scripts interativos.

## Mapeamento de Módulos em `src/`

- `src/extension.ts`
  - Ponto de entrada da extensão.
  - Registro de comandos:
    - `rightogo.runScript`
    - `rightogo.askLlmAboutScript`
  - Orquestra validações, decisão de modo (`project` ou `ephemeral`) e envio para Terminal.
  - Captura estado da última execução para o stub de LLM/MCP.

- `src/services/scriptEligibility.ts`
  - `extractFirstCodeLine(fileText)`: extrai a primeira linha de código válida (ignora espaços e comentários).
  - `isMainPackageScript(fileText)`: valida presença de `package main` como primeira linha de código válida.

- `src/services/ephemeralRunner.ts`
  - `buildEphemeralCommandSequence(goBinaryPath, targetFileName, moduleName?)`: gera sequência de comandos do modo efêmero.
  - `executeEphemeralCommandSequence(sequence, executor)`: executa comandos na ordem definida (usado em testes).

- `src/test/runTest.ts`
  - Bootstrap do VSCode Extension Testing API via `@vscode/test-electron`.

- `src/test/suite/index.ts`
  - Runner Mocha para descobrir e executar `*.test.js`.

- `src/test/suite/scriptEligibility.test.ts`
  - Cenário A: valida detecção de `package main` e rejeição de pacote de biblioteca.

- `src/test/suite/ephemeralRunner.test.ts`
  - Cenário B: valida ordem da sequência efêmera (`mod init` -> `mod tidy` -> `run`) usando executor mockado.

## Decisões Arquiteturais Consolidadas

1. Canal principal: **Terminal Integrado** (`RighToGo Terminal`).
2. Limpeza de temporário: `rightogo.cleanupTemporaryDirectory = true` por padrão.
3. Limpeza garantida por `trap cleanup EXIT` no script shell gerado, efetivamente cobrindo o equivalente a `finally` para o fluxo efêmero.
4. Stub LLM/MCP: somente interface local, sem chamadas de rede no MVP.
5. Binário Go configurável: `rightogo.goBinaryPath` com default `/home/user/.go/bin/go`.

## Pendências do MVP

- Não há pendências de escopo MVP definidas no `PROMPT_A02`.

## Riscos/Gap Técnico Atual

- A visibilidade do botão usa `editorTextMatches`; a validação de segurança no comando continua como gate definitivo.
- A estratégia atual de monitoramento lê arquivo de status/log assíncrono para registrar erro no stub LLM. Funciona para MVP, mas V2 pode trocar para telemetria de execução mais granular.

## Especificação Formal V2 — Integração GoSetup Interativa

Objetivo: quando o `goLocator` não encontrar Go no host, a extensão deixa de apenas falhar e oferece fluxo de instalação segura em perfil de usuário.

### Regras de Negócio

1. Detectar ausência de binário Go (`goLocator` falhou).
2. Buscar versões em `https://go.dev/dl/?mode=json`.
3. Extrair `version` removendo prefixo `go` (ex.: `go1.26.0` -> `1.26.0`).
4. Exibir seleção com `vscode.window.showQuickPick`.
5. Ao confirmar, executar no Terminal Integrado:

- Unix/Mac:
  - `bash -c "$(curl -sSfL 'https://raw.githubusercontent.com/kubex-ecosystem/gosetup/main/go.sh')" -s install <VERSAO_ESCOLHIDA>`
- Windows:
  - fluxo equivalente via PowerShell:
  - `https://raw.githubusercontent.com/kubex-ecosystem/gosetup/main/go.ps1` com `install <VERSAO_ESCOLHIDA>`

### Resultado Esperado V2

- Extensão com comportamento `batteries-included` para provisionamento de runtime Go sem exigir privilégios administrativos globais.
