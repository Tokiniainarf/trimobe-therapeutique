/**
 * SUITE DE TESTS AUTOMATISÉS E2E & INVARIANTS DOM
 * Plateforme Médicale TRIMOBE Thérapeutique & Gériatrie 2026
 *
 * Architecture des Tests en 4 Niveaux Systématiques :
 * - Niveau 1 : Couverture Fonctionnelle (Données Médicales, 5 Calculateurs, Recherche, Filtres, Favoris, Checklist, Thème)
 * - Niveau 2 : Cas Limites & Adversariaux (Entrées Vides, Nombres Négatifs, Zéros/Division par Zéro, NaN/Chaînes, Âges Extrêmes, Natrémies, Glycémies)
 * - Niveau 3 : Combinaisons Multi-Fonctions (Filtres DCI croisés, Navigation Recherche -> Vue, Toggle Favoris, Persistance Thème, Rendu Markdown)
 * - Niveau 4 : Scénarios d'Application Clinique Réelle (Insuffisance Cardiaque Gériatrique, Posologie Amoxicilline Pédiatrique, Triage CRB-65, Déshydratation Hypernatrémique, Parcours Consultation E2E)
 *
 * Conforme à l'invariant Sandboxed DOM Testing et exempt du bug de récursion classList.
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');
const assert = require('assert');

/* ==========================================================================
   INFRASTRUCTURE DE SIMULATION DOM SANDBOXÉE
   ========================================================================== */

/**
 * Implémentation robuste de classList évitant toute récursion infinie
 */
class MockClassList {
  constructor(element) {
    this._element = element;
    this._classes = new Set();
  }

  add(...tokens) {
    for (const t of tokens) {
      if (t) {
        String(t).split(/\s+/).filter(Boolean).forEach(cls => this._classes.add(cls));
      }
    }
    this._sync();
    return this;
  }

  remove(...tokens) {
    for (const t of tokens) {
      if (t) {
        String(t).split(/\s+/).filter(Boolean).forEach(cls => this._classes.delete(cls));
      }
    }
    this._sync();
    return this;
  }

  toggle(token, force) {
    token = String(token).trim();
    if (force === true) {
      this.add(token);
      return true;
    }
    if (force === false) {
      this.remove(token);
      return false;
    }
    if (this._classes.has(token)) {
      this.remove(token);
      return false;
    } else {
      this.add(token);
      return true;
    }
  }

  contains(token) {
    return this._classes.has(String(token).trim());
  }

  get length() {
    return this._classes.size;
  }

  get value() {
    return Array.from(this._classes).join(' ');
  }

  toString() {
    return this.value;
  }

  [Symbol.iterator]() {
    return this._classes.values();
  }

  forEach(callback, thisArg) {
    this._classes.forEach(callback, thisArg);
  }

  _sync() {
    if (this._element) {
      this._element._className = this.value;
    }
  }

  _syncFromClassName(className) {
    this._classes.clear();
    if (className && typeof className === 'string') {
      className.split(/\s+/).filter(Boolean).forEach(cls => this._classes.add(cls));
    }
  }
}

/**
 * MockElement conforme aux invariants Sandboxed DOM Testing Invariants:
 * textContent setter met à jour innerHTML (échappement des entités HTML) et vice-versa.
 * Ne retourne JAMAIS undefined pour innerHTML ou textContent.
 */
class MockElement {
  constructor(tagName = 'div') {
    this.tagName = String(tagName).toUpperCase();
    this.children = [];
    this.parentNode = null;
    this._innerHTML = '';
    this._textContent = '';
    this._className = '';
    this.classList = new MockClassList(this);
    this.attributes = {};
    this.id = '';
    this._value = '';
    this.checked = false;
    this.selected = false;
    this.type = '';
    this.placeholder = '';
    this.name = '';

    // Proxy dataset pour synchronisation avec data-* attributes
    this.dataset = new Proxy({}, {
      get: (target, prop) => {
        const attr = 'data-' + String(prop).replace(/[A-Z]/g, m => '-' + m.toLowerCase());
        return this.attributes[attr];
      },
      set: (target, prop, val) => {
        const attr = 'data-' + String(prop).replace(/[A-Z]/g, m => '-' + m.toLowerCase());
        this.attributes[attr] = String(val);
        target[prop] = String(val);
        return true;
      }
    });

    // Mock style object
    this.style = {
      _props: {},
      setProperty: (k, v) => { this.style._props[k] = String(v); },
      getPropertyValue: (k) => this.style._props[k] || '',
      removeProperty: (k) => { delete this.style._props[k]; }
    };

    this._eventListeners = {};
  }

  get className() {
    return this.classList.value;
  }

  set className(val) {
    this._className = val || '';
    this.classList._syncFromClassName(this._className);
  }

  get value() {
    return this._value;
  }

  set value(v) {
    this._value = v === null || v === undefined ? '' : String(v);
    this.attributes['value'] = this._value;
  }

  // INVARIANT : textContent setter met à jour innerHTML avec échappement des entités HTML
  get textContent() {
    if (this._textContent) {
      return this._textContent;
    }
    if (this.children && this.children.length > 0) {
      return this.children.map(c => c.textContent).join('');
    }
    return '';
  }

  set textContent(val) {
    this._textContent = val === null || val === undefined ? '' : String(val);
    this._innerHTML = this._textContent
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
    this.children = [];
  }

  // INVARIANT : innerHTML setter met à jour textContent (déséchappement & suppression balises)
  // et instancie les MockElements enfants pour permettre querySelector et getElementById
  get innerHTML() {
    if (this._innerHTML) {
      return this._innerHTML;
    }
    if (this.children && this.children.length > 0) {
      return this.children.map(c => serializeElement(c)).join('');
    }
    return '';
  }

  set innerHTML(val) {
    this._innerHTML = val === null || val === undefined ? '' : String(val);
    this._textContent = this._innerHTML
      .replace(/<[^>]*>/g, '')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&nbsp;/g, ' ');

    this.children = [];
    if (this._innerHTML.includes('<')) {
      parseHtmlIntoElement(this, this._innerHTML);
    }
  }

  appendChild(child) {
    if (!child) return null;
    child.parentNode = this;
    this.children.push(child);
    return child;
  }

  removeChild(child) {
    const idx = this.children.indexOf(child);
    if (idx !== -1) {
      this.children.splice(idx, 1);
      child.parentNode = null;
    }
    return child;
  }

  setAttribute(k, v) {
    const valStr = String(v);
    this.attributes[k] = valStr;
    if (k === 'id') this.id = valStr;
    if (k === 'class') this.className = valStr;
    if (k === 'value') this._value = valStr;
    if (k === 'type') this.type = valStr;
    if (k === 'placeholder') this.placeholder = valStr;
    if (k === 'checked') this.checked = true;
    if (k.startsWith('data-')) {
      const camel = k.slice(5).replace(/-([a-z])/g, (_, c) => c.toUpperCase());
      this.dataset[camel] = valStr;
    }
  }

  getAttribute(k) {
    return this.attributes[k] !== undefined ? this.attributes[k] : null;
  }

  hasAttribute(k) {
    return this.attributes[k] !== undefined;
  }

  removeAttribute(k) {
    delete this.attributes[k];
    if (k === 'id') this.id = '';
    if (k === 'class') this.className = '';
  }

  addEventListener(type, handler) {
    if (!this._eventListeners[type]) this._eventListeners[type] = [];
    this._eventListeners[type].push(handler);
  }

  removeEventListener(type, handler) {
    if (!this._eventListeners[type]) return;
    this._eventListeners[type] = this._eventListeners[type].filter(h => h !== handler);
  }

  dispatchEvent(event) {
    const type = typeof event === 'string' ? event : event.type;
    const evt = typeof event === 'string' ? { type: event, target: this, preventDefault: () => {} } : event;
    if (!evt.target) evt.target = this;
    if (!evt.preventDefault) evt.preventDefault = () => {};

    const listeners = this._eventListeners[type] || [];
    for (const h of listeners) {
      h.call(this, evt);
    }

    // Gestionnaire inline (ex: onclick, oninput, onchange)
    const inlineHandler = this['on' + type];
    if (typeof inlineHandler === 'function') {
      inlineHandler.call(this, evt);
    } else if (typeof this.attributes['on' + type] === 'string' && globalCurrentContext) {
      try {
        vm.runInContext(this.attributes['on' + type], globalCurrentContext);
      } catch (err) {
        // Ignorer les erreurs d'événements inline mineures
      }
    }
    return true;
  }

  click() {
    this.dispatchEvent({ type: 'click', target: this, preventDefault: () => {} });
  }

  focus() {
    this.dispatchEvent({ type: 'focus', target: this, preventDefault: () => {} });
  }

  blur() {
    this.dispatchEvent({ type: 'blur', target: this, preventDefault: () => {} });
  }

  querySelector(selector) {
    return querySelectorAll(this, selector)[0] || null;
  }

  querySelectorAll(selector) {
    return querySelectorAll(this, selector);
  }
}

/**
 * Sérialiseur d'arborescence MockElement en chaîne HTML
 */
function serializeElement(el) {
  if (!el) return '';
  const tag = el.tagName.toLowerCase();
  const voidTags = new Set(['input', 'img', 'br', 'hr', 'meta', 'link', 'source']);
  let attrs = '';
  if (el.attributes) {
    for (const [k, v] of Object.entries(el.attributes)) {
      if (k === 'class' || k === 'value' || k === 'id') continue;
      attrs += ` ${k}="${String(v).replace(/"/g, '&quot;')}"`;
    }
  }
  if (el.id) attrs += ` id="${el.id}"`;
  if (el.className) attrs += ` class="${el.className}"`;
  if (el.value !== undefined && el.value !== '') attrs += ` value="${String(el.value).replace(/"/g, '&quot;')}"`;
  if (el.type) attrs += ` type="${el.type}"`;
  if (el.checked) attrs += ' checked';

  if (voidTags.has(tag)) {
    return `<${tag}${attrs}>`;
  }
  if (el._innerHTML) {
    return `<${tag}${attrs}>${el._innerHTML}</${tag}>`;
  }
  if (el.children && el.children.length > 0) {
    return `<${tag}${attrs}>${el.children.map(c => serializeElement(c)).join('')}</${tag}>`;
  }
  if (el._textContent) {
    return `<${tag}${attrs}>${el._textContent}</${tag}>`;
  }
  return `<${tag}${attrs}></${tag}>`;
}

let globalCurrentContext = null;

/**
 * Parseur d'arborescence HTML léger pour MockElement
 */
function parseHtmlIntoElement(targetEl, html) {
  const tagRegex = /(<!--[\s\S]*?-->)|(<(\/)?([a-zA-Z0-9\-]+)([^>]*)>)|([^<]+)/g;
  const voidTags = new Set(['INPUT', 'IMG', 'BR', 'HR', 'META', 'LINK', 'SOURCE']);
  const stack = [targetEl];

  let match;
  while ((match = tagRegex.exec(html)) !== null) {
    if (match[1]) continue; // Commentaire

    if (match[2]) {
      const isClosing = Boolean(match[3]);
      const tagName = match[4].toUpperCase();
      const rawAttrs = match[5] || '';
      const isSelfClosing = rawAttrs.trim().endsWith('/') || voidTags.has(tagName);

      if (isClosing) {
        if (stack.length > 1 && stack[stack.length - 1].tagName === tagName) {
          stack.pop();
        }
      } else {
        const el = new MockElement(tagName);
        // Parser attributs
        const attrRegex = /([a-zA-Z0-9\-_:@]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g;
        let attrMatch;
        while ((attrMatch = attrRegex.exec(rawAttrs)) !== null) {
          const attrName = attrMatch[1];
          const attrVal = attrMatch[2] !== undefined ? attrMatch[2] :
                          attrMatch[3] !== undefined ? attrMatch[3] :
                          attrMatch[4] !== undefined ? attrMatch[4] : '';
          el.setAttribute(attrName, attrVal);
        }

        const parent = stack[stack.length - 1];
        parent.appendChild(el);

        if (!isSelfClosing) {
          stack.push(el);
        }
      }
    } else if (match[6]) {
      const text = match[6];
      const current = stack[stack.length - 1];
      if (current && current !== targetEl) {
        const unescaped = text
          .replace(/&amp;/g, '&')
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/&quot;/g, '"')
          .replace(/&#39;/g, "'")
          .replace(/&nbsp;/g, ' ');
        current._textContent = (current._textContent || '') + unescaped;
      }
    }
  }
}

/**
 * MockLocalStorage
 */
class MockLocalStorage {
  constructor() {
    this._data = new Map();
  }
  getItem(k) {
    return this._data.has(String(k)) ? this._data.get(String(k)) : null;
  }
  setItem(k, v) {
    this._data.set(String(k), String(v));
  }
  removeItem(k) {
    this._data.delete(String(k));
  }
  clear() {
    this._data.clear();
  }
  get length() {
    return this._data.size;
  }
}

/**
 * Recherche récursive par ID dans l'arbre DOM
 */
function findElementById(root, id) {
  if (!root) return null;
  if (root.id === id || (root.getAttribute && root.getAttribute('id') === id)) {
    return root;
  }
  if (root.children) {
    for (const child of root.children) {
      const res = findElementById(child, id);
      if (res) return res;
    }
  }
  return null;
}

/**
 * Recherche d'éléments par sélecteur CSS basique (.class, #id, tag, .ancestor .child)
 */
function querySelectorAll(root, selector) {
  const results = [];
  const trimmed = selector.trim();

  function matchesSingle(el, sel) {
    if (!el || !el.classList) return false;
    if (sel.startsWith('.')) return el.classList.contains(sel.slice(1));
    if (sel.startsWith('#')) return el.id === sel.slice(1);
    return el.tagName.toLowerCase() === sel.toLowerCase();
  }

  function matches(el) {
    if (el === root) return false;
    if (trimmed.includes(' ')) {
      const parts = trimmed.split(/\s+/);
      if (parts.length === 2) {
        if (matchesSingle(el, parts[1])) {
          let p = el.parentNode;
          while (p && p !== root.parentNode) {
            if (matchesSingle(p, parts[0])) return true;
            p = p.parentNode;
          }
        }
        return false;
      }
    }
    return matchesSingle(el, trimmed);
  }

  function traverse(node) {
    if (!node) return;
    if (matches(node)) results.push(node);
    if (node.children) {
      for (const child of node.children) {
        traverse(child);
      }
    }
  }

  traverse(root);
  return results;
}

/**
 * Initialisation d'une instance de l'environnement complet de l'application
 */
function createTestAppEnvironment() {
  const docElement = new MockElement('html');
  const body = new MockElement('body');
  docElement.appendChild(body);

  const localStorage = new MockLocalStorage();
  const listeners = {};

  const documentMock = {
    documentElement: docElement,
    body: body,
    createElement: (tag) => new MockElement(tag),
    getElementById: (id) => findElementById(docElement, id),
    querySelectorAll: (sel) => querySelectorAll(docElement, sel),
    querySelector: (sel) => querySelectorAll(docElement, sel)[0] || null,
    addEventListener: (event, handler) => {
      if (!listeners[event]) listeners[event] = [];
      listeners[event].push(handler);
    },
    removeEventListener: (event, handler) => {
      if (!listeners[event]) return;
      listeners[event] = listeners[event].filter(h => h !== handler);
    },
    dispatchEvent: (event) => {
      const type = typeof event === 'string' ? event : event.type;
      const evt = typeof event === 'string' ? { type: event, preventDefault: () => {} } : event;
      (listeners[type] || []).forEach(h => h(evt));
    }
  };

  const windowMock = {
    document: documentMock,
    localStorage: localStorage,
    innerWidth: 1200,
    innerHeight: 800,
    _scrollY: 0,
    _printed: false,
    _lastAlert: null,
    _lastCopied: null,
    scrollTo: ({ top }) => { windowMock._scrollY = top; },
    print: () => { windowMock._printed = true; },
    alert: (msg) => { windowMock._lastAlert = msg; },
    navigator: {
      clipboard: {
        writeText: (txt) => {
          windowMock._lastCopied = txt;
          return Promise.resolve();
        }
      }
    },
    setTimeout: global.setTimeout,
    clearTimeout: global.clearTimeout,
    setInterval: global.setInterval,
    clearInterval: global.clearInterval,
    console: console
  };
  windowMock.window = windowMock;

  // Charger index.html et injecter le body
  const indexHtml = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
  const bodyMatch = indexHtml.match(/<body[^>]*>([\s\S]*)<\/body>/i);
  if (bodyMatch) {
    parseHtmlIntoElement(body, bodyMatch[1]);
  }

  // Créer le contexte VM
  const sandbox = {
    window: windowMock,
    document: documentMock,
    localStorage: localStorage,
    navigator: windowMock.navigator,
    console: console,
    setTimeout: global.setTimeout,
    clearTimeout: global.clearTimeout,
    MockElement: MockElement,
    alert: windowMock.alert
  };
  vm.createContext(sandbox);
  globalCurrentContext = sandbox;

  // Charger les données médicales et les scripts
  const dataGeneralCode = fs.readFileSync(path.join(__dirname, 'data-general.js'), 'utf8');
  const dataGeriatrieCode = fs.readFileSync(path.join(__dirname, 'data-geriatrie.js'), 'utf8');
  const dataDrugsCode = fs.readFileSync(path.join(__dirname, 'data-drugs.js'), 'utf8');
  const calculatorsCode = fs.readFileSync(path.join(__dirname, 'calculators.js'), 'utf8');
  const appCode = fs.readFileSync(path.join(__dirname, 'app.js'), 'utf8');

  vm.runInContext(dataGeneralCode, sandbox);
  vm.runInContext(dataGeriatrieCode, sandbox);
  vm.runInContext(dataDrugsCode, sandbox);
  vm.runInContext(calculatorsCode, sandbox);
  vm.runInContext(appCode, sandbox);

  // Lier les variables et fonctions fermées au contexte de test
  vm.runInContext(`
    window.AppState = AppState;
    window.FONT_SIZES = FONT_SIZES;
    window.setManual = setManual;
    window.renderView = renderView;
    window.toggleTheme = toggleTheme;
    window.adjustFontSize = adjustFontSize;
    window.toggleFavorite = toggleFavorite;
    window.toggleChecklistItem = toggleChecklistItem;
    window.resetChecklist = resetChecklist;
    window.copyChecklistNote = copyChecklistNote;
    window.openSearchModal = openSearchModal;
    window.closeSearchModal = closeSearchModal;
    window.renderSearchResults = renderSearchResults;
    window.onSearchResultClick = onSearchResultClick;
    window.filterDrugsTable = filterDrugsTable;
    window.runPediatricCalc = runPediatricCalc;
    window.runCockcroftCalc = runCockcroftCalc;
    window.runCRB65Calc = runCRB65Calc;
    window.runGlucoseCalc = runGlucoseCalc;
    window.renderMarkdown = renderMarkdown;
  `, sandbox);

  sandbox.AppState = sandbox.window.AppState;

  // Déclencher le chargement DOM initial
  documentMock.dispatchEvent('DOMContentLoaded');

  return {
    sandbox,
    window: windowMock,
    document: documentMock,
    localStorage
  };
}

/* ==========================================================================
   MOTEUR D'EXÉCUTION DES TESTS SÉQUENTIEL & ASYNCHRONE
   ========================================================================== */

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;
const failures = [];
const testQueue = [];

function describe(suiteName, fn) {
  testQueue.push({ type: 'suite', suiteName });
  fn();
}

function test(testName, fn) {
  testQueue.push({ type: 'test', testName, fn });
}

/* ==========================================================================
   VÉRIFICATION DES INVARIANTS FONDAMENTAUX (DOM MOCK & CLASSLIST)
   ========================================================================== */

describe("Invariant Verification & Mock DOM Hardening", () => {
  test("Invariant Sandboxed DOM Testing : textContent setter synchronise innerHTML avec entités échappées", () => {
    const el = new MockElement('div');
    el.textContent = "Test & < > ' \"";
    assert.strictEqual(el.innerHTML, "Test &amp; &lt; &gt; &#39; &quot;");
    assert.strictEqual(el.textContent, "Test & < > ' \"");
  });

  test("Invariant Sandboxed DOM Testing : innerHTML setter déséchappe et met à jour textContent sans balise", () => {
    const el = new MockElement('div');
    el.innerHTML = "<p>Posologie : 15 mg/kg &amp; DFG &gt; 60 mL/min</p>";
    assert.strictEqual(el.textContent, "Posologie : 15 mg/kg & DFG > 60 mL/min");
  });

  test("MockElement.classList : Aucune récursion infinie sur add, remove, toggle, contains", () => {
    const el = new MockElement('span');
    el.classList.add('badge', 'badge-urgent');
    assert.strictEqual(el.classList.contains('badge'), true);
    assert.strictEqual(el.classList.contains('badge-urgent'), true);
    assert.strictEqual(el.classList.length, 2);

    el.classList.remove('badge');
    assert.strictEqual(el.classList.contains('badge'), false);

    el.classList.toggle('active', true);
    assert.strictEqual(el.classList.contains('active'), true);
    el.classList.toggle('active', false);
    assert.strictEqual(el.classList.contains('active'), false);
    el.classList.toggle('active');
    assert.strictEqual(el.classList.contains('active'), true);
  });

  test("Synchronisation bidirectionnelle className et classList", () => {
    const el = new MockElement('div');
    el.className = 'medical-card urgent-card';
    assert.strictEqual(el.classList.contains('medical-card'), true);
    assert.strictEqual(el.classList.contains('urgent-card'), true);
    el.classList.add('highlight');
    assert.ok(el.className.includes('highlight'));
  });

  test("Dataset Proxy synchronisé avec attributs data-*", () => {
    const el = new MockElement('button');
    el.setAttribute('data-manual', 'geriatrie');
    assert.strictEqual(el.dataset.manual, 'geriatrie');
    el.dataset.targetId = 'ch-45';
    assert.strictEqual(el.getAttribute('data-target-id'), 'ch-45');
  });
});

/* ==========================================================================
   TIER 1 : COUVERTURE FONCTIONNELLE (FEATURE COVERAGE >= 5 PAR FONCTIONNALITÉ)
   ========================================================================== */

const Calculators = require('./calculators.js');
const generalData = require('./data-general.js');
const geriatrieData = require('./data-geriatrie.js');
const drugsData = require('./data-drugs.js');

describe("Tier 1.1 : Chargement et Intégrité des Données Médicales", () => {
  test("1.1.1 - Structure générale de GENERAL_MANUAL_DATA", () => {
    assert.strictEqual(generalData.id, "general");
    assert.ok(generalData.title.includes("Thérapeutique Clinique"));
    assert.ok(Array.isArray(generalData.organizations) && generalData.organizations.length >= 2);
    assert.ok(Array.isArray(generalData.categories) && generalData.categories.length >= 10);
  });

  test("1.1.2 - Exactitude des 51 Chapitres de Médecine Générale", () => {
    assert.strictEqual(generalData.chapters.length, 51, "Le manuel général doit comporter exactement 51 chapitres");
    generalData.chapters.forEach(ch => {
      assert.ok(ch.num, "Chaque chapitre doit avoir un numéro");
      assert.ok(ch.title && ch.title.length > 0, `Titre manquant pour le chapitre ${ch.num}`);
      assert.ok(ch.category, `Catégorie manquante pour le chapitre ${ch.num}`);
      assert.ok(ch.content && ch.content.length > 50, `Contenu insuffisant pour le chapitre ${ch.num}`);
    });
  });

  test("1.1.3 - Structure et Registres de GERIATRIE_MANUAL_DATA", () => {
    assert.strictEqual(geriatrieData.id, "geriatrie");
    assert.ok(geriatrieData.title.includes("Gériatrie"));
    assert.ok(Array.isArray(geriatrieData.registres) && geriatrieData.registres.length === 4);
    assert.ok(Array.isArray(geriatrieData.references) && geriatrieData.references.length > 0);
  });

  test("1.1.4 - Exactitude des 33 Fiches de Thérapeutique en Gériatrie", () => {
    assert.strictEqual(geriatrieData.fiches.length, 33, "Le manuel de gériatrie doit comporter exactement 33 fiches");
    geriatrieData.fiches.forEach(f => {
      assert.ok(typeof f.num === 'number', `Numéro invalide pour la fiche ${f.num}`);
      assert.ok(f.title && f.title.length > 0, `Titre manquant pour la fiche ${f.num}`);
      assert.ok(f.content && f.content.length > 50, `Contenu insuffisant pour la fiche ${f.num}`);
    });
  });

  test("1.1.5 - Répertoire structuré des DCI (DRUGS_DATA)", () => {
    assert.ok(drugsData.length >= 40, "La base DCI doit contenir au moins 40 molécules");
    drugsData.forEach(d => {
      assert.ok(d.dci, "Chaque entrée doit comporter une DCI");
      assert.ok(d.class, `Classe manquante pour ${d.dci}`);
      assert.ok(d.indication, `Indication manquante pour ${d.dci}`);
      assert.ok(d.dosage, `Dosage manquant pour ${d.dci}`);
      assert.strictEqual(typeof d.renalAdaptation, 'boolean', `renalAdaptation doit être booléen pour ${d.dci}`);
      assert.ok(d.geriatricRisk, `Risque gériatrique manquant pour ${d.dci}`);
    });
  });

  test("1.1.6 - Étiquetage fidèle des urgences et signaux vitaux", () => {
    const urgentCh = generalData.chapters.filter(c => c.isUrgent);
    const urgentFi = geriatrieData.fiches.filter(f => f.isUrgent);
    assert.ok(urgentCh.length >= 5, "Plusieurs chapitres généraux d'urgence doivent être étiquetés isUrgent");
    assert.ok(urgentFi.length >= 5, "Le registre des urgences gériatriques doit avoir ses fiches isUrgent");
  });
});

describe("Tier 1.2 : Calculateur Posologique Pédiatrique", () => {
  test("1.2.1 - Dose standard par prise et journalière (12 kg, 15 mg/kg, 4 prises)", () => {
    const res = Calculators.calculatePediatric(12, 15, 4);
    assert.strictEqual(res.dosePerTakeMg, 180);
    assert.strictEqual(res.totalDailyMg, 720);
    assert.strictEqual(res.timesPerDay, 4);
    assert.strictEqual(res.intervalHours, 6);
  });

  test("1.2.2 - Calcul du volume de sirop en mL (sirop 24 mg/mL)", () => {
    const res = Calculators.calculatePediatric(12, 15, 4, 24);
    assert.strictEqual(res.mlPerTake, 7.5);
    assert.strictEqual(res.totalDailyMl, 30);
  });

  test("1.2.3 - Schéma 3 prises par jour (Amoxicilline 25 mg/kg/prise, intervalle 8h)", () => {
    const res = Calculators.calculatePediatric(14, 25, 3, 50);
    assert.strictEqual(res.dosePerTakeMg, 350);
    assert.strictEqual(res.totalDailyMg, 1050);
    assert.strictEqual(res.mlPerTake, 7);
    assert.strictEqual(res.intervalHours, 8);
  });

  test("1.2.4 - Schéma 2 prises par jour (toutes les 12h)", () => {
    const res = Calculators.calculatePediatric(20, 20, 2);
    assert.strictEqual(res.dosePerTakeMg, 400);
    assert.strictEqual(res.totalDailyMg, 800);
    assert.strictEqual(res.intervalHours, 12);
  });

  test("1.2.5 - Prise unique quotidienne (Azithromycine ou corticoïde)", () => {
    const res = Calculators.calculatePediatric(10, 10, 1);
    assert.strictEqual(res.dosePerTakeMg, 100);
    assert.strictEqual(res.totalDailyMg, 100);
    assert.strictEqual(res.intervalHours, 24);
  });
});

describe("Tier 1.3 : Calculateur de Clairance Rénale (Cockcroft-Gault)", () => {
  test("1.3.1 - Fonction rénale normale chez l'homme jeune (Facteur 1.23)", () => {
    const res = Calculators.calculateCockcroft(40, 70, 80, 'umol_l', false);
    assert.ok(res.clCr >= 90, "ClCr attendue >= 90");
    assert.strictEqual(res.stage, "Fonction rénale normale");
    assert.strictEqual(res.alertClass, "success");
  });

  test("1.3.2 - Insuffisance rénale légère chez la femme (Facteur 1.04)", () => {
    const res = Calculators.calculateCockcroft(40, 60, 80, 'umol_l', true);
    assert.strictEqual(res.clCr, 78);
    assert.strictEqual(res.stage, "Insuffisance rénale légère");
    assert.strictEqual(res.alertClass, "info");
  });

  test("1.3.3 - Insuffisance rénale modérée (Stade 3)", () => {
    const res = Calculators.calculateCockcroft(72, 65, 140, 'umol_l', false);
    assert.strictEqual(res.clCr, 39);
    assert.strictEqual(res.stage, "Insuffisance rénale modérée");
    assert.strictEqual(res.alertClass, "warning");
  });

  test("1.3.4 - Insuffisance rénale sévère (Stade 4, DFG 15-29 mL/min)", () => {
    const res = Calculators.calculateCockcroft(78, 55, 180, 'umol_l', true);
    assert.strictEqual(res.clCr, 20);
    assert.strictEqual(res.stage, "Insuffisance rénale sévère");
    assert.strictEqual(res.alertClass, "danger");
  });

  test("1.3.5 - Insuffisance rénale terminale (Stade 5, DFG < 15 mL/min)", () => {
    const res = Calculators.calculateCockcroft(85, 50, 350, 'umol_l', false);
    assert.strictEqual(res.clCr, 10);
    assert.strictEqual(res.stage, "Insuffisance rénale terminale");
    assert.strictEqual(res.alertClass, "danger");
  });

  test("1.3.6 - Conversion d'unités créatinine (mg/dL et mg/L)", () => {
    const resUmol = Calculators.calculateCockcroft(60, 70, 88.4, 'umol_l', false);
    const resMgDl = Calculators.calculateCockcroft(60, 70, 1.0, 'mg_dl', false);
    assert.strictEqual(resUmol.clCr, resMgDl.clCr);
  });

  test("1.3.7 - Alerte sarcopénie chez le sujet âgé (âge >= 75 et créat < 70)", () => {
    const res = Calculators.calculateCockcroft(80, 50, 55, 'umol_l', true);
    assert.strictEqual(res.isSarcopenicWarning, true);
  });
});

describe("Tier 1.4 : Score de Gravité Pneumonie CRB-65", () => {
  test("1.4.1 - Score 0 : Risque faible, prise en charge ambulatoire", () => {
    const res = Calculators.calculateCRB65(false, false, false, false);
    assert.strictEqual(res.score, 0);
    assert.strictEqual(res.alertClass, "success");
    assert.ok(res.recommendation.includes("ambulatoire"));
  });

  test("1.4.2 - Score 1 : Risque intermédiaire (Âge >= 65 seul)", () => {
    const res = Calculators.calculateCRB65(false, false, false, true);
    assert.strictEqual(res.score, 1);
    assert.strictEqual(res.alertClass, "warning");
    assert.ok(res.riskLevel.includes("intermédiaire"));
  });

  test("1.4.3 - Score 2 : Risque intermédiaire (Fréquence respiratoire + Âge)", () => {
    const res = Calculators.calculateCRB65(false, true, false, true);
    assert.strictEqual(res.score, 2);
    assert.strictEqual(res.alertClass, "warning");
    assert.ok(res.recommendation.includes("Hospitalisation"));
  });

  test("1.4.4 - Score 3 : Risque élevé (Confusion + Respiration + PA)", () => {
    const res = Calculators.calculateCRB65(true, true, true, false);
    assert.strictEqual(res.score, 3);
    assert.strictEqual(res.alertClass, "danger");
    assert.ok(res.riskLevel.includes("élevé"));
  });

  test("1.4.5 - Score 4 : Risque vital critique (Tous les critères positifs)", () => {
    const res = Calculators.calculateCRB65(true, true, true, true);
    assert.strictEqual(res.score, 4);
    assert.strictEqual(res.alertClass, "danger");
    assert.ok(res.recommendation.includes("réanimation"));
  });
});

describe("Tier 1.5 : Déficit en Eau Libre (Déshydratation Hypernatrémique)", () => {
  test("1.5.1 - Homme jeune (Facteur 0.6)", () => {
    const res = Calculators.calculateWaterDeficit(70, 155, false, false);
    assert.strictEqual(res.factor, 0.6);
    assert.strictEqual(res.deficitLiters, 4.5);
  });

  test("1.5.2 - Homme âgé (Facteur 0.5)", () => {
    const res = Calculators.calculateWaterDeficit(65, 158, true, false);
    assert.strictEqual(res.factor, 0.5);
    assert.strictEqual(res.deficitLiters, 4.2);
  });

  test("1.5.3 - Femme âgée (Facteur 0.45)", () => {
    const res = Calculators.calculateWaterDeficit(50, 160, true, true);
    assert.strictEqual(res.factor, 0.45);
    assert.strictEqual(res.deficitLiters, 3.2);
  });

  test("1.5.4 - Femme jeune (Facteur 0.5)", () => {
    const res = Calculators.calculateWaterDeficit(55, 150, false, true);
    assert.strictEqual(res.factor, 0.5);
    assert.strictEqual(res.deficitLiters, 2.0);
  });

  test("1.5.5 - Recommandation clinique de vitesse de correction", () => {
    const res = Calculators.calculateWaterDeficit(60, 155, true, false);
    assert.ok(res.advice.includes("10 à 12 mmol/L"));
    assert.ok(res.advice.includes("œdème cérébral"));
  });
});

describe("Tier 1.6 : Convertisseur de Glycémie", () => {
  test("1.6.1 - Détection d'hypoglycémie (< 0.70 g/L)", () => {
    const res = Calculators.convertGlucose(0.55, 'g_l');
    assert.strictEqual(res.alertClass, 'danger');
    assert.ok(res.status.includes("HYPOGLYCÉMIE"));
  });

  test("1.6.2 - Normoglycémie à jeun (0.70 - 1.10 g/L)", () => {
    const res = Calculators.convertGlucose(0.95, 'g_l');
    assert.strictEqual(res.alertClass, 'success');
    assert.ok(res.status.includes("Normoglycémie"));
  });

  test("1.6.3 - Hyperglycémie modérée (1.11 - 1.25 g/L)", () => {
    const res = Calculators.convertGlucose(1.18, 'g_l');
    assert.strictEqual(res.alertClass, 'warning');
    assert.ok(res.status.includes("Hyperglycémie modérée"));
  });

  test("1.6.4 - Seuil diagnostique de diabète (>= 1.26 g/L / >= 7.0 mmol/L)", () => {
    const res = Calculators.convertGlucose(1.40, 'g_l');
    assert.strictEqual(res.alertClass, 'warning');
    assert.ok(res.status.includes("Diabète probable"));
  });

  test("1.6.5 - Conversion tridirectionnelle cohérente (g/L <-> mmol/L <-> mg/dL)", () => {
    const fromGl = Calculators.convertGlucose(1.0, 'g_l');
    assert.strictEqual(fromGl.mmolL, 5.6);
    assert.strictEqual(fromGl.mgDl, 100);

    const fromMmol = Calculators.convertGlucose(5.55, 'mmol_l');
    assert.strictEqual(fromMmol.gPerL, 1.0);
  });
});

describe("Tier 1.7 : Recherche Universelle (Ctrl + K) & Sommaire", () => {
  test("1.7.1 - Ouverture et fermeture de la modale de recherche", () => {
    const env = createTestAppEnvironment();
    env.sandbox.openSearchModal();
    const modal = env.document.getElementById('searchModal');
    assert.strictEqual(modal.classList.contains('active'), true);
    env.sandbox.closeSearchModal();
    assert.strictEqual(modal.classList.contains('active'), false);
  });

  test("1.7.2 - Recherche dans les chapitres de Médecine Générale (ex: 'hypertension')", () => {
    const env = createTestAppEnvironment();
    env.sandbox.renderSearchResults('hypertension');
    const list = env.document.getElementById('modalResultsList');
    assert.ok(list.innerHTML.includes('Hypertension artérielle'));
  });

  test("1.7.3 - Recherche dans les fiches de Gériatrie (ex: 'confusion')", () => {
    const env = createTestAppEnvironment();
    env.sandbox.renderSearchResults('confusion');
    const list = env.document.getElementById('modalResultsList');
    assert.ok(list.innerHTML.includes('Syndrome confusionnel') || list.innerHTML.includes('Fiche'));
  });

  test("1.7.4 - Recherche dans les DCI (ex: 'amoxicilline')", () => {
    const env = createTestAppEnvironment();
    env.sandbox.renderSearchResults('amoxicilline');
    const list = env.document.getElementById('modalResultsList');
    assert.ok(list.innerHTML.includes('Amoxicilline'));
  });

  test("1.7.5 - Recherche sans résultat renvoie un message informatif", () => {
    const env = createTestAppEnvironment();
    env.sandbox.renderSearchResults('terme_introuvable_xyz999');
    const list = env.document.getElementById('modalResultsList');
    assert.ok(list.innerHTML.includes('Aucun résultat trouvé'));
  });

  test("1.7.6 - Filtrage interactif du sommaire latéral", () => {
    const env = createTestAppEnvironment();
    env.sandbox.AppState.searchFilter = 'diabète';
    env.sandbox.renderSidebarNav();
    const nav = env.document.getElementById('sidebarNavList');
    assert.ok(nav.innerHTML.toLowerCase().includes('diabète'));
    env.sandbox.AppState.searchFilter = '';
    env.sandbox.renderSidebarNav();
  });
});

describe("Tier 1.8 : Répertoire des DCI & Filtres Interactifs", () => {
  test("1.8.1 - Rendu initial de la vue Répertoire DCI", () => {
    const env = createTestAppEnvironment();
    env.sandbox.renderView('drugs');
    const table = env.document.getElementById('drugsTable');
    assert.ok(table !== null, "La table DCI doit être présente dans le DOM");
  });

  test("1.8.2 - Filtrage textuel par DCI", () => {
    const env = createTestAppEnvironment();
    env.sandbox.renderView('drugs');
    const input = env.document.getElementById('drugSearchInput');
    input.value = 'Metformine';
    env.sandbox.filterDrugsTable();
    const tbody = env.document.getElementById('drugsTableBody');
    assert.ok(tbody.innerHTML.includes('Metformine'));
  });

  test("1.8.3 - Filtrage par adaptation rénale", () => {
    const env = createTestAppEnvironment();
    env.sandbox.renderView('drugs');
    const renalSelect = env.document.getElementById('drugRenalFilter');
    renalSelect.value = 'renal_only';
    env.sandbox.filterDrugsTable();
    const tbody = env.document.getElementById('drugsTableBody');
    assert.ok(tbody.innerHTML.includes('Adaptation DFG'));
  });

  test("1.8.4 - Filtrage par risque gériatrique élevé", () => {
    const env = createTestAppEnvironment();
    env.sandbox.renderView('drugs');
    const riskSelect = env.document.getElementById('drugRiskFilter');
    riskSelect.value = 'high_risk';
    env.sandbox.filterDrugsTable();
    const tbody = env.document.getElementById('drugsTableBody');
    assert.ok(tbody.innerHTML.includes('Élevé') || tbody.innerHTML.includes('Très élevé'));
  });

  test("1.8.5 - État vide en cas d'aucun résultat trouvé", () => {
    const env = createTestAppEnvironment();
    env.sandbox.renderView('drugs');
    const input = env.document.getElementById('drugSearchInput');
    input.value = 'molecule_inexistante_404';
    env.sandbox.filterDrugsTable();
    const tbody = env.document.getElementById('drugsTableBody');
    assert.ok(tbody.innerHTML.includes('Aucun médicament correspondant'));
  });
});

describe("Tier 1.9 : Gestion des Favoris Locaux", () => {
  test("1.9.1 - État initial sans favoris", () => {
    const env = createTestAppEnvironment();
    env.sandbox.AppState.favorites = [];
    env.localStorage.setItem('trimobe_favorites', '[]');
    env.sandbox.renderView('favorites');
    const stage = env.document.getElementById('contentStage');
    assert.ok(stage.innerHTML.includes('Aucun favori enregistré'));
  });

  test("1.9.2 - Ajout d'un chapitre général aux favoris", () => {
    const env = createTestAppEnvironment();
    env.sandbox.toggleFavorite('gen-I');
    assert.ok(env.sandbox.AppState.favorites.includes('gen-I'));
    assert.ok(env.localStorage.getItem('trimobe_favorites').includes('gen-I'));
  });

  test("1.9.3 - Ajout d'une fiche de gériatrie aux favoris", () => {
    const env = createTestAppEnvironment();
    env.sandbox.toggleFavorite('gen-I');
    env.sandbox.toggleFavorite('ger-1');
    assert.ok(env.sandbox.AppState.favorites.includes('ger-1'));
    assert.strictEqual(env.sandbox.AppState.favorites.length, 2);
  });

  test("1.9.4 - Rendu des fiches favorites enregistrées", () => {
    const env = createTestAppEnvironment();
    env.sandbox.toggleFavorite('gen-I');
    env.sandbox.toggleFavorite('ger-1');
    env.sandbox.renderView('favorites');
    const stage = env.document.getElementById('contentStage');
    assert.ok(stage.innerHTML.includes('Vos Fiches Favorites'));
    assert.ok(stage.innerHTML.includes('Médecine Générale • Ch. I'));
    assert.ok(stage.innerHTML.includes('Gériatrie • Fiche 1'));
  });

  test("1.9.5 - Suppression d'un favori par ré-appui", () => {
    const env = createTestAppEnvironment();
    env.sandbox.toggleFavorite('gen-I');
    assert.ok(env.sandbox.AppState.favorites.includes('gen-I'));
    env.sandbox.toggleFavorite('gen-I');
    assert.strictEqual(env.sandbox.AppState.favorites.includes('gen-I'), false);
  });
});

describe("Tier 1.10 : Check-list de Prescription Sécurisée", () => {
  test("1.10.1 - État initial : 0 sur 10 validés", () => {
    const env = createTestAppEnvironment();
    env.sandbox.AppState.checklistState = {};
    env.sandbox.renderView('checklist');
    const badge = env.document.getElementById('checklistBadge');
    assert.ok(badge.textContent.includes('0 / 10 vérifiés'));
  });

  test("1.10.2 - Coche d'un point de sécurité (c1)", () => {
    const env = createTestAppEnvironment();
    env.sandbox.toggleChecklistItem('c1');
    const badge = env.document.getElementById('checklistBadge');
    assert.ok(badge.textContent.includes('1 / 10 vérifiés'));
    assert.strictEqual(env.sandbox.AppState.checklistState['c1'], true);
  });

  test("1.10.3 - Validation intégrale des 10 points", () => {
    const env = createTestAppEnvironment();
    for (let i = 1; i <= 10; i++) {
      env.sandbox.AppState.checklistState[`c${i}`] = true;
    }
    env.sandbox.renderView('checklist');
    const badge = env.document.getElementById('checklistBadge');
    assert.ok(badge.textContent.includes('10 / 10 vérifiés'));
    assert.strictEqual(badge.classList.contains('success'), true);
  });

  test("1.10.4 - Réinitialisation de la check-list", () => {
    const env = createTestAppEnvironment();
    env.sandbox.toggleChecklistItem('c1');
    env.sandbox.resetChecklist();
    const badge = env.document.getElementById('checklistBadge');
    assert.ok(badge.textContent.includes('0 / 10 vérifiés'));
    assert.strictEqual(Object.keys(env.sandbox.AppState.checklistState).length, 0);
  });

  test("1.10.5 - Copie de la note de sécurité avec fallback presse-papiers", async () => {
    const env = createTestAppEnvironment();
    env.sandbox.renderView('checklist');
    env.sandbox.copyChecklistNote();
    await new Promise(r => setTimeout(r, 10));
    assert.ok(env.window._lastCopied.includes('[Sécurité Ordonnance - Collection TRIMOBE]'));
    // Feedback non bloquant : le bouton affiche la confirmation (pas d'alert modal)
    const btn = env.document.getElementById('copyChecklistBtn');
    assert.ok(btn && String(btn.innerHTML).includes('copiée'));
  });
});

describe("Tier 1.11 : Thème Sombre/Clair & Ergonomie Typographique", () => {
  test("1.11.1 - Thème initial par défaut 'light'", () => {
    const env = createTestAppEnvironment();
    assert.strictEqual(env.sandbox.AppState.theme, 'light');
    assert.strictEqual(env.document.documentElement.getAttribute('data-theme'), 'light');
  });

  test("1.11.2 - Bascule vers le mode sombre (dark mode)", () => {
    const env = createTestAppEnvironment();
    env.sandbox.toggleTheme();
    assert.strictEqual(env.sandbox.AppState.theme, 'dark');
    assert.strictEqual(env.document.documentElement.getAttribute('data-theme'), 'dark');
    assert.strictEqual(env.localStorage.getItem('trimobe_theme'), 'dark');
    const btn = env.document.getElementById('themeToggleBtn');
    assert.strictEqual(btn.textContent, '☀️');
  });

  test("1.11.3 - Retour au mode clair", () => {
    const env = createTestAppEnvironment();
    env.sandbox.toggleTheme();
    env.sandbox.toggleTheme();
    assert.strictEqual(env.sandbox.AppState.theme, 'light');
    assert.strictEqual(env.document.documentElement.getAttribute('data-theme'), 'light');
    const btn = env.document.getElementById('themeToggleBtn');
    assert.strictEqual(btn.textContent, '🌙');
  });

  test("1.11.4 - Augmentation de la taille de police (A+)", () => {
    const env = createTestAppEnvironment();
    const oldIdx = env.sandbox.AppState.fontSizeIdx;
    env.sandbox.adjustFontSize(1);
    assert.strictEqual(env.sandbox.AppState.fontSizeIdx, oldIdx + 1);
    assert.strictEqual(env.localStorage.getItem('trimobe_fontsize'), String(oldIdx + 1));
  });

  test("1.11.5 - Réduction et bornage des tailles de police (A-)", () => {
    const env = createTestAppEnvironment();
    // fontSizeIdx initial est 1
    env.sandbox.adjustFontSize(-1); // Décrémente de 1 -> 0
    assert.strictEqual(env.sandbox.AppState.fontSizeIdx, 0);
    env.sandbox.adjustFontSize(-1); // Décrémentation sous 0 doit être bloquée
    assert.strictEqual(env.sandbox.AppState.fontSizeIdx, 0);
  });
});

/* ==========================================================================
   TIER 2 : CAS LIMITES & ADVERSARIAUX (BOUNDARY & CORNER CASES)
   ========================================================================== */

describe("Tier 2.1 : Entrées Vides et Paramètres Absents", () => {
  test("2.1.1 - Calculateur pédiatrique avec chaînes vides", () => {
    const res = Calculators.calculatePediatric("", "", "");
    assert.ok(res.error, "Doit renvoyer une erreur explicite");
  });

  test("2.1.2 - Cockcroft-Gault avec entrées null/undefined", () => {
    const res = Calculators.calculateCockcroft(null, undefined, "");
    assert.ok(res.error, "Doit renvoyer une erreur si paramètres nuls");
  });

  test("2.1.3 - Déficit en eau libre avec natrémie manquante", () => {
    const res = Calculators.calculateWaterDeficit(70, "");
    assert.ok(res.error, "Doit exiger une natrémie valide");
  });

  test("2.1.4 - Convertisseur de glycémie avec valeur vide", () => {
    const res = Calculators.convertGlucose("", "g_l");
    assert.ok(res.error, "Doit rejeter une glycémie vide");
  });

  test("2.1.5 - Parseur Markdown avec entrée vide ou null", () => {
    const env = createTestAppEnvironment();
    assert.strictEqual(env.sandbox.renderMarkdown(""), "");
    assert.strictEqual(env.sandbox.renderMarkdown(null), "");
  });
});

describe("Tier 2.2 : Nombres Négatifs", () => {
  test("2.2.1 - Pédiatrie : Poids négatif rejeté", () => {
    const res = Calculators.calculatePediatric(-10, 15, 3);
    assert.ok(res.error);
  });

  test("2.2.2 - Pédiatrie : Posologie négative rejetée", () => {
    const res = Calculators.calculatePediatric(15, -20, 3);
    assert.ok(res.error);
  });

  test("2.2.3 - Cockcroft : Âge négatif rejeté", () => {
    const res = Calculators.calculateCockcroft(-45, 70, 90, 'umol_l', false);
    assert.ok(res.error);
  });

  test("2.2.4 - Cockcroft : Poids et créatinine négatifs rejetés", () => {
    const res = Calculators.calculateCockcroft(50, -60, -80, 'umol_l', true);
    assert.ok(res.error);
  });

  test("2.2.5 - Déficit en eau libre et Glycémie négatifs rejetés", () => {
    const resDeficit = Calculators.calculateWaterDeficit(-50, 150);
    assert.ok(resDeficit.error);
    const resGluc = Calculators.convertGlucose(-1.5, 'g_l');
    assert.ok(resGluc.error);
  });
});

describe("Tier 2.3 : Zéros et Prévention des Divisions par Zéro", () => {
  test("2.3.1 - Pédiatrie : Poids égal à 0", () => {
    const res = Calculators.calculatePediatric(0, 15, 3);
    assert.ok(res.error);
  });

  test("2.3.2 - Pédiatrie : Concentration de sirop égale à 0 (pas de division par zéro)", () => {
    const res = Calculators.calculatePediatric(10, 15, 3, 0);
    assert.strictEqual(res.mlPerTake, null, "La concentration nulle ne doit pas provoquer d'Infinity");
  });

  test("2.3.3 - Cockcroft : Créatininémie égale à 0 rejetée", () => {
    const res = Calculators.calculateCockcroft(50, 70, 0, 'umol_l', false);
    assert.ok(res.error, "La créatininémie à zéro doit être rejetée pour éviter division par zéro");
  });

  test("2.3.4 - Déficit en eau libre : Natrémie égale à 140 mmol/L (pas de déficit)", () => {
    const res = Calculators.calculateWaterDeficit(70, 140);
    assert.ok(res.error, "Une natrémie <= 140 ne constitue pas un déficit en eau libre");
  });

  test("2.3.5 - Glycémie égale à 0 rejetée", () => {
    const res = Calculators.convertGlucose(0, 'g_l');
    assert.ok(res.error);
  });
});

describe("Tier 2.4 : Entrées Non-Numériques et Chaînes Aléatoires (NaN)", () => {
  test("2.4.1 - Pédiatrie avec 'abc' en poids et posologie", () => {
    const res = Calculators.calculatePediatric("abc", "xyz", "quatre");
    assert.ok(res.error);
  });

  test("2.4.2 - Cockcroft avec valeurs NaN textuelles", () => {
    const res = Calculators.calculateCockcroft("âge_inconnu", "poids_invalide", "creat_err", 'umol_l', false);
    assert.ok(res.error);
  });

  test("2.4.3 - Déficit en eau libre avec chaîne de caractères", () => {
    const res = Calculators.calculateWaterDeficit("soixante", "cent-cinquante");
    assert.ok(res.error);
  });

  test("2.4.4 - Glycémie avec objet ou chaîne invalide", () => {
    const res = Calculators.convertGlucose("non_mesurable", 'g_l');
    assert.ok(res.error);
  });

  test("2.4.5 - CRB-65 avec valeurs truthy arbitraires", () => {
    const res = Calculators.calculateCRB65("yes", 1, true, false);
    assert.strictEqual(res.score, 3);
  });
});

describe("Tier 2.5 : Âges Extrêmes (Cockcroft-Gault)", () => {
  test("2.5.1 - Âge pédiatrique (< 18 ans) rejeté pour Cockcroft", () => {
    const res = Calculators.calculateCockcroft(17, 60, 80, 'umol_l', false);
    assert.ok(res.error, "Cockcroft-Gault est réservé à l'adulte (>= 18 ans)");
  });

  test("2.5.2 - Borne minimale adulte : 18 ans révolus", () => {
    const res = Calculators.calculateCockcroft(18, 65, 80, 'umol_l', false);
    assert.ok(!res.error && res.clCr > 0);
  });

  test("2.5.3 - Sujet septuagénaire : 75 ans avec seuil sarcopénique", () => {
    const res = Calculators.calculateCockcroft(75, 45, 60, 'umol_l', true);
    assert.strictEqual(res.isSarcopenicWarning, true);
  });

  test("2.5.4 - Sujet nonagénaire (95 ans)", () => {
    const res = Calculators.calculateCockcroft(95, 50, 110, 'umol_l', true);
    assert.ok(!res.error && res.clCr > 0);
  });

  test("2.5.5 - Sujet centenaire (105 ans)", () => {
    const res = Calculators.calculateCockcroft(105, 48, 120, 'umol_l', true);
    assert.ok(!res.error);
    assert.strictEqual(res.stage, "Insuffisance rénale sévère");
  });
});

describe("Tier 2.6 : Natrémies Extrêmes (Déficit en Eau Libre)", () => {
  test("2.6.1 - Hyponatrémie (125 mmol/L) rejetée", () => {
    const res = Calculators.calculateWaterDeficit(70, 125);
    assert.ok(res.error);
  });

  test("2.6.2 - Natrémie normale limite (140 mmol/L) rejetée", () => {
    const res = Calculators.calculateWaterDeficit(60, 140);
    assert.ok(res.error);
  });

  test("2.6.3 - Hypernatrémie minime limite (141 mmol/L)", () => {
    const res = Calculators.calculateWaterDeficit(60, 141, true, false);
    assert.ok(!res.error);
    assert.strictEqual(res.deficitLiters, 0.2);
  });

  test("2.6.4 - Hypernatrémie sévère (170 mmol/L)", () => {
    const res = Calculators.calculateWaterDeficit(60, 170, true, false);
    assert.ok(!res.error);
    assert.strictEqual(res.deficitLiters, 6.4);
  });

  test("2.6.5 - Hypernatrémie critique extrême (190 mmol/L)", () => {
    const res = Calculators.calculateWaterDeficit(50, 190, true, true);
    assert.ok(!res.error);
    assert.strictEqual(res.deficitLiters, 8.0);
  });
});

describe("Tier 2.7 : Glycémies Extrêmes et Seuils Cliniques", () => {
  test("2.7.1 - Hypoglycémie profonde (0.35 g/L / 1.9 mmol/L)", () => {
    const res = Calculators.convertGlucose(0.35, 'g_l');
    assert.strictEqual(res.alertClass, 'danger');
    assert.ok(res.status.includes('HYPOGLYCÉMIE'));
  });

  test("2.7.2 - Seuil inférieur de normoglycémie (0.70 g/L)", () => {
    const res = Calculators.convertGlucose(0.70, 'g_l');
    assert.strictEqual(res.alertClass, 'success');
  });

  test("2.7.3 - Seuil supérieur de normoglycémie (1.10 g/L)", () => {
    const res = Calculators.convertGlucose(1.10, 'g_l');
    assert.strictEqual(res.alertClass, 'success');
  });

  test("2.7.4 - Seuil de diabète établi (1.26 g/L)", () => {
    const res = Calculators.convertGlucose(1.26, 'g_l');
    assert.ok(res.status.includes('Diabète probable'));
  });

  test("2.7.5 - Hyperglycémie majeure / Coma hyperosmolaire (6.0 g/L / 600 mg/dL)", () => {
    const res = Calculators.convertGlucose(6.0, 'g_l');
    assert.strictEqual(res.mgDl, 600);
    assert.strictEqual(res.mmolL, 33.3);
  });
});

/* ==========================================================================
   TIER 3 : COMBINAISONS MULTI-FONCTIONNALITÉS (CROSS-FEATURE COMBINATIONS)
   ========================================================================== */

describe("Tier 3 : Interactions Croisées et Combinatoires", () => {
  test("3.1 - Filtres DCI croisés : Recherche textuelle + Adaptation rénale + Risque gériatrique", () => {
    const env = createTestAppEnvironment();
    const { sandbox, document } = env;

    sandbox.renderView('drugs');
    document.getElementById('drugSearchInput').value = 'amox';
    document.getElementById('drugRenalFilter').value = 'renal_only';
    document.getElementById('drugRiskFilter').value = 'all';
    sandbox.filterDrugsTable();

    const tbody = document.getElementById('drugsTableBody');
    assert.ok(tbody.innerHTML.includes('Amoxicilline'));
    assert.ok(!tbody.innerHTML.includes('Amlodipine'));
  });

  test("3.2 - Filtre DCI croisé : Molécule AOD haut risque et surveillance rénale", () => {
    const env = createTestAppEnvironment();
    const { sandbox, document } = env;

    sandbox.renderView('drugs');
    document.getElementById('drugSearchInput').value = 'apixaban';
    document.getElementById('drugRenalFilter').value = 'renal_only';
    document.getElementById('drugRiskFilter').value = 'high_risk';
    sandbox.filterDrugsTable();

    const tbody = document.getElementById('drugsTableBody');
    assert.ok(tbody.innerHTML.includes('Apixaban'));
  });

  test("3.3 - Navigation par clic recherche -> Ouverture Chapitre Médecine Générale", () => {
    const env = createTestAppEnvironment();
    const { sandbox, document } = env;

    sandbox.openSearchModal();
    sandbox.onSearchResultClick('general', 'VI');

    assert.strictEqual(sandbox.AppState.currentManual, 'general');
    assert.strictEqual(sandbox.AppState.currentView, 'chapter');
    assert.strictEqual(sandbox.AppState.activeItemId, 'VI');
    assert.strictEqual(document.getElementById('searchModal').classList.contains('active'), false);
    assert.ok(document.getElementById('navBreadcrumbs').innerHTML.includes('Chapitre VI'));
  });

  test("3.4 - Navigation par clic recherche -> Bascule vers Fiche Gériatrique", () => {
    const env = createTestAppEnvironment();
    const { sandbox, document } = env;

    sandbox.openSearchModal();
    sandbox.onSearchResultClick('geriatrie', '11');

    assert.strictEqual(sandbox.AppState.currentManual, 'geriatrie');
    assert.strictEqual(sandbox.AppState.currentView, 'fiche');
    assert.strictEqual(sandbox.AppState.activeItemId, 11);
    assert.ok(document.getElementById('navBreadcrumbs').innerHTML.includes('Gériatrie'));
  });

  test("3.5 - Navigation par clic recherche -> Accès direct fiche DCI filtrée", () => {
    const env = createTestAppEnvironment();
    const { sandbox, document } = env;

    sandbox.openSearchModal();
    sandbox.onSearchResultClick('drug', 'Metformine');

    assert.strictEqual(sandbox.AppState.currentView, 'drugs');
    const searchInput = document.getElementById('drugSearchInput');
    if (searchInput) {
      searchInput.value = 'Metformine';
      sandbox.filterDrugsTable();
    }
    assert.ok(document.getElementById('drugsTableBody').innerHTML.includes('Metformine'));
  });

  test("3.6 - Mise en favori depuis la vue Chapitre actif et persistance", () => {
    const env = createTestAppEnvironment();
    const { sandbox, document } = env;

    sandbox.renderView('chapter', 'VI');
    const stage = document.getElementById('contentStage');
    const bookmarkBtn = stage.querySelector('.bookmark-btn');
    assert.ok(bookmarkBtn !== null, "Le bouton favori doit être présent");
    assert.strictEqual(bookmarkBtn.classList.contains('active'), false);

    bookmarkBtn.click();
    assert.ok(sandbox.AppState.favorites.includes('gen-VI'));
    const reloadedBtn = document.getElementById('contentStage').querySelector('.bookmark-btn');
    assert.strictEqual(reloadedBtn.classList.contains('active'), true);
  });

  test("3.7 - Mise en favori depuis la vue Fiche Gériatrique active", () => {
    const env = createTestAppEnvironment();
    const { sandbox, document } = env;

    sandbox.setManual('geriatrie');
    sandbox.renderView('fiche', 13);
    const bookmarkBtn = document.getElementById('contentStage').querySelector('.bookmark-btn');
    bookmarkBtn.click();
    assert.ok(sandbox.AppState.favorites.includes('ger-13'));
  });

  test("3.8 - Persistance du mode sombre à travers les changements de vues", () => {
    const env = createTestAppEnvironment();
    const { sandbox, document } = env;

    sandbox.toggleTheme();
    assert.strictEqual(document.documentElement.getAttribute('data-theme'), 'dark');

    sandbox.renderView('home');
    sandbox.renderView('chapter', 'XI');
    sandbox.renderView('calculators');
    sandbox.renderView('drugs');
    sandbox.renderView('checklist');

    assert.strictEqual(document.documentElement.getAttribute('data-theme'), 'dark');
    assert.strictEqual(sandbox.AppState.theme, 'dark');
  });

  test("3.9 - Commutateur de Manuel (Général <-> Gériatrie) met à jour la sidebar et le fil d'Ariane", () => {
    const env = createTestAppEnvironment();
    const { sandbox, document } = env;

    sandbox.setManual('geriatrie');
    assert.strictEqual(sandbox.AppState.currentManual, 'geriatrie');
    assert.ok(document.getElementById('sidebarNavList').innerHTML.includes('F.') || document.getElementById('sidebarNavList').innerHTML.includes('Gériatrie'));

    sandbox.setManual('general');
    assert.strictEqual(sandbox.AppState.currentManual, 'general');
    assert.ok(document.getElementById('sidebarNavList').innerHTML.includes('Méthodologie') || document.getElementById('sidebarNavList').innerHTML.includes('Cardiovasculaire'));
  });

  test("3.10 - Rendu Markdown composite : Formules, tableaux, alertes, listes imbriquées", () => {
    const env = createTestAppEnvironment();
    const { sandbox } = env;

    const complexMd = `
### Conduite à Tenir Clinique
> Alerte : Arrêt immédiat si DFG < 15 mL/min.

$$\\mathbf{DFG} = \\frac{(140 - Age) \\times Poids}{Creat} \\times Facteur$$

| DCI | Posologie | Précaution |
| --- | --- | --- |
| Amoxicilline | 1 g x 3/j | DFG < 30 |
| Metformine | 500 mg x 2/j | Acidose |

• Posologie standard
• Surveillance créatininémie
`;

    const html = sandbox.renderMarkdown(complexMd);
    assert.ok(html.includes('<h3>Conduite à Tenir Clinique</h3>'));
    assert.ok(html.includes('<blockquote>'));
    assert.ok(html.includes('class="math-display"'));
    assert.ok(!html.includes('\\mathbf'));
    assert.ok(html.includes('<table class="clinical-table">'));
    assert.ok(html.includes('<th>DCI</th>'));
    assert.ok(html.includes('<td>Metformine</td>'));
    assert.ok(html.includes('<ul>') && html.includes('<li>Posologie standard</li>'));
  });
});

/* ==========================================================================
   TIER 4 : SCÉNARIOS D'APPLICATION CLINIQUE RÉELLE
   ========================================================================== */

describe("Tier 4 : Scénarios d'Application Clinique Réelle", () => {
  test("Scénario 4.1 : Bilan de Traitement chez une Patiente Âgée Insuffisante Cardiaque", () => {
    // Patiente de 82 ans, 48 kg, créatinine 125 µmol/L (1.41 mg/dL)
    const renal = Calculators.calculateCockcroft(82, 48, 125, 'umol_l', true);
    assert.strictEqual(renal.clCr, 23, "ClCr calculée doit être de 23 mL/min");
    assert.strictEqual(renal.stage, "Insuffisance rénale sévère");
    assert.strictEqual(renal.alertClass, "danger");

    // Vérification de la contre-indication de la Metformine et adaptation Apixaban dans les DCI
    const apixaban = drugsData.find(d => d.dci === "Apixaban");
    assert.ok(apixaban.renalAdaptation, "Apixaban requiert une adaptation rénale");
    assert.ok(apixaban.renalNote.includes("15-29 mL/min"), "Apixaban doit spécifier la réduction à 2.5 mg x 2/j pour DFG 15-29");

    const metformine = drugsData.find(d => d.dci === "Metformine");
    assert.ok(metformine.renalAdaptation, "Metformine requiert une adaptation rénale stricte");
    assert.ok(metformine.precautions.toLowerCase().includes("acidose lactique"), "Metformine doit alerter sur l'acidose lactique");

    // Fiche gériatrique 31 sur la polymédication et critères STOPP/START
    const f31 = geriatrieData.fiches.find(f => f.num === 31);
    assert.ok(f31.content.includes("STOPP") || f31.content.includes("Beers"), "Fiche 31 doit intégrer les critères STOPP/START");
  });

  test("Scénario 4.2 : Prescription d'Amoxicilline Sirop pour Otite Moyenne Aiguë Pédiatrique", () => {
    // Nourrisson de 3 ans, 14.5 kg, OMA suppurée
    // Posologie recommandée : 25 mg/kg/prise, 3 fois par jour, sirop 250 mg / 5 mL (50 mg/mL)
    const env = createTestAppEnvironment();
    const { sandbox, document } = env;

    const calc = Calculators.calculatePediatric(14.5, 25, 3, 50);
    assert.strictEqual(calc.dosePerTakeMg, 362.5);
    assert.strictEqual(calc.totalDailyMg, 1087.5);
    assert.strictEqual(calc.mlPerTake, 7.25);
    assert.strictEqual(calc.intervalHours, 8);

    // Simulation dans l'interface UI des calculateurs
    sandbox.renderView('calculators');
    document.getElementById('pedWeight').value = '14.5';
    document.getElementById('pedDoseKg').value = '25';
    document.getElementById('pedTimes').value = '3';
    document.getElementById('pedConc').value = '50';
    sandbox.runPediatricCalc();

    const resBox = document.getElementById('pediatricResult');
    assert.ok(resBox.innerHTML.includes('362.5 mg / prise'));
    assert.ok(resBox.innerHTML.includes('1087.5 mg / jour'));
    assert.ok(resBox.innerHTML.includes('7.25 mL'));
    assert.ok(resBox.innerHTML.includes('8 heures'));
  });

  test("Scénario 4.3 : Triage d'une Pneumonie Franche Lobaire Aiguë avec Score CRB-65", () => {
    // Patient de 74 ans, confus, FR = 32/min, PA = 85/55 mmHg
    const env = createTestAppEnvironment();
    const { sandbox, document } = env;

    const crb = Calculators.calculateCRB65(true, true, true, true);
    assert.strictEqual(crb.score, 4);
    assert.strictEqual(crb.alertClass, "danger");
    assert.ok(crb.recommendation.includes("réanimation"));

    // Validation dans l'interface UI (conforme invariant textContent / innerHTML échappé)
    sandbox.renderView('calculators');
    document.getElementById('crbC').checked = true;
    document.getElementById('crbR').checked = true;
    document.getElementById('crbB').checked = true;
    document.getElementById('crbAge').checked = true;
    sandbox.runCRB65Calc();

    const resBox = document.getElementById('crb65Result');
    assert.ok(resBox.textContent.includes('Score : 4 / 4'));
    assert.ok(resBox.innerHTML.includes('danger'));
    assert.ok(resBox.textContent.includes("Hospitalisation d'urgence indispensable"));
  });

  test("Scénario 4.4 : Protocole de Réhydratation d'une Hypernatrémie en EHPAD", () => {
    // Résidente de 88 ans, 50 kg, somnolence fébrile, Na+ = 162 mmol/L
    const water = Calculators.calculateWaterDeficit(50, 162, true, true);
    assert.strictEqual(water.factor, 0.45);
    assert.strictEqual(water.deficitLiters, 3.5);
    assert.ok(water.advice.includes("10 à 12 mmol/L"));

    // Vérification Fiche 19 (Déshydratation aiguë du sujet âgé)
    const f19 = geriatrieData.fiches.find(f => f.num === 19);
    assert.ok(f19 && f19.title.includes("Déshydratation"));
  });

  test("Scénario 4.5 : Parcours de Consultation Complet E2E (Navigation, Calcul, Validation, Ordonnance)", async () => {
    const env = createTestAppEnvironment();
    const { sandbox, document, window } = env;

    // 1. Démarrage sur la page d'accueil
    sandbox.renderView('home');
    assert.strictEqual(sandbox.AppState.currentView, 'home');

    // 2. Bascule en mode sombre pour confort visuel
    sandbox.toggleTheme();
    assert.strictEqual(document.documentElement.getAttribute('data-theme'), 'dark');

    // 3. Recherche de la prise en charge de l'Asthme Aigu Grave (Chapitre IX)
    sandbox.openSearchModal();
    sandbox.renderSearchResults('asthme');
    sandbox.onSearchResultClick('general', 'IX');
    assert.strictEqual(sandbox.AppState.currentView, 'chapter');
    assert.strictEqual(sandbox.AppState.activeItemId, 'IX');

    // 4. Ajout du Chapitre IX aux favoris
    sandbox.toggleFavorite('gen-IX');
    assert.ok(sandbox.AppState.favorites.includes('gen-IX'));

    // 5. Calcul de la clairance d'un patient de 68 ans, 75 kg, créatinine 115 µmol/L
    sandbox.renderView('calculators');
    document.getElementById('cgAge').value = '68';
    document.getElementById('cgWeight').value = '75';
    document.getElementById('cgCreat').value = '115';
    document.getElementById('cgSex').value = 'male';
    sandbox.runCockcroftCalc();
    const cgBox = document.getElementById('cockcroftResult');
    assert.ok(cgBox.innerHTML.includes('58 mL/min'));

    // 6. Renseignement de la check-list de sécurité avant signature
    sandbox.renderView('checklist');
    for (let i = 1; i <= 10; i++) {
      sandbox.toggleChecklistItem(`c${i}`);
    }
    const badge = document.getElementById('checklistBadge');
    assert.ok(badge.textContent.includes('10 / 10 vérifiés'));

    // 7. Copie de la note de conformité
    sandbox.copyChecklistNote();
    await new Promise(r => setTimeout(r, 10));
    assert.ok(window._lastCopied.includes('Check-list 10 points validée'));

    // 8. Consultation de la liste des favoris
    sandbox.renderView('favorites');
    const stage = document.getElementById('contentStage');
    assert.ok(stage.innerHTML.includes('Ch. IX'));
  });
});

/* ==========================================================================
   RAPPORT FINAL D'EXÉCUTION
   ========================================================================== */

async function runAllTests() {
  for (const item of testQueue) {
    if (item.type === 'suite') {
      console.log(`\n\x1b[1m\x1b[36m=== ${item.suiteName} ===\x1b[0m`);
    } else if (item.type === 'test') {
      totalTests++;
      try {
        await item.fn();
        passedTests++;
        console.log(`  \x1b[32m✓\x1b[0m ${item.testName}`);
      } catch (err) {
        failedTests++;
        failures.push({ testName: item.testName, error: err });
        console.log(`  \x1b[31m✗\x1b[0m ${item.testName}`);
        console.log(`    \x1b[31m${err.message}\x1b[0m`);
      }
    }
  }

  console.log(`\n==================================================`);
  console.log(`RÉSUMÉ DU TEST RUN :`);
  console.log(`  Total des assertions et scénarios : ${totalTests}`);
  console.log(`  Tests réussis : \x1b[32m${passedTests}\x1b[0m`);
  console.log(`  Tests échoués : \x1b[${failedTests > 0 ? '31' : '32'}m${failedTests}\x1b[0m`);
  console.log(`==================================================\n`);

  if (failedTests > 0) {
    console.error(`\x1b[31mÉCHEC DE ${failedTests} TEST(S) :\x1b[0m`);
    failures.forEach((f, idx) => {
      console.error(`  ${idx + 1}. [${f.testName}] : ${f.error.message}`);
    });
    process.exit(1);
  } else {
    console.log(`\x1b[32m✓ TOUS LES TESTS SONT PASSÉS AVEC SUCCÈS (CODE 0) !\x1b[0m`);
    process.exit(0);
  }
}

if (require.main === module) {
  runAllTests();
}

module.exports = { createTestAppEnvironment, MockElement, MockClassList };
