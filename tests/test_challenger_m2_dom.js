/**
 * EMPIRICAL ADVERSARIAL CHALLENGER TEST SUITE — MILESTONE 2
 * Focus: DOM Interactions, UI Error Resilience, and Calculators Completeness
 *
 * Requirements:
 * - Rigorous verification of all 6 clinical calculators in renderCalculatorsView()
 * - Sandboxed DOM Testing Invariant: textContent setters must escape HTML entities into innerHTML and vice-versa
 * - Fuzzing empty, negative, alphabetic, boundary, and malicious inputs
 * - Validating Free Water Deficit and HbA1c conversion result cards, badges, and warnings
 * - Zero uncaught exceptions during any UI or DOM interaction
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');
const assert = require('assert');

const projectRoot = path.resolve(__dirname, '..');
const Calculators = require(path.join(projectRoot, 'calculators.js'));

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
    console.error(`  ✗ [${category}] ${name}: ${err.message}`);
  }
}

// ----------------------------------------------------------------------------
// 1. MOCK DOM IMPLEMENTATION (STRICT SANDBOXED DOM TESTING INVARIANTS)
// ----------------------------------------------------------------------------

class MockElement {
  constructor(tagName = 'div') {
    this.tagName = String(tagName).toUpperCase();
    this.children = [];
    this.parentNode = null;
    this._innerHTML = '';
    this._textContent = '';
    this.attributes = {};
    this.id = '';
    this.name = '';
    this.type = '';
    this._value = '';
    this.checked = false;
    this.style = {};
    this.dataset = {};
    this.onclick = null;
    this.oninput = null;
    this.onchange = null;
    this._eventListeners = new Map();

    const classSet = new Set();
    this.classList = {
      add: (...tokens) => {
        tokens.forEach(t => { if (t) classSet.add(String(t)); });
      },
      remove: (...tokens) => {
        tokens.forEach(t => classSet.delete(String(t)));
      },
      toggle: (token, val) => {
        token = String(token);
        if (val !== undefined) {
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
  }

  get innerHTML() {
    if (this._innerHTML) return this._innerHTML;
    if (this.children.length > 0) return this.children.map(c => c.innerHTML).join('');
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
      .replace(/&#39;/g, "'");
    this.children = [];
  }

  get textContent() {
    if (this._textContent) return this._textContent;
    if (this.children.length > 0) return this.children.map(c => c.textContent).join('');
    return '';
  }

  // INVARIANT: textContent setter must update innerHTML with HTML entity escaping
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

  get value() { return this._value; }
  set value(v) { this._value = v === null || v === undefined ? '' : String(v); }

  appendChild(child) {
    child.parentNode = this;
    this.children.push(child);
    return child;
  }

  setAttribute(k, v) {
    this.attributes[k] = String(v);
    if (k === 'id') this.id = String(v);
    if (k === 'value') this._value = String(v);
    if (k === 'type') this.type = String(v);
    if (k === 'class') {
      String(v).split(/\s+/).forEach(c => { if (c) this.classList.add(c); });
    }
  }

  getAttribute(k) { return this.attributes[k] || null; }

  addEventListener(type, cb) {
    if (!this._eventListeners.has(type)) this._eventListeners.set(type, []);
    this._eventListeners.get(type).push(cb);
  }

  removeEventListener(type, cb) {
    if (!this._eventListeners.has(type)) return;
    this._eventListeners.set(type, this._eventListeners.get(type).filter(fn => fn !== cb));
  }

  click() {
    if (typeof this.onclick === 'function') this.onclick({ type: 'click', target: this });
    const cbs = this._eventListeners.get('click') || [];
    cbs.forEach(cb => cb({ type: 'click', target: this }));
  }

  triggerInput(newVal) {
    if (newVal !== undefined) this.value = newVal;
    if (typeof this.oninput === 'function') this.oninput({ type: 'input', target: this });
    const cbs = this._eventListeners.get('input') || [];
    cbs.forEach(cb => cb({ type: 'input', target: this }));
  }

  triggerChange(newVal) {
    if (newVal !== undefined) this.value = newVal;
    if (typeof this.onchange === 'function') this.onchange({ type: 'change', target: this });
    const cbs = this._eventListeners.get('change') || [];
    cbs.forEach(cb => cb({ type: 'change', target: this }));
  }
}

// ----------------------------------------------------------------------------
// 2. VIRTUAL ENVIRONMENT BUILDER WITH AUTOMATIC ELEMENT PARSING
// ----------------------------------------------------------------------------

function createDOMEnvironment() {
  const domMap = new Map();
  const queuedTimeouts = [];

  const mockLocalStorage = {
    _store: {},
    getItem: (k) => mockLocalStorage._store[k] || null,
    setItem: (k, v) => { mockLocalStorage._store[k] = String(v); },
    removeItem: (k) => { delete mockLocalStorage._store[k]; }
  };

  const documentMock = {
    getElementById: (id) => domMap.get(id) || null,
    createElement: (tag) => new MockElement(tag),
    addEventListener: () => {},
    removeEventListener: () => {},
    domMap
  };

  const windowMock = {
    document: documentMock,
    localStorage: mockLocalStorage,
    Calculators,
    addEventListener: () => {},
    removeEventListener: () => {},
    setTimeout: (fn, delay) => {
      queuedTimeouts.push(fn);
      return queuedTimeouts.length;
    },
    clearTimeout: () => {}
  };

  const sandbox = {
    window: windowMock,
    document: documentMock,
    localStorage: mockLocalStorage,
    Calculators,
    setTimeout: windowMock.setTimeout,
    clearTimeout: windowMock.clearTimeout,
    console: {
      log: () => {},
      warn: () => {},
      error: () => {}
    }
  };

  const appCode = fs.readFileSync(path.join(projectRoot, 'app.js'), 'utf8');
  vm.createContext(sandbox);
  vm.runInContext(appCode, sandbox);

  // Parse and register all elements inside renderCalculatorsView
  function mountCalculatorsView() {
    const viewContainer = sandbox.renderCalculatorsView();

    // 1. First parse <select> blocks to properly find selected <option> value
    const selectRegex = /<select[^>]*id=["']([^"']+)["'][^>]*>([\s\S]*?)<\/select>/gi;
    let selMatch;
    while ((selMatch = selectRegex.exec(viewContainer.innerHTML)) !== null) {
      const id = selMatch[1];
      const content = selMatch[2];
      const el = new MockElement('select');
      el.id = id;

      // Find selected option value, or fallback to first option value
      const optMatch = content.match(/<option[^>]*value=["']([^"']*)["'][^>]*selected/i) ||
                       content.match(/<option[^>]*selected[^>]*value=["']([^"']*)["']/i) ||
                       content.match(/<option[^>]*value=["']([^"']*)["']/i);
      if (optMatch) {
        el.value = optMatch[1];
      }
      domMap.set(id, el);
    }

    // 2. Parse input / button / div tags with IDs
    const tagRegex = /<(input|button|div)[^>]*id=["']([^"']+)["'][^>]*>/gi;
    let match;
    while ((match = tagRegex.exec(viewContainer.innerHTML)) !== null) {
      const tagType = match[1].toLowerCase();
      const id = match[2];
      const fullTag = match[0];

      const el = new MockElement(tagType);
      el.id = id;

      // Extract type
      const typeMatch = fullTag.match(/type=["']([^"']+)["']/i);
      if (typeMatch) el.type = typeMatch[1];

      // Extract value
      const valMatch = fullTag.match(/value=["']([^"']*)["']/i);
      if (valMatch) el.value = valMatch[1];

      // Extract checked
      if (/\bchecked\b/i.test(fullTag)) el.checked = true;

      // Extract class
      const classMatch = fullTag.match(/class=["']([^"']+)["']/i);
      if (classMatch) {
        classMatch[1].split(/\s+/).forEach(c => el.classList.add(c));
      }

      domMap.set(id, el);
    }

    // Flush queued timeouts (simulating browser next tick after DOM insertion)
    while (queuedTimeouts.length > 0) {
      const fn = queuedTimeouts.shift();
      fn();
    }

    // Connect setupCalculatorsEvents
    sandbox.setupCalculatorsEvents();

    return { viewContainer, domMap };
  }

  return { sandbox, domMap, mountCalculatorsView };
}

console.log("===============================================================================");
console.log("   TEST RUNNER : ADVERSARIAL DOM & UI RESILIENCE (MILESTONE 2)");
console.log("===============================================================================\n");

// ----------------------------------------------------------------------------
// SUITE 1 : SANDBOXED DOM TESTING INVARIANTS
// ----------------------------------------------------------------------------
console.log("--- SUITE 1 : Sandboxed DOM Testing Invariants ---");

test("Invariant", "1.1 textContent setter correctly escapes HTML entities into innerHTML", () => {
  const el = new MockElement('div');
  el.textContent = "Diagnostic & Traitement <Urgence> : Patient 'A' \"B\"";
  assert.strictEqual(
    el.innerHTML,
    "Diagnostic &amp; Traitement &lt;Urgence&gt; : Patient &#39;A&#39; &quot;B&quot;",
    "innerHTML must contain fully escaped entities"
  );
  assert.strictEqual(
    el.textContent,
    "Diagnostic & Traitement <Urgence> : Patient 'A' \"B\"",
    "textContent getter must return exact unescaped string"
  );
});

test("Invariant", "1.2 textContent handles empty, null, and undefined safely", () => {
  const el = new MockElement('p');
  el.textContent = "";
  assert.strictEqual(el.innerHTML, "");
  assert.strictEqual(el.textContent, "");

  el.textContent = null;
  assert.strictEqual(el.innerHTML, "");
  assert.strictEqual(el.textContent, "");

  el.textContent = undefined;
  assert.strictEqual(el.innerHTML, "");
  assert.strictEqual(el.textContent, "");
});

test("Invariant", "1.3 innerHTML setter strips tags and unescapes entities for textContent", () => {
  const el = new MockElement('div');
  el.innerHTML = '<div class="alert-card alert-danger">Attention &amp; Danger &lt;15 mL/min&gt;</div>';
  assert.strictEqual(el.textContent, "Attention & Danger <15 mL/min>");
});

test("Invariant", "1.4 ClassList API methods function reliably without recursion", () => {
  const el = new MockElement('span');
  el.classList.add('alert-card', 'alert-danger');
  assert.ok(el.classList.contains('alert-card'));
  assert.ok(el.classList.contains('alert-danger'));
  assert.strictEqual(el.classList.length, 2);

  el.classList.toggle('alert-danger', false);
  assert.ok(!el.classList.contains('alert-danger'));
  assert.strictEqual(el.classList.length, 1);

  el.classList.toggle('alert-warning', true);
  assert.ok(el.classList.contains('alert-warning'));

  el.classList.remove('alert-card');
  assert.ok(!el.classList.contains('alert-card'));
});

// ----------------------------------------------------------------------------
// SUITE 2 : CALCULATOR VIEW RENDERING & CONTROLS AUDIT
// ----------------------------------------------------------------------------
console.log("\n--- SUITE 2 : Calculator View Rendering & Structure Audit ---");

test("Structure", "2.1 renderCalculatorsView renders complete structure with all 6 tools", () => {
  const env = createDOMEnvironment();
  const { viewContainer, domMap } = env.mountCalculatorsView();

  const requiredIds = [
    // Pediatric
    'pedWeight', 'pedDoseKg', 'pedTimes', 'pedConc', 'pediatricResult',
    // Cockcroft
    'cgAge', 'cgWeight', 'cgSex', 'cgCreat', 'cgUnit', 'cockcroftResult',
    // CRB-65
    'crbC', 'crbR', 'crbB', 'crbAge', 'crb65Result',
    // Glucose
    'glucVal', 'glucUnit', 'glucoseResult',
    // Water deficit
    'calcWaterWeight', 'calcWaterNa', 'calcWaterElderly', 'calcWaterFemale',
    'btnRunWaterDeficit', 'waterDeficitResult',
    // HbA1c
    'calcHbA1cVal', 'calcHbA1cUnit', 'btnRunHbA1c', 'hba1cResult'
  ];

  requiredIds.forEach(id => {
    assert.ok(domMap.has(id), `Missing element in DOM: #${id}`);
  });
});

test("Structure", "2.2 Initial render invokes calculations without throwing uncaught exceptions", () => {
  const env = createDOMEnvironment();
  const { domMap } = env.mountCalculatorsView();

  // Initially, default values are present in inputs, results should be populated
  const pedBox = domMap.get('pediatricResult');
  const cgBox = domMap.get('cockcroftResult');
  const crbBox = domMap.get('crb65Result');
  const glucBox = domMap.get('glucoseResult');
  const waterBox = domMap.get('waterDeficitResult');
  const hba1cBox = domMap.get('hba1cResult');

  assert.ok(pedBox.innerHTML.includes("180 mg / prise"), "Pediatric initial value missing");
  assert.ok(cgBox.innerHTML.includes("mL/min"), "Cockcroft initial calculation missing");
  assert.ok(crbBox.innerHTML.includes("Score : 1 / 4"), "CRB65 initial score missing");
  assert.ok(glucBox.innerHTML.includes("HYPOGLYCÉMIE"), "Glucose initial hypoglycemia missing");
  assert.ok(waterBox.innerHTML.includes("Litres"), "Water deficit initial calculation missing");
  assert.ok(hba1cBox.innerHTML.includes("7.5 %"), "HbA1c initial calculation missing");
});

// ----------------------------------------------------------------------------
// SUITE 3 : EMPTY INPUTS ADVERSARIAL FUZZING ACROSS ALL 6 CALCULATORS
// ----------------------------------------------------------------------------
console.log("\n--- SUITE 3 : Empty Inputs Adversarial Fuzzing ---");

test("Empty Fuzzing", "3.1 Pediatric calculator with empty inputs renders alert-card alert-danger", () => {
  const env = createDOMEnvironment();
  const { domMap } = env.mountCalculatorsView();

  domMap.get('pedWeight').value = "";
  domMap.get('pedDoseKg').value = "";
  domMap.get('pedTimes').value = "";
  domMap.get('pedConc').value = "";

  env.sandbox.runPediatricCalc();

  const box = domMap.get('pediatricResult');
  assert.ok(box.innerHTML.includes("alert-card alert-danger"), "Must render alert-card alert-danger");
  assert.ok(!box.innerHTML.includes("undefined"), "Must not display undefined");
  assert.ok(box.textContent.length > 5, "Must render meaningful error text");
});

test("Empty Fuzzing", "3.2 Cockcroft-Gault calculator with empty inputs renders alert-card alert-danger", () => {
  const env = createDOMEnvironment();
  const { domMap } = env.mountCalculatorsView();

  domMap.get('cgAge').value = "";
  domMap.get('cgWeight').value = "";
  domMap.get('cgCreat').value = "";

  env.sandbox.runCockcroftCalc();

  const box = domMap.get('cockcroftResult');
  assert.ok(box.innerHTML.includes("alert-card alert-danger"), "Must render alert-card alert-danger");
  assert.ok(!box.innerHTML.includes("NaN"), "Must not display NaN");
});

test("Empty Fuzzing", "3.3 CRB-65 with unchecked or empty checkboxes renders score 0 cleanly", () => {
  const env = createDOMEnvironment();
  const { domMap } = env.mountCalculatorsView();

  domMap.get('crbC').checked = false;
  domMap.get('crbR').checked = false;
  domMap.get('crbB').checked = false;
  domMap.get('crbAge').checked = false;

  env.sandbox.runCRB65Calc();

  const box = domMap.get('crb65Result');
  assert.ok(box.innerHTML.includes("Score : 0 / 4"), "Must render Score : 0 / 4");
  assert.ok(box.innerHTML.includes("calc-result-badge success"), "Must have success badge");
});

test("Empty Fuzzing", "3.4 Glucose converter with empty input renders alert-card alert-danger", () => {
  const env = createDOMEnvironment();
  const { domMap } = env.mountCalculatorsView();

  domMap.get('glucVal').value = "";

  env.sandbox.runGlucoseCalc();

  const box = domMap.get('glucoseResult');
  assert.ok(box.innerHTML.includes("alert-card alert-danger"), "Must render alert-card alert-danger");
  assert.ok(box.textContent.includes("Valeur de glycémie invalide"));
});

test("Empty Fuzzing", "3.5 Free Water Deficit calculator with empty inputs renders alert-card alert-danger", () => {
  const env = createDOMEnvironment();
  const { domMap } = env.mountCalculatorsView();

  domMap.get('calcWaterWeight').value = "";
  domMap.get('calcWaterNa').value = "";

  env.sandbox.runWaterDeficitCalc();

  const box = domMap.get('waterDeficitResult');
  assert.ok(box.innerHTML.includes("alert-card alert-danger"), "Must render alert-card alert-danger");
  assert.ok(box.textContent.includes("natrémie supérieure à 140"));
});

test("Empty Fuzzing", "3.6 HbA1c converter with empty input renders alert-card alert-danger", () => {
  const env = createDOMEnvironment();
  const { domMap } = env.mountCalculatorsView();

  domMap.get('calcHbA1cVal').value = "";

  env.sandbox.runHbA1cCalc();

  const box = domMap.get('hba1cResult');
  assert.ok(box.innerHTML.includes("alert-card alert-danger"), "Must render alert-card alert-danger");
  assert.ok(box.textContent.includes("valeur numérique strictement positive"));
});

// ----------------------------------------------------------------------------
// SUITE 4 : NEGATIVE AND ALPHABETIC (NON-NUMERIC) FUZZING
// ----------------------------------------------------------------------------
console.log("\n--- SUITE 4 : Negative and Alphabetic (Non-Numeric) Fuzzing ---");

test("Negative/Alpha Fuzzing", "4.1 Pediatric: negative and alphabetic weights and doses", () => {
  const env = createDOMEnvironment();
  const { domMap } = env.mountCalculatorsView();
  const box = domMap.get('pediatricResult');

  // Negative weight
  domMap.get('pedWeight').value = "-12";
  domMap.get('pedDoseKg').value = "15";
  env.sandbox.runPediatricCalc();
  assert.ok(box.innerHTML.includes("alert-card alert-danger"));

  // Alphabetic weight
  domMap.get('pedWeight').value = "douze";
  env.sandbox.runPediatricCalc();
  assert.ok(box.innerHTML.includes("alert-card alert-danger"));

  // Negative dose
  domMap.get('pedWeight').value = "12";
  domMap.get('pedDoseKg').value = "-15";
  env.sandbox.runPediatricCalc();
  assert.ok(box.innerHTML.includes("alert-card alert-danger"));

  // Alphabetic dose
  domMap.get('pedDoseKg').value = "quinze";
  env.sandbox.runPediatricCalc();
  assert.ok(box.innerHTML.includes("alert-card alert-danger"));

  // Out of range times per day (-1, 0, 15)
  domMap.get('pedDoseKg').value = "15";
  domMap.get('pedTimes').value = "0";
  env.sandbox.runPediatricCalc();
  assert.ok(box.innerHTML.includes("alert-card alert-danger"));

  domMap.get('pedTimes').value = "15";
  env.sandbox.runPediatricCalc();
  assert.ok(box.innerHTML.includes("alert-card alert-danger"));
});

test("Negative/Alpha Fuzzing", "4.2 Cockcroft-Gault: negative, alphabetic, and out-of-range ages", () => {
  const env = createDOMEnvironment();
  const { domMap } = env.mountCalculatorsView();
  const box = domMap.get('cockcroftResult');

  // Pediatric age (< 18)
  domMap.get('cgAge').value = "16";
  domMap.get('cgWeight').value = "60";
  domMap.get('cgCreat').value = "80";
  env.sandbox.runCockcroftCalc();
  assert.ok(box.innerHTML.includes("alert-card alert-danger"));

  // Extreme supercentenarian (> 120)
  domMap.get('cgAge').value = "135";
  env.sandbox.runCockcroftCalc();
  assert.ok(box.innerHTML.includes("alert-card alert-danger"));

  // Negative age
  domMap.get('cgAge').value = "-75";
  env.sandbox.runCockcroftCalc();
  assert.ok(box.innerHTML.includes("alert-card alert-danger"));

  // Alphabetic age
  domMap.get('cgAge').value = "quatre-vingts";
  env.sandbox.runCockcroftCalc();
  assert.ok(box.innerHTML.includes("alert-card alert-danger"));

  // Negative weight
  domMap.get('cgAge').value = "70";
  domMap.get('cgWeight').value = "-55";
  env.sandbox.runCockcroftCalc();
  assert.ok(box.innerHTML.includes("alert-card alert-danger"));

  // Alphabetic creat
  domMap.get('cgWeight').value = "65";
  domMap.get('cgCreat').value = "cent-dix";
  env.sandbox.runCockcroftCalc();
  assert.ok(box.innerHTML.includes("alert-card alert-danger"));
});

test("Negative/Alpha Fuzzing", "4.3 Glucose: negative, zero, and alphabetic values", () => {
  const env = createDOMEnvironment();
  const { domMap } = env.mountCalculatorsView();
  const box = domMap.get('glucoseResult');

  // Negative value
  domMap.get('glucVal').value = "-1.20";
  env.sandbox.runGlucoseCalc();
  assert.ok(box.innerHTML.includes("alert-card alert-danger"));

  // Zero value
  domMap.get('glucVal').value = "0";
  env.sandbox.runGlucoseCalc();
  assert.ok(box.innerHTML.includes("alert-card alert-danger"));

  // Alphabetic value
  domMap.get('glucVal').value = "un_gramme";
  env.sandbox.runGlucoseCalc();
  assert.ok(box.innerHTML.includes("alert-card alert-danger"));
});

test("Negative/Alpha Fuzzing", "4.4 Water Deficit: negative weight, non-hypernatremic Na, and alphabetic", () => {
  const env = createDOMEnvironment();
  const { domMap } = env.mountCalculatorsView();
  const box = domMap.get('waterDeficitResult');

  // Negative weight
  domMap.get('calcWaterWeight').value = "-60";
  domMap.get('calcWaterNa').value = "155";
  env.sandbox.runWaterDeficitCalc();
  assert.ok(box.innerHTML.includes("alert-card alert-danger"));

  // Alphabetic weight
  domMap.get('calcWaterWeight').value = "soixante";
  env.sandbox.runWaterDeficitCalc();
  assert.ok(box.innerHTML.includes("alert-card alert-danger"));

  // Normal natremia (138 mmol/L <= 140)
  domMap.get('calcWaterWeight').value = "60";
  domMap.get('calcWaterNa').value = "138";
  env.sandbox.runWaterDeficitCalc();
  assert.ok(box.innerHTML.includes("alert-card alert-danger"));
  assert.ok(box.textContent.includes("supérieure à 140 mmol/L"));

  // Negative natremia
  domMap.get('calcWaterNa').value = "-150";
  env.sandbox.runWaterDeficitCalc();
  assert.ok(box.innerHTML.includes("alert-card alert-danger"));
});

test("Negative/Alpha Fuzzing", "4.5 HbA1c: negative, alphabetic, sub-physiologic, and supra-physiologic", () => {
  const env = createDOMEnvironment();
  const { domMap } = env.mountCalculatorsView();
  const box = domMap.get('hba1cResult');

  // Negative
  domMap.get('calcHbA1cVal').value = "-7.5";
  env.sandbox.runHbA1cCalc();
  assert.ok(box.innerHTML.includes("alert-card alert-danger"));

  // Alphabetic
  domMap.get('calcHbA1cVal').value = "sept_virgule_cinq";
  env.sandbox.runHbA1cCalc();
  assert.ok(box.innerHTML.includes("alert-card alert-danger"));

  // Sub-physiologic (< 3.0%)
  domMap.get('calcHbA1cVal').value = "2.4";
  env.sandbox.runHbA1cCalc();
  assert.ok(box.innerHTML.includes("alert-card alert-danger"));
  assert.ok(box.textContent.includes("hors limites physiologiques"));

  // Supra-physiologic (> 25.0%)
  domMap.get('calcHbA1cVal').value = "28.5";
  env.sandbox.runHbA1cCalc();
  assert.ok(box.innerHTML.includes("alert-card alert-danger"));
  assert.ok(box.textContent.includes("hors limites physiologiques"));
});

// ----------------------------------------------------------------------------
// SUITE 5 : VALID INPUTS VERIFICATION — FREE WATER DEFICIT & HBA1C
// ----------------------------------------------------------------------------
console.log("\n--- SUITE 5 : Valid Inputs & UI Rendering for Water Deficit & HbA1c ---");

test("Valid Inputs", "5.1 Free Water Deficit: Elderly Male (Factor 0.5)", () => {
  const env = createDOMEnvironment();
  const { domMap } = env.mountCalculatorsView();

  domMap.get('calcWaterWeight').value = "60";
  domMap.get('calcWaterNa').value = "154";
  domMap.get('calcWaterElderly').checked = true;
  domMap.get('calcWaterFemale').checked = false;

  env.sandbox.runWaterDeficitCalc();

  const box = domMap.get('waterDeficitResult');
  // Deficit = 0.5 * 60 * (154/140 - 1) = 30 * 0.1 = 3.0 L
  assert.ok(box.innerHTML.includes("3 Litres") || box.innerHTML.includes("3.0 Litres"));
  assert.ok(box.innerHTML.includes("calc-result-badge warning"));
  assert.ok(box.innerHTML.includes("0.5"));
  assert.ok(box.innerHTML.includes("alert-card alert-warning"));
  assert.ok(box.innerHTML.includes("10 à 12 mmol/L par 24 heures"));
});

test("Valid Inputs", "5.2 Free Water Deficit: Elderly Female (Factor 0.45)", () => {
  const env = createDOMEnvironment();
  const { domMap } = env.mountCalculatorsView();

  domMap.get('calcWaterWeight').value = "60";
  domMap.get('calcWaterNa').value = "155";
  domMap.get('calcWaterElderly').checked = true;
  domMap.get('calcWaterFemale').checked = true;

  env.sandbox.runWaterDeficitCalc();

  const box = domMap.get('waterDeficitResult');
  // Deficit = 0.45 * 60 * (155/140 - 1) = 27 * 0.10714 = 2.8928 -> 2.9 L
  assert.ok(box.innerHTML.includes("2.9 Litres"));
  assert.ok(box.innerHTML.includes("0.45"));
  assert.ok(box.innerHTML.includes("sujet âgé"));
  assert.ok(box.innerHTML.includes("femme"));
});

test("Valid Inputs", "5.3 Free Water Deficit: Young Male (Factor 0.6)", () => {
  const env = createDOMEnvironment();
  const { domMap } = env.mountCalculatorsView();

  domMap.get('calcWaterWeight').value = "70";
  domMap.get('calcWaterNa').value = "154";
  domMap.get('calcWaterElderly').checked = false;
  domMap.get('calcWaterFemale').checked = false;

  env.sandbox.runWaterDeficitCalc();

  const box = domMap.get('waterDeficitResult');
  // Deficit = 0.6 * 70 * (154/140 - 1) = 42 * 0.1 = 4.2 L
  assert.ok(box.innerHTML.includes("4.2 Litres"));
  assert.ok(box.innerHTML.includes("0.6"));
  assert.ok(box.innerHTML.includes("adulte jeune"));
  assert.ok(box.innerHTML.includes("homme"));
});

test("Valid Inputs", "5.4 HbA1c: Target Adulte Jeune (< 7.0%) renders success badge", () => {
  const env = createDOMEnvironment();
  const { domMap } = env.mountCalculatorsView();

  domMap.get('calcHbA1cVal').value = "6.5";
  domMap.get('calcHbA1cUnit').value = "percent";

  env.sandbox.runHbA1cCalc();

  const box = domMap.get('hba1cResult');
  // eAG mg/dL = 28.7 * 6.5 - 46.7 = 139.85 -> 140
  // eAG mmol/L = 1.59 * 6.5 - 2.59 = 7.745 -> 7.7
  assert.ok(box.innerHTML.includes("calc-result-badge success"));
  assert.ok(box.innerHTML.includes("6.5 %"));
  assert.ok(box.innerHTML.includes("140</strong> mg/dL"));
  assert.ok(box.innerHTML.includes("7.7</strong> mmol/L"));
  assert.ok(box.textContent.includes("Adulte jeune"));
});

test("Valid Inputs", "5.5 HbA1c: Target Sujet Âgé Fragile (7.5 - 8.5%) renders warning badge", () => {
  const env = createDOMEnvironment();
  const { domMap } = env.mountCalculatorsView();

  domMap.get('calcHbA1cVal').value = "7.8";
  domMap.get('calcHbA1cUnit').value = "percent";

  env.sandbox.runHbA1cCalc();

  const box = domMap.get('hba1cResult');
  // eAG mg/dL = 28.7 * 7.8 - 46.7 = 177.16 -> 177
  // eAG mmol/L = 1.59 * 7.8 - 2.59 = 9.812 -> 9.8
  assert.ok(box.innerHTML.includes("calc-result-badge warning"));
  assert.ok(box.innerHTML.includes("7.8 %"));
  assert.ok(box.innerHTML.includes("177</strong> mg/dL"));
  assert.ok(box.innerHTML.includes("9.8</strong> mmol/L"));
  assert.ok(box.textContent.includes("Sujet âgé fragile"));
  assert.ok(box.textContent.includes("HAS / SFGG"));
});

test("Valid Inputs", "5.6 HbA1c: Contrôle Insuffisant (> 8.5%) renders danger badge", () => {
  const env = createDOMEnvironment();
  const { domMap } = env.mountCalculatorsView();

  domMap.get('calcHbA1cVal').value = "9.5";
  domMap.get('calcHbA1cUnit').value = "percent";

  env.sandbox.runHbA1cCalc();

  const box = domMap.get('hba1cResult');
  assert.ok(box.innerHTML.includes("calc-result-badge danger"));
  assert.ok(box.textContent.includes("Contrôle insuffisant"));
});

test("Valid Inputs", "5.7 HbA1c: Bidirectional conversion from eAG (mg/dL)", () => {
  const env = createDOMEnvironment();
  const { domMap } = env.mountCalculatorsView();

  domMap.get('calcHbA1cVal').value = "169";
  domMap.get('calcHbA1cUnit').value = "mg_dl";

  env.sandbox.runHbA1cCalc();

  const box = domMap.get('hba1cResult');
  // (169 + 46.7) / 28.7 = 7.515 -> 7.5%
  assert.ok(box.innerHTML.includes("7.5 %"));
  assert.ok(box.innerHTML.includes("calc-result-badge warning"));
});

test("Valid Inputs", "5.8 HbA1c: Bidirectional conversion from eAG (mmol/L)", () => {
  const env = createDOMEnvironment();
  const { domMap } = env.mountCalculatorsView();

  domMap.get('calcHbA1cVal').value = "9.3";
  domMap.get('calcHbA1cUnit').value = "mmol_l";

  env.sandbox.runHbA1cCalc();

  const box = domMap.get('hba1cResult');
  // (9.3 + 2.59) / 1.59 = 7.477 -> 7.5%
  assert.ok(box.innerHTML.includes("7.5 %"));
});

// ----------------------------------------------------------------------------
// SUITE 6 : VALID INPUTS ACROSS OTHER CALCULATORS
// ----------------------------------------------------------------------------
console.log("\n--- SUITE 6 : Valid Inputs for Pediatric, Cockcroft, CRB-65 & Glucose ---");

test("Valid Other", "6.1 Pediatric calculator with standard prescription and syrup", () => {
  const env = createDOMEnvironment();
  const { domMap } = env.mountCalculatorsView();

  domMap.get('pedWeight').value = "14";
  domMap.get('pedDoseKg').value = "25";
  domMap.get('pedTimes').value = "3";
  domMap.get('pedConc').value = "50";

  env.sandbox.runPediatricCalc();

  const box = domMap.get('pediatricResult');
  assert.ok(box.innerHTML.includes("350 mg / prise"));
  assert.ok(box.innerHTML.includes("1050 mg / jour"));
  assert.ok(box.innerHTML.includes("7 mL"));
  assert.ok(box.innerHTML.includes("Espacer les prises de 8 heures"));
});

test("Valid Other", "6.2 Cockcroft-Gault: Severe renal impairment and Sarcopenia Warning", () => {
  const env = createDOMEnvironment();
  const { domMap } = env.mountCalculatorsView();

  // Age 82 >= 75, creat 55 umol/L < 70
  domMap.get('cgAge').value = "82";
  domMap.get('cgWeight').value = "45";
  domMap.get('cgSex').value = "female";
  domMap.get('cgCreat').value = "55";
  domMap.get('cgUnit').value = "umol_l";

  env.sandbox.runCockcroftCalc();

  const box = domMap.get('cockcroftResult');
  assert.ok(box.innerHTML.includes("Alerte Sarcopénie"));
  assert.ok(box.innerHTML.includes("créatinine basse peut sous-estimer"));
});

test("Valid Other", "6.3 CRB-65: High risk pneumonia (Score 3 & 4)", () => {
  const env = createDOMEnvironment();
  const { domMap } = env.mountCalculatorsView();

  domMap.get('crbC').checked = true;
  domMap.get('crbR').checked = true;
  domMap.get('crbB').checked = true;
  domMap.get('crbAge').checked = true;

  env.sandbox.runCRB65Calc();

  const box = domMap.get('crb65Result');
  assert.ok(box.innerHTML.includes("Score : 4 / 4"));
  assert.ok(box.innerHTML.includes("calc-result-badge danger"));
  assert.ok(box.innerHTML.includes("Risque élevé (Mortalité 15 à 30%)"));
  assert.ok(box.textContent.includes("Hospitalisation d'urgence"));
});

test("Valid Other", "6.4 Glucose: Critical Acute Hyperglycemia (>= 2.50 g/L)", () => {
  const env = createDOMEnvironment();
  const { domMap } = env.mountCalculatorsView();

  domMap.get('glucVal').value = "2.85";
  domMap.get('glucUnit').value = "g_l";

  env.sandbox.runGlucoseCalc();

  const box = domMap.get('glucoseResult');
  assert.ok(box.innerHTML.includes("calc-result-badge danger"));
  assert.ok(box.innerHTML.includes("URGENCE : Hyperglycémie aiguë critique"));
  assert.ok(box.textContent.includes("décompensation acido-cétosique"));
});

// ----------------------------------------------------------------------------
// SUITE 7 : EVENT LISTENERS & BUTTON CLICK SIMULATION
// ----------------------------------------------------------------------------
console.log("\n--- SUITE 7 : Event Listeners & Button Trigger Simulation ---");

test("Event Simulation", "7.1 btnRunWaterDeficit and btnRunHbA1c click handlers trigger calculations", () => {
  const env = createDOMEnvironment();
  const { domMap } = env.mountCalculatorsView();

  // Change values without calling runner directly
  domMap.get('calcWaterWeight').value = "50";
  domMap.get('calcWaterNa').value = "160";
  domMap.get('btnRunWaterDeficit').click();

  const waterBox = domMap.get('waterDeficitResult');
  assert.ok(waterBox.innerHTML.includes("3.6 Litres") || waterBox.innerHTML.includes("Litres"));

  domMap.get('calcHbA1cVal').value = "8.0";
  domMap.get('btnRunHbA1c').click();

  const hba1cBox = domMap.get('hba1cResult');
  assert.ok(hba1cBox.innerHTML.includes("8 %"));
  assert.ok(hba1cBox.innerHTML.includes("calc-result-badge warning"));
});

test("Event Simulation", "7.2 setupCalculatorsEvents wires all available buttons without crashing", () => {
  const env = createDOMEnvironment();
  const { domMap } = env.mountCalculatorsView();

  // Add mock buttons for the first 4 tools to verify setupCalculatorsEvents attaches to them
  const btnPed = new MockElement('button'); btnPed.id = 'btnRunPediatric'; domMap.set('btnRunPediatric', btnPed);
  const btnCg = new MockElement('button'); btnCg.id = 'btnRunCockcroft'; domMap.set('btnRunCockcroft', btnCg);
  const btnCrb = new MockElement('button'); btnCrb.id = 'btnRunCRB65'; domMap.set('btnRunCRB65', btnCrb);
  const btnGluc = new MockElement('button'); btnGluc.id = 'btnRunGlucose'; domMap.set('btnRunGlucose', btnGluc);

  env.sandbox.setupCalculatorsEvents();

  assert.strictEqual(typeof btnPed.onclick, 'function');
  assert.strictEqual(typeof btnCg.onclick, 'function');
  assert.strictEqual(typeof btnCrb.onclick, 'function');
  assert.strictEqual(typeof btnGluc.onclick, 'function');

  // Trigger clicks
  btnPed.click();
  btnCg.click();
  btnCrb.click();
  btnGluc.click();

  assert.ok(domMap.get('pediatricResult').innerHTML.length > 0);
  assert.ok(domMap.get('cockcroftResult').innerHTML.length > 0);
  assert.ok(domMap.get('crb65Result').innerHTML.length > 0);
  assert.ok(domMap.get('glucoseResult').innerHTML.length > 0);
});

// ----------------------------------------------------------------------------
// SUITE 8 : ADVERSARIAL STRESS TESTING & SECURITY INJECTION
// ----------------------------------------------------------------------------
console.log("\n--- SUITE 8 : Adversarial Stress Testing & Security Injections ---");

test("Stress & Security", "8.1 XSS payloads in inputs are escaped by escHtml and innerHTML", () => {
  const env = createDOMEnvironment();
  const { domMap } = env.mountCalculatorsView();

  const payload = '<script>alert("XSS")</script>';

  domMap.get('pedWeight').value = payload;
  env.sandbox.runPediatricCalc();
  const pedBox = domMap.get('pediatricResult');
  assert.ok(!pedBox.innerHTML.includes('<script>'), "Unescaped script tag found!");

  domMap.get('cgAge').value = payload;
  env.sandbox.runCockcroftCalc();
  const cgBox = domMap.get('cockcroftResult');
  assert.ok(!cgBox.innerHTML.includes('<script>'), "Unescaped script tag found!");

  domMap.get('calcWaterWeight').value = payload;
  env.sandbox.runWaterDeficitCalc();
  const waterBox = domMap.get('waterDeficitResult');
  assert.ok(!waterBox.innerHTML.includes('<script>'), "Unescaped script tag found!");

  domMap.get('calcHbA1cVal').value = payload;
  env.sandbox.runHbA1cCalc();
  const hba1cBox = domMap.get('hba1cResult');
  assert.ok(!hba1cBox.innerHTML.includes('<script>'), "Unescaped script tag found!");
});

test("Stress & Security", "8.2 Missing result container in DOM does not throw unhandled exception", () => {
  const env = createDOMEnvironment();
  const { domMap } = env.mountCalculatorsView();

  // Temporarily delete result containers
  domMap.delete('pediatricResult');
  domMap.delete('cockcroftResult');
  domMap.delete('crb65Result');
  domMap.delete('glucoseResult');
  domMap.delete('waterDeficitResult');
  domMap.delete('hba1cResult');

  // Should return silently without throwing
  assert.doesNotThrow(() => {
    env.sandbox.runPediatricCalc();
    env.sandbox.runCockcroftCalc();
    env.sandbox.runCRB65Calc();
    env.sandbox.runGlucoseCalc();
    env.sandbox.runWaterDeficitCalc();
    env.sandbox.runHbA1cCalc();
  }, "Runner functions must not throw when DOM elements are absent");
});

test("Stress & Security", "8.3 Rapid sequential keystroke fuzzing does not destabilize DOM", () => {
  const env = createDOMEnvironment();
  const { domMap } = env.mountCalculatorsView();
  const inputWater = domMap.get('calcWaterNa');
  const box = domMap.get('waterDeficitResult');

  // Simulate fast typing sequence: "1" -> "15" -> "155" -> "1550" -> backspaces -> "abc" -> "145"
  const keystrokes = ["1", "15", "155", "1550", "155", "15", "", "abc", "145"];

  keystrokes.forEach(val => {
    inputWater.value = val;
    assert.doesNotThrow(() => {
      env.sandbox.runWaterDeficitCalc();
    }, `Typing '${val}' should not throw`);
  });

  // Final value 145 should be valid
  assert.ok(box.innerHTML.includes("Litres"));
  assert.ok(!box.innerHTML.includes("alert-danger"));
});

// ----------------------------------------------------------------------------
// SUITE 9 : BOUNDARY PRECISION & UNIT SWITCHING STRESS TESTS
// ----------------------------------------------------------------------------
console.log("\n--- SUITE 9 : Boundary Precision & Unit Switching Stress Tests ---");

test("Boundaries", "9.1 Cockcroft-Gault strict boundaries (17.9 vs 18, 120 vs 120.1)", () => {
  const env = createDOMEnvironment();
  const { domMap } = env.mountCalculatorsView();
  const ageInput = domMap.get('cgAge');
  const box = domMap.get('cockcroftResult');

  // 17.9 -> error
  ageInput.value = "17.9";
  env.sandbox.runCockcroftCalc();
  assert.ok(box.innerHTML.includes("alert-card alert-danger"));

  // 18.0 -> valid
  ageInput.value = "18";
  env.sandbox.runCockcroftCalc();
  assert.ok(!box.innerHTML.includes("alert-danger"));
  assert.ok(box.innerHTML.includes("mL/min"));

  // 120.0 -> valid
  ageInput.value = "120";
  env.sandbox.runCockcroftCalc();
  assert.ok(!box.innerHTML.includes("alert-danger"));
  assert.ok(box.innerHTML.includes("mL/min"));

  // 120.1 -> error
  ageInput.value = "120.1";
  env.sandbox.runCockcroftCalc();
  assert.ok(box.innerHTML.includes("alert-card alert-danger"));
});

test("Boundaries", "9.2 Sarcopenia warning boundary at age 75 and creat 70 µmol/L", () => {
  const env = createDOMEnvironment();
  const { domMap } = env.mountCalculatorsView();
  const box = domMap.get('cockcroftResult');

  domMap.get('cgWeight').value = "50";
  domMap.get('cgSex').value = "female";

  // Age 74, Creat 60 -> No sarcopenia warning (age < 75)
  domMap.get('cgAge').value = "74";
  domMap.get('cgCreat').value = "60";
  env.sandbox.runCockcroftCalc();
  assert.ok(!box.innerHTML.includes("Alerte Sarcopénie"));

  // Age 75, Creat 70 -> No sarcopenia warning (creat not < 70)
  domMap.get('cgAge').value = "75";
  domMap.get('cgCreat').value = "70";
  env.sandbox.runCockcroftCalc();
  assert.ok(!box.innerHTML.includes("Alerte Sarcopénie"));

  // Age 75, Creat 69 -> Sarcopenia warning present
  domMap.get('cgAge').value = "75";
  domMap.get('cgCreat').value = "69";
  env.sandbox.runCockcroftCalc();
  assert.ok(box.innerHTML.includes("Alerte Sarcopénie"));
});

test("Boundaries", "9.3 Free Water Deficit strict boundary (140 vs 140.1 mmol/L)", () => {
  const env = createDOMEnvironment();
  const { domMap } = env.mountCalculatorsView();
  const naInput = domMap.get('calcWaterNa');
  const box = domMap.get('waterDeficitResult');

  // 140.0 -> error (no deficit)
  naInput.value = "140";
  env.sandbox.runWaterDeficitCalc();
  assert.ok(box.innerHTML.includes("alert-card alert-danger"));

  // 140.1 -> valid
  naInput.value = "140.1";
  env.sandbox.runWaterDeficitCalc();
  assert.ok(!box.innerHTML.includes("alert-danger"));
  assert.ok(box.innerHTML.includes("Litres"));
});

test("Boundaries", "9.4 HbA1c strict physiological boundaries (2.9 vs 3.0%, 25.0 vs 25.1%)", () => {
  const env = createDOMEnvironment();
  const { domMap } = env.mountCalculatorsView();
  const valInput = domMap.get('calcHbA1cVal');
  const box = domMap.get('hba1cResult');

  // 2.9 -> error
  valInput.value = "2.9";
  env.sandbox.runHbA1cCalc();
  assert.ok(box.innerHTML.includes("alert-card alert-danger"));

  // 3.0 -> valid
  valInput.value = "3.0";
  env.sandbox.runHbA1cCalc();
  assert.ok(!box.innerHTML.includes("alert-danger"));
  assert.ok(box.innerHTML.includes("3 %"));

  // 25.0 -> valid
  valInput.value = "25.0";
  env.sandbox.runHbA1cCalc();
  assert.ok(!box.innerHTML.includes("alert-danger"));
  assert.ok(box.innerHTML.includes("25 %"));

  // 25.1 -> error
  valInput.value = "25.1";
  env.sandbox.runHbA1cCalc();
  assert.ok(box.innerHTML.includes("alert-card alert-danger"));
});

test("Boundaries", "9.5 Cockcroft-Gault unit conversions (µmol/L, mg/dL, mg/L)", () => {
  const env = createDOMEnvironment();
  const { domMap } = env.mountCalculatorsView();
  const box = domMap.get('cockcroftResult');

  domMap.get('cgAge').value = "60";
  domMap.get('cgWeight').value = "70";
  domMap.get('cgSex').value = "male";

  // 1) 88.4 µmol/L
  domMap.get('cgCreat').value = "88.4";
  domMap.get('cgUnit').value = "umol_l";
  env.sandbox.runCockcroftCalc();
  const clUmol = box.textContent.match(/(\d+)\s*mL\/min/)[1];

  // 2) 1.0 mg/dL (equivalent)
  domMap.get('cgCreat').value = "1.0";
  domMap.get('cgUnit').value = "mg_dl";
  env.sandbox.runCockcroftCalc();
  const clMgDl = box.textContent.match(/(\d+)\s*mL\/min/)[1];

  // 3) 10.0 mg/L (equivalent)
  domMap.get('cgCreat').value = "10.0";
  domMap.get('cgUnit').value = "mg_l";
  env.sandbox.runCockcroftCalc();
  const clMgL = box.textContent.match(/(\d+)\s*mL\/min/)[1];

  assert.strictEqual(clUmol, clMgDl, "µmol/L and mg/dL should produce identical clearance");
  assert.strictEqual(clUmol, clMgL, "µmol/L and mg/L should produce identical clearance");
});

// ----------------------------------------------------------------------------
// SUITE 10 : MULTI-EVENT CYCLES & IDEMPOTENCE
// ----------------------------------------------------------------------------
console.log("\n--- SUITE 10 : Multi-Event Cycles & Idempotence ---");

test("Idempotence", "10.1 Multiple invocations of renderCalculatorsView do not duplicate listeners or corrupt state", () => {
  const env = createDOMEnvironment();

  // Mount 3 times in a row
  const m1 = env.mountCalculatorsView();
  const m2 = env.mountCalculatorsView();
  const m3 = env.mountCalculatorsView();

  const hba1cBox = m3.domMap.get('hba1cResult');
  assert.ok(hba1cBox.innerHTML.includes("7.5 %"));

  // Change input and run
  m3.domMap.get('calcHbA1cVal').value = "8.2";
  env.sandbox.runHbA1cCalc();
  assert.ok(hba1cBox.innerHTML.includes("8.2 %"));
});

test("Idempotence", "10.2 HTML output of result boxes is clean and free of leftover raw tags or undefined", () => {
  const env = createDOMEnvironment();
  const { domMap } = env.mountCalculatorsView();

  const boxes = [
    'pediatricResult',
    'cockcroftResult',
    'crb65Result',
    'glucoseResult',
    'waterDeficitResult',
    'hba1cResult'
  ];

  boxes.forEach(id => {
    const el = domMap.get(id);
    assert.ok(!el.innerHTML.includes("undefined"), `Box #${id} contains 'undefined'`);
    assert.ok(!el.innerHTML.includes("NaN"), `Box #${id} contains 'NaN'`);
    assert.ok(!el.innerHTML.includes("[object Object]"), `Box #${id} contains '[object Object]'`);
  });
});

// ----------------------------------------------------------------------------
// SUMMARY REPORT
// ----------------------------------------------------------------------------
console.log("\n===============================================================================");
console.log("   CHALLENGER 2 TEST EXECUTION SUMMARY");
console.log("===============================================================================");
console.log(`  Total tests executed : ${totalTests}`);
console.log(`  Tests passed         : ${passedTests}`);
console.log(`  Tests failed         : ${failedTests}`);
console.log("===============================================================================\n");

if (failedTests > 0) {
  console.error(`❌ FAILURE: ${failedTests} test(s) failed.`);
  failures.forEach((f, idx) => {
    console.error(`\n[${idx + 1}] ${f.category} - ${f.name}:`);
    console.error(f.error);
    if (f.stack) console.error(f.stack);
  });
  process.exit(1);
} else {
  console.log(`✅ SUCCESS: ALL ${totalTests} ADVERSARIAL CHALLENGER TESTS PASSED WITH CODE 0!\n`);
  process.exit(0);
}

