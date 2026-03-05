# Contributing

## Diretrizes

- Mantenha mudanças focadas e pequenas por PR.
- Preserve compatibilidade com fluxo atual de execução em Terminal Integrado.
- Não introduza breaking changes sem proposta prévia.

## Fluxo recomendado

```bash
git checkout -b feat/minha-mudanca
pnpm install
pnpm run check-types
pnpm run lint
pnpm test
```

## Checklist antes de abrir PR

- [ ] Testes passando
- [ ] Documentação atualizada
- [ ] Referências de build alinhadas com `dist/`
- [ ] Se aplicável, validar empacotamento em `bin/*.vsix`

## Escopo de colaboração atual

- V1: robustez e manutenção.
- V2: integração interativa com GoSetup quando Go não estiver disponível no host.
