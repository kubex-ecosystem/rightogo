# Validation System

## Camada de UI

O botão Play no `editor/title` só aparece quando:

- `resourceLangId == go`
- `editorTextMatches` indica `package main`

## Camada de comando (gate final)

Além da UI, o comando valida novamente:

- editor ativo existente
- arquivo salvo
- extensão `.go`
- primeira linha de código válida com `package main`
- disponibilidade do binário Go

## Objetivo da dupla validação

- Melhor UX visual
- Segurança funcional no runtime
- Menor chance de execução fora do escopo esperado

!!! tip "Defesa em profundidade"
    A validação no comando evita depender exclusivamente de estado visual ou contexto parcial do editor.
