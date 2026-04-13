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

// Mobile: hamburger open/close
hamburgerBtn.addEventListener('click', () => {
  const isOpen = document.body.classList.toggle('sidebar-open');
  hamburgerBtn.setAttribute('aria-expanded', String(isOpen));
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
