const root = document.documentElement;
const themeButton = document.querySelector('.theme-toggle');
function syncTheme() {
  const light = root.dataset.theme === 'light';
  themeButton.setAttribute('aria-label', light ? 'Ativar tema escuro' : 'Ativar tema claro');
  themeButton.dataset.label = light ? 'Tema escuro' : 'Tema claro';
  document.querySelector('meta[name="theme-color"]').content = light ? '#ffffff' : '#000000';
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

const email = 'sterzkmighel@gmail.com';
const copyStates = new WeakMap();
document.querySelectorAll('[data-copy-email]').forEach(button => {
  const icon = button.querySelector('svg');
  const original = icon.innerHTML;
  button.addEventListener('click', async () => {
    if (button.getAttribute('aria-busy') === 'true') return;
    button.setAttribute('aria-busy', 'true');
    try {
      await navigator.clipboard.writeText(email);
      clearTimeout(copyStates.get(button));
      icon.innerHTML = '<path d="m5 12 4 4L19 6"/>';
      notify('E-mail copiado.');
      copyStates.set(button, setTimeout(() => { icon.innerHTML = original; }, 2200));
    } catch {
      notify('Não foi possível copiar. E-mail: ' + email);
    } finally { button.removeAttribute('aria-busy'); }
  });
});

const music = document.querySelector('#site-music');
const musicToggle = document.querySelector('.music-toggle');
const introToggle = document.querySelector('.intro-toggle');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
music.volume = .3;
let introActive = false;
let pendingIntro = false;
let playRequest = 0;
let introFrame;

function syncPlayback() {
  const playing = !music.paused && !music.ended;
  const label = playing ? (introActive ? 'Pausar intro' : 'Pausar música') : 'Tocar música';
  musicToggle.setAttribute('aria-pressed', String(playing));
  musicToggle.setAttribute('aria-label', label);
  musicToggle.dataset.label = label;
  introToggle.setAttribute('aria-pressed', String(introActive));
  introToggle.querySelector('span').textContent = introActive ? 'Pause intro' : 'Play intro';
}

function stopIntro() {
  cancelAnimationFrame(introFrame);
  introActive = false;
  pendingIntro = false;
  introToggle.removeAttribute('aria-busy');
  syncPlayback();
}

function stopMusic() {
  playRequest++;
  pendingIntro = false;
  introToggle.removeAttribute('aria-busy');
  music.pause();
  stopIntro();
}

function startIntro() {
  stopIntro();
  introActive = true;
  syncPlayback();
  // This guided movement is explicitly requested by Play intro; passive effects
  // still respect reduced motion. Manual navigation or pause cancels it at once.
  const origin = window.scrollY;
  const started = performance.now();
  const duration = 36000;
  const tick = now => {
    if (!introActive || music.paused) return;
    const progress = Math.min(1, (now - started) / duration);
    const eased = progress * progress * (3 - 2 * progress);
    const bottom = Math.max(origin, document.documentElement.scrollHeight - innerHeight);
    window.scrollTo({ top: origin + (bottom - origin) * eased, behavior: 'instant' });
    if (progress < 1) introFrame = requestAnimationFrame(tick);
    else stopIntro();
  };
  introFrame = requestAnimationFrame(tick);
}

async function playMusic(withIntro) {
  stopIntro();
  const request = ++playRequest;
  pendingIntro = withIntro;
  if (withIntro) introToggle.setAttribute('aria-busy', 'true');
  try {
    await music.play();
    if (request !== playRequest) return;
    if (withIntro && pendingIntro) startIntro();
  } catch {
    if (request === playRequest) notify('Não foi possível tocar a música. Tente novamente.');
  } finally {
    if (request === playRequest) {
      pendingIntro = false;
      introToggle.removeAttribute('aria-busy');
      syncPlayback();
    }
  }
}

introToggle.addEventListener('click', () => {
  if (introActive || pendingIntro) stopMusic();
  else playMusic(true);
});
musicToggle.addEventListener('click', () => {
  if (!music.paused || pendingIntro) stopMusic();
  else playMusic(false);
});
music.addEventListener('play', syncPlayback);
music.addEventListener('pause', stopIntro);
music.addEventListener('ended', stopIntro);
music.addEventListener('error', () => {
  stopMusic();
  notify('Não foi possível carregar a música. Tente novamente.');
});

// Manual navigation takes over scrolling; the music remains controllable in the dock.
window.addEventListener('wheel', stopIntro, { passive: true });
window.addEventListener('touchmove', stopIntro, { passive: true });
window.addEventListener('pointerdown', event => {
  if (!event.target.closest('.intro-toggle,.music-toggle')) stopIntro();
}, { passive: true });
window.addEventListener('keydown', event => {
  if (event.key === 'Escape') { stopMusic(); return; }
  if (event.key === ' ' && event.target.closest('.intro-toggle,.music-toggle')) return;
  if (['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' ', 'Tab'].includes(event.key)) stopIntro();
});
reducedMotion.addEventListener('change', stopIntro);
document.addEventListener('visibilitychange', () => { if (document.hidden) stopMusic(); });
window.addEventListener('pagehide', stopMusic);
syncPlayback();
