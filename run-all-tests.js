/**
 * Lance toutes les suites de tests du dépôt TRIMOBE.
 * Code de sortie non-nul si une suite échoue.
 */
const { spawnSync } = require('child_process');
const path = require('path');

const ROOT = __dirname;
const suites = [
  'test-suite.js',
  'test-dom.js',
  'test-m1-adversarial.js',
  'test_challenger_m3_search.js'
];

let failed = 0;
for (const suite of suites) {
  console.log(`\n========== ${suite} ==========`);
  const res = spawnSync(process.execPath, [path.join(ROOT, suite)], {
    stdio: 'inherit',
    cwd: ROOT
  });
  if (res.status !== 0) {
    failed += 1;
    console.error(`✗ Échec : ${suite} (code ${res.status})`);
  } else {
    console.log(`✓ Succès : ${suite}`);
  }
}

console.log('\n========== BILAN ==========');
if (failed === 0) {
  console.log(`✓ Toutes les suites sont passées (${suites.length}/${suites.length}).`);
  process.exit(0);
} else {
  console.error(`✗ ${failed} suite(s) en échec sur ${suites.length}.`);
  process.exit(1);
}
