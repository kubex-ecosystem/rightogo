# Basic Concepts

## Elegibilidade do script

RighToGo só executa arquivo com perfil de programa executável:

- linguagem Go
- extensão `.go`
- primeira linha de código válida com `package main`

## Dois modos de execução

=== "Project Mode"

    Usa diretório local do arquivo quando existe `go.mod`.

    ```bash
    go run <arquivo.go>
    ```

=== "Ephemeral Mode"

    Cria ambiente temporário quando não existe `go.mod`.

    ```bash
    go mod init rightogo_temp_run
    go mod tidy
    go run <arquivo.go>
    ```

## Telemetria local de erro

O estado da última execução falha é armazenado para o fluxo de análise com LLM/MCP (placeholder local no MVP).

## Limpeza de temporário

A configuração `rightogo.cleanupTemporaryDirectory` controla se a pasta efêmera será removida ao final.

- default: `true`
