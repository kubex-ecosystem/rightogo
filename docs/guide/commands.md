# Commands Reference

## Comandos

### `rightogo.runScript`

Título no VSCode:

- `RighToGo: Run Current Go Script`

Função:

- Executa o arquivo Go ativo usando modo de projeto ou efêmero.
- Também pode ser acionado no menu de contexto do editor e do explorer.

### `rightogo.runScriptWithArgs`

Título no VSCode:

- `RighToGo: Run Current Go Script (With Args)`

Função:

- Abre uma caixa de diálogo rápida para inserir argumentos.
- Encaminha os argumentos para o programa Go (`go run <arquivo> <args...>`).

### `rightogo.runScriptInNewWindow`

Título no VSCode:

- `RighToGo: Run Current Go Script (New Window)`

Função:

- Executa normalmente e tenta mover o terminal para uma nova janela do VSCode.
- Se o comando não estiver disponível na build do VSCode, faz fallback para terminal em painel.

### `rightogo.askLlmAboutScript`

Título no VSCode:

- `RighToGo: Ask LLM About This Script`

Função:

- Coleta contexto local para integração futura com provider LLM/MCP.
- No MVP, responde por stub local sem chamada de rede.

## Command Palette

```text
> RighToGo: Run Current Go Script
> RighToGo: Run Current Go Script (With Args)
> RighToGo: Run Current Go Script (New Window)
> RighToGo: Ask LLM About This Script
```
