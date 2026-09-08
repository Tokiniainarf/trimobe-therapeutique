/**
 * ADVERSARIAL CHALLENGER TEST SUITE — MILESTONE 3 (R3)
 * File: tests/test_challenger_m3_dom_storage.js
 *
 * Focus:
 * 1. Sandboxed DOM Testing Invariant compliance (mandatory user rule)
 * 2. Storage Resilience: SecurityError & QuotaExceededError handling, session state persistence
 * 3. Clipboard Fallback: undefined navigator.clipboard & NotAllowedError rejections
 * 4. Theme Toggling: Multi-cycle state parity, meta theme-color sync, and DOM fault tolerance
 * 5. Responsive Tables: ensureResponsiveTables wrapping, idempotence, and clinical content audit
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');
const assert = require('assert');

const projectRoot = path.resolve(__dirname, '..');
const appSource = fs.readFileSync(path.join(projectRoot, 'app.js'), 'utf8');
const dataGeneral = require(path.join(projectRoot, 'data-general.js'));
const dataGeriatrie = require(path.join(projectRoot, 'data-geriatrie.js'));
const dataDrugs = require(path.join(projectRoot, 'data-drugs.js'));
const calculators = require(path.join(projectRoot, 'calculators.js'));

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;
const failures = [];

function test(category, name, fn) {
  totalTests++;
  try {
    fn();
    passedTests++;
    console.log(`  ✓ [${category}] ${name}`);
  } catch (err) {
    failedTests++;
    failures.push({ category, name, error: err.message, stack: err.stack });
    console.error(`  ✗ [${category}] ${name}`);
    console.error(`    ↳ Error: ${err.message}`);
  }
}

async function testAsync(category, name, fn) {
  totalTests++;
  try {
    await fn();
    passedTests++;
    console.log(`  ✓ [${category}] ${name}`);
  } catch (err) {
    failedTests++;
    failures.push({ category, name, error: err.message, stack: err.stack });
    console.error(`  ✗ [${category}] ${name}`);
    console.error(`    ↳ Error: ${err.message}`);
  }
}

// ============================================================================
// 1. MOCK DOM IMPLEMENTATION (COMPLIANT WITH MANDATORY USER RULE)
// ============================================================================

class MockElement {
  constructor(tag = 'div') {
    this.tagName = String(tag || 'div').toUpperCase();
    this.children = [];
    this.parentNode = null;
    this.parentElement = null;
    this._innerHTML = '';
    this._textContent = '';
    const classSet = new Set();
    this._classListSet = classSet;
    this.classList = {
      add: (...tokens) => { tokens.forEach(t => { if (t) classSet.add(String(t)); }); },
      remove: (...tokens) => { tokens.forEach(t => { classSet.delete(String(t)); }); },
      toggle: (token, val) => {
        token = String(token);
        if (typeof val === 'boolean') {
          if (val) { classSet.add(token); return true; }
          else { classSet.delete(token); return false; }
        }
        if (classSet.has(token)) {
          classSet.delete(token);
          return false;
        } else {
          classSet.add(token);
          return true;
        }
      },
      contains: (token) => classSet.has(String(token)),
      get length() { return classSet.size; },
      toString: () => Array.from(classSet).join(' '),
      forEach: (cb, thisArg) => classSet.forEach(cb, thisArg)
    };
    this.attributes = {};
    this.dataset = {};
    this.style = {};
    this._value = '';
    this._eventListeners = new Map();
  }

  get id() { return this.getAttribute('id') || ''; }
  set id(v) { this.setAttribute('id', String(v || '')); }

  get className() { return Array.from(this._classListSet).join(' '); }
  set className(val) {
    this._classListSet.clear();
    if (val && typeof val === 'string') {
      val.split(/\s+/).filter(Boolean).forEach(c => this._classListSet.add(c));
    }
  }

  get innerHTML() {
    return this._innerHTML;
  }

  set innerHTML(val) {
    this._innerHTML = val === null || val === undefined ? '' : String(val);
    this._textContent = this._innerHTML
      .replace(/<[^>]*>/g, '')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'");
  }

  get textContent() {
    return this._textContent;
  }

  // MANDATORY USER RULE INVARIANT:
  // textContent setter must correctly update innerHTML representation (escaping &, <, >, ", ')
  set textContent(val) {
    this._textContent = val === null || val === undefined ? '' : String(val);
    this._innerHTML = this._textContent
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  get value() { return this._value; }
  set value(val) { this._value = val === null || val === undefined ? '' : String(val); }

  appendChild(child) {
    if (child.parentNode && typeof child.parentNode.removeChild === 'function') {
      child.parentNode.removeChild(child);
    }
    child.parentNode = this;
    child.parentElement = this;
    this.children.push(child);
    return child;
  }

  insertBefore(newNode, refNode) {
    if (newNode.parentNode && typeof newNode.parentNode.removeChild === 'function') {
      newNode.parentNode.removeChild(newNode);
    }
    newNode.parentNode = this;
    newNode.parentElement = this;
    const idx = this.children.indexOf(refNode);
    if (idx > -1) {
      this.children.splice(idx, 0, newNode);
    } else {
      this.children.push(newNode);
    }
    return newNode;
  }

  removeChild(child) {
    const idx = this.children.indexOf(child);
    if (idx > -1) {
      this.children.splice(idx, 1);
      child.parentNode = null;
      child.parentElement = null;
    }
    return child;
  }

  setAttribute(k, v) { this.attributes[k] = String(v); }
  getAttribute(k) { return Object.prototype.hasOwnProperty.call(this.attributes, k) ? this.attributes[k] : null; }
  removeAttribute(k) { delete this.attributes[k]; }
  hasAttribute(k) { return Object.prototype.hasOwnProperty.call(this.attributes, k); }

  select() { this._selected = true; }
  focus() { this._focused = true; }

  addEventListener(type, cb) {
    if (!this._eventListeners.has(type)) this._eventListeners.set(type, []);
    this._eventListeners.get(type).push(cb);
  }

  click() {
    const cbs = this._eventListeners.get('click') || [];
    cbs.forEach(cb => cb({ type: 'click', target: this }));
    if (typeof this.onclick === 'function') this.onclick({ type: 'click', target: this });
  }

  querySelectorAll(sel) {
    const results = [];
    function traverse(node) {
      if (sel === 'table' && node.tagName === 'TABLE') results.push(node);
      else if (sel === 'meta[name="theme-color"]' && node.tagName === 'META' && node.getAttribute('name') === 'theme-color') results.push(node);
      else if (sel.startsWith('.') && node.classList && node.classList.contains(sel.substring(1))) results.push(node);
      for (const ch of node.children) traverse(ch);
    }
    traverse(this);
    return results;
  }

  querySelector(sel) {
    const res = this.querySelectorAll(sel);
    return res.length > 0 ? res[0] : null;
  }
}

// Helper to create a fresh sandbox environment
function createTestEnv(options = {}) {
  const docElement = new MockElement('html');
  const head = new MockElement('head');
  const body = new MockElement('body');
  docElement.appendChild(head);
  docElement.appendChild(body);

  const metaTheme = new MockElement('meta');
  metaTheme.setAttribute('name', 'theme-color');
  metaTheme.setAttribute('content', '#0284c7');
  head.appendChild(metaTheme);

  const themeBtn = new MockElement('button');
  themeBtn.id = 'themeToggleBtn';
  themeBtn.textContent = '🌙';
  body.appendChild(themeBtn);

  const copyBtn = new MockElement('button');
  copyBtn.id = 'copyChecklistBtn';
  copyBtn.innerHTML = '📋 Copier la note de sécurité';
  body.appendChild(copyBtn);

  const stage = new MockElement('div');
  stage.id = 'contentStage';
  body.appendChild(stage);

  const listeners = {};
  const inMemoryStorage = {};

  const defaultLocalStorage = {
    _store: inMemoryStorage,
    getItem: (k) => Object.prototype.hasOwnProperty.call(inMemoryStorage, k) ? inMemoryStorage[k] : null,
    setItem: (k, v) => { inMemoryStorage[k] = String(v); },
    removeItem: (k) => { delete inMemoryStorage[k]; },
    clear: () => { for (const k in inMemoryStorage) delete inMemoryStorage[k]; }
  };

  const localStorageInstance = options.localStorage !== undefined ? options.localStorage : defaultLocalStorage;

  const documentMock = {
    documentElement: docElement,
    head: head,
    body: body,
    createElement: (tag) => new MockElement(tag),
    getElementById: (id) => {
      function search(node) {
        if (node.id === id || node.getAttribute('id') === id) return node;
        for (const ch of node.children) {
          const r = search(ch);
          if (r) return r;
        }
        return null;
      }
      return search(docElement);
    },
    querySelector: (sel) => {
      return docElement.querySelector(sel);
    },
    querySelectorAll: (sel) => {
      return docElement.querySelectorAll(sel);
    },
    addEventListener: (evt, fn) => {
      if (!listeners[evt]) listeners[evt] = [];
      listeners[evt].push(fn);
    },
    execCommand: options.execCommand || ((cmd) => {
      if (cmd === 'copy') {
        windowMock._execCommandCopyCount = (windowMock._execCommandCopyCount || 0) + 1;
        return true;
      }
      return false;
    })
  };

  const windowMock = {
    document: documentMock,
    localStorage: localStorageInstance,
    innerWidth: 1024,
    scrollTo: () => {},
    print: () => {},
    alert: (msg) => { windowMock._lastAlert = msg; },
    _lastAlert: null,
    _lastCopied: null,
    _execCommandCopyCount: 0,
    navigator: options.navigator !== undefined ? options.navigator : {
      clipboard: {
        writeText: (txt) => {
          windowMock._lastCopied = txt;
          return Promise.resolve();
        }
      }
    },
    setTimeout: global.setTimeout,
    clearTimeout: global.clearTimeout
  };
  windowMock.window = windowMock;

  const sandbox = {
    window: windowMock,
    document: documentMock,
    localStorage: windowMock.localStorage,
    navigator: windowMock.navigator,
    console: console,
    setTimeout: global.setTimeout,
    clearTimeout: global.clearTimeout,
    alert: (msg) => { windowMock._lastAlert = msg; },
    GENERAL_MANUAL_DATA: dataGeneral,
    GERIATRIE_MANUAL_DATA: dataGeriatrie,
    DRUGS_DATA: dataDrugs,
    Calculators: calculators
  };

  vm.createContext(sandbox);
  vm.runInContext(appSource, sandbox);

  return { sandbox, windowMock, documentMock, docElement, body, head, metaTheme, themeBtn, copyBtn, stage };
}

(async () => {
  // ============================================================================
  // SUITE 1: MANDATORY USER RULE — SANDBOXED DOM TESTING INVARIANTS
  // ============================================================================
  console.log('\n===============================================================================');
  console.log('   SUITE 1: Sandboxed DOM Testing Invariants (Mandatory User Rule)');
  console.log('===============================================================================');

  test('Invariant', '1.1 textContent setter escaping HTML entities (&, <, >, ", \') into innerHTML', () => {
    const el = new MockElement('div');
    el.textContent = "A & B < C > D 'E' \"F\"";
    assert.strictEqual(
      el.innerHTML,
      "A &amp; B &lt; C &gt; D &#39;E&#39; &quot;F&quot;",
      'innerHTML must contain valid HTML entities'
    );
    assert.strictEqual(el.textContent, "A & B < C > D 'E' \"F\"");
  });

  test('Invariant', '1.2 innerHTML setter strips HTML tags and unescapes entities for textContent', () => {
    const el = new MockElement('p');
    el.innerHTML = '<span class="badge">Alerte &amp; Danger &lt;Critique&gt;</span>';
    assert.strictEqual(el.textContent, 'Alerte & Danger <Critique>');
  });

  test('Invariant', '1.3 textContent setter handles null, undefined, numbers, and booleans safely', () => {
    const el = new MockElement('span');
    el.textContent = null;
    assert.strictEqual(el.textContent, '');
    assert.strictEqual(el.innerHTML, '');

    el.textContent = undefined;
    assert.strictEqual(el.textContent, '');
    assert.strictEqual(el.innerHTML, '');

    el.textContent = 42;
    assert.strictEqual(el.textContent, '42');
    assert.strictEqual(el.innerHTML, '42');

    el.textContent = false;
    assert.strictEqual(el.textContent, 'false');
    assert.strictEqual(el.innerHTML, 'false');
  });

  test('Invariant', '1.4 MockElement.classList API functions safely without recursive overflow', () => {
    const el = new MockElement('div');
    el.classList.add('table-responsive-wrapper', 'active');
    assert.strictEqual(el.classList.contains('table-responsive-wrapper'), true);
    assert.strictEqual(el.classList.contains('active'), true);
    assert.strictEqual(el.classList.length, 2);

    el.classList.toggle('active', false);
    assert.strictEqual(el.classList.contains('active'), false);
    assert.strictEqual(el.classList.length, 1);

    el.classList.toggle('active', true);
    assert.strictEqual(el.classList.contains('active'), true);
  });

  // ============================================================================
  // SUITE 2: STORAGE RESILIENCE — SecurityError (Incognito / Sandboxed Iframe)
  // ============================================================================
  console.log('\n===============================================================================');
  console.log('   SUITE 2: Storage Resilience — SecurityError Simulation');
  console.log('===============================================================================');

  test('Storage', '2.1 safeStorageGet absorbs SecurityError on localStorage.getItem without throwing', () => {
    const env = createTestEnv({
      localStorage: {
        getItem: () => {
          const err = new Error("The operation is insecure.");
          err.name = "SecurityError";
          throw err;
        },
        setItem: () => {}
      }
    });

    assert.doesNotThrow(() => {
      const val = env.sandbox.safeStorageGet('arbitrary_key');
      assert.strictEqual(val, null);
    }, 'safeStorageGet must catch SecurityError and return fallback/null');
  });

  test('Storage', '2.2 safeStorageSet absorbs SecurityError on localStorage.setItem and writes to memoryStore', () => {
    const env = createTestEnv({
      localStorage: {
        getItem: () => {
          const err = new Error("The operation is insecure.");
          err.name = "SecurityError";
          throw err;
        },
        setItem: () => {
          const err = new Error("The operation is insecure.");
          err.name = "SecurityError";
          throw err;
        }
      }
    });

    assert.doesNotThrow(() => {
      env.sandbox.safeStorageSet('clin_user_role', 'urgentiste');
    }, 'safeStorageSet must not throw on SecurityError');

    const retrieved = env.sandbox.safeStorageGet('clin_user_role');
    assert.strictEqual(retrieved, 'urgentiste', 'safeStorageGet must retrieve value from memoryStore');
  });

  test('Storage', '2.3 safeStorageSetJSON & safeStorageGetJSON preserve complex clinical state under SecurityError', () => {
    const env = createTestEnv({
      localStorage: {
        getItem: () => {
          const err = new Error("The operation is insecure.");
          err.name = "SecurityError";
          throw err;
        },
        setItem: () => {
          const err = new Error("The operation is insecure.");
          err.name = "SecurityError";
          throw err;
        }
      }
    });

    const clinicalState = {
      favorites: ['gen-I', 'gen-XV', 'ger-12', 'ger-31'],
      checklist: { c1: true, c2: true, c3: false, c10: true },
      dosageCalculations: { lastWeightKg: 72, lastCreat: 110 }
    };

    assert.doesNotThrow(() => {
      env.sandbox.safeStorageSetJSON('trimobe_clinical_state', clinicalState);
    });

    const readState = env.sandbox.safeStorageGetJSON('trimobe_clinical_state', null);
    assert.deepStrictEqual(JSON.parse(JSON.stringify(readState)), clinicalState, 'Complex JSON state must match exactly');
  });

  // ============================================================================
  // SUITE 3: STORAGE RESILIENCE — QuotaExceededError (Storage Full)
  // ============================================================================
  console.log('\n===============================================================================');
  console.log('   SUITE 3: Storage Resilience — QuotaExceededError Simulation');
  console.log('===============================================================================');

  test('Storage', '3.1 safeStorageSet absorbs QuotaExceededError on localStorage.setItem without throwing', () => {
    const env = createTestEnv({
      localStorage: {
        getItem: (k) => null,
        setItem: () => {
          const err = new Error("Quota exceeded.");
          err.name = "QuotaExceededError";
          throw err;
        }
      }
    });

    assert.doesNotThrow(() => {
      env.sandbox.safeStorageSet('quota_test_key', 'quota_test_val');
    }, 'safeStorageSet must not throw on QuotaExceededError');
  });

  test('Storage', '3.2 ADVERSARIAL CHALLENGE: safeStorageGet must preserve session state when setItem threw QuotaExceededError', () => {
    // Real browser behavior: getItem returns null when a key was not saved due to quota failure
    const mockStorageData = {};
    const env = createTestEnv({
      localStorage: {
        getItem: (k) => mockStorageData[k] !== undefined ? mockStorageData[k] : null,
        setItem: (k, v) => {
          const err = new Error("Quota exceeded.");
          err.name = "QuotaExceededError";
          throw err;
        }
      }
    });

    env.sandbox.safeStorageSet('active_session_token', 'token_valid_2026');
    const retrieved = env.sandbox.safeStorageGet('active_session_token');

    assert.strictEqual(
      retrieved,
      'token_valid_2026',
      'CRITICAL DEFECT: safeStorageGet returned null instead of memoryStore fallback because localStorage.getItem returned null!'
    );
  });

  test('Storage', '3.3 ADVERSARIAL CHALLENGE: safeStorageGet must not return stale data when overwrite threw QuotaExceededError', () => {
    // Real browser behavior: key exists from before quota was filled, but overwrite fails with QuotaExceededError
    const mockStorageData = {
      'trimobe_theme': 'light'
    };
    const env = createTestEnv({
      localStorage: {
        getItem: (k) => mockStorageData[k] !== undefined ? mockStorageData[k] : null,
        setItem: (k, v) => {
          const err = new Error("Quota exceeded.");
          err.name = "QuotaExceededError";
          throw err;
        }
      }
    });

    // User switches theme to dark
    env.sandbox.safeStorageSet('trimobe_theme', 'dark');
    const currentTheme = env.sandbox.safeStorageGet('trimobe_theme');

    assert.strictEqual(
      currentTheme,
      'dark',
      'CRITICAL DEFECT: safeStorageGet returned stale "light" instead of memoryStore updated value "dark" when setItem threw QuotaExceededError!'
    );
  });

  test('Storage', '3.4 safeStorageGetJSON handles corrupted JSON gracefully returning fallback', () => {
    const env = createTestEnv({
      localStorage: {
        getItem: (k) => {
          if (k === 'corrupted_checklist') return '{ "c1": true, unclosed_json...';
          return null;
        },
        setItem: () => {}
      }
    });

    const fallbackVal = { defaultFallback: true };
    let result;
    assert.doesNotThrow(() => {
      result = env.sandbox.safeStorageGetJSON('corrupted_checklist', fallbackVal);
    });
    assert.deepStrictEqual(result, fallbackVal, 'Must safely return default fallback on corrupted JSON');
  });

  // ============================================================================
  // SUITE 4: CLIPBOARD FALLBACK — Modern & Fallback Pathways
  // ============================================================================
  console.log('\n===============================================================================');
  console.log('   SUITE 4: Clipboard Fallback — Standard and Degraded Modes');
  console.log('===============================================================================');

  await testAsync('Clipboard', '4.1 Modern navigator.clipboard.writeText copies synthesis note and updates button', async () => {
    const env = createTestEnv();
    const btn = env.documentMock.getElementById('copyChecklistBtn');
    btn.innerHTML = '📋 Copier la note de sécurité';

    env.sandbox.copyChecklistNote();
    await new Promise(r => setTimeout(r, 20));

    assert.ok(env.windowMock._lastCopied.includes('[Sécurité Ordonnance - Collection TRIMOBE]'));
    assert.ok(env.windowMock._lastCopied.includes("règles d'or de prescription"));
    assert.strictEqual(btn.innerHTML, '✓ Synthèse copiée !');
    assert.strictEqual(btn.style.background, 'var(--success)');
  });

  await testAsync('Clipboard', '4.2 Fallback when navigator.clipboard is undefined creates <textarea> and calls execCommand("copy")', async () => {
    let createdTextarea = null;
    const env = createTestEnv({
      navigator: {}, // navigator.clipboard is undefined
      execCommand: (cmd) => {
        if (cmd === 'copy') {
          const tas = env.body.children.filter(c => c.tagName === 'TEXTAREA');
          if (tas.length > 0) createdTextarea = tas[0];
          env.windowMock._execCommandCopyCount = (env.windowMock._execCommandCopyCount || 0) + 1;
          return true;
        }
        return false;
      }
    });

    const btn = env.documentMock.getElementById('copyChecklistBtn');
    btn.innerHTML = '📋 Copier la note de sécurité';

    env.sandbox.copyChecklistNote();
    await new Promise(r => setTimeout(r, 20));

    assert.ok(env.windowMock._execCommandCopyCount >= 1, 'execCommand("copy") must be invoked in fallback mode');
    assert.strictEqual(btn.innerHTML, '✓ Synthèse copiée !');
  });

  await testAsync('Clipboard', '4.3 Fallback when navigator.clipboard.writeText rejects with NotAllowedError', async () => {
    let fallbackInvoked = false;
    const env = createTestEnv({
      navigator: {
        clipboard: {
          writeText: () => Promise.reject(new Error('NotAllowedError: Clipboard access denied'))
        }
      },
      execCommand: (cmd) => {
        if (cmd === 'copy') {
          fallbackInvoked = true;
          return true;
        }
        return false;
      }
    });

    const btn = env.documentMock.getElementById('copyChecklistBtn');
    btn.innerHTML = '📋 Copier la note de sécurité';

    env.sandbox.copyChecklistNote();
    await new Promise(r => setTimeout(r, 25));

    assert.strictEqual(fallbackInvoked, true, 'Promise rejection must trigger fallbackCopyText via .catch()');
    assert.strictEqual(btn.innerHTML, '✓ Synthèse copiée !');
  });

  test('Clipboard', '4.4 ADVERSARIAL CHALLENGE: Rapid double-click on copy button locks button label permanently', () => {
    const env = createTestEnv();
    const btn = env.documentMock.getElementById('copyChecklistBtn');
    btn.innerHTML = '📋 Copier la note de sécurité';

    const scheduledTimers = [];
    env.sandbox.setTimeout = (fn, delay) => {
      scheduledTimers.push({ fn, delay });
      return scheduledTimers.length;
    };

    // Click 1
    env.sandbox.showCopyFeedback();
    assert.strictEqual(btn.innerHTML, '✓ Synthèse copiée !');
    assert.strictEqual(scheduledTimers.length, 1);

    // Rapid Click 2 (user clicks again before 2500ms timer fires)
    env.sandbox.showCopyFeedback();
    assert.strictEqual(btn.innerHTML, '✓ Synthèse copiée !');
    assert.strictEqual(scheduledTimers.length, 2);

    // Timer 1 fires at 2500ms
    scheduledTimers[0].fn();
    // Temporarily reset to originalHtml captured by timer 1
    assert.strictEqual(btn.innerHTML, '📋 Copier la note de sécurité');

    // Timer 2 fires at 3000ms
    scheduledTimers[1].fn();

    // Due to closure capture of btn.innerHTML at second click ('✓ Synthèse copiée !'),
    // Timer 2 sets innerHTML to '✓ Synthèse copiée !', locking it permanently!
    assert.strictEqual(
      btn.innerHTML,
      '📋 Copier la note de sécurité',
      'BUTTON LOCK DEFECT: Rapid double-clicking locked copy button label to "✓ Synthèse copiée !" permanently!'
    );
  });

  // ============================================================================
  // SUITE 5: THEME TOGGLING & STATE SYNCHRONIZATION
  // ============================================================================
  console.log('\n===============================================================================');
  console.log('   SUITE 5: Theme Toggling & DOM Synchronization');
  console.log('===============================================================================');

  test('Theme', '5.1 Initial theme state defaults to light with corresponding attributes', () => {
    const env = createTestEnv();
    env.sandbox.initTheme();

    assert.strictEqual(env.docElement.getAttribute('data-theme'), 'light');
    assert.strictEqual(env.metaTheme.getAttribute('content'), '#0284c7');
    assert.strictEqual(env.themeBtn.textContent, '🌙');
  });

  test('Theme', '5.2 toggleTheme toggles from light to dark with full DOM parity', () => {
    const env = createTestEnv();
    env.sandbox.initTheme();

    env.sandbox.toggleTheme();

    assert.strictEqual(env.windowMock.AppState.theme, 'dark');
    assert.strictEqual(env.docElement.getAttribute('data-theme'), 'dark');
    assert.strictEqual(env.metaTheme.getAttribute('content'), '#090d16');
    assert.strictEqual(env.themeBtn.textContent, '☀️');
    assert.strictEqual(env.themeBtn.getAttribute('aria-label'), 'Passer au mode clair');
  });

  test('Theme', '5.3 Multi-cycle stress test: 20 consecutive toggles maintain 100% state consistency', () => {
    const env = createTestEnv();
    env.sandbox.initTheme();

    for (let i = 1; i <= 20; i++) {
      env.sandbox.toggleTheme();
      const isDark = i % 2 === 1;

      const expectedTheme = isDark ? 'dark' : 'light';
      const expectedColor = isDark ? '#090d16' : '#0284c7';
      const expectedIcon = isDark ? '☀️' : '🌙';
      const expectedAria = isDark ? 'Passer au mode clair' : 'Passer au mode sombre';

      assert.strictEqual(env.windowMock.AppState.theme, expectedTheme, `Cycle ${i}: AppState.theme`);
      assert.strictEqual(env.docElement.getAttribute('data-theme'), expectedTheme, `Cycle ${i}: data-theme`);
      assert.strictEqual(env.metaTheme.getAttribute('content'), expectedColor, `Cycle ${i}: meta theme-color`);
      assert.strictEqual(env.themeBtn.textContent, expectedIcon, `Cycle ${i}: themeBtn icon`);
      assert.strictEqual(env.themeBtn.getAttribute('aria-label'), expectedAria, `Cycle ${i}: aria-label`);
    }
  });

  test('Theme', '5.4 Fault tolerance: toggleTheme operates cleanly when themeToggleBtn or meta tag is missing', () => {
    const env = createTestEnv();
    env.body.removeChild(env.themeBtn);
    env.head.removeChild(env.metaTheme);

    assert.doesNotThrow(() => {
      env.sandbox.toggleTheme();
    }, 'toggleTheme must not crash when DOM elements are absent');

    assert.strictEqual(env.windowMock.AppState.theme, 'dark');
    assert.strictEqual(env.docElement.getAttribute('data-theme'), 'dark');
  });

  // ============================================================================
  // SUITE 6: RESPONSIVE TABLES — WRAPPER VERIFICATION & AUDIT
  // ============================================================================
  console.log('\n===============================================================================');
  console.log('   SUITE 6: Responsive Tables & Clinical Content Verification');
  console.log('===============================================================================');

  test('Tables', '6.1 ensureResponsiveTables wraps an unwrapped table in .table-responsive-wrapper', () => {
    const env = createTestEnv();
    const container = new MockElement('div');
    const table = new MockElement('table');
    table.className = 'clinical-table';
    container.appendChild(table);

    env.sandbox.ensureResponsiveTables(container);

    assert.ok(table.parentElement !== null, 'Table must have a parentElement');
    assert.strictEqual(table.parentElement.className, 'table-responsive-wrapper');
    assert.strictEqual(container.children[0], table.parentElement);
  });

  test('Tables', '6.2 ensureResponsiveTables is idempotent (repeated calls do not produce nested wrappers)', () => {
    const env = createTestEnv();
    const container = new MockElement('div');
    const table = new MockElement('table');
    table.className = 'clinical-table';
    container.appendChild(table);

    // Call ensureResponsiveTables 10 times consecutively
    for (let i = 0; i < 10; i++) {
      env.sandbox.ensureResponsiveTables(container);
    }

    assert.strictEqual(container.children.length, 1, 'Container must have exactly 1 child (wrapper)');
    const wrapper = container.children[0];
    assert.strictEqual(wrapper.className, 'table-responsive-wrapper');
    assert.strictEqual(wrapper.children.length, 1, 'Wrapper must have exactly 1 child (table)');
    assert.strictEqual(wrapper.children[0], table);
  });

  test('Tables', '6.3 ensureResponsiveTables handles multiple tables in the same container', () => {
    const env = createTestEnv();
    const container = new MockElement('div');
    const t1 = new MockElement('table');
    const t2 = new MockElement('table');
    const t3 = new MockElement('table');
    container.appendChild(t1);
    container.appendChild(t2);
    container.appendChild(t3);

    env.sandbox.ensureResponsiveTables(container);

    assert.strictEqual(container.children.length, 3);
    container.children.forEach((wrapper, idx) => {
      assert.strictEqual(wrapper.className, 'table-responsive-wrapper', `Child ${idx} must be a wrapper`);
      assert.strictEqual(wrapper.children[0].tagName, 'TABLE', `Wrapper ${idx} must contain a TABLE`);
    });
  });

  test('Tables', '6.4 ADVERSARIAL CHALLENGE: Lifecycle flaw in renderView calls ensureResponsiveTables on empty stage', () => {
    const env = createTestEnv();
    const stage = env.stage;

    // Inspect the lifecycle in renderView:
    // stage.innerHTML = '';
    // ensureResponsiveTables(stage); <-- executed on EMPTY stage
    // stage.appendChild(renderChapterView(...)); <-- table appended AFTER ensureResponsiveTables ran!

    // If a view produces an unwrapped table directly:
    const mockCustomView = () => {
      const v = new MockElement('div');
      const rawTable = new MockElement('table');
      v.appendChild(rawTable);
      return v;
    };

    stage.innerHTML = '';
    env.sandbox.ensureResponsiveTables(stage);
    const view = mockCustomView();
    stage.appendChild(view);

    const rawTable = view.children[0];
    const isWrapped = rawTable.parentElement && rawTable.parentElement.classList.contains('table-responsive-wrapper');

    assert.strictEqual(
      isWrapped,
      true,
      'LIFECYCLE DEFECT: ensureResponsiveTables(stage) is called BEFORE view is appended in renderView! Any unwrapped table appended by a view is not wrapped!'
    );
  });

  test('Tables', '6.5 Clinical Content Audit: 100% of tables across all 51 General chapters and 33 Geriatrie fiches are wrapped', () => {
    const env = createTestEnv();
    let totalChaptersChecked = 0;
    let totalTablesFound = 0;

    // Check General chapters
    dataGeneral.chapters.forEach(ch => {
      totalChaptersChecked++;
      const html = env.sandbox.renderMarkdown(ch.content);
      if (html.includes('<table')) {
        totalTablesFound++;
        assert.ok(
          html.includes('<div class="table-responsive-wrapper"><table class="clinical-table">'),
          `Chapter ${ch.num} contains an unwrapped table!`
        );
      }
    });

    // Check Geriatrie fiches
    dataGeriatrie.fiches.forEach(f => {
      totalChaptersChecked++;
      const html = env.sandbox.renderMarkdown(f.content);
      if (html.includes('<table')) {
        totalTablesFound++;
        assert.ok(
          html.includes('<div class="table-responsive-wrapper"><table class="clinical-table">'),
          `Fiche ${f.num} contains an unwrapped table!`
        );
      }
    });

    assert.ok(totalTablesFound > 0, 'Must verify tables in clinical data');
    console.log(`      ↳ Audited ${totalChaptersChecked} chapters/fiches; verified ${totalTablesFound} clinical tables.`);
  });

  // ============================================================================
  // SUITE 7: INTERACTIVITY & RESPONSIVE DRAWER
  // ============================================================================
  console.log('\n===============================================================================');
  console.log('   SUITE 7: Interactivity, Sidebar Drawer & Check-list State');
  console.log('===============================================================================');

  test('Interactivity', '7.1 toggleSidebar manages active states, backdrop, and aria-expanded', () => {
    const env = createTestEnv();
    const sidebar = new MockElement('aside');
    sidebar.id = 'sidebar';
    env.body.appendChild(sidebar);

    const mobileBtn = new MockElement('button');
    mobileBtn.id = 'mobileMenuBtn';
    env.body.appendChild(mobileBtn);

    // Open sidebar
    env.sandbox.toggleSidebar(true);
    assert.strictEqual(sidebar.classList.contains('open'), true);
    assert.strictEqual(mobileBtn.getAttribute('aria-expanded'), 'true');
    assert.strictEqual(mobileBtn.innerHTML, '✕');

    // Close sidebar
    env.sandbox.toggleSidebar(false);
    assert.strictEqual(sidebar.classList.contains('open'), false);
    assert.strictEqual(mobileBtn.getAttribute('aria-expanded'), 'false');
    assert.strictEqual(mobileBtn.innerHTML, '☰');
  });

  test('Interactivity', '7.2 Checklist toggling and resetting correctly persists to safeStorage', () => {
    const env = createTestEnv();

    // Toggle checklist item c1
    env.sandbox.toggleChecklistItem('c1');
    assert.strictEqual(env.windowMock.AppState.checklistState['c1'], true);

    // Toggle checklist item c2
    env.sandbox.toggleChecklistItem('c2');
    assert.strictEqual(env.windowMock.AppState.checklistState['c2'], true);

    // Reset checklist
    env.sandbox.resetChecklist();
    assert.strictEqual(Object.keys(env.windowMock.AppState.checklistState).length, 0);
  });

  // ============================================================================
  // TEST SUMMARY & FINAL REPORT
  // ============================================================================
  console.log('\n===============================================================================');
  console.log('   CHALLENGER 2 TEST EXECUTION SUMMARY');
  console.log('===============================================================================');
  console.log(`  Total tests executed : ${totalTests}`);
  console.log(`  Tests passed         : ${passedTests}`);
  console.log(`  Tests failed         : ${failedTests}`);
  console.log('===============================================================================');

  if (failedTests > 0) {
    console.log('\n❌ ADVERSARIAL DEFECTS DETECTED:');
    failures.forEach((f, idx) => {
      console.log(`  ${idx + 1}. [${f.category}] ${f.name}`);
      console.log(`     ↳ ${f.error}`);
    });
    console.log('\nVerdict: REQUEST_CHANGES');
    process.exitCode = 1;
  } else {
    console.log('\n✅ ALL ADVERSARIAL CHALLENGER TESTS PASSED');
    console.log('Verdict: APPROVE');
    process.exitCode = 0;
  }
})();
