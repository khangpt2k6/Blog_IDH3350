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

async function loadSection(hash) {
  const index = getSectionIndex(hash);
  if (index === -1) return loadSection('section-1');

  const section = SECTIONS[index];

  // Fade out
  container.classList.add('fading');
  await new Promise(r => setTimeout(r, 180));

  const html = await fetchFragment(section);
  container.innerHTML = html;
  container.classList.remove('fading');

  // Update page title
  document.title = `${section.title} — Consumer Behavior & Sustainability | USF`;

  // Render prev/next strip
  renderNavStrip(index);

  // Fire charts if this is the data section
  if (hash === 'section-6' && typeof window.chartsInit === 'function') {
    // Small delay to ensure canvas elements are in the DOM
    setTimeout(() => window.chartsInit(), 50);
  }

  // Scroll to top of main content
  document.getElementById('main-content').scrollTo({ top: 0, behavior: 'smooth' });
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Prefetch adjacent sections in the background
  if (SECTIONS[index - 1]) fetchFragment(SECTIONS[index - 1]);
  if (SECTIONS[index + 1]) fetchFragment(SECTIONS[index + 1]);
}

// Initial load
loadSection(getHash());

// React to hash changes (back/forward, sidebar clicks)
window.addEventListener('hashchange', () => loadSection(getHash()));
