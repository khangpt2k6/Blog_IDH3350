/**
 * charts.js — Chart.js visualizations for Section 6 (Data & Statistics)
 * Called by router.js after s6-data.html is injected into the DOM.
 */

window.chartsInit = function () {
  if (typeof Chart === 'undefined') {
    console.warn('Chart.js not loaded yet — charts skipped.');
    return;
  }

  // Read theme colors from CSS custom properties
  const style   = getComputedStyle(document.documentElement);
  const textPri = style.getPropertyValue('--color-text-primary').trim()    || '#1a1a1a';
  const textSec = style.getPropertyValue('--color-text-secondary').trim()  || '#4a4a4a';
  const textTer = style.getPropertyValue('--color-text-tertiary').trim()   || '#888888';
  const bgSec   = style.getPropertyValue('--color-background-secondary').trim() || '#f7f7f5';
  const borderT = style.getPropertyValue('--color-border-tertiary').trim() || '#e4e4e0';

  // Shared chart defaults
  Chart.defaults.font.family = style.getPropertyValue('--font-sans').trim() || 'Source Sans 3, sans-serif';
  Chart.defaults.color       = textSec;

  const PALETTE = {
    green:  ['#2d7d46', '#3ea05a', '#56b870', '#72ce8a', '#94dda5', '#b8ecbf'],
    blue:   ['#1a6b9a', '#2585bf', '#3a9ed4', '#60b5e0', '#8fcbec', '#b8def5'],
    warm:   ['#c0392b', '#e74c3c', '#e67e22', '#f39c12', '#f1c40f', '#2ecc71'],
    single: '#2d7d46',
  };

  // ── Chart A: Greenhouse Gas Emissions by Sector (Bar) ─────
  const ctxA = document.getElementById('chart-emissions-sector');
  if (ctxA) {
    new Chart(ctxA, {
      type: 'bar',
      data: {
        labels: ['Transportation', 'Industry', 'Agriculture & Food', 'Buildings', 'Electricity', 'Other'],
        datasets: [{
          label: 'Share of U.S. GHG Emissions (%)',
          data: [28, 23, 11, 13, 25, 10],
          backgroundColor: PALETTE.blue,
          borderColor: PALETTE.blue.map(c => c),
          borderWidth: 1,
          borderRadius: 4,
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: ctx => ` ${ctx.parsed.y}% of total emissions`
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 35,
            ticks: { callback: v => v + '%' },
            grid: { color: borderT }
          },
          x: { grid: { display: false } }
        }
      }
    });
  }

  // ── Chart B: Fate of All Plastics Ever Produced (Doughnut) ─
  const ctxB = document.getElementById('chart-plastic-fate');
  if (ctxB) {
    new Chart(ctxB, {
      type: 'doughnut',
      data: {
        labels: ['Recycled (9%)', 'Incinerated (12%)', 'Landfill / Environment (79%)'],
        datasets: [{
          data: [9, 12, 79],
          backgroundColor: ['#2d7d46', '#f39c12', '#c0392b'],
          borderColor: bgSec,
          borderWidth: 3,
          hoverOffset: 8,
        }]
      },
      options: {
        responsive: true,
        cutout: '60%',
        plugins: {
          legend: { position: 'bottom', labels: { padding: 16, boxWidth: 14 } },
          tooltip: {
            callbacks: {
              label: ctx => ` ${ctx.label}`
            }
          }
        }
      }
    });
  }

  // ── Chart C: Attitude–Behavior Gap (Horizontal Bar) ────────
  const ctxC = document.getElementById('chart-green-gap');
  if (ctxC) {
    new Chart(ctxC, {
      type: 'bar',
      data: {
        labels: [
          'Willing to pay more for sustainable products',
          'Regularly purchase sustainable products',
          'Concerned about climate change',
          'Actively reduced meat consumption',
          'Use reusable bags consistently',
          'Reduced air travel for climate reasons',
        ],
        datasets: [{
          label: '% of consumers',
          data: [73, 26, 68, 22, 54, 14],
          backgroundColor: (ctx) => {
            // Alternate shading: "stated" values vs "actual" values
            const stated = [0, 2, 4];
            return stated.includes(ctx.dataIndex) ? '#2d7d46' : '#e74c3c';
          },
          borderRadius: 4,
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: ctx => ` ${ctx.parsed.x}%`,
              afterBody: (items) => {
                const stated = [0, 2, 4];
                const i = items[0]?.dataIndex;
                return stated.includes(i) ? ['', '🟢 Stated attitude'] : ['', '🔴 Actual behavior'];
              }
            }
          }
        },
        scales: {
          x: {
            beginAtZero: true,
            max: 100,
            ticks: { callback: v => v + '%' },
            grid: { color: borderT }
          },
          y: { grid: { display: false }, ticks: { font: { size: 12 } } }
        }
      }
    });
  }
};
