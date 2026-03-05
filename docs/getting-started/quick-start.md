# Quick Start

## 1. Abra um script Go elegível

O botão de execução aparece para arquivos Go com `package main`.

```go
package main

import "fmt"

func main() {
    fmt.Println("hello from RighToGo")
}
```

## 2. Execute pelo botão Play

Use o botão no título do editor ou a Command Palette.

- `RighToGo: Run Current Go Script`

## 3. Observe a execução no Terminal Integrado

A extensão usa o **RighToGo Terminal** para suportar:

- `stdout/stderr`
- `stdin` (scripts interativos com `fmt.Scanln`, por exemplo)

## 4. Teste o comando de análise (stub)

- `RighToGo: Ask LLM About This Script`

Esse comando coleta:

- texto do editor ativo
- último erro capturado de execução (quando existir)

## 5. Rode os testes automatizados

```bash
pnpm test
```
