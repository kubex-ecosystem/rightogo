# Configuration

## `rightogo.goBinaryPath`

- Tipo: `string`
- Default: `${userHome}/.go/bin/go`
- Uso: caminho absoluto do binário Go usado pela extensão.
- Suporte de template (resolvido pela extensão):
  - `${userHome}`
  - `${env:NOME_DA_VARIAVEL}`
  - `${workspaceFolder}`
  - `~` e `~/...`
- Fallback automático quando inválido: `${userHome}/.go/bin/go` e depois `go` no `PATH`.

## `rightogo.cleanupTemporaryDirectory`

- Tipo: `boolean`
- Default: `true`
- Uso: remove diretório temporário no fim da execução efêmera.

## `rightogo.promptForArgumentsOnRun`

- Tipo: `boolean`
- Default: `false`
- Uso: quando `true`, o comando padrão de execução sempre abre a caixa de diálogo de argumentos.

## `rightogo.runInNewWindowTerminalByDefault`

- Tipo: `boolean`
- Default: `false`
- Uso: quando `true`, a extensão tenta mover o terminal de execução para uma nova janela do VSCode.

## Exemplo de configuração (`settings.json`)

```json
{
  "rightogo.goBinaryPath": "/home/user/.go/bin/go",
  "rightogo.cleanupTemporaryDirectory": true,
  "rightogo.promptForArgumentsOnRun": false,
  "rightogo.runInNewWindowTerminalByDefault": false
}
```

## Boas práticas

- Defina caminho absoluto para o Go em ambientes com múltiplas instalações.
- Mantenha limpeza habilitada em uso diário.
- Desabilite limpeza apenas para debug pontual de problemas de dependência.
