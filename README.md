# TRIMOBE & UMSP — Thérapeutique Clinique & Gériatrie 2026

PWA hors-ligne de référence pour la **médecine générale** (52 chapitres) et la **gériatrie** (33 fiches), avec répertoire DCI, calculateurs cliniques, check-list d’ordonnance et recherche universelle.

**Collection TRIMOBE.org & UMSP** — Document pédagogique FMC destiné aux médecins.

## Démarrage rapide

```bash
# Python (recommandé)
python -m http.server 8080
# puis ouvrir http://localhost:8080

# Windows
launch.bat

# npm
npm start
```

Installer comme application : ouvrir dans Chrome/Edge → bouton **Installer**.

## Tests

```bash
npm test
# ou
node run-all-tests.js
```

Suites isolées :

| Commande | Couverture |
|---|---|
| `node test-suite.js` | 114 tests E2E (calculateurs, recherche, favoris, scénarios cliniques) |
| `node test-dom.js` | Invariants DOM + rendu Markdown chapitres XLV / XLIX |
| `node test-m1-adversarial.js` | Intégrité contenu médical / alignement DCI |
| `node test_challenger_m3_search.js` | Recherche, filtres AWaRe, scoring |

## Architecture

```
index.html        Shell UI (sidebar, navbar, modale Ctrl+K)
style.css         Design system (light/dark)
app.js            Moteur applicatif (navigation, Markdown, vues)
calculators.js    6 calculateurs cliniques (pédiatrie, Cockcroft, CRB-65…)
data-general.js   52 chapitres de médecine générale
data-geriatrie.js 33 fiches de gériatrie
data-drugs.js     Répertoire DCI (AWaRe, STOPP/Beers, adaptation rénale)
sw.js             Service Worker (network-first + cache offline)
manifest.json     PWA
icons/icon.svg    Icône applicative
```

## Fonctionnalités

- Lecture des 2 manuels avec fil d’Ariane et bascule Général ↔ Gériatrie
- Recherche universelle `Ctrl + K` (chapitres + fiches + DCI)
- Filtres DCI : texte, adaptation rénale, risque gériatrique, classe AWaRe
- Calculateurs : posologie pédiatrique, Cockcroft-Gault, CRB-65, déficit en eau libre, glycémie, HbA1c
- Favoris et check-list d’ordonnance (localStorage sécurisé)
- Mode sombre / clair, taille de police, impression de fiche
- 100 % hors-ligne après installation (network-first pour garder le contenu à jour)

## Déploiement GitHub Pages

1. Settings → Pages → Source `main` / racine du dépôt
2. Le fichier `.nojekyll` est déjà présent
3. URL : `https://tokiniainarf.github.io/trimobe-therapeutique/`

## Avertissement médical

Document pédagogique. Toute prescription relève de la responsabilité du médecin prescripteur selon les caractéristiques propres à chaque patient.
