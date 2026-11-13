#!/usr/bin/env bash
# Cria o repositório, os commits, uma issue e um pull request no GitHub.
# Requisitos: git e GitHub CLI (gh) autenticado -> gh auth login
# Uso: ./scripts/publicar.sh [nome-do-repo] [--public|--private]
set -euo pipefail

REPO="${1:-vagalume}"
VISIBILIDADE="${2:---public}"

cd "$(dirname "$0")/.."

git init -b main

git add .gitignore LICENSE
git commit -m "chore: inicia repositório com licença MIT e .gitignore"

git add index.html style.css
git commit -m "feat: adiciona página e estilo do jogo"

git add src/game.js
git commit -m "feat: implementa loop, colisões, vidas, pausa e recorde"

git add README.md CONTRIBUTING.md docs scripts
git commit -m "docs: adiciona README, guia de contribuição e exemplos"

git add .github
git commit -m "chore: adiciona templates de issue e pull request"

gh repo create "$REPO" "$VISIBILIDADE" --source=. --remote=origin --push

# Issue (será a #1 em um repositório novo)
gh issue create \
  --title "docs: criar CHANGELOG.md com a versão 0.1.0" \
  --body-file docs/exemplos/issue.md

# Branch + commit + pull request
git switch -c docs/changelog

cat > CHANGELOG.md <<'CHG'
# Changelog

Formato baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/).

## [0.1.0] - 2026-11-13

### Adicionado
- Movimento por mouse, toque, setas e teclas A/D
- Luzes para coletar e morcegos para desviar
- Sistema de 3 vidas com breve invulnerabilidade
- Pausa com a tecla P
- Recorde salvo no navegador
CHG

git add CHANGELOG.md
git commit -m "docs: adiciona CHANGELOG com a versão 0.1.0"
git push -u origin docs/changelog

gh pr create \
  --base main \
  --head docs/changelog \
  --title "docs: adiciona CHANGELOG.md (0.1.0)" \
  --body-file docs/exemplos/pull-request.md

echo "Pronto! Repositório, issue e pull request criados."
