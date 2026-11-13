# Vagalume

Jogo de navegador feito com HTML, CSS e JavaScript puro. Você é um vagalume:
colete as luzes que caem e fuja dos morcegos. Quanto mais tempo passa, mais
rápida fica a noite.

## Como jogar

| Ação | Controle |
| --- | --- |
| Mover | Mouse, toque, setas ← → ou `A` / `D` |
| Pausar / continuar | `P` |
| Iniciar | Botão **Jogar** |

- Cada luz coletada vale 1 ponto.
- Você tem 3 vidas. Ao ser atingido, fica invulnerável por pouco mais de 1 segundo.
- O recorde fica salvo no seu navegador (`localStorage`).

## Rodando localmente

Não há dependências nem etapa de build.

```bash
git clone https://github.com/SEU-USUARIO/vagalume.git
cd vagalume

# opção 1: abrir o arquivo direto
open index.html        # macOS  |  xdg-open index.html (Linux)  |  start index.html (Windows)

# opção 2: servidor local
python3 -m http.server 8000   # depois acesse http://localhost:8000
```

## Publicando no GitHub Pages

1. Em **Settings → Pages**, escolha a branch `main` e a pasta `/ (root)`.
2. Salve. O jogo ficará em `https://SEU-USUARIO.github.io/vagalume/`.

## Estrutura

```
vagalume/
├── index.html          # página e HUD
├── style.css           # visual
├── src/game.js         # loop, colisões, vidas, recorde
├── scripts/publicar.sh # cria commits, issue e pull request de exemplo
├── docs/exemplos/      # textos usados na issue e no PR
└── .github/            # templates de issue e pull request
```

## Contribuindo

Veja [CONTRIBUTING.md](CONTRIBUTING.md). Bugs e ideias entram como
[issues](../../issues); mudanças entram por pull request.

## Ideias para o futuro

- [ ] Efeitos sonoros
- [ ] Power-up de escudo
- [ ] Placar online

## Licença

[MIT](LICENSE)
