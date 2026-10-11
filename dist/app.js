const root = document.documentElement;
const themeButton = document.querySelector('.theme-toggle');
function syncTheme() {
  const light = root.dataset.theme === 'light';
  const label = light ? 'Ativar tema escuro' : 'Ativar tema claro';
  themeButton.textContent = light ? 'Escuro' : 'Claro';
  themeButton.setAttribute('aria-label', label);
  themeButton.dataset.label = label;
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
  musicToggle.dataset.label = label;
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
