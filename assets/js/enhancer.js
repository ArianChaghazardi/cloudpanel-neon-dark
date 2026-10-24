/**
 * CloudPanel Neon Dark - Enhancer & Dynamic Theme Engine
 * 
 * Features:
 *  1. Multi-Theme Switcher (Neon Midnight, Cyber Cyan, AMOLED Pure)
 *  2. Highcharts Monitoring Overhaul (Converts flat lines to smooth gradients)
 *  3. Modern UI/UX Micro-interactions & Polish
 */

(function () {
  'use strict';

  const STORAGE_KEY = 'clp_custom_theme';
  const THEMES = [
    {
      id: 'neon-blue',
      name: 'Neon Midnight',
      desc: 'Deep slate with electric sapphire glow',
      color: '#3b82f6',
      gradient: 'linear-gradient(135deg, #2563eb, #38bdf8)'
    },
    {
      id: 'cyber-cyan',
      name: 'Cyber Cyan',
      desc: 'Oceanic navy with cyan turquoise pulse',
      color: '#06b6d4',
      gradient: 'linear-gradient(135deg, #0891b2, #38bdf8)'
    },
    {
      id: 'amoled-pure',
      name: 'AMOLED Pure',
      desc: 'True pitch black with high-contrast blue',
      color: '#3b82f6',
      gradient: 'linear-gradient(135deg, #1d4ed8, #60a5fa)'
    }
  ];

  // Helper to get active theme
  function getActiveTheme() {
    return localStorage.getItem(STORAGE_KEY) || 'neon-blue';
  }

  // Apply theme to DOM
  function applyTheme(themeId) {
    const html = document.documentElement;
    html.classList.add('dark');
    html.setAttribute('data-clp-theme', themeId);
    localStorage.setItem(STORAGE_KEY, themeId);

    // Update active check in theme menu if rendered
    document.querySelectorAll('.clp-theme-option').forEach(el => {
      const isSelected = el.getAttribute('data-theme-id') === themeId;
      el.classList.toggle('active', isSelected);
    });

    // Update charts if Highcharts is available
    if (window.Highcharts && window.Highcharts.charts) {
      window.Highcharts.charts.forEach(chart => {
        if (chart) {
          modernizeChart(chart, themeId);
        }
      });
    }
  }

  // Apply immediately before DOM fully loads to prevent theme flash
  applyTheme(getActiveTheme());

  // Wait for DOM
  document.addEventListener('DOMContentLoaded', function () {
    injectThemeSwitcher();
    setupHighchartsHook();
    enhanceDashboardWidgets();
  });

  /**
   * 1. Inject Theme Switcher into Navbar
   */
  function injectThemeSwitcher() {
    const navbarRight = document.querySelector('.header .navbar-right ul');
    if (!navbarRight || document.getElementById('clp-custom-theme-switcher')) return;

    const currentTheme = getActiveTheme();

    const li = document.createElement('li');
    li.id = 'clp-custom-theme-switcher';
    li.className = 'dropdown clp-theme-switcher-wrapper';

    let optionsHtml = '';
    THEMES.forEach(t => {
      const isSelected = t.id === currentTheme;
      optionsHtml += `
        <a class="dropdown-item clp-theme-option ${isSelected ? 'active' : ''}" href="javascript:void(0);" data-theme-id="${t.id}" style="display: flex; align-items: center; gap: 10px; padding: 10px 14px; border-radius: 8px;">
          <span style="width: 14px; height: 14px; border-radius: 50%; background: ${t.gradient}; display: inline-block; box-shadow: 0 0 8px ${t.color};"></span>
          <div style="display: flex; flex-direction: column;">
            <span style="font-weight: 600; font-size: 13px; color: var(--clp-text-heading);">${t.name}</span>
            <span style="font-size: 11px; color: var(--clp-text-muted);">${t.desc}</span>
          </div>
        </a>
      `;
    });

    li.innerHTML = `
      <a class="dropdown-toggle" href="javascript:void(0);" role="button" data-bs-toggle="dropdown" aria-expanded="false" title="Switch Theme" style="display: flex; align-items: center; gap: 6px; padding: 6px 10px; border-radius: 8px; border: 1px solid var(--clp-border-default); background: var(--clp-bg-surface);">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--clp-accent);"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
        <span style="font-size: 12px; font-weight: 500; color: var(--clp-text-body);">Theme</span>
      </a>
      <div class="dropdown-menu dropdown-menu-end" style="background: var(--clp-bg-surface-elevated); border: 1px solid var(--clp-border-default); border-radius: 12px; padding: 8px; min-width: 240px; box-shadow: var(--clp-shadow-md);">
        <div style="padding: 6px 12px 10px 12px; border-bottom: 1px solid var(--clp-border-subtle); margin-bottom: 6px;">
          <div style="font-weight: 600; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; color: var(--clp-text-muted);">Select Visual Theme</div>
        </div>
        ${optionsHtml}
      </div>
    `;

    // Insert before user-avatar
    const userAvatar = navbarRight.querySelector('.user-avatar');
    if (userAvatar) {
      navbarRight.insertBefore(li, userAvatar);
    } else {
      navbarRight.appendChild(li);
    }

    // Attach click events
    li.querySelectorAll('.clp-theme-option').forEach(item => {
      item.addEventListener('click', function (e) {
        e.preventDefault();
        const themeId = this.getAttribute('data-theme-id');
        applyTheme(themeId);
      });
    });
  }

  /**
   * 2. Highcharts Modernizer (The Monitoring Overhaul)
   * Converts plain Highcharts into smooth curves with lush neon gradients
   */
  function setupHighchartsHook() {
    if (!window.Highcharts) return;

    // Wrap the Highcharts chart creation function
    const originalChart = window.Highcharts.chart;
    window.Highcharts.chart = function (renderTo, userOptions, callback) {
      const currentTheme = getActiveTheme();
      const themeColors = getThemeColors(currentTheme);

      // Enhance options before creation
      const enhancedOptions = enhanceChartOptions(userOptions, themeColors);
      const chartInstance = originalChart.call(this, renderTo, enhancedOptions, callback);
      return chartInstance;
    };

    // If charts already exist on page (e.g. executed before this script)
    if (window.Highcharts.charts && window.Highcharts.charts.length > 0) {
      window.Highcharts.charts.forEach(chart => {
        if (chart) modernizeChart(chart, getActiveTheme());
      });
    }
  }

  function getThemeColors(themeId) {
    if (themeId === 'cyber-cyan') {
      return {
        primary: '#06b6d4',
        secondary: '#22d3ee',
        gradientStart: 'rgba(6, 182, 212, 0.45)',
        gradientEnd: 'rgba(6, 182, 212, 0.01)'
      };
    }
    // Default / neon-blue / amoled
    return {
      primary: '#3b82f6',
      secondary: '#60a5fa',
      gradientStart: 'rgba(59, 130, 246, 0.45)',
      gradientEnd: 'rgba(59, 130, 246, 0.01)'
    };
  }

  function enhanceChartOptions(opts, colors) {
    opts = opts || {};
    opts.chart = opts.chart || {};
    
    // Convert stiff line to smooth areaspline
    opts.chart.type = 'areaspline';
    opts.chart.backgroundColor = 'transparent';

    opts.plotOptions = opts.plotOptions || {};
    opts.plotOptions.areaspline = {
      lineWidth: 2.5,
      lineColor: colors.primary,
      marker: {
        radius: 3,
        fillColor: colors.primary,
        lineWidth: 2,
        lineColor: '#ffffff',
        states: {
          hover: {
            radius: 5,
            lineWidth: 3
          }
        }
      },
      states: {
        hover: {
          lineWidth: 3
        }
      },
      fillColor: {
        linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
        stops: [
          [0, colors.gradientStart],
          [1, colors.gradientEnd]
        ]
      }
    };

    opts.tooltip = opts.tooltip || {};
    opts.tooltip.backgroundColor = 'rgba(15, 23, 42, 0.9)';
    opts.tooltip.borderColor = colors.primary;
    opts.tooltip.borderRadius = 8;
    opts.tooltip.style = {
      color: '#f8fafc',
      fontFamily: '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif'
    };
    opts.tooltip.shadow = true;

    // Minimal subtle gridlines
    if (opts.yAxis) {
      opts.yAxis.gridLineColor = 'rgba(255, 255, 255, 0.05)';
      opts.yAxis.gridLineDashStyle = 'Dash';
    }
    if (opts.xAxis) {
      opts.xAxis.lineColor = 'rgba(255, 255, 255, 0.1)';
      opts.xAxis.tickColor = 'transparent';
    }

    return opts;
  }

  function modernizeChart(chart, themeId) {
    const colors = getThemeColors(themeId);
    if (!chart.series) return;

    chart.series.forEach(series => {
      series.update({
        type: 'areaspline',
        color: colors.primary,
        fillColor: {
          linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
          stops: [
            [0, colors.gradientStart],
            [1, colors.gradientEnd]
          ]
        }
      }, false);
    });
    chart.redraw();
  }

  /**
   * 3. UX Polish for Dashboard Info Widgets
   */
  function enhanceDashboardWidgets() {
    const infoBoxes = document.querySelectorAll('.information-box');
    infoBoxes.forEach(box => {
      // Add status indicator if not present
      const h4 = box.querySelector('h4');
      if (h4 && !box.querySelector('.clp-pulse-indicator')) {
        const dot = document.createElement('span');
        dot.className = 'clp-pulse-indicator';
        dot.style.cssText = 'width: 7px; height: 7px; border-radius: 50%; background: #10b981; display: inline-block; box-shadow: 0 0 8px #10b981; margin-right: 6px;';
        h4.prepend(dot);
      }
    });
  }

})();
