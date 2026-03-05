# PILOT_PLANNING — Go QuickRun

## 1) Objetivo do piloto

Entregar uma extensão VSCode chamada **Go QuickRun** para reduzir fricção na execução de scripts Go rápidos, inclusive quando o arquivo não está em projeto com `go.mod`.

Resultado esperado: executar um `.go` com `package main` em 1 clique, com feedback claro de sucesso/erro e fluxo robusto para ambiente efêmero.

## 2) Escopo funcional (MVP obrigatório)

1. **Botão Play no editor title**

- Exibir no canto superior direito.
- Visível apenas para arquivo Go elegível (`.go` + contexto de script executável com `package main`).

1. **Execução em projeto com `go.mod`**

- Detectar `go.mod` no diretório do arquivo.
- Executar `go run <arquivo.go>` via terminal/canal dedicado QuickRun.

1. **Execução efêmera (sem `go.mod`/arquivo solto)**

- Criar diretório temporário.
- Copiar arquivo atual.
- Rodar `go mod init temp_run`.
- Rodar `go mod tidy`.
- Rodar `go run <arquivo.go>`.
- Exibir stdout/stderr no canal QuickRun.
- Limpeza do temporário após execução (configurável).

1. **Comando para LLM/MCP (stub)**

- Command Palette: `Go QuickRun: Ask LLM about this script`.
- Coletar: texto do editor ativo + último erro de execução (se houver).
- Encaminhar para interface stub plugável de provedor LLM/MCP.

1. **Tratamento de falhas**

- Mensagens elegantes com `vscode.window.showErrorMessage` para:
  - Go indisponível em PATH/config.
  - Falha em criação de diretório temporário.
  - Falha em `go mod init/tidy/run`.
  - Arquivo não salvo/inválido para execução.

## 3) Entregáveis do primeiro ciclo

1. `package.json` completo com `contributes`:

- Comandos.
- Item de menu em `editor/title` com contexto de visibilidade para Go.

1. `src/extension.ts` modularizado:

- Orquestração de execução normal/efêmera.
- Serviço de terminal/output.
- Serviço de validação de arquivo-alvo.
- Stub de integração LLM/MCP.

1. Guia enxuto de build/teste local:

- `npm install`
- `npm run compile`
- `F5` no VSCode
- Teste em arquivo Go com/sem `go.mod`

## 4) Arquitetura proposta

### 4.1 Módulos principais

- `command/runGoQuickRun`:
  - Entry-point do botão Play.
  - Decide estratégia (projeto vs efêmero).

- `services/goLocator`:
  - Resolve binário Go por prioridade:
    1. setting `goQuickRun.goBinaryPath`
    2. PATH do sistema
  - Valida disponibilidade (`go version`).

- `services/scriptEligibility`:
  - Verifica se editor ativo é `.go`.
  - Faz parsing leve da primeira linha de código válida para `package main`.

- `services/ephemeralRunner`:
  - Cria temp dir.
  - Copia arquivo.
  - Executa pipeline `mod init` -> `mod tidy` -> `go run`.
  - Limpeza conforme setting.

- `services/projectRunner`:
  - Executa `go run` em contexto de projeto com `go.mod`.

- `services/outputChannel`:
  - Canal dedicado `Go QuickRun`.
  - Persistência de último erro para comando LLM.

- `services/llmBridge` (stub):
  - Interface `askAboutScript({ scriptText, lastError, metadata })`.
  - Implementação inicial sem rede (placeholder).

### 4.2 Estratégia de execução

- Preferência por `OutputChannel` para logs estruturados.
- Fallback opcional para terminal integrado quando necessário.
- Comandos de shell executados por API Node (`child_process`) com cwd controlado.

## 5) Plano de implementação (ordem)

1. Scaffold da extensão e `package.json` com `contributes`.
2. Implementar verificação de elegibilidade do arquivo (`package main`).
3. Implementar runner de projeto (`go.mod` presente).
4. Implementar runner efêmero completo.
5. Implementar output + captura de erros.
6. Implementar comando LLM/MCP stub.
7. Hardening de erros e mensagens UX.
8. Build e validação manual do fluxo ponta a ponta.
9. Documentar passo a passo de teste local.

## 6) Critérios de aceitação

- Botão Play aparece apenas quando arquivo Go elegível está ativo.
- Em projeto com `go.mod`, execução usa diretório local e roda com sucesso.
- Sem `go.mod`, execução efêmera funciona incluindo dependências.
- Erros de execução ficam visíveis e legíveis no canal QuickRun.
- Comando LLM/MCP abre caminho de integração com payload completo.
- Extensão compila sem erros e roda no Extension Development Host.

## 7) Testes de validação do piloto

1. **Caso feliz A**: script simples sem imports externos, sem `go.mod`.
2. **Caso feliz B**: script com import externo (força `go mod tidy`) sem `go.mod`.
3. **Caso feliz C**: script dentro de projeto com `go.mod`.
4. **Erro A**: Go ausente/caminho inválido.
5. **Erro B**: arquivo sem `package main`.
6. **Erro C**: falha de compilação Go (captura e disponibilização para LLM stub).

## 8) Riscos e mitigação

- **Visibilidade do botão com condição de conteúdo**:
  - Mitigação: combinar `resourceLangId == go` no menu + validação forte no comando (gate final).
- **PATH divergente entre ambiente host e VSCode**:
  - Mitigação: setting explícito para binário Go.
- **Sobrecusto de `go mod tidy` a cada execução efêmera**:
  - Mitigação futura: cache de módulo efêmero por hash de imports.
- **Limpeza de diretório temporário em caso de crash**:
  - Mitigação: rotina best-effort + flag de retenção para debug.

## 9) Propostas inovadoras para avaliação (não-MVP)

1. **Ephemeral Cache Inteligente por Hash**

- Reutilizar ambiente efêmero por assinatura do script/imports para reduzir tempo de execução.

1. **Modo "Run Matrix"**

- Executar o mesmo script com múltiplos `GOOS/GOARCH` para smoke check rápido.

1. **Perfil de Performance Rápido**

- Atalho para rodar com `-race` e/ou `-bench` em scripts elegíveis, exibindo resumo no Output.

1. **Auto-Explain de Erro (LLM/MCP)**

- No erro, botão contextual para gerar diagnóstico resumido + sugestão de correção.

1. **Snapshot Reprodutível**

- Exportar zip do temp-run (código + `go.mod` gerado + logs) para compartilhamento entre devs.

1. **Trusted Dependencies Report**

- Resumo de módulos baixados no `tidy`, destacando licenças e origem de domínio.

## 10) Decisões estruturais para alinhamento

1. Canal principal de saída: `OutputChannel` como padrão (com opção de Terminal)?
2. Limpeza de temporário: default `true` ou `false` para facilitar debug inicial?
3. Escopo do LLM stub no piloto: apenas interface local ou já com configuração de provider por setting?
4. Queremos incluir no MVP setting explícito de binário Go (`goQuickRun.goBinaryPath`) para garantir uso consistente do ambiente?

## 11) Restrições operacionais observadas

- Não instalar/remover componentes do host sem autorização explícita.
- Usar stack já disponível no ambiente.
- Em caso de necessidade estrutural nova, pausar e alinhar antes de avançar.
