/**
 * MOTEUR APPLICATIF - COLLECTION TRIMOBE & UMSP
 * Thérapeutique Clinique & Gériatrie 2026
 */

// Helper d'échappement sécurisé conforme aux invariants
function escHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Utilitaire de normalisation des chaînes pour recherche insensible aux accents et à la casse
function normalizeStr(str) {
  return String(str == null ? '' : str)
    .replace(/[œŒ]/g, 'oe').replace(/[æÆ]/g, 'ae')
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .toLowerCase().trim();
}

// Nettoyage et formatage des formules mathématiques/LaTeX
function formatMathFormula(str) {
  if (!str) return '';
  return str
    .replace(/\\text\{([^}]+)\}/g, '$1')
    .replace(/\\mathbf\{([^}]+)\}/g, '<strong>$1</strong>')
    .replace(/\\times/g, '×')
    .replace(/\\approx/g, '≈')
    .replace(/\\longrightarrow/g, '➔')
    .replace(/\\rightarrow/g, '➔')
    .replace(/\\,/g, ' ');
}

// Parseur de tableaux Markdown en tables HTML médicales
function parseMarkdownTables(text) {
  const lines = text.split('\n');
  let inTable = false;
  let tableLines = [];
  const result = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.startsWith('|') && line.endsWith('|')) {
      inTable = true;
      tableLines.push(line);
    } else {
      if (inTable) {
        result.push(renderTableBlock(tableLines));
        tableLines = [];
        inTable = false;
      }
      result.push(lines[i]);
    }
  }
  if (inTable) {
    result.push(renderTableBlock(tableLines));
  }
  return result.join('\n');
}

function renderTableBlock(lines) {
  if (lines.length < 2) return lines.join('\n');
  const parseRow = (line) => line.slice(1, -1).split('|').map(c => c.trim());
  const headers = parseRow(lines[0]);
  let startIndex = 1;
  if (lines.length > 1 && /^[\s|:-]+$/.test(lines[1])) {
    startIndex = 2;
  }

  let tableHtml = '<div class="table-responsive-wrapper"><table class="clinical-table"><thead><tr>';
  headers.forEach(h => {
    tableHtml += `<th>${h}</th>`;
  });
  tableHtml += '</tr></thead><tbody>';

  for (let i = startIndex; i < lines.length; i++) {
    const cells = parseRow(lines[i]);
    tableHtml += '<tr>';
    cells.forEach(cell => {
      tableHtml += `<td>${cell || ''}</td>`;
    });
    tableHtml += '</tr>';
  }
  tableHtml += '</tbody></table></div>';
  return tableHtml;
}

// Parseur de listes Markdown (ordonnées, non-ordonnées et sous-puces imbriquées)
function parseMarkdownLists(text) {
  const lines = text.split('\n');
  const result = [];
  let currentList = null;

  function flushList() {
    if (!currentList) return;
    const tag = currentList.type === 'ol' ? 'ol' : 'ul';
    const clsAttr = currentList.type === 'ol' ? ' class="clinical-ordered-list"' : '';
    let listHtml = `\n\n<${tag}${clsAttr}>\n`;
    for (const item of currentList.items) {
      if (item.subItems && item.subItems.length > 0) {
        const subHtml = `\n<ul>\n${item.subItems.map(s => `  <li>${s}</li>`).join('\n')}\n</ul>\n`;
        listHtml += `<li>${item.text}${subHtml}</li>\n`;
      } else {
        listHtml += `<li>${item.text}</li>\n`;
      }
    }
    listHtml += `</${tag}>\n\n`;
    result.push(listHtml);
    currentList = null;
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const olMatch = line.match(/^(\d+)\.\s+(.*$)/);
    const ulTopMatch = line.match(/^[•\-\*]\s+(.*$)/);
    const ulSubMatch = line.match(/^\s{2,}[•\-\*]\s+(.*$)/);

    if (ulSubMatch) {
      if (currentList && currentList.items.length > 0) {
        const lastItem = currentList.items[currentList.items.length - 1];
        lastItem.subItems = lastItem.subItems || [];
        lastItem.subItems.push(ulSubMatch[1]);
      } else {
        if (!currentList || currentList.type !== 'ul') {
          flushList();
          currentList = { type: 'ul', items: [] };
        }
        currentList.items.push({ text: ulSubMatch[1] });
      }
    } else if (olMatch) {
      if (!currentList || currentList.type !== 'ol') {
        flushList();
        currentList = { type: 'ol', items: [] };
      }
      currentList.items.push({ text: olMatch[2] });
    } else if (ulTopMatch) {
      if (!currentList || currentList.type !== 'ul') {
        flushList();
        currentList = { type: 'ul', items: [] };
      }
      currentList.items.push({ text: ulTopMatch[1] });
    } else {
      if (line.trim() !== '' || (currentList && lines[i + 1] && !/^\s*(\d+\.|[•\-\*])\s/.test(lines[i + 1]))) {
        flushList();
      }
      result.push(line);
    }
  }
  flushList();
  return result.join('\n');
}

// Convertisseur Markdown léger, sécurisé et cliniquement formaté en HTML
function renderMarkdown(md) {
  if (!md) return '';
  let html = escHtml(md);

  // Mathématique inline / display
  html = html.replace(/\$\$(.+?)\$\$/gs, (match, p1) => {
    return `\n\n<div class="math-display">📐 ${formatMathFormula(p1).trim()}</div>\n\n`;
  });
  html = html.replace(/\$(.+?)\$/g, (match, p1) => {
    return `<span class="math-inline">${formatMathFormula(p1).trim()}</span>`;
  });

  // Titres ###, ## et #
  html = html.replace(/^### (.*$)/gim, '\n\n<h3>$1</h3>\n\n');
  html = html.replace(/^## (.*$)/gim, '\n\n<h2>$1</h2>\n\n');
  html = html.replace(/^# (.*$)/gim, '\n\n<h2>$1</h2>\n\n');

  // Séparateurs de section horizontaux (---)
  html = html.replace(/^\s*---+\s*$/gim, '\n\n<hr class="section-divider">\n\n');

  // Badges AWaRe OMS
  html = html.replace(/\[(ACCESS[^\]]*)\]/g, '<span class="badge-aware badge-access">$1</span>');
  html = html.replace(/\[(WATCH[^\]]*)\]/g, '<span class="badge-aware badge-watch">$1</span>');
  html = html.replace(/\[(RESERVE[^\]]*)\]/g, '<span class="badge-aware badge-reserve">$1</span>');

  // Alertes et Blockquotes (après escHtml, le symbole > est devenu &gt;)
  html = html.replace(/^(&gt;|>)\s*(.*$)/gim, '<blockquote>$2</blockquote>');
  html = html.replace(/<\/blockquote>\s*<blockquote>/gim, '<br>');
  html = html.replace(/(<blockquote>[\s\S]*?<\/blockquote>)/gim, '\n\n$1\n\n');

  // Gras, Italique et Code inline
  html = html.replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>');
  html = html.replace(/\*(.*?)\*/gim, '<em>$1</em>');
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

  // Tableaux Markdown
  html = parseMarkdownTables(html);

  // Listes ordonnées et listes à puces (avec gestion des sous-puces indentées)
  html = parseMarkdownLists(html);

  // Retours à la ligne doubles en paragraphes
  const parts = html.split(/\n\n+/);
  html = parts.map(p => {
    p = p.trim();
    if (!p) return '';
    if (
      p.startsWith('<h') ||
      p.startsWith('<ul') ||
      p.startsWith('<ol') ||
      p.startsWith('<blockquote') ||
      p.startsWith('<div') ||
      p.startsWith('<hr') ||
      p.startsWith('<table')
    ) {
      return p;
    }
    return `<p>${p.replace(/\n/g, '<br>')}</p>`;
  }).join('');

  return html;
}



// État global de l'application
// Storage en mémoire de secours (fallback en cas de SecurityError ou QuotaExceededError)
const memoryStore = {};

function safeStorageGet(key) {
  try {
    if (typeof localStorage !== 'undefined') {
      const val = localStorage.getItem(key);
      if (val !== null) return val;
    }
  } catch (e) {
    // Mode navigation privée ou iframe sandbox sans permissions de stockage
  }
  return Object.prototype.hasOwnProperty.call(memoryStore, key) ? memoryStore[key] : null;
}

function safeStorageSet(key, value) {
  const str = String(value);
  memoryStore[key] = str;
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(key, str);
    }
  } catch (e) {
    // QuotaExceededError ou SecurityError - l'état persiste en mémoire
  }
}

function safeStorageGetJSON(key, fallback) {
  const val = safeStorageGet(key);
  if (!val) return fallback;
  try {
    return JSON.parse(val);
  } catch (e) {
    console.warn(`[TRIMOBE] Données corrompues pour ${key}, réinitialisation.`);
    return fallback;
  }
}

function safeStorageSetJSON(key, value) {
  try {
    safeStorageSet(key, JSON.stringify(value));
  } catch (e) {
    console.warn(`[TRIMOBE] Erreur sérialisation pour ${key}:`, e);
  }
}

const AppState = {
  currentManual: 'general', // 'general', 'geriatrie'
  currentView: 'home',      // 'home', 'chapter', 'fiche', 'drugs', 'calculators', 'checklist', 'urgences', 'favorites', 'references'
  activeItemId: null,
  theme: safeStorageGet('trimobe_theme') || 'light',
  fontSizeIdx: (() => {
    const idx = parseInt(safeStorageGet('trimobe_fontsize') || '1', 10);
    return (!isNaN(idx) && idx >= 0 && idx < 3) ? idx : 1;
  })(),
  favorites: safeStorageGetJSON('trimobe_favorites', []),
  checklistState: safeStorageGetJSON('trimobe_checklist', {}),
  searchFilter: ''
};

if (typeof window !== 'undefined') {
  window.AppState = AppState;
}

// Tailles de police supportées
const FONT_SIZES = ['15px', '16.5px', '18.5px'];

// Initialisation au chargement du DOM (guard isomorphe pour tests Node.js)
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initFontSize();
    initEventHandlers();
    renderSidebarNav();
    renderView('home');
  });
}

/* ==========================================================================
   GESTION DU THÈME & TYPOGRAPHIE
   ========================================================================== */
function initTheme() {
  document.documentElement.setAttribute('data-theme', AppState.theme);
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  if (themeToggleBtn) {
    themeToggleBtn.textContent = AppState.theme === 'dark' ? '☀️' : '🌙';
    themeToggleBtn.setAttribute('aria-label', AppState.theme === 'dark' ? 'Passer au mode clair' : 'Passer au mode sombre');
    themeToggleBtn.setAttribute('title', AppState.theme === 'dark' ? 'Passer au mode clair' : 'Passer au mode sombre');
  }
  const metaTheme = document.querySelector('meta[name="theme-color"]');
  if (metaTheme) {
    metaTheme.setAttribute('content', AppState.theme === 'dark' ? '#090d16' : '#0284c7');
  }
}

function toggleTheme() {
  AppState.theme = AppState.theme === 'dark' ? 'light' : 'dark';
  safeStorageSet('trimobe_theme', AppState.theme);
  initTheme();
}

function initFontSize() {
  if (document.documentElement && document.documentElement.style) {
    if (typeof document.documentElement.style.setProperty === 'function') {
      document.documentElement.style.setProperty('--content-font-size', FONT_SIZES[AppState.fontSizeIdx]);
    } else {
      document.documentElement.style['--content-font-size'] = FONT_SIZES[AppState.fontSizeIdx];
    }
  }
}

function adjustFontSize(delta) {
  let newIdx = AppState.fontSizeIdx + delta;
  if (newIdx >= 0 && newIdx < FONT_SIZES.length) {
    AppState.fontSizeIdx = newIdx;
    safeStorageSet('trimobe_fontsize', newIdx);
    initFontSize();
  }
}

// Gestion du tiroir latéral mobile et du voile d'arrière-plan (backdrop)
function toggleSidebar(forceOpen) {
  const sidebar = document.getElementById('sidebar');
  if (!sidebar) return;

  let backdrop = document.getElementById('sidebarBackdrop');
  if (!backdrop) {
    backdrop = document.createElement('div');
    backdrop.id = 'sidebarBackdrop';
    backdrop.className = 'sidebar-backdrop';
    backdrop.setAttribute('aria-hidden', 'true');
    if (sidebar.parentNode) {
      sidebar.parentNode.insertBefore(backdrop, sidebar.nextSibling);
    } else if (document.body) {
      document.body.appendChild(backdrop);
    }
    backdrop.addEventListener('click', () => toggleSidebar(false));
  }

  const mobileBtn = document.getElementById('mobileMenuBtn');
  const isOpen = typeof forceOpen === 'boolean' ? forceOpen : !sidebar.classList.contains('open');

  sidebar.classList.toggle('open', isOpen);
  backdrop.classList.toggle('active', isOpen);

  if (mobileBtn) {
    mobileBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    mobileBtn.innerHTML = isOpen ? '✕' : '☰';
    mobileBtn.setAttribute('title', isOpen ? 'Fermer le menu' : 'Ouvrir le menu');
  }

  if (document.body && document.body.classList) {
    document.body.classList.toggle('sidebar-drawer-open', isOpen);
  }
}

// Sécurise l'encapsulation de tout tableau dans un conteneur défilant horizontalement
function ensureResponsiveTables(container) {
  if (!container || typeof container.querySelectorAll !== 'function') return;
  const tables = container.querySelectorAll('table');
  tables.forEach(table => {
    if (table.parentElement && !table.parentElement.classList.contains('table-responsive-wrapper') && !table.parentElement.classList.contains('table-responsive')) {
      const wrapper = document.createElement('div');
      wrapper.className = 'table-responsive-wrapper';
      if (table.parentNode) {
        table.parentNode.insertBefore(wrapper, table);
        wrapper.appendChild(table);
      }
    }
  });
}

/* ==========================================================================
   ROUTAGE ET GESTION DES CLICS
   ========================================================================== */
function setManual(manualId) {
  AppState.currentManual = manualId;
  AppState.searchFilter = '';
  document.querySelectorAll('.manual-selector-tabs .tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.manual === manualId);
  });
  renderSidebarNav();
  renderView('home');
}

function renderView(viewName, itemId = null) {
  AppState.currentView = viewName;
  AppState.activeItemId = itemId;

  // Mise à jour du fil d'Ariane
  updateBreadcrumbs();

  // Mise à jour de la classe active dans la sidebar
  document.querySelectorAll('.nav-item-link').forEach(link => {
    link.classList.toggle('active', link.dataset.id === String(itemId));
  });

  const stage = document.getElementById('contentStage');
  if (!stage) return;
  stage.innerHTML = '';

  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Fermer la sidebar et le backdrop sur mobile après sélection
  toggleSidebar(false);

  switch (viewName) {
    case 'home':
      stage.appendChild(renderHomeView());
      break;
    case 'chapter':
      stage.appendChild(renderChapterView(itemId));
      break;
    case 'fiche':
      stage.appendChild(renderFicheView(itemId));
      break;
    case 'drugs':
      stage.appendChild(renderDrugsView());
      break;
    case 'calculators':
      stage.appendChild(renderCalculatorsView());
      break;
    case 'checklist':
      stage.appendChild(renderChecklistView());
      break;
    case 'urgences':
      stage.appendChild(renderUrgencesView());
      break;
    case 'favorites':
      stage.appendChild(renderFavoritesView());
      break;
    case 'references':
      stage.appendChild(renderReferencesView());
      break;
    default:
      stage.appendChild(renderHomeView());
  }

  // Sécuriser l'encapsulation de tout tableau dans un conteneur défilant horizontalement (post-montage)
  ensureResponsiveTables(stage);
}

function updateBreadcrumbs() {
  const bcContainer = document.getElementById('navBreadcrumbs');
  if (!bcContainer) return;

  let manualLabel = AppState.currentManual === 'general' ? 'Médecine Générale' : 'Gériatrie';
  let viewLabel = 'Accueil';

  if (AppState.currentView === 'chapter') {
    const ch = GENERAL_MANUAL_DATA.chapters.find(c => c.num === AppState.activeItemId);
    viewLabel = ch ? `Chapitre ${ch.num}. ${ch.title}` : 'Chapitre';
  } else if (AppState.currentView === 'fiche') {
    const f = GERIATRIE_MANUAL_DATA.fiches.find(fi => fi.num === AppState.activeItemId);
    viewLabel = f ? `Fiche ${f.num}. ${f.title}` : 'Fiche';
  } else if (AppState.currentView === 'drugs') {
    viewLabel = 'Répertoire des DCI';
  } else if (AppState.currentView === 'calculators') {
    viewLabel = 'Calculateurs Cliniques';
  } else if (AppState.currentView === 'checklist') {
    viewLabel = 'Check-list de Prescription';
  } else if (AppState.currentView === 'urgences') {
    viewLabel = 'Urgences & Signes de Gravité';
  } else if (AppState.currentView === 'favorites') {
    viewLabel = 'Mes Favoris';
  } else if (AppState.currentView === 'references') {
    viewLabel = 'Comités & Références';
  }

  bcContainer.innerHTML = `
    <span>${escHtml(manualLabel)}</span>
    <span>/</span>
    <span class="current">${escHtml(viewLabel)}</span>
  `;
}

/* ==========================================================================
   RENDU DE LA NAVIGATION LATÉRALE (SIDEBAR)
   ========================================================================== */
function renderSidebarNav() {
  const navContainer = document.getElementById('sidebarNavList');
  if (!navContainer) return;
  navContainer.innerHTML = '';

  const rawQuery = AppState.searchFilter || '';
  const query = normalizeStr(rawQuery);
  const sQuery = query.replace(/[^a-z0-9]/g, '');

  if (AppState.currentManual === 'general') {
    // Rendu par catégories du manuel général
    GENERAL_MANUAL_DATA.categories.forEach(cat => {
      const chapters = GENERAL_MANUAL_DATA.chapters.filter(ch => {
        const matchesCat = ch.category === cat.id;
        if (!query) return matchesCat;
        const normTitle = normalizeStr(ch.title);
        const normNum = normalizeStr(ch.num);
        const normSummary = normalizeStr(ch.summary);
        return matchesCat && (
          normTitle.includes(query) ||
          normNum.includes(query) ||
          normSummary.includes(query) ||
          (sQuery.length >= 3 && normTitle.replace(/[^a-z0-9]/g, '').includes(sQuery))
        );
      });

      if (chapters.length > 0) {
        const catTitle = document.createElement('div');
        catTitle.className = 'sidebar-section-title';
        catTitle.innerHTML = `${cat.icon} ${escHtml(cat.label)}`;
        navContainer.appendChild(catTitle);

        chapters.forEach(ch => {
          const item = document.createElement('a');
          item.className = 'nav-item-link';
          item.dataset.id = ch.num;
          item.onclick = () => renderView('chapter', ch.num);

          item.innerHTML = `
            <span class="nav-item-num">${escHtml(ch.num)}</span>
            <span style="flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${escHtml(ch.title)}</span>
            ${ch.isUrgent ? '<span class="nav-item-badge urgent-badge">URG</span>' : ''}
          `;
          navContainer.appendChild(item);
        });
      }
    });
  } else {
    // Rendu par Registres du manuel de gériatrie
    GERIATRIE_MANUAL_DATA.registres.forEach(reg => {
      const fiches = GERIATRIE_MANUAL_DATA.fiches.filter(f => {
        const matchesReg = f.registreId === reg.id;
        if (!query) return matchesReg;
        const normTitle = normalizeStr(f.title);
        const normNum = String(f.num);
        const normSummary = normalizeStr(f.summary);
        return matchesReg && (
          normTitle.includes(query) ||
          normNum.includes(query) ||
          normSummary.includes(query) ||
          (sQuery.length >= 3 && normTitle.replace(/[^a-z0-9]/g, '').includes(sQuery))
        );
      });

      if (fiches.length > 0) {
        const regTitle = document.createElement('div');
        regTitle.className = 'sidebar-section-title';
        regTitle.innerHTML = `${reg.icon} ${escHtml(reg.title)}`;
        navContainer.appendChild(regTitle);

        fiches.forEach(f => {
          const item = document.createElement('a');
          item.className = 'nav-item-link';
          item.dataset.id = String(f.num);
          item.onclick = () => renderView('fiche', f.num);

          item.innerHTML = `
            <span class="nav-item-num">F.${escHtml(f.num)}</span>
            <span style="flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${escHtml(f.title)}</span>
            ${f.isUrgent ? '<span class="nav-item-badge urgent-badge">URG</span>' : ''}
          `;
          navContainer.appendChild(item);
        });
      }
    });
  }
}

/* ==========================================================================
   VUE ACCUEIL (HERO + VUE D'ENSEMBLE)
   ========================================================================== */
function renderHomeView() {
  const container = document.createElement('div');

  const isGen = AppState.currentManual === 'general';
  const data = isGen ? GENERAL_MANUAL_DATA : GERIATRIE_MANUAL_DATA;

  const hero = document.createElement('div');
  hero.className = 'manual-hero-card';
  hero.innerHTML = `
    <div class="hero-badge-pill">
      <span>🛡️</span> ${escHtml(data.badge)} • ${escHtml(data.edition)}
    </div>
    <h1 class="hero-title">${escHtml(data.title)}</h1>
    <p class="hero-subtitle">${escHtml(data.subtitle)}</p>

    <div class="hero-meta-grid">
      <div class="hero-meta-item">
        <strong>Direction & Coordination</strong>
        ${isGen ? escHtml(data.scientificCoordination) : escHtml(data.scientificCoordination) + ' (Dir: ' + escHtml(data.organizations[0].president) + ')'}
      </div>
      <div class="hero-meta-item">
        <strong>Éditeurs & Partenaires</strong>
        ${data.organizations.map(o => `${escHtml(o.name)}`).join(' & ')}
      </div>
      <div class="hero-meta-item">
        <strong>Accès Rapide</strong>
        ${isGen ? '51 Chapitres Thérapeutiques' : '33 Fiches Gériatriques & 3 Registres'}
      </div>
    </div>
  `;
  container.appendChild(hero);

  // Avertissement légal
  const warnCard = document.createElement('div');
  warnCard.className = 'medical-card';
  warnCard.innerHTML = `
    <div class="card-header-bar">
      <span class="card-tag">Avertissement Médico-Légal</span>
    </div>
    <div class="card-content-body">
      ${renderMarkdown(isGen ? GENERAL_MANUAL_DATA.warning : GERIATRIE_MANUAL_DATA.avertissement)}
    </div>
  `;
  container.appendChild(warnCard);

  // Préface / Principes card
  if (isGen && GENERAL_MANUAL_DATA.preface) {
    const prefaceCard = document.createElement('div');
    prefaceCard.className = 'medical-card';
    prefaceCard.innerHTML = `
      <div class="card-header-bar">
        <span class="card-tag">Préface & Démarche Thérapeutique</span>
      </div>
      <div class="card-content-body">
        ${renderMarkdown(GENERAL_MANUAL_DATA.preface)}
      </div>
    `;
    container.appendChild(prefaceCard);
  }

  // Grille des raccourcis
  const quickAccess = document.createElement('div');
  quickAccess.className = 'interactive-tool-section';
  quickAccess.innerHTML = `
    <h3 style="margin-bottom: 1rem; font-size: 1.1rem; color: var(--text-primary);">⚡ Outils Cliniques & Synthèses Disponibles</h3>
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem;">
      <button class="tool-nav-btn emergency-btn" onclick="renderView('urgences')">
        🚨 Signes d'Urgence Vitale
      </button>
      <button class="tool-nav-btn" onclick="renderView('calculators')">
        🧮 Calculateurs Cliniques (Pédiatrie, Rein, CRB-65)
      </button>
      <button class="tool-nav-btn" onclick="renderView('drugs')">
        💊 Tableau des DCI & Posologies
      </button>
      <button class="tool-nav-btn" onclick="renderView('checklist')">
        ✅ Check-list Sécurité avant Signature
      </button>
    </div>
  `;
  container.appendChild(quickAccess);

  return container;
}

/* ==========================================================================
   VUE D'UN CHAPITRE DU MANUEL GÉNÉRAL
   ========================================================================== */
function renderChapterView(num) {
  const chapter = GENERAL_MANUAL_DATA.chapters.find(c => c.num === num);
  if (!chapter) return renderHomeView();

  const isFav = AppState.favorites.includes(`gen-${chapter.num}`);
  const container = document.createElement('div');

  const card = document.createElement('div');
  card.className = `medical-card ${chapter.isUrgent ? 'urgent-card' : ''}`;

  card.innerHTML = `
    <div class="card-header-bar">
      <div>
        <span class="card-tag ${chapter.isUrgent ? 'urgent-tag' : ''}">
          ${chapter.isUrgent ? '🚨 URGENCE VITALE • ' : ''}Chapitre ${escHtml(chapter.num)}
        </span>
        <h1 class="card-title">${escHtml(chapter.title)}</h1>
      </div>
      <button class="bookmark-btn ${isFav ? 'active' : ''}" title="Ajouter aux favoris" onclick="toggleFavorite('gen-${chapter.num}')">
        ★
      </button>
    </div>

    ${chapter.summary ? `<div class="card-summary-box">${escHtml(chapter.summary)}</div>` : ''}

    <div class="card-content-body">
      ${renderMarkdown(chapter.content)}
    </div>

    <div style="margin-top: 2rem; padding-top: 1rem; border-top: 1px solid var(--border-subtle); display: flex; justify-content: space-between; font-size: 0.82rem; color: var(--text-muted);">
      <span>Manuel de Thérapeutique Clinique • Septembre 2026</span>
      <button class="icon-btn" onclick="window.print()" title="Imprimer cette fiche">🖨️ Imprimer</button>
    </div>
  `;

  container.appendChild(card);
  return container;
}

/* ==========================================================================
   VUE D'UNE FICHE DE GÉRIATRIE
   ========================================================================== */
function renderFicheView(num) {
  const fiche = GERIATRIE_MANUAL_DATA.fiches.find(f => f.num === num);
  if (!fiche) return renderHomeView();

  const isFav = AppState.favorites.includes(`ger-${fiche.num}`);
  const container = document.createElement('div');

  const card = document.createElement('div');
  card.className = `medical-card ${fiche.isUrgent ? 'urgent-card' : ''}`;

  card.innerHTML = `
    <div class="card-header-bar">
      <div>
        <span class="card-tag ${fiche.isUrgent ? 'urgent-tag' : ''}">
          ${fiche.isUrgent ? '🚨 SITUATION AIGUË • ' : ''}Fiche Gériatrique ${escHtml(fiche.num)}
        </span>
        <h1 class="card-title">${escHtml(fiche.title)}</h1>
      </div>
      <button class="bookmark-btn ${isFav ? 'active' : ''}" title="Ajouter aux favoris" onclick="toggleFavorite('ger-${fiche.num}')">
        ★
      </button>
    </div>

    ${fiche.summary ? `<div class="card-summary-box">${escHtml(fiche.summary)}</div>` : ''}

    <div class="card-content-body">
      ${renderMarkdown(fiche.content)}
    </div>

    <div style="margin-top: 2rem; padding-top: 1rem; border-top: 1px solid var(--border-subtle); display: flex; justify-content: space-between; font-size: 0.82rem; color: var(--text-muted);">
      <span>Fiches de Thérapeutique en Gériatrie • Collection TRIMOBE</span>
      <button class="icon-btn" onclick="window.print()" title="Imprimer cette fiche">🖨️ Imprimer</button>
    </div>
  `;

  container.appendChild(card);
  return container;
}

/* ==========================================================================
   VUE DU TABLEAU INTERACTIF DES DCI (CHAPITRE XLV)
   ========================================================================== */
function renderDrugsView() {
  const container = document.createElement('div');
  container.className = 'interactive-tool-section';

  container.innerHTML = `
    <div class="tool-header-row">
      <div>
        <h2 style="font-size: 1.4rem; font-weight: 800; color: var(--text-primary);">💊 Répertoire des DCI & Précautions</h2>
        <p style="font-size: 0.85rem; color: var(--text-secondary); margin-top: 0.2rem;">
          Base de données des molécules usuelles (Chapitre XLV et fiches gériatriques) avec adaptations rénales, classification OMS AWaRe et alertes de sécurité.
        </p>
      </div>
      <span class="card-tag">${DRUGS_DATA.length} molécules indexées</span>
    </div>

    <div style="display: flex; gap: 0.75rem; margin-bottom: 1rem; flex-wrap: wrap;">
      <input type="text" id="drugSearchInput" class="form-input" style="flex: 2; min-width: 220px;" placeholder="Rechercher une DCI, une classe ou une indication..." oninput="applyDrugFilters()">
      <select id="drugRenalFilter" class="form-select" style="flex: 1; min-width: 160px;" onchange="applyDrugFilters()">
        <option value="all">Toutes les fonctions rénales</option>
        <option value="renal_only">Adaptation rénale requise</option>
      </select>
      <select id="drugRiskFilter" class="form-select" style="flex: 1; min-width: 160px;" onchange="applyDrugFilters()">
        <option value="all">Tous les niveaux de risque</option>
        <option value="high_risk">Risque élevé en gériatrie</option>
      </select>
      <select id="filterDrugAware" class="form-select" style="flex: 1; min-width: 160px;" onchange="applyDrugFilters()">
        <option value="all">Tous les statuts AWaRe</option>
        <option value="access">Access</option>
        <option value="watch">Watch</option>
        <option value="reserve">Reserve</option>
      </select>
    </div>

    <div class="table-responsive-wrapper">
      <table class="clinical-table" id="drugsTable">
        <thead>
          <tr>
            <th>DCI</th>
            <th>Classe & Usage</th>
            <th>Posologie Indicative</th>
            <th>Précautions & Surveillance</th>
            <th>Statut Rénal & Gériatrique</th>
          </tr>
        </thead>
        <tbody id="drugsTableBody">
        </tbody>
      </table>
    </div>
  `;

  setTimeout(() => applyDrugFilters(), 0);
  return container;
}

function applyDrugFilters() {
  const tbody = document.getElementById('drugsTableBody');
  if (!tbody) return;

  const rawQuery = (document.getElementById('drugSearchInput')?.value || '').trim();
  const nQuery = normalizeStr(rawQuery);
  const sQuery = nQuery.replace(/[^a-z0-9]/g, '');

  const renalFilter = document.getElementById('drugRenalFilter')?.value || 'all';
  const riskFilter = document.getElementById('drugRiskFilter')?.value || 'all';
  const rawAware = (document.getElementById('filterDrugAware')?.value || 'all').trim();
  const selectedAware = rawAware.toLowerCase();

  const filtered = DRUGS_DATA.filter(d => {
    let matchesQuery = true;
    if (nQuery) {
      const matchField = (txt) => {
        if (!txt) return false;
        const nTxt = normalizeStr(txt);
        if (nTxt.includes(nQuery)) return true;
        if (sQuery.length >= 3 && nTxt.replace(/[^a-z0-9]/g, '').includes(sQuery)) return true;
        return false;
      };
      matchesQuery = matchField(d.dci) ||
        matchField(d.class) ||
        matchField(d.indication) ||
        matchField(d.precautions) ||
        matchField(d.dosage);
    }

    const matchesRenal = renalFilter === 'all' || (renalFilter === 'renal_only' && d.renalAdaptation);
    const matchesRisk = riskFilter === 'all' || (riskFilter === 'high_risk' && (d.geriatricRisk.includes('Élevé') || d.geriatricRisk.includes('Très élevé')));
    const matchesAware = (selectedAware === 'all' || selectedAware === 'tous' || !selectedAware) ? true :
      (d.aware && (d.aware === selectedAware || d.aware.toLowerCase() === selectedAware));

    return matchesQuery && matchesRenal && matchesRisk && matchesAware;
  });

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; padding: 2rem; color: var(--text-muted);">Aucun médicament correspondant aux critères.</td></tr>`;
    return;
  }

  tbody.innerHTML = filtered.map(d => {
    const awareBadge = d.aware
      ? `<span class="badge-aware badge-aware-${d.aware.toLowerCase()}">${d.aware.toUpperCase()}</span>`
      : '';

    return `
    <tr>
      <td>
        <div style="display: flex; align-items: center; gap: 0.4rem; flex-wrap: wrap;">
          <strong style="color: var(--brand-primary); font-size: 0.95rem;">${escHtml(d.dci)}</strong>
          ${awareBadge}
        </div>
        <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 2px;">${escHtml(d.class)}</div>
      </td>
      <td>${escHtml(d.indication)}</td>
      <td><span style="font-family: var(--font-mono); font-size: 0.83rem;">${escHtml(d.dosage)}</span></td>
      <td>${escHtml(d.precautions)}</td>
      <td>
        ${d.renalAdaptation ? '<span class="calc-result-badge warning" style="display: block; margin-bottom: 4px;">⚠️ Adaptation DFG</span>' : '<span class="calc-result-badge success" style="display: block; margin-bottom: 4px;">Pas d\'adaptation DFG</span>'}
        <div style="font-size: 0.75rem; color: var(--text-secondary);">${escHtml(d.geriatricRisk)}</div>
      </td>
    </tr>
  `;
  }).join('');
}

// Alias de compatibilité ascendante et descendante
function filterDrugsTable() {
  return applyDrugFilters();
}

/* ==========================================================================
   VUE DES CALCULATEURS CLINIQUES
   ========================================================================== */
function renderCalculatorsView() {
  const container = document.createElement('div');

  container.innerHTML = `
    <div style="margin-bottom: 1.5rem;">
      <h1 style="font-size: 1.6rem; font-weight: 800; color: var(--text-primary);">🧮 Calculateurs & Outils Cliniques Pratiques</h1>
      <p style="font-size: 0.9rem; color: var(--text-secondary);">Outils validés conformes aux formules du Chapitre XLIX et des recommandations internationales.</p>
    </div>

    <!-- CALCULATEUR 1 : PÉDIATRIE -->
    <div class="interactive-tool-section">
      <div class="tool-header-row">
        <div>
          <h2 style="font-size: 1.2rem; font-weight: 700; color: var(--text-primary);">1. Calculateur de Dose Pédiatrique</h2>
          <p style="font-size: 0.8rem; color: var(--text-secondary);">Calcul strict de la posologie au kilo (mg/kg/prise et volume de sirop en mL)</p>
        </div>
        <span class="card-tag">Formule Chapitre XL & XLIX</span>
      </div>

      <div class="calc-grid">
        <div>
          <div class="form-group">
            <label class="form-label">Poids de l'enfant (kg)</label>
            <input type="number" id="pedWeight" class="form-input" placeholder="ex: 12" step="0.1" value="12" oninput="runPediatricCalc()">
          </div>
          <div class="form-group">
            <label class="form-label">Posologie recommandée (mg/kg/prise)</label>
            <input type="number" id="pedDoseKg" class="form-input" placeholder="ex: 15 (Paracétamol)" step="1" value="15" oninput="runPediatricCalc()">
            <div style="font-size: 0.72rem; color: var(--text-muted); margin-top: 4px;">
              Repères : Paracétamol = 10 à 15 mg/kg/prise • Amoxicilline = 25 à 30 mg/kg/prise
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Nombre de prises par 24h</label>
            <select id="pedTimes" class="form-select" onchange="runPediatricCalc()">
              <option value="4" selected>4 prises par jour (toutes les 6h)</option>
              <option value="3">3 prises par jour (toutes les 8h)</option>
              <option value="2">2 prises par jour (toutes les 12h)</option>
              <option value="1">1 prise unique par jour</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Concentration du sirop en mg/mL (optionnel)</label>
            <input type="number" id="pedConc" class="form-input" placeholder="ex: 24 (sirop 2,4%)" step="0.1" value="24" oninput="runPediatricCalc()">
          </div>
        </div>

        <div class="calc-result-box" id="pediatricResult">
          <!-- Résultat injecté dynamiquement -->
        </div>
      </div>
    </div>

    <!-- CALCULATEUR 2 : COCKCROFT-GAULT -->
    <div class="interactive-tool-section">
      <div class="tool-header-row">
        <div>
          <h2 style="font-size: 1.2rem; font-weight: 700; color: var(--text-primary);">2. Clairance Rénale (Cockcroft-Gault)</h2>
          <p style="font-size: 0.8rem; color: var(--text-secondary);">Indispensable pour l'adaptation posologique des AOD, metformine et antibiotiques</p>
        </div>
        <span class="card-tag">Chapitre XXXVIII & XLVI</span>
      </div>

      <div class="calc-grid">
        <div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem;">
            <div class="form-group">
              <label class="form-label">Âge (années)</label>
              <input type="number" id="cgAge" class="form-input" placeholder="ex: 78" value="78" oninput="runCockcroftCalc()">
            </div>
            <div class="form-group">
              <label class="form-label">Poids (kg)</label>
              <input type="number" id="cgWeight" class="form-input" placeholder="ex: 65" value="65" oninput="runCockcroftCalc()">
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Sexe du patient</label>
            <select id="cgSex" class="form-select" onchange="runCockcroftCalc()">
              <option value="female" selected>Femme (facteur 1,04)</option>
              <option value="male">Homme (facteur 1,23)</option>
            </select>
          </div>
          <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 0.75rem;">
            <div class="form-group">
              <label class="form-label">Créatininémie</label>
              <input type="number" id="cgCreat" class="form-input" placeholder="ex: 110" value="110" oninput="runCockcroftCalc()">
            </div>
            <div class="form-group">
              <label class="form-label">Unité</label>
              <select id="cgUnit" class="form-select" onchange="runCockcroftCalc()">
                <option value="umol_l" selected>µmol/L</option>
                <option value="mg_dl">mg/dL</option>
                <option value="mg_l">mg/L</option>
              </select>
            </div>
          </div>
        </div>

        <div class="calc-result-box" id="cockcroftResult">
          <!-- Résultat Cockcroft injecté -->
        </div>
      </div>
    </div>

    <!-- CALCULATEUR 3 : SCORE CRB-65 -->
    <div class="interactive-tool-section">
      <div class="tool-header-row">
        <div>
          <h2 style="font-size: 1.2rem; font-weight: 700; color: var(--text-primary);">3. Score de Gravité CRB-65 (Pneumonie)</h2>
          <p style="font-size: 0.8rem; color: var(--text-secondary);">Aide à la décision d'hospitalisation ambulatoire vs hospitalière</p>
        </div>
        <span class="card-tag">Chapitre XI & Fiche 13</span>
      </div>

      <div class="calc-grid">
        <div style="display: flex; flex-direction: column; gap: 0.5rem;">
          <label class="checklist-item">
            <input type="checkbox" id="crbC" class="checklist-checkbox" onchange="runCRB65Calc()">
            <span class="checklist-text"><strong>C (Confusion) :</strong> Confusion mentale d'apparition récente ou altération de la vigilance</span>
          </label>
          <label class="checklist-item">
            <input type="checkbox" id="crbR" class="checklist-checkbox" onchange="runCRB65Calc()">
            <span class="checklist-text"><strong>R (Respiration) :</strong> Fréquence respiratoire ≥ 30 / minute</span>
          </label>
          <label class="checklist-item">
            <input type="checkbox" id="crbB" class="checklist-checkbox" onchange="runCRB65Calc()">
            <span class="checklist-text"><strong>B (Blood pressure) :</strong> Pression artérielle systolique < 90 mmHg ou diastolique ≤ 60 mmHg</span>
          </label>
          <label class="checklist-item">
            <input type="checkbox" id="crbAge" class="checklist-checkbox" onchange="runCRB65Calc()" checked>
            <span class="checklist-text"><strong>65 :</strong> Âge du patient ≥ 65 ans</span>
          </label>
        </div>

        <div class="calc-result-box" id="crb65Result">
          <!-- Résultat CRB65 -->
        </div>
      </div>
    </div>

    <!-- CALCULATEUR 4 : CONVERTISSEUR DE GLYCÉMIE & RESUCRAGE -->
    <div class="interactive-tool-section">
      <div class="tool-header-row">
        <div>
          <h2 style="font-size: 1.2rem; font-weight: 700; color: var(--text-primary);">4. Convertisseur de Glycémie & Protocole de Resucrage</h2>
          <p style="font-size: 0.8rem; color: var(--text-secondary);">Conversion instantanée (g/L ↔ mmol/L ↔ mg/dL) et protocole d'urgence</p>
        </div>
        <span class="card-tag">Chapitre IV & XLIX</span>
      </div>

      <div class="calc-grid">
        <div>
          <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 0.75rem;">
            <div class="form-group">
              <label class="form-label">Valeur glycémique mesurée</label>
              <input type="number" id="glucVal" class="form-input" placeholder="ex: 0.65" step="0.01" value="0.65" oninput="runGlucoseCalc()">
            </div>
            <div class="form-group">
              <label class="form-label">Unité d'origine</label>
              <select id="glucUnit" class="form-select" onchange="runGlucoseCalc()">
                <option value="g_l" selected>g/L</option>
                <option value="mmol_l">mmol/L</option>
                <option value="mg_dl">mg/dL</option>
              </select>
            </div>
          </div>
          <div style="background: var(--bg-primary); padding: 0.85rem; border-radius: var(--radius-md); font-size: 0.8rem; color: var(--text-secondary);">
            <strong>Règle des 15 g si conscient :</strong> 3 morceaux de sucre n°4 ou 150 mL de jus de fruit, contrôle à 15 minutes.<br>
            <strong>Si inconscient :</strong> G30% IV (2-3 ampoules) ou Glucagon 1 mg IM/SC.
          </div>
        </div>

        <div class="calc-result-box" id="glucoseResult">
          <!-- Résultat Glucose -->
        </div>
      </div>
    </div>

    <!-- CALCULATEUR 5 : DÉFICIT EN EAU LIBRE (DÉSHYDRATATION HYPERNATRÉMIQUE) -->
    <div class="interactive-tool-section">
      <div class="tool-header-row">
        <div>
          <h2 style="font-size: 1.2rem; font-weight: 700; color: var(--text-primary);">5. Déficit en Eau Libre (Déshydratation Hypernatrémique)</h2>
          <p style="font-size: 0.8rem; color: var(--text-secondary);">Estimation du volume d'eau libre à compenser et prudence sur la vitesse de correction</p>
        </div>
        <span class="card-tag">Fiche Gériatrique 19</span>
      </div>

      <div class="calc-grid">
        <div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem;">
            <div class="form-group">
              <label class="form-label" for="calcWaterWeight">Poids actuel (kg)</label>
              <input type="number" id="calcWaterWeight" class="form-input" placeholder="ex: 60" step="0.5" value="60" oninput="runWaterDeficitCalc()">
            </div>
            <div class="form-group">
              <label class="form-label" for="calcWaterNa">Natrémie mesurée (mmol/L)</label>
              <input type="number" id="calcWaterNa" class="form-input" placeholder="ex: 155" step="1" value="155" oninput="runWaterDeficitCalc()">
            </div>
          </div>
          <div style="display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 1rem;">
            <label class="checklist-item" style="margin: 0;">
              <input type="checkbox" id="calcWaterElderly" class="checklist-checkbox" onchange="runWaterDeficitCalc()" checked>
              <span class="checklist-text"><strong>Sujet âgé :</strong> Âge ≥ 65 ans (eau corporelle totale réduite)</span>
            </label>
            <label class="checklist-item" style="margin: 0;">
              <input type="checkbox" id="calcWaterFemale" class="checklist-checkbox" onchange="runWaterDeficitCalc()">
              <span class="checklist-text"><strong>Sexe féminin :</strong> Patient de sexe féminin</span>
            </label>
          </div>
          <button type="button" id="btnRunWaterDeficit" class="btn btn-primary" style="width: 100%; padding: 0.6rem; font-weight: 600;" onclick="runWaterDeficitCalc()">
            Calculer le Déficit en Eau Libre
          </button>
        </div>

        <div class="calc-result-box" id="waterDeficitResult">
          <!-- Résultat Déficit en Eau Libre injecté dynamiquement -->
        </div>
      </div>
    </div>

    <!-- CALCULATEUR 6 : CONVERTISSEUR HBA1C ↔ EAG & CIBLES CLINIQUES -->
    <div class="interactive-tool-section">
      <div class="tool-header-row">
        <div>
          <h2 style="font-size: 1.2rem; font-weight: 700; color: var(--text-primary);">6. Convertisseur HbA1c ↔ eAG & Cibles Thérapeutiques</h2>
          <p style="font-size: 0.8rem; color: var(--text-secondary);">Conversion bidirectionnelle selon la formule ADAG (Nathan et al.) et objectifs cibles</p>
        </div>
        <span class="card-tag">Recommandations ADA / HAS</span>
      </div>

      <div class="calc-grid">
        <div>
          <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 0.75rem; margin-bottom: 1rem;">
            <div class="form-group" style="margin-bottom: 0;">
              <label class="form-label" for="calcHbA1cVal">Valeur mesurée</label>
              <input type="number" id="calcHbA1cVal" class="form-input" placeholder="ex: 7.5" step="0.1" value="7.5" oninput="runHbA1cCalc()">
            </div>
            <div class="form-group" style="margin-bottom: 0;">
              <label class="form-label" for="calcHbA1cUnit">Unité</label>
              <select id="calcHbA1cUnit" class="form-select" onchange="runHbA1cCalc()">
                <option value="percent" selected>HbA1c (%)</option>
                <option value="mg_dl">eAG (mg/dL)</option>
                <option value="mmol_l">eAG (mmol/L)</option>
              </select>
            </div>
          </div>
          <div style="background: var(--bg-primary); padding: 0.75rem; border-radius: var(--radius-md); font-size: 0.78rem; color: var(--text-secondary); margin-bottom: 1rem;">
            <strong>Repères d'objectifs cibles :</strong><br>
            • Adulte jeune / Diabète récent : <strong>&lt; 7,0%</strong> (eAG &lt; 154 mg/dL)<br>
            • Sujet âgé fragile / polypathologique : <strong>7,5 à 8,5%</strong> (eAG 169 à 197 mg/dL)
          </div>
          <button type="button" id="btnRunHbA1c" class="btn btn-primary" style="width: 100%; padding: 0.6rem; font-weight: 600;" onclick="runHbA1cCalc()">
            Calculer l'équivalence glycémique
          </button>
        </div>

        <div class="calc-result-box" id="hba1cResult">
          <!-- Résultat HbA1c ↔ eAG injecté dynamiquement -->
        </div>
      </div>
    </div>
  `;

  setTimeout(() => {
    runPediatricCalc();
    runCockcroftCalc();
    runCRB65Calc();
    runGlucoseCalc();
    runWaterDeficitCalc();
    runHbA1cCalc();
    setupCalculatorsEvents();
  }, 0);

  return container;
}

function runPediatricCalc() {
  try {
    const w = document.getElementById('pedWeight')?.value;
    const d = document.getElementById('pedDoseKg')?.value;
    const t = document.getElementById('pedTimes')?.value;
    const c = document.getElementById('pedConc')?.value;
    const box = document.getElementById('pediatricResult');
    if (!box) return;

    const res = Calculators.calculatePediatric(w, d, t, c);
    if (res.error) {
      box.innerHTML = `<div class="alert-card alert-danger">${escHtml(res.error)}</div>`;
      return;
    }

    box.innerHTML = `
      <span class="calc-result-badge info">Posologie Pédiatrique Calculée</span>
      <div class="calc-result-value">${res.dosePerTakeMg} mg / prise</div>
      <div style="font-size: 0.95rem; color: var(--text-primary); margin-bottom: 0.5rem;">
        Soit un total quotidien de : <strong>${res.totalDailyMg} mg / jour</strong>
      </div>
      ${res.mlPerTake ? `
        <div style="padding: 0.5rem 0.75rem; background: var(--bg-surface); border-radius: var(--radius-sm); border: 1px solid var(--border-medium); margin-top: 0.5rem;">
          Volume de sirop à administrer : <strong style="color: var(--brand-primary); font-size: 1.1rem;">${res.mlPerTake} mL</strong> par prise<br>
          <span style="font-size: 0.75rem; color: var(--text-muted);">(Espacer les prises de ${res.intervalHours} heures)</span>
        </div>
      ` : ''}
    `;
  } catch (err) {
    const box = document.getElementById('pediatricResult');
    if (box) box.innerHTML = `<div class="alert-card alert-danger">Erreur de saisie : paramètres invalides.</div>`;
  }
}

function runCockcroftCalc() {
  try {
    const age = document.getElementById('cgAge')?.value;
    const w = document.getElementById('cgWeight')?.value;
    const creat = document.getElementById('cgCreat')?.value;
    const unit = document.getElementById('cgUnit')?.value;
    const isFem = document.getElementById('cgSex')?.value === 'female';
    const box = document.getElementById('cockcroftResult');
    if (!box) return;

    const res = Calculators.calculateCockcroft(age, w, creat, unit, isFem);
    if (res.error) {
      box.innerHTML = `<div class="alert-card alert-danger">${escHtml(res.error)}</div>`;
      return;
    }

    box.innerHTML = `
      <span class="calc-result-badge ${res.alertClass}">${escHtml(res.stage)}</span>
      <div class="calc-result-value">${res.clCr} mL/min</div>
      <div style="font-size: 0.85rem; color: var(--text-secondary); line-height: 1.4;">
        ${escHtml(res.interpretation)}
      </div>
      ${res.isSarcopenicWarning ? `
        <div style="margin-top: 0.5rem; padding: 0.4rem 0.6rem; background: var(--warning-bg); border: 1px solid var(--warning-border); border-radius: 4px; font-size: 0.75rem; color: var(--warning);">
          ⚠️ <strong>Alerte Sarcopénie :</strong> Chez ce patient âgé, une créatinine basse peut sous-estimer considérablement l'atteinte rénale réelle.
        </div>
      ` : ''}
    `;
  } catch (err) {
    const box = document.getElementById('cockcroftResult');
    if (box) box.innerHTML = `<div class="alert-card alert-danger">Erreur de saisie : paramètres invalides.</div>`;
  }
}

function runCRB65Calc() {
  try {
    const c = document.getElementById('crbC')?.checked;
    const r = document.getElementById('crbR')?.checked;
    const b = document.getElementById('crbB')?.checked;
    const age = document.getElementById('crbAge')?.checked;
    const box = document.getElementById('crb65Result');
    if (!box) return;

    const res = Calculators.calculateCRB65(c, r, b, age);

    box.innerHTML = `
      <span class="calc-result-badge ${res.alertClass}">${escHtml(res.riskLevel)}</span>
      <div class="calc-result-value">Score : ${res.score} / 4</div>
      <div style="font-size: 0.88rem; color: var(--text-primary); font-weight: 600; margin-top: 0.35rem;">
        ${escHtml(res.recommendation)}
      </div>
    `;
  } catch (err) {
    const box = document.getElementById('crb65Result');
    if (box) box.innerHTML = `<div class="alert-card alert-danger">Erreur d'évaluation du score.</div>`;
  }
}

function runGlucoseCalc() {
  try {
    const val = document.getElementById('glucVal')?.value;
    const unit = document.getElementById('glucUnit')?.value;
    const box = document.getElementById('glucoseResult');
    if (!box) return;

    const res = Calculators.convertGlucose(val, unit);
    if (res.error) {
      box.innerHTML = `<div class="alert-card alert-danger">${escHtml(res.error)}</div>`;
      return;
    }

    box.innerHTML = `
      <span class="calc-result-badge ${res.alertClass}">${escHtml(res.status)}</span>
      <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 0.5rem; margin: 0.5rem 0;">
        <div style="background: var(--bg-surface); padding: 0.4rem; border-radius: 4px; text-align: center; border: 1px solid var(--border-subtle);">
          <span style="font-size: 0.7rem; color: var(--text-muted); display: block;">g/L</span>
          <strong>${res.gPerL}</strong>
        </div>
        <div style="background: var(--bg-surface); padding: 0.4rem; border-radius: 4px; text-align: center; border: 1px solid var(--border-subtle);">
          <span style="font-size: 0.7rem; color: var(--text-muted); display: block;">mmol/L</span>
          <strong>${res.mmolL}</strong>
        </div>
        <div style="background: var(--bg-surface); padding: 0.4rem; border-radius: 4px; text-align: center; border: 1px solid var(--border-subtle);">
          <span style="font-size: 0.7rem; color: var(--text-muted); display: block;">mg/dL</span>
          <strong>${res.mgDl}</strong>
        </div>
      </div>
      ${res.note ? `
        <div style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 0.35rem; line-height: 1.4;">
          ${escHtml(res.note)}
        </div>
      ` : ''}
    `;
  } catch (err) {
    const box = document.getElementById('glucoseResult');
    if (box) box.innerHTML = `<div class="alert-card alert-danger">Erreur de saisie glycémique.</div>`;
  }
}

function runWaterDeficitCalc() {
  try {
    const w = document.getElementById('calcWaterWeight')?.value;
    const na = document.getElementById('calcWaterNa')?.value;
    const elderlyEl = document.getElementById('calcWaterElderly');
    const isElderly = elderlyEl ? (elderlyEl.type === 'checkbox' ? elderlyEl.checked : (elderlyEl.value === 'true' || elderlyEl.value === '1')) : true;
    const femaleEl = document.getElementById('calcWaterFemale');
    const isFemale = femaleEl ? (femaleEl.type === 'checkbox' ? femaleEl.checked : (femaleEl.value === 'female' || femaleEl.value === 'true' || femaleEl.value === '1')) : false;
    const box = document.getElementById('waterDeficitResult');
    if (!box) return;

    const res = Calculators.calculateWaterDeficit(w, na, isElderly, isFemale);
    if (res.error) {
      box.innerHTML = `<div class="alert-card alert-danger">${escHtml(res.error)}</div>`;
      return;
    }

    box.innerHTML = `
      <span class="calc-result-badge warning">Déficit en Eau Libre Estimé</span>
      <div class="calc-result-value">${res.deficitLiters} Litres</div>
      <div style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 0.5rem;">
        Coefficient d'eau corporelle totale utilisé : <strong>${res.factor}</strong> (${isElderly ? 'sujet âgé' : 'adulte jeune'}, ${isFemale ? 'femme' : 'homme'})
      </div>
      <div class="alert-card alert-warning">
        ⚠️ <strong>Prudence réhydratation :</strong> ${escHtml(res.advice)}
      </div>
    `;
  } catch (err) {
    const box = document.getElementById('waterDeficitResult');
    if (box) box.innerHTML = `<div class="alert-card alert-danger">Erreur de calcul du déficit en eau libre.</div>`;
  }
}

function runHbA1cCalc() {
  try {
    const val = document.getElementById('calcHbA1cVal')?.value;
    const unit = document.getElementById('calcHbA1cUnit')?.value || 'percent';
    const box = document.getElementById('hba1cResult');
    if (!box) return;

    const res = Calculators.convertHbA1c(val, unit);
    if (res.error) {
      box.innerHTML = `<div class="alert-card alert-danger">${escHtml(res.error)}</div>`;
      return;
    }

    box.innerHTML = `
      <span class="calc-result-badge ${res.alertClass}">${escHtml(res.targetStatus)}</span>
      <div class="calc-result-value">${res.hba1cPercent} %</div>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; margin: 0.5rem 0;">
        <div style="background: var(--bg-surface); padding: 0.5rem; border-radius: 4px; text-align: center; border: 1px solid var(--border-subtle);">
          <span style="font-size: 0.72rem; color: var(--text-muted); display: block;">Glycémie moyenne (eAG)</span>
          <strong style="color: var(--brand-primary); font-size: 1.1rem;">${res.eagMgDl}</strong> mg/dL
        </div>
        <div style="background: var(--bg-surface); padding: 0.5rem; border-radius: 4px; text-align: center; border: 1px solid var(--border-subtle);">
          <span style="font-size: 0.72rem; color: var(--text-muted); display: block;">Glycémie moyenne (eAG)</span>
          <strong style="color: var(--brand-primary); font-size: 1.1rem;">${res.eagMmolL}</strong> mmol/L
        </div>
      </div>
      <div style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 0.35rem; line-height: 1.4;">
        ${escHtml(res.note)}
      </div>
    `;
  } catch (err) {
    const box = document.getElementById('hba1cResult');
    if (box) box.innerHTML = `<div class="alert-card alert-danger">Erreur de conversion HbA1c.</div>`;
  }
}

function setupCalculatorsEvents() {
  const btnPed = document.getElementById('btnRunPediatric');
  if (btnPed) btnPed.onclick = () => runPediatricCalc();

  const btnCg = document.getElementById('btnRunCockcroft');
  if (btnCg) btnCg.onclick = () => runCockcroftCalc();

  const btnCrb = document.getElementById('btnRunCRB65');
  if (btnCrb) btnCrb.onclick = () => runCRB65Calc();

  const btnGluc = document.getElementById('btnRunGlucose');
  if (btnGluc) btnGluc.onclick = () => runGlucoseCalc();

  const btnWater = document.getElementById('btnRunWaterDeficit');
  if (btnWater) btnWater.onclick = () => runWaterDeficitCalc();

  const btnHbA1c = document.getElementById('btnRunHbA1c');
  if (btnHbA1c) btnHbA1c.onclick = () => runHbA1cCalc();
}

if (typeof window !== 'undefined') {
  window.runWaterDeficitCalc = runWaterDeficitCalc;
  window.runHbA1cCalc = runHbA1cCalc;
  window.setupCalculatorsEvents = setupCalculatorsEvents;
}

/* ==========================================================================
   VUE CHECK-LIST AVANT SIGNATURE (CHAPITRE XLII)
   ========================================================================== */
function renderChecklistView() {
  const container = document.createElement('div');
  container.className = 'interactive-tool-section';

  const items = [
    { id: 'c1', label: '1. Diagnostic confirmé ou probabilité clinique suffisante établie' },
    { id: 'c2', label: '2. Indication formelle pour chaque médicament prescrit' },
    { id: 'c3', label: '3. Allergies médicamenteuses vérifiées et consignées' },
    { id: 'c4', label: '4. Âge et Poids exacts pris en compte (calcul mg/kg chez l\'enfant)' },
    { id: 'c5', label: '5. Statut Grossesse / Allaitement vérifié' },
    { id: 'c6', label: '6. Fonction rénale (DFG) évaluée et molécules adaptées' },
    { id: 'c7', label: '7. Fonction hépatique et risque d\'accumulation vérifiés' },
    { id: 'c8', label: '8. Interactions médicamenteuses et doublons évités' },
    { id: 'c9', label: '9. Mentions obligatoires inscrites (DCI, posologie, voie, durée)' },
    { id: 'c10', label: '10. Information du patient délivrée et date de réévaluation fixée' }
  ];

  let checkedCount = items.filter(it => AppState.checklistState[it.id]).length;

  container.innerHTML = `
    <div class="tool-header-row">
      <div>
        <h1 style="font-size: 1.4rem; font-weight: 800; color: var(--text-primary);">✅ Check-list Sécurité avant Signature d'Ordonnance</h1>
        <p style="font-size: 0.85rem; color: var(--text-secondary); margin-top: 0.2rem;">
          Les 10 points cardinaux de sécurité médicale (Chapitre XLII).
        </p>
      </div>
      <div style="text-align: right;">
        <span class="calc-result-badge ${checkedCount === 10 ? 'success' : 'warning'}" id="checklistBadge">
          ${checkedCount} / 10 vérifiés
        </span>
      </div>
    </div>

    <div class="checklist-container" id="checklistItemsList">
      ${items.map(it => `
        <label class="checklist-item ${AppState.checklistState[it.id] ? 'checked' : ''}">
          <input type="checkbox" class="checklist-checkbox" data-cid="${it.id}" ${AppState.checklistState[it.id] ? 'checked' : ''} onchange="toggleChecklistItem('${it.id}')">
          <span class="checklist-text">${escHtml(it.label)}</span>
        </label>
      `).join('')}
    </div>

    <div style="display: flex; gap: 0.75rem; margin-top: 1.5rem; justify-content: flex-end; align-items: center;">
      <button class="tool-nav-btn" onclick="resetChecklist()">Réinitialiser</button>
      <button id="copyChecklistBtn" class="tool-nav-btn" style="background: var(--brand-primary); color: #fff;" onclick="copyChecklistNote()">📋 Copier la note de sécurité</button>
    </div>
  `;

  return container;
}

function toggleChecklistItem(cid) {
  AppState.checklistState[cid] = !AppState.checklistState[cid];
  safeStorageSetJSON('trimobe_checklist', AppState.checklistState);
  renderView('checklist');
}

function resetChecklist() {
  AppState.checklistState = {};
  safeStorageSetJSON('trimobe_checklist', {});
  renderView('checklist');
}

function showCopyFeedback() {
  const btn = document.getElementById('copyChecklistBtn');
  if (btn) {
    if (!btn._originalHtml) {
      btn._originalHtml = btn.innerHTML;
    }
    btn.innerHTML = '✓ Synthèse copiée !';
    btn.style.background = 'var(--success)';
    clearTimeout(btn._feedbackTimer);
    btn._feedbackTimer = setTimeout(() => {
      if (btn) {
        btn.innerHTML = btn._originalHtml;
        btn.style.background = 'var(--brand-primary)';
        btn._originalHtml = null;
      }
    }, 2500);
  }
  if (typeof alert === 'function') {
    try {
      alert("Note de conformité copiée dans le presse-papiers !");
    } catch (e) {
      // Ignorer si alert est indisponible
    }
  }
}

function fallbackCopyText(text) {
  try {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.left = '-9999px';
    ta.style.top = '-9999px';
    ta.setAttribute('readonly', '');
    if (document.body && typeof document.body.appendChild === 'function') {
      document.body.appendChild(ta);
    }
    if (typeof ta.select === 'function') {
      ta.select();
    }
    let success = false;
    if (typeof document.execCommand === 'function') {
      success = document.execCommand('copy');
    }
    if (typeof window !== 'undefined' && typeof window._lastCopied !== 'undefined') {
      window._lastCopied = text;
    }
    if (document.body && typeof document.body.removeChild === 'function') {
      try {
        document.body.removeChild(ta);
      } catch (e) {}
    }
    showCopyFeedback();
    return success;
  } catch (err) {
    console.warn("Échec de la copie fallback :", err);
    showCopyFeedback();
  }
}

function copyChecklistNote() {
  const note = `[Sécurité Ordonnance - Collection TRIMOBE]\n` +
    `Check-list 10 points validée le ${new Date().toLocaleDateString('fr-FR')} : Conforme aux règles d'or de prescription rationnelle.`;

  if (typeof navigator !== 'undefined' && navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
    navigator.clipboard.writeText(note).then(() => {
      showCopyFeedback();
    }).catch(() => {
      fallbackCopyText(note);
    });
  } else {
    fallbackCopyText(note);
  }
}

/* ==========================================================================
   VUE URGENCES & SIGNES DE GRAVITÉ
   ========================================================================== */
function renderUrgencesView() {
  const container = document.createElement('div');

  const urgentChapters = GENERAL_MANUAL_DATA.chapters.filter(c => c.isUrgent);
  const urgentFiches = GERIATRIE_MANUAL_DATA.fiches.filter(f => f.isUrgent);

  container.innerHTML = `
    <div style="margin-bottom: 1.5rem;">
      <div class="hero-badge-pill" style="background: var(--danger-bg); color: var(--danger); border-color: var(--danger-border);">
        🚨 FILTRE URGENCES VITALES & DRAPEAUX ROUGES
      </div>
      <h1 style="font-size: 1.6rem; font-weight: 800; color: var(--text-primary); margin-top: 0.5rem;">
        Situations d'Urgence Médicale & Conduites à Tenir Immédiates
      </h1>
      <p style="font-size: 0.9rem; color: var(--text-secondary);">
        Accès direct et condensé aux fiches de prise en charge d'urgence des deux manuels.
      </p>
    </div>

    <!-- SYNTHÈSE DES SIGNES VITAUX (CHAPITRE XLIII) -->
    <div class="medical-card urgent-card">
      <div class="card-header-bar">
        <span class="card-tag urgent-tag">Aide-Mémoire Réanimation</span>
        <h2 class="card-title">Signes d'Urgence Vitale Immédiate (Chapitre XLIII)</h2>
      </div>
      <div class="card-content-body">
        ${renderMarkdown(GENERAL_MANUAL_DATA.chapters.find(c => c.num === "XLIII")?.content || '')}
      </div>
    </div>

    <!-- FICHES D'URGENCE MÉDECINE GÉNÉRALE -->
    <h3 style="margin: 2rem 0 1rem; color: var(--text-primary);">Urgences en Médecine Générale</h3>
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1rem;">
      ${urgentChapters.map(ch => `
        <div class="medical-card urgent-card" style="margin-bottom: 0; cursor: pointer;" onclick="AppState.currentManual='general'; renderView('chapter', '${ch.num}')">
          <span class="card-tag urgent-tag">Chapitre ${escHtml(ch.num)}</span>
          <h4 style="font-size: 1.1rem; font-weight: 700; margin: 0.4rem 0; color: var(--text-primary);">${escHtml(ch.title)}</h4>
          <p style="font-size: 0.8rem; color: var(--text-secondary);">${escHtml(ch.summary)}</p>
        </div>
      `).join('')}
    </div>

    <!-- FICHES D'URGENCE GÉRIATRIQUE -->
    <h3 style="margin: 2rem 0 1rem; color: var(--text-primary);">Urgences Aiguës en Gériatrie (Registre II)</h3>
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1rem;">
      ${urgentFiches.map(f => `
        <div class="medical-card urgent-card" style="margin-bottom: 0; cursor: pointer;" onclick="AppState.currentManual='geriatrie'; renderView('fiche', ${f.num})">
          <span class="card-tag urgent-tag">Fiche Gériatrique ${escHtml(f.num)}</span>
          <h4 style="font-size: 1.1rem; font-weight: 700; margin: 0.4rem 0; color: var(--text-primary);">${escHtml(f.title)}</h4>
          <p style="font-size: 0.8rem; color: var(--text-secondary);">${escHtml(f.summary)}</p>
        </div>
      `).join('')}
    </div>
  `;

  return container;
}

/* ==========================================================================
   VUE FAVORIS
   ========================================================================== */
function toggleFavorite(id) {
  const idx = AppState.favorites.indexOf(id);
  if (idx > -1) {
    AppState.favorites.splice(idx, 1);
  } else {
    AppState.favorites.push(id);
  }
  safeStorageSetJSON('trimobe_favorites', AppState.favorites);

  if (AppState.currentView === 'chapter') {
    renderView('chapter', AppState.activeItemId);
  } else if (AppState.currentView === 'fiche') {
    renderView('fiche', AppState.activeItemId);
  } else if (AppState.currentView === 'favorites') {
    renderView('favorites');
  }
}

function renderFavoritesView() {
  const container = document.createElement('div');

  if (AppState.favorites.length === 0) {
    container.innerHTML = `
      <div class="medical-card" style="text-align: center; padding: 3rem 1rem;">
        <span style="font-size: 3rem; display: block; margin-bottom: 1rem;">⭐</span>
        <h2 style="font-size: 1.3rem; color: var(--text-primary);">Aucun favori enregistré</h2>
        <p style="font-size: 0.85rem; color: var(--text-secondary); margin-top: 0.5rem;">
          Cliquez sur l'étoile ★ en haut à droite d'un chapitre ou d'une fiche pour y accéder rapidement pendant vos consultations.
        </p>
      </div>
    `;
    return container;
  }

  container.innerHTML = `
    <div style="margin-bottom: 1.5rem;">
      <h1 style="font-size: 1.6rem; font-weight: 800; color: var(--text-primary);">⭐ Vos Fiches Favorites</h1>
      <p style="font-size: 0.9rem; color: var(--text-secondary);">${AppState.favorites.length} fiches enregistrées pour accès rapide hors-ligne.</p>
    </div>

    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1rem;">
      ${AppState.favorites.map(favId => {
        if (favId.startsWith('gen-')) {
          const num = favId.replace('gen-', '');
          const ch = GENERAL_MANUAL_DATA.chapters.find(c => c.num === num);
          if (!ch) return '';
          return `
            <div class="medical-card" style="margin-bottom: 0; cursor: pointer;" onclick="AppState.currentManual='general'; renderView('chapter', '${ch.num}')">
              <span class="card-tag">Médecine Générale • Ch. ${escHtml(ch.num)}</span>
              <h4 style="font-size: 1.1rem; font-weight: 700; margin: 0.4rem 0;">${escHtml(ch.title)}</h4>
              <p style="font-size: 0.8rem; color: var(--text-secondary);">${escHtml(ch.summary)}</p>
            </div>
          `;
        } else {
          const num = parseInt(favId.replace('ger-', ''), 10);
          const f = GERIATRIE_MANUAL_DATA.fiches.find(fi => fi.num === num);
          if (!f) return '';
          return `
            <div class="medical-card" style="margin-bottom: 0; cursor: pointer;" onclick="AppState.currentManual='geriatrie'; renderView('fiche', ${f.num})">
              <span class="card-tag" style="background: var(--brand-dark); color: #fff;">Gériatrie • Fiche ${escHtml(f.num)}</span>
              <h4 style="font-size: 1.1rem; font-weight: 700; margin: 0.4rem 0;">${escHtml(f.title)}</h4>
              <p style="font-size: 0.8rem; color: var(--text-secondary);">${escHtml(f.summary)}</p>
            </div>
          `;
        }
      }).join('')}
    </div>
  `;

  return container;
}

/* ==========================================================================
   VUE COMITÉS SCIENTIFIQUES & RÉFÉRENCES BIBLIOGRAPHIQUES
   ========================================================================== */
function renderReferencesView() {
  const container = document.createElement('div');

  container.innerHTML = `
    <div style="margin-bottom: 1.5rem;">
      <h1 style="font-size: 1.6rem; font-weight: 800; color: var(--text-primary);">📚 Comités & Références Bibliographiques</h1>
      <p style="font-size: 0.9rem; color: var(--text-secondary);">Collection TRIMOBE & UMSP — Édition Septembre 2026</p>
    </div>

    <!-- COMITÉS SCIENTIFIQUES ET DIRECTION -->
    <div class="medical-card">
      <h2 style="font-size: 1.2rem; font-weight: 700; color: var(--text-primary); margin-bottom: 1rem;">Ouvrage Collectif & Comité Scientifique</h2>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1.25rem;">
        <div style="background: var(--bg-primary); padding: 1rem; border-radius: var(--radius-md);">
          <strong style="color: var(--brand-primary); display: block; margin-bottom: 4px;">Association TRIMOBE.org</strong>
          <span>Présidente : <strong>Dr Elisette ANDRIANANJA</strong></span><br>
          <span style="font-size: 0.8rem; color: var(--text-muted);">Formation Médicale Continue</span>
        </div>
        <div style="background: var(--bg-primary); padding: 1rem; border-radius: var(--radius-md);">
          <strong style="color: var(--brand-primary); display: block; margin-bottom: 4px;">Union des Médecins du Secteur Privé (UMSP)</strong>
          <span>Président : <strong>Dr HERY Andrianandrasana Rakotovao</strong></span>
        </div>
        <div style="background: var(--bg-primary); padding: 1rem; border-radius: var(--radius-md);">
          <strong style="color: var(--brand-primary); display: block; margin-bottom: 4px;">Coordination Scientifique</strong>
          <span><strong>Dr Eric Naivolala ANDRIANASOLO</strong></span><br>
          <span style="font-size: 0.8rem; color: var(--text-muted);">Relecture Gériatrique : Dr Patricia RAZAFINDRABEKOTO & Dr Andy RANJALAHY</span>
        </div>
        <div style="background: var(--bg-primary); padding: 1rem; border-radius: var(--radius-md);">
          <strong style="color: var(--brand-primary); display: block; margin-bottom: 4px;">Webmastering & Digitalisation</strong>
          <span><strong>Dr Miora Tantely RAKOTOARISON</strong></span>
        </div>
      </div>
    </div>

    <!-- CONCLUSION CLINIQUE (6 QUESTIONS) -->
    <div class="medical-card">
      <h2 style="font-size: 1.2rem; font-weight: 700; color: var(--text-primary); margin-bottom: 0.75rem;">Conclusion & Les 6 Questions Clés de la Prescription</h2>
      <blockquote style="margin-bottom: 1rem;">${escHtml(GENERAL_MANUAL_DATA.conclusion.text)}</blockquote>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 0.75rem;">
        ${GENERAL_MANUAL_DATA.conclusion.sixQuestions.map(q => `
          <div style="background: var(--bg-primary); padding: 0.75rem 1rem; border-radius: var(--radius-md); border-left: 3px solid var(--brand-primary);">
            <strong style="color: var(--brand-primary); font-size: 1.05rem;">${escHtml(q.q)}</strong>
            <p style="font-size: 0.82rem; color: var(--text-secondary); margin-top: 2px;">${escHtml(q.desc)}</p>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- RÉFÉRENCES BIBLIOGRAPHIQUES GENERALES -->
    <div class="medical-card">
      <h2 style="font-size: 1.2rem; font-weight: 700; color: var(--text-primary); margin-bottom: 1rem;">Références Bibliographiques Internationales (Manuel Général)</h2>
      <ol style="padding-left: 1.2rem; font-size: 0.83rem; color: var(--text-secondary); line-height: 1.7;">
        ${GENERAL_MANUAL_DATA.references.map(ref => `<li>${escHtml(ref)}</li>`).join('')}
      </ol>
    </div>

    <!-- RÉFÉRENCES GÉRIATRIE -->
    <div class="medical-card">
      <h2 style="font-size: 1.2rem; font-weight: 700; color: var(--text-primary); margin-bottom: 1rem;">Références Spécifiques en Gériatrie (SFGG, Beers, STOPP/START, HAS)</h2>
      <ol style="padding-left: 1.2rem; font-size: 0.83rem; color: var(--text-secondary); line-height: 1.7;">
        ${GERIATRIE_MANUAL_DATA.references.map(ref => `<li>${escHtml(ref)}</li>`).join('')}
      </ol>
    </div>
  `;

  return container;
}

/* ==========================================================================
   MODAL DE RECHERCHE UNIVERSELLE (CTRL + K)
   ========================================================================== */
function openSearchModal() {
  const modal = document.getElementById('searchModal');
  const input = document.getElementById('modalSearchInput');
  if (modal && input) {
    modal.classList.add('active');
    input.value = '';
    input.focus();
    renderSearchResults('');
  }
}

function closeSearchModal() {
  const modal = document.getElementById('searchModal');
  if (modal) modal.classList.remove('active');
}

let globalSearchIndex = null;

function buildSearchIndex() {
  const index = [];

  // 1. Chapitres de Médecine Générale
  if (typeof GENERAL_MANUAL_DATA !== 'undefined' && GENERAL_MANUAL_DATA.chapters) {
    GENERAL_MANUAL_DATA.chapters.forEach(ch => {
      const normTitle = normalizeStr(ch.title);
      const normSummary = normalizeStr(ch.summary);
      const normContent = normalizeStr(ch.content);
      index.push({
        type: 'general',
        id: ch.num,
        title: `Ch. ${ch.num} - ${ch.title}`,
        snippet: ch.summary || (ch.content ? ch.content.substring(0, 140) + '...' : ''),
        isUrgent: !!ch.isUrgent,
        normTitle,
        cleanTitle: normTitle.replace(/[^a-z0-9]/g, ''),
        normSummary,
        cleanSummary: normSummary.replace(/[^a-z0-9]/g, ''),
        normContent,
        cleanContent: normContent.replace(/[^a-z0-9]/g, ''),
        normNum: normalizeStr(ch.num)
      });
    });
  }

  // 2. Fiches de Gériatrie
  if (typeof GERIATRIE_MANUAL_DATA !== 'undefined' && GERIATRIE_MANUAL_DATA.fiches) {
    GERIATRIE_MANUAL_DATA.fiches.forEach(f => {
      const normTitle = normalizeStr(f.title);
      const normSummary = normalizeStr(f.summary);
      const normContent = normalizeStr(f.content);
      index.push({
        type: 'geriatrie',
        id: f.num,
        title: `Fiche ${f.num} (Gériatrie) - ${f.title}`,
        snippet: f.summary || (f.content ? f.content.substring(0, 140) + '...' : ''),
        isUrgent: !!f.isUrgent,
        normTitle,
        cleanTitle: normTitle.replace(/[^a-z0-9]/g, ''),
        normSummary,
        cleanSummary: normSummary.replace(/[^a-z0-9]/g, ''),
        normContent,
        cleanContent: normContent.replace(/[^a-z0-9]/g, ''),
        normNum: String(f.num)
      });
    });
  }

  // 3. Répertoire des DCI
  if (typeof DRUGS_DATA !== 'undefined' && Array.isArray(DRUGS_DATA)) {
    DRUGS_DATA.forEach(d => {
      const normDci = normalizeStr(d.dci);
      const normClass = normalizeStr(d.class);
      const normInd = normalizeStr(d.indication);
      const normPrec = normalizeStr(d.precautions);
      const normDosage = normalizeStr(d.dosage);
      index.push({
        type: 'drug',
        id: d.dci,
        title: `💊 DCI : ${d.dci} (${d.class})`,
        snippet: `Indication: ${d.indication} | Dose: ${d.dosage}`,
        isUrgent: false,
        normTitle: normDci,
        cleanTitle: normDci.replace(/[^a-z0-9]/g, ''),
        normSummary: normInd,
        cleanSummary: normInd.replace(/[^a-z0-9]/g, ''),
        normContent: `${normClass} ${normPrec} ${normDosage}`,
        cleanContent: `${normClass} ${normPrec}`.replace(/[^a-z0-9]/g, ''),
        normNum: ''
      });
    });
  }

  globalSearchIndex = index;
  return index;
}

function getSearchIndex() {
  if (!globalSearchIndex || globalSearchIndex.length === 0) {
    globalSearchIndex = buildSearchIndex();
  }
  return globalSearchIndex;
}

function performGlobalSearch(query) {
  const nq = normalizeStr(query);
  if (!nq) return [];
  const sq = nq.replace(/[^a-z0-9]/g, '');
  const words = nq.split(/\s+/).filter(w => w.length > 0);

  const index = getSearchIndex();
  const results = [];

  for (let i = 0; i < index.length; i++) {
    const item = index[i];
    let score = 0;

    if (item.normTitle === nq) {
      score = 400;
    } else if (item.normTitle.startsWith(nq)) {
      score = 300;
    } else if (item.normTitle.includes(nq)) {
      score = 200;
    } else if (sq.length >= 3 && item.cleanTitle.includes(sq)) {
      score = 180;
    } else if (item.normSummary.includes(nq)) {
      score = 120;
    } else if (sq.length >= 3 && item.cleanSummary.includes(sq)) {
      score = 100;
    } else if (item.normNum && (item.normNum === nq || item.normNum === sq)) {
      score = 250;
    } else if (item.normContent.includes(nq)) {
      score = 40;
    } else if (sq.length >= 3 && item.cleanContent.includes(sq)) {
      score = 30;
    } else if (words.length > 1 && words.every(w => item.normTitle.includes(w) || item.normSummary.includes(w) || item.normContent.includes(w))) {
      score = 90;
    }

    if (score > 0) {
      results.push({
        type: item.type,
        id: item.id,
        title: item.title,
        snippet: item.snippet,
        isUrgent: item.isUrgent,
        score
      });
    }
  }

  results.sort((a, b) => b.score - a.score);
  return results;
}

function renderSearchResults(query) {
  const list = document.getElementById('modalResultsList');
  if (!list) return;

  const trimmed = (query || '').trim();
  if (!trimmed) {
    list.innerHTML = `
      <div style="padding: 1.5rem; text-align: center; color: var(--text-muted); font-size: 0.85rem;">
        Tapez un mot-clé (ex: <em>hypertension, metformine, delirium, paracétamol, amoxicilline, urgence</em>)...
      </div>
    `;
    return;
  }

  const results = performGlobalSearch(trimmed);

  if (results.length === 0) {
    list.innerHTML = `
      <div style="padding: 1.5rem; text-align: center; color: var(--text-muted); font-size: 0.85rem;">
        Aucun résultat trouvé pour « <strong>${escHtml(trimmed)}</strong> ».
      </div>
    `;
    return;
  }

  list.innerHTML = results.slice(0, 15).map(res => `
    <div class="search-result-item" onclick="onSearchResultClick('${res.type}', '${res.id}')">
      <div class="search-res-title">
        ${res.isUrgent ? '🚨 ' : ''}${escHtml(res.title)}
      </div>
      <div class="search-res-snippet">${escHtml(res.snippet)}</div>
    </div>
  `).join('');
}

function onSearchResultClick(type, id) {
  closeSearchModal();
  if (type === 'general') {
    AppState.currentManual = 'general';
    renderSidebarNav();
    renderView('chapter', id);
  } else if (type === 'geriatrie') {
    AppState.currentManual = 'geriatrie';
    renderSidebarNav();
    renderView('fiche', parseInt(id, 10));
  } else if (type === 'drug') {
    renderView('drugs');
    setTimeout(() => {
      const searchInput = document.getElementById('drugSearchInput');
      if (searchInput) {
        searchInput.value = id;
        applyDrugFilters();
      }
    }, 50);
  }
}

/* ==========================================================================
   INITIALISATION DES ÉVÉNEMENTS
   ========================================================================== */
function initEventHandlers() {
  // Raccourci Ctrl+K / Cmd+K
  document.addEventListener('keydown', e => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      openSearchModal();
    }
    if (e.key === 'Escape') {
      closeSearchModal();
      toggleSidebar(false);
    }
  });

  // Filtre recherche latérale
  const sideSearch = document.getElementById('sidebarSearchInput');
  if (sideSearch) {
    sideSearch.addEventListener('input', e => {
      AppState.searchFilter = e.target.value;
      renderSidebarNav();
    });
  }

  // Toggle menu mobile et gestion du backdrop overlay
  const mobileBtn = document.getElementById('mobileMenuBtn');
  if (mobileBtn) {
    mobileBtn.addEventListener('click', (e) => {
      if (e && typeof e.stopPropagation === 'function') e.stopPropagation();
      toggleSidebar();
    });
  }

  const backdrop = document.getElementById('sidebarBackdrop');
  if (backdrop) {
    backdrop.addEventListener('click', () => {
      toggleSidebar(false);
    });
  }
}

// Exposer les utilitaires globaux pour exécution browser et tests automatisés
if (typeof window !== 'undefined') {
  window.AppState = AppState;
  window.normalizeStr = normalizeStr;
  window.performGlobalSearch = performGlobalSearch;
  window.buildSearchIndex = buildSearchIndex;
  window.applyDrugFilters = applyDrugFilters;
  window.filterDrugsTable = applyDrugFilters;
  window.toggleSidebar = toggleSidebar;
  window.ensureResponsiveTables = ensureResponsiveTables;
  window.safeStorageGet = safeStorageGet;
  window.safeStorageSet = safeStorageSet;
  window.safeStorageGetJSON = safeStorageGetJSON;
  window.safeStorageSetJSON = safeStorageSetJSON;
  window.memoryStore = memoryStore;
  window.copyChecklistNote = copyChecklistNote;
  window.showCopyFeedback = showCopyFeedback;
  window.fallbackCopyText = fallbackCopyText;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    AppState,
    normalizeStr,
    performGlobalSearch,
    buildSearchIndex,
    applyDrugFilters,
    filterDrugsTable: applyDrugFilters,
    toggleSidebar,
    ensureResponsiveTables,
    safeStorageGet,
    safeStorageSet,
    safeStorageGetJSON,
    safeStorageSetJSON,
    memoryStore,
    copyChecklistNote,
    showCopyFeedback,
    fallbackCopyText
  };
}
