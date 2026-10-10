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
