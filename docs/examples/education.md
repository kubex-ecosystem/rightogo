# Educational Use

## Cenário

Instrutores e estudantes frequentemente precisam validar snippets de Go sem overhead de projeto completo.

## Como RighToGo ajuda

- Reduz etapas de configuração inicial.
- Permite foco no conceito ensinado (loops, structs, concorrência, etc.).
- Mantém interação de terminal para exercícios com entrada de usuário.

## Exemplo de laboratório rápido

1. Aluno cria `exercise.go` com `package main`.
2. Usa Play para executar.
3. Ajusta o código em ciclos curtos até atingir resultado esperado.

## Exemplo de script

```go
package main

import "fmt"

func main() {
    var n int
    fmt.Print("Digite um número: ")
    fmt.Scanln(&n)
    fmt.Printf("Dobro: %d\n", n*2)
}
```

## Resultado

Menos tempo gasto em setup, mais tempo investido em aprendizagem prática.
