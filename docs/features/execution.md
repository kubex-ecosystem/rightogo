# File Execution

## Comportamento atual

A execução é orquestrada pela extensão e delegada ao Terminal Integrado.

## Modos de UX para disparo da execução

- Botão Play no título do editor.
- Command Palette.
- Menu de contexto do editor.
- Menu de contexto do explorer (arquivo `.go`).

## Passagem rápida de argumentos

Use o comando:

- `RighToGo: Run Current Go Script (With Args)`

A extensão abre uma caixa de diálogo para inserir argumentos e os repassa para o processo:

```bash
go run <arquivo.go> <args...>
```

## Sequência no modo com `go.mod`

```bash
cd <diretorio-do-arquivo>
go run <arquivo.go>
```

## Sequência no modo efêmero

```bash
mktemp -d
cp <arquivo.go> <temp>
cd <temp>
go mod init rightogo_temp_run
go mod tidy
go run <arquivo.go>
# cleanup no fim (se habilitado)
```

## Garantia de limpeza

A rotina efêmera usa estratégia equivalente a `finally` no script de execução para garantir limpeza mesmo em falha.

## Por que Terminal Integrado

`OutputChannel` não suporta `stdin`.

Para scripts como abaixo, o terminal é obrigatório:

```go
package main

import "fmt"

func main() {
    var name string
    fmt.Print("Nome: ")
    fmt.Scanln(&name)
    fmt.Println("Olá", name)
}
```

## Execução em nova janela

Use o comando:

- `RighToGo: Run Current Go Script (New Window)`

Ou habilite `rightogo.runInNewWindowTerminalByDefault = true`.

A extensão tenta mover o terminal de execução para uma nova janela do VSCode e, se não houver suporte na build atual, usa fallback para painel.
