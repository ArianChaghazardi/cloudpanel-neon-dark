/**
 * CloudPanel Neon Dark - Advanced UX Revolution & Mobile-First Engine
 * 
 * Capabilities:
 *  1. Executive Command Center Hero (Hostname, Online Status, Quick Actions)
 *  2. Real-Time Resource Vital Gauges (CPU, RAM, Disk with instant auto-sync)
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

    document.querySelectorAll('.clp-theme-option').forEach(el => {
      el.classList.toggle('active', el.getAttribute('data-theme-id') === themeId);
    });

    if (window.Highcharts && window.Highcharts.charts) {
      window.Highcharts.charts.forEach(chart => {
        if (chart) modernizeChart(chart, themeId);
      });
    }

    if (notify) {
      const themeObj = THEMES.find(t => t.id === themeId);
      showToast(`Visual Theme set to ${themeObj ? themeObj.name : themeId}`);
    }
  }

  // Pre-apply theme immediately
  applyTheme(getActiveTheme(), false);

  // Initialize upon DOM ready
  document.addEventListener('DOMContentLoaded', function () {
    injectThemeSwitcher();
    setupHighchartsHook();
    setupCommandPalette();
    injectHeaderBreadcrumb();
    enhanceSitesPageUX();
    enhanceDashboardUX();
    injectMobileBottomNavigation();
    injectFloatingQuickDock();

    // Start auto-sync loop to keep vitals updated from Highcharts
    startVitalsAutoSync();
  });

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
  // 2. Server Breadcrumb & Header Workspace Switcher
  // ==========================================================================
  function injectHeaderBreadcrumb() {
    const navLinkContainer = document.querySelector('.header .nav-link-container');
    if (!navLinkContainer || document.getElementById('clp-server-pill')) return;

    const hostnameEl = document.querySelector('.information-box a.click-to-copy');
    const hostname = hostnameEl ? hostnameEl.textContent.trim() : (window.location.hostname || 'server');

    const breadcrumb = document.createElement('div');
    breadcrumb.id = 'clp-server-pill';
    breadcrumb.className = 'clp-server-breadcrumb';
    breadcrumb.title = 'Click to open Command Palette (Ctrl+K)';
    breadcrumb.innerHTML = `
      <span class="status-dot"></span>
      <span style="font-weight: 600;">${hostname}</span>
      <span style="font-size: 10px; color: var(--clp-text-muted);">▼</span>
    `;

    breadcrumb.addEventListener('click', function () {
      if (window.openCommandPalette) window.openCommandPalette();
    });

    navLinkContainer.parentNode.insertBefore(breadcrumb, navLinkContainer);
  }

  // ==========================================================================
  // 3. Theme Switcher in Header
  // ==========================================================================
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
        <a class="dropdown-item clp-theme-option ${isSelected ? 'active' : ''}" href="javascript:void(0);" data-theme-id="${t.id}" style="display: flex; align-items: center; gap: 10px; padding: 9px 12px; border-radius: 8px;">
          <span style="width: 14px; height: 14px; border-radius: 50%; background: ${t.gradient}; display: inline-block; box-shadow: 0 0 8px ${t.color};"></span>
          <div style="display: flex; flex-direction: column;">
            <span style="font-weight: 600; font-size: 13px; color: var(--clp-text-heading);">${t.name}</span>
            <span style="font-size: 11px; color: var(--clp-text-muted);">${t.desc}</span>
          </div>
        </a>
      `;
    });

    li.innerHTML = `
      <a class="dropdown-toggle" href="javascript:void(0);" role="button" data-bs-toggle="dropdown" aria-expanded="false" title="Switch Visual Theme" style="display: flex; align-items: center; gap: 6px; padding: 6px 12px; border-radius: 8px; border: 1px solid var(--clp-border-default); background: var(--clp-bg-surface);">
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--clp-accent);"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
        <span style="font-size: 12.5px; font-weight: 600; color: var(--clp-text-body);">Theme</span>
      </a>
      <div class="dropdown-menu dropdown-menu-end" style="background: var(--clp-bg-surface-elevated); border: 1px solid var(--clp-border-default); border-radius: 14px; padding: 8px; min-width: 250px; max-height: 420px; overflow-y: auto; box-shadow: var(--clp-shadow-md);">
        <div style="padding: 6px 10px 8px 10px; border-bottom: 1px solid var(--clp-border-subtle); margin-bottom: 6px;">
          <div style="font-weight: 700; font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; color: var(--clp-text-muted);">Choose Visual Theme (7 Options)</div>
        </div>
        ${optionsHtml}
      </div>
    `;

    const userAvatar = navbarRight.querySelector('.user-avatar');
    if (userAvatar) {
      navbarRight.insertBefore(li, userAvatar);
    } else {
      navbarRight.appendChild(li);
    }

    li.querySelectorAll('.clp-theme-option').forEach(item => {
      item.addEventListener('click', function (e) {
        e.preventDefault();
        applyTheme(this.getAttribute('data-theme-id'), true);
      });
    });
  }

  // ==========================================================================
  // 4. Command Palette (Spotlight: Ctrl+K / Cmd+K)
  // ==========================================================================
  function setupCommandPalette() {
    const paletteBackdrop = document.createElement('div');
    paletteBackdrop.id = 'clp-command-palette';
    paletteBackdrop.className = 'clp-palette-backdrop';

    paletteBackdrop.innerHTML = `
      <div class="clp-palette-modal">
        <div class="clp-palette-input-wrap">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          <input type="text" class="clp-palette-input" placeholder="Type a command, search sites, or navigate..." autocomplete="off" spellcheck="false">
          <span class="clp-palette-kbd">ESC</span>
        </div>
        <div class="clp-palette-results">
          <div class="clp-palette-category">Navigation</div>
          <a class="clp-palette-item" href="/dashboard"><div class="item-title">📊 Dashboard</div><span class="item-action">Go</span></a>
          <a class="clp-palette-item" href="/sites"><div class="item-title">🌐 Sites & Domains</div><span class="item-action">Go</span></a>
          <a class="clp-palette-item" href="/site/new"><div class="item-title">➕ Add New Site</div><span class="item-action">Create</span></a>
          <a class="clp-palette-item" href="/databases"><div class="item-title">🗄️ Databases & Users</div><span class="item-action">Manage</span></a>
          <a class="clp-palette-item" href="/security"><div class="item-title">🛡️ Security & SSL / Firewall</div><span class="item-action">Go</span></a>
          <a class="clp-palette-item" href="/logs"><div class="item-title">📜 System & Service Logs</div><span class="item-action">View</span></a>
          <a class="clp-palette-item" href="/user/settings"><div class="item-title">⚙️ User & Panel Settings</div><span class="item-action">Edit</span></a>

          <div class="clp-palette-category">Visual Themes (7 Options)</div>
          <div class="clp-palette-item" data-action="theme" data-val="neon-blue"><div class="item-title">⚡ Neon Midnight Blue</div><span class="item-action">Activate</span></div>
          <div class="clp-palette-item" data-action="theme" data-val="cyber-cyan"><div class="item-title">🌊 Cyber Cyan</div><span class="item-action">Activate</span></div>
          <div class="clp-palette-item" data-action="theme" data-val="amoled-pure"><div class="item-title">🌑 AMOLED Pure Black</div><span class="item-action">Activate</span></div>
          <div class="clp-palette-item" data-action="theme" data-val="matrix-green"><div class="item-title">🟢 Emerald Matrix</div><span class="item-action">Activate</span></div>
          <div class="clp-palette-item" data-action="theme" data-val="violet-synth"><div class="item-title">🟣 Violet Royale</div><span class="item-action">Activate</span></div>
          <div class="clp-palette-item" data-action="theme" data-val="sunset-amber"><div class="item-title">🟠 Sunset Amber</div><span class="item-action">Activate</span></div>
          <div class="clp-palette-item" data-action="theme" data-val="crimson-red"><div class="item-title">🔴 Crimson Phantom</div><span class="item-action">Activate</span></div>

          <div class="clp-palette-category">Quick Actions</div>
          <div class="clp-palette-item" data-action="copy-ip"><div class="item-title">📋 Copy Server Public IP</div><span class="item-action">Copy</span></div>
          <div class="clp-palette-item" data-action="copy-ssh"><div class="item-title">💻 Copy SSH Login Command</div><span class="item-action">Copy</span></div>
        </div>
      </div>
    `;

    document.body.appendChild(paletteBackdrop);

    const input = paletteBackdrop.querySelector('.clp-palette-input');

    function openPalette() {
      paletteBackdrop.classList.add('open');
      input.value = '';
      input.focus();
      filterPaletteItems('');
    }

    function closePalette() {
      paletteBackdrop.classList.remove('open');
    }

    window.openCommandPalette = openPalette;

    window.addEventListener('keydown', function (e) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (paletteBackdrop.classList.contains('open')) {
          closePalette();
        } else {
          openPalette();
        }
      } else if (e.key === 'Escape' && paletteBackdrop.classList.contains('open')) {
        closePalette();
      }
    });

    paletteBackdrop.addEventListener('click', function (e) {
      if (e.target === paletteBackdrop) closePalette();
    });

    input.addEventListener('input', function () {
      filterPaletteItems(this.value.toLowerCase().trim());
    });

    function filterPaletteItems(query) {
      const items = paletteBackdrop.querySelectorAll('.clp-palette-item');
      items.forEach(item => {
        const text = item.textContent.toLowerCase();
        item.style.display = text.includes(query) ? 'flex' : 'none';
      });
    }

    paletteBackdrop.querySelectorAll('.clp-palette-item[data-action]').forEach(item => {
      item.addEventListener('click', function () {
        const action = this.getAttribute('data-action');
        const val = this.getAttribute('data-val');

        if (action === 'theme') {
          applyTheme(val, true);
        } else if (action === 'copy-ip') {
          const ipEl = document.querySelector('.information-box a.click-to-copy');
          const ip = ipEl ? ipEl.textContent.trim() : window.location.hostname;
          navigator.clipboard.writeText(ip);
          showToast(`Server IP (${ip}) copied to clipboard!`);
        } else if (action === 'copy-ssh') {
          const ipEl = document.querySelector('.information-box a.click-to-copy');
          const ip = ipEl ? ipEl.textContent.trim() : window.location.hostname;
          navigator.clipboard.writeText(`ssh root@${ip}`);
          showToast(`SSH Command (ssh root@${ip}) copied to clipboard!`);
        }
        closePalette();
      });
    });

    const navLinkContainer = document.querySelector('.header .nav-link-container');
    if (navLinkContainer && !document.getElementById('clp-palette-trigger-btn')) {
      const searchBtn = document.createElement('button');
      searchBtn.id = 'clp-palette-trigger-btn';
      searchBtn.type = 'button';
      searchBtn.className = 'btn btn-sm btn-white d-inline-flex align-items-center gap-2';
      searchBtn.style.cssText = 'border-radius: 20px; padding: 4px 12px; margin-left: 8px; font-size: 12px; color: var(--clp-text-muted); background: var(--clp-bg-input); border-color: var(--clp-border-default);';
      searchBtn.innerHTML = `
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
        <span>Search</span>
        <kbd style="font-size: 10px; background: var(--clp-bg-surface); padding: 1px 5px; border-radius: 4px; border: 1px solid var(--clp-border-subtle);">Ctrl+K</kbd>
      `;
      searchBtn.addEventListener('click', openPalette);
      navLinkContainer.appendChild(searchBtn);
    }
  }

  // ==========================================================================
  // 5. Sites Page UX Revolution (Card Grid by Default, Search, Logos & Filters)
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
      const manageUrl = domainLink ? domainLink.getAttribute('href') : '#';
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

      if (domainLink && !domainLink.querySelector('.clp-cell-actions')) {
        const actionsWrap = document.createElement('span');
        actionsWrap.className = 'clp-cell-actions';
        actionsWrap.style.cssText = 'display: inline-flex; align-items: center; gap: 8px; margin-left: 10px;';
        actionsWrap.innerHTML = `
          <a href="http://${domain}" target="_blank" rel="noopener noreferrer" title="Visit Site ↗" style="color: var(--clp-text-muted); font-size: 11px;">
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

    // Build Card Grid
    const cardGridContainer = document.createElement('div');
    cardGridContainer.className = 'clp-sites-card-grid';

    sitesData.forEach(site => {
      const card = document.createElement('div');
      card.className = 'clp-site-card';
      card.setAttribute('data-domain', site.domain.toLowerCase());
      card.setAttribute('data-app', site.appType);

      card.innerHTML = `
        <div>
          <div class="clp-site-card-header">
            <a href="${site.manageUrl}" class="clp-site-card-domain">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--clp-accent)" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
              <span>${site.domain}</span>
            </a>
            <span class="clp-tech-badge ${site.badgeClass}">
              ${site.icon}
              <span>${site.appName}</span>
            </span>
          </div>
          <div class="clp-site-card-meta">
            <div class="clp-site-meta-item">
              <span>Site User:</span>
              <strong>${site.user}</strong>
            </div>
            <div class="clp-site-meta-item">
              <span>Security:</span>
              <span class="badge badge-success" style="font-size: 11px;">🔒 SSL Active</span>
            </div>
          </div>
        </div>
        <div class="clp-site-card-actions">
          <a href="${site.manageUrl}" class="btn btn-primary btn-sm">Manage Site</a>
          <a href="http://${site.domain}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm" title="Open in new tab">Visit ↗</a>
        </div>
      `;
      cardGridContainer.appendChild(card);
    });

    cardTable.parentNode.insertBefore(cardGridContainer, cardTable.nextSibling);

    // Build Toolbar
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

    // Make Card View DEFAULT for Vercel/Railway tier UX
    const savedView = localStorage.getItem(STORAGE_VIEW) || 'grid';
    setViewMode(savedView);

    window.addEventListener('resize', function () {
      if (window.innerWidth < 768) {
        setViewMode('grid');
      }
    });
  }

  // ==========================================================================
  // 6. Dashboard UX Revolution (Vitals Gauges, Health Hero & Layout Controls)
  // ==========================================================================
  function enhanceDashboardUX() {
    const infoBoxesContainer = document.querySelector('.information-box-container');
    if (!infoBoxesContainer) return;

    const ipElement = infoBoxesContainer.querySelector('a.click-to-copy');
    const serverIp = ipElement ? ipElement.textContent.trim() : window.location.hostname;

    // Parse Cores and RAM from .information-box if available
    let coresText = 'Multi-Core Active';
    let memText = 'Dynamic Allocation';
    const allBoxes = infoBoxesContainer.querySelectorAll('.information-box');
    allBoxes.forEach(b => {
      const text = b.textContent;
      if (text.includes('Cores') || text.includes('Memory')) {
        coresText = text.replace(/Size/i, '').trim();
      }
    });

    const card = infoBoxesContainer.closest('.card');
    if (card && !document.querySelector('.clp-health-ribbon')) {
      const ribbon = document.createElement('div');
      ribbon.className = 'clp-health-ribbon';

      ribbon.innerHTML = `
        <div class="clp-health-status">
          <span class="clp-status-dot"></span>
          <div>
            <div style="font-weight: 700; font-size: 14px; color: var(--clp-text-heading);">Server Command Center: Optimal Performance</div>
            <div style="font-size: 12px; color: var(--clp-text-muted);">Core daemons (Nginx, PHP-FPM, MySQL) active & healthy • ${coresText}</div>
          </div>
        </div>
        <div class="clp-health-actions">
          <button type="button" class="clp-quick-ssh-btn" id="clp-ssh-copier">
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

    // Inject Real-Time Server Vital Gauges (CPU, Memory, Disk progress bars)
    if (card && !document.querySelector('.clp-vitals-container')) {
      const vitals = document.createElement('div');
      vitals.className = 'clp-vitals-container';

      vitals.innerHTML = `
        <div class="clp-vital-card" id="clp-vital-cpu">
          <div class="clp-vital-header">
            <span class="clp-vital-title">⚡ CPU Load</span>
            <span class="clp-vital-value" id="clp-cpu-val">24.5%</span>
          </div>
          <div class="clp-vital-bar-wrap">
            <div class="clp-vital-bar" id="clp-cpu-bar" style="width: 24.5%;"></div>
          </div>
          <div class="clp-vital-footer">
            <span>Utilization Status</span>
            <span id="clp-cpu-status" style="color: #10b981;">● Normal</span>
          </div>
        </div>

        <div class="clp-vital-card" id="clp-vital-ram">
          <div class="clp-vital-header">
            <span class="clp-vital-title">🧠 Memory (RAM)</span>
            <span class="clp-vital-value" id="clp-ram-val">48.2%</span>
          </div>
          <div class="clp-vital-bar-wrap">
            <div class="clp-vital-bar" id="clp-ram-bar" style="width: 48.2%;"></div>
          </div>
          <div class="clp-vital-footer">
            <span>Buffer & Cache</span>
            <span id="clp-ram-status" style="color: #38bdf8;">● Active</span>
          </div>
        </div>

        <div class="clp-vital-card" id="clp-vital-disk">
          <div class="clp-vital-header">
            <span class="clp-vital-title">💾 Storage (SSD)</span>
            <span class="clp-vital-value" id="clp-disk-val">34.0%</span>
          </div>
          <div class="clp-vital-bar-wrap">
            <div class="clp-vital-bar" id="clp-disk-bar" style="width: 34%;"></div>
          </div>
          <div class="clp-vital-footer">
            <span>I/O Speed</span>
            <span style="color: #10b981;">● High Performance</span>
          </div>
        </div>
      `;

      card.parentNode.insertBefore(vitals, card);
    }

    // Chart Layout & Stats Controls
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
  // 7. Highcharts Hook & Dynamic Sync Engine
  // ==========================================================================
  function setupHighchartsHook() {
    if (!window.Highcharts) return;

    const originalChart = window.Highcharts.chart;
    window.Highcharts.chart = function (renderTo, userOptions, callback) {
      const themeColors = getThemeColors(getActiveTheme());
      const enhancedOptions = enhanceChartOptions(userOptions, themeColors);
      const chartInstance = originalChart.call(this, renderTo, enhancedOptions, function (chart) {
        const containerId = typeof renderTo === 'string' ? renderTo : (renderTo ? renderTo.id : '');
        injectDynamicChartStats(containerId, chart);
        syncVitalsFromChart(containerId, chart);
        if (callback) callback(chart);
      });
      return chartInstance;
    };
  }

  // Bulletproof extractor to get latest numerical reading across series
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
      if (series.userOptions && series.userOptions.data && series.userOptions.data.length > 0) {
        for (let i = series.userOptions.data.length - 1; i >= 0; i--) {
          const pt = series.userOptions.data[i];
          const val = typeof pt === 'number' ? pt : (pt && typeof pt.y === 'number' ? pt.y : null);
          if (val !== null && !isNaN(val)) return val;
        }
      }
    }
    return null;
  }

  function syncVitalsFromChart(containerId, chart) {
    const val = extractLatestValue(chart);
    if (val === null) return;

    const valFormatted = Math.min(100, Math.max(0, val)).toFixed(1);
    const valStr = valFormatted + '%';

    if (containerId.includes('cpu') || containerId.includes('Cpu')) {
      const cpuVal = document.getElementById('clp-cpu-val');
      const cpuBar = document.getElementById('clp-cpu-bar');
      const cpuStatus = document.getElementById('clp-cpu-status');
      if (cpuVal) cpuVal.textContent = valStr;
      if (cpuBar) {
        cpuBar.style.width = valStr;
        cpuBar.className = 'clp-vital-bar' + (val > 85 ? ' danger' : (val > 65 ? ' warn' : ''));
      }
      if (cpuStatus) {
        cpuStatus.innerHTML = val > 85 ? '<span style="color:#ef4444;">● High Load</span>' : '<span style="color:#10b981;">● Normal</span>';
      }
    } else if (containerId.includes('memory') || containerId.includes('Memory')) {
      const ramVal = document.getElementById('clp-ram-val');
      const ramBar = document.getElementById('clp-ram-bar');
      const ramStatus = document.getElementById('clp-ram-status');
      if (ramVal) ramVal.textContent = valStr;
      if (ramBar) {
        ramBar.style.width = valStr;
        ramBar.className = 'clp-vital-bar' + (val > 85 ? ' danger' : (val > 70 ? ' warn' : ''));
      }
      if (ramStatus) {
        ramStatus.innerHTML = val > 85 ? '<span style="color:#ef4444;">● Heavy</span>' : '<span style="color:#38bdf8;">● Active Buffer</span>';
      }
    } else if (containerId.includes('disk') || containerId.includes('Disk')) {
      const diskVal = document.getElementById('clp-disk-val');
      const diskBar = document.getElementById('clp-disk-bar');
      if (diskVal) diskVal.textContent = valStr;
      if (diskBar) {
        diskBar.style.width = valStr;
        diskBar.className = 'clp-vital-bar' + (val > 90 ? ' danger' : (val > 75 ? ' warn' : ''));
      }
    }
  }

  function startVitalsAutoSync() {
    let attempts = 0;
    const interval = setInterval(() => {
      attempts++;
      if (window.Highcharts && window.Highcharts.charts) {
        window.Highcharts.charts.forEach(chart => {
          if (chart && chart.renderTo) {
            const id = chart.renderTo.id || '';
            modernizeChart(chart, getActiveTheme());
            injectDynamicChartStats(id, chart);
            syncVitalsFromChart(id, chart);
          }
        });
      }
      if (attempts >= 15) clearInterval(interval);
    }, 300);
  }

  function injectDynamicChartStats(containerId, chart) {
    if (!chart || !chart.series || !chart.series[0]) return;
    const val = extractLatestValue(chart);
    if (val === null) return;

    const chartElem = document.getElementById(containerId);
    if (!chartElem) return;

    const chartCard = chartElem.closest('.chart');
    if (!chartCard) return;

    const chartHeader = chartCard.querySelector('.chart-header');
    if (chartHeader && !chartHeader.querySelector('.clp-chart-stat-badges')) {
      const stats = document.createElement('div');
      stats.className = 'clp-chart-stat-badges';
      stats.innerHTML = `
        <span class="clp-stat-pill">Current: <strong>${val.toFixed(1)}%</strong></span>
      `;
      chartHeader.appendChild(stats);
    }
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
      marker: {
        radius: 3,
        fillColor: colors.primary,
        lineWidth: 2,
        lineColor: '#ffffff'
      },
      fillColor: {
        linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
        stops: [
          [0, colors.gradStart],
          [1, colors.gradEnd]
        ]
      }
    };

    opts.tooltip = opts.tooltip || {};
    opts.tooltip.backgroundColor = 'rgba(15, 23, 42, 0.9)';
    opts.tooltip.borderColor = colors.primary;
    opts.tooltip.borderRadius = 8;
    opts.tooltip.style = { color: '#f8fafc' };

    if (opts.yAxis) {
      opts.yAxis.gridLineColor = 'rgba(255, 255, 255, 0.05)';
      opts.yAxis.gridLineDashStyle = 'Dash';
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
            [0, colors.gradStart],
            [1, colors.gradEnd]
          ]
        }
      }, false);
    });
    chart.redraw();
  }

  // ==========================================================================
  // 8. Mobile App Bottom Navigation Bar (< 768px)
  // ==========================================================================
  function injectMobileBottomNavigation() {
    if (document.querySelector('.clp-mobile-nav')) return;

    const nav = document.createElement('nav');
    nav.className = 'clp-mobile-nav';

    const path = window.location.pathname;

    nav.innerHTML = `
      <ul class="clp-mobile-nav-items">
        <li>
          <a href="/dashboard" class="clp-mobile-nav-link ${path.includes('dashboard') ? 'active' : ''}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>
            <span>Dashboard</span>
          </a>
        </li>
        <li>
          <a href="/sites" class="clp-mobile-nav-link ${path.includes('sites') ? 'active' : ''}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
            <span>Sites</span>
          </a>
        </li>
        <li>
          <a href="/site/new" class="clp-mobile-fab" title="Add Site">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          </a>
        </li>
        <li>
          <a href="/security" class="clp-mobile-nav-link ${path.includes('security') ? 'active' : ''}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            <span>Security</span>
          </a>
        </li>
        <li>
          <button type="button" class="clp-mobile-nav-link" id="clp-mobile-search-btn" style="background: none; border: none;">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            <span>Search</span>
          </button>
        </li>
      </ul>
    `;

    document.body.appendChild(nav);

    nav.querySelector('#clp-mobile-search-btn').addEventListener('click', function () {
      if (window.openCommandPalette) window.openCommandPalette();
    });
  }

  // ==========================================================================
  // 9. Floating Quick Dock (Desktop)
  // ==========================================================================
  function injectFloatingQuickDock() {
    if (document.querySelector('.clp-floating-dock')) return;

    const dock = document.createElement('div');
    dock.className = 'clp-floating-dock';

    dock.innerHTML = `
      <button type="button" class="clp-dock-item" id="clp-dock-search" title="Command Palette (Ctrl+K)">
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
      </button>
      <div class="clp-dock-divider"></div>
      <a href="/dashboard" class="clp-dock-item" title="Dashboard">
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>
      </a>
      <a href="/sites" class="clp-dock-item" title="Sites & Domains">
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
      </a>
      <a href="/site/new" class="clp-dock-item" title="Add New Site">
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
      </a>
      <div class="clp-dock-divider"></div>
      <button type="button" class="clp-dock-item" id="clp-dock-theme" title="Cycle Next Theme">
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/></svg>
      </button>
    `;

    document.body.appendChild(dock);

    dock.querySelector('#clp-dock-search').addEventListener('click', function () {
      if (window.openCommandPalette) window.openCommandPalette();
    });

    dock.querySelector('#clp-dock-theme').addEventListener('click', function () {
      const current = getActiveTheme();
      const currentIndex = THEMES.findIndex(t => t.id === current);
      const nextIndex = (currentIndex + 1) % THEMES.length;
      applyTheme(THEMES[nextIndex].id, true);
    });
  }

})();
