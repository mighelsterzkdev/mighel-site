import { animate, stagger } from 'motion';

// DOM adaptation of Arc's free button, copy feedback and shared tab patterns.
// The same Motion engine handles springs, without adding a React runtime.
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
const snappy = { type: 'spring', visualDuration: .26, bounce: .12 };
const morph = { type: 'spring', visualDuration: .42, bounce: .16 };
const smooth = { type: 'spring', visualDuration: .4, bounce: 0 };
const enter = [.16, 1, .3, 1];
const controls = new WeakMap();
const copyStates = new WeakMap();

function move(element, values, options = morph) {
  controls.get(element)?.stop();
  const control = animate(element, values, reduced.matches ? { duration: 0 } : options);
  controls.set(element, control);
  return control;
}

function moveHighlight(highlight, target, { inset = 0, first = false } = {}) {
  const values = { x: target.offsetLeft + inset, y: target.offsetTop + inset, width: target.offsetWidth - inset * 2, height: target.offsetHeight - inset * 2 };
  if (first) animate(highlight, values, { duration: 0 });
  move(highlight, { ...values, opacity: 1 }, { ...morph, opacity: { duration: .16 } });
}

function attachHighlight(root, selector, highlight, inset = 0) {
  let previous;
  const show = target => { moveHighlight(highlight, target, { inset, first: !previous }); previous = target; };
  root.querySelectorAll(selector).forEach(target => {
    target.addEventListener('pointerenter', () => { if (finePointer.matches) show(target); });
    target.addEventListener('focus', () => { if (target.matches(':focus-visible')) show(target); });
  });
  const hide = () => {
    if (root.contains(document.activeElement) && document.activeElement.matches(':focus-visible')) return;
    move(highlight, { opacity: 0 }, { duration: .18 }); previous = undefined;
  };
  root.addEventListener('pointerleave', hide);
  root.addEventListener('focusout', event => { if (!root.contains(event.relatedTarget)) hide(); });
  new ResizeObserver(() => { if (previous) show(previous); }).observe(root);
}

let navStarted = false;
function moveNav(link) {
  const highlight = document.querySelector('.nav-indicator');
  if (!link) { move(highlight, { opacity: 0 }, { duration: .16 }); return; }
  moveHighlight(highlight, link, { first: !navStarted });
  navStarted = true;
}

let tabStarted = false;
function selectTab(tab, code, direction, initial) {
  const highlight = document.querySelector('.tab-indicator');
  moveHighlight(highlight, tab, { first: !tabStarted });
  tabStarted = true;
  if (initial) return;
  animate(code, reduced.matches ? { opacity: [0, 1] } : { opacity: [0, 1], x: [direction * 10, 0], filter: ['blur(3px)', 'blur(0px)'] }, { duration: reduced.matches ? .1 : .34, ease: enter });
}

function morphLabel(button, text) {
  const label = button.querySelector('.copy-label');
  if (!label || label.textContent === text) return;
  let slot = label.parentElement;
  if (!slot.classList.contains('copy-label-slot')) {
    slot = document.createElement('span'); slot.className = 'copy-label-slot';
    label.replaceWith(slot); slot.append(label);
  }
  slot.querySelectorAll('.copy-outgoing').forEach(node => node.remove());
  const width = slot.getBoundingClientRect().width;
  const old = label.cloneNode(true);
  old.className = 'copy-label copy-outgoing'; old.setAttribute('aria-hidden', 'true');
  old.style.width = width + 'px'; slot.style.width = width + 'px'; slot.append(old);
  label.textContent = text;
  const nextWidth = label.getBoundingClientRect().width;
  move(slot, { width: nextWidth }, morph);
  animate(old, reduced.matches ? { opacity: [1, 0] } : { opacity: [1, 0], y: [0, -3], filter: ['blur(0px)', 'blur(4px)'] }, { duration: .16, onComplete: () => old.remove() });
  animate(label, reduced.matches ? { opacity: [0, 1] } : { opacity: [0, 1], y: [4, 0], filter: ['blur(4px)', 'blur(0px)'] }, { duration: .24, ease: enter });
}

function copyFeedback(button, success) {
  let state = copyStates.get(button);
  if (!state) {
    state = { icon: button.querySelector('svg').innerHTML, label: button.querySelector('.copy-label')?.textContent, aria: button.getAttribute('aria-label') };
    copyStates.set(button, state);
  }
  clearTimeout(state.timer);
  const svg = button.querySelector('svg');
  svg.innerHTML = success ? '<path d="m5 12 4 4L19 6" pathLength="1"/>' : '<path d="m6 6 12 12M6 18 18 6"/>';
  if (state.label) morphLabel(button, success ? 'Copiado' : 'Falhou ao copiar');
  button.setAttribute('aria-label', success ? 'Copiado' : 'Falhou ao copiar');
  move(svg, reduced.matches ? { opacity: [0, 1] } : { opacity: [0, 1], scale: [.6, 1] }, snappy);
  if (success && !reduced.matches) animate(svg.querySelector('path'), { strokeDasharray: '1', strokeDashoffset: [1, 0] }, { duration: .35, ease: enter });
  state.timer = setTimeout(() => {
    svg.innerHTML = state.icon;
    if (state.label) morphLabel(button, state.label);
    if (state.aria) button.setAttribute('aria-label', state.aria); else button.removeAttribute('aria-label');
    move(svg, reduced.matches ? { opacity: [0, 1] } : { opacity: [0, 1], scale: [.7, 1] }, snappy);
  }, 2200);
}

function enterDialog(dialog) {
  move(dialog, reduced.matches ? { opacity: [0, 1] } : { opacity: [0, 1], y: [20, 0], scale: [.975, 1] }, { ...smooth, opacity: { duration: .2 } });
}
const closingDialogs = new WeakSet();
async function closeDialog(dialog) {
  if (!dialog.open || closingDialogs.has(dialog)) return;
  closingDialogs.add(dialog);
  await move(dialog, reduced.matches ? { opacity: 0 } : { opacity: 0, y: 12, scale: .985 }, { duration: reduced.matches ? 0 : .16, ease: [.7, 0, .84, 0] });
  dialog.close(); closingDialogs.delete(dialog);
}

window.SiteMotion = { moveNav, selectTab, copyFeedback, enterDialog, closeDialog };
document.documentElement.classList.add('motion-ready');
document.addEventListener('DOMContentLoaded', () => {
  const social = document.querySelector('.social-list');
  attachHighlight(social, '.social-row', social.querySelector('.social-highlight'), 5);
  const index = document.querySelector('.hero-index');
  attachHighlight(index, ':scope > a', index.querySelector('.index-highlight'), -8);
  new ResizeObserver(() => {
    const tab = document.querySelector('.code-tabs [aria-selected="true"]');
    if (tab) selectTab(tab, document.querySelector('#profile-code'), 1, true);
  }).observe(document.querySelector('.code-tabs'));
  document.querySelectorAll('.nav a').forEach(link => link.addEventListener('focus', () => moveNav(link)));

  document.querySelectorAll('.button,.icon-button,.copy-handle,.project-copy,.code-tabs button,.command-trigger,.command-close').forEach(button => {
    if (button.hasAttribute('aria-haspopup')) return;
    const press = () => {
      if (reduced.matches || button.getAttribute('aria-disabled') === 'true') return;
      const width = button.offsetWidth;
      move(button, { scale: width > 220 ? .985 : width <= 48 ? .96 : .97 }, { duration: .12, ease: [.22, 1, .36, 1] });
    };
    const release = () => { if (!reduced.matches) move(button, { scale: 1 }, snappy); };
    button.addEventListener('pointerdown', press);
    button.addEventListener('pointerup', release);
    button.addEventListener('pointercancel', release);
    button.addEventListener('pointerleave', release);
    button.addEventListener('blur', release);
    button.addEventListener('keydown', event => { if (event.key === 'Enter' || event.key === ' ') press(); });
    button.addEventListener('keyup', release);
  });

  if (!reduced.matches) {
    animate('.name-word', { opacity: [0, 1], y: [22, 0], filter: ['blur(8px)', 'blur(0px)'] }, { duration: .85, delay: stagger(.1), ease: enter });
    animate('.hero-index', { opacity: [0, 1], y: [24, 0] }, { duration: .7, delay: .15, ease: enter });
    const reveal = new IntersectionObserver(entries => entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      animate(entry.target, { opacity: [0, 1], y: [26, 0] }, { duration: .65, delay: Number(entry.target.dataset.motionDelay || 0), ease: enter });
      reveal.unobserve(entry.target);
    }), { threshold: .12 });
    document.querySelectorAll('.reveal').forEach(node => reveal.observe(node));
    document.querySelectorAll('.gear-card').forEach((card, index) => card.dataset.motionDelay = String(index * .08));
  }
});
