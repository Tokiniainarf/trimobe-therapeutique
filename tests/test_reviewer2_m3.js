/**
 * REVIEWER 2 (teamwork_preview_reviewer) INDEPENDENT VERIFICATION SUITE
 * Milestone 3: Functional Reliability, Interactivity & PWA (Requirement R3)
 */

const assert = require('assert');
const fs = require('fs');
const path = require('path');

// -----------------------------------------------------------------------------
// 1. DOM MOCK INVARIANT ENFORCEMENT (MANDATORY USER RULE)
// -----------------------------------------------------------------------------
class CompliantMockElement {
  constructor(tagName = 'div') {
    this.tagName = String(tagName || 'div').toUpperCase();
    this._textContent = '';
    this._innerHTML = '';
    this._classList = new Set();
    this.attributes = {};
    this.dataset = {};
    this.style = {};
    this.children = [];
    this.parentNode = null;
    this.parentElement = null;
  }

  get id() {
    return this.getAttribute('id') || '';
  }
  set id(v) {
    this.setAttribute('id', String(v || ''));
  }

  get textContent() {
    return this._textContent;
  }
  set textContent(val) {
    if (val === null || val === undefined) {
      this._textContent = '';
      this._innerHTML = '';
    } else {
      this._textContent = String(val);
      this._innerHTML = this._textContent
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
    }
  }

  get innerHTML() {
    return this._innerHTML;
  }
  set innerHTML(val) {
    this._innerHTML = String(val || '');
    this._textContent = this._innerHTML
      .replace(/<[^>]*>/g, '')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'");
  }

  setAttribute(name, value) {
    this.attributes[name] = String(value);
    if (name === 'class') {
      this._classList.clear();
      String(value).split(/\s+/).filter(Boolean).forEach(c => this._classList.add(c));
    }
  }
  getAttribute(name) {
    return Object.prototype.hasOwnProperty.call(this.attributes, name) ? this.attributes[name] : null;
  }
  hasAttribute(name) {
    return Object.prototype.hasOwnProperty.call(this.attributes, name);
  }
  removeAttribute(name) {
    delete this.attributes[name];
    if (name === 'class') this._classList.clear();
  }

  get classList() {
    const self = this;
    return {
      add(...classes) {
        classes.forEach(c => { if (c) self._classList.add(String(c)); });
      },
      remove(...classes) {
        classes.forEach(c => { if (c) self._classList.delete(String(c)); });
      },
      toggle(c, force) {
        c = String(c);
        if (typeof force === 'boolean') {
          if (force) self._classList.add(c);
          else self._classList.delete(c);
          return force;
        }
        if (self._classList.has(c)) {
          self._classList.delete(c);
          return false;
        } else {
          self._classList.add(c);
          return true;
        }
      },
      contains(c) {
        return self._classList.has(String(c));
      }
    };
  }

  appendChild(child) {
    if (child.parentNode && typeof child.parentNode.removeChild === 'function') {
      child.parentNode.removeChild(child);
    }
    child.parentNode = this;
    child.parentElement = this;
    this.children.push(child);
    return child;
  }
  insertBefore(newChild, refChild) {
    if (newChild.parentNode && typeof newChild.parentNode.removeChild === 'function') {
      newChild.parentNode.removeChild(newChild);
    }
    newChild.parentNode = this;
    newChild.parentElement = this;
    const idx = this.children.indexOf(refChild);
    if (idx >= 0) this.children.splice(idx, 0, newChild);
    else this.children.push(newChild);
    return newChild;
  }
  removeChild(child) {
    const idx = this.children.indexOf(child);
    if (idx >= 0) {
      this.children.splice(idx, 1);
      child.parentNode = null;
      child.parentElement = null;
    }
    return child;
  }

  querySelectorAll(selector) {
    const matched = [];
    function walk(node) {
      for (const ch of node.children) {
        if (selector === 'table' && ch.tagName === 'TABLE') matched.push(ch);
        if (selector === 'option' && ch.tagName === 'OPTION') matched.push(ch);
        walk(ch);
      }
    }
    walk(this);
    return matched;
  }
  querySelector(selector) {
    const list = this.querySelectorAll(selector);
    return list.length > 0 ? list[0] : null;
  }
  focus() {}
  select() {}
}

// Initialiser un DOM mock minimaliste global pour charger app.js sans ReferenceError
const docElement = new CompliantMockElement('html');
const body = new CompliantMockElement('body');
docElement.appendChild(body);

const mockElements = new Map();

global.document = {
  documentElement: docElement,
  body: body,
  createElement: (tag) => new CompliantMockElement(tag),
  getElementById: (id) => {
    if (mockElements.has(id)) return mockElements.get(id);
    const el = new CompliantMockElement('div');
    el.id = id;
    mockElements.set(id, el);
    return el;
  },
  querySelector: (sel) => null,
  querySelectorAll: (sel) => [],
  addEventListener: () => {},
  removeEventListener: () => {}
};

global.window = {
  scrollTo: () => {},
  addEventListener: () => {},
  removeEventListener: () => {}
};

// Charger les modules du projet
const GENERAL_MANUAL_DATA = require('../data-general.js');
const GERIATRIE_MANUAL_DATA = require('../data-geriatrie.js');
const DRUGS_DATA = require('../data-drugs.js');
const Calculators = require('../calculators.js');

global.GENERAL_MANUAL_DATA = GENERAL_MANUAL_DATA;
global.GERIATRIE_MANUAL_DATA = GERIATRIE_MANUAL_DATA;
global.DRUGS_DATA = DRUGS_DATA;
global.Calculators = Calculators;

const appModule = require('../app.js');

const {
  AppState,
  normalizeStr,
  performGlobalSearch,
  buildSearchIndex,
  applyDrugFilters,
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
} = appModule;

let passCount = 0;
let failCount = 0;

function it(desc, fn) {
  try {
    fn();
    passCount++;
    console.log(`  ✓ [PASS] ${desc}`);
  } catch (err) {
    failCount++;
    console.error(`  ✗ [FAIL] ${desc}`);
    console.error(`    Error: ${err.message}`);
  }
}

async function itAsync(desc, fn) {
  try {
    await fn();
    passCount++;
    console.log(`  ✓ [PASS] ${desc}`);
  } catch (err) {
    failCount++;
    console.error(`  ✗ [FAIL] ${desc}`);
    console.error(`    Error: ${err.message}`);
  }
}

console.log('\n======================================================================');
console.log('   REVIEWER 2 INDEPENDENT CLINICAL, UX & ADVERSARIAL AUDIT (M3)');
console.log('======================================================================\n');

(async () => {
  console.log('--- 1. Mandatory User Rule: Sandboxed DOM Testing Invariants ---');

  it('Compliant mock correctly synchronizes textContent escaping into innerHTML and vice-versa', () => {
    const el = new CompliantMockElement('div');
    el.textContent = 'Posologie < 10 mg & > 5 mg';
    assert.strictEqual(el.innerHTML, 'Posologie &lt; 10 mg &amp; &gt; 5 mg');
    assert.strictEqual(el.textContent, 'Posologie < 10 mg & > 5 mg');

    el.innerHTML = '<p>Amoxicilline &amp; Acide clavulanique &lt;urgence&gt;</p>';
    assert.strictEqual(el.textContent, 'Amoxicilline & Acide clavulanique <urgence>');
  });

  // ---------------------------------------------------------------------------
  // 2. CLINICAL SEARCH USABILITY & DIACRITIC NORMALIZATION
  // ---------------------------------------------------------------------------
  console.log('\n--- 2. Clinical Search Usability & Diacritic Normalization ---');

  it('normalizeStr strictly removes diacritics, lowercase-converts and trims', () => {
    assert.strictEqual(normalizeStr('Ulcère gastro-duodénal'), 'ulcere gastro-duodenal');
    assert.strictEqual(normalizeStr('GÉRIATRIE & VULNÉRABILITÉ'), 'geriatrie & vulnerabilite');
    assert.strictEqual(normalizeStr('  HbA1c / Équilibre Glycémique  '), 'hba1c / equilibre glycemique');
    assert.strictEqual(normalizeStr('CRB-65'), 'crb-65');
    assert.strictEqual(normalizeStr(null), '');
    assert.strictEqual(normalizeStr(undefined), '');
  });

  it('Clinical Search: "ulcere" vs "ulcère" both return ulcer clinical targets', () => {
    const resNoAccent = performGlobalSearch('ulcere');
    const resWithAccent = performGlobalSearch('ulcère');
    assert.ok(resNoAccent.length > 0, 'Query "ulcere" must return results');
    assert.ok(resWithAccent.length > 0, 'Query "ulcère" must return results');

    const hitsNoAccent = resNoAccent.map(r => r.title);
    const hitsWithAccent = resWithAccent.map(r => r.title);

    const hasUlcerTarget = hitsNoAccent.some(t => t.toLowerCase().includes('ulcère') || t.toLowerCase().includes('ulcere') || t.includes('Oméprazole'));
    assert.ok(hasUlcerTarget, 'Search "ulcere" must target ulcer protocols or Oméprazole');
    assert.deepStrictEqual(hitsNoAccent, hitsWithAccent, 'Search results for "ulcere" and "ulcère" must be identical in ranking');
  });

  it('Clinical Search: "geriatrie" vs "gériatrie" return geriatrics practical fiches', () => {
    const res1 = performGlobalSearch('geriatrie');
    const res2 = performGlobalSearch('gériatrie');
    assert.ok(res1.length > 0, 'Query "geriatrie" must return results');
    assert.deepStrictEqual(res1.map(r => r.id), res2.map(r => r.id), 'Search results for geriatrie and gériatrie must match exactly');
    const hasGeriatrieFiches = res1.some(r => r.type === 'geriatrie');
    assert.ok(hasGeriatrieFiches, 'Must contain geriatrics fiches');
  });

  it('Clinical Search: "hba1c" returns diabetic glycemic monitoring and conversion targets', () => {
    const res = performGlobalSearch('hba1c');
    assert.ok(res.length > 0, 'Query "hba1c" must return results');
    const titles = res.map(r => r.title).join(' ');
    assert.ok(titles.includes('Diabète') || titles.includes('Glyc') || titles.includes('Metformine'), 'Query "hba1c" must surface diabetes or glycemic targets');
  });

  it('Clinical Search: "crb65" vs "crb-65" vs "CRB-65" return Pneumonia triage (Ch. XV)', () => {
    const resRaw = performGlobalSearch('crb65');
    const resHyphen = performGlobalSearch('crb-65');
    const resUpper = performGlobalSearch('CRB-65');
    assert.ok(resRaw.length > 0, 'Query "crb65" without hyphen must return results');
    assert.ok(resHyphen.length > 0, 'Query "crb-65" with hyphen must return results');
    assert.ok(resUpper.length > 0, 'Query "CRB-65" uppercase must return results');

    const targetId = 'XV'; // Ch. XV Pneumonie
    assert.ok(resRaw.some(r => r.id === targetId || r.title.includes('XV') || r.title.includes('Pneumonie')), 'Must target Chapter XV');
    assert.ok(resHyphen.some(r => r.id === targetId || r.title.includes('XV') || r.title.includes('Pneumonie')), 'Must target Chapter XV');
  });

  it('Clinical Search: "amox" surfaces Amoxicilline in top results', () => {
    const res = performGlobalSearch('amox');
    assert.ok(res.length > 0, 'Query "amox" must return results');
    const topDrug = res.find(r => r.type === 'drug');
    assert.ok(topDrug, 'Must find drug entry');
    assert.ok(topDrug.id === 'Amoxicilline' || topDrug.title.includes('Amoxicilline'), 'Must target Amoxicilline');
  });

  it('Clinical Search: "avc" surfaces Accident Vasculaire Cérébral emergency chapter', () => {
    const res = performGlobalSearch('avc');
    assert.ok(res.length > 0, 'Query "avc" must return results');
    const hasAvc = res.some(r => r.title.includes('AVC') || r.snippet.includes('AVC') || r.title.includes('Vasculaire'));
    assert.ok(hasAvc, 'Must target AVC emergency protocol');
  });

  it('Clinical Search Adversarial Robustness: symbols, regex characters, empty and extreme queries', () => {
    assert.doesNotThrow(() => performGlobalSearch('.*'));
    assert.doesNotThrow(() => performGlobalSearch('[a-z]+'));
    assert.doesNotThrow(() => performGlobalSearch('(?=.*)'));
    assert.doesNotThrow(() => performGlobalSearch('\\d+\\s+'));
    assert.doesNotThrow(() => performGlobalSearch('<script>alert("xss")</script>'));

    assert.deepStrictEqual(performGlobalSearch(''), []);
    assert.deepStrictEqual(performGlobalSearch('   '), []);
    assert.deepStrictEqual(performGlobalSearch(null), []);
    assert.deepStrictEqual(performGlobalSearch(undefined), []);

    const longQuery = 'amoxicilline '.repeat(500);
    assert.doesNotThrow(() => {
      const res = performGlobalSearch(longQuery);
      assert.ok(Array.isArray(res));
    });

    const noMatch = performGlobalSearch('xyznonexistentterm99999');
    assert.deepStrictEqual(noMatch, []);
  });

  // ---------------------------------------------------------------------------
  // 3. WHO AWARE CLASSIFICATION & STEWARDSHIP FILTERING
  // ---------------------------------------------------------------------------
  console.log('\n--- 3. WHO AWaRe Classification & Antibiotic Stewardship ---');

  it('DRUGS_DATA contains accurate AWaRe antibiotic segmentations', () => {
    const awareDrugs = DRUGS_DATA.filter(d => d.aware);
    assert.ok(awareDrugs.length > 0, 'There must be AWaRe categorized antibiotics');

    const access = awareDrugs.filter(d => d.aware.toLowerCase() === 'access');
    const watch = awareDrugs.filter(d => d.aware.toLowerCase() === 'watch');
    const reserve = awareDrugs.filter(d => d.aware.toLowerCase() === 'reserve');

    assert.strictEqual(access.length, 8, 'Must have 8 Access antibiotics');
    assert.strictEqual(watch.length, 4, 'Must have 4 Watch antibiotics');

    const amox = DRUGS_DATA.find(d => d.dci === 'Amoxicilline');
    assert.ok(amox && amox.aware.toLowerCase() === 'access', 'Amoxicilline must be Access');

    const amoxClav = DRUGS_DATA.find(d => d.dci === 'Amoxicilline / acide clavulanique');
    assert.ok(amoxClav && amoxClav.aware.toLowerCase() === 'access', 'Amox/Clav must be Access');

    const cipro = DRUGS_DATA.find(d => d.dci === 'Ciprofloxacine');
    assert.ok(cipro && cipro.aware.toLowerCase() === 'watch', 'Ciprofloxacine must be Watch');

    const ceftri = DRUGS_DATA.find(d => d.dci === 'Ceftriaxone');
    assert.ok(ceftri && ceftri.aware.toLowerCase() === 'watch', 'Ceftriaxone must be Watch');

    const azithro = DRUGS_DATA.find(d => d.dci === 'Azithromycine');
    assert.ok(azithro && azithro.aware.toLowerCase() === 'watch', 'Azithromycine must be Watch');
  });

  it('applyDrugFilters properly segments table rows by AWaRe tier', () => {
    const searchInput = new CompliantMockElement('input');
    searchInput.id = 'drugSearchInput';
    searchInput.value = '';

    const renalFilter = new CompliantMockElement('select');
    renalFilter.id = 'drugRenalFilter';
    renalFilter.value = 'all';

    const riskFilter = new CompliantMockElement('select');
    riskFilter.id = 'drugRiskFilter';
    riskFilter.value = 'all';

    const awareFilter = new CompliantMockElement('select');
    awareFilter.id = 'filterDrugAware';
    awareFilter.value = 'all';

    const tbody = new CompliantMockElement('tbody');
    tbody.id = 'drugsTableBody';

    mockElements.set('drugSearchInput', searchInput);
    mockElements.set('drugRenalFilter', renalFilter);
    mockElements.set('drugRiskFilter', riskFilter);
    mockElements.set('filterDrugAware', awareFilter);
    mockElements.set('drugsTableBody', tbody);

    // 1. Filtrer 'access'
    awareFilter.value = 'access';
    applyDrugFilters();
    assert.ok(tbody.innerHTML.includes('Amoxicilline'), 'Table must contain Amoxicilline under Access');
    assert.ok(tbody.innerHTML.includes('badge-aware-access'), 'Rows must render badge-aware-access');
    assert.ok(!tbody.innerHTML.includes('Ciprofloxacine'), 'Table must not contain Ciprofloxacine (Watch) under Access');

    // 2. Filtrer 'watch'
    awareFilter.value = 'watch';
    applyDrugFilters();
    assert.ok(tbody.innerHTML.includes('Ciprofloxacine'), 'Table must contain Ciprofloxacine under Watch');
    assert.ok(tbody.innerHTML.includes('Ceftriaxone'), 'Table must contain Ceftriaxone under Watch');
    assert.ok(tbody.innerHTML.includes('badge-aware-watch'), 'Rows must render badge-aware-watch');
    assert.ok(!tbody.innerHTML.includes('Amoxicilline<'), 'Table must not contain Amoxicilline under Watch');

    // 3. Filtrer 'reserve'
    awareFilter.value = 'reserve';
    applyDrugFilters();
    assert.ok(tbody.innerHTML.includes('Aucun médicament correspondant'), 'Reserve filter with 0 items displays empty state');
  });

  // ---------------------------------------------------------------------------
  // 4. BEDSIDE RELIABILITY: CLIPBOARD FALLBACK, SAFESTORAGE & PRINT
  // ---------------------------------------------------------------------------
  console.log('\n--- 4. Bedside Reliability: Clipboard Fallback, SafeStorage & Print ---');

  it('copyChecklistNote: Clipboard fallback operates when navigator.clipboard is unavailable', () => {
    let textareaCreated = false;
    let execCommandCalled = false;
    let copiedText = '';

    const origCreateElement = global.document.createElement;
    const textareaMock = new CompliantMockElement('textarea');
    textareaMock.select = function() {
      copiedText = this.value;
    };

    global.document.createElement = function(tag) {
      if (tag === 'textarea') {
        textareaCreated = true;
        return textareaMock;
      }
      return origCreateElement(tag);
    };
    global.document.execCommand = function(cmd) {
      if (cmd === 'copy') {
        execCommandCalled = true;
        return true;
      }
      return false;
    };

    global.navigator = {}; // pas de clipboard

    copyChecklistNote();

    assert.ok(textareaCreated, 'Fallback textarea must be created when navigator.clipboard is absent');
    assert.ok(execCommandCalled, 'document.execCommand("copy") must be invoked in fallback');
    assert.ok(copiedText.includes('Sécurité Ordonnance - Collection TRIMOBE'), 'Copied text must include clinical safety header');

    global.document.createElement = origCreateElement;
    delete global.document.execCommand;
    delete global.navigator;
  });

  await itAsync('copyChecklistNote: Graceful recovery when navigator.clipboard.writeText rejects (NotAllowedError)', async () => {
    let fallbackInvoked = false;

    global.document.execCommand = function() {
      fallbackInvoked = true;
      return true;
    };

    global.navigator = {
      clipboard: {
        writeText(text) {
          return Promise.reject(new Error('NotAllowedError: Permission denied'));
        }
      }
    };

    copyChecklistNote();

    await new Promise(r => setTimeout(r, 60));

    assert.ok(fallbackInvoked, 'Fallback copy must be invoked upon clipboard promise rejection');
    delete global.document.execCommand;
    delete global.navigator;
  });

  it('safeStorage: Seamless in-memory fallback during Private Browsing (SecurityError / QuotaExceededError)', () => {
    const throwingLocalStorage = {
      getItem(key) {
        const err = new Error('SecurityError: The operation is insecure.');
        err.name = 'SecurityError';
        throw err;
      },
      setItem(key, val) {
        const err = new Error('QuotaExceededError: DOM Exception 22');
        err.name = 'QuotaExceededError';
        throw err;
      }
    };

    global.localStorage = throwingLocalStorage;

    assert.doesNotThrow(() => {
      safeStorageSet('test_key_bedside', 'clinical_value_123');
    }, 'safeStorageSet must not throw on storage exceptions');

    const retrieved = safeStorageGet('test_key_bedside');
    assert.strictEqual(retrieved, 'clinical_value_123', 'safeStorageGet must return value from memoryStore fallback');

    assert.doesNotThrow(() => {
      safeStorageSetJSON('test_json_key', { patient: 'P001', crb65: 2 });
    });

    const parsed = safeStorageGetJSON('test_json_key', {});
    assert.deepStrictEqual(parsed, { patient: 'P001', crb65: 2 }, 'safeStorageGetJSON must return object from memoryStore');

    safeStorageSet('corrupt_json', '{not-valid-json}');
    const fallbackVal = safeStorageGetJSON('corrupt_json', { default: true });
    assert.deepStrictEqual(fallbackVal, { default: true }, 'safeStorageGetJSON must return fallback on JSON syntax error');

    delete global.localStorage;
  });

  it('High-fidelity print styles: style.css contains exhaustive @media print rules', () => {
    const cssPath = path.join(__dirname, '..', 'style.css');
    const css = fs.readFileSync(cssPath, 'utf8');

    assert.ok(css.includes('@media print'), 'style.css must contain @media print section');

    const printBlock = css.substring(css.indexOf('@media print'));
    assert.ok(printBlock.includes('.sidebar'), 'Print styles must reference .sidebar');
    assert.ok(printBlock.includes('.top-navbar'), 'Print styles must reference .top-navbar');
    assert.ok(printBlock.includes('#searchModal'), 'Print styles must reference #searchModal');
    assert.ok(printBlock.includes('display: none !important;'), 'Must hide elements with display: none !important');

    assert.ok(printBlock.includes('.table-responsive-wrapper') || printBlock.includes('.table-responsive'), 'Must target table wrappers in print');
    assert.ok(printBlock.includes('overflow: visible !important;'), 'Table wrapper must be overflow: visible in print');

    assert.ok(printBlock.includes('page-break-inside: avoid !important;') || printBlock.includes('break-inside: avoid !important;'), 'Must avoid breaks inside medical cards');
  });

  // ---------------------------------------------------------------------------
  // 5. PWA SERVICE WORKER & ASSETS PRECACHING AUDIT
  // ---------------------------------------------------------------------------
  console.log('\n--- 5. PWA Service Worker & Shell Precaching Audit ---');

  it('sw.js specifies trimobe-therapeutique-v2 and precaches all shell assets', () => {
    const swPath = path.join(__dirname, '..', 'sw.js');
    const swCode = fs.readFileSync(swPath, 'utf8');

    assert.ok(swCode.includes('trimobe-therapeutique-v2'), 'sw.js must use cache name trimobe-therapeutique-v2');

    const requiredAssets = [
      './index.html',
      './style.css',
      './data-general.js',
      './data-geriatrie.js',
      './data-drugs.js',
      './calculators.js',
      './app.js',
      './manifest.json'
    ];

    requiredAssets.forEach(asset => {
      assert.ok(swCode.includes(asset), `sw.js precache must include ${asset}`);
    });

    assert.ok(swCode.includes("event.request.mode === 'navigate'"), 'sw.js must handle offline navigation fallback');
  });

  // ---------------------------------------------------------------------------
  // 6. ADVERSARIAL INTEGRITY AUDIT: CODE QUALITY & NO HARDCODED CHEATING
  // ---------------------------------------------------------------------------
  console.log('\n--- 6. Adversarial Integrity Audit: No Hardcoded Shortcuts ---');

  it('performGlobalSearch uses algorithmic scoring without hardcoded keyword conditions', () => {
    const appCode = fs.readFileSync(path.join(__dirname, '..', 'app.js'), 'utf8');
    
    const searchFuncMatch = appCode.match(/function performGlobalSearch\([\s\S]*?\n\}/);
    assert.ok(searchFuncMatch, 'performGlobalSearch must exist in app.js');
    const searchFuncBody = searchFuncMatch[0];

    assert.ok(!searchFuncBody.includes("query === 'ulcere'"), 'Must not have hardcoded query === "ulcere"');
    assert.ok(!searchFuncBody.includes("query === 'amox'"), 'Must not have hardcoded query === "amox"');
    assert.ok(!searchFuncBody.includes("query === 'geriatrie'"), 'Must not have hardcoded query === "geriatrie"');
    assert.ok(!searchFuncBody.includes("query === 'crb65'"), 'Must not have hardcoded query === "crb65"');

    assert.ok(searchFuncBody.includes('item.normTitle'), 'Must use generic item.normTitle');
    assert.ok(searchFuncBody.includes('item.normSummary'), 'Must use generic item.normSummary');
    assert.ok(searchFuncBody.includes('results.sort'), 'Must sort results by score');
  });

  it('.gitignore excludes all multi-agent metadata and temporary artifacts', () => {
    const gitignorePath = path.join(__dirname, '..', '.gitignore');
    assert.ok(fs.existsSync(gitignorePath), '.gitignore must exist');
    const gitignore = fs.readFileSync(gitignorePath, 'utf8');

    assert.ok(gitignore.includes('.agents/'), '.gitignore must exclude .agents/');
    assert.ok(gitignore.includes('*.log'), '.gitignore must exclude *.log');
    assert.ok(gitignore.includes('.system_generated/'), '.gitignore must exclude .system_generated/');
  });

  // ---------------------------------------------------------------------------
  // SUMMARY
  // ---------------------------------------------------------------------------
  console.log('\n======================================================================');
  console.log(`REVIEWER 2 TEST SUMMARY:`);
  console.log(`  Passed assertions : ${passCount}`);
  console.log(`  Failed assertions : ${failCount}`);
  console.log('======================================================================\n');

  if (failCount > 0) {
    process.exit(1);
  } else {
    console.log('✅ ALL REVIEWER 2 INDEPENDENT ADVERSARIAL CHECKS PASSED EMPIRICALLY!\n');
    process.exit(0);
  }
})();
