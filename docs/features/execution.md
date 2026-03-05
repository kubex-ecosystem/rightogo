# File Execution

## Comportamento atual

A execução é orquestrada pela extensão e delegada ao Terminal Integrado.

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
