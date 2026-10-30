const root = document.documentElement;
const themeButton = document.querySelector('.theme-toggle');
function syncTheme() {
  const light = root.dataset.theme === 'light';
  const label = light ? 'Ativar tema escuro' : 'Ativar tema claro';
  themeButton.setAttribute('aria-label', label);
  themeButton.title = label;
  document.querySelector('meta[name="theme-color"]').content = light ? '#fafafa' : '#050505';
}

themeButton.addEventListener('click', () => {
  root.dataset.theme = root.dataset.theme === 'light' ? 'dark' : 'light';
  try { localStorage.setItem('mighel-theme-v6', root.dataset.theme); } catch {}
  syncTheme();
});
syncTheme();

const status = document.querySelector('.toast');
let statusTimer;
function notify(message) {
  clearTimeout(statusTimer);
  status.textContent = message;
  status.classList.add('visible');
  statusTimer = setTimeout(() => status.classList.remove('visible'), 3500);
}

const music = document.querySelector('#site-music');
const musicToggle = document.querySelector('.music-toggle');
music.volume = .3;
let pendingPlay = false;
let playRequest = 0;

function syncPlayback() {
  const playing = !music.paused && !music.ended;
  const label = playing ? 'Pausar música' : 'Tocar música';
  musicToggle.setAttribute('aria-pressed', String(playing));
  musicToggle.setAttribute('aria-label', label);
  musicToggle.title = label;
}

function stopMusic() {
  playRequest++;
  pendingPlay = false;
  musicToggle.removeAttribute('aria-busy');
  music.pause();
  syncPlayback();
}

async function playMusic() {
  const request = ++playRequest;
  pendingPlay = true;
  musicToggle.setAttribute('aria-busy', 'true');
  try {
    await music.play();
  } catch {
    if (request === playRequest) notify('Não foi possível tocar a música. Tente novamente.');
  } finally {
    if (request === playRequest) {
      pendingPlay = false;
      musicToggle.removeAttribute('aria-busy');
      syncPlayback();
    }
  }
}

musicToggle.addEventListener('click', () => {
  if (!music.paused || pendingPlay) stopMusic();
  else playMusic();
});
music.addEventListener('play', syncPlayback);
music.addEventListener('pause', syncPlayback);
music.addEventListener('ended', syncPlayback);
music.addEventListener('error', () => {
  stopMusic();
  notify('Não foi possível carregar a música. Tente novamente.');
});
window.addEventListener('keydown', event => { if (event.key === 'Escape') stopMusic(); });
document.addEventListener('visibilitychange', () => { if (document.hidden) stopMusic(); });
window.addEventListener('blur', stopMusic);
window.addEventListener('pagehide', stopMusic);
syncPlayback();

const navigation = [...document.querySelectorAll('.section-links a')].map(link => ({
  link, section: document.querySelector(link.getAttribute('href'))
}));
const header = document.querySelector('.site-header');
// A section near the end of the page cannot scroll up to the header, so a
// clicked link stays highlighted until the visitor scrolls on their own.
let chosen = null;
for (const item of navigation) item.link.addEventListener('click', () => { chosen = item; scheduleNavigation(); });
const clearChosen = () => { chosen = null; };
for (const type of ['wheel', 'touchstart', 'keydown']) window.addEventListener(type, clearChosen, { passive: true });
function syncNavigation() {
  header.dataset.scrolled = String(window.scrollY > 12);
  let current = null;
  const readingLine = (parseFloat(getComputedStyle(root).scrollPaddingTop) || 0) + 8;
  for (const item of navigation) {
    if (item.section.getBoundingClientRect().top <= readingLine) current = item;
  }
  if (window.scrollY > 0 && window.innerHeight + window.scrollY >= root.scrollHeight - 2) current = navigation.at(-1);
  if (chosen) current = chosen;
  for (const item of navigation) {
    if (item === current) item.link.setAttribute('aria-current', 'location');
    else item.link.removeAttribute('aria-current');
  }
}
let navigationFrame;
function scheduleNavigation() {
  if (navigationFrame) return;
  navigationFrame = requestAnimationFrame(() => {
    navigationFrame = 0;
    syncNavigation();
  });
}
for (const video of document.querySelectorAll('.project-video[data-video-id]')) {
  video.querySelector('.video-play').addEventListener('click', () => {
    stopMusic();
    const frame = document.createElement('iframe');
    frame.src = `https://www.youtube-nocookie.com/embed/${video.dataset.videoId}?autoplay=1&rel=0`;
    frame.title = 'Demonstração do Phantom Menu';
    frame.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
    frame.allowFullscreen = true;
    frame.referrerPolicy = 'strict-origin-when-cross-origin';
    video.replaceChildren(frame);
    frame.focus();
  }, { once: true });
}

window.addEventListener('scroll', scheduleNavigation, { passive: true });
window.addEventListener('resize', scheduleNavigation);
window.addEventListener('pageshow', scheduleNavigation);
new ResizeObserver(scheduleNavigation).observe(document.querySelector('main'));
syncNavigation();
