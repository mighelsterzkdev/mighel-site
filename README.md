# mighel-site

Site pessoal de Mighel Sterzk: projetos, atividade no GitHub e contato.

**Site:** https://mighelsterzkdev.github.io/mighel-site/

## Estrutura

- `dist/` — o site publicado (HTML, CSS, JS e assets).
- `src/update-github-activity.mjs` — atualiza `dist/assets/github-activity.json` com o calendário de contribuições do GitHub.
- `preview.mjs` — servidor local para testar o site.

## Rodar localmente

```bash
npm run dev
```

Abre em http://127.0.0.1:4173.

## Publicação

Cada push no `main` publica o site no GitHub Pages pelo workflow `.github/workflows/pages.yml`. O workflow também roda todo dia para atualizar o calendário de contribuições.
