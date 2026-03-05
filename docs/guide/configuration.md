# Configuration

## `rightogo.goBinaryPath`

- Tipo: `string`
- Default: `${HOME:-}/.go/bin/go`
- Uso: caminho absoluto do binário Go usado pela extensão.

## `rightogo.cleanupTemporaryDirectory`

- Tipo: `boolean`
- Default: `true`
- Uso: remove diretório temporário no fim da execução efêmera.

## Exemplo de configuração (`settings.json`)

```json
{
  "rightogo.goBinaryPath": "/home/user/.go/bin/go",
  "rightogo.cleanupTemporaryDirectory": true
}
```

## Boas práticas

- Defina caminho absoluto para o Go em ambientes com múltiplas instalações.
- Mantenha limpeza habilitada em uso diário.
- Desabilite limpeza apenas para debug pontual de problemas de dependência.
