/**
 * EMPIRICAL CHALLENGER TEST SUITE — MILESTONE 1
 * Adversarial stress testing of renderMarkdown, parseMarkdownLists,
 * table parsing, math formula handling, and the entire medical corpus.
 *
 * Follows Sandboxed DOM Testing Invariants and Review-Only constraints.
 */

const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..');

// Charger app.js pour extraire le moteur de rendu
const appCode = fs.readFileSync(path.join(projectRoot, 'app.js'), 'utf8');
eval(appCode.substring(0, appCode.indexOf('// État global')));

// Charger les données du projet
const gen = require(path.join(projectRoot, 'data-general.js'));
const ger = require(path.join(projectRoot, 'data-geriatrie.js'));
const drugs = require(path.join(projectRoot, 'data-drugs.js'));

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
    failures.push({ category, name, error: err.message });
    console.error(`  ✗ [${category}] ${name}: ${err.message}`);
  }
}

function expect(actual) {
  return {
    toBe(expected) {
      if (actual !== expected) {
        throw new Error(`Expected ${JSON.stringify(expected)} but got ${JSON.stringify(actual)}`);
      }
    },
    toContain(substr) {
      if (!actual || !actual.includes(substr)) {
        throw new Error(`Expected content to contain ${JSON.stringify(substr)}`);
      }
    },
    toNotContain(substr) {
      if (actual && actual.includes(substr)) {
        throw new Error(`Expected content NOT to contain ${JSON.stringify(substr)}`);
      }
    },
    toMatch(regex) {
      if (!regex.test(actual)) {
        throw new Error(`Expected ${JSON.stringify(actual)} to match ${regex}`);
      }
    },
    toNotMatch(regex) {
      if (regex.test(actual)) {
        throw new Error(`Expected ${JSON.stringify(actual)} NOT to match ${regex}`);
      }
    },
    toBeTruthy() {
      if (!actual) {
        throw new Error(`Expected truthy value, got ${JSON.stringify(actual)}`);
      }
    }
  };
}

console.log('================================================================');
console.log('       EMPIRICAL CHALLENGER TEST SUITE — MILESTONE 1           ');
console.log('================================================================\n');

/* ------------------------------------------------------------------
   1. SANDBOXED DOM TESTING INVARIANTS
   ------------------------------------------------------------------ */
console.log('1. Sandboxed DOM Testing Invariants');

class ChallengerMockElement {
  constructor(tag) {
    this.tagName = tag.toUpperCase();
    this.children = [];
    this._innerHTML = '';
    this._textContent = '';
    this._classListSet = new Set();
    this.classList = {
      add: (...tokens) => { tokens.forEach(t => { if (t) this._classListSet.add(String(t)); }); },
      remove: (...tokens) => { tokens.forEach(t => { this._classListSet.delete(String(t)); }); },
      toggle: (token, val) => {
        token = String(token);
        if (val !== undefined) {
          if (val) { this._classListSet.add(token); return true; }
          else { this._classListSet.delete(token); return false; }
        }
        if (this._classListSet.has(token)) {
          this._classListSet.delete(token);
          return false;
        } else {
          this._classListSet.add(token);
          return true;
        }
      },
      contains: (token) => this._classListSet.has(String(token)),
      get length() { return this._classListSet.size; },
      toString: () => Array.from(this._classListSet).join(' '),
      forEach: (cb, thisArg) => this._classListSet.forEach(cb, thisArg)
    };
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

test('DOM Invariants', 'textContent setter strictly escapes &, <, >, ", \'', () => {
  const el = new ChallengerMockElement('div');
  el.textContent = 'Posologie: 5 mg < 10 mg & "attention" \'dci\' > 0';
  expect(el.innerHTML).toBe('Posologie: 5 mg &lt; 10 mg &amp; &quot;attention&quot; &#39;dci&#39; &gt; 0');
});

test('DOM Invariants', 'innerHTML setter strictly decodes entities in textContent', () => {
  const el = new ChallengerMockElement('div');
  el.innerHTML = '<p>Dose &amp; Posologie &lt;urgent&gt; &quot;max&quot; &#39;mg&#39;</p>';
  expect(el.textContent).toBe('Dose & Posologie <urgent> "max" \'mg\'');
});

test('DOM Invariants', 'Null and undefined handling in textContent setter', () => {
  const el = new ChallengerMockElement('span');
  el.textContent = null;
  expect(el.innerHTML).toBe('');
  expect(el.textContent).toBe('');
  el.textContent = undefined;
  expect(el.innerHTML).toBe('');
  expect(el.textContent).toBe('');
});

/* ------------------------------------------------------------------
   2. NESTED LISTS & IRREGULAR INDENTATION
   ------------------------------------------------------------------ */
console.log('\n2. Nested Lists & Indentation Stress Tests');

test('Lists', 'Standard unordered list with dash, star, and bullet symbols', () => {
  const md = '- Item 1\n* Item 2\n• Item 3';
  const out = renderMarkdown(md);
  expect(out).toContain('<ul>');
  expect(out).toContain('<li>Item 1</li>');
  expect(out).toContain('<li>Item 2</li>');
  expect(out).toContain('<li>Item 3</li>');
  expect(out).toContain('</ul>');
});

test('Lists', 'Nested unordered sub-bullets (2, 3, 4 spaces)', () => {
  const md = '- Parent\n  - Sub 2 spaces\n   - Sub 3 spaces\n    - Sub 4 spaces';
  const out = renderMarkdown(md);
  expect(out).toContain('<ul>\n<li>Parent\n<ul>');
  expect(out).toContain('<li>Sub 2 spaces</li>');
  expect(out).toContain('<li>Sub 3 spaces</li>');
  expect(out).toContain('<li>Sub 4 spaces</li>');
});

test('Lists', 'Mixed tab and spaces in nested sub-bullets', () => {
  const md = '- Parent\n\t\t- Sub double tab\n\t - Sub tab plus space';
  const out = renderMarkdown(md);
  expect(out).toContain('<li>Parent\n<ul>');
  expect(out).toContain('<li>Sub double tab</li>');
  expect(out).toContain('<li>Sub tab plus space</li>');
});

test('Lists', 'Sub-bullet without prior top-level parent initializes clean ul without crash', () => {
  const md = '  - Orphan sub-bullet A\n  - Orphan sub-bullet B';
  const out = renderMarkdown(md);
  expect(out).toContain('<ul>');
  expect(out).toContain('<li>Orphan sub-bullet A');
  expect(out).toNotContain('undefined');
});

test('Lists', 'Standard ordered list with ol.clinical-ordered-list class', () => {
  const md = '1. Première étape\n2. Seconde étape\n3. Troisième étape';
  const out = renderMarkdown(md);
  expect(out).toContain('<ol class="clinical-ordered-list">');
  expect(out).toContain('<li>Première étape</li>');
  expect(out).toContain('<li>Seconde étape</li>');
  expect(out).toContain('<li>Troisième étape</li>');
  expect(out).toContain('</ol>');
});

test('Lists', 'Multiple separate ordered lists with intervening paragraph', () => {
  const md = '1. A\n2. B\n\nIntermède clinique\n\n1. C\n2. D';
  const out = renderMarkdown(md);
  const olCount = (out.match(/<ol class="clinical-ordered-list">/g) || []).length;
  expect(olCount).toBe(2);
  expect(out).toContain('<p>Intermède clinique</p>');
});

test('Lists', 'Ordered list containing nested unordered sub-bullets', () => {
  const md = '1. Palier I\n  - Paracétamol 1 g × 3/j\n  - AINS si non CI\n2. Palier II\n  - Tramadol 50 mg';
  const out = renderMarkdown(md);
  expect(out).toContain('<ol class="clinical-ordered-list">');
  expect(out).toContain('<li>Palier I\n<ul>\n  <li>Paracétamol 1 g × 3/j</li>');
  expect(out).toContain('<li>Palier II\n<ul>\n  <li>Tramadol 50 mg</li>');
});

test('Lists', 'Ordered list with non-sequential numbering (e.g., 1., 42., 999.)', () => {
  const md = '1. Début\n42. Milieu\n999. Fin';
  const out = renderMarkdown(md);
  expect(out).toContain('<ol class="clinical-ordered-list">');
  expect(out).toContain('<li>Début</li>');
  expect(out).toContain('<li>Milieu</li>');
  expect(out).toContain('<li>Fin</li>');
});

test('Lists', 'Empty bullet content does not throw or output undefined', () => {
  const md = '- \n- Item valide';
  const out = renderMarkdown(md);
  expect(out).toContain('<ul>');
  expect(out).toContain('<li>Item valide</li>');
  expect(out).toNotContain('undefined');
});

test('Lists', 'Single space indentation falls back gracefully to paragraph without breaking parser', () => {
  const md = '- Item\n - Single space sub';
  const out = renderMarkdown(md);
  expect(out).toContain('<ul>\n<li>Item</li>\n</ul>');
  expect(out).toContain('<p>- Single space sub</p>');
});

/* ------------------------------------------------------------------
   3. HORIZONTAL RULES & SECTION DIVIDERS
   ------------------------------------------------------------------ */
console.log('\n3. Horizontal Rules & Section Dividers Stress Tests');

test('Dividers', 'Standard --- renders as hr.section-divider without p wrapper', () => {
  const md = 'Texte avant\n\n---\n\nTexte après';
  const out = renderMarkdown(md);
  expect(out).toContain('<hr class="section-divider">');
  expect(out).toNotContain('<p>---</p>');
  expect(out).toNotContain('<p><hr');
});

test('Dividers', 'Dividers with 4, 5, 10 dashes render properly', () => {
  const md = '----\n\n-----\n\n----------';
  const out = renderMarkdown(md);
  const hrCount = (out.match(/<hr class="section-divider">/g) || []).length;
  expect(hrCount).toBe(3);
  expect(out).toNotContain('<p>---');
});

test('Dividers', 'Dividers with leading and trailing spaces/tabs', () => {
  const md = '  ---   \n\n\t---\t';
  const out = renderMarkdown(md);
  const hrCount = (out.match(/<hr class="section-divider">/g) || []).length;
  expect(hrCount).toBe(2);
});

test('Dividers', 'Multiple consecutive dividers without text', () => {
  const md = '---\n---\n---';
  const out = renderMarkdown(md);
  const hrCount = (out.match(/<hr class="section-divider">/g) || []).length;
  expect(hrCount).toBe(3);
  expect(out).toNotContain('<p>---</p>');
});

test('Dividers', 'Negative cases: two dashes or dashes with text are NOT converted to hr', () => {
  const md = '--\n\n--- texte\n\ntexte ---';
  const out = renderMarkdown(md);
  expect(out).toNotContain('<hr');
  expect(out).toContain('<p>--</p>');
  expect(out).toContain('<p>--- texte</p>');
  expect(out).toContain('<p>texte ---</p>');
});

test('Dividers', 'Divider tightly placed between heading, list, and quote', () => {
  const md = '### Titre\n---\n1. Item 1\n---\n> Alerte médicale';
  const out = renderMarkdown(md);
  expect(out).toContain('<h3>Titre</h3>');
  expect(out).toContain('<hr class="section-divider">');
  expect(out).toContain('<ol class="clinical-ordered-list">');
  expect(out).toContain('<blockquote>Alerte médicale</blockquote>');
  expect(out).toNotContain('<p>---</p>');
});

/* ------------------------------------------------------------------
   4. RAW HTML ENTITIES, XSS ATTACKS & MALFORMED FORMATTING
   ------------------------------------------------------------------ */
console.log('\n4. HTML Entities, Security & Malformed Formatting Tests');

test('Security', 'Raw <script> tag is escaped and not executable', () => {
  const md = '<script>alert("xss")</script>';
  const out = renderMarkdown(md);
  expect(out).toNotContain('<script>');
  expect(out).toContain('&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;');
});

test('Security', 'Malicious img onerror payload is sanitized', () => {
  const md = '<img src="invalid.jpg" onerror="alert(document.cookie)">';
  const out = renderMarkdown(md);
  expect(out).toNotContain('<img');
  expect(out).toContain('&lt;img');
});

test('Security', 'Raw HTML entities &, <, >, ", \' are escaped', () => {
  const md = 'Taux & seuil < 100 > 50 "urgent" \'reco\'';
  const out = renderMarkdown(md);
  expect(out).toContain('&amp;');
  expect(out).toContain('&lt;');
  expect(out).toContain('&gt;');
  expect(out).toContain('&quot;');
  expect(out).toContain('&#39;');
});

test('Security', 'Existing entity &amp; is safely double-escaped to prevent raw entity injections', () => {
  const md = '&amp; &lt;script&gt;';
  const out = renderMarkdown(md);
  expect(out).toContain('&amp;amp;');
  expect(out).toContain('&amp;lt;script&amp;gt;');
});

test('Formatting', 'Unclosed bold ** parses into empty em tag without throwing or crashing', () => {
  const md = 'Texte avec **gras non refermé ici';
  const out = renderMarkdown(md);
  expect(out).toContain('<em></em>gras non refermé ici');
  expect(out).toNotContain('undefined');
});

test('Formatting', 'Unclosed single asterisk remains plain text', () => {
  const md = 'Texte avec *italique non refermé';
  const out = renderMarkdown(md);
  expect(out).toContain('*italique non refermé');
});

test('Formatting', 'Unclosed backtick ` remains benign literal', () => {
  const md = 'Code `incomplet';
  const out = renderMarkdown(md);
  expect(out).toContain('`incomplet');
});

test('Formatting', 'Null, undefined, and empty string produce empty output', () => {
  expect(renderMarkdown('')).toBe('');
  expect(renderMarkdown(null)).toBe('');
  expect(renderMarkdown(undefined)).toBe('');
});

test('Formatting', 'Multiple blank lines collapse cleanly into single paragraph break', () => {
  const md = 'Paragraphe 1\n\n\n\n\nParagraphe 2';
  const out = renderMarkdown(md);
  expect(out).toBe('<p>Paragraphe 1</p><p>Paragraphe 2</p>');
});

/* ------------------------------------------------------------------
   5. MARKDOWN TABLES & EDGE CASES
   ------------------------------------------------------------------ */
console.log('\n5. Markdown Tables Stress Tests');

test('Tables', 'Standard table renders with wrapper and clinical-table class', () => {
  const md = '| DCI | Dose | Voie |\n|---|---|---|\n| Amoxicilline | 1 g | PO |\n| Ceftriaxone | 1 g | IV |';
  const out = renderMarkdown(md);
  expect(out).toContain('<div class="table-responsive-wrapper">');
  expect(out).toContain('<table class="clinical-table">');
  expect(out).toContain('<th>DCI</th>');
  expect(out).toContain('<td>Amoxicilline</td>');
});

test('Tables', 'Table with empty cells renders empty td without undefined', () => {
  const md = '| Col 1 | Col 2 | Col 3 |\n|---|---|---|\n| | Val 2 | |\n| Val 1 | | Val 3 |';
  const out = renderMarkdown(md);
  expect(out).toContain('<td></td>');
  expect(out).toContain('<td>Val 2</td>');
  expect(out).toNotContain('undefined');
});

test('Tables', 'Table with alignment colons |:---|:---:|---:| parses successfully', () => {
  const md = '| Gauche | Centre | Droite |\n|:---|:---:|---:|\n| G | C | D |';
  const out = renderMarkdown(md);
  expect(out).toContain('<table class="clinical-table">');
  expect(out).toContain('<td>G</td>');
});

test('Tables', 'Table cells with raw HTML entities are securely escaped inside td', () => {
  const md = '| Médicament | Risque |\n|---|---|\n| <script> | "danger" & mort |';
  const out = renderMarkdown(md);
  expect(out).toNotContain('<script>');
  expect(out).toContain('<td>&lt;script&gt;</td>');
  expect(out).toContain('<td>&quot;danger&quot; &amp; mort</td>');
});

test('Tables', 'Table with mismatched column counts does not throw', () => {
  const md = '| H1 | H2 |\n|---|---|\n| Seul |\n| 1 | 2 | 3 | 4 |';
  const out = renderMarkdown(md);
  expect(out).toContain('<td>Seul</td>');
  expect(out).toContain('<td>4</td>');
});

test('Tables', 'Table without surrounding blank lines (documents wrapper nesting in p)', () => {
  const md = 'Avant table\n| A | B |\n|---|---|\n| 1 | 2 |\nAprès table';
  const out = renderMarkdown(md);
  expect(out).toContain('<table class="clinical-table">');
  // Empirical observation: absence of \n\n causes table block to be wrapped within <p>
  expect(out).toContain('<p>Avant table<br><div class="table-responsive-wrapper">');
});

/* ------------------------------------------------------------------
   6. CLINICAL FORMULAS & MATH DELIMITERS
   ------------------------------------------------------------------ */
console.log('\n6. Clinical Formulas & Math Delimiters Stress Tests');

test('Math', 'Display math $$ ... $$ transforms LaTeX commands and renders math-display div', () => {
  const md = '$$\\text{ClCr} = \\frac{(140 - \\text{Âge}) \\times \\text{Poids}}{0{,}814 \\times \\text{Créat}}$$';
  const out = renderMarkdown(md);
  expect(out).toContain('<div class="math-display">');
  expect(out).toContain('📐 ClCr = \\frac{(140 - Âge) × Poids}{0{,}814 × Créat}</div>');
  expect(out).toNotContain('\\text{');
  expect(out).toNotContain('\\times');
});

test('Math', 'Inline math $ ... $ transforms into span.math-inline', () => {
  const md = 'Le calcul $ \\text{IMC} = \\frac{P}{T^2} $ est requis.';
  const out = renderMarkdown(md);
  expect(out).toContain('<span class="math-inline">IMC = \\frac{P}{T^2}</span>');
});

test('Math', 'Unbalanced single dollar sign trims formula and preserves surrounding text', () => {
  const md = 'Coût estimé : $50 par jour et $100 par cure';
  const out = renderMarkdown(md);
  expect(out).toContain('<span class="math-inline">50 par jour et</span>');
  expect(out).toContain('100 par cure');
});

test('Math', 'Single unclosed dollar sign remains plain text', () => {
  const md = 'Formule avec un seul dollar $ non fermé';
  const out = renderMarkdown(md);
  expect(out).toContain('$ non fermé');
  expect(out).toNotContain('<span class="math-inline">');
});

test('Math', 'Unclosed display math $$ remains plain text without crashing', () => {
  const md = '$$ Formule non fermée';
  const out = renderMarkdown(md);
  expect(out).toContain('$$ Formule non fermée');
  expect(out).toNotContain('<div class="math-display">');
});

test('Math', 'Math containing HTML special characters is escaped', () => {
  const md = '$$ \\text{Dose} < 5 \\text{ mg} \\& > 2 \\text{ mg} $$';
  const out = renderMarkdown(md);
  expect(out).toContain('&lt;');
  expect(out).toContain('&gt;');
  expect(out).toContain('&amp;');
});

/* ------------------------------------------------------------------
   7. FULL MEDICAL CORPUS AUDIT (51 CHAPTERS + 33 FICHES + 78 DCI)
   ------------------------------------------------------------------ */
console.log('\n7. Full Medical Corpus Audit');

test('Corpus', 'All 51 General Medicine chapters exist and have valid structure', () => {
  expect(gen.chapters.length).toBe(51);
  gen.chapters.forEach(ch => {
    expect(ch.num !== undefined && ch.num !== null).toBeTruthy();
    expect(ch.title).toBeTruthy();
    expect(ch.content).toBeTruthy();
  });
});

test('Corpus', 'All 33 Geriatrics practical fiches exist and have valid structure (num 0 to 32)', () => {
  expect(ger.fiches.length).toBe(33);
  ger.fiches.forEach(fi => {
    expect(fi.num !== undefined && fi.num !== null).toBeTruthy();
    expect(fi.title).toBeTruthy();
    expect(fi.content).toBeTruthy();
  });
});

test('Corpus', 'All 51 chapters render cleanly with zero raw <p>---</p>', () => {
  gen.chapters.forEach(ch => {
    const rendered = renderMarkdown(ch.content);
    if (rendered.includes('<p>---</p>') || rendered.includes('<p>----</p>')) {
      throw new Error(`Chapter ${ch.num} produced raw <p>---</p>`);
    }
  });
});

test('Corpus', 'All 33 fiches render cleanly with zero raw <p>---</p>', () => {
  ger.fiches.forEach(fi => {
    const rendered = renderMarkdown(fi.content);
    if (rendered.includes('<p>---</p>') || rendered.includes('<p>----</p>')) {
      throw new Error(`Fiche ${fi.num} produced raw <p>---</p>`);
    }
  });
});

test('Corpus', 'Zero residual uninterpreted LaTeX in all 51 chapters', () => {
  const residualLatex = ['\\text{', '\\mathbf{', '\\times', '\\approx', '\\longrightarrow'];
  gen.chapters.forEach(ch => {
    const rendered = renderMarkdown(ch.content);
    residualLatex.forEach(cmd => {
      if (rendered.includes(cmd)) {
        throw new Error(`Chapter ${ch.num} contains residual LaTeX: ${cmd}`);
      }
    });
  });
});

test('Corpus', 'Zero raw entity artifacts like &lt;br&gt; in all 33 fiches', () => {
  ger.fiches.forEach(fi => {
    const rendered = renderMarkdown(fi.content);
    if (rendered.includes('&lt;br&gt;')) {
      throw new Error(`Fiche ${fi.num} contains raw entity &lt;br&gt;`);
    }
  });
});

test('Corpus', 'Zero invalid paragraph tags containing block elements across all chapters & fiches', () => {
  const pRegex = /<p>([\s\S]*?)<\/p>/gi;
  const blockRegex = /<(div|table|thead|tbody|tr|th|td|hr|ul|ol|h[1-6]|blockquote)/i;
  
  gen.chapters.forEach(ch => {
    const rendered = renderMarkdown(ch.content);
    let match;
    while ((match = pRegex.exec(rendered)) !== null) {
      const blockMatch = match[1].match(blockRegex);
      if (blockMatch) {
        throw new Error(`Chapter ${ch.num} has invalid block element <${blockMatch[1]}> inside <p>!`);
      }
    }
  });

  ger.fiches.forEach(fi => {
    const rendered = renderMarkdown(fi.content);
    let match;
    while ((match = pRegex.exec(rendered)) !== null) {
      const blockMatch = match[1].match(blockRegex);
      if (blockMatch) {
        throw new Error(`Fiche ${fi.num} has invalid block element <${blockMatch[1]}> inside <p>!`);
      }
    }
  });
});

test('Corpus', 'Fiche 31 STOPP/START v3 table is complete and covers all 6 organ systems', () => {
  const f31 = ger.fiches.find(f => f.num === 31);
  const rendered = renderMarkdown(f31.content);
  expect(rendered).toContain('<table class="clinical-table">');
  const rowCount = (rendered.match(/<tr>/g) || []).length;
  expect(rowCount).toBe(23); // 1 header + 22 criteria
  const requiredSystems = [
    'Cardiovasculaire',
    'Système Nerveux Central',
    'Gastro-intestinal',
    'Musculo-squelettique',
    'Endocrinien &amp; Métabolisme',
    'Néphrologie &amp; Urologie'
  ];
  requiredSystems.forEach(sys => expect(rendered).toContain(sys));
});

test('Corpus', 'Chapter XXXVI WHO AWaRe categorization badges are exact', () => {
  const ch36 = gen.chapters.find(c => c.num === 'XXXVI');
  const rendered = renderMarkdown(ch36.content);
  const accessCount = (rendered.match(/badge-access/g) || []).length;
  const watchCount = (rendered.match(/badge-watch/g) || []).length;
  const reserveCount = (rendered.match(/badge-reserve/g) || []).length;
  expect(accessCount).toBe(8);
  expect(watchCount).toBe(3);
  expect(reserveCount).toBe(1);
  expect(rendered).toContain('Pivmécillinam');
  expect(rendered).toContain('Cotrimoxazole');
});

test('Corpus', 'DRUGS_DATA contains 78 molecules with complete 11-attribute schema', () => {
  expect(drugs.length).toBe(78);
  const requiredKeys = ['dci', 'class', 'indication', 'dosage', 'precautions', 'renalAdaptation', 'renalNote', 'geriatricRisk', 'aware', 'stoppBeers', 'manuals'];
  drugs.forEach((d, idx) => {
    requiredKeys.forEach(k => {
      if (!(k in d)) {
        throw new Error(`Missing key ${k} in drug ${idx} (${d.dci})`);
      }
    });
  });
});

test('Corpus', 'DCI database has exact WHO AWaRe (12) and STOPP/Beers (42) counts', () => {
  const awareCount = drugs.filter(d => d.aware !== null).length;
  const stoppCount = drugs.filter(d => d.stoppBeers !== null).length;
  expect(awareCount).toBe(12);
  expect(stoppCount).toBe(42);
});

/* ------------------------------------------------------------------
   SUMMARY & VERDICT
   ------------------------------------------------------------------ */
console.log('\n================================================================');
console.log(`TOTAL TESTS: ${totalTests}`);
console.log(`PASSED:      ${passedTests}`);
console.log(`FAILED:      ${failedTests}`);
console.log('================================================================');

if (failedTests > 0) {
  console.error('\nFAILURE DETAILS:');
  failures.forEach(f => console.error(`- [${f.category}] ${f.name}: ${f.error}`));
  process.exit(1);
} else {
  console.log('\nALL ADVERSARIAL AND CORPUS STRESS TESTS PASSED EMPIRICALLY!');
  process.exit(0);
}
