# Mighel Sterzk — site pessoal

Site estático em português com sobre mim, projetos, setup e redes. HTML, CSS e JavaScript, sem dependências de execução ou etapa de build.

## Visual e conteúdo

Segunda versão: tipografia Geist e Inter, texto de 16–20 px, navegação fixa, hierarquia de títulos ampla, superfícies neutras, temas claro e escuro. Inspiração: https://uiarc.dev/.

O perfil alterna entre Lua e Python e permite copiar o código. Os equipamentos abrem em um diálogo acessível com imagem e link do fabricante. Redes: GitHub mighelsterzkdev, Twitch sterzk, X MighelSterzk e YouTube @MighelSterzk.

O GitHub não tinha repositórios públicos na consulta de 10/10/2026. O projeto exibido é este próprio site. O teclado foi identificado como Attack Shark X68, sem afirmar HE/Pro; a imagem de referência é da linha HE. As fotos são imagens de referência dos fabricantes, não fotos do setup do Mighel.

## Rodar

Sirva a pasta dist com qualquer servidor HTTP. Exemplo: python -m http.server 8080 --directory dist

## Editar

- dist/index.html: apresentação, projetos, equipamento e links.
- dist/styles.css: temas, tipografia e layout responsivo.
- dist/app.js: abas, cópia, tema, navegação e diálogos. O objeto equipment guarda os detalhes dos periféricos.
- dist/assets/: fontes locais, licenças, fotos e prévia real do site.

## Créditos

Geist e Inter: https://github.com/google/fonts — SIL Open Font License 1.1, incluída em assets.

Fotos de referência:
- Mouse: https://www.logitechg.com/en-us/shop/p/pro-x3-superstrike-mouse
- Teclado: https://attackshark.com/products/attack-shark-x68-he-rapid-trigger-keyboard-magnetic-switch
- Headset: https://www.mchose.store/products/mchose-v9-series-wireless-gaming-headset

A prévia do site foi capturada da própria página. O site não usa componentes pagos do Arc.
