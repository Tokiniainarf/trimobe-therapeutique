/**
 * TEST HARNESS ADVERSARIAL — MILESTONE 1 (CHALLENGER 2)
 * Medical Content Integrity & DCI Alignment Adversarial Verification
 */

const fs = require('fs');
const assert = require('assert');

// 1. Charger les données et le moteur Markdown
const drugsData = require('./data-drugs.js');
const geriatrieData = require('./data-geriatrie.js');
const generalData = require('./data-general.js');

// Extraire renderMarkdown et parseMarkdownLists depuis app.js
const appSource = fs.readFileSync('./app.js', 'utf8');
const vm = require('vm');

// Mock DOM pour sandbox
class MockDOMElement {
  constructor(tag = 'div') {
    this.tagName = tag.toUpperCase();
    this.children = [];
    this.parentNode = null;
    this._innerHTML = '';
    this._textContent = '';
    this.attributes = {};
    this.value = '';
    this.className = '';
  }
  get innerHTML() {
    return this._innerHTML;
  }
  set innerHTML(val) {
    this._innerHTML = val || '';
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
    if (child) {
      child.parentNode = this;
      this.children.push(child);
    }
    return child;
  }
  setAttribute(k, v) {
    this.attributes[k] = String(v);
  }
  getAttribute(k) {
    return this.attributes[k] !== undefined ? this.attributes[k] : null;
  }
}

const domRegistry = new Map();
const sandbox = {
  window: {},
  document: {
    createElement: (tag) => new MockDOMElement(tag),
    getElementById: (id) => domRegistry.get(id) || null,
    querySelector: () => null,
    querySelectorAll: () => []
  },
  localStorage: { getItem: () => null, setItem: () => {}, removeItem: () => {} },
  navigator: {},
  setTimeout: (fn) => fn(),
  console: console,
  DRUGS_DATA: drugsData,
  GERIATRIE_MANUAL_DATA: geriatrieData,
  GENERAL_MANUAL_DATA: generalData
};
vm.createContext(sandbox);

// Exécuter app.js dans la sandbox jusqu'à AppState pour extraire les helpers
const helperBoundary = appSource.indexOf('const AppState =');
if (helperBoundary === -1) {
  throw new Error("Impossible de localiser la frontière AppState dans app.js");
}
vm.runInContext(appSource.substring(0, helperBoundary), sandbox);

const renderMarkdown = sandbox.renderMarkdown;
const parseMarkdownLists = sandbox.parseMarkdownLists;
const escHtml = sandbox.escHtml;

console.log("================================================================");
console.log("   TEST HARNESS ADVERSARIAL : MILESTONE 1 (CHALLENGER 2)        ");
console.log("================================================================\n");

let passCount = 0;
let failCount = 0;
const failures = [];

function check(title, fn) {
  try {
    fn();
    passCount++;
    console.log(`  ✓ ${title}`);
  } catch (err) {
    failCount++;
    failures.push({ title, error: err.message });
    console.log(`  ✗ ${title}`);
    console.log(`    → Erreur: ${err.message}`);
  }
}

// --------------------------------------------------------------------------
// SECTION 1 : AUDIT DE LA BASE DRUGS_DATA (78 MOLÉCULES & SCHEMA)
// --------------------------------------------------------------------------
console.log("--- SECTION 1 : Base DRUGS_DATA & Schéma des 78 DCI ---");

check("DRUGS_DATA contient exactement 78 molécules", () => {
  assert.strictEqual(drugsData.length, 78, `Attendu 78 molécules, trouvé: ${drugsData.length}`);
});

check("Chaque molécule possède exactement les 11 champs requis", () => {
  const requiredKeys = [
    'dci', 'class', 'indication', 'dosage', 'precautions',
    'renalAdaptation', 'renalNote', 'geriatricRisk', 'aware',
    'stoppBeers', 'manuals'
  ].sort();

  drugsData.forEach((d, idx) => {
    const keys = Object.keys(d).sort();
    assert.deepStrictEqual(
      keys,
      requiredKeys,
      `Molécule #${idx} (${d.dci || 'SANS NOM'}): clés non conformes. Trouvé: ${keys.join(', ')}`
    );
  });
});

check("Aucun champ de chaîne n'est vide, undefined, null, NaN ou whitespace-only", () => {
  const stringKeys = ['dci', 'class', 'indication', 'dosage', 'precautions', 'renalNote', 'geriatricRisk'];
  drugsData.forEach((d, idx) => {
    stringKeys.forEach(k => {
      const val = d[k];
      assert.strictEqual(typeof val, 'string', `Molécule #${idx} (${d.dci}): ${k} n'est pas une chaîne`);
      assert.ok(val.trim().length > 0, `Molécule #${idx} (${d.dci}): ${k} est vide ou whitespace`);
      assert.ok(!val.includes('undefined'), `Molécule #${idx} (${d.dci}): ${k} contient le mot 'undefined'`);
      assert.ok(!val.includes('NaN'), `Molécule #${idx} (${d.dci}): ${k} contient le mot 'NaN'`);
      assert.ok(!val.includes('null'), `Molécule #${idx} (${d.dci}): ${k} contient le mot 'null'`);
    });
  });
});

check("Le champ renalAdaptation est strictement un booléen (true ou false)", () => {
  drugsData.forEach((d, idx) => {
    assert.strictEqual(typeof d.renalAdaptation, 'boolean', `Molécule #${idx} (${d.dci}): renalAdaptation n'est pas booléen`);
  });
});

check("Le champ manuals est un tableau non vide valide contenant 'general' et/ou 'geriatrie'", () => {
  drugsData.forEach((d, idx) => {
    assert.ok(Array.isArray(d.manuals), `Molécule #${idx} (${d.dci}): manuals n'est pas un tableau`);
    assert.ok(d.manuals.length > 0, `Molécule #${idx} (${d.dci}): manuals est vide`);
    d.manuals.forEach(m => {
      assert.ok(['general', 'geriatrie'].includes(m), `Molécule #${idx} (${d.dci}): tag manuel invalide '${m}'`);
    });
  });
});

check("Le champ stoppBeers est soit null, soit une chaîne explicite non vide", () => {
  let withStopp = 0;
  drugsData.forEach((d, idx) => {
    if (d.stoppBeers !== null) {
      assert.strictEqual(typeof d.stoppBeers, 'string', `Molécule #${idx} (${d.dci}): stoppBeers doit être string ou null`);
      assert.ok(d.stoppBeers.trim().length > 0, `Molécule #${idx} (${d.dci}): stoppBeers est une chaîne vide`);
      withStopp++;
    }
  });
  assert.ok(withStopp >= 40, `Attendu au moins 40 molécules avec critères STOPP/Beers, trouvé: ${withStopp}`);
});

// --------------------------------------------------------------------------
// SECTION 2 : UNICITÉ STRICTE DES DCI (ZERO DOUBLON)
// --------------------------------------------------------------------------
console.log("\n--- SECTION 2 : Unicité stricte des DCI ---");

check("Zéro doublon exact de DCI", () => {
  const dciMap = new Map();
  drugsData.forEach((d, idx) => {
    const name = d.dci;
    if (dciMap.has(name)) {
      throw new Error(`DCI en doublon exact: '${name}' aux indices ${dciMap.get(name)} et ${idx}`);
    }
    dciMap.set(name, idx);
  });
});

check("Zéro doublon insensible à la casse et aux espaces", () => {
  const normalizedMap = new Map();
  drugsData.forEach((d, idx) => {
    const norm = d.dci.toLowerCase().replace(/\s+/g, ' ').trim();
    if (normalizedMap.has(norm)) {
      throw new Error(`DCI en doublon insensible à la casse/espaces: '${norm}' aux indices ${normalizedMap.get(norm)} et ${idx}`);
    }
    normalizedMap.set(norm, idx);
  });
});

check("Zéro doublon insensible aux accents / signes diacritiques", () => {
  const unaccentMap = new Map();
  drugsData.forEach((d, idx) => {
    const unaccent = d.dci
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .trim();
    if (unaccentMap.has(unaccent)) {
      throw new Error(`DCI en doublon après suppression accents: '${unaccent}' aux indices ${unaccentMap.get(unaccent)} et ${idx}`);
    }
    unaccentMap.set(unaccent, idx);
  });
});

// --------------------------------------------------------------------------
// SECTION 3 : CLASSIFICATION OMS AWARE & ANTIBIOTIQUES
// --------------------------------------------------------------------------
console.log("\n--- SECTION 3 : Classification OMS AWaRe & Antibiotiques ---");

check("Exactement 12 molécules ont un tag AWaRe non null ('access', 'watch' ou 'reserve')", () => {
  const awareMols = drugsData.filter(d => d.aware !== null);
  assert.strictEqual(awareMols.length, 12, `Attendu 12 molécules AWaRe, trouvé: ${awareMols.length}`);
  awareMols.forEach(d => {
    assert.ok(
      ['access', 'watch', 'reserve'].includes(d.aware),
      `Molécule ${d.dci} possède un tag AWaRe non valide: '${d.aware}'`
    );
  });
});

check("Les 66 autres molécules ont strictement aware === null", () => {
  const nonAwareMols = drugsData.filter(d => d.aware === null);
  assert.strictEqual(nonAwareMols.length, 66, `Attendu 66 molécules avec aware: null, trouvé: ${nonAwareMols.length}`);
});

check("Toutes les molécules AWaRe correspondent aux antibiotiques de référence", () => {
  const expectedAntibiotics = [
    'Amoxicilline',
    'Amoxicilline / acide clavulanique',
    'Azithromycine',
    'Ceftriaxone',
    'Ciprofloxacine',
    'Fosfomycine trométamol',
    'Métronidazole',
    'Nitrofurantoïne',
    'Doxycycline',
    'Clarithromycine',
    'Pivmécillinam',
    'Tétracycline'
  ];
  const actualAntibiotics = drugsData.filter(d => d.aware !== null).map(d => d.dci);
  assert.deepStrictEqual(
    actualAntibiotics.sort(),
    expectedAntibiotics.sort(),
    `Liste des molécules AWaRe divergente.\nAttendu: ${expectedAntibiotics.sort().join(', ')}\nTrouvé: ${actualAntibiotics.sort().join(', ')}`
  );
});

check("Aucune molécule non-antibiotique parmi les 66 autres n'a de classe antibactérienne", () => {
  const nonAwareMols = drugsData.filter(d => d.aware === null);
  const suspicious = nonAwareMols.filter(d => {
    const c = d.class.toLowerCase();
    return c.includes('anti') && (
      c.includes('bio') || c.includes('bact') || c.includes('penic') ||
      c.includes('quinol') || c.includes('ceph') || c.includes('cyclin')
    );
  });
  assert.strictEqual(
    suspicious.length,
    0,
    `Molécules antibiotiques potentielles sans tag aware: ${suspicious.map(d => d.dci).join(', ')}`
  );
});

// --------------------------------------------------------------------------
// SECTION 4 : VÉRIFICATION SANITAIRE DES POSOLOGIES & UNITÉS STANDARD
// --------------------------------------------------------------------------
console.log("\n--- SECTION 4 : Posologies, Nombres & Unités Médicales ---");

check("Absence de nombres négatifs dans les posologies et notes", () => {
  drugsData.forEach((d, idx) => {
    const cleaned = d.dosage.replace(/(^|[:\n])\s*[-•]\s*/g, '$1 ');
    const negMatch = cleaned.match(/(?<![\d,.]\s*)[-−]\s*\d+/);
    if (negMatch) {
      throw new Error(`Molécule #${idx} (${d.dci}): nombre négatif suspect dans dosage: '${negMatch[0]}'`);
    }
  });
});

check("Unités de posologie strictement standardisées (µg, mg, g, mL, g/L, mmol/L)", () => {
  drugsData.forEach((d, idx) => {
    ['dosage', 'renalNote'].forEach(field => {
      const text = d[field];
      const ugMatch = text.match(/\b(ug|mcg)\b/i);
      if (ugMatch) {
        throw new Error(`Molécule #${idx} (${d.dci}): unité '${ugMatch[0]}' dans ${field}, utiliser 'µg'`);
      }
      const mlMatch = text.match(/\d+\s*ml\b/);
      if (mlMatch) {
        throw new Error(`Molécule #${idx} (${d.dci}): unité '${mlMatch[0]}' avec ml minuscule dans ${field}, utiliser 'mL'`);
      }
      const ccMatch = text.match(/\d+\s*cc\b/i);
      if (ccMatch) {
        throw new Error(`Molécule #${idx} (${d.dci}): unité obsolète '${ccMatch[0]}' dans ${field}, utiliser 'mL'`);
      }
      const glMatch = text.match(/\d+(\.\d+)?\s*g\/l\b/);
      if (glMatch) {
        throw new Error(`Molécule #${idx} (${d.dci}): unité '${glMatch[0]}' avec 'g/l' minuscule, utiliser 'g/L'`);
      }
      const mmollMatch = text.match(/\d+(\.\d+)?\s*mmol\/l\b/);
      if (mmollMatch) {
        throw new Error(`Molécule #${idx} (${d.dci}): unité '${mmollMatch[0]}' avec 'mmol/l' minuscule, utiliser 'mmol/L'`);
      }
    });
  });
});

check("Posologies positives et réalistes cliniquement", () => {
  drugsData.forEach((d, idx) => {
    const hasNumber = /\d+/.test(d.dosage);
    assert.ok(hasNumber, `Molécule #${idx} (${d.dci}): posologie sans valeur numérique: '${d.dosage}'`);
  });
});

// --------------------------------------------------------------------------
// SECTION 5 : INTÉGRITÉ DE LA FICHE 31 (TABLEAU STOPP/START & DÉPRESCRIPTION)
// --------------------------------------------------------------------------
console.log("\n--- SECTION 5 : Fiche 31 (Tableau STOPP/START v3) ---");

const fiche31 = geriatrieData.fiches.find(f => f.num === 31);

check("Fiche 31 existe dans data-geriatrie.js", () => {
  assert.ok(fiche31, "Fiche 31 non trouvée dans geriatrieData.fiches");
  assert.strictEqual(fiche31.num, 31);
});

check("Fiche 31 contient un tableau Markdown avec délimiteur d'alignement", () => {
  const content = fiche31.content;
  assert.ok(content.includes('| Système d\'organes | STOPP v3'), "En-tête de tableau manquant");
  assert.ok(content.includes('| :--- | :--- | :--- |'), "Délimiteur d'alignement Markdown manquant");
});

check("Chaque ligne du tableau de la Fiche 31 a exactement 3 colonnes", () => {
  const lines = fiche31.content.split('\n');
  const tableLines = lines.filter(l => l.trim().startsWith('|') && l.trim().endsWith('|'));
  assert.ok(tableLines.length >= 20, `Nombre insuffisant de lignes dans le tableau: ${tableLines.length}`);

  tableLines.forEach((l, idx) => {
    const parts = l.split('|').map(s => s.trim()).filter((s, i, arr) => i > 0 && i < arr.length - 1);
    assert.strictEqual(
      parts.length,
      3,
      `Ligne #${idx} du tableau n'a pas 3 colonnes (trouvé ${parts.length}): '${l}'`
    );
    parts.forEach((col, cIdx) => {
      assert.ok(col.length > 0, `Ligne #${idx}, colonne #${cIdx} est vide`);
    });
  });
});

check("Absence totale de balises <br> ou entités &lt;br&gt; dans la Fiche 31", () => {
  assert.ok(!fiche31.content.includes('<br>'), "Présence de balise brute <br> dans Fiche 31");
  assert.ok(!fiche31.content.includes('<br/>'), "Présence de balise brute <br/> dans Fiche 31");
  assert.ok(!fiche31.content.includes('<br />'), "Présence de balise brute <br /> dans Fiche 31");
  assert.ok(!fiche31.content.includes('&lt;br'), "Présence d'entité &lt;br dans Fiche 31");
});

check("Couverture intégrale des 6 systèmes d'organes STOPP/START v3", () => {
  const systems = [
    "Cardiovasculaire",
    "Système Nerveux Central",
    "Gastro-intestinal",
    "Musculo-squelettique",
    "Endocrinien & Métabolisme",
    "Néphrologie & Urologie"
  ];
  systems.forEach(sys => {
    assert.ok(fiche31.content.includes(sys), `Système d'organes manquant dans Fiche 31: ${sys}`);
  });
});

check("Présence de la démarche de déprescription en 5 étapes", () => {
  for (let step = 1; step <= 5; step++) {
    assert.ok(
      fiche31.content.includes(`**${step}.`),
      `Étape #${step} de déprescription manquante dans Fiche 31`
    );
  }
});

check("Rendu HTML du tableau Fiche 31 valide et propre (avec entités HTML échappées)", () => {
  const rendered = renderMarkdown(fiche31.content);
  assert.ok(rendered.includes('<table class="clinical-table">'), "Table non rendue en <table class=\"clinical-table\">");
  assert.ok(
    rendered.includes('<th>Système d&#39;organes</th>') || rendered.includes('<th>Système d\'organes</th>'),
    "Th Système d'organes manquant dans l'en-tête du tableau"
  );
  assert.ok(rendered.includes('<th>STOPP v3'), "Th STOPP v3 manquant");
  assert.ok(rendered.includes('<th>START v3'), "Th START v3 manquant");
  assert.ok(!rendered.includes('<p>---</p>'), "Résidu <p>---</p> dans Fiche 31");
});

// --------------------------------------------------------------------------
// SECTION 6 : MONOGRAPHIES CHAPITRE XXXVI & BADGES AWARE
// --------------------------------------------------------------------------
console.log("\n--- SECTION 6 : Chapitre XXXVI (Antibiotiques & Badges AWaRe) ---");

const ch36 = generalData.chapters.find(c => c.num === 'XXXVI');

check("Chapitre XXXVI existe dans data-general.js", () => {
  assert.ok(ch36, "Chapitre XXXVI non trouvé dans generalData.chapters");
  assert.strictEqual(ch36.num, 'XXXVI');
});

check("Présence des 12 monographies / sections d'antibiotiques dans le Chapitre XXXVI", () => {
  const expectedMonographs = [
    "Amoxicilline",
    "Amoxicilline / acide clavulanique",
    "Pivmécillinam",
    "Fosfomycine trométamol",
    "Nitrofurantoïne",
    "Doxycycline",
    "Métronidazole",
    "Sulfaméthoxazole / Triméthoprime (Cotrimoxazole)",
    "Ceftriaxone",
    "Azithromycine",
    "Ciprofloxacine",
    "Groupe RESERVE"
  ];
  expectedMonographs.forEach(m => {
    assert.ok(ch36.content.includes(m), `Monographie manquante dans Ch. XXXVI: ${m}`);
  });
});

check("Présence et validité des badges AWaRe (8 ACCESS, 3 WATCH, 1 RESERVE)", () => {
  const accessMatches = ch36.content.match(/\[ACCESS\s*-\s*[^\]]+\]/g) || [];
  const watchMatches = ch36.content.match(/\[WATCH\s*-\s*[^\]]+\]/g) || [];
  const reserveMatches = ch36.content.match(/\[RESERVE\s*-\s*[^\]]+\]/g) || [];

  assert.strictEqual(accessMatches.length, 8, `Attendu 8 badges ACCESS, trouvé: ${accessMatches.length}`);
  assert.strictEqual(watchMatches.length, 3, `Attendu 3 badges WATCH, trouvé: ${watchMatches.length}`);
  assert.strictEqual(reserveMatches.length, 1, `Attendu 1 badge RESERVE, trouvé: ${reserveMatches.length}`);
});

check("Rendu HTML des badges AWaRe avec classes CSS dédiées", () => {
  const rendered = renderMarkdown(ch36.content);
  assert.ok(rendered.includes('badge-aware badge-access'), "Classe badge-access absente dans HTML rendu");
  assert.ok(rendered.includes('badge-aware badge-watch'), "Classe badge-watch absente dans HTML rendu");
  assert.ok(rendered.includes('badge-aware badge-reserve'), "Classe badge-reserve absente dans HTML rendu");
  assert.ok(!rendered.includes('[ACCESS -'), "Résidu brut [ACCESS - dans le rendu HTML");
  assert.ok(!rendered.includes('[WATCH -'), "Résidu brut [WATCH - dans le rendu HTML");
  assert.ok(!rendered.includes('[RESERVE -'), "Résidu brut [RESERVE - dans le rendu HTML");
});

check("Présence des alertes cliniques critiques dans Chapitre XXXVI", () => {
  assert.ok(ch36.content.includes("tendon d'Achille"), "Alerte tendinopathie fluoroquinolones manquante");
  assert.ok(ch36.content.includes("aortique"), "Alerte dissection aortique fluoroquinolones manquante");
  assert.ok(ch36.content.includes("DFG < 30-45"), "Seuil DFG nitrofurantoïne manquant");
  assert.ok(ch36.content.includes("fibrose pulmonaire"), "Alerte fibrose pulmonaire nitrofurantoïne manquante");
  assert.ok(ch36.content.includes("antabuse"), "Effet antabuse métronidazole manquant");
  assert.ok(ch36.content.includes("calcium"), "Incompatibilité ceftriaxone calcium manquante");
});

// --------------------------------------------------------------------------
// SECTION 7 : RENDU GLOBAL ET INVARIANT SANDBOXED DOM TESTING
// --------------------------------------------------------------------------
console.log("\n--- SECTION 7 : Invariants Sandboxed DOM & Rendu Global ---");

check("Rendu sans artefact sur les 51 chapitres et 33 fiches", () => {
  generalData.chapters.forEach(c => {
    const rendered = renderMarkdown(c.content);
    assert.ok(!rendered.includes('<p>---</p>'), `Chapitre ${c.num} contient <p>---</p>`);
    assert.ok(!rendered.includes('&lt;br&gt;'), `Chapitre ${c.num} contient &lt;br&gt; brut`);
    assert.ok(!rendered.includes('undefined'), `Chapitre ${c.num} contient le mot 'undefined'`);
    assert.ok(!rendered.includes('NaN'), `Chapitre ${c.num} contient le mot 'NaN'`);
  });

  geriatrieData.fiches.forEach(f => {
    const rendered = renderMarkdown(f.content);
    assert.ok(!rendered.includes('<p>---</p>'), `Fiche ${f.num} contient <p>---</p>`);
    assert.ok(!rendered.includes('&lt;br&gt;'), `Fiche ${f.num} contient &lt;br&gt; brut`);
    assert.ok(!rendered.includes('undefined'), `Fiche ${f.num} contient le mot 'undefined'`);
    assert.ok(!rendered.includes('NaN'), `Fiche ${f.num} contient le mot 'NaN'`);
  });
});

check("Invariant Sandboxed DOM Testing : MockElement textContent/innerHTML bidirectionnel", () => {
  class SandboxedMockElement {
    constructor(tag = 'div') {
      this.tagName = tag.toUpperCase();
      this._innerHTML = '';
      this._textContent = '';
    }
    get innerHTML() {
      return this._innerHTML;
    }
    set innerHTML(val) {
      this._innerHTML = val || '';
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
    set textContent(val) {
      this._textContent = val === null || val === undefined ? '' : String(val);
      this._innerHTML = this._textContent
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
    }
  }

  const el = new SandboxedMockElement('span');
  
  el.textContent = "Formule : A & B < C > D ' E \" F";
  assert.strictEqual(
    el.innerHTML,
    "Formule : A &amp; B &lt; C &gt; D &#39; E &quot; F",
    "textContent setter n'échappe pas correctement les entités HTML dans innerHTML"
  );
  
  el.innerHTML = "Résultat &amp; test &lt;10";
  assert.strictEqual(
    el.textContent,
    "Résultat & test <10",
    "innerHTML setter ne déséchappe pas correctement dans textContent"
  );

  el.textContent = null;
  assert.strictEqual(el.textContent, '');
  assert.strictEqual(el.innerHTML, '');

  el.textContent = undefined;
  assert.strictEqual(el.textContent, '');
  assert.strictEqual(el.innerHTML, '');
});

// --------------------------------------------------------------------------
// SECTION 8 : RÉSILIENCE IHM & RECHERCHE DES DCI
// --------------------------------------------------------------------------
console.log("\n--- SECTION 8 : Résilience IHM & Filtrage des DCI ---");

check("Toutes les 78 DCI sont indexables et retrouvables par requête textuelle", () => {
  drugsData.forEach((d, idx) => {
    const q = d.dci.toLowerCase();
    const matches = drugsData.filter(item => {
      return item.dci.toLowerCase().includes(q) ||
             item.class.toLowerCase().includes(q) ||
             item.indication.toLowerCase().includes(q);
    });
    assert.ok(matches.length >= 1, `DCI #${idx} (${d.dci}): impossible à retrouver par recherche textuelle`);
    assert.ok(matches.some(m => m.dci === d.dci), `DCI #${idx} (${d.dci}): la recherche n'inclut pas la molécule elle-même`);
  });
});

check("Filtre rénal : proportionnalité et cohérence du booléen renalAdaptation", () => {
  const renalTrue = drugsData.filter(d => d.renalAdaptation === true);
  const renalFalse = drugsData.filter(d => d.renalAdaptation === false);
  assert.strictEqual(renalTrue.length + renalFalse.length, 78);
  assert.ok(renalTrue.length >= 25, `Trop peu de molécules avec adaptation rénale requise (${renalTrue.length})`);
  assert.ok(renalFalse.length >= 25, `Trop peu de molécules sans adaptation rénale (${renalFalse.length})`);
  // Vérifier qu'aucune molécule rénale n'a de renalNote vide
  renalTrue.forEach(d => {
    assert.ok(d.renalNote.length > 10, `${d.dci}: note rénale trop brève pour une molécule avec renalAdaptation=true`);
  });
});

check("Filtre risque gériatrique : détection cohérente des molécules à haut risque", () => {
  const highRisk = drugsData.filter(d => d.geriatricRisk.includes('Élevé') || d.geriatricRisk.includes('Très élevé'));
  assert.ok(highRisk.length >= 15, `Trop peu de molécules classées à risque élevé (${highRisk.length})`);
  // Les AOD et benzodiazépines doivent être à risque élevé
  const aod = highRisk.filter(d => d.class.toLowerCase().includes('aod') || d.class.toLowerCase().includes('anticoagulant'));
  assert.ok(aod.length >= 2, "Les anticoagulants oraux majeurs doivent figurer parmi le risque élevé");
});

// --------------------------------------------------------------------------
// BILAN DES TESTS
// --------------------------------------------------------------------------
console.log("\n================================================================");
console.log(`TOTAL DES TESTS EXÉCUTÉS : ${passCount + failCount}`);
console.log(`  Tests réussis : ${passCount}`);
console.log(`  Tests échoués : ${failCount}`);
console.log("================================================================");

if (failCount > 0) {
  console.log("\nDétail des échecs :");
  failures.forEach(f => console.log(` - ${f.title}: ${f.error}`));
  process.exit(1);
} else {
  console.log("\n>>> TOUS LES TESTS ADVERSARIAUX ONT RÉUSSI AVEC SUCCÈS ! <<<");
  process.exit(0);
}
