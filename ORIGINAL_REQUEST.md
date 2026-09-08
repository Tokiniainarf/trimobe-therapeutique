# Original User Request

## Initial Request — 2026-09-08T18:24:19Z

# Teamwork Project Prompt — Final Draft

Audit exhaustif et correction intégrale de tous les bugs techniques, incohérences de contenu médical, failles de calcul et défauts d'ergonomie sur la plateforme web clinique des Manuels de Thérapeutique Clinique et Gériatrie (Collection TRIMOBE & UMSP).

Working directory: C:\Users\tokin\.gemini\antigravity\scratch\trimobe-therapeutique-app
Integrity mode: development

## Requirements

### R1. Audit du Contenu Médical et Élimination des Incohérences
Passer au crible l'ensemble des 51 chapitres de Médecine Générale, des 33 fiches de Gériatrie et de la base des DCI pour garantir la stricte exactitude clinique (posologies, contre-indications, seuils biologiques, signes d'alarme, classifications OMS AWaRe, recommandations gériatriques STOPP/START et Beers 2023). Éliminer toute contradiction ou coquille résiduelle.

### R2. Résilience et Précision Absolue des Calculateurs Cliniques
Tester et sécuriser tous les calculateurs interactifs (posologie pédiatrique, clairance Cockcroft-Gault, score CRB-65, déficit en eau libre, conversions glycémiques) contre tous les cas limites (edge cases) : entrées nulles, négatives, non numériques, valeurs aberrantes, et vérifier le déclenchement fidèle des alertes cliniques associées.

### R3. Fiabilité Fonctionnelle et Ergonomie Multi-Plateforme
S'assurer du bon fonctionnement de l'ensemble des fonctionnalités interactives : recherche universelle (Ctrl + K), filtres DCI, gestion des favoris locaux (localStorage), check-list interactive, bascule de mode sombre/clair, et mise en page responsive sur mobile et tablette.

### R4. Validation Automatisée et Déploiement Continu
Valider chaque correction via une suite de tests automatisés (vérification des données, calculs et respect des invariants DOM), puis versionner et déployer automatiquement les modifications sur le dépôt Git et GitHub Pages.

## Acceptance Criteria

### Exactitude & Rendu Médical
- [ ] 100% des chapitres et fiches affichent des textes et formules nets, sans aucun résidu de code source ou balise non interprétée
- [ ] Toutes les posologies et unités sont rigoureusement homogènes et conformes aux références
- [ ] Le tableau des DCI correspond parfaitement aux données des chapitres et fiches

### Robustesse des Calculateurs
- [ ] Tout calcul avec saisie invalide (texte, nombre négatif, champ vide) affiche un message d'erreur clair sans lever d'exception non gérée
- [ ] Les seuils d'alerte (insuffisance rénale sévère, sarcopénie, risque élevé de pneumonie) sont validés par des tests automatisés

### Zéro Régression & Déploiement
- [ ] Aucune erreur ni avertissement critique dans la console du navigateur
- [ ] Tous les tests unitaires et d'invariants DOM s'exécutent avec succès (code 0)
- [ ] La version en ligne sur GitHub Pages (https://tokiniainarf.github.io/trimobe-therapeutique/) est synchronisée et accessible
