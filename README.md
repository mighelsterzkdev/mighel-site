# Mighel Sterzk

Site pessoal estático, em português. Uma página com apresentação, projetos, GitHub, setup e redes sociais. Linguagens informadas: Lua e Python.

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

Página com fundo preto, About, etiquetas de Skills e Tools e barra de ícones fixa no rodapé. A barra abre início, GitHub, X e YouTube, copia o e-mail, alterna o tema e controla a música. A preferência de tema é salva localmente. JavaScript nativo, sem dependências.

## Intro e contato

- Play intro inicia a música e percorre a página suavemente em 36 segundos. O áudio continua depois do percurso e pode ser pausado pela barra.
- Pause intro ou o botão de música pausa a reprodução. Scroll manual, toque ou navegação pelo teclado interrompem o percurso. Escape pausa a música. Ao sair da aba, a reprodução para.
- A rolagem guiada acontece somente após clicar Play intro. Para ouvir sem rolagem, use a nota musical. Efeitos passivos continuam respeitando movimento reduzido.
- E-mail no topo e na barra: `sterzkmighel@gmail.com`. A confirmação aparece somente após a cópia ter sucesso.
- Áudio só carrega após interação. Não há autoplay na abertura do site.

Música: Gymnopédie nº 1, de Erik Satie; gravação de Teknopazzo sob CC0. Fonte, licença e URL do arquivo em `dist/assets/MUSIC-LICENSE.txt`. O arquivo está incluído localmente, sem player externo.

Hover apenas sublinha os links de conteúdo ou mostra o nome dos ícones na barra; não altera posição ou escala. A entrada usa um fade curto, desativado para quem prefere movimento reduzido. A barra cabe em telas de 320 px e respeita a área segura inferior do celular.

Teclado informado como Attack Shark X68, sem afirmar a versão HE ou Pro.

## Projeto e Discord

Phantom Menu é apresentado como um menu para FiveM desenvolvido em Lua, conforme informado por Mighel. O vídeo fornecido é incorporado pelo player oficial do YouTube, sem autoplay, com carregamento tardio e modo de privacidade aprimorada. Ao entrar no player ou tirar o foco da página, a música e o percurso da intro param. O botão YouTube permite abrir o vídeo diretamente caso a incorporação esteja indisponível. Website aponta para https://tdhgaming.com.br/.

O convite https://discord.gg/2SbAythsx5 aparece em Redes. Skills e About usam Lua e Python, conforme informado por Mighel. O Phantom Menu mantém a tecnologia Lua.

## GitHub activity

Calendário com os tons de verde do GitHub nos quadradinhos e na legenda, baseado nos dados visíveis de `mighelsterzkdev`. A página consulta https://github-contributions-api.jogruber.de/v4/mighelsterzkdev?y=last, um serviço que lê o perfil público do GitHub e mantém cache de uma hora. Não utiliza token ou acesso ao código dos repositórios. Os totais incluem contribuições privadas somente se o proprietário habilitar GitHub → perfil → Contribution settings → Private contributions. A alteração revela quantidades diárias, mantendo os detalhes dos repositórios privados ocultos.

A contagem é identificada como contribuições visíveis, pois depende da visibilidade do perfil público, e pode diferir do total exibido ao proprietário autenticado. A data exibida indica quando a consulta foi feita. Se o serviço estiver indisponível, permanece a cópia local com sua data original. Para atualizar essa cópia antes de uma publicação:

```sh
node src/update-github-activity.mjs
```

O gráfico possui descrições por dia ao passar o mouse, suporte a tema claro e escrolagem horizontal pelo teclado no celular. Créditos e licença da música permanecem apenas nos arquivos, sem texto no rodapé da página.

Referência de composição: https://ayushgopal17.github.io/. Conteúdo e implementação próprios.
Fonte Geist: https://github.com/google/fonts, licença SIL Open Font License 1.1 em `dist/assets/OFL-geist.txt`.
