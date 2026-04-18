/**
 * router.js — hash-based section router
 * Fetches HTML fragments from /sections/ and injects them into #section-container.
 * Works with local file:// protocol (Firefox) and any static server (Chrome).
 */

const SECTIONS = [
  { hash: 'abstract',   file: 'sections/s0-abstract.html',         title: 'Abstract' },
  { hash: 'section-1',  file: 'sections/s1-introduction.html',    title: '1. Introduction' },
  { hash: 'section-2',  file: 'sections/s2-background.html',       title: '2. Background' },
  { hash: 'section-3',  file: 'sections/s3-consumer-damage.html',  title: '3. Consumer Damage' },
  { hash: 'section-4',  file: 'sections/s4-psychology.html',       title: '4. Psychology of Choices' },
  { hash: 'section-5',  file: 'sections/s5-demographics.html',     title: '5. Demographics & Social Influence' },
  { hash: 'section-6',  file: 'sections/s6-data.html',             title: '6. Data & Statistics' },
  { hash: 'section-7',  file: 'sections/s7-paths-forward.html',    title: '7. Paths Forward' },
  { hash: 'section-8',  file: 'sections/s8-usf-perspective.html',  title: '8. USF Perspective' },
  { hash: 'section-9',  file: 'sections/s9-conclusion.html',       title: '9. Conclusion' },
  { hash: 'section-10', file: 'sections/s10-references.html',      title: '10. References' },
];

const container  = document.getElementById('section-container');
const sectionNav = document.getElementById('section-nav');
const cache      = {};   // fragment cache keyed by hash
let prevIndex    = -1;

function getHash() {
  const h = window.location.hash.replace('#', '');
  return h || 'abstract';
}

function getSectionIndex(hash) {
  return SECTIONS.findIndex(s => s.hash === hash);
}

async function fetchFragment(section) {
  if (cache[section.hash]) return cache[section.hash];
  try {
    const res = await fetch(section.file);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const html = await res.text();
    cache[section.hash] = html;
    return html;
  } catch (err) {
    return `<p style="color:#c0392b;font-size:14px;">
      Could not load <strong>${section.file}</strong>.<br>
      If opening from <code>file://</code>, use a local server:<br>
      <code>npx serve .</code> or VS Code Live Server.
    </p>`;
  }
}

function renderNavStrip(index) {
  const prev = SECTIONS[index - 1];
  const next = SECTIONS[index + 1];
  sectionNav.innerHTML = `
    <div class="section-nav-strip">
      ${prev
        ? `<a class="nav-btn" href="#${prev.hash}">&#8592; ${prev.title}</a>`
        : `<span class="nav-btn hidden"></span>`}
      <span class="nav-center">${index + 1} / ${SECTIONS.length}</span>
      ${next
        ? `<a class="nav-btn" href="#${next.hash}">${next.title} &#8594;</a>`
        : `<span class="nav-btn hidden"></span>`}
    </div>`;
}

function animateElements() {
  const heading = container.querySelector('.section-heading');
  if (heading) { heading.classList.add('el-left'); heading.style.animationDelay = '0ms'; }

  container.querySelectorAll('.body-text').forEach((el, i) => {
    el.classList.add('el-up');
    el.style.animationDelay = `${60 + i * 45}ms`;
  });

  container.querySelectorAll('.quote-block').forEach((el, i) => {
    el.classList.add('el-right');
    el.style.animationDelay = `${120 + i * 60}ms`;
  });

  container.querySelectorAll('.sub-heading').forEach((el, i) => {
    el.classList.add('el-left');
    el.style.animationDelay = `${80 + i * 40}ms`;
  });

  container.querySelectorAll('figure, .chart-figure, .photo-figure').forEach((el, i) => {
    el.classList.add('el-pop');
    el.style.animationDelay = `${100 + i * 70}ms`;
  });

  // Grid / card children
  const gridItems = container.querySelectorAll(
    '[style*="display:grid"] > div, [style*="display: grid"] > div'
  );
  gridItems.forEach((el, i) => {
    el.classList.add('el-pop');
    el.style.animationDelay = `${80 + i * 55}ms`;
  });
}

async function loadSection(hash) {
  const index = getSectionIndex(hash);
  if (index === -1) return loadSection('section-1');

  const section = SECTIONS[index];

  // Determine slide direction
  const direction = prevIndex === -1 ? 0 : (index > prevIndex ? 1 : -1);
  prevIndex = index;

  // Exit animation
  if (direction > 0) {
    container.classList.add('exit-left');
    await new Promise(r => setTimeout(r, 260));
    container.classList.remove('exit-left');
  } else if (direction < 0) {
    container.classList.add('exit-right');
    await new Promise(r => setTimeout(r, 260));
    container.classList.remove('exit-right');
  } else {
    container.classList.add('fading');
    await new Promise(r => setTimeout(r, 200));
    container.classList.remove('fading');
  }

  const html = await fetchFragment(section);
  container.innerHTML = html;

  // Enter animation
  if (direction > 0) {
    container.classList.add('enter-right');
    setTimeout(() => container.classList.remove('enter-right'), 420);
  } else if (direction < 0) {
    container.classList.add('enter-left');
    setTimeout(() => container.classList.remove('enter-left'), 420);
  } else {
    container.classList.add('entering');
    setTimeout(() => container.classList.remove('entering'), 350);
  }

  // Stagger element entrances
  animateElements();

  // Update page title
  document.title = `${section.title} — Consumer Behavior & Sustainability | USF`;

  // Render prev/next strip
  renderNavStrip(index);

  // Fire charts if this is the data section
  if (hash === 'section-6' && typeof window.chartsInit === 'function') {
    setTimeout(() => window.chartsInit(), 50);
  }

  // Scroll to top of main content
  document.getElementById('main-content').scrollTo({ top: 0, behavior: 'smooth' });
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Prefetch adjacent sections in the background
  if (SECTIONS[index - 1]) fetchFragment(SECTIONS[index - 1]);
  if (SECTIONS[index + 1]) fetchFragment(SECTIONS[index + 1]);
}

// Expose sections list for nav.js presenter clicker
window._SECTIONS_LIST = SECTIONS;

// Initial load
loadSection(getHash());

// React to hash changes (back/forward, sidebar clicks)
window.addEventListener('hashchange', () => loadSection(getHash()));
