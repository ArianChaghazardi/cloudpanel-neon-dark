/**
 * CloudPanel Neon Dark - Advanced UX Revolution & Mobile-First Engine
 * 
 * Capabilities:
 *  1. Executive Command Center Hero (Hostname, Online Status, Uptime, Daemons, Quick Actions)
 *  2. Real-Time Radial SVG Cockpit Gauges (Live polling /clp-custom/api/vitals.php every 3s)
 *  3. Sites Page Project Cards by Default (Vercel/Railway tier) + Official Tech Logos
 *  4. Instant Live Search & Category Filtering
 *  5. Mobile App Bottom Navigation Bar (< 768px)
 *  6. Command Palette (Spotlight: Ctrl+K / Cmd+K)
 *  7. 7 Curated Designer Palettes
 *  8. Highcharts Modernizer (Smooth AreaSpline & Dynamic Stats)
 */

(function () {
  'use strict';

  const STORAGE_THEME = 'clp_custom_theme';
  const STORAGE_VIEW = 'clp_sites_view_mode';
  const VITALS_API_URL = '/clp-custom/api/vitals.php';

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
      desc: 'True pitch black for OLED contrast',
      color: '#3b82f6',
      gradient: 'linear-gradient(135deg, #1d4ed8, #60a5fa)'
    },
    {
      id: 'matrix-green',
      name: 'Emerald Matrix',
      desc: 'Obsidian dark with hacker emerald neon',
      color: '#10b981',
      gradient: 'linear-gradient(135deg, #059669, #34d399)'
    },
    {
      id: 'violet-synth',
      name: 'Violet Royale',
      desc: 'Interstellar dark with linear purple glow',
      color: '#a855f7',
      gradient: 'linear-gradient(135deg, #7c3aed, #f472b6)'
    },
    {
      id: 'sunset-amber',
      name: 'Sunset Amber',
      desc: 'Volcanic dark with warm amber solar flare',
      color: '#f59e0b',
      gradient: 'linear-gradient(135deg, #ea580c, #fde047)'
    },
    {
      id: 'crimson-red',
      name: 'Crimson Phantom',
      desc: 'Stealth dark with cyber crimson pulse',
      color: '#ef4444',
      gradient: 'linear-gradient(135deg, #be123c, #fb7185)'
    }
  ];

  // Official Tech Brand SVG Logos
  const TECH_ICONS = {
    'nodejs': `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l9 5.2v10.4L12 23l-9-5.2V7.2L12 2zm0 2.3L4.8 8.5v7l7.2 4.2 7.2-4.2v-7L12 4.3z"/></svg>`,
    'php': `<svg viewBox="0 0 24 24" fill="currentColor"><ellipse cx="12" cy="12" rx="10" ry="6"/><path d="M7 10h3v4H7zm7 0h3v4h-3z" fill="#fff"/></svg>`,
    'python': `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M11.9 2c-3.1 0-5.1 1.4-5.1 3.5v2.6h5.3v.9H4.3c-2.3 0-4.3 1.4-4.3 4.2 0 2.8 1.9 4.3 4.3 4.3h1.8v-2.5c0-2.3 2-4.2 4.3-4.2h5.3V8.1c0-2.3-2-3.5-5.1-3.5h1.2v-.9h-1.2v-1.7zm-2.4 2.1c.5 0 .9.4.9.9s-.4.9-.9.9-.9-.4-.9-.9.4-.9.9-.9zm2.6 17.9c3.1 0 5.1-1.4 5.1-3.5v-2.6h-5.3v-.9h7.8c2.3 0 4.3-1.4 4.3-4.2 0-2.8-1.9-4.3-4.3-4.3h-1.8v2.5c0 2.3-2 4.2-4.3 4.2h-5.3v2.7c0 2.3 2 3.5 5.1 3.5h-1.2v.9h1.2v1.7zm2.4-2.1c-.5 0-.9-.4-.9-.9s.4-.9.9-.9.9.4.9.9-.4.9-.9.9z"/></svg>`,
    'wordpress': `<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10"/><path d="M12 3.6a8.4 8.4 0 0 0-4.7 1.4l5.3 14.6 2-5.7-1.7-4.9c.7-.1 1.3-.1 1.3-.1.4 0 .4-.6 0-.6h-3.6c-.4 0-.4.6 0 .6 0 0 .6 0 1.2.1l-1.5 4.3-2.1-6.1c.7-.1 1.3-.1 1.3-.1.4 0 .4-.6 0-.6H7.1c-.4 0-.4.6 0 .6 0 0 .6 0 1.1.1L5.4 15.3A8.4 8.4 0 0 0 12 20.4a8.4 8.4 0 0 0 8.4-8.4c0-2.1-.8-4.1-2.1-5.6l-3.3 9.4-3-8.8z" fill="#fff"/></svg>`,
    'reverse_proxy': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 3 21 3 21 8"/><line x1="4" y1="20" x2="21" y2="3"/><polyline points="21 16 21 21 16 21"/><line x1="15" y1="15" x2="21" y2="21"/><line x1="4" y1="4" x2="9" y2="9"/></svg>`,
    'static': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>`
  };

  function getActiveTheme() {
    return localStorage.getItem(STORAGE_THEME) || 'neon-blue';
  }

  function applyTheme(themeId, notify = false) {
    const html = document.documentElement;
    html.classList.add('dark');
    html.setAttribute('data-clp-theme', themeId);
    localStorage.setItem(STORAGE_THEME, themeId);

    const themeObj = THEMES.find(t => t.id === themeId) || THEMES[0];

    const activeDot = document.getElementById('clp-theme-active-dot');
    if (activeDot) {
      activeDot.style.background = themeObj.color;
      activeDot.style.boxShadow = `0 0 10px ${themeObj.color}`;
    }
    const activeName = document.getElementById('clp-theme-active-name');
    if (activeName) {
      activeName.textContent = themeObj.name;
    }

    document.querySelectorAll('.clp-theme-option').forEach(el => {
      const isActive = el.getAttribute('data-theme-id') === themeId;
      el.classList.toggle('active', isActive);
      const check = el.querySelector('.clp-theme-check');
      if (check) check.style.display = isActive ? 'inline-block' : 'none';
    });

    if (window.Highcharts && window.Highcharts.charts) {
      window.Highcharts.charts.forEach(chart => {
        if (chart) modernizeChart(chart, themeId);
      });
    }

    if (notify) {
      showToast(`Visual Theme set to ${themeObj.name}`);
    }
  }

  // Pre-apply theme immediately to avoid flash of unstyled content
  applyTheme(getActiveTheme(), false);

  // Robust Lifecycle Execution
  function initializeEngine() {
    try { injectCustomBranding(); } catch (e) { console.warn('injectCustomBranding:', e); }
    try { injectHeaderBreadcrumb(); } catch (e) { console.warn('injectHeaderBreadcrumb:', e); }
    try { injectThemeSwitcher(); } catch (e) { console.warn('injectThemeSwitcher:', e); }
    try { setupHighchartsHook(); } catch (e) { console.warn('setupHighchartsHook:', e); }
    try { setupCommandPalette(); } catch (e) { console.warn('setupCommandPalette:', e); }
    try { enhanceSitesPageUX(); } catch (e) { console.warn('enhanceSitesPageUX:', e); }
    try { enhanceDashboardUX(); } catch (e) { console.warn('enhanceDashboardUX:', e); }
    try { injectMobileBottomNavigation(); } catch (e) { console.warn('injectMobileBottomNavigation:', e); }

    // Start Real-Time Live Vitals Engine
    startLiveVitalsEngine();
  }

  // ==========================================================================
  // 0. Dynamic Brand Identity (HectorTM)
  // ==========================================================================
  function injectCustomBranding() {
    const logoTargets = document.querySelectorAll('.header .logo a, .logo a, .login-container .logo a');
    logoTargets.forEach(logoA => {
      if (logoA.querySelector('.clp-brand-logo')) return;

      const img = logoA.querySelector('img#logo, img');
      if (img) img.style.display = 'none';

      const brand = document.createElement('span');
      brand.className = 'clp-brand-logo';
      brand.title = 'HectorTM';
      brand.innerHTML = `Hector<span class="clp-brand-tm">TM</span>`;
      logoA.appendChild(brand);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeEngine);
  } else {
    initializeEngine();
  }

  // ==========================================================================
  // 1. Toast Notification System
  // ==========================================================================
  function showToast(message, iconSvg = '') {
    let container = document.querySelector('.clp-toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'clp-toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'clp-toast';
    toast.innerHTML = `
      ${iconSvg || '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--clp-accent);"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>'}
      <span>${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('out');
      setTimeout(() => toast.remove(), 260);
    }, 2800);
  }

  // ==========================================================================
  // 2. Visual Theme Switcher (7 Designer Palettes) - Topbar First-Class Item
  // ==========================================================================
  function injectThemeSwitcher() {
    if (document.querySelector('.clp-nav-theme-switcher')) return;

    const navbarRightUl = document.querySelector('.header .navbar-right > ul') || document.querySelector('.navbar-right > ul');
    if (!navbarRightUl) return;

    // Hide native theme switch if present
    const nativeThemeLi = navbarRightUl.querySelector('.theme-switcher');
    if (nativeThemeLi) {
      nativeThemeLi.style.display = 'none';
    }

    const currentTheme = getActiveTheme();
    const currentThemeObj = THEMES.find(t => t.id === currentTheme) || THEMES[0];

    const li = document.createElement('li');
    li.className = 'clp-nav-theme-switcher dropdown';

    li.innerHTML = `
      <button class="clp-theme-nav-btn" id="clp-theme-toggle-btn" type="button" title="Tailored Visual Palette (${THEMES.length} Themes)" aria-label="Change Theme">
        <span class="clp-theme-dot" id="clp-theme-active-dot" style="background: ${currentThemeObj.color}; box-shadow: 0 0 10px ${currentThemeObj.color};"></span>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="5"/>
          <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
        </svg>
        <span class="clp-theme-nav-label" id="clp-theme-active-name">${currentThemeObj.name}</span>
        <svg class="clp-theme-chevron" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
      </button>
      <div class="clp-theme-dropdown-menu" id="clp-theme-menu">
        <div class="clp-theme-menu-header">
          <div class="title">Visual Aesthetics</div>
          <div class="subtitle">Select your tailored designer palette</div>
        </div>
        <div class="clp-theme-list">
          ${THEMES.map(t => {
            const isActive = t.id === currentTheme;
            return `
            <div class="clp-theme-option ${isActive ? 'active' : ''}" data-theme-id="${t.id}">
              <div class="clp-theme-swatch" style="background: ${t.gradient};"></div>
              <div class="clp-theme-info">
                <div class="name">${t.name}</div>
                <div class="desc">${t.desc}</div>
              </div>
              <div class="clp-theme-check" style="display: ${isActive ? 'inline-block' : 'none'};">✓</div>
            </div>
            `;
          }).join('')}
        </div>
      </div>
    `;

    // Insert before user avatar or admin area
    const userAvatar = navbarRightUl.querySelector('.user-avatar');
    if (userAvatar) {
      navbarRightUl.insertBefore(li, userAvatar);
    } else {
      navbarRightUl.appendChild(li);
    }

    const toggleBtn = li.querySelector('#clp-theme-toggle-btn');
    const menu = li.querySelector('#clp-theme-menu');

    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      menu.classList.toggle('open');
      li.classList.toggle('open');
    });

    document.addEventListener('click', (e) => {
      if (!li.contains(e.target)) {
        menu.classList.remove('open');
        li.classList.remove('open');
      }
    });

    li.querySelectorAll('.clp-theme-option').forEach(el => {
      el.addEventListener('click', function (e) {
        e.stopPropagation();
        const themeId = this.getAttribute('data-theme-id');
        applyTheme(themeId, true);
        menu.classList.remove('open');
        li.classList.remove('open');
      });
    });
  }

  // ==========================================================================
  // 3. Spotlight Command Palette (Ctrl+K / Cmd+K)
  // ==========================================================================
  function setupCommandPalette() {
    if (document.querySelector('.clp-palette-overlay')) return;

    const overlay = document.createElement('div');
    overlay.className = 'clp-palette-overlay';
    overlay.id = 'clp-command-palette';

    overlay.innerHTML = `
      <div class="clp-palette-modal">
        <div class="clp-palette-header">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.3-4.3"/>
          </svg>
          <input type="text" class="clp-palette-input" id="clp-palette-search" placeholder="Type a command, site, or jump to page... (Esc to close)">
          <span class="clp-palette-esc">ESC</span>
        </div>
        <div class="clp-palette-results" id="clp-palette-results"></div>
        <div class="clp-palette-footer">
          <span>Navigation: <kbd>↑</kbd> <kbd>↓</kbd></span>
          <span>Select: <kbd>Enter</kbd></span>
          <span>Close: <kbd>Esc</kbd></span>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    const input = overlay.querySelector('#clp-palette-search');
    const resultsContainer = overlay.querySelector('#clp-palette-results');

    const defaultCommands = [
      { section: 'Navigation', title: 'Dashboard & Vitals', desc: 'Real-time server monitoring and analytics', url: '/dashboard', icon: '📊' },
      { section: 'Navigation', title: 'Sites Manager', desc: 'Overview of all hosted websites and applications', url: '/', icon: '🌐' },
      { section: 'Navigation', title: 'Services Control', desc: 'Inspect and manage Nginx, MySQL, PHP-FPM daemons', url: '/admin/services', icon: '⚙️' },
      { section: 'Navigation', title: 'Instance Settings', desc: 'Server hardware and timezone configuration', url: '/admin/instance/settings', icon: '🛠️' },
      { section: 'Actions', title: 'Create New Site', desc: 'Deploy WordPress, PHP, Node.js, Python, or Reverse Proxy', url: '/site/new', icon: '➕' },
      { section: 'Actions', title: 'Open phpMyAdmin', desc: 'Launch single sign-on database manager', url: '/pma', icon: '🗄️' },
      { section: 'Actions', title: 'Copy Root SSH Command', desc: 'Copy "ssh root@' + window.location.hostname + '" to clipboard', action: () => {
        navigator.clipboard.writeText(`ssh root@${window.location.hostname}`);
        showToast(`SSH Command copied to clipboard!`);
      }, icon: '📋' },
      { section: 'Appearance', title: 'Theme: Neon Midnight Blue', desc: 'Electric sapphire glow', action: () => applyTheme('neon-blue', true), icon: '🎨' },
      { section: 'Appearance', title: 'Theme: Cyber Cyan', desc: 'Oceanic turquoise pulse', action: () => applyTheme('cyber-cyan', true), icon: '🎨' },
      { section: 'Appearance', title: 'Theme: AMOLED Pure Black', desc: 'True pitch black contrast', action: () => applyTheme('amoled-pure', true), icon: '🎨' },
      { section: 'Appearance', title: 'Theme: Emerald Matrix', desc: 'Hacker emerald neon', action: () => applyTheme('matrix-green', true), icon: '🎨' },
      { section: 'Appearance', title: 'Theme: Violet Royale', desc: 'Interstellar purple glow', action: () => applyTheme('violet-synth', true), icon: '🎨' },
      { section: 'Appearance', title: 'Theme: Sunset Amber', desc: 'Volcanic amber solar flare', action: () => applyTheme('sunset-amber', true), icon: '🎨' },
      { section: 'Appearance', title: 'Theme: Crimson Phantom', desc: 'Stealth cyber crimson pulse', action: () => applyTheme('crimson-red', true), icon: '🎨' }
    ];

    function openPalette() {
      overlay.classList.add('open');
      input.value = '';
      renderPaletteResults(defaultCommands);
      setTimeout(() => input.focus(), 50);
    }

    function closePalette() {
      overlay.classList.remove('open');
    }

    function renderPaletteResults(items) {
      if (!items || items.length === 0) {
        resultsContainer.innerHTML = `<div class="clp-palette-empty">No matching commands or sites found.</div>`;
        return;
      }

      let currentSection = '';
      let html = '';

      items.forEach((item, idx) => {
        if (item.section && item.section !== currentSection) {
          currentSection = item.section;
          html += `<div class="clp-palette-section-title">${currentSection}</div>`;
        }

        html += `
          <div class="clp-palette-item ${idx === 0 ? 'selected' : ''}" data-idx="${idx}">
            <div class="clp-palette-icon">${item.icon || '⚡'}</div>
            <div class="clp-palette-text">
              <div class="title">${item.title}</div>
              <div class="desc">${item.desc}</div>
            </div>
            <div class="clp-palette-arrow">↵</div>
          </div>
        `;
      });

      resultsContainer.innerHTML = html;

      resultsContainer.querySelectorAll('.clp-palette-item').forEach((el, index) => {
        el.addEventListener('click', () => {
          executePaletteItem(items[index]);
        });
      });
    }

    function executePaletteItem(item) {
      closePalette();
      if (item.action) {
        item.action();
      } else if (item.url) {
        window.location.href = item.url;
      }
    }

    input.addEventListener('input', function () {
      const q = this.value.toLowerCase().trim();
      if (!q) {
        renderPaletteResults(defaultCommands);
        return;
      }

      const filtered = defaultCommands.filter(c =>
        c.title.toLowerCase().includes(q) || c.desc.toLowerCase().includes(q) || (c.section && c.section.toLowerCase().includes(q))
      );
      renderPaletteResults(filtered);
    });

    // Keyboard navigation
    window.addEventListener('keydown', function (e) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (overlay.classList.contains('open')) {
          closePalette();
        } else {
          openPalette();
        }
      }

      if (e.key === 'Escape' && overlay.classList.contains('open')) {
        closePalette();
      }
    });

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closePalette();
    });

    input.addEventListener('keydown', function (e) {
      const items = Array.from(resultsContainer.querySelectorAll('.clp-palette-item'));
      if (!items.length) return;

      let currentSelected = items.findIndex(el => el.classList.contains('selected'));

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        items[currentSelected]?.classList.remove('selected');
        const next = (currentSelected + 1) % items.length;
        items[next]?.classList.add('selected');
        items[next]?.scrollIntoView({ block: 'nearest' });
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        items[currentSelected]?.classList.remove('selected');
        const prev = (currentSelected - 1 + items.length) % items.length;
        items[prev]?.classList.add('selected');
        items[prev]?.scrollIntoView({ block: 'nearest' });
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (currentSelected >= 0 && items[currentSelected]) {
          items[currentSelected].click();
        }
      }
    });
  }

  // ==========================================================================
  // 4. Header Spotlight Search Button (Ctrl+K)
  // ==========================================================================
  function injectHeaderBreadcrumb() {
    if (document.querySelector('.clp-nav-spotlight')) return;

    const navbarRightUl = document.querySelector('.header .navbar-right > ul') || document.querySelector('.navbar-right > ul');
    if (!navbarRightUl) return;

    const li = document.createElement('li');
    li.className = 'clp-nav-spotlight';

    li.innerHTML = `
      <button class="clp-header-spotlight-btn" id="clp-header-spotlight-trigger" type="button" title="Spotlight Command Palette (Ctrl+K)">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"/>
          <path d="m21 21-4.3-4.3"/>
        </svg>
        <span class="clp-spotlight-label">Quick Search...</span>
        <kbd class="clp-spotlight-kbd">Ctrl K</kbd>
      </button>
    `;

    // Insert as the first item before theme switcher or other items
    const themeSwitcher = navbarRightUl.querySelector('.clp-nav-theme-switcher');
    if (themeSwitcher) {
      navbarRightUl.insertBefore(li, themeSwitcher);
    } else {
      navbarRightUl.insertBefore(li, navbarRightUl.firstChild);
    }

    li.querySelector('#clp-header-spotlight-trigger').addEventListener('click', () => {
      const palette = document.getElementById('clp-command-palette');
      if (palette) {
        palette.classList.add('open');
        document.getElementById('clp-palette-search')?.focus();
      }
    });
  }

  // ==========================================================================
  // 5. Sites Page UX Revolution (Summary, Live Search, Vercel Card Grid & Tech Badges)
  // ==========================================================================
  function enhanceSitesPageUX() {
    const tableSites = document.querySelector('.table-sites');
    if (!tableSites) return;

    const cardTable = tableSites.closest('.card-table') || tableSites.closest('.card');
    if (!cardTable) return;

    const siteRows = Array.from(tableSites.querySelectorAll('tbody tr'));
    const sitesData = [];

    siteRows.forEach(row => {
      const cells = row.querySelectorAll('td');
      if (cells.length < 3) return;

      const domainLink = cells[0].querySelector('a');
      const domain = domainLink ? domainLink.textContent.trim() : cells[0].textContent.trim();
      const manageUrl = domainLink ? domainLink.getAttribute('href') : `/site/${domain}`;
      const user = cells[1].textContent.trim();
      const rawAppType = cells[2].textContent.trim().toLowerCase();

      let badgeClass = 'clp-tech-static';
      let icon = TECH_ICONS.static;
      let appName = 'Static';

      if (rawAppType.includes('node')) {
        badgeClass = 'clp-tech-nodejs';
        icon = TECH_ICONS.nodejs;
        appName = 'Node.js';
      } else if (rawAppType.includes('word')) {
        badgeClass = 'clp-tech-wordpress';
        icon = TECH_ICONS.wordpress;
        appName = 'WordPress';
      } else if (rawAppType.includes('pyth')) {
        badgeClass = 'clp-tech-python';
        icon = TECH_ICONS.python;
        appName = 'Python';
      } else if (rawAppType.includes('php')) {
        badgeClass = 'clp-tech-php';
        icon = TECH_ICONS.php;
        appName = 'PHP';
      } else if (rawAppType.includes('proxy')) {
        badgeClass = 'clp-tech-proxy';
        icon = TECH_ICONS.reverse_proxy;
        appName = 'Reverse Proxy';
      }

      // Upgrade table badge
      cells[2].innerHTML = `
        <span class="clp-tech-badge ${badgeClass}">
          ${icon}
          <span>${appName}</span>
        </span>
      `;

      sitesData.push({
        element: row,
        domain: domain,
        manageUrl: manageUrl,
        user: user,
        appType: rawAppType,
        appName: appName,
        badgeClass: badgeClass,
        icon: icon
      });

      // Add inline quick actions inside table row
      if (domainLink && !domainLink.querySelector('.clp-cell-actions')) {
        const actionsWrap = document.createElement('span');
        actionsWrap.className = 'clp-cell-actions';
        actionsWrap.style.cssText = 'display: inline-flex; align-items: center; gap: 8px; margin-left: 10px;';
        actionsWrap.innerHTML = `
          <a href="https://${domain}" target="_blank" rel="noopener noreferrer" title="Visit Site ↗" style="color: var(--clp-text-muted); font-size: 11px;">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
          </a>
          <span class="clp-copy-domain" title="Copy Domain" style="cursor: pointer; color: var(--clp-text-muted); font-size: 11px;">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
          </span>
        `;
        actionsWrap.querySelector('.clp-copy-domain').addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          navigator.clipboard.writeText(domain);
          showToast(`Domain "${domain}" copied!`);
        });
        domainLink.appendChild(actionsWrap);
      }
    });

    if (document.querySelector('.clp-sites-card-grid')) return;

    // Build Executive Sites Metric Overview Banner
    const totalCount = sitesData.length;
    const wpCount = sitesData.filter(s => s.appType.includes('word')).length;
    const nodeCount = sitesData.filter(s => s.appType.includes('node')).length;
    const phpCount = sitesData.filter(s => s.appType.includes('php')).length;

    const summaryBanner = document.createElement('div');
    summaryBanner.className = 'clp-sites-summary-banner';
    summaryBanner.innerHTML = `
      <div class="clp-summary-card">
        <div class="clp-summary-label">Total Hosted Sites</div>
        <div class="clp-summary-val">${totalCount} <span style="font-size: 13px; font-weight: normal; color: #10b981;">● All Active</span></div>
      </div>
      <div class="clp-summary-card">
        <div class="clp-summary-label">Security & Encryption</div>
        <div class="clp-summary-val" style="color: #38bdf8;">100% <span style="font-size: 13px; font-weight: normal; color: var(--clp-text-muted);">SSL Protected</span></div>
      </div>
      <div class="clp-summary-card">
        <div class="clp-summary-label">Stack Distribution</div>
        <div class="clp-summary-val" style="font-size: 14px; display: flex; gap: 8px; flex-wrap: wrap; margin-top: 4px;">
          <span class="badge" style="background: rgba(59, 130, 246, 0.15); color: #60a5fa;">PHP: ${phpCount}</span>
          <span class="badge" style="background: rgba(16, 185, 129, 0.15); color: #34d399;">Node: ${nodeCount}</span>
          <span class="badge" style="background: rgba(168, 85, 247, 0.15); color: #c084fc;">WordPress: ${wpCount}</span>
        </div>
      </div>
    `;

    cardTable.parentNode.insertBefore(summaryBanner, cardTable);

    // Build Modern Vercel/Railway Style Card Grid
    const cardGridContainer = document.createElement('div');
    cardGridContainer.className = 'clp-sites-card-grid';

    sitesData.forEach(site => {
      const card = document.createElement('div');
      card.className = 'clp-site-card';
      card.setAttribute('data-domain', site.domain.toLowerCase());
      card.setAttribute('data-app', site.appType);

      card.innerHTML = `
        <div class="clp-site-card-top">
          <div class="clp-site-card-header">
            <a href="${site.manageUrl}" class="clp-site-card-domain" title="Manage ${site.domain}">
              <span class="clp-site-domain-icon">🌐</span>
              <span>${site.domain}</span>
            </a>
            <span class="clp-tech-badge ${site.badgeClass}">
              ${site.icon}
              <span>${site.appName}</span>
            </span>
          </div>
          <div class="clp-site-card-meta">
            <div class="clp-site-meta-item">
              <span class="clp-meta-lbl">Site User</span>
              <strong class="clp-meta-val">👤 ${site.user}</strong>
            </div>
            <div class="clp-site-meta-item">
              <span class="clp-meta-lbl">SSL Protection</span>
              <span class="clp-meta-val" style="color: #10b981;">🔒 Active</span>
            </div>
          </div>
          <div class="clp-site-shortcuts">
            <a href="${site.manageUrl}/databases" class="clp-shortcut-chip" title="Databases">🗄️ DB</a>
            <a href="${site.manageUrl}/certificates" class="clp-shortcut-chip" title="SSL Certificate">🛡️ SSL</a>
            <a href="${site.manageUrl}/vhost" class="clp-shortcut-chip" title="Vhost Template">⚙️ Vhost</a>
          </div>
        </div>
        <div class="clp-site-card-actions">
          <a href="${site.manageUrl}" class="btn btn-primary btn-sm">Manage</a>
          <a href="https://${site.domain}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm" title="Visit in new tab">Visit ↗</a>
        </div>
      `;
      cardGridContainer.appendChild(card);
    });

    cardTable.parentNode.insertBefore(cardGridContainer, cardTable.nextSibling);

    // Build Toolbar (Search + Filter Pills + View Switcher)
    const toolbar = document.createElement('div');
    toolbar.className = 'clp-sites-toolbar';

    toolbar.innerHTML = `
      <div class="clp-sites-search-box">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
        <input type="text" class="form-control clp-sites-search-input" placeholder="Search domains or users...">
      </div>
      <div class="clp-filter-pills">
        <span class="clp-filter-pill active" data-filter="all">All (${sitesData.length})</span>
        <span class="clp-filter-pill" data-filter="php">PHP</span>
        <span class="clp-filter-pill" data-filter="node">Node.js</span>
        <span class="clp-filter-pill" data-filter="pyth">Python</span>
        <span class="clp-filter-pill" data-filter="word">WordPress</span>
        <span class="clp-filter-pill" data-filter="proxy">Proxy</span>
        <span class="clp-filter-pill" data-filter="static">Static</span>
      </div>
      <div class="clp-view-toggle">
        <button type="button" class="clp-view-btn" data-view="table" title="Table View">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
        </button>
        <button type="button" class="clp-view-btn active" data-view="grid" title="Card Grid View">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>
        </button>
      </div>
    `;

    cardTable.parentNode.insertBefore(toolbar, cardTable);

    const searchInput = toolbar.querySelector('.clp-sites-search-input');
    const filterPills = toolbar.querySelectorAll('.clp-filter-pill');
    let currentFilter = 'all';

    function applyFilterAndSearch() {
      const q = searchInput.value.toLowerCase().trim();

      sitesData.forEach(site => {
        const matchesQuery = site.domain.toLowerCase().includes(q) || site.user.toLowerCase().includes(q);
        const matchesFilter = currentFilter === 'all' || site.appType.includes(currentFilter);
        const shouldShow = matchesQuery && matchesFilter;

        site.element.style.display = shouldShow ? '' : 'none';
        const cardMatch = cardGridContainer.querySelector(`.clp-site-card[data-domain="${site.domain.toLowerCase()}"]`);
        if (cardMatch) cardMatch.style.display = shouldShow ? 'flex' : 'none';
      });
    }

    searchInput.addEventListener('input', applyFilterAndSearch);

    filterPills.forEach(pill => {
      pill.addEventListener('click', function () {
        filterPills.forEach(p => p.classList.remove('active'));
        this.classList.add('active');
        currentFilter = this.getAttribute('data-filter');
        applyFilterAndSearch();
      });
    });

    const viewButtons = toolbar.querySelectorAll('.clp-view-btn');
    function setViewMode(mode) {
      if (window.innerWidth < 768) mode = 'grid';

      localStorage.setItem(STORAGE_VIEW, mode);
      viewButtons.forEach(b => b.classList.toggle('active', b.getAttribute('data-view') === mode));

      if (mode === 'grid') {
        cardTable.style.display = 'none';
        cardGridContainer.style.display = 'grid';
      } else {
        cardTable.style.display = 'block';
        cardGridContainer.style.display = 'none';
      }
    }

    viewButtons.forEach(btn => {
      btn.addEventListener('click', function () {
        setViewMode(this.getAttribute('data-view'));
      });
    });

    // Make Card View DEFAULT for high-tier UX
    const savedView = localStorage.getItem(STORAGE_VIEW) || 'grid';
    setViewMode(savedView);

    window.addEventListener('resize', function () {
      if (window.innerWidth < 768) {
        setViewMode('grid');
      }
    });
  }

  // ==========================================================================
  // 6. Dashboard UX Revolution (Radial SVG Gauges & Cockpit Hero)
  // ==========================================================================
  function enhanceDashboardUX() {
    const infoBoxesContainer = document.querySelector('.information-box-container');
    if (!infoBoxesContainer) return;

    const ipElement = infoBoxesContainer.querySelector('a.click-to-copy');
    const serverIp = ipElement ? ipElement.textContent.trim() : window.location.hostname;

    const card = infoBoxesContainer.closest('.card');
    if (!card) return;

    // 1. Inject Executive Server Command Hero Ribbon
    if (!document.querySelector('.clp-health-ribbon')) {
      const ribbon = document.createElement('div');
      ribbon.className = 'clp-health-ribbon';

      ribbon.innerHTML = `
        <div class="clp-health-status">
          <span class="clp-status-dot pulse"></span>
          <div>
            <div class="clp-health-title">Server Command Center: System Operational</div>
            <div class="clp-health-sub" id="clp-hero-sub">
              Nginx: <span class="badge badge-success">🟢 Active</span> •
              MariaDB: <span class="badge badge-success">🟢 Active</span> •
              PHP-FPM: <span class="badge badge-success">🟢 Active</span> •
              <span id="clp-hero-uptime">Uptime: Checking...</span>
            </div>
          </div>
        </div>
        <div class="clp-health-actions">
          <button type="button" class="clp-quick-ssh-btn" id="clp-ssh-copier" title="Click to copy root SSH login">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>
            <span>ssh root@${serverIp}</span>
          </button>
          <a href="/site/new" class="btn btn-primary btn-sm">+ Add Site</a>
        </div>
      `;

      card.parentNode.insertBefore(ribbon, card);

      ribbon.querySelector('#clp-ssh-copier').addEventListener('click', function () {
        navigator.clipboard.writeText(`ssh root@${serverIp}`);
        showToast(`SSH Command copied: ssh root@${serverIp}`);
      });
    }

    // 2. Inject Futuristic Radial Cockpit Gauges (CPU, Memory, NVMe Storage)
    if (!document.querySelector('.clp-radial-cockpit')) {
      const cockpit = document.createElement('div');
      cockpit.className = 'clp-radial-cockpit';

      cockpit.innerHTML = `
        <!-- CPU Radial Meter -->
        <div class="clp-cockpit-card" id="cockpit-cpu">
          <div class="clp-cockpit-info">
            <div class="clp-cockpit-title">
              <span class="icon">⚡</span>
              <span>CPU UTILIZATION</span>
            </div>
            <div class="clp-cockpit-status" id="clp-cpu-status-pill">● Normal</div>
            <div class="clp-cockpit-sub" id="clp-cpu-subtext">Loading multi-core load...</div>
          </div>
          <div class="clp-cockpit-radial">
            <svg class="clp-radial-meter" viewBox="0 0 100 100">
              <circle class="clp-radial-bg" cx="50" cy="50" r="40" />
              <circle class="clp-radial-bar clp-radial-cpu" id="clp-radial-cpu-circle" cx="50" cy="50" r="40" stroke-dasharray="251.32" stroke-dashoffset="251.32" />
            </svg>
            <div class="clp-radial-label">
              <span class="clp-radial-val" id="clp-cpu-gauge-val">0.0%</span>
            </div>
          </div>
        </div>

        <!-- RAM Radial Meter -->
        <div class="clp-cockpit-card" id="cockpit-ram">
          <div class="clp-cockpit-info">
            <div class="clp-cockpit-title">
              <span class="icon">🧠</span>
              <span>MEMORY (RAM)</span>
            </div>
            <div class="clp-cockpit-status healthy" id="clp-ram-status-pill">● Healthy</div>
            <div class="clp-cockpit-sub" id="clp-ram-subtext">Calculating buffer & cache...</div>
          </div>
          <div class="clp-cockpit-radial">
            <svg class="clp-radial-meter" viewBox="0 0 100 100">
              <circle class="clp-radial-bg" cx="50" cy="50" r="40" />
              <circle class="clp-radial-bar clp-radial-ram" id="clp-radial-ram-circle" cx="50" cy="50" r="40" stroke-dasharray="251.32" stroke-dashoffset="251.32" />
            </svg>
            <div class="clp-radial-label">
              <span class="clp-radial-val" id="clp-ram-gauge-val">0.0%</span>
            </div>
          </div>
        </div>

        <!-- Storage Radial Meter -->
        <div class="clp-cockpit-card" id="cockpit-disk">
          <div class="clp-cockpit-info">
            <div class="clp-cockpit-title">
              <span class="icon">💾</span>
              <span>NVMe STORAGE</span>
            </div>
            <div class="clp-cockpit-status" id="clp-disk-status-pill">● Normal</div>
            <div class="clp-cockpit-sub" id="clp-disk-subtext">Reading mount /...</div>
          </div>
          <div class="clp-cockpit-radial">
            <svg class="clp-radial-meter" viewBox="0 0 100 100">
              <circle class="clp-radial-bg" cx="50" cy="50" r="40" />
              <circle class="clp-radial-bar clp-radial-disk" id="clp-radial-disk-circle" cx="50" cy="50" r="40" stroke-dasharray="251.32" stroke-dashoffset="251.32" />
            </svg>
            <div class="clp-radial-label">
              <span class="clp-radial-val" id="clp-disk-gauge-val">0.0%</span>
            </div>
          </div>
        </div>
      `;

      card.parentNode.insertBefore(cockpit, card);
    }

    // Chart Layout Toggle (Focus Mode vs 2x2 Grid)
    const chartsCard = document.querySelector('.dashboard-charts-container .card');
    const chartContainer = document.querySelector('.chart-container');
    if (chartsCard && chartContainer) {
      const header = chartsCard.querySelector('.card-header');
      if (header && !document.getElementById('clp-chart-layout-toggle')) {
        const toggleBtn = document.createElement('button');
        toggleBtn.id = 'clp-chart-layout-toggle';
        toggleBtn.type = 'button';
        toggleBtn.className = 'btn btn-sm btn-white';
        toggleBtn.style.cssText = 'padding: 4px 10px; font-size: 12px; margin-right: 8px;';
        toggleBtn.innerHTML = '🔲 Focus View';

        toggleBtn.addEventListener('click', function () {
          const isFocus = chartContainer.classList.toggle('focus-mode');
          this.innerHTML = isFocus ? '🪟 2x2 Grid' : '🔲 Focus View';
          if (window.Highcharts && window.Highcharts.charts) {
            window.Highcharts.charts.forEach(c => { if (c) c.reflow(); });
          }
        });

        const select = header.querySelector('select');
        if (select) {
          select.parentNode.insertBefore(toggleBtn, select);
        }
      }
    }
  }

  // ==========================================================================
  // 7. Live Real-Time Vitals Engine (Fast Polling + Radial Animations)
  // ==========================================================================
  function updateRadialMeter(circleId, valId, percent) {
    const circle = document.getElementById(circleId);
    const label = document.getElementById(valId);
    if (!circle || !label) return;

    const clamped = Math.max(0, Math.min(100, percent));
    const circumference = 251.327; // 2 * pi * 40
    const offset = circumference - (clamped / 100) * circumference;

    circle.style.strokeDashoffset = offset.toFixed(2);
    label.textContent = clamped.toFixed(1) + '%';

    // Dynamic color shifting
    if (clamped > 85) {
      circle.style.stroke = '#ef4444';
      circle.style.filter = 'drop-shadow(0 0 6px rgba(239, 68, 68, 0.6))';
    } else if (clamped > 65) {
      circle.style.stroke = '#f59e0b';
      circle.style.filter = 'drop-shadow(0 0 6px rgba(245, 158, 11, 0.6))';
    } else {
      circle.style.stroke = '';
      circle.style.filter = '';
    }
  }

  function fetchAndApplyLiveVitals() {
    fetch(VITALS_API_URL, { cache: 'no-store' })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(data => {
        if (!data || !data.success) return;

        // 1. CPU
        if (data.cpu) {
          const cpuPct = data.cpu.percent;
          updateRadialMeter('clp-radial-cpu-circle', 'clp-cpu-gauge-val', cpuPct);
          const cpuSub = document.getElementById('clp-cpu-subtext');
          const cpuPill = document.getElementById('clp-cpu-status-pill');
          if (cpuSub) cpuSub.textContent = `${data.cpu.cores} Cores • Load: ${data.load_average ? data.load_average.join(', ') : 'OK'}`;
          if (cpuPill) {
            cpuPill.textContent = `● ${data.cpu.status}`;
            cpuPill.className = 'clp-cockpit-status' + (cpuPct > 85 ? ' danger' : (cpuPct > 65 ? ' warn' : ''));
          }
        }

        // 2. RAM
        if (data.ram) {
          const ramPct = data.ram.percent;
          updateRadialMeter('clp-radial-ram-circle', 'clp-ram-gauge-val', ramPct);
          const ramSub = document.getElementById('clp-ram-subtext');
          const ramPill = document.getElementById('clp-ram-status-pill');
          if (ramSub) ramSub.textContent = `${data.ram.used_gb} GB / ${data.ram.total_gb} GB (${data.ram.free_gb} GB Free)`;
          if (ramPill) {
            ramPill.textContent = `● ${data.ram.status}`;
            ramPill.className = 'clp-cockpit-status' + (ramPct > 85 ? ' danger' : ' healthy');
          }
        }

        // 3. Storage
        if (data.disk) {
          const diskPct = data.disk.percent;
          updateRadialMeter('clp-radial-disk-circle', 'clp-disk-gauge-val', diskPct);
          const diskSub = document.getElementById('clp-disk-subtext');
          const diskPill = document.getElementById('clp-disk-status-pill');
          if (diskSub) diskSub.textContent = `${data.disk.used_gb} GB / ${data.disk.total_gb} GB (${data.disk.free_gb} GB Free)`;
          if (diskPill) {
            diskPill.textContent = `● ${data.disk.status}`;
            diskPill.className = 'clp-cockpit-status' + (diskPct > 90 ? ' danger' : '');
          }
        }

        // 4. Uptime & Daemons in Hero
        const uptimeEl = document.getElementById('clp-hero-uptime');
        if (uptimeEl && data.uptime) {
          uptimeEl.textContent = `Uptime: ${data.uptime}`;
        }
      })
      .catch(err => {
        // Fallback to Highcharts scraping if API unavailable
        fallbackVitalsFromHighcharts();
      });
  }

  function fallbackVitalsFromHighcharts() {
    if (!window.Highcharts || !window.Highcharts.charts) return;
    window.Highcharts.charts.forEach(chart => {
      if (!chart || !chart.renderTo) return;
      const id = chart.renderTo.id || '';
      const val = extractLatestValue(chart);
      if (val === null) return;

      if (id.includes('cpu') || id.includes('Cpu')) {
        updateRadialMeter('clp-radial-cpu-circle', 'clp-cpu-gauge-val', val);
      } else if (id.includes('memory') || id.includes('Memory')) {
        updateRadialMeter('clp-radial-ram-circle', 'clp-ram-gauge-val', val);
      } else if (id.includes('disk') || id.includes('Disk')) {
        updateRadialMeter('clp-radial-disk-circle', 'clp-disk-gauge-val', val);
      }
    });
  }

  function startLiveVitalsEngine() {
    // Immediate initial call
    fetchAndApplyLiveVitals();

    // Auto-refresh every 3.5 seconds for true real-time dashboard observability
    setInterval(() => {
      if (document.querySelector('.clp-radial-cockpit')) {
        fetchAndApplyLiveVitals();
      }
    }, 3500);

    // Also modernize Highcharts if present
    let hcAttempts = 0;
    const hcInterval = setInterval(() => {
      hcAttempts++;
      if (window.Highcharts && window.Highcharts.charts) {
        window.Highcharts.charts.forEach(c => {
          if (c) modernizeChart(c, getActiveTheme());
        });
      }
      if (hcAttempts >= 12) clearInterval(hcInterval);
    }, 400);
  }

  // Extract latest point from Highcharts series safely
  function extractLatestValue(chart) {
    if (!chart || !chart.series || chart.series.length === 0) return null;
    for (let s = chart.series.length - 1; s >= 0; s--) {
      const series = chart.series[s];
      if (series.yData && series.yData.length > 0) {
        for (let i = series.yData.length - 1; i >= 0; i--) {
          const val = series.yData[i];
          if (typeof val === 'number' && !isNaN(val)) return val;
        }
      }
      if (series.data && series.data.length > 0) {
        for (let i = series.data.length - 1; i >= 0; i--) {
          const pt = series.data[i];
          const val = typeof pt === 'number' ? pt : (pt && typeof pt.y === 'number' ? pt.y : null);
          if (val !== null && !isNaN(val)) return val;
        }
      }
    }
    return null;
  }

  // ==========================================================================
  // 8. Highcharts Modernizer (Smooth AreaSpline & Neon Glow)
  // ==========================================================================
  function setupHighchartsHook() {
    if (!window.Highcharts) return;

    const originalChart = window.Highcharts.chart;
    window.Highcharts.chart = function (renderTo, userOptions, callback) {
      const colors = getThemeColors(getActiveTheme());
      const enhanced = enhanceChartOptions(userOptions, colors);
      return originalChart.call(this, renderTo, enhanced, function (chart) {
        if (callback) callback(chart);
      });
    };
  }

  function modernizeChart(chart, themeId) {
    if (!chart || !chart.series) return;
    const colors = getThemeColors(themeId);

    chart.series.forEach((s, idx) => {
      s.update({
        type: 'areaspline',
        lineColor: colors.primary,
        lineWidth: 2.5,
        fillColor: {
          linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
          stops: [
            [0, colors.gradStart],
            [1, colors.gradEnd]
          ]
        },
        marker: {
          enabled: false,
          states: { hover: { enabled: true, radius: 4, fillColor: colors.primary } }
        }
      }, false);
    });

    chart.redraw();
  }

  function getThemeColors(themeId) {
    const paletteMap = {
      'cyber-cyan': { primary: '#06b6d4', gradStart: 'rgba(6, 182, 212, 0.45)', gradEnd: 'rgba(6, 182, 212, 0.01)' },
      'matrix-green': { primary: '#10b981', gradStart: 'rgba(16, 185, 129, 0.45)', gradEnd: 'rgba(16, 185, 129, 0.01)' },
      'violet-synth': { primary: '#a855f7', gradStart: 'rgba(168, 85, 247, 0.45)', gradEnd: 'rgba(168, 85, 247, 0.01)' },
      'sunset-amber': { primary: '#f59e0b', gradStart: 'rgba(245, 158, 11, 0.45)', gradEnd: 'rgba(245, 158, 11, 0.01)' },
      'crimson-red': { primary: '#ef4444', gradStart: 'rgba(239, 68, 68, 0.45)', gradEnd: 'rgba(239, 68, 68, 0.01)' }
    };

    return paletteMap[themeId] || {
      primary: '#3b82f6',
      gradStart: 'rgba(59, 130, 246, 0.45)',
      gradEnd: 'rgba(59, 130, 246, 0.01)'
    };
  }

  function enhanceChartOptions(opts, colors) {
    opts = opts || {};
    opts.chart = opts.chart || {};
    opts.chart.type = 'areaspline';
    opts.chart.backgroundColor = 'transparent';

    opts.plotOptions = opts.plotOptions || {};
    opts.plotOptions.areaspline = {
      lineWidth: 2.5,
      lineColor: colors.primary,
      fillColor: {
        linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
        stops: [
          [0, colors.gradStart],
          [1, colors.gradEnd]
        ]
      }
    };
    return opts;
  }

  // ==========================================================================
  // 9. Mobile App Bottom Navigation Bar (< 768px)
  // ==========================================================================
  function injectMobileBottomNavigation() {
    if (document.querySelector('.clp-mobile-nav')) return;

    const currentPath = window.location.pathname;
    const isDashboard = currentPath.includes('/dashboard');
    const isSites = currentPath === '/' || currentPath.includes('/site');
    const isServices = currentPath.includes('/services');

    const nav = document.createElement('nav');
    nav.className = 'clp-mobile-nav';

    nav.innerHTML = `
      <a href="/dashboard" class="clp-mobile-nav-item ${isDashboard ? 'active' : ''}">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>
        <span>Dashboard</span>
      </a>
      <a href="/" class="clp-mobile-nav-item ${isSites ? 'active' : ''}">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
        <span>Sites</span>
      </a>
      <a href="/site/new" class="clp-mobile-nav-item clp-mobile-nav-primary">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        <span>Add</span>
      </a>
      <a href="/admin/services" class="clp-mobile-nav-item ${isServices ? 'active' : ''}">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
        <span>Services</span>
      </a>
      <button type="button" class="clp-mobile-nav-item" id="clp-mobile-search-trigger">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
        <span>Search</span>
      </button>
    `;

    document.body.appendChild(nav);

    nav.querySelector('#clp-mobile-search-trigger').addEventListener('click', () => {
      const palette = document.getElementById('clp-command-palette');
      if (palette) {
        palette.classList.add('open');
        document.getElementById('clp-palette-search')?.focus();
      }
    });
  }

  // ==========================================================================
  // 10. Floating Quick Action Dock
  // ==========================================================================
  function injectFloatingQuickDock() {
    if (document.querySelector('.clp-quick-dock')) return;

    const dock = document.createElement('div');
    dock.className = 'clp-quick-dock';

    dock.innerHTML = `
      <button type="button" class="clp-dock-item" id="clp-dock-search" title="Spotlight Command Palette (Ctrl+K)">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
      </button>
      <a href="/site/new" class="clp-dock-item highlight" title="Add New Website">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
      </a>
      <button type="button" class="clp-dock-item" id="clp-dock-top" title="Scroll to Top">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="18 15 12 9 6 15"/></svg>
      </button>
    `;

    document.body.appendChild(dock);

    dock.querySelector('#clp-dock-search').addEventListener('click', () => {
      const palette = document.getElementById('clp-command-palette');
      if (palette) {
        palette.classList.add('open');
        document.getElementById('clp-palette-search')?.focus();
      }
    });

    dock.querySelector('#clp-dock-top').addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

})();
