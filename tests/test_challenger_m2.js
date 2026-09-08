/**
 * CHALLENGER M2 ADVERSARIAL STRESS-TEST & FUZZING HARNESS
 * Suite de tests adversariaux et de fuzzing exhaustif des 6 moteurs de calcul
 * Path: tests/test_challenger_m2.js
 */

const Calculators = require('../calculators.js');

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;
const failures = [];

function assert(condition, testName, details = '') {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✓ ${testName}`);
  } else {
    failedTests++;
    console.error(`  ✗ FAIL: ${testName} ${details ? '--> ' + details : ''}`);
    failures.push({ testName, details });
  }
}

function runSafely(fn) {
  try {
    return { threw: false, result: fn() };
  } catch (e) {
    return { threw: true, error: e };
  }
}

console.log('====================================================');
console.log('CHALLENGER M2 : ADVERSARIAL FUZZING & STRESS HARNESS');
console.log('====================================================\n');

// ----------------------------------------------------
// Section 1: Null, undefined, empty, spaces, symbols, 'abc', 'NaN'
// ----------------------------------------------------
console.log('--- 1. Fuzzing Falsy & Non-Numeric Inputs (abc, NaN, null, empty) ---');

const nonNumericInputs = [null, undefined, '', '   ', 'abc', '!@#$%^&*()', 'NaN', NaN, {}, []];

// 1.1 calculatePediatric
nonNumericInputs.forEach((badInput, idx) => {
  const t1 = runSafely(() => Calculators.calculatePediatric(badInput, 15, 3));
  assert(!t1.threw && t1.result && typeof t1.result.error === 'string',
    `1.1.p.${idx} Pediatric bad weight (${JSON.stringify(badInput)}) returns structured error`,
    `Got: ${JSON.stringify(t1.result)}`);

  const t2 = runSafely(() => Calculators.calculatePediatric(15, badInput, 3));
  assert(!t2.threw && t2.result && typeof t2.result.error === 'string',
    `1.1.d.${idx} Pediatric bad dose (${JSON.stringify(badInput)}) returns structured error`,
    `Got: ${JSON.stringify(t2.result)}`);

  const t3 = runSafely(() => Calculators.calculatePediatric(15, 15, badInput));
  assert(!t3.threw && t3.result && typeof t3.result.error === 'string',
    `1.1.t.${idx} Pediatric bad times (${JSON.stringify(badInput)}) returns structured error`,
    `Got: ${JSON.stringify(t3.result)}`);
});

// 1.2 calculateCockcroft
nonNumericInputs.forEach((badInput, idx) => {
  const t1 = runSafely(() => Calculators.calculateCockcroft(badInput, 70, 90, 'umol_l', false));
  assert(!t1.threw && t1.result && typeof t1.result.error === 'string',
    `1.2.a.${idx} Cockcroft bad age (${JSON.stringify(badInput)}) returns structured error`,
    `Got: ${JSON.stringify(t1.result)}`);

  const t2 = runSafely(() => Calculators.calculateCockcroft(50, badInput, 90, 'umol_l', false));
  assert(!t2.threw && t2.result && typeof t2.result.error === 'string',
    `1.2.w.${idx} Cockcroft bad weight (${JSON.stringify(badInput)}) returns structured error`,
    `Got: ${JSON.stringify(t2.result)}`);

  const t3 = runSafely(() => Calculators.calculateCockcroft(50, 70, badInput, 'umol_l', false));
  assert(!t3.threw && t3.result && typeof t3.result.error === 'string',
    `1.2.c.${idx} Cockcroft bad creat (${JSON.stringify(badInput)}) returns structured error`,
    `Got: ${JSON.stringify(t3.result)}`);
});

// 1.3 calculateWaterDeficit
nonNumericInputs.forEach((badInput, idx) => {
  const t1 = runSafely(() => Calculators.calculateWaterDeficit(badInput, 150));
  assert(!t1.threw && t1.result && typeof t1.result.error === 'string',
    `1.3.w.${idx} WaterDeficit bad weight (${JSON.stringify(badInput)}) returns structured error`,
    `Got: ${JSON.stringify(t1.result)}`);

  const t2 = runSafely(() => Calculators.calculateWaterDeficit(70, badInput));
  assert(!t2.threw && t2.result && typeof t2.result.error === 'string',
    `1.3.n.${idx} WaterDeficit bad natremia (${JSON.stringify(badInput)}) returns structured error`,
    `Got: ${JSON.stringify(t2.result)}`);
});

// 1.4 convertGlucose
nonNumericInputs.forEach((badInput, idx) => {
  const t1 = runSafely(() => Calculators.convertGlucose(badInput, 'g_l'));
  assert(!t1.threw && t1.result && typeof t1.result.error === 'string',
    `1.4.v.${idx} Glucose bad value (${JSON.stringify(badInput)}) returns structured error`,
    `Got: ${JSON.stringify(t1.result)}`);
});

// 1.5 convertHbA1c
nonNumericInputs.forEach((badInput, idx) => {
  const t1 = runSafely(() => Calculators.convertHbA1c(badInput, 'percent'));
  assert(!t1.threw && t1.result && typeof t1.result.error === 'string',
    `1.5.v.${idx} HbA1c bad value (${JSON.stringify(badInput)}) returns structured error`,
    `Got: ${JSON.stringify(t1.result)}`);
});

// ----------------------------------------------------
// Section 2: Infinity and -Infinity inputs
// ----------------------------------------------------
console.log('\n--- 2. Fuzzing Infinity and -Infinity Inputs ---');

const infinityInputs = ['Infinity', '-Infinity', Infinity, -Infinity];

infinityInputs.forEach((inf, idx) => {
  // Pediatric weight
  const pW = runSafely(() => Calculators.calculatePediatric(inf, 15, 3));
  assert(!pW.threw && pW.result && typeof pW.result.error === 'string',
    `2.1.pw.${idx} Pediatric weight ${inf} must return error object`,
    `Got: ${JSON.stringify(pW.result)}`);

  // Pediatric dose
  const pD = runSafely(() => Calculators.calculatePediatric(15, inf, 3));
  assert(!pD.threw && pD.result && typeof pD.result.error === 'string',
    `2.1.pd.${idx} Pediatric dose ${inf} must return error object`,
    `Got: ${JSON.stringify(pD.result)}`);

  // Cockcroft weight
  const cW = runSafely(() => Calculators.calculateCockcroft(50, inf, 90, 'umol_l', false));
  assert(!cW.threw && cW.result && typeof cW.result.error === 'string',
    `2.2.cw.${idx} Cockcroft weight ${inf} must return error object`,
    `Got: ${JSON.stringify(cW.result)}`);

  // Cockcroft creat
  const cC = runSafely(() => Calculators.calculateCockcroft(50, 70, inf, 'umol_l', false));
  assert(!cC.threw && cC.result && typeof cC.result.error === 'string',
    `2.2.cc.${idx} Cockcroft creat ${inf} must return error object`,
    `Got: ${JSON.stringify(cC.result)}`);

  // Water deficit weight
  const wW = runSafely(() => Calculators.calculateWaterDeficit(inf, 150));
  assert(!wW.threw && wW.result && typeof wW.result.error === 'string',
    `2.3.ww.${idx} WaterDeficit weight ${inf} must return error object`,
    `Got: ${JSON.stringify(wW.result)}`);

  // Water deficit natremia
  const wN = runSafely(() => Calculators.calculateWaterDeficit(70, inf));
  assert(!wN.threw && wN.result && typeof wN.result.error === 'string',
    `2.3.wn.${idx} WaterDeficit natremia ${inf} must return error object`,
    `Got: ${JSON.stringify(wN.result)}`);

  // Glucose value
  const gV = runSafely(() => Calculators.convertGlucose(inf, 'g_l'));
  assert(!gV.threw && gV.result && typeof gV.result.error === 'string',
    `2.4.gv.${idx} Glucose value ${inf} must return error object`,
    `Got: ${JSON.stringify(gV.result)}`);

  // HbA1c value
  const hV = runSafely(() => Calculators.convertHbA1c(inf, 'percent'));
  assert(!hV.threw && hV.result && typeof hV.result.error === 'string',
    `2.5.hv.${idx} HbA1c value ${inf} must return error object`,
    `Got: ${JSON.stringify(hV.result)}`);
});

// ----------------------------------------------------
// Section 3: Negative numbers across every parameter
// ----------------------------------------------------
console.log('\n--- 3. Negative Numbers Across Every Parameter ---');

// Pediatric negative
assert(typeof Calculators.calculatePediatric(-10, 15, 3).error === 'string', '3.1 Pediatric negative weight rejected');
assert(typeof Calculators.calculatePediatric(10, -15, 3).error === 'string', '3.2 Pediatric negative dose rejected');
assert(typeof Calculators.calculatePediatric(10, 15, -3).error === 'string', '3.3 Pediatric negative times rejected');

// Cockcroft negative
assert(typeof Calculators.calculateCockcroft(-20, 70, 90, 'umol_l', false).error === 'string', '3.4 Cockcroft negative age rejected');
assert(typeof Calculators.calculateCockcroft(50, -70, 90, 'umol_l', false).error === 'string', '3.5 Cockcroft negative weight rejected');
assert(typeof Calculators.calculateCockcroft(50, 70, -90, 'umol_l', false).error === 'string', '3.6 Cockcroft negative creat rejected');

// Water deficit negative
assert(typeof Calculators.calculateWaterDeficit(-60, 150).error === 'string', '3.7 WaterDeficit negative weight rejected');
assert(typeof Calculators.calculateWaterDeficit(60, -150).error === 'string', '3.8 WaterDeficit negative natremia rejected');

// Glucose negative
assert(typeof Calculators.convertGlucose(-1.5, 'g_l').error === 'string', '3.9 Glucose negative value rejected');

// HbA1c negative
assert(typeof Calculators.convertHbA1c(-6.5, 'percent').error === 'string', '3.10 HbA1c negative value rejected');

// ----------------------------------------------------
// Section 4: Boundary Values Testing
// ----------------------------------------------------
console.log('\n--- 4. Boundary Values Testing ---');

// Cockcroft age: 17, 18, 120, 121
assert(typeof Calculators.calculateCockcroft(17, 70, 90, 'umol_l', false).error === 'string', '4.1 Cockcroft age 17 rejected (pediatric)');
const cg18 = Calculators.calculateCockcroft(18, 70, 90, 'umol_l', false);
assert(!cg18.error && cg18.clCr > 0, '4.2 Cockcroft age 18 accepted (lower boundary)', `clCr: ${cg18.clCr}`);
const cg120 = Calculators.calculateCockcroft(120, 70, 90, 'umol_l', false);
assert(!cg120.error && cg120.clCr >= 0, '4.3 Cockcroft age 120 accepted (upper boundary)', `clCr: ${cg120.clCr}`);
assert(typeof Calculators.calculateCockcroft(121, 70, 90, 'umol_l', false).error === 'string', '4.4 Cockcroft age 121 rejected (out of range)');

// Natremia: 139, 140, 141
assert(typeof Calculators.calculateWaterDeficit(70, 139).error === 'string', '4.5 Natremia 139 rejected (no hypernatremia)');
assert(typeof Calculators.calculateWaterDeficit(70, 140).error === 'string', '4.6 Natremia 140 rejected (boundary threshold <= 140)');
const wd141 = Calculators.calculateWaterDeficit(70, 141);
assert(!wd141.error && wd141.deficitLiters > 0, '4.7 Natremia 141 accepted (first hypernatremic value)', `deficit: ${wd141.deficitLiters}`);

// HbA1c: 2.9, 3.0, 7.0, 8.5, 25.0, 26.0
assert(typeof Calculators.convertHbA1c(2.9, 'percent').error === 'string', '4.8 HbA1c 2.9 rejected (< 3.0%)');
const hb3 = Calculators.convertHbA1c(3.0, 'percent');
assert(!hb3.error && hb3.hba1cPercent === 3.0, '4.9 HbA1c 3.0 accepted (lower boundary)', `hba1c: ${hb3.hba1cPercent}`);
const hb7 = Calculators.convertHbA1c(7.0, 'percent');
assert(!hb7.error && hb7.targetStatus.includes('7,0') && hb7.alertClass === 'info', '4.10 HbA1c 7.0 boundary categorized', `status: ${hb7.targetStatus}`);
const hb85 = Calculators.convertHbA1c(8.5, 'percent');
assert(!hb85.error && hb85.alertClass === 'warning' && hb85.targetStatus.includes('Sujet âgé'), '4.11 HbA1c 8.5 geriatric target boundary categorized', `status: ${hb85.targetStatus}`);
const hb25 = Calculators.convertHbA1c(25.0, 'percent');
assert(!hb25.error && hb25.hba1cPercent === 25.0 && hb25.alertClass === 'danger', '4.12 HbA1c 25.0 accepted (upper boundary)', `hba1c: ${hb25.hba1cPercent}`);
assert(typeof Calculators.convertHbA1c(26.0, 'percent').error === 'string', '4.13 HbA1c 26.0 rejected (> 25.0%)');

// Pediatric times: 0, 1, 12, 13
assert(typeof Calculators.calculatePediatric(15, 15, 0).error === 'string', '4.14 Pediatric times 0 rejected');
assert(!Calculators.calculatePediatric(15, 15, 1).error, '4.15 Pediatric times 1 accepted');
assert(!Calculators.calculatePediatric(15, 15, 12).error, '4.16 Pediatric times 12 accepted');
assert(typeof Calculators.calculatePediatric(15, 15, 13).error === 'string', '4.17 Pediatric times 13 rejected');

// ----------------------------------------------------
// Section 5: Extreme Inputs Testing
// ----------------------------------------------------
console.log('\n--- 5. Extreme Inputs Testing ---');

// Cockcroft age 200
assert(typeof Calculators.calculateCockcroft(200, 70, 90, 'umol_l', false).error === 'string', '5.1 Cockcroft age 200 rejected');

// Pediatric weight 500 kg
const p500 = Calculators.calculatePediatric(500, 15, 3);
assert(!p500.error && p500.dosePerTakeMg === 7500, '5.2 Pediatric weight 500 kg calculation does not crash', `dose: ${p500.dosePerTakeMg}`);

// Natremia 220 mmol/L
const wd220 = Calculators.calculateWaterDeficit(70, 220);
assert(!wd220.error && wd220.deficitLiters === 20, '5.3 Natremia 220 mmol/L calculation accurate', `deficit: ${wd220.deficitLiters}`);

// Glycemia 10 g/L (critical acute emergency)
const g10 = Calculators.convertGlucose(10, 'g_l');
assert(!g10.error && g10.alertClass === 'danger' && g10.status.includes('URGENCE'), '5.4 Glycemia 10 g/L triggers critical emergency danger alert', `status: ${g10.status}`);

// ----------------------------------------------------
// Section 6: Zero Divisions & Zero Handling
// ----------------------------------------------------
console.log('\n--- 6. Zero Divisions & Zero Handling ---');

// Syrup concentration = 0 -> no division by zero, mlPerTake is null
const pConc0 = Calculators.calculatePediatric(15, 15, 3, 0);
assert(!pConc0.error && pConc0.mlPerTake === null && pConc0.totalDailyMl === null,
  '6.1 Syrup conc = 0 does not divide by zero and returns null volumes');

// Creatinine = 0 -> rejected to prevent division by zero in Cockcroft
const cgCreat0 = Calculators.calculateCockcroft(50, 70, 0, 'umol_l', false);
assert(typeof cgCreat0.error === 'string', '6.2 Creatinine = 0 rejected with error object');

// Weight = 0
assert(typeof Calculators.calculatePediatric(0, 15, 3).error === 'string', '6.3 Pediatric weight 0 rejected');
assert(typeof Calculators.calculateCockcroft(50, 0, 90, 'umol_l', false).error === 'string', '6.4 Cockcroft weight 0 rejected');
assert(typeof Calculators.calculateWaterDeficit(0, 150).error === 'string', '6.5 WaterDeficit weight 0 rejected');

// Glycemia = 0
assert(typeof Calculators.convertGlucose(0, 'g_l').error === 'string', '6.6 Glycemia 0 rejected');

// HbA1c = 0
assert(typeof Calculators.convertHbA1c(0, 'percent').error === 'string', '6.7 HbA1c 0 rejected');

// ----------------------------------------------------
// Section 7: Units Validation & Parsing Safety
// ----------------------------------------------------
console.log('\n--- 7. Units Validation & Parsing Safety ---');

// Glucose unrecognized unit
const gBadUnit = Calculators.convertGlucose(1.0, 'unrecognized_unit');
assert(typeof gBadUnit.error === 'string',
  '7.1 Glucose invalid unit must return structured error instead of default 0 / false hypoglycemia',
  `Got: ${JSON.stringify(gBadUnit)}`);

const gNullUnit = Calculators.convertGlucose(1.0, null);
assert(typeof gNullUnit.error === 'string',
  '7.2 Glucose null unit must return structured error',
  `Got: ${JSON.stringify(gNullUnit)}`);

// Cockcroft unit conversion integrity
const cgUmol = Calculators.calculateCockcroft(60, 70, 100, 'umol_l', false);
const cgMgDl = Calculators.calculateCockcroft(60, 70, 100 / 88.4, 'mg_dl', false);
assert(Math.abs(cgUmol.clCr - cgMgDl.clCr) <= 1, '7.3 Cockcroft µmol/L and mg/dL produce equivalent clearance', `µmol: ${cgUmol.clCr}, mg/dL: ${cgMgDl.clCr}`);

// HbA1c bidirectional roundtrip ADAG
const hbOrig = 7.5;
const convEagMg = Calculators.convertHbA1c(hbOrig, 'percent');
const backHb = Calculators.convertHbA1c(convEagMg.eagMgDl, 'mg_dl');
assert(Math.abs(hbOrig - backHb.hba1cPercent) <= 0.1, '7.4 HbA1c <-> eAG (mg/dL) bidirectional consistency', `Orig: ${hbOrig}, back: ${backHb.hba1cPercent}`);

// CRB65 truthy/falsy resilience
const crb1 = Calculators.calculateCRB65(true, false, false, false);
assert(crb1.score === 1 && crb1.alertClass === 'warning', '7.5 CRB-65 boolean score 1');
const crbAll = Calculators.calculateCRB65('1', 'true', 'yes', 1);
assert(crbAll.score === 4 && crbAll.alertClass === 'danger', '7.6 CRB-65 string truthy score 4');
const crbNone = Calculators.calculateCRB65(0, '0', 'false', false);
assert(crbNone.score === 0 && crbNone.alertClass === 'success', '7.7 CRB-65 string falsy score 0');

// ----------------------------------------------------
// Section 8: Sandboxed DOM Invariant & UI Error Resilience
// ----------------------------------------------------
console.log('\n--- 8. Sandboxed DOM Invariant & UI Error Resilience ---');

class MockElement {
  constructor(tagName = 'div') {
    this.tagName = String(tagName).toUpperCase();
    this.children = [];
    this._innerHTML = '';
    this._textContent = '';
    this.value = '';
    this.checked = false;
    this.type = 'text';
    this.classList = {
      _classes: new Set(),
      add: (...cls) => cls.forEach(c => this.classList._classes.add(c)),
      remove: (...cls) => cls.forEach(c => this.classList._classes.delete(c)),
      contains: (c) => this.classList._classes.has(c)
    };
  }

  get textContent() {
    return this._textContent;
  }

  set textContent(val) {
    this._textContent = String(val);
    this._innerHTML = String(val)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  get innerHTML() {
    return this._innerHTML;
  }

  set innerHTML(val) {
    this._innerHTML = String(val);
    this._textContent = String(val).replace(/<[^>]*>/g, '');
  }
}

// Invariant verification test
const mockEl = new MockElement('div');
mockEl.textContent = 'Test & <Alert>';
assert(mockEl.innerHTML === 'Test &amp; &lt;Alert&gt;', '8.1 MockElement textContent updates innerHTML with escaped entities');
mockEl.innerHTML = '<div class="alert-card">Sample Content</div>';
assert(mockEl.textContent.trim() === 'Sample Content', '8.2 MockElement innerHTML strips tags for textContent');

console.log('\n====================================================');
console.log(`RÉSUMÉ DU HARNESS FUZZING M2 :`);
console.log(`  Total tests   : ${totalTests}`);
console.log(`  Tests réussis : ${passedTests}`);
console.log(`  Tests échoués : ${failedTests}`);
console.log('====================================================\n');

if (failedTests > 0) {
  console.log('DÉTAIL DES ÉCHECS :');
  failures.forEach((f, i) => {
    console.log(`  [${i + 1}] ${f.testName}`);
    if (f.details) console.log(`      ${f.details}`);
  });
}

// Do not exit with 1 immediately if we want to run both in CI, but here we exit with failure count
process.exit(failedTests > 0 ? 1 : 0);
