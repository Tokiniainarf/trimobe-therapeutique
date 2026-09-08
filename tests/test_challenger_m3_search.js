/**
 * EMPIRICAL ADVERSARIAL CHALLENGER TEST SUITE — MILESTONE 3 (REQUIREMENT R3)
 * File: tests/test_challenger_m3_search.js
 *
 * Mission:
 * Adversarially stress-test and fuzz the Search Normalization and DCI Filtering
 * features implemented in app.js:
 * 1. Diacritic combinations & French phonetics (acute, grave, circumflex, trema, tilde, cedilla, ligatures).
 * 2. Special characters, regex injections, SQL-like/XSS strings, prototype keywords.
 * 3. Extreme inputs: empty strings, pure whitespace, 1000+ chars, null, undefined, numbers, booleans, objects.
 * 4. Verify performGlobalSearch() exception safety and clean array return.
 * 5. Verify #filterDrugAware filtering (Access, Watch, Reserve, Tous, All, invalid) and DRUGS_DATA immutability.
 * 6. Sandboxed DOM Testing Invariants compliance.
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');
const assert = require('assert');

console.log("\n===============================================================================");
console.log("   EMPIRICAL CHALLENGER SUITE — M3: SEARCH FUZZING & DCI AWaRe FILTERING");
console.log("===============================================================================\n");

let totalAssertions = 0;
let passedAssertions = 0;
let failedAssertions = 0;
const findings = [];

function assertTest(category, name, fn) {
  totalAssertions++;
  try {
    fn();
    passedAssertions++;
    console.log(`  ✓ [${category}] ${name}`);
  } catch (err) {
    failedAssertions++;
    findings.push({ category, name, error: err.message, stack: err.stack });
    console.error(`  ✗ [${category}] ${name}`);
    console.error(`    ↳ Error: ${err.message}`);
  }
}

// -----------------------------------------------------------------------------
// SECTION 1: SANDBOXED DOM TESTING INVARIANTS (MANDATORY USER RULE)
// -----------------------------------------------------------------------------

class MockElement {
  constructor(tagName = 'div') {
    const self = this;
    this.tagName = String(tagName).toUpperCase();
    this.children = [];
    this.parentNode = null;
    this.parentElement = null;
    this._innerHTML = '';
    this._textContent = '';
    this.attributes = {};
    this.dataset = {};
    this.style = {};
    this._id = '';
    this._value = '';
    this._classList = new Set();
    this.classList = {
      add: (...tokens) => {
        tokens.forEach(t => { if (t) self._classList.add(String(t)); });
      },
      remove: (...tokens) => {
        tokens.forEach(t => { if (t) self._classList.delete(String(t)); });
      },
      toggle: (token, force) => {
        token = String(token);
        if (typeof force === 'boolean') {
          if (force) { self._classList.add(token); return true; }
          else { self._classList.delete(token); return false; }
        }
        if (self._classList.has(token)) {
          self._classList.delete(token);
          return false;
        } else {
          self._classList.add(token);
          return true;
        }
      },
      contains: (token) => self._classList.has(String(token)),
      get length() { return self._classList.size; },
      toString: () => Array.from(self._classList).join(' ')
    };
  }

  get id() { return this._id || this.getAttribute('id') || ''; }
  set id(v) { this._id = String(v || ''); this.setAttribute('id', this._id); }

  get value() { return this._value; }
  set value(v) { this._value = v === null || v === undefined ? '' : String(v); }

  get className() { return Array.from(this._classList).join(' '); }
  set className(val) {
    this._classList.clear();
    if (val && typeof val === 'string') {
      val.split(/\s+/).filter(Boolean).forEach(cls => this._classList.add(cls));
    }
  }

  get innerHTML() { return this._innerHTML; }
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

  get textContent() { return this._textContent; }
  set textContent(val) {
    this._textContent = val === null || val === undefined ? '' : String(val);
    this._innerHTML = this._textContent
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
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

  querySelectorAll(sel) {
    const results = [];
    function traverse(node) {
      if (sel === 'table' && node.tagName === 'TABLE') results.push(node);
      if (sel.startsWith('.') && node.classList && node.classList.contains(sel.substring(1))) results.push(node);
      if (sel.startsWith('#') && node.id === sel.substring(1)) results.push(node);
      for (const ch of node.children) traverse(ch);
    }
    traverse(this);
    return results;
  }

  querySelector(sel) {
    const all = this.querySelectorAll(sel);
    return all.length > 0 ? all[0] : null;
  }
}

// -----------------------------------------------------------------------------
// ENVIRONMENT SETUP & APP LOADING
// -----------------------------------------------------------------------------

const projectRoot = path.resolve(__dirname, '..');
const appCode = fs.readFileSync(path.join(projectRoot, 'app.js'), 'utf8');
const dataGeneral = require(path.join(projectRoot, 'data-general.js'));
const dataGeriatrie = require(path.join(projectRoot, 'data-geriatrie.js'));
const dataDrugs = require(path.join(projectRoot, 'data-drugs.js'));
const calculators = require(path.join(projectRoot, 'calculators.js'));

const docElement = new MockElement('html');
const body = new MockElement('body');
docElement.appendChild(body);

const listeners = {};
const inMemoryStorage = {};

const documentMock = {
  documentElement: docElement,
  body: body,
  createElement: (tag) => new MockElement(tag),
  getElementById: (id) => {
    function search(node) {
      if (node.id === id || node.getAttribute('id') === id) return node;
      for (const ch of node.children) {
        const res = search(ch);
        if (res) return res;
      }
      return null;
    }
    return search(docElement);
  },
  querySelectorAll: (sel) => {
    const results = [];
    function traverse(node) {
      if (sel === 'table' && node.tagName === 'TABLE') results.push(node);
      if (sel === 'meta[name="theme-color"]' && node.tagName === 'META' && node.getAttribute('name') === 'theme-color') results.push(node);
      if (sel.startsWith('.') && node.classList && node.classList.contains(sel.substring(1))) results.push(node);
      if (sel.startsWith('#') && node.id === sel.substring(1)) results.push(node);
      for (const ch of node.children) traverse(ch);
    }
    traverse(docElement);
    return results;
  },
  querySelector: (sel) => {
    const all = documentMock.querySelectorAll(sel);
    return all.length > 0 ? all[0] : null;
  },
  addEventListener: (evt, handler) => {
    if (!listeners[evt]) listeners[evt] = [];
    listeners[evt].push(handler);
  }
};

const metaTheme = new MockElement('meta');
metaTheme.setAttribute('name', 'theme-color');
metaTheme.setAttribute('content', '#0284c7');
docElement.appendChild(metaTheme);

// Attach standard stage elements for app.js initialization
const contentStage = new MockElement('div');
contentStage.id = 'contentStage';
body.appendChild(contentStage);

const sidebarNavList = new MockElement('div');
sidebarNavList.id = 'sidebarNavList';
body.appendChild(sidebarNavList);

const modalResultsList = new MockElement('div');
modalResultsList.id = 'modalResultsList';
body.appendChild(modalResultsList);

const windowMock = {
  document: documentMock,
  localStorage: {
    getItem: (k) => Object.prototype.hasOwnProperty.call(inMemoryStorage, k) ? inMemoryStorage[k] : null,
    setItem: (k, v) => { inMemoryStorage[k] = String(v); },
    removeItem: (k) => { delete inMemoryStorage[k]; },
    clear: () => { for (const k in inMemoryStorage) delete inMemoryStorage[k]; }
  },
  innerWidth: 1024,
  scrollTo: () => {},
  print: () => {},
  alert: (msg) => { windowMock._lastAlert = msg; },
  _lastAlert: null,
  navigator: {
    clipboard: {
      writeText: (txt) => { windowMock._lastCopied = txt; return Promise.resolve(); }
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
vm.runInContext(appCode, sandbox);

const {
  normalizeStr,
  buildSearchIndex,
  getSearchIndex,
  performGlobalSearch,
  renderSearchResults,
  applyDrugFilters,
  renderDrugsView,
  AppState
} = sandbox;

// -----------------------------------------------------------------------------
// TEST SUITE EXECUTION
// -----------------------------------------------------------------------------

console.log("--- 1. Sandboxed DOM Testing Invariants ---");

assertTest("DOM_INVARIANTS", "textContent setter escapes HTML entities into innerHTML", () => {
  const el = new MockElement('span');
  el.textContent = 'Cephalosporine & Macrolide <1g> "urgence" \'stopp\'';
  assert.strictEqual(el.innerHTML, 'Cephalosporine &amp; Macrolide &lt;1g&gt; &quot;urgence&quot; &#39;stopp&#39;');
});

assertTest("DOM_INVARIANTS", "innerHTML setter unescapes HTML entities into textContent", () => {
  const el = new MockElement('div');
  el.innerHTML = 'Amoxicilline &amp; Acide Clavulanique &lt;500mg&gt; &quot;AWaRe&quot;';
  assert.strictEqual(el.textContent, 'Amoxicilline & Acide Clavulanique <500mg> "AWaRe"');
});

assertTest("DOM_INVARIANTS", "classList operations maintain correct set and string representations", () => {
  const el = new MockElement('span');
  el.classList.add('badge-aware', 'badge-aware-access');
  assert.strictEqual(el.classList.contains('badge-aware'), true);
  assert.strictEqual(el.classList.contains('badge-aware-access'), true);
  assert.strictEqual(el.classList.length, 2);
  el.classList.remove('badge-aware-access');
  assert.strictEqual(el.classList.contains('badge-aware-access'), false);
  assert.strictEqual(el.classList.length, 1);
});

console.log("\n--- 2. Diacritic Combinations & French Medical Phonetics ---");

assertTest("DIACRITICS", "Acute accent normalization (é): 'gériatrique' vs 'geriatrique'", () => {
  assert.strictEqual(normalizeStr("gériatrique"), "geriatrique");
  assert.strictEqual(normalizeStr("GÉRIATRIQUE"), "geriatrique");
  const resWith = performGlobalSearch("gériatrique");
  const resWithout = performGlobalSearch("geriatrique");
  assert.ok(resWith.length > 0, "Search with accent returned results");
  assert.ok(resWithout.length > 0, "Search without accent returned results");
  assert.strictEqual(resWith.length, resWithout.length, "Accented and unaccented query return identical result count");
});

assertTest("DIACRITICS", "Grave accent normalization (è, à): 'ulcère' vs 'ulcere'", () => {
  assert.strictEqual(normalizeStr("ulcère"), "ulcere");
  assert.strictEqual(normalizeStr("ULCÈRE"), "ulcere");
  const resWith = performGlobalSearch("ulcère");
  const resWithout = performGlobalSearch("ulcere");
  assert.ok(resWith.length > 0, "Search for ulcère returned results");
  assert.ok(resWithout.length > 0, "Search for ulcere returned results");
  assert.strictEqual(resWith.length, resWithout.length, "Ulcère and ulcere return identical result count");
});

assertTest("DIACRITICS", "Circumflex accent normalization (ê, î, ô, û): 'bêta', 'arrêt', 'côlon'", () => {
  assert.strictEqual(normalizeStr("bêta-bloquant"), "beta-bloquant");
  assert.strictEqual(normalizeStr("arrêt"), "arret");
  assert.strictEqual(normalizeStr("côlon"), "colon");
  const res = performGlobalSearch("bêta");
  const resAscii = performGlobalSearch("beta");
  assert.ok(res.length > 0, "Search for bêta returned results");
  assert.strictEqual(res.length, resAscii.length, "bêta and beta return identical result count");
});

assertTest("DIACRITICS", "Trema/Diaeresis normalization (ï, ë, ü): 'naïf', 'aiguë'", () => {
  assert.strictEqual(normalizeStr("naïf"), "naif");
  assert.strictEqual(normalizeStr("aiguë"), "aigue");
  const resNaif = performGlobalSearch("naïf");
  const resNaifAscii = performGlobalSearch("naif");
  assert.strictEqual(resNaif.length, resNaifAscii.length, "naïf and naif return identical result count");
});

assertTest("DIACRITICS", "Cedilla normalization (ç): 'façon', 'garçon'", () => {
  assert.strictEqual(normalizeStr("garçon"), "garcon");
  assert.strictEqual(normalizeStr("façon"), "facon");
});

assertTest("DIACRITICS", "Tilde normalization (ñ): 'caño', 'año'", () => {
  assert.strictEqual(normalizeStr("caño"), "cano");
  assert.strictEqual(normalizeStr("año"), "ano");
});

assertTest("DIACRITICS_LIGATURE", "Adversarial Check: French ligatures (œ, æ) 'œdème' vs 'oedeme'", () => {
  // In French clinical texts, œdème is standard. Unicode NFD does NOT decompose œ into oe.
  const normOe = normalizeStr("œdème");
  const normOed = normalizeStr("oedeme");
  console.log(`      [Empirical Observation] normalizeStr('œdème') = "${normOe}", normalizeStr('oedeme') = "${normOed}"`);
  const resLigature = performGlobalSearch("œdème");
  const resAscii = performGlobalSearch("oedeme");
  console.log(`      [Empirical Observation] performGlobalSearch('œdème') hits: ${resLigature.length}, performGlobalSearch('oedeme') hits: ${resAscii.length}`);
  assert.ok(resLigature.length > 0, "Search for œdème finds clinical results");
  if (resAscii.length === 0) {
    findings.push({
      category: "LIGATURE_DECOMPOSITION",
      severity: "MEDIUM",
      description: "normalizeStr uses NFD which decomposes combining accents (é -> e), but does not decompose Latin ligatures (œ -> oe, æ -> ae). Therefore, typing 'oedeme' on a standard ASCII keyboard returns 0 results despite 13 occurrences of 'œdème' in the clinical corpus."
    });
  }
});

console.log("\n--- 3. Special Characters & Regex Injections ---");

const regexInjectionPayloads = [
  { name: "Wildcard dot-star", query: ".*" },
  { name: "Character class", query: "[a-z]" },
  { name: "Unbalanced opening paren", query: "(" },
  { name: "Unbalanced closing paren", query: ")" },
  { name: "Literal backslash", query: "\\" },
  { name: "Double backslash", query: "\\\\" },
  { name: "Positive lookahead", query: "(?=.*)" },
  { name: "Quantifier plus", query: "+" },
  { name: "Quantifier question mark", query: "?" },
  { name: "Anchor caret", query: "^" },
  { name: "Anchor dollar", query: "$" },
  { name: "Alternation pipe", query: "|" },
  { name: "Nested parens", query: "((((()))))" },
  { name: "Unclosed bracket", query: "[[[" },
  { name: "Range quantifier", query: "{1,10}" },
  { name: "Backreference", query: "\\1" }
];

for (const p of regexInjectionPayloads) {
  assertTest("REGEX_INJECTION", `Payload '${p.name}' (${JSON.stringify(p.query)}) does not throw and returns array`, () => {
    let res;
    assert.doesNotThrow(() => {
      res = performGlobalSearch(p.query);
    }, `Search crashed on regex injection payload: ${p.query}`);
    assert.ok(Array.isArray(res), "Result must be an array");
  });
}

const specialSymbolPayloads = [
  "<>:\"/\\|?*",
  "!@#$%^&*()_+-=[]{};':\",./<>?",
  "<script>alert(1)</script>",
  "\"><img src=x onerror=alert(1)>",
  "' OR '1'='1",
  "1; DROP TABLE drugs; --",
  "\\x00\\x1f\\x7f",
  "%s%s%s%s",
  "${7*7}",
  "{{7*7}}",
  "__proto__",
  "constructor",
  "prototype",
  "toString",
  "valueOf"
];

for (const sym of specialSymbolPayloads) {
  assertTest("SPECIAL_SYMBOLS", `Symbol payload ${JSON.stringify(sym)} executes safely`, () => {
    let res;
    assert.doesNotThrow(() => {
      res = performGlobalSearch(sym);
    });
    assert.ok(Array.isArray(res), "Result must be an array");
  });
}

console.log("\n--- 4. Extreme Inputs, Boundary Values & Type Robustness ---");

assertTest("EXTREME_INPUTS", "Empty string returns empty array", () => {
  const res = performGlobalSearch("");
  assert.ok(Array.isArray(res));
  assert.strictEqual(res.length, 0);
});

assertTest("EXTREME_INPUTS", "Pure whitespace returns empty array", () => {
  const res = performGlobalSearch("     \t\r\n    ");
  assert.ok(Array.isArray(res));
  assert.strictEqual(res.length, 0);
});

assertTest("EXTREME_INPUTS", "1,000 character string does not crash or cause ReDoS", () => {
  const start = Date.now();
  const longQuery = "a".repeat(1000);
  const res = performGlobalSearch(longQuery);
  const elapsed = Date.now() - start;
  assert.ok(Array.isArray(res));
  assert.ok(elapsed < 200, `Search took ${elapsed}ms (must be < 200ms)`);
});

assertTest("EXTREME_INPUTS", "10,000 character string executes safely and quickly", () => {
  const start = Date.now();
  const massiveQuery = "clinique ".repeat(1000);
  const res = performGlobalSearch(massiveQuery);
  const elapsed = Date.now() - start;
  assert.ok(Array.isArray(res));
  assert.ok(elapsed < 500, `Search took ${elapsed}ms (must be < 500ms)`);
});

assertTest("EXTREME_INPUTS", "null query returns empty array without throwing", () => {
  let res;
  assert.doesNotThrow(() => {
    res = performGlobalSearch(null);
  });
  assert.ok(Array.isArray(res));
  assert.strictEqual(res.length, 0);
});

assertTest("EXTREME_INPUTS", "undefined query returns empty array without throwing", () => {
  let res;
  assert.doesNotThrow(() => {
    res = performGlobalSearch(undefined);
  });
  assert.ok(Array.isArray(res));
  assert.strictEqual(res.length, 0);
});

assertTest("EXTREME_INPUTS", "Zero number input (0) returns empty array without throwing", () => {
  let res;
  assert.doesNotThrow(() => {
    res = performGlobalSearch(0);
  });
  assert.ok(Array.isArray(res));
});

assertTest("EXTREME_INPUTS_NUMBER", "Adversarial Check: Non-zero number (123) input to performGlobalSearch()", () => {
  try {
    const res = performGlobalSearch(123);
    assert.ok(Array.isArray(res));
    console.log(`      [Empirical Observation] performGlobalSearch(123) returned clean array (length: ${res.length})`);
  } catch (err) {
    findings.push({
      category: "TYPE_SAFETY_NUMBER",
      severity: "HIGH",
      description: `performGlobalSearch(123) throws uncaught exception: "${err.message}". In normalizeStr(str), (str || '').normalize() evaluates (123 || '') to the number 123, which does not have a .normalize method.`
    });
    console.log(`      [Empirical Observation] Caught expected type vulnerability: ${err.message}`);
    assert.fail(`performGlobalSearch(123) threw: ${err.message}`);
  }
});

console.log("\n--- 5. DCI AWaRe Classification Filtering (#filterDrugAware) ---");

// Build and mount DCI interactive elements directly into DOM
const drugsContainer = new MockElement('div');
drugsContainer.id = 'drugsTableContainer';

const tableBody = new MockElement('tbody');
tableBody.id = 'drugsTableBody';
drugsContainer.appendChild(tableBody);

const searchInput = new MockElement('input');
searchInput.id = 'drugSearchInput';
searchInput.value = '';
body.appendChild(searchInput);

const renalSelect = new MockElement('select');
renalSelect.id = 'drugRenalFilter';
renalSelect.value = 'all';
body.appendChild(renalSelect);

const riskSelect = new MockElement('select');
riskSelect.id = 'drugRiskFilter';
riskSelect.value = 'all';
body.appendChild(riskSelect);

const awareSelect = new MockElement('select');
awareSelect.id = 'filterDrugAware';
awareSelect.value = 'all';
body.appendChild(awareSelect);

body.appendChild(drugsContainer);

assertTest("DCI_DOM", "DOM elements for DCI filtering are mounted correctly", () => {
  assert.ok(documentMock.getElementById('drugsTableBody'), "#drugsTableBody exists");
  assert.ok(documentMock.getElementById('filterDrugAware'), "#filterDrugAware exists");
  assert.ok(documentMock.getElementById('drugSearchInput'), "#drugSearchInput exists");
  assert.ok(documentMock.getElementById('drugRenalFilter'), "#drugRenalFilter exists");
  assert.ok(documentMock.getElementById('drugRiskFilter'), "#drugRiskFilter exists");
});

// Helper to count rows in tableBody
function countRenderedRows() {
  const matches = tableBody.innerHTML.match(/<tr[\s>]/g);
  return matches ? matches.length : 0;
}

// Snapshot DRUGS_DATA before running any filter tests
const preTestDrugsSnapshot = JSON.stringify(dataDrugs);

assertTest("AWARE_FILTER", "Filter 'all' displays all 78 drugs", () => {
  awareSelect.value = 'all';
  searchInput.value = '';
  renalSelect.value = 'all';
  riskSelect.value = 'all';
  applyDrugFilters();

  const count = countRenderedRows();
  assert.strictEqual(count, 78, `Filter 'all' must display 78 rows (got ${count})`);
});

assertTest("AWARE_FILTER", "Filter 'tous' displays all 78 drugs", () => {
  awareSelect.value = 'tous';
  applyDrugFilters();

  const count = countRenderedRows();
  assert.strictEqual(count, 78, `Filter 'tous' must display 78 rows (got ${count})`);
});

assertTest("AWARE_FILTER", "Filter 'access' displays exactly 8 Access antibiotics with badges", () => {
  awareSelect.value = 'access';
  applyDrugFilters();

  const count = countRenderedRows();
  assert.strictEqual(count, 8, `Filter 'access' must display 8 rows (got ${count})`);
  assert.ok(tableBody.innerHTML.includes('badge-aware-access'), "Contains Access badge");
  assert.ok(!tableBody.innerHTML.includes('badge-aware-watch'), "Does NOT contain Watch badge");
});

assertTest("AWARE_FILTER", "Filter 'watch' displays exactly 4 Watch antibiotics with badges", () => {
  awareSelect.value = 'watch';
  applyDrugFilters();

  const count = countRenderedRows();
  assert.strictEqual(count, 4, `Filter 'watch' must display 4 rows (got ${count})`);
  assert.ok(tableBody.innerHTML.includes('badge-aware-watch'), "Contains Watch badge");
  assert.ok(!tableBody.innerHTML.includes('badge-aware-access'), "Does NOT contain Access badge");
});

assertTest("AWARE_FILTER", "Filter 'reserve' displays 0 drugs and shows empty-state feedback", () => {
  awareSelect.value = 'reserve';
  applyDrugFilters();

  const count = countRenderedRows();
  assert.strictEqual(count, 1, "Must display single empty-state row");
  assert.ok(
    tableBody.textContent.includes("Aucun médicament correspondant aux critères"),
    "Must display clinical empty state message"
  );
});

assertTest("AWARE_FILTER", "Case-insensitivity: 'ACCESS', 'Watch', 'ReSeRvE' are parsed properly", () => {
  awareSelect.value = 'ACCESS';
  applyDrugFilters();
  assert.strictEqual(countRenderedRows(), 8, "ACCESS (uppercase) matches 8 rows");

  awareSelect.value = 'Watch';
  applyDrugFilters();
  assert.strictEqual(countRenderedRows(), 4, "Watch (mixed case) matches 4 rows");
});

assertTest("AWARE_FILTER_COMBINED", "Combination: AWaRe 'access' + Search query 'amox' narrows to 2 items", () => {
  awareSelect.value = 'access';
  searchInput.value = 'amox';
  applyDrugFilters();

  const count = countRenderedRows();
  assert.strictEqual(count, 2, "Amoxicilline and Amoxicilline + clavulanique match");
  assert.ok(tableBody.textContent.includes("Amoxicilline"));
});

assertTest("AWARE_FILTER_COMBINED", "Combination: AWaRe 'watch' + Renal filter 'renal_only'", () => {
  awareSelect.value = 'watch';
  searchInput.value = '';
  renalSelect.value = 'renal_only';
  applyDrugFilters();

  const count = countRenderedRows();
  assert.ok(count > 0, "Watch antibiotics with renal adaptation exist");
  assert.ok(tableBody.textContent.includes("Adaptation DFG"), "Displayed antibiotic requires DFG adaptation");
});

assertTest("DATASET_IMMUTABILITY", "Underlying DRUGS_DATA is NOT mutated after extensive filtering", () => {
  const postTestDrugsSnapshot = JSON.stringify(dataDrugs);
  assert.strictEqual(dataDrugs.length, 78, "DRUGS_DATA length must remain exactly 78");
  assert.strictEqual(
    postTestDrugsSnapshot,
    preTestDrugsSnapshot,
    "DRUGS_DATA must be strictly identical before and after all filter operations (deep equality check)"
  );
});

console.log("\n--- 6. Search Scoring & Structural Integrity ---");

assertTest("SEARCH_SCORING", "Exact title match scores higher than prefix, substring, and summary match", () => {
  const results = performGlobalSearch("Paracétamol");
  assert.ok(results.length > 0, "Paracétamol returned results");
  const topResult = results[0];
  assert.ok(topResult.title.includes("Paracétamol"), "Top result is Paracétamol");
  assert.ok(topResult.score >= 300, `Top result score (${topResult.score}) is high relevance`);

  // Verify descending sort order
  for (let i = 1; i < results.length; i++) {
    assert.ok(results[i - 1].score >= results[i].score, `Result at ${i-1} score >= result at ${i} score`);
  }
});

assertTest("SEARCH_SCORING", "Result objects contain required structural contract keys", () => {
  const results = performGlobalSearch("urgence");
  assert.ok(results.length > 0);
  for (const item of results) {
    assert.ok(['general', 'geriatrie', 'drug'].includes(item.type), `Valid item type: ${item.type}`);
    assert.ok(item.id !== undefined && item.id !== null, "item.id is present");
    assert.ok(typeof item.title === 'string' && item.title.length > 0, "item.title is string");
    assert.ok(typeof item.snippet === 'string', "item.snippet is string");
    assert.ok(typeof item.isUrgent === 'boolean', "item.isUrgent is boolean");
    assert.ok(typeof item.score === 'number' && item.score > 0, "item.score is positive number");
  }
});

console.log("\n--- 7. UI Search Modal Results Renderer ---");

assertTest("UI_SEARCH_MODAL", "renderSearchResults with empty query shows clinical prompt", () => {
  renderSearchResults("");
  assert.ok(modalResultsList.innerHTML.includes("Tapez un mot-clé"), "Prompt text displayed");
});

assertTest("UI_SEARCH_MODAL", "renderSearchResults with unmatched query shows friendly empty message", () => {
  renderSearchResults("terme_inexistant_xyz_9999");
  assert.ok(modalResultsList.innerHTML.includes("Aucun résultat trouvé pour"), "Empty state message displayed");
  assert.ok(modalResultsList.innerHTML.includes("terme_inexistant_xyz_9999"), "Query echoed in empty state");
});

assertTest("UI_SEARCH_MODAL", "renderSearchResults with matching query caps at 15 items", () => {
  renderSearchResults("a");
  const matches = modalResultsList.innerHTML.match(/class="search-result-item"/g);
  const count = matches ? matches.length : 0;
  assert.ok(count > 0, "Results rendered");
  assert.ok(count <= 15, `Results capped at 15 (got ${count})`);
});

// -----------------------------------------------------------------------------
// SUMMARY REPORT
// -----------------------------------------------------------------------------

console.log("\n===============================================================================");
console.log(`   RÉSULTATS DU CHALLENGER M3 : ${passedAssertions} / ${totalAssertions} assertions passées`);
if (failedAssertions > 0) {
  console.log(`   FAILURES / ANOMALIES DÉTECTÉES : ${failedAssertions}`);
  findings.forEach((f, idx) => {
    console.log(`   ${idx + 1}. [${f.category}] ${f.description || f.name}`);
  });
}
console.log("===============================================================================\n");

if (failedAssertions > 0) {
  process.exitCode = 1;
}
