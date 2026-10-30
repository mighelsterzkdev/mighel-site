const root = document.documentElement;
const english = () => root.lang === 'en';

// English text by key; Portuguese stays in the HTML and is read once at start.
const translations = {
  skip: 'Skip to content',
  role: 'Developer',
  about: 'About',
  intro1: 'I build Windows apps and FiveM scripts in <em>Python</em> and <em>Lua</em>. I care about the interface and the small details that make a program easy to use.',
  intro2: 'Right now I maintain <a href="#media-toolkit-title">Media Toolkit</a>, <a href="#clearspace-title">Clearspace</a> and <a href="#phantom-title">Phantom Menu</a>. All the apps’ code is on <a href="https://github.com/mighelsterzkdev" target="_blank" rel="noopener noreferrer">GitHub</a>.',
  projects: 'Projects',
  mediaToolkit: 'Downloads videos, audio and images from links and converts files between formats. Shows every image on a page and updates itself.',
  clearspace: 'Cleans temporary files and caches with a preview before deleting, and keeps the PC in shape: updates programs, tests the connection and repairs Windows.',
  phantom: 'FiveM menu with its own interface, configurable shortcuts and 3D previews of players and vehicles. Saves settings, outfits and locations.',
  download: 'Download',
  code: 'Code',
  projectSite: 'Project site',
  watchDemo: 'Watch the Phantom Menu demo',
  activity: 'Activity',
  calendar: 'GitHub contribution calendar. Scroll sideways to see every month.',
  legend: 'Contribution intensity, from less to more',
  less: 'Less',
  more: 'More',
  contact: 'Contact',
  joinServer: 'Join the server',
  themeLight: 'Light theme',
  themeDark: 'Dark theme',
};
const portuguese = { themeLight: 'Tema claro', themeDark: 'Tema escuro' };
for (const element of document.querySelectorAll('[data-i18n]')) portuguese[element.dataset.i18n] ??= element.textContent;
for (const element of document.querySelectorAll('[data-i18n-html]')) portuguese[element.dataset.i18nHtml] = element.innerHTML;
for (const element of document.querySelectorAll('[data-i18n-label]')) portuguese[element.dataset.i18nLabel] = element.getAttribute('aria-label');
const text = key => (english() ? translations : portuguese)[key];

const themeButton = document.querySelector('.theme-toggle');
const languageButton = document.querySelector('.language-toggle');

function applyLanguage() {
  for (const element of document.querySelectorAll('[data-i18n]')) element.textContent = text(element.dataset.i18n);
  for (const element of document.querySelectorAll('[data-i18n-html]')) element.innerHTML = text(element.dataset.i18nHtml);
  for (const element of document.querySelectorAll('[data-i18n-label]')) element.setAttribute('aria-label', text(element.dataset.i18nLabel));
  // The button names the language it switches to, written in that language.
  languageButton.textContent = english() ? 'Português' : 'English';
  languageButton.lang = english() ? 'pt-BR' : 'en';
  syncTheme();
  showReleases();
  window.dispatchEvent(new Event('site-language'));
}

function syncTheme() {
  const light = root.dataset.theme === 'light';
  // The button names the theme it switches to.
  themeButton.textContent = text(light ? 'themeDark' : 'themeLight');
  document.querySelector('meta[name="theme-color"]').content = light ? '#ffffff' : '#000000';
}

themeButton.addEventListener('click', () => {
  root.dataset.theme = root.dataset.theme === 'light' ? 'dark' : 'light';
  try { localStorage.setItem('mighel-theme-v6', root.dataset.theme); } catch {}
  syncTheme();
});
languageButton.addEventListener('click', () => {
  root.lang = english() ? 'pt-BR' : 'en';
  try { localStorage.setItem('mighel-language', english() ? 'en' : 'pt'); } catch {}
  applyLanguage();
});

for (const video of document.querySelectorAll('.project-video[data-video-id]')) {
  video.querySelector('.video-play').addEventListener('click', () => {
    const frame = document.createElement('iframe');
    frame.src = `https://www.youtube-nocookie.com/embed/${video.dataset.videoId}?autoplay=1&rel=0`;
    frame.title = english() ? 'Phantom Menu demo' : 'Demonstração do Phantom Menu';
    frame.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
    frame.allowFullscreen = true;
    frame.referrerPolicy = 'strict-origin-when-cross-origin';
    video.replaceChildren(frame);
    frame.focus();
  }, { once: true });
}

// On narrow screens the calendar scrolls; start at the most recent weeks.
const activity = document.querySelector('.activity-scroll');
if (activity) new MutationObserver(() => { activity.scrollLeft = activity.scrollWidth; }).observe(activity, { childList: true });

// Latest version and date of each app, read from its GitHub releases. Nothing shows if GitHub is unreachable.
const releases = new Map();
function age(date) {
  const relative = new Intl.RelativeTimeFormat(english() ? 'en' : 'pt-BR', { numeric: 'auto' });
  const days = Math.round((Date.now() - date) / 86400000);
  if (days < 1) return english() ? 'today' : 'hoje';
  if (days < 30) return relative.format(-days, 'day');
  if (days < 365) return relative.format(-Math.round(days / 30), 'month');
  return relative.format(-Math.round(days / 365), 'year');
}
function showReleases() {
  for (const label of document.querySelectorAll('[data-release]')) {
    const release = releases.get(label.dataset.release);
    if (!release) continue;
    label.textContent = ` · ${release.version} · ${age(release.date)}`;
    label.title = `${english() ? 'Released on' : 'Versão publicada em'} ${new Date(release.date).toLocaleDateString(english() ? 'en' : 'pt-BR')}`;
  }
}
function remember(repository, data) {
  const version = /^v?\d+(\.\d+){1,3}$/.test(data.tag) ? data.tag.replace(/^v?/, 'v') : null;
  const date = Date.parse(data.date);
  if (!version || !Number.isFinite(date)) return;
  releases.set(repository, { version, date });
  showReleases();
}
for (const label of document.querySelectorAll('[data-release]')) {
  const repository = label.dataset.release;
  const cacheKey = `release:${repository}`;
  let cached = null;
  try { cached = JSON.parse(sessionStorage.getItem(cacheKey)); } catch {}
  if (cached) { remember(repository, cached); continue; }
  fetch(`https://api.github.com/repos/${repository}/releases/latest`, { headers: { Accept: 'application/vnd.github+json' } })
    .then(response => response.ok ? response.json() : Promise.reject())
    .then(data => {
      const release = { tag: String(data.tag_name || ''), date: String(data.published_at || '') };
      try { sessionStorage.setItem(cacheKey, JSON.stringify(release)); } catch {}
      remember(repository, release);
    })
    .catch(() => {});
}

applyLanguage();
