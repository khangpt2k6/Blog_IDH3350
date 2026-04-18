/**
 * charts.js — Chart.js visualizations for Section 6
 * Layout: [Emissions Bar | Plastic Doughnut] top row (2-col)
 *         [Green Gap Horizontal Bar       ] bottom row (full-width)
 *
 * Called by router.js after s6-data.html is injected.
 */

window.chartsInit = function () {
  if (typeof Chart === 'undefined') {
    console.warn('Chart.js not loaded — charts skipped.');
    return;
  }

  // ── Read platform CSS tokens ───────────────────────────────
  const css      = getComputedStyle(document.documentElement);
  const textSec  = css.getPropertyValue('--color-text-secondary').trim()  || '#4a4a4a';
  const textTer  = css.getPropertyValue('--color-text-tertiary').trim()   || '#888888';
  const bgSec    = css.getPropertyValue('--color-background-secondary').trim() || '#f7f7f5';
  const borderT  = css.getPropertyValue('--color-border-tertiary').trim() || '#e4e4e0';
  const fontSans = css.getPropertyValue('--font-sans').trim() || "'Source Sans 3', sans-serif";

  // Shared defaults
  Chart.defaults.font.family = fontSans;
  Chart.defaults.font.size   = 11;
  Chart.defaults.color       = textSec;
  Chart.defaults.animation   = false;

  // Shared tick/grid style
  const axis = {
    grid:  { color: borderT, drawBorder: false },
    ticks: { color: textTer, padding: 4 }
  };

  // ── Platform-synced palette ────────────────────────────────
  const BLUE   = ['#1a6b9a','#2585bf','#3a9ed4','#60b5e0','#8fcbec','#b8def5'];
  const GREEN  = '#2d7d46';
  const RED    = '#e74c3c';

  // ── Destroy previous instances if section re-loaded ────────
  ['chart-emissions-sector','chart-plastic-fate','chart-green-gap'].forEach(id => {
    const el = document.getElementById(id);
    if (el && Chart.getChart(el)) Chart.getChart(el).destroy();
  });

  // ── Chart A: GHG Emissions by Sector (Bar) ────────────────
  const ctxA = document.getElementById('chart-emissions-sector');
  if (ctxA) {
    new Chart(ctxA, {
      type: 'bar',
      data: {
        labels: ['Transportation','Industry','Electricity','Buildings','Agri. & Food','Other'],
        datasets: [{
          data:            [28, 23, 25, 13, 11, 10],
          backgroundColor: BLUE,
          borderRadius:    3,
          borderSkipped:   false,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: { label: c => ` ${c.parsed.y}% of total U.S. emissions` }
          }
        },
        scales: {
          y: { ...axis, beginAtZero: true, max: 35,
               ticks: { ...axis.ticks, callback: v => v + '%', maxTicksLimit: 5 } },
          x: { ...axis, grid: { display: false },
               ticks: { ...axis.ticks, maxRotation: 30 } }
        }
      }
    });
  }

  // ── Chart B: Plastic Fate (Doughnut) ──────────────────────
  const ctxB = document.getElementById('chart-plastic-fate');
  if (ctxB) {
    new Chart(ctxB, {
      type: 'doughnut',
      data: {
        labels: ['Recycled', 'Incinerated', 'Landfill / Environment'],
        datasets: [{
          data:            [9, 12, 79],
          backgroundColor: [GREEN, '#f39c12', RED],
          borderColor:     bgSec,
          borderWidth:     3,
          hoverOffset:     6,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '58%',
        plugins: {
          legend: {
            position: 'bottom',
            labels: { padding: 10, boxWidth: 11, font: { size: 11 } }
          },
          tooltip: {
            callbacks: { label: c => ` ${c.label}: ${c.parsed}%` }
          }
        }
      }
    });
  }

  // ── Chart C: Green Gap — Attitudes vs. Behaviors (H-Bar) ──
  const ctxC = document.getElementById('chart-green-gap');
  if (ctxC) {
    // Pairs: [stated attitude, actual behavior] — alternating
    new Chart(ctxC, {
      type: 'bar',
      data: {
        labels: [
          'Willing to pay more for sustainable products',
          'Actually purchase sustainable regularly',
          'Concerned about climate change',
          'Actively reduced meat consumption',
          'Use reusable bags consistently',
          'Reduced air travel for climate reasons',
        ],
        datasets: [{
          label: '% of consumers',
          data:  [73, 26, 68, 22, 54, 14],
          backgroundColor: (ctx) => {
            // Even index = stated attitude (green), odd = actual behavior (red)
            return [0, 2, 4].includes(ctx.dataIndex) ? GREEN : RED;
          },
          borderRadius: 3,
          borderSkipped: false,
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: c => ` ${c.parsed.x}%`,
              afterBody: items => {
                const i = items[0]?.dataIndex;
                return [0, 2, 4].includes(i)
                  ? ['  Stated attitude / concern']
                  : ['  Reported actual behavior'];
              }
            }
          }
        },
        scales: {
          x: { ...axis, beginAtZero: true, max: 100,
               ticks: { ...axis.ticks, callback: v => v + '%', maxTicksLimit: 6 } },
          y: { ...axis, grid: { display: false },
               ticks: { ...axis.ticks, font: { size: 11 } } }
        }
      }
    });
  }
};
