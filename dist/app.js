const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const themeButton = $('.theme-button');
function syncTheme() {
  const dark = document.documentElement.dataset.theme === 'dark';
  themeButton.setAttribute('aria-label', dark ? 'Ativar tema claro' : 'Ativar tema escuro');
  $('use', themeButton).setAttribute('href', dark ? '#sun' : '#moon');
  $('meta[name="theme-color"]').content = dark ? '#151516' : '#fcfcfb';
}
syncTheme();
themeButton.addEventListener('click', () => {
  const theme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = theme;
  try { localStorage.setItem('mighel-theme-v2', theme); } catch {}
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
let activeLanguage = 'lua';
const codeTabs = $$('.code-tabs [role="tab"]');
function selectCode(tab, focus = false) {
  activeLanguage = tab.dataset.language;
  codeTabs.forEach(item => { const selected = item === tab; item.setAttribute('aria-selected', String(selected)); item.tabIndex = selected ? 0 : -1; });
  const sample = profile[activeLanguage];
  const code = $('#profile-code');
  code.innerHTML = sample.html;
  code.style.animation = 'none';
  void code.offsetWidth;
  code.style.animation = '';
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
  try {
    await navigator.clipboard.writeText(value);
    const use = $('use', button); const old = use.getAttribute('href');
    use.setAttribute('href', '#check');
    toast(success);
    setTimeout(() => use.setAttribute('href', old), 2200);
  } catch { toast('Não foi possível copiar. Selecione o texto para copiar manualmente.'); }
}
$('.copy-handle').addEventListener('click', event => copyText('@MighelSterzk', event.currentTarget, '@MighelSterzk copiado.'));
$('.code-copy').addEventListener('click', event => copyText(profile[activeLanguage].raw, event.currentTarget, 'Código copiado.'));

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
}));
$('.dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => {
  const bounds = dialog.getBoundingClientRect();
  if (event.target === dialog && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)) dialog.close();
});
dialog.addEventListener('close', () => gearTrigger?.focus());
$('#year').textContent = new Date().getFullYear();

const indicator = $('.nav-indicator');
function moveIndicator(link) {
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
    if (entry.isIntersecting) {
      $$('.nav a').forEach(link => {
        if (link.getAttribute('href') === '#' + entry.target.id) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
      moveIndicator($('.nav a[aria-current]'));
    }
  }), { rootMargin: '-15% 0px -60% 0px' });
  $$('main section[id]').forEach(section => sectionObserver.observe(section));
}

