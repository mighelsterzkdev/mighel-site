# Mighel Sterzk — site pessoal

Site estático em português com sobre mim, projetos, setup e redes. HTML, CSS e JavaScript, sem dependências de execução ou etapa de build.

## Visual e conteúdo

Terceira versão: branco, grafite e verde, tipografia Geist e Inter, textos de 16–20 px e títulos amplos. A abertura combina o nome com um painel de navegação. Os temas claro e escuro compartilham a mesma identidade, sem degradês decorativos.

O perfil alterna entre Lua e Python e permite copiar o código. O projeto é um cartão expansível com detalhes e cópia do link, sem captura de tela. O menu de atalhos abre pelo botão ou Ctrl/Cmd+K, filtra seções e redes, aceita setas, Enter e Escape. Os equipamentos abrem em um diálogo com imagem e link do fabricante. Redes: GitHub mighelsterzkdev, Twitch sterzk, X MighelSterzk e YouTube @MighelSterzk.

O GitHub não tinha repositórios públicos na consulta de 10/10/2026. O projeto exibido é este próprio site. O teclado foi identificado como Attack Shark X68, sem afirmar HE/Pro; a imagem de referência é da linha HE. As fotos são imagens de referência dos fabricantes, não fotos do setup do Mighel.

## Rodar

Sirva a pasta dist com qualquer servidor HTTP. Exemplo: python -m http.server 8080 --directory dist

## Editar

- dist/index.html: apresentação, projetos, equipamento e links.
- dist/styles.css: tipografia, componentes compartilhados e regras responsivas.
- dist/identity.css: paleta, abertura, cartão expansível, menu de atalhos e adaptações responsivas.
- dist/app.js: abas, cópia, tema, navegação, expansão e diálogos. O objeto equipment guarda os detalhes dos periféricos.
- dist/assets/: fontes locais, licenças e fotos dos fabricantes.

## Créditos

Geist e Inter: https://github.com/google/fonts — SIL Open Font License 1.1, incluída em assets.

Fotos de referência:
- Mouse: https://www.logitechg.com/en-us/shop/p/pro-x3-superstrike-mouse
- Teclado: https://attackshark.com/products/attack-shark-x68-he-rapid-trigger-keyboard-magnetic-switch
- Headset: https://www.mchose.store/products/mchose-v9-series-wireless-gaming-headset

Referências de interação: https://uiarc.dev/components/expandable-card e https://uiarc.dev/components/blocks/command-palette. Implementação própria em HTML/CSS/JavaScript, inspirada nos padrões gratuitos da biblioteca, sem copiar sua página inicial ou usar componentes pagos.
