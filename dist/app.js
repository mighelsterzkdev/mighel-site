const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const themeButton = $('.theme-button');
function syncTheme() {
  const dark = document.documentElement.dataset.theme === 'dark';
  themeButton.setAttribute('aria-label', dark ? 'Ativar tema claro' : 'Ativar tema escuro');
  $('use', themeButton).setAttribute('href', dark ? '#sun' : '#moon');
  $('meta[name="theme-color"]').content = dark ? '#141414' : '#f5f5f5';
}
syncTheme();
themeButton.addEventListener('click', () => {
  const theme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = theme;
  try { localStorage.setItem('mighel-theme-v4', theme); } catch {}
  syncTheme();
});
const menuButton = $('.menu-button');
const navigation = $('.nav');
function closeMenu() {
  navigation.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Abrir menu');
}
menuButton.addEventListener('click', () => {
  const open = navigation.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
});
$$('a', navigation).forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('click', event => {
  if (!navigation.contains(event.target) && !menuButton.contains(event.target)) closeMenu();
});
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });

const profile = {
  lua: {
    raw: 'local mighel = {\n  nome = "Mighel Sterzk",\n  linguagens = {\n    "Lua", "Python"\n  },\n  github = "mighelsterzkdev"\n}\nreturn mighel',
    html: '<span class="code-key">local</span> mighel = {\n  nome = <span class="code-string">"Mighel Sterzk"</span>,\n  linguagens = {\n    <span class="code-string">"Lua"</span>, <span class="code-string">"Python"</span>\n  },\n  github = <span class="code-string">"mighelsterzkdev"</span>\n}\n<span class="code-key">return</span> mighel',
    filename: 'sobre_mim.lua', label: 'Lua'
  },
  python: {
    raw: 'mighel = {\n  "nome": "Mighel Sterzk",\n  "linguagens": [\n    "Lua", "Python"\n  ],\n  "github": "mighelsterzkdev"\n}\nprint(mighel["nome"])',
    html: 'mighel = {\n  <span class="code-string">"nome"</span>: <span class="code-string">"Mighel Sterzk"</span>,\n  <span class="code-string">"linguagens"</span>: [\n    <span class="code-string">"Lua"</span>, <span class="code-string">"Python"</span>\n  ],\n  <span class="code-string">"github"</span>: <span class="code-string">"mighelsterzkdev"</span>\n}\n<span class="code-key">print</span>(mighel[<span class="code-string">"nome"</span>])',
    filename: 'sobre_mim.py', label: 'Python'
  }
};
let activeLanguage;
const codeTabs = $$('.code-tabs [role="tab"]');
function selectCode(tab, focus = false) {
  const previousLanguage = activeLanguage;
  const initial = !previousLanguage;
  if (previousLanguage === tab.dataset.language) { if (focus) tab.focus(); return; }
  activeLanguage = tab.dataset.language;
  codeTabs.forEach(item => { const selected = item === tab; item.setAttribute('aria-selected', String(selected)); item.tabIndex = selected ? 0 : -1; });
  const sample = profile[activeLanguage];
  const code = $('#profile-code');
  code.innerHTML = sample.html;
  if (window.SiteMotion) window.SiteMotion.selectTab(tab, code, activeLanguage === 'python' ? 1 : -1, initial);
  $('.editor-filename').textContent = sample.filename;
  $('#editor-language').textContent = sample.label;
  $('#code-panel').setAttribute('aria-labelledby', tab.id);
  if (focus) tab.focus();
}
codeTabs.forEach((tab, index) => {
  tab.addEventListener('click', () => selectCode(tab));
  tab.addEventListener('keydown', event => {
    let next;
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') next = codeTabs[(index + 1) % codeTabs.length];
    if (event.key === 'Home') next = codeTabs[0];
    if (event.key === 'End') next = codeTabs.at(-1);
    if (next) { event.preventDefault(); selectCode(next, true); }
  });
});
selectCode(codeTabs[0]);

let toastTimer;
function toast(message) {
  const element = $('.toast');
  element.textContent = message; element.classList.add('visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => element.classList.remove('visible'), 2800);
}
async function copyText(value, button, success) {
  if (button.getAttribute('aria-busy') === 'true') return;
  button.setAttribute('aria-busy', 'true');
  try {
    await navigator.clipboard.writeText(value);
    if (window.SiteMotion) window.SiteMotion.copyFeedback(button, true);
    toast(success);
  } catch {
    window.SiteMotion?.copyFeedback(button, false);
    toast('Não foi possível copiar. Selecione o texto para copiar manualmente.');
  } finally { button.removeAttribute('aria-busy'); }
}
$('.copy-handle').addEventListener('click', event => copyText('@MighelSterzk', event.currentTarget, '@MighelSterzk copiado.'));
$('.code-copy').addEventListener('click', event => copyText(profile[activeLanguage].raw, event.currentTarget, 'Código copiado.'));
$('.project-copy').addEventListener('click', event => copyText('https://mighel-sterzk.mysticsage3.chatgpt.site', event.currentTarget, 'Link do site copiado.'));

const projectToggle = $('.project-toggle');
const projectDetails = $('#project-details');
function setProjectOpen(open) {
  projectToggle.setAttribute('aria-expanded', String(open));
  $('.project').classList.toggle('is-open', open);
  projectDetails.inert = !open;
}
projectToggle.addEventListener('click', () => setProjectOpen(projectToggle.getAttribute('aria-expanded') !== 'true'));
$('.project').addEventListener('keydown', event => {
  if (event.key === 'Escape' && projectToggle.getAttribute('aria-expanded') === 'true') {
    setProjectOpen(false); projectToggle.focus();
  }
});

const commandDialog = $('.command-dialog');
const commandInput = $('#command-search');
const commandResults = $('#command-results');
const commands = [
  { label: 'Sobre mim', detail: 'Lua, Python e meu perfil', icon: 'code', href: '#sobre', keywords: 'linguagens programador' },
  { label: 'Projetos', detail: 'O que estou criando', icon: 'code', href: '#projetos', keywords: 'site trabalho' },
  { label: 'Meu setup', detail: 'Mouse, teclado e headset', icon: 'menu', href: '#setup', keywords: 'perifericos logitech attack shark mchose' },
  { label: 'Redes sociais', detail: 'Onde me encontrar', icon: 'up', href: '#redes', keywords: 'contato links' },
  { label: 'GitHub', detail: '@mighelsterzkdev', icon: 'github', href: 'https://github.com/mighelsterzkdev', keywords: 'repositorios codigo' },
  { label: 'Twitch', detail: '@sterzk', icon: 'twitch', href: 'https://www.twitch.tv/sterzk', keywords: 'stream live' },
  { label: 'X', detail: '@MighelSterzk', icon: 'x', href: 'https://x.com/MighelSterzk', keywords: 'twitter contato' },
  { label: 'YouTube', detail: '@MighelSterzk', icon: 'youtube', href: 'https://www.youtube.com/@MighelSterzk', keywords: 'videos' }
];
const normalize = value => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
let activeCommand = 0;
let commandTrigger;
function highlightCommand(index) {
  const options = $$('.command-option');
  if (!options.length) { commandInput.removeAttribute('aria-activedescendant'); return; }
  activeCommand = (index + options.length) % options.length;
  options.forEach((option, i) => option.setAttribute('aria-selected', String(i === activeCommand)));
  commandInput.setAttribute('aria-activedescendant', options[activeCommand].id);
  options[activeCommand].scrollIntoView({ block: 'nearest' });
}
function renderCommands() {
  const query = normalize(commandInput.value.trim());
  const matches = commands.filter(item => normalize(`${item.label} ${item.detail} ${item.keywords}`).includes(query));
  commandResults.replaceChildren();
  matches.forEach((item, index) => {
    const link = document.createElement('a');
    link.className = 'command-option'; link.id = `command-${index}`;
    link.href = item.href; link.tabIndex = -1; link.setAttribute('role', 'option');
    if (!item.href.startsWith('#')) { link.target = '_blank'; link.rel = 'noopener noreferrer'; }
    link.innerHTML = `<svg class="icon" aria-hidden="true"><use href="#${item.icon}"/></svg><span>${item.label}<small>${item.detail}</small></span><svg class="icon" aria-hidden="true"><use href="#${item.href.startsWith('#') ? 'arrow' : 'up'}"/></svg>`;
    link.addEventListener('pointermove', () => { if (activeCommand !== index) highlightCommand(index); });
    link.addEventListener('click', () => {
      commandDialog.close();
      if (item.href.startsWith('#')) requestAnimationFrame(() => {
        const heading = $(`${item.href} h2`);
        heading.tabIndex = -1; heading.focus({ preventScroll: true });
      });
    });
    commandResults.append(link);
  });
  $('.command-empty').hidden = matches.length > 0;
  highlightCommand(0);
}
function openCommands() {
  if (commandDialog.open || dialog.open) return;
  commandTrigger = document.activeElement;
  commandInput.value = '';
  renderCommands();
  closeMenu(); commandDialog.showModal(); window.SiteMotion?.enterDialog(commandDialog); commandInput.focus();
}
$('.command-trigger').addEventListener('click', openCommands);
$('.command-close').addEventListener('click', () => window.SiteMotion ? window.SiteMotion.closeDialog(commandDialog) : commandDialog.close());
commandInput.addEventListener('input', renderCommands);
commandInput.addEventListener('keydown', event => {
  if (['ArrowDown', 'ArrowUp', 'Home', 'End', 'Enter', 'Escape'].includes(event.key)) {
    event.preventDefault();
    if (event.key === 'ArrowDown') highlightCommand(activeCommand + 1);
    if (event.key === 'ArrowUp') highlightCommand(activeCommand - 1);
    if (event.key === 'Home') highlightCommand(0);
    if (event.key === 'End') highlightCommand($$('.command-option').length - 1);
    if (event.key === 'Enter') $$('.command-option')[activeCommand]?.click();
    if (event.key === 'Escape') {
      if (commandInput.value) { commandInput.value = ''; renderCommands(); }
      else if (window.SiteMotion) window.SiteMotion.closeDialog(commandDialog);
      else commandDialog.close();
    }
  }
});
document.addEventListener('keydown', event => {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
    event.preventDefault(); if (commandDialog.open) commandDialog.close(); else openCommands();
  }
});
commandDialog.addEventListener('close', () => commandTrigger?.focus());
commandDialog.addEventListener('click', event => {
  const bounds = commandDialog.getBoundingClientRect();
  if (event.target === commandDialog && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)) commandDialog.close();
});

const equipment = {
  mouse: { title: 'PRO X3 SUPERSTRIKE', category: 'Mouse · Logitech G', image: 'assets/mouse.png', alt: 'Logitech G PRO X3 SUPERSTRIKE preto', detail: 'Meu mouse, na cor preta.', url: 'https://www.logitechg.com/en-us/shop/p/pro-x3-superstrike-mouse' },
  keyboard: { title: 'X68', category: 'Teclado · Attack Shark', image: 'assets/keyboard.jpg', alt: 'Imagem de referência do Attack Shark X68 HE', detail: 'Meu teclado da linha X68. A imagem é da versão HE; a versão exata do meu teclado ainda será confirmada.', url: 'https://attackshark.com/products/attack-shark-x68-he-rapid-trigger-keyboard-magnetic-switch' },
  headset: { title: 'V9 Pro', category: 'Headset · MCHOSE', image: 'assets/headset.jpg', alt: 'Imagem de referência do MCHOSE V9 Pro', detail: 'Meu headset. Imagem de referência do fabricante.', url: 'https://www.mchose.store/products/mchose-v9-series-wireless-gaming-headset' }
};
const dialog = $('.gear-dialog');
let gearTrigger;
$$('[data-gear]').forEach(button => button.addEventListener('click', () => {
  const gear = equipment[button.dataset.gear];
  gearTrigger = button;
  $('#gear-dialog-title').textContent = gear.title;
  $('#gear-dialog-category').textContent = gear.category;
  $('#gear-dialog-detail').textContent = gear.detail;
  $('#gear-dialog-image').src = gear.image;
  $('#gear-dialog-image').alt = gear.alt;
  $('#gear-dialog-link').href = gear.url;
  dialog.showModal();
  window.SiteMotion?.enterDialog(dialog);
}));
const closeGearDialog = () => window.SiteMotion ? window.SiteMotion.closeDialog(dialog) : dialog.close();
$('.dialog-close').addEventListener('click', closeGearDialog);
dialog.addEventListener('cancel', event => { if (window.SiteMotion) { event.preventDefault(); closeGearDialog(); } });
dialog.addEventListener('click', event => {
  const bounds = dialog.getBoundingClientRect();
  if (event.target === dialog && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)) closeGearDialog();
});
dialog.addEventListener('close', () => gearTrigger?.focus());
$('#year').textContent = new Date().getFullYear();

const indicator = $('.nav-indicator');
let navigationLockedUntil = 0;
document.addEventListener('click', event => {
  const anchor = event.target.closest('a[href^="#"]');
  if (!anchor) return;
  const href = anchor.getAttribute('href');
  const selected = $$('.nav a').find(link => link.getAttribute('href') === href);
  if (!selected && href !== '#inicio') return;
  navigationLockedUntil = performance.now() + 1100;
  $$('.nav a').forEach(link => {
    if (link === selected) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
  moveIndicator(selected);
});
function moveIndicator(link) {
  if (window.SiteMotion) { window.SiteMotion.moveNav(link); return; }
  if (!link) { indicator.style.opacity = '0'; return; }
  indicator.style.left = link.offsetLeft + 'px';
  indicator.style.width = link.offsetWidth + 'px';
  indicator.style.opacity = '1';
}
$$('.nav a').forEach(link => link.addEventListener('pointerenter', () => moveIndicator(link)));
navigation.addEventListener('pointerleave', () => moveIndicator($('.nav a[aria-current]')));
window.addEventListener('resize', () => moveIndicator($('.nav a[aria-current]')));
if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('in-view'); revealObserver.unobserve(entry.target); }
  }), { threshold: .07 });
  $$('.about-copy, .code-editor, .section-heading, .project, .gear-card, .networks-copy, .social-list, .contact').forEach(element => { element.classList.add('reveal'); revealObserver.observe(element); });
  const sectionObserver = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting && performance.now() >= navigationLockedUntil) {
      $$('.nav a').forEach(link => {
        if (link.getAttribute('href') === '#' + entry.target.id) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
      moveIndicator($('.nav a[aria-current]'));
    }
  }), { rootMargin: '-15% 0px -60% 0px' });
  $$('main section[id]').forEach(section => sectionObserver.observe(section));
}

