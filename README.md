# Mighel Sterzk

Site pessoal estático, em português. Uma página com apresentação, GitHub, setup e redes sociais.

## Executar

Requer Node.js. Não é necessário instalar dependências ou fazer build.

```sh
node preview.mjs
```

Abra http://127.0.0.1:4173. Para publicar em qualquer hospedagem estática, envie o conteúdo de `dist/`.

## Editar

- Conteúdo e links: `dist/index.html`.
- Layout, cores e tipografia: `dist/styles.css`.
- Fonte e favicon: `dist/assets/`.

Página com fundo preto, etiquetas de Skills e Tools e barra de ícones fixa no rodapé. A barra abre início, GitHub, Twitch, X, YouTube e setup; o último botão alterna tema claro/escuro e salva a preferência localmente. JavaScript nativo apenas para o tema, sem dependências.

Hover apenas sublinha os links de conteúdo ou mostra o nome dos ícones na barra; não altera posição ou escala. A entrada usa um fade curto, desativado para quem prefere movimento reduzido. A barra cabe em telas de 320 px e respeita a área segura inferior do celular.

Teclado informado como Attack Shark X68, sem afirmar a versão HE ou Pro.

Referência de composição: https://ayushgopal17.github.io/. Conteúdo e implementação próprios.
Fonte Geist: https://github.com/google/fonts, licença SIL Open Font License 1.1 em `dist/assets/OFL-geist.txt`.
