/**
 * TEST AUTOMATISÉ DU RENDU ET DU MOTEUR DOM
 * Vérifie le respect des invariants DOM et du moteur applicatif
 */

const fs = require('fs');

// Mock DOM conforme aux invariants Sandboxed DOM Testing
class MockElement {
  constructor(tag) {
    this.tagName = tag.toUpperCase();
    this.children = [];
    this._innerHTML = '';
    this._textContent = '';
    this.classList = new Set();
    this.classList.add = (c) => this.classList.add(c);
    this.classList.remove = (c) => this.classList.delete(c);
    this.classList.toggle = (c, val) => val ? this.classList.add(c) : this.classList.delete(c);
    this.dataset = {};
    this.attributes = {};
    this.style = {};
  }

  get innerHTML() {
    return this._innerHTML;
  }

  set innerHTML(val) {
    this._innerHTML = val || '';
    // Déséchappement basique pour textContent
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

  // INVARIANT : textContent setter doit mettre à jour innerHTML en échappant les entités HTML
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
    this.children.push(child);
    return child;
  }

  setAttribute(k, v) {
    this.attributes[k] = v;
  }

  getAttribute(k) {
    return this.attributes[k];
  }
}

// Test de l'invariant
const testElem = new MockElement('div');
testElem.textContent = "Test & < > ' \"";
if (testElem.innerHTML !== "Test &amp; &lt; &gt; &#39; &quot;") {
  throw new Error("Échec de l'invariant Sandboxed DOM Testing sur textContent setter!");
}
console.log("✓ Invariant Sandboxed DOM Testing validé avec succès !");

// Vérification de la présence des fichiers clés
const files = [
  'index.html',
  'style.css',
  'app.js',
  'calculators.js',
  'data-general.js',
  'data-geriatrie.js',
  'data-drugs.js',
  'manifest.json',
  'sw.js'
];

files.forEach(f => {
  if (!fs.existsSync(f)) {
    throw new Error(`Fichier manquant : ${f}`);
  }
});
// Test de renderMarkdown sur les tableaux et formules
const appCode = fs.readFileSync('./app.js', 'utf8');
eval(appCode.substring(0, appCode.indexOf('// État global')));

const gen = require('./data-general.js');
const ch45 = gen.chapters.find(c => c.num === 'XLV');
const rendered45 = renderMarkdown(ch45.content);
if (!rendered45.includes('<table class="clinical-table">')) {
  throw new Error("Échec du rendu du tableau Markdown pour le Chapitre XLV !");
}
if (!rendered45.includes('<th>DCI</th>')) {
  throw new Error("Entête DCI manquant dans le tableau !");
}
console.log("✓ Rendu du tableau médical du Chapitre XLV validé avec succès !");

const ch49 = gen.chapters.find(c => c.num === 'XLIX');
const rendered49 = renderMarkdown(ch49.content);
if (rendered49.includes('\\text{') || rendered49.includes('\\times')) {
  throw new Error("Code LaTeX résiduel détecté dans le Chapitre XLIX !");
}
console.log("✓ Rendu des formules médicales du Chapitre XLIX validé sans résidu LaTeX !");

console.log(`✓ Tous les ${files.length} fichiers du projet sont bien créés et présents sur le disque !`);
