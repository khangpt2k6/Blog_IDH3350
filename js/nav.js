/**
 * nav.js — sidebar active-link highlighting + mobile hamburger toggle
 */

const tocLinks     = document.querySelectorAll('.toc-link');
const hamburgerBtn = document.getElementById('hamburger-btn');
const sidebar      = document.getElementById('sidebar');

function updateActiveLink(hash) {
  const target = hash || (window.location.hash.replace('#', '') || 'section-1');
  tocLinks.forEach(link => {
    const linkHash = link.getAttribute('href').replace('#', '');
    link.classList.toggle('active', linkHash === target);
  });
}

// Set active on load
updateActiveLink();

// Update on hash change
window.addEventListener('hashchange', () => updateActiveLink());

// Hamburger: collapse on desktop, slide-open on mobile
hamburgerBtn.addEventListener('click', () => {
  if (window.innerWidth > 768) {
    document.body.classList.toggle('sidebar-collapsed');
  } else {
    const isOpen = document.body.classList.toggle('sidebar-open');
    hamburgerBtn.setAttribute('aria-expanded', String(isOpen));
  }
});

// Mobile: close sidebar when a nav link is clicked
tocLinks.forEach(link => {
  link.addEventListener('click', () => {
    document.body.classList.remove('sidebar-open');
    hamburgerBtn.setAttribute('aria-expanded', 'false');
  });
});

// Mobile: close sidebar when overlay (body::after) is clicked
document.addEventListener('click', (e) => {
  if (
    document.body.classList.contains('sidebar-open') &&
    !sidebar.contains(e.target) &&
    e.target !== hamburgerBtn
  ) {
    document.body.classList.remove('sidebar-open');
    hamburgerBtn.setAttribute('aria-expanded', 'false');
  }
});

// ── Presentation clicker: left-click = next, right-click = prev ──────────
const INTERACTIVE = new Set(['A', 'BUTTON', 'INPUT', 'SELECT', 'TEXTAREA', 'LABEL', 'IFRAME']);

function isInteractive(el) {
  while (el && el !== document.body) {
    if (INTERACTIVE.has(el.tagName)) return true;
    el = el.parentElement;
  }
  return false;
}

function presenterNavigate(direction) {
  const SECTIONS = window._SECTIONS_LIST;
  if (!SECTIONS) return;
  const current = window.location.hash.replace('#', '') || 'abstract';
  const idx = SECTIONS.findIndex(s => s.hash === current);
  const next = SECTIONS[idx + direction];
  if (next) window.location.hash = '#' + next.hash;
}

document.addEventListener('click', (e) => {
  if (isInteractive(e.target)) return;
  if (document.body.classList.contains('sidebar-open')) return;
  presenterNavigate(1);
});

document.addEventListener('contextmenu', (e) => {
  if (isInteractive(e.target)) return;
  e.preventDefault();
  presenterNavigate(-1);
});
