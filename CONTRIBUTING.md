# Como contribuir

1. Abra uma issue descrevendo o bug ou a ideia (use os templates).
2. Faça um fork e crie uma branch a partir de `main`:
   `git switch -c feat/nome-curto`
3. Faça commits pequenos, seguindo o padrão abaixo.
4. Teste no navegador: o jogo inicia, pausa com `P` e termina após 3 colisões.
5. Abra o pull request preenchendo o template e referencie a issue (`Closes #N`).

## Padrão de commits

`tipo: descrição curta no imperativo`

| Tipo | Quando usar |
| --- | --- |
| `feat` | nova funcionalidade |
| `fix` | correção de bug |
| `docs` | documentação |
| `style` | formatação ou visual, sem mudar a lógica |
| `refactor` | reorganização sem mudar o comportamento |
| `chore` | configuração e manutenção |

Exemplo: `fix: impede pontuação duplicada ao coletar luz`
