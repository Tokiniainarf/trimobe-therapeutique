/**
 * MANUEL DE THÉRAPEUTIQUE CLINIQUE
 * Médecine générale et soins de première ligne
 * Édition Septembre 2026 - Collection TRIMOBE - Fiches Pratiques de FMC
 * En partenariat avec l'Union des Médecins du Secteur Privé (UMSP)
 * 
 * Coordination scientifique : Dr Eric Naivolala ANDRIANASOLO
 * Webmaster : Dr Miora Tantely RAKOTOARISON
 * Direction Association TRIMOBE : Dr Elisette ANDRIANANJA
 * Direction UMSP : Dr HERY Andrianandrasana Rakotovao
 */

const GENERAL_MANUAL_DATA = {
  id: "general",
  title: "Manuel de Thérapeutique Clinique",
  subtitle: "Médecine générale et soins de première ligne",
  badge: "FMC & Soins de 1ère ligne",
  edition: "Septembre 2026",
  organizations: [
    { name: "Association TRIMOBE.org", president: "Dr Elisette ANDRIANANJA" },
    { name: "Union des Médecins du Secteur Privé (UMSP)", president: "Dr HERY Andrianandrasana Rakotovao" }
  ],
  scientificCoordination: "Dr Eric Naivolala ANDRIANASOLO",
  webmaster: "Dr Miora Tantely RAKOTOARISON",
  preface: `La thérapeutique clinique exige une démarche médicale complète, fondée sur l'évaluation du patient, l'analyse du rapport bénéfice-risque et la réévaluation régulière de la réponse au traitement. Elle ne peut être réduite à l'application mécanique d'une posologie ou d'un algorithme.

Le présent Manuel de thérapeutique clinique – Médecine générale et soins de première ligne est proposé comme un support synthétique de Formation Médicale Continue et comme une aide pratique à la réflexion clinique et à la prescription. Il rassemble des rappels concernant des situations fréquemment rencontrées en médecine générale et en soins de première ligne.

Ce document est strictement réservé aux médecins. Il ne constitue ni une ordonnance, ni un protocole opposable, ni un substitut à l'examen clinique, aux ouvrages spécialisés, aux résumés des caractéristiques du produit, aux recommandations nationales ou internationales, ni à l'avis d'un spécialiste lorsque celui-ci est nécessaire.

Les doses, durées et stratégies thérapeutiques mentionnées sont des repères généraux. Elles doivent être vérifiées et adaptées selon :
• l'indication exacte et le diagnostic retenu ;
• l'âge, le poids et la fragilité du patient ;
• la fonction rénale et hépatique ;
• la grossesse ou l'allaitement ;
• les allergies et les antécédents ;
• les interactions médicamenteuses ;
• les résistances bactériennes locales ;
• les recommandations nationales en vigueur ;
• les présentations pharmaceutiques disponibles ;
• l'évolution clinique et les résultats biologiques ou radiologiques.`,
  warning: `Une attention particulière doit être portée aux médicaments à risque élevé, notamment les anticoagulants, l'insuline, les opioïdes, les psychotropes, les antiarythmiques, la digoxine, le lithium, les corticostéroïdes et les médicaments à marge thérapeutique étroite.

Les recommandations médicales évoluent. Les références citées dans ce manuel doivent être régulièrement actualisées, en particulier dans les domaines du diabète, de l'hypertension artérielle, de l'asthme, de l'antibiothérapie, de l'insuffisance cardiaque, des anticoagulants et des maladies infectieuses.

La rédaction finale de ce manuel a bénéficié de l'assistance d'un outil d'intelligence artificielle générative sous la supervision des auteurs.

Des erreurs, omissions, imprécisions ou coquilles peuvent subsister malgré les vérifications effectuées. L'Association TRIMOBE.org, l'Union des Médecins du Secteur Privé, les auteurs et les contributeurs déclinent toute responsabilité quant aux conséquences d'une utilisation inappropriée ou non vérifiée de ce document. Toute prescription relève de la responsabilité du médecin prescripteur.`,
  
  categories: [
    { id: "methodologie", label: "Méthodologie & Bonnes Pratiques", icon: "📋" },
    { id: "cardiovasculaire", label: "Cardiovasculaire", icon: "❤️" },
    { id: "metabolisme", label: "Métabolisme & Endocrinologie", icon: "⚡" },
    { id: "pneumologie", label: "Pneumologie & ORL", icon: "🫁" },
    { id: "infectiologie", label: "Infectiologie", icon: "🛡️" },
    { id: "gastroenterologie", label: "Gastro-entérologie", icon: "🍽️" },
    { id: "rhumatologie", label: "Rhumatologie & Douleur", icon: "🦴" },
    { id: "neurologie", label: "Neurologie & Céphalées", icon: "🧠" },
    { id: "dermatologie", label: "Dermatologie & Allergologie", icon: "✨" },
    { id: "terrains", label: "Populations & Terrains Spécifiques", icon: "👥" },
    { id: "urgences", label: "Urgences & Synthèses Rapides", icon: "🚨" }
  ],

  chapters: [
    {
      num: "I",
      category: "methodologie",
      title: "Principes de prescription rationnelle",
      isUrgent: false,
      summary: "Démarche diagnostique, évaluation globale et règles fondamentales avant toute rédaction d'ordonnance.",
      content: `### Avant de prescrire :
- Établir le diagnostic ou une probabilité diagnostique suffisante ;
- Rechercher les signes de gravité ;
- Vérifier les allergies ;
- Connaître les traitements déjà pris ;
- Rechercher les interactions ;
- Tenir compte de l'âge et du poids ;
- Évaluer la fonction rénale lorsque nécessaire ;
- Évaluer la fonction hépatique lorsque nécessaire ;
- Rechercher une grossesse lorsque pertinente ;
- Définir l'objectif thérapeutique ;
- Préciser la durée ;
- Prévoir la surveillance et la réévaluation [1][2].

### Une ordonnance doit préciser :
**DCI – dosage – forme – voie – fréquence – durée – consignes particulières.**

### À éviter absolument :
- La polymédication inutile ;
- Les associations sans justification ;
- Les antibiotiques pour les infections probablement virales ;
- Les traitements prolongés sans réévaluation ;
- Les médicaments dont le bénéfice n'est pas démontré.

> **Principe fondamental :** Le bon traitement est celui qui apporte le meilleur rapport bénéfice-risque au patient considéré. Le choix d'un médicament doit tenir compte du bénéfice attendu, des risques individuels, des alternatives disponibles et du contexte du patient.`
    },
    {
      num: "II",
      category: "cardiovasculaire",
      title: "Hypertension artérielle",
      isUrgent: false,
      summary: "Seuil diagnostic (≥140/90 mmHg), bilan, mesures hygiéno-diététiques, monothérapies et bithérapies usuelles.",
      content: `### Diagnostic
Une pression artérielle supérieure ou égale à **140/90 mmHg** en consultation correspond au seuil classique de définition de l'hypertension artérielle chez l'adulte.
Le diagnostic doit être confirmé par des mesures répétées lorsque la situation clinique le permet. Une mesure ambulatoire (MAPA) ou une automesure peut être utile dans certaines situations [3][4].

### Bilan & Facteurs à rechercher :
- Diabète ;
- Dyslipidémie ;
- Tabagisme ;
- Maladie rénale ;
- Antécédent cardiovasculaire ;
- Atteinte d'organe cible ;
- Apnée obstructive du sommeil lorsque le contexte est évocateur.

### Mesures non médicamenteuses (RHD) :
- Réduction de l'apport sodé (sel) ;
- Alimentation équilibrée (type DASH / méditerranéen) ;
- Activité physique régulière ;
- Réduction du surpoids lorsque nécessaire ;
- Arrêt total du tabac ;
- Limitation stricte de l'alcool ;
- Amélioration de la qualité du sommeil.

### Traitements usuels
- **Amlodipine** : 5 mg par voie orale, une fois par jour. Possibilité d'augmenter à 10 mg par jour selon la réponse et la tolérance.  
  *Surveillance :* pression artérielle, œdèmes des membres inférieurs, hypotension.
- **Périndopril** : 5 mg par voie orale, une fois par jour au départ dans de nombreuses situations. Adaptation progressive selon la pression artérielle, la fonction rénale, la kaliémie et la tolérance.
- **Losartan** : 50 mg par voie orale, une fois par jour. Possibilité d'augmenter à 100 mg par jour selon l'indication et la réponse. Surveiller créatinine et kaliémie.
- **Hydrochlorothiazide** : 12,5 à 25 mg par jour selon l'indication. Surveiller natrémie, kaliémie, fonction rénale et acide urique.

### Associations (bithérapie d'emblée)
Associations fréquemment recommandées :
- **IEC ou ARA2 + inhibiteur calcique**
- **IEC ou ARA2 + diurétique thiazidique ou apparenté**

⚠️ **Contre-indication formelle :** Ne jamais associer un IEC et un ARA2.

### 🚨 Urgence hypertensive
Une pression artérielle très élevée associée à l'un des signes suivants définit une urgence hypertensive :
- Douleur thoracique constrictive ;
- Dyspnée aiguë ;
- Déficit neurologique focal ;
- Confusion ou encéphalopathie ;
- Trouble visuel aigu ;
- Œdème aigu du poumon ;
- Insuffisance rénale aiguë.  
*Nécessite une prise en charge et un transfert d'urgence en milieu hospitalier adapté.*`
    },
    {
      num: "III",
      category: "metabolisme",
      title: "Diabète de type 2",
      isUrgent: false,
      summary: "Bilan initial, cibles d'HbA1c individualisées, Metformine, inhibiteurs de SGLT2, DPP-4, sulfamides et insuline.",
      content: `### Bilan initial
Le bilan initial comprend notamment :
- Glycémie veineuse à jeun ;
- HbA1c ;
- Créatinine et estimation du DFG (CKD-EPI) ;
- Albuminurie (ou rapport albuminurie/créatininurie) selon le contexte ;
- Bilan lipidique complet ;
- Pression artérielle ;
- Poids, taille et IMC ;
- Examen complet des pieds (palpation pouls, monofilament) ;
- Recherche de complications microvasculaires et cardiovasculaires [5][6].

### Objectifs glycémiques
Chez de nombreux adultes, l'objectif d'**HbA1c est proche de 7%**, mais il doit être individualisé selon l'âge, la durée d'évolution du diabète, les comorbidités, le risque d'hypoglycémie, l'espérance de vie et les préférences du patient.

### Traitements pharmacologiques
- **Metformine** :
  - *Début :* 500 mg une à deux fois par jour au cours des repas.
  - *Titration :* Augmentation progressive selon la tolérance digestive.
  - *Dose usuelle :* 1 500 à 2 000 mg par jour selon la formulation.
  - *Vigilance :* Adapter à la fonction rénale. Suspendre temporairement en cas de déshydratation aiguë, hypoxie, injection de produit de contraste iodé ou insuffisance rénale aiguë (risque d'acidose lactique).
- **Dapagliflozine** : 10 mg une fois par jour dans les indications appropriées. Intérêt majeur dans certaines situations d'insuffisance cardiaque ou de maladie rénale chronique, indépendamment de l'effet glycémique [5].  
  *Vigilance :* Déshydratation, hypotension, mycoses génitales, acidocétose euglycémique rare.
- **Empagliflozine** : 10 mg une fois par jour (dose de 25 mg/j possible dans certaines indications selon DFG).
- **Sitagliptine** : 100 mg une fois par jour si fonction rénale normale (adapter la posologie selon le DFG).
- **Gliclazide à libération prolongée (LP)** : Début à 30 mg/j le matin. Titration progressive.  
  *Risque principal :* Hypoglycémie, particulièrement chez la personne âgée, dénutrie ou insuffisante rénale.
- **Insuline basale** :
  - Environ **0,1 à 0,2 UI/kg/jour** comme dose initiale dans de nombreuses situations. Titration progressive guidée par les glycémies à jeun.
  - *Indications d'insulinothérapie urgente :* hyperglycémie majeure symptomatique, cétose, amaigrissement/catabolisme rapide, décompensation métabolique, suspicion de diabète de type 1.`
    },
    {
      num: "IV",
      category: "metabolisme",
      title: "Hypoglycémie",
      isUrgent: true,
      summary: "Définition (<0,70 g/L), protocole de resucrage (règle des 15 g) et prise en charge urgente du patient inconscient.",
      content: `### Définition
L'hypoglycémie est généralement définie par une glycémie capillaire ou veineuse **inférieure à 0,70 g/L** (soit **3,9 mmol/L** ou 70 mg/dL).

### 🟢 Patient conscient
1. Administrer immédiatement environ **15 g de glucides rapidement absorbés** :
   - 3 morceaux de sucre standard numéro 4, ou
   - 150 mL de jus de fruit standard ou soda non édulcoré, ou
   - 1 cuillère à soupe de miel ou confiture.
2. Contrôler la glycémie capillaire après **15 minutes**.
3. Si l'hypoglycémie persiste (< 0,70 g/L), répéter l'administration de 15 g de glucides.
4. Après correction, prévoir une collation ou un repas contenant des glucides lents si le prochain repas principal est éloigné de plus d'une heure.

### 🔴 Patient inconscient (Urgence Vitale)
- **Ne rien donner par voie orale** (risque d'inhalation bronchique).
- Prise en charge urgente :
  - **Glucose intraveineux à 30%** (ex: 2 à 3 ampoules de G30% en IV lente) ou
  - **Glucagon 1 mg** en injection intramusculaire ou sous-cutanée (selon disponibilité et contexte).
- Réévaluer la glycémie, rechercher la cause du surdosage (sulfamides, insuline, repas sauté, insuffisance rénale).`
    },
    {
      num: "V",
      category: "pneumologie",
      title: "Asthme",
      isUrgent: false,
      summary: "Contrôle de fond avec corticoïdes inhalés, bronchodilatateurs de secours, exacerbation et critères d'urgence.",
      content: `### Principes de fond
Le traitement de fond de l'asthme doit impérativement intégrer un **corticostéroïde inhalé (CSI)** lorsque cela est indiqué.  
⚠️ **Le salbutamol seul ne constitue pas une stratégie de fond suffisante** [7].

### Traitement de secours
- **Salbutamol** : 100 µg par bouffée.
- Posologie : 1 à 2 bouffées selon le besoin et le dispositif inhalateur.
- *Remarque :* Une consommation fréquente ou croissante traduit un mauvais contrôle de l'asthme et impose de réévaluer le diagnostic, l'observance, la technique d'inhalation, l'environnement et le traitement de fond.

### Corticothérapie inhalée (exemples) :
- Béclométasone
- Budésonide
- Fluticasone
- Association budésonide / formotérol
*La posologie dépend du dispositif, de la sévérité et du palier thérapeutique.*

### Prise en charge de l'exacerbation
- Salbutamol inhalé (bouffées répétées avec chambre d'inhalation ou nébulisation selon gravité) ;
- Oxygène si hypoxémie (viser SpO2 93-95%) ;
- Corticothérapie systémique : **Prednisone 40 à 50 mg par jour** pendant 5 à 7 jours chez l'adulte.

### 🚨 Signes d'urgence et de gravité extrême :
- Incapacité à prononcer des phrases complètes (dyspnée parlante) ;
- Épuisement respiratoire, tirage intercostal et sus-claviculaire intense ;
- Cyanose, sueurs, tachycardie extrême ;
- Altération de la conscience ou somnolence ;
- Hypoxémie importante ;
- Silence auscultatoire (« thorax silencieux ») ou aggravation rapide malgré le traitement initial.`
    },
    {
      num: "VI",
      category: "pneumologie",
      title: "Bronchopneumopathie chronique obstructive (BPCO)",
      isUrgent: false,
      summary: "Bronchodilatateurs LAMA/LABA, non médicamenteux, gestion des exacerbations et corticothérapie courte.",
      content: `### Traitement symptomatique immédiat
- **Salbutamol** : 100 µg par bouffée, 1 à 2 bouffées selon le besoin.
- **Ipratropium** : selon le dispositif et la présentation.

### Traitement de fond
- Bronchodilatateur de longue durée d'action de type **LAMA** (anticholinergique de longue durée) ;
- **LABA** (bêta-2 agoniste de longue durée) selon la symptomatologie et les antécédents d'exacerbation ;
- Association **LAMA + LABA** lorsque nécessaire [8].

### Mesures non médicamenteuses capitales :
- **Sevrage tabagique complet et définitif** (priorité absolue) ;
- Vaccinations (grippe, pneumocoque, COVID-19) ;
- Activité physique régulière et réhabilitation respiratoire ;
- Éducation thérapeutique (technique d'inhalation).

### Exacerbation de BPCO
- **Prednisone** : 40 mg par jour pendant **5 jours** dans les schémas usuels.
- **Antibiothérapie** : uniquement si critères cliniques réunis (purulence des crachats type critères d'Anthonisen ou BPCO sévère).
- **Oxygénothérapie** : titrée selon la saturation (viser SpO2 88-92% pour éviter l'hypercapnie induite).`
    },
    {
      num: "VII",
      category: "pneumologie",
      title: "Rhinopharyngite aiguë",
      isUrgent: false,
      summary: "Origine virale prépondérante, mesures d'hygiène, lavage nasal, antalgie sans antibiothérapie systématique.",
      content: `### Diagnostic & Étiologie
La quasi-totalité des rhinopharyngites aiguës chez l'adulte et l'enfant sont d'origine **virale**.

### Conduite à tenir :
- Repos et hydratation abondante ;
- Lavage des fosses nasales au sérum physiologique régulier ;
- Traitement symptomatique de la congestion et des courbatures ;
- Information claire du patient sur l'évolution naturelle spontanément résolutive en 7 à 10 jours.

### Antalgique / Antipyrétique :
- **Paracétamol** : 500 à 1 000 mg par prise, espacé d'au moins 4 à 6 heures.
- Adapter la dose maximale journalière au poids, à l'âge, à la fonction hépatique, à l'état nutritionnel et à la consommation d'alcool.

⛔ **Règle formelle : Pas d'antibiothérapie systématique.**`
    },
    {
      num: "VIII",
      category: "pneumologie",
      title: "Angine",
      isUrgent: false,
      summary: "Score clinique / TDR, indication restreinte de l'antibiothérapie, posologie de l'Amoxicilline.",
      content: `### Évaluation clinique
- Évaluer la probabilité d'une étiologie à streptocoque bêta-hémolytique du groupe A (SGA) selon les scores cliniques (Mac Isaac / Centor).
- Utiliser un **test rapide d'orientation diagnostique (TDR)** lorsque celui-ci est disponible.

### Antibiothérapie (uniquement si TDR positif ou forte présomption documentée)
- **Amoxicilline** :
  - *Adulte :* 500 mg à 1 g deux fois par jour (ou 500 mg trois fois par jour) selon l'indication et le protocole local, pendant 6 jours.
  - *Enfant :* Dose calculée en mg/kg (généralement 50 mg/kg/j en 2 prises) adaptée à la présentation.
- *En cas d'allergie vraie aux pénicillines :* Choisir une alternative validée (céphalosporine orale si allergie non anaphylactique, ou macrolide selon les résistances locales).`
    },
    {
      num: "IX",
      category: "pneumologie",
      title: "Otite moyenne aiguë (OMA)",
      isUrgent: false,
      summary: "Examen otoscopique, antalgie prioritaire, critères d'antibiothérapie par Amoxicilline et réévaluation.",
      content: `### Évaluation clinique
L'examen doit rigoureusement prendre en compte :
- L'aspect otoscopique (tympan congestif vs tympan bombé / purulent) ;
- L'âge de l'enfant / patient ;
- L'intensité de la douleur otologique ;
- La fièvre et la tolérance générale ;
- La bilatéralité de l'atteinte ;
- La présence d'otorrhée spontanée.

### Prise en charge
- **Antalgie systématique** : Paracétamol adapté à l'âge et au poids.
- **Antibiothérapie si indiquée** (notamment nourrisson < 2 ans ou OMA purulente sévère) :
  - **Amoxicilline** à dose adaptée (80 à 90 mg/kg/j chez l'enfant en 2 à 3 prises).
  - Alternative en cas d'allergie selon les recommandations locales.
- **Réévaluation à 48-72h** en cas de persistance de la fièvre, aggravation ou complication (mastoïdite).`
    },
    {
      num: "X",
      category: "pneumologie",
      title: "Sinusite aiguë",
      isUrgent: false,
      summary: "Différenciation virale vs bactérienne, traitement symptomatique et place d'Amoxicilline/acide clavulanique.",
      content: `### Conduite initiale
La grande majorité des sinusites aiguës débutantes sont **virales** et accompagnent un rhume banal.

### Mesures symptomatiques :
- Hydratation suffisante ;
- Antalgiques simples (Paracétamol) ;
- Lavages réguliers au sérum physiologique ;
- Surveillance de l'évolution clinique.

### Quand envisager un antibiotique ?
- Persistance ou aggravation des symptômes au-delà de 7 à 10 jours ;
- Douleur unilatérale sous-orbitaire augmentée tête penchée en avant ;
- Écoulement purulent unilatéral ;
- Aggravation en deux temps (« rebond fébrile ») ;
- Signes de complication orbitaire ou méningée.
- *Molécule de référence :* **Amoxicilline/acide clavulanique** (ou Amoxicilline forte dose selon le terrain et l'écologie bactérienne locale).`
    },
    {
      num: "XI",
      category: "pneumologie",
      title: "Pneumonie communautaire",
      isUrgent: true,
      summary: "Scores de gravité (CRB-65), critères d'orientation hospitalière, antibiothérapie probabiliste et approche AWaRe.",
      content: `### Évaluation initiale & Gravité
Évaluer systématiquement :
- Fréquence respiratoire (tachypnée ≥ 30/min ?) ;
- Saturation pulsée en oxygène (SpO2 < 92% ?) ;
- Pression artérielle (PAS < 90 ou PAD ≤ 60 mmHg ?) ;
- État mental et vigilance (confusion ?) ;
- Température corporelle ;
- Tolérance digestive et capacité de prise orale ;
- Comorbidités associées et statut immunitaire ;
- Score clinique de gravité : **CRB-65**.

### 🚨 Critères d'hospitalisation urgente :
- Détresse respiratoire aiguë ou cyanose ;
- Hypoxémie non corrigée ;
- Instabilité hémodynamique, hypotension ou sepsis ;
- Confusion mentale aiguë ;
- Impossibilité de prise médicamenteuse orale ;
- Isolement social majeur ou terrain polypathologique fragile.

### Antibiothérapie ambulatoire
- **Amoxicilline** : 1 g 3 fois par jour chez l'adulte dans les pneumonies franches lobaires aiguës typiques (pneumocoque).
- Association à un macrolide ou switch selon le contexte épidémiologique, l'orientation clinique (atypique vs typique) et l'approche **OMS AWaRe** (priorité aux molécules Access).`
    },
    {
      num: "XII",
      category: "infectiologie",
      title: "Infection urinaire",
      isUrgent: false,
      summary: "Cystite aiguë simple (Fosfomycine 3g DU, Nitrofurantoïne) vs Pyélonéphrite aiguë (critères d'hospitalisation).",
      content: `### Cystite aiguë simple (femme non enceinte, sans comorbidité)
Symptômes évocateurs : dysurie, brûlures mictionnelles, pollakiurie, impériosité mictionnelle, SANS fièvre ni douleur lombaire.
- **Fosfomycine trométamol** : 3 g par voie orale en **dose unique** (1ère intention).
- **Nitrofurantoïne** : 100 mg par voie orale 2 fois par jour pendant 5 à 7 jours (selon DFG > 30-45 mL/min).
*NB : Ces molécules ne doivent jamais être utilisées pour traiter une pyélonéphrite.*

### Pyélonéphrite aiguë
Associe fièvre, frissons, lombalgie spontanée ou provoquée au choc costovertébral, avec ou sans signes urinaires.
- Réaliser systématiquement un **ECBU avec antibiogramme**.
- **Hospitalisation indispensable en cas de :**
  - Signes de sepsis ou instabilité hémodynamique ;
  - Obstruction urinaire ou suspicion de calcul (colique néphrétique fébrile = dérivation urgente) ;
  - Grossesse en cours ;
  - Insuffisance rénale sévère ou rein unique ;
  - Vomissements incoercibles ou intolérance digestive ;
  - Terrain fragile, immunodéprimé ou comorbidités sévères.`
    },
    {
      num: "XIII",
      category: "gastroenterologie",
      title: "Diarrhée aiguë",
      isUrgent: false,
      summary: "Réhydratation orale (SRO) essentielle, indications restreintes d'antibiothérapie et signaux d'alarme.",
      content: `### Prise en charge fondamentale : Réhydratation
Le traitement essentiel repose avant tout sur la **réhydratation précoce** :
- Utiliser les **solutions de réhydratation orale (SRO)** selon le degré de déshydratation ;
- Boissons abondantes fractionnées (eau, bouillons salés).

### Antibiothérapie : Non systématique
Les antibiotiques sont indiqués uniquement dans des situations ciblées :
- Syndrome dysentérique franc (selles glairo-sanglantes avec fièvre élevée) ;
- Contexte d'épidémie de choléra ;
- Infection bactérienne invasive documentée ;
- Terrain fragilisé : immunodépression sévère, drépanocytose, sujet très âgé ou nourrisson débilité.

### 🚨 Signes d'alarme nécessitant une orientation urgente :
- Signes de déshydratation sévère (pli cutané, hypotension, oligurie, sécheresse) ;
- Rectorragie ou rectorragies profuses ;
- Fièvre élevée mal tolérée ;
- Altération de la conscience ou prostration ;
- Douleur abdominale intense ou défense chirurgicale ;
- Vomissements incoercibles empêchant toute réhydratation orale ;
- Âges extrêmes de la vie.`
    },
    {
      num: "XIV",
      category: "gastroenterologie",
      title: "Reflux gastro-œsophagien (RGO)",
      isUrgent: false,
      summary: "Mesures hygiéno-diététiques, traitement par IPP (Oméprazole / Pantoprazole) et drapeaux rouges endoscopiques.",
      content: `### Mesures hygiéno-diététiques
- Éviter les repas trop copieux ou hyperlipidiques ;
- Attendre au moins 2 à 3 heures après le repas avant de se coucher ;
- Surélever la tête de lit (10 à 15 cm) en cas de régurgitations nocturnes ;
- Identifier et réduire les aliments déclenchants (café, alcool, épices, chocolat, boissons gazeuses) ;
- Réduire le surpoids ;
- Arrêt du tabac.

### Traitement médicamenteux
- **Oméprazole** : 20 mg une fois par jour (le matin à jeun).  
  *Durée initiale :* 4 à 8 semaines selon la sévérité et la réponse.
- **Pantoprazole** : 40 mg une fois par jour dans les formes sévères d'œsophagite ou non-répondeurs.

### 🚩 Signes d'alarme (imposant une endoscopie digestive haute) :
- **Dysphagie** (difficulté à avaler) ou odynophagie ;
- Anémie ferriprive ou saignement digestif extériorisé (hématémèse, méléna) ;
- Amaigrissement involontaire ;
- Vomissements persistants ;
- Âge > 50 ans avec apparition récente des symptômes.`
    },
    {
      num: "XV",
      category: "gastroenterologie",
      title: "Helicobacter pylori",
      isUrgent: false,
      summary: "Diagnostic moderne (test respiratoire, Ag fécal), éradication guidée et contrôle post-traitement.",
      content: `### Méthodes diagnostiques
- Test respiratoire à l'urée marquée au carbone 13 ;
- Recherche d'antigène fécal spécifique ;
- Biopsies gastriques lors d'une endoscopie œso-gastro-duodénale.

### Principes d'éradication
- Le protocole d'éradication doit respecter les recommandations actualisées, les antécédents de prises d'antibiotiques (macrolides) et les résistances bactériennes régionales [39].
- ⚠️ **Éviter les anciennes trithérapies empiriques** à base de clarithromycine prescrites à l'aveugle sans données sur les résistances.
- Privilégier les quadrithérapies actuelles (avec ou sans bismuth) selon le contexte.

### Contrôle d'éradication
- À réaliser obligatoirement à distance : **au moins 4 semaines** après la fin des antibiotiques et **au moins 2 semaines** après l'arrêt des IPP pour éviter les faux négatifs.`
    },
    {
      num: "XVI",
      category: "gastroenterologie",
      title: "Constipation",
      isUrgent: false,
      summary: "Règles hygiéno-diététiques, laxatifs osmotiques (Macrogol, Lactulose) et élimination des causes organiques.",
      content: `### Mesures hygiéno-diététiques de première intention
- Augmentation progressive des fibres alimentaires (fruits, légumes, céréales complètes) ;
- Hydratation quotidienne suffisante et régulière (1,5 à 2 L/jour) ;
- Maintien d'une activité physique régulière et marche ;
- Respect du réflexe gastro-colique (aller aux toilettes à heure fixe après les repas) ;
- Recherche et éviction des médicaments constipants (opioïdes, anticholinergiques, fer, inhibiteurs calciques).

### Traitements médicamenteux usuels
- **Macrogol (Polyéthylène glycol)** : 10 à 20 g par jour selon la réponse clinique (laxatif osmotique de référence).
- **Lactulose** : 15 à 30 mL par jour initialement, puis adapter.

### 🚩 Signes d'alarme (Drapeaux rouges) :
- Rectorragie ou présence de sang dans les selles ;
- Anémie inexpliquée ;
- Amaigrissement involontaire ;
- Début brutal ou modification récente inexpliquée du transit chez un sujet > 50 ans ;
- Masse abdominale ou rectale palpable ;
- Syndrome occlusif (arrêt des gaz et des matières, vomissements, météorisme).`
    },
    {
      num: "XVII",
      category: "rhumatologie",
      title: "Lombalgie commune",
      isUrgent: false,
      summary: "Recherche des drapeaux rouges, maintien impératif de l'activité, antalgie de courte durée et prudence AINS.",
      content: `### 🚩 Recherche des Drapeaux Rouges (Signes de gravité) :
- Déficit moteur neurologique focal (ex: pied tombant, déficit sciatique L5/S1 rapide) ;
- Syndrome de la queue de cheval : troubles sphinctériens récents (incontinence, rétention urinaire) et anesthésie en selle ;
- Fièvre, frissons ou syndrome infectieux (spondylodiscite) ;
- Antécédent de cancer connu ou altération majeure de l'état général (métastases osseuses) ;
- Notion de traumatisme important ou ostéoporose sévère (fracture/tassement vertébral) ;
- Douleur nocturne inflammatoire permanente ne cédant pas au repos.

### Prise en charge en l'absence de drapeau rouge :
- **Maintenir l'activité physique habituelle** dans les limites tolérables ;
- **Éviter impérativement l'alitement prolongé** ;
- Rassurer le patient sur le pronostic habituellement favorable ;
- Traitement antalgique : Paracétamol de 1ère intention.
- **Ibuprofène** : 200 à 400 mg par prise, jusqu'à 3 fois par jour pendant quelques jours uniquement.
- *Contre-indications strictes des AINS :* Insuffisance rénale, ulcère gastro-duodénal actif, anticoagulation efficace, insuffisance cardiaque sévère, déshydratation, 3e trimestre de la grossesse.`
    },
    {
      num: "XVIII",
      category: "rhumatologie",
      title: "Arthrose",
      isUrgent: false,
      summary: "Socle non pharmacologique (kiné, perte de poids, renforcement), AINS topiques et prudence AINS oraux.",
      content: `### Traitement de base (Non pharmacologique)
- Exercices physiques réguliers et adaptés (marche, cyclisme, natation) ;
- Renforcement musculaire ciblé (quadriceps dans la gonarthrose) ;
- Prise en charge kinésithérapique ;
- Réduction pondérale en cas de surcharge (chaque kilo perdu allège la pression articulaire) ;
- Aides techniques si besoin (canne de marche controlatérale, semelles orthopédiques).

### Traitement médicamenteux
- **AINS topiques** (gels/emplâtres) : particulièrement intéressants dans les arthroses superficielles (genou, doigts) avec une excellente tolérance systémique.
- **Paracétamol** : utile en appoint pour les poussées douloureuses légères à modérées.
- **AINS oraux** : à réserver aux poussées congestives, à la dose minimale efficace et pour la durée la plus courte possible, après évaluation préalable des risques digestif, cardiovasculaire et rénal.`
    },
    {
      num: "XIX",
      category: "rhumatologie",
      title: "Goutte",
      isUrgent: false,
      summary: "Traitement de la crise aiguë (AINS, Colchicine faible dose) et traitement hypo-uricémiant de fond (Allopurinol).",
      content: `### Prise en charge de la crise aiguë
- **AINS** (sauf contre-indication rénale ou digestive) ou
- **Colchicine** : schéma à faible dose privilégié (ex: 1 mg d'emblée puis 0,5 mg une heure après).  
  *Prudence :* adapter en cas d'insuffisance rénale ou hépatique et surveiller les interactions médicamenteuses (macrolides proscrits).
- Corticothérapie orale courte en alternative si contre-indication aux AINS et à la colchicine.
- Repos articulaire, application locale de glace.

### Traitement de fond hypo-uricémiant
- **Allopurinol** :
  - Débuter à faible dose (ex: 100 mg par jour, voire 50 mg si insuffisance rénale).
  - Titration progressive mensuelle guidée par l'uricémie.
  - Couvrir l'introduction par une faible dose de colchicine pendant plusieurs mois pour prévenir les crises induites par la dissolution des tophi.
- **Objectif thérapeutique :** Uricémie cible **< 360 µmol/L** (soit **6 mg/dL**), voire < 300 µmol/L (5 mg/dL) dans les formes tophacées sévères.`
    },
    {
      num: "XX",
      category: "neurologie",
      title: "Céphalée et migraine",
      isUrgent: false,
      summary: "Recherche des signes d'alarme (hémorragie méningée, artérite temporale), crise migraineuse et Triptans.",
      content: `### 🚩 Recherche des signes d'alarme :
- Début brutal en « coup de tonnerre » (céphalée explosive = suspicion d'hémorragie sous-arachnoïdienne) ;
- Déficit neurologique focal associé ;
- Fièvre et syndrome méningé (raideur de nuque, vomissements en jet) ;
- Trouble de la vigilance ou confusion ;
- Céphalée post-traumatique récente ;
- Nouvelle céphalée inhabituelle après 50 ans (rechercher maladie de Horton / artérite temporale) ;
- Terrain d'immunodépression ou antécédent de néoplasie ;
- Céphalée progressive s'aggravant sur plusieurs semaines avec œdème papillaire.

### Traitement de crise de la migraine :
- **Paracétamol** : 500 à 1 000 mg (souvent insuffisant seul) ;
- **AINS** (ex: Ibuprofène 400 mg) pris précocement dès le début de la céphalée ;
- **Sumatriptan** : 50 mg par voie orale au début de la crise (spécifique de la crise migraineuse).  
  *Contre-indications absolues :* Coronaropathie, antécédent d'AVC ou d'AIT, artériopathie périphérique, HTA non contrôlée.  
- Limiter les prises pour éviter les céphalées par abus médicamenteux.`
    },
    {
      num: "XXI",
      category: "neurologie",
      title: "Accident vasculaire cérébral (AVC)",
      isUrgent: true,
      summary: "Urgence absolue, reconnaissance FAST, règle du timing, transfert en filière neurovasculaire sans délai.",
      content: `### Règle d'or :
**Tout déficit neurologique brutal doit être considéré comme un AVC jusqu'à preuve du contraire.** Chaque minute compte (*Time is Brain*).

### Signes cliniques d'alerte (Score FAST) :
- Paralysie ou asymétrie faciale brutale ;
- Déficit moteur ou faiblesse d'un membre (bras ou jambe) ;
- Trouble du langage (aphasie, difficulté à trouver les mots, dysarthrie) ;
- Trouble visuel brutal (amaurose, hémianopsie) ;
- Trouble de l'équilibre, ataxie ou vertige franc soudain ;
- Trouble de la conscience ou confusion subite.

### Conduite à tenir immédiate :
1. **Noter impérativement l'heure exacte de début des symptômes** (ou la dernière heure connue sans déficit) ;
2. Contrôler les fonctions vitales (SpO2, FC, PA) ;
3. **Mesurer immédiatement la glycémie capillaire** pour éliminer une hypoglycémie simulant un AVC ;
4. Laisser le patient à jeun strict (ne rien donner à boire ni à manger) ;
5. Ne pas chercher à faire baisser la tension artérielle sauf valeurs extrêmes (> 220/120 mmHg) ;
6. **Alerter les services d'urgence et transférer sans délai** vers une Unité Neuro-Vasculaire (UNV) pour imagerie cérébrale urgente (IRM / scanner) en vue d'une thrombolyse et/ou thrombectomie mécanique.`
    },
    {
      num: "XXII",
      category: "neurologie",
      title: "Crise convulsive",
      isUrgent: true,
      summary: "Mesures de sécurité immédiates, recherche étiologique métabolique/toxique, état de mal et Diazépam.",
      content: `### Étiologies à rechercher en priorité :
- Hypoglycémie sévère (mesurer glycémie capillaire en urgence) ;
- Troubles hydro-électrolytiques (hyponatrémie, hypocalcémie) ;
- Infection du système nerveux central (méningite, encéphalite) ;
- Intoxication aiguë ou surdosage médicamenteux ;
- AVC ou hématome sous-dural ;
- Traumatisme crânien récent ;
- Sevrage brutal en alcool ou en benzodiazépines.

### Mesures de protection immédiates :
- Ne rien introduire de force dans la bouche (ne pas mettre les doigts) ;
- Écarter les objets dangereux autour du patient ;
- Desserrer les vêtements serrés au cou ;
- Placer en Position Latérale de Sécurité (PLS) dès la fin des mouvements cloniques pour libérer les voies aériennes ;
- Oxygénothérapie si disponible.

### 🚨 Critères d'urgence vitale (État de mal épileptique) :
- Durée de la crise supérieure à 5 minutes ;
- Crises répétées sans reprise de conscience intermédiaire ;
- Détresse respiratoire ou encombrement majeur ;
- Traumatisme sévère associé ;
- Contexte de grossesse (suspicion d'éclampsie) ;
- Première crise survenant chez l'adulte.  
*Traitement d'urgence :* **Diazépam** (voie intraveineuse lente ou intra-rectale chez l'enfant) selon le protocole de réanimation locale.`
    },
    {
      num: "XXIII",
      category: "cardiovasculaire",
      title: "Insuffisance cardiaque",
      isUrgent: false,
      summary: "Les 4 piliers du traitement de l'insuffisance cardiaque à FEVG réduite (ARNI/IEC, Bêtabloquant, ARM, iSGLT2) et Furosémide.",
      content: `### Les 4 Piliers Thérapeutiques (FEVG réduite)
Le traitement pronostique repose sur l'association des quatre classes validées :
1. **Inhibition du système rénine-angiotensine** :
   - De préférence **ARNI (Sacubitril/valsartan)** ou à défaut **IEC / ARA2**.
   - ⚠️ *Règle de sécurité majeure :* Respecter impérativement un délai de wash-out d'au moins **36 heures** entre l'arrêt d'un IEC et l'introduction de Sacubitril/valsartan pour prévenir l'angio-œdème.
2. **Bêtabloquant cardio-sélectif validé** :
   - **Bisoprolol** (ou Métoprolol succinate, Carvédilol) : débuter à dose très faible (1,25 mg/jour) chez un patient stabilisé et titrer très progressivement.
3. **Antagoniste des récepteurs des minéralocorticoïdes (ARM)** :
   - **Spironolactone** (25 mg/j) ou Éplérénone. Surveillance étroite de la kaliémie et du DFG.
4. **Inhibiteur de SGLT2 (gliflozine)** :
   - **Dapagliflozine** 10 mg/j ou Empagliflozine 10 mg/j, y compris chez le non-diabétique.

### Traitement symptomatique de surcharge :
- **Diurétique de l'anse (Furosémide)** : dose adaptée au degré de rétention hydrosodée. Réduire à la dose minimale efficace dès l'euvolémie atteinte.

### 🚨 Signes de décompensation aiguë / Urgence :
- Dyspnée de repos ou orthopnée aiguë brutale ;
- Râles crépitants pulmonaires étendus (OAP) ;
- Prise de poids rapide (> 2-3 kg en quelques jours) ;
- Hypotension, marbrures, oligurie ou confusion.`
    },
    {
      num: "XXIV",
      category: "cardiovasculaire",
      title: "Fibrillation atriale",
      isUrgent: false,
      summary: "Prévention thromboembolique (AOD vs AVK), contrôle de fréquence par bêtabloquant, scores CHA2DS2-VASc et HAS-BLED.",
      content: `### 3 Objectifs Thérapeutiques Clés :
1. **Prévenir l'AVC et les embolies systémiques** (anticoagulation curative) ;
2. **Contrôler la fréquence ventriculaire** ;
3. **Contrôler le rythme sinusal** lorsque cela est indiqué.

### Anticoagulation (Prévention de l'AVC) :
- Évaluer le risque embolique par un score validé (**CHA2DS2-VASc**).
- **Apixaban** : 5 mg deux fois par jour dans le schéma standard pour FA non valvulaire.
  - *Critères de réduction de dose à 2,5 mg x 2/j :* Si au moins 2 des critères suivants sont présents : âge ≥ 80 ans, poids ≤ 60 kg, créatininémie ≥ 133 µmol/L (1,5 mg/dL).
- Évaluer le score **HAS-BLED** pour identifier et corriger les facteurs de risque hémorragique modifiables (HTA non contrôlée, alcool, AINS).

### Contrôle de fréquence :
- **Bisoprolol** : dose individualisée selon la fréquence cardiaque au repos, la pression artérielle et la tolérance.

### Éléments d'évaluation obligatoires :
Âge, poids, fonction rénale, risque hémorragique, présence d'une sténose mitrale serrée ou d'une valve mécanique (qui imposent les AVK et contre-indiquent les AOD).`
    },
    {
      num: "XXV",
      category: "cardiovasculaire",
      title: "Dyslipidémie",
      isUrgent: false,
      summary: "Statines (Atorvastatine modérée vs forte intensité), cibles de LDL-cholestérol selon risque cardiovasculaire global.",
      content: `### Traitement hypolipémiant
- **Atorvastatine** :
  - *10 à 20 mg par jour :* intensité modérée.
  - *40 à 80 mg par jour :* forte intensité (prévention secondaire après SCA ou très haut risque cardiovasculaire).

### Objectifs thérapeutiques
- La cible de **LDL-cholestérol** dépend du niveau de risque cardiovasculaire global calculé (faible, modéré, élevé, très élevé) selon les recommandations en vigueur [44].
- En prévention secondaire (post-infarctus, AVC ischémique, artériopathie) : cibler un LDL-C < 0,55 g/L (< 1,4 mmol/L) et une réduction d'au moins 50% de la valeur basale.

### Surveillance clinique et biologique :
- Évaluer la tolérance musculaire (rechercher myalgies inexpliquées) ;
- Vérifier les interactions médicamenteuses (inhibiteurs enzymatiques) ;
- Contrôler le bilan lipidique et les transaminases si nécessaire.`
    },
    {
      num: "XXVI",
      category: "metabolisme",
      title: "Hypothyroïdie",
      isUrgent: false,
      summary: "Substitution par Lévothyroxine, adaptation chez le sujet âgé ou coronarien, surveillance biologique de la TSH.",
      content: `### Traitement substitutif : Lévothyroxine
- **Chez l'adulte jeune sans antécédent cardiovasculaire :**
  - Posologie d'environ **1,6 µg/kg/jour** pour un remplacement complet d'emblée.
- **Chez le sujet âgé ou en cas de coronaropathie connue :**
  - **Début très prudent à 12,5 à 25 µg par jour** (pour éviter de démasquer une ischémie myocardique).
  - Augmentation par paliers très progressifs toutes les 4 à 6 semaines.

### Modalités de prise & Surveillance :
- Prendre le matin à jeun avec un grand verre d'eau, 30 minutes avant le petit-déjeuner.
- Éviter la prise simultanée de fer, calcium ou pansements gastriques (espacer de 2 à 4h).
- **Contrôle de la TSH** au bout de 6 à 8 semaines après chaque changement de posologie.`
    },
    {
      num: "XXVII",
      category: "metabolisme",
      title: "Hyperthyroïdie",
      isUrgent: false,
      summary: "Bilan diagnostique (TSH, T4L, ECG), traitement symptomatique bêtabloquant et orientation spécialisée.",
      content: `### Bilan initial indispensable :
- TSH ultra-sensible (effondrée) ;
- T4 libre (et T3 libre selon contexte) ;
- Enquête étiologique : anticorps anti-récepteurs de la TSH (maladie de Basedow), échographie thyroïdienne, scintigraphie si nodule toxique ;
- **ECG systématique** (recherche de fibrillation atriale ou de tachycardie sinusale).

### Symptômes cliniques :
Tachycardie de repos, palpitations, tremblements fins des extrémités, amaigrissement rapide avec appétit conservé, thermophobie, anxiété, insomnie, accélération du transit, asthénie musculaire.

### Prise en charge initiale :
- **Bêtabloquant** (ex: propranolol) : pour le contrôle symptomatique rapide de la tachycardie et des tremblements (en l'absence de contre-indication bronchique).
- Le traitement étiologique (antithyroïdiens de synthèse, iode radioactif ou chirurgie) relève d'une prise en charge spécialisée en endocrinologie.`
    },
    {
      num: "XXVIII",
      category: "dermatologie",
      title: "Urticaire et anaphylaxie",
      isUrgent: true,
      summary: "Antihistaminiques de 2e génération dans l'urticaire simple vs Adrénaline IM d'urgence dans l'anaphylaxie.",
      content: `### Urticaire aiguë simple
- **Cétirizine** : 10 mg par jour par voie orale, ou
- **Loratadine** : 10 mg par jour par voie orale.
- Durée courte selon la rémission des lésions érythémato-papuleuses prurigineuses.

### 🚨 Anaphylaxie (Urgence Vitale Majeure)
Une réaction d'urticaire associée à l'un des signes suivants caractérise une anaphylaxie :
- Dyspnée, bronchospasme, stridor ou sifflements respiratoires ;
- Œdème laryngé ou sensation de gorge serrée (angio-œdème) ;
- Malaise, vertiges intenses, hypotension artérielle ou collapsus ;
- Signes digestifs violents : douleurs abdominales crampiformes, vomissements répétés ;
- Altération de la conscience ou pâleur extrême.

### Conduite d'urgence :
1. **ADRÉNALINE INTRAMUSCULAIRE (face antéro-latérale de la cuisse) IMMÉDIATE :**
   - *Adulte :* **0,5 mg IM** (soit 0,5 mL d'une ampoule à 1 mg/mL).
   - *Enfant :* **0,01 mg/kg IM** (max 0,3 mg).
2. **Ne jamais retarder l'injection d'adrénaline** par l'administration préalable d'antihistaminiques ou de corticoïdes !
3. Allonger le patient jambes surélevées (sauf détresse respiratoire où la position assise est tolérée).
4. Oxygène haut débit, appel immédiat du SAMU/services d'urgence.
5. Répéter l'adrénaline après 5 à 15 minutes si absence d'amélioration.`
    },
    {
      num: "XXIX",
      category: "dermatologie",
      title: "Eczéma",
      isUrgent: false,
      summary: "Émollients quotidiens au long cours, réduction des irritants et dermocorticoïdes adaptés.",
      content: `### Traitement de fond fondamental :
- Application quotidienne et généreuse d'**émollients** sur peau saine ;
- Bains ou douches tièdes et courts, sans savons décapants (syndets, huiles lavantes) ;
- Éviction des facteurs irritants (laine, textiles synthétiques, parfum, adoucissants) ;
- Prise en charge des facteurs déclenchants et du stress.

### Traitement des poussées inflammatoires :
- **Dermocorticoïdes** (ex: Hydrocortisone 1% dans les formes légères ou dermocorticoïde d'activité forte selon la localisation) :
  - Application fine 1 à 2 fois par jour sur les plaques rouges suintantes ou lichénifiées jusqu'à blanchiment.
  - La puissance du dermocorticoïde doit être rigoureusement adaptée à l'âge, au site anatomique (visage et plis = activité faible à modérée) et à l'étendue des lésions.`
    },
    {
      num: "XXX",
      category: "dermatologie",
      title: "Gale",
      isUrgent: false,
      summary: "Perméthrine 5% topique, schéma à 2 applications, traitement rigoureux de l'entourage et du linge.",
      content: `### Traitement parasiticide topique
- **Perméthrine 5% crème** :
  - Application soigneuse sur l'ensemble de la surface corporelle (du cou jusqu'aux orteils, en insistant sur les espaces interdigitaux, poignets, organes génitaux, plis cutanés et sous les ongles).
  - Laisser agir pendant 8 à 14 heures (généralement toute la nuit), puis laver abondamment.
  - **Une deuxième application est indispensable 7 à 14 jours plus tard** pour éliminer les larves nouvellement écloses.

### Règles d'or de décontamination de l'environnement :
- **Traiter simultanément tous les contacts proches et membres du foyer**, même en l'absence totale de prurit !
- Laver le linge de lit, serviettes et vêtements portés les 3 jours précédents à **60°C**, ou les isoler dans un sac plastique hermétique pendant au moins 3 à 5 jours.
- *Information du patient :* Le prurit post-scabieux peut persister plusieurs semaines après l'éradication complète du parasite (ne signifie pas un échec thérapeutique).`
    },
    {
      num: "XXXI",
      category: "dermatologie",
      title: "Mycoses superficielles",
      isUrgent: false,
      summary: "Antifongiques topiques (Clotrimazole 1%), durée prolongée et indications de prélèvement.",
      content: `### Traitement topique usuel
- **Clotrimazole 1%** (ou dérivé imidazolé équivalent) :
  - Application biquotidienne sur la lésion et 2 cm en périphérie.
  - Durée : poursuivre le traitement **au moins 2 à 4 semaines** (au-delà de la disparition clinique complète pour éviter les rechutes).
- Maintenir les zones de plis propres et sèches (séchage soigné après la douche, sous-vêtements en coton).

### Situations nécessitant une prise en charge particulière :
- Atteintes des ongles (onychomycose), du cuir chevelu (teigne) ou mycoses profuses/récidivantes :
  - Nécessitent souvent un prélèvement mycologique avant traitement et une antibiothérapie/antifongique par voie générale (terbinafine, itraconazole).`
    },
    {
      num: "XXXII",
      category: "methodologie",
      title: "Fièvre",
      isUrgent: false,
      summary: "La fièvre est un symptôme, Paracétamol raisonné, règles de sécurité hépatiques et purpura fébrile.",
      content: `### Principe fondamental :
**La fièvre est un symptôme et non une maladie en soi.** Elle participe aux défenses immunitaires. L'objectif premier est le confort du patient et l'identification de l'étiologie (infection bactérienne ou virale, inflammation, néoplasie, toxique).

### Traitement antipyrétique :
- **Paracétamol** : 500 à 1 000 mg par prise chez l'adulte.
  - Espacer les prises d'au moins **4 à 6 heures**.
  - Dose maximale quotidienne : 3 g/jour chez l'adulte (voire 4 g/j strictement réservé à l'adulte sans facteur de risque), à réduire à 2 g/j chez le sujet âgé, dénutri ou insuffisant hépatique.
- *Attention majeure :* Risque d'hépatotoxicité aiguë mortelle en cas de cumul involontaire de médicaments associant du paracétamol.

### 🚨 Signaux d'alerte vitale (Orientation urgente) :
- Fièvre associée à un **purpura cutané** (éléments pétéchiaux ne s'effaçant pas à la vitropression = suspicion de purpura fulminans -> Ceftriaxone immédiate) ;
- Hypotension artérielle, marbrures, oligurie (sepsis) ;
- Troubles de la vigilance ou confusion ;
- Détresse respiratoire aiguë.`
    },
    {
      num: "XXXIII",
      category: "rhumatologie",
      title: "Douleur",
      isUrgent: false,
      summary: "Paliers antalgiques de l'OMS, traitement étiologique, limitation des AINS et règles strictes des opioïdes.",
      content: `### Évaluation et Paliers Thérapeutiques
- **Douleur légère (Palier 1)** :
  - **Paracétamol** en première intention.
  - Traitement spécifique de la cause sous-jacente.
- **Douleur inflammatoire** :
  - AINS à dose minimale efficace et pour la durée la plus brève possible, en l'absence de contre-indication (rénale, gastrique, cardiaque).
- **Douleur sévère ou réfractaire (Palier 3)** :
  - Évaluer précisément les fonctions vitales et éliminer une urgence chirurgicale ou médicale grave.
  - Les **opioïdes** ne doivent jamais être prescrits de façon automatique : leur indication, leur posologie initiale, leur durée précise et les modalités de surveillance doivent être clairement définies.
  - Prescription systématique d'un laxatif osmotique préventif.`
    },
    {
      num: "XXXIV",
      category: "methodologie",
      title: "Corticothérapie",
      isUrgent: false,
      summary: "Prednisone en cure courte vs prolongée, surveillance glycémique/osseuse et sevrage progressif.",
      content: `### Principes de prescription
La dose et la durée de la corticothérapie dépendent strictement de l'indication, de la gravité et du terrain sous-jacent.
- *Exemple de cure courte (exacerbation BPCO) :* **Prednisone 40 mg par jour pendant 5 jours**.

### Surveillance en cas de corticothérapie prolongée (> 3 semaines) :
- Pression artérielle (risque de rétention hydrosodée et d'HTA) ;
- Glycémie à jeun et post-prandiale (diabète cortico-induit) ;
- Évolution pondérale et répartition des graisses (syndrome cushingoïde) ;
- Risque infectieux accru (réactivation tuberculeuse, mycoses) ;
- Densité minérale osseuse (ostéoporose cortico-induite : supplémentation vit D/calcium, bisphosphonates si indiqués) ;
- Pression intraoculaire (glaucome, cataracte) ;
- Risque cardiovasculaire et troubles psychiatriques (euphorie, insomnie, état confusionnel).

### Règle du sevrage :
Une corticothérapie prolongée ne doit **jamais être interrompue brutalement**, en raison du risque d'insuffisance surrénalienne aiguë secondaire à la mise au repos de l'axe corticotrope. Diminution très progressive par paliers.`
    },
    {
      num: "XXXV",
      category: "infectiologie",
      title: "Antibiothérapie raisonnée",
      isUrgent: false,
      summary: "Les 10 questions clés avant toute prescription et la classification OMS AWaRe (Access, Watch, Reserve).",
      content: `### Les 10 Questions Indispensables avant toute prescription :
1. Une infection bactérienne est-elle cliniquement probable ?
2. L'antibiothérapie est-elle réellement nécessaire ?
3. Le foyer infectieux est-il clairement identifié ?
4. Quel est le germe le plus probable ?
5. Quelles sont les données de résistance bactérienne locale ?
6. Existe-t-il une allergie connue aux bêtalactamines ou autres ?
7. Quelle est la fonction rénale du patient (DFG) ?
8. La posologie choisie est-elle appropriée au site et à la gravité ?
9. La durée du traitement est-elle strictement justifiée et la plus courte possible ?
10. Une date de réévaluation clinique à 48-72h est-elle formellement prévue ?

### Classification OMS AWaRe :
- **ACCESS** : Antibiotiques de premier choix, à privilégier car ils offrent le meilleur rapport efficacité/sécurité et un potentiel de résistance plus faible (ex: Amoxicilline).
- **WATCH** : Antibiotiques à spectre plus large, dont l'utilisation doit être ciblée et mesurée en raison d'un risque accru d'émergence de résistances (ex: Ciprofloxacine, Ceftriaxone).
- **RESERVE** : Molécules de dernier recours, strictement réservées aux infections bactériennes multi-résistantes documentées [9].

> **Règle d'or :** Une indication bactérienne improbable ne justifie en aucun cas la prescription préventive ou réflexe d'un antibiotique.`
    },
    {
      num: "XXXVI",
      category: "infectiologie",
      title: "Antibiotiques courants",
      isUrgent: false,
      summary: "Monographies synthétiques avec classification OMS AWaRe (Access, Watch, Reserve) : bêtalactamines, fosfomycine, nitrofurantoïne, cyclines, C3G, macrolides et fluoroquinolones.",
      content: `### Synthèse des molécules usuelles avec classification OMS AWaRe :

- **Amoxicilline** [ACCESS - 1er Choix OMS] :
  - *Posologie adulte :* 500 mg à 1 g par prise, 2 à 3 fois par jour selon le foyer (jusqu'à 3 g/jour dans les pneumonies franches à pneumocoque).
  - *Indications de 1ère intention :* Infections ORL (angines à SGA confirmées par TDR, otites moyennes aiguës, sinusites maxillaires), pneumonies aiguës communautaires, éradication d'*Helicobacter pylori*, infections cutanées simples.
  - *Précautions & Sécurité :* Adapter impérativement au DFG si ClCr < 30 mL/min. Contre-indiqué en cas d'allergie vraie aux pénicillines. Éruption maculopapuleuse fréquente et non allergique en cas de mononucléose infectieuse (MNI).
- **Amoxicilline / acide clavulanique** [ACCESS - 1er Choix OMS] :
  - *Posologie adulte :* 1 g/125 mg 3 fois par jour au milieu des repas pour réduire l'intolérance digestive.
  - *Indications :* Exacerbations de BPCO à risque, pneumonies de déglutition ou avec suspicion de germes anaérobies/Gram négatif, morsures animales ou humaines, diverticulites aiguës, pyélonéphrites aiguës en relais après antibiogramme.
  - *Précautions & Sécurité :* Diarrhée fréquente (acide clavulanique), risque d'hépatite cholestatique aiguë médicamenteuse. Espacer les prises en cas d'insuffisance rénale sévère.
- **Pivmécillinam** [ACCESS - 1er Choix OMS] :
  - *Posologie adulte :* 400 mg 2 fois par jour pendant 3 jours.
  - *Indications :* Traitement de 1ère intention de la cystite aiguë simple à *Escherichia coli* chez la femme.
  - *Précautions & Sécurité :* Prendre au milieu des repas avec un grand verre d'eau en restant en position assise ou debout (prévention des ulcérations œsophagiennes). Inefficace sur les pyélonéphrites aiguës et prostatites (diffusion parenchymateuse insuffisante). Contre-indiqué en cas de déficit en carnitine.
- **Fosfomycine trométamol** [ACCESS - 1er Choix OMS] :
  - *Posologie adulte :* Sachet de 3 g en prise unique orale, à jeun ou à distance des repas (2h), de préférence au coucher après avoir vidé la vessie.
  - *Indications :* Traitement monodose de 1ère intention de la cystite aiguë simple non compliquée de la femme jeune.
  - *Précautions & Sécurité :* Totalement inefficace et formellement proscrit dans les pyélonéphrites aiguës et les prostatites (diffusion tissulaire rénale nulle).
- **Nitrofurantoïne** [ACCESS - 1er Choix OMS] :
  - *Posologie adulte :* 100 mg 2 à 3 fois par jour pendant 5 à 7 jours.
  - *Indications :* Cystite aiguë simple de la femme (alternative si fosfomycine ou pivmécillinam non utilisables).
  - *Précautions & Sécurité :* ⛔ **Contre-indiquée si DFG < 30-45 mL/min** (inefficacité urinaire et accumulation toxique systémique). **Interdiction absolue de prescription au long cours ou en prophylaxie continue** en raison du risque létal de fibrose pulmonaire interstitielle irréversible et d'hépatite cytolytique ou cholestatique sévère.
- **Doxycycline** [ACCESS - 1er Choix OMS] :
  - *Posologie adulte :* 100 mg à 200 mg par jour en 1 ou 2 prises au milieu d'un repas.
  - *Indications :* Pneumonies atypiques (*Mycoplasma*, *Chlamydophila*), exacerbations de BPCO, zoonoses (Lyme précoce, rickettsioses, leptospirose), chlamydioses urogénitales, acné inflammatoire.
  - *Précautions & Sécurité :* Photosensibilisation majeure (protection solaire rigoureuse) ; risque d'ulcérations œsophagiennes (avaler avec un grand verre d'eau sans s'allonger dans les 30 minutes) ; contre-indiquée chez l'enfant < 8 ans et à partir du 2e trimestre de la grossesse (anomalies et dyschromie définitive de l'émail dentaire).
- **Métronidazole** [ACCESS - 1er Choix OMS] :
  - *Posologie adulte :* 500 mg 2 à 3 fois par jour selon l'indication.
  - *Indications :* Infections à bactéries anaérobies strictes (*Bacteroides fragilis*), vaginoses bactériennes (*Gardnerella*), trichomonase urogénitale, colite à *C. difficile* (formes légères), amibiase hépatique et intestinale.
  - *Précautions & Sécurité :* ⚠️ **Effet antabuse sévère avec l'alcool** (rougeur faciale, tachycardie, céphalées, vomissements, malaise — abstinence alcoolique totale pendant le traitement et jusqu'à 48h après). Goût métallique désagréable ; neuropathies périphériques en cas de traitement prolongé.
- **Sulfaméthoxazole / Triméthoprime (Cotrimoxazole)** [ACCESS - 1er Choix OMS] :
  - *Posologie adulte :* Forme forte (800 mg SMX / 160 mg TMP) : 1 comprimé 2 fois par jour.
  - *Indications :* Infections urinaires documentées, prostatites bactériennes aiguës ou chroniques, prophylaxie et traitement curatif de la pneumocystose, infections cutanées à staphylocoque doré (y compris SARM communautaire sensible).
  - *Précautions & Sécurité :* Risque de toxidermies bulleuses graves (syndromes de Stevens-Johnson et de Lyell) ; cytopénies médullaires (surveiller NFS) ; hyperkaliémie fréquente chez le sujet âgé ou insuffisant rénal (effet épargneur de potassium du triméthoprime) ; adapter la dose au DFG ; contre-indiqué en cas de déficit en G6PD et au 1er trimestre de grossesse.
- **Ceftriaxone** [WATCH - Risque de Résistance] :
  - *Posologie adulte :* 1 à 2 g par jour en une seule injection IV ou IM (jusqu'à 4 g/jour dans les méningites bactériennes purulentes).
  - *Indications :* Infections sévères hospitalisées : pyélonéphrites aiguës de l'adulte, pneumonies aiguës communautaires sévères, méningites, bactériémies, gonococcie non compliquée (injection unique IM).
  - *Précautions & Sécurité :* ⚠️ **Molécule du groupe WATCH :** À préserver pour limiter la pression de sélection sur les entérobactéries et freiner l'émergence des souches productrices de BLSE. Relais oral ACCESS le plus précoce possible dès amélioration clinique. Ne jamais perfuser avec des solutions contenant du calcium (précipitation de sels insolubles de calcium-ceftriaxone).
- **Azithromycine** [WATCH - Risque de Résistance] :
  - *Posologie adulte :* 500 mg à J1 puis 250 mg par jour de J2 à J5 (ou 500 mg par jour pendant 3 jours).
  - *Indications :* Infections respiratoires à germes atypiques (*Mycoplasma*, *Chlamydophila*, *Legionella*), coqueluche, urétrite et cervicite à *Chlamydia trachomatis* (1 g prise unique), diarrhées invasives bactériennes sévères.
  - *Précautions & Sécurité :* ⚠️ **Molécule du groupe WATCH :** Risque prouvé d'allongement de l'intervalle QT et de torsades de pointes chez les sujets à risque cardiologique ; émergence rapide de pneumocoques résistants aux macrolides en cas d'utilisation non raisonnée.
- **Ciprofloxacine** [WATCH - Risque de Résistance] :
  - *Posologie adulte :* 500 mg à 750 mg 2 fois par jour par voie orale.
  - *Indications :* Pyélonéphrites aiguës documentées, prostatites bactériennes aiguës, infections ostéo-articulaires documentées, diarrhées bactériennes invasives avec syndrome dysentérique sévère.
  - *Précautions & Sécurité :* 🚨 **Alertes de sécurité majeures ANSM / EMA :** Fluoroquinolone du groupe WATCH à réserver strictement aux indications indispensables documentées. Effets indésirables invalidants et potentiellement irréversibles : tendinopathies et ruptures du tendon d'Achille (risque majoré chez la personne âgée ou sous corticothérapie), anévrisme et dissection aortique, décompensation de myasthénie, allongement du QT, neuropathies périphériques et troubles neuropsychiatriques (agitation, confusion, hallucinations). Proscrite dans les infections bénignes (angines, bronchites, sinusites, cystites simples).
- **Groupe RESERVE (Carbapénèmes, Colistine, Linézolide, Céfidérocol)** [RESERVE - Dernier Recours] :
  - *Molécules de dernier recours :* Méropénème, Imipénème/Cilastatine, Colistine, Linézolide, Daptomycine, Céfidérocol, Ceftazidime/Avibactam.
  - *Cadre d'utilisation :* Strictement réservées aux infections hospitalières documentées à bactéries hautement résistantes (entérobactéries productrices de carbapénémases - EPC, *Pseudomonas aeruginosa* ou *Acinetobacter baumannii* multirésistants).
  - *Règle de dispensation :* Aucune indication ni dispensation en médecine ambulatoire de premier recours. Prescription hospitalière encadrée par un médecin référent en antibiothérapie.`
    },
    {
      num: "XXXVII",
      category: "terrains",
      title: "Personne âgée",
      isUrgent: false,
      summary: "Principes gériatriques : déprescription, 'Start low go slow', vigilance anticholinergique et prévention des chutes.",
      content: `### Principe de réflexion prioritaire :
Avant toute nouvelle prescription chez un sujet âgé, se poser la question :  
**« Peut-on supprimer ou déprescrire un médicament existant ? »**

### Facteurs de risque à dépister systématiquement :
- Polymédication (≥ 5 molécules) et cascades iatrogènes ;
- Insuffisance rénale sous-jacente masquée par la sarcopénie ;
- Hypotension orthostatique (mesure tensionnelle couché puis debout à 1 et 3 min) ;
- Risque de chutes et instabilité motrice ;
- Épisodes confusionnels ou déclin cognitif ;
- Traitements anticholinergiques (atropiniques) ;
- Prise prolongée de benzodiazépines et apparentés ;
- Utilisation délétère des AINS systémiques.

> **Règle d'or de la gériatrie :** *Start low, go slow* — Commencer à très faible posologie, augmenter très lentement et réévaluer continuellement la tolérance.`
    },
    {
      num: "XXXVIII",
      category: "terrains",
      title: "Insuffisance rénale",
      isUrgent: false,
      summary: "Interprétation du DFG, adaptation des molécules à élimination rénale et éviction stricte des néphrotoxiques.",
      content: `### Évaluation du Débit de Filtration Glomérulaire (DFG)
- Ne jamais se baser sur le chiffre isolé de la créatininémie (une créatininémie normale chez une personne âgée ou dénutrie peut masquer une insuffisance rénale sévère).
- Estimer le DFG (par CKD-EPI ou formule de Cockcroft-Gault selon le RCP du médicament).

### Médicaments nécessitant une adaptation posologique impérative :
- **Metformine** (adapter dès DFG < 60 mL/min, arrêt si DFG < 30 mL/min) ;
- **Sitagliptine** et autres antidiabétiques oraux ;
- **Antibiotiques** (Aminosides, Fluoroquinolones, Céphalosporines, Bêtalactamines) ;
- **Anticoagulants oraux directs (AOD)** (réduction de dose ou contre-indication selon DFG) ;
- **Colchicine** ;
- **Digoxine** ;
- Certains antalgiques (morphiniques et dérivés en raison de l'accumulation de métabolites actifs).

⚠️ **Alerte néphrotoxicité :** Éviction formelle des AINS. En cas d'infection intercurrente fébrile ou de déshydratation, suspendre temporairement les médicaments néphrotoxiques et les inhibiteurs du SRAA.`
    },
    {
      num: "XXXIX",
      category: "terrains",
      title: "Grossesse",
      isUrgent: false,
      summary: "Sécurité fœto-maternelle, molécules de référence, contre-indications formelles (IEC, ARA2, statines, AINS).",
      content: `### Principes de prescription chez la femme enceinte :
- Confirmer impérativement l'indication médicale ;
- Choisir en priorité les molécules bénéficiant du plus grand recul d'utilisation (données CRAT / OMS) ;
- Utiliser la dose minimale efficace pour la durée la plus courte possible ;
- Éviter absolument l'automédication ;
- Vérifier les données spécifiques au trimestre et au terme exact de la grossesse.

### ⛔ Médicaments formellement contre-indiqués ou à risque élevé :
- **IEC et ARA2** : fœtotoxicité rénale majeure, oligohydramnios, anurie fœtale (contre-indiqués aux 2e et 3e trimestres, à arrêter dès le diagnostic de grossesse) ;
- **Statines** : contre-indiquées pendant la grossesse ;
- **AINS** : formellement contre-indiqués à partir du début du 6e mois (24 SA) et fortement déconseillés avant ;
- Certains antiépileptiques (Valproate de sodium formellement tératogène) ;
- Certains anticoagulants (AVK tératogènes au 1er trimestre) ;
- Antibiotiques à risque : Tétracyclines (anomalies osseuses et dentaires), Fluoroquinolones.`
    },
    {
      num: "XL",
      category: "terrains",
      title: "Pédiatrie",
      isUrgent: false,
      summary: "Calcul de dose strict au poids (mg/kg), vérification de la pipette et posologie du Paracétamol.",
      content: `### Règle fondamentale :
**Ne jamais extrapoler automatiquement la posologie d'un adulte à un enfant.**

### Formule de calcul :
> 📐 **Dose par prise** = **Poids (kg)** × **Dose recommandée (mg/kg/prise)**

### Points de contrôle obligatoires :
- Âge précis et poids exact du jour ;
- Concentration exacte du sirop ou de la suspension buvable ;
- Dose maximale par prise et dose quotidienne maximale à ne jamais dépasser ;
- Intervalle minimal de temps entre deux prises successives ;
- Vérification du dispositif de mesure (utiliser exclusivement la pipette graduée au kilo fournie dans la boîte du médicament).

### Paracétamol chez l'enfant :
- **Dose courante :** **10 à 15 mg/kg par prise**, toutes les 6 heures (soit un maximum de 60 mg/kg/jour).`
    },
    {
      num: "XLI",
      category: "methodologie",
      title: "Médicaments à haut risque",
      isUrgent: true,
      summary: "Molécules à marge thérapeutique étroite : insuline, anticoagulants, opioïdes, digoxine, lithium.",
      content: `### Médicaments requérant une vigilance maximale :
- **Insuline** (risque d'hypoglycémie aiguë sévère fatale) ;
- **Anticoagulants** (AVK, AOD, héparines : risque d'hémorragie engageant le pronostic vital) ;
- **Opioïdes** (dépression respiratoire, sédation extrême, surdosage) ;
- **Benzodiazépines** (chutes, dépression respiratoire, syndrome de sevrage) ;
- **Digoxine** (marge thérapeutique très étroite, intoxication digitalique en cas d'hypokaliémie ou d'insuffisance rénale) ;
- **Lithium** (surdosage en cas de déshydratation ou d'interaction avec IEC/AINS) ;
- **Antiarythmiques** (risque proarythmique, torsades de pointes) ;
- **Corticostéroïdes à forte dose** ;
- **Sulfamides hypoglycémiants** (hypoglycémies prolongées).

### Séquence de sécurité obligatoire :
> 🛡️ **Indication** ➔ **Dose** ➔ **Surveillance**
*Toujours expliquer au patient et aux aidants les signes d'alerte spécifiques et les conduites à tenir d'urgence.*`
    },
    {
      num: "XLII",
      category: "methodologie",
      title: "Check-list avant signature",
      isUrgent: false,
      summary: "Les 10 points de contrôle de sécurité à valider systématiquement avant de valider et signer toute ordonnance.",
      content: `### Les 10 Points de Sécurité Obligatoires :
1. ✅ **Diagnostic ?** La probabilité diagnostique est-elle suffisante ?
2. ✅ **Indication ?** Chaque médicament prescrit a-t-il une indication clinique avérée ?
3. ✅ **Allergie ?** Les antécédents allergiques ont-ils été scrupuleusement vérifiés ?
4. ✅ **Âge et Poids ?** Les doses sont-elles calibrées au poids (pédiatrie) et à l'âge physiologique ?
5. ✅ **Grossesse / Allaitement ?** Le statut fœto-maternel est-il vérifié ?
6. ✅ **Fonction rénale ?** Le DFG a-t-il été calculé et les molécules adaptées ?
7. ✅ **Fonction hépatique ?** Y a-t-il une contre-indication ou un risque de surdosage métabolique ?
8. ✅ **Interactions médicamenteuses ?** A-t-on vérifié l'absence de redondance ou d'interaction toxique ?
9. ✅ **Mentions de l'ordonnance ?** DCI, posologie, forme, voie, durée et consignes sont-elles précisées ?
10. ✅ **Information et réévaluation ?** Le patient a-t-il compris les modalités de prise et la date de réévaluation ?`
    },
    {
      num: "XLIII",
      category: "urgences",
      title: "Signes d'urgence vitale",
      isUrgent: true,
      summary: "Tableau récapitulatif des signes de gravité imposant une orientation immédiate en réanimation ou urgences.",
      content: `### 🚨 Répertoire des Signes d'Urgence Immédiate :
- **Détresse respiratoire aiguë** (polypnée > 30/min, tirage, balancement thoraco-abdominal) ;
- **Saturation significativement basse** (SpO2 < 90-92% à l'air ambiant) ;
- **Douleur thoracique suspecte** (rétrosternale constrictive irradiant au bras gauche ou à la mâchoire) ;
- **Déficit neurologique brutal** (hémiplégie, paralysie faciale, aphasie) ;
- **Trouble de la conscience ou coma** (Score de Glasgow altéré) ;
- **Convulsions prolongées ou répétées** (état de mal épileptique) ;
- **État de choc** (hypotension avec PAS < 90 mmHg, marbrures, oligurie, extrémités froides) ;
- **Sepsis sévère** (syndrome infectieux avec défaillance d'organe) ;
- **Hémorragie extériorisée importante** (digestive, gynécologique ou traumatique) ;
- **Déshydratation sévère** avec collapsus ou pli cutané majeur ;
- **Anaphylaxie** (urticaire associée à un bronchospasme ou hypotension) ;
- **Douleur abdominale aiguë intense** avec défense, contracture ou vomissements fécaloïdes ;
- **Cyanose centrale** des téguments et des muqueuses ;
- **Purpura fébrile** (urgence infectieuse absolue imposant antibiothérapie immédiate).`
    },
    {
      num: "XLIV",
      category: "urgences",
      title: "Tableau de prescription rapide",
      isUrgent: false,
      summary: "Aide-mémoire synthétique des posologies de première intention pour les pathologies courantes de consultation.",
      content: `### Synthèse des Prescriptions Usuelles en Soins de Première Ligne :

- **Hypertension artérielle** :
  - *Amlodipine :* 5 mg par jour (jusqu'à 10 mg/j).
  - *Périndopril :* 5 mg par jour au départ, puis adaptation.
  - *Losartan :* 50 mg par jour (jusqu'à 100 mg/j).
  - *Hydrochlorothiazide :* 12,5 à 25 mg par jour.
- **Diabète de type 2** :
  - *Metformine :* début à 500 mg 1 à 2 fois/j au repas, puis titration progressive (1 500 à 2 000 mg/j).
  - *Dapagliflozine :* 10 mg par jour.
  - *Empagliflozine :* 10 mg par jour.
  - *Sitagliptine :* 100 mg par jour (si fonction rénale normale).
  - *Gliclazide LP :* début à 30 mg par jour.
- **Douleur et fièvre** :
  - *Paracétamol :* 500 à 1 000 mg par prise, espacées de 4 à 6 h.
  - *Ibuprofène :* 200 à 400 mg par prise (courte durée, si absence de contre-indication).
- **Asthme** :
  - *Salbutamol :* 100 µg par bouffée (1 à 2 bouffées au besoin).
  - *Prednisone :* 40 à 50 mg par jour pendant 5 à 7 jours dans l'exacerbation.
- **BPCO** :
  - *Prednisone :* 40 mg par jour pendant 5 jours dans les exacerbations indiquées.
- **Reflux gastro-œsophagien (RGO)** :
  - *Oméprazole :* 20 mg par jour pendant 4 à 8 semaines.
- **Constipation** :
  - *Macrogol :* 10 à 20 g par jour selon la réponse clinique.
- **Cystite simple** :
  - *Fosfomycine :* 3 g en dose unique orale.
  - *Nitrofurantoïne :* 100 mg 2 fois par jour pendant 5 jours.
- **Goutte** :
  - *Allopurinol :* début fréquent à 100 mg/j, puis titration mensuelle.
- **Hypothyroïdie** :
  - *Lévothyroxine :* environ 1,6 µg/kg/j (jeune sans cardiopathie) ; 12,5 à 25 µg/j si coronarien ou âgé.
- **Urticaire** :
  - *Cétirizine :* 10 mg par jour.
  - *Loratadine :* 10 mg par jour.`
    },
    {
      num: "XLV",
      category: "methodologie",
      title: "Tableau détaillé DCI – Dose – Indication – Précautions",
      isUrgent: false,
      summary: "Grand tableau alphabétique exhaustif de référence de toutes les molécules courantes du manuel.",
      content: `### Répertoire Pharmacologique de Consultation (Chapitre XLV) :

| DCI | Indication ou usage | Repère posologique | Principales précautions |
| :--- | :--- | :--- | :--- |
| **Amlodipine** | HTA, angor | 5 à 10 mg/j | Œdèmes des membres inférieurs, hypotension |
| **Amoxicilline** | Infections bactériennes sensibles | 500 mg à 1 g, 2 à 3 fois/j selon indication | Allergie aux pénicillines, fonction rénale |
| **Amoxicilline / acide clavulanique** | Infections sélectionnées | Selon présentation et indication | Allergie, fonction hépatique et rénale, diarrhée |
| **Apixaban** | Prévention thromboembolique FA | 5 mg, 2 fois/j standard (2,5 mg x2 si critères) | Fonction rénale, âge, poids, risque hémorragique |
| **Atorvastatine** | Dyslipidémie | 10 à 80 mg/j selon intensité | Myopathie, surveillance enzymes hépatiques |
| **Azithromycine** | Infections respiratoires/génitales | Selon indication | Allongement du QT, résistances, interactions |
| **Bisoprolol** | HTA, insuffisance cardiaque, contrôle FC | Dose variable (début à 1,25 mg/j dans l'IC) | Bradycardie, hypotension, bronchospasme |
| **Budésonide** | Asthme de fond | Selon dispositif inhalateur | Technique d'inhalation, rincer la bouche (candidose) |
| **Cétirizine** | Urticaire, rhinite allergique | 10 mg/j | Somnolence possible chez certains patients |
| **Ceftriaxone** | Infections sévères injectables | 1 à 2 g/j dans de nombreuses indications | Indication stricte justifiée, allergie |
| **Ciprofloxacine** | Infections ciblées | Dose variable selon foyer | Tendinopathies, allongement QT, troubles neuro |
| **Clotrimazole** | Mycoses superficielles | 1%, 2 applications par jour | Diagnostic précis, durée suffisante (2-4 sem) |
| **Colchicine** | Crise de goutte | Schéma de faible dose (ex: 1 mg puis 0,5 mg) | Insuffisance rénale et hépatique, diarrhée toxique |
| **Dapagliflozine** | Diabète, IC, maladie rénale | 10 mg/j | Déshydratation, infections génitales, acidocétose rare |
| **Empagliflozine** | Diabète, IC, maladie rénale | 10 mg/j (voire 25 mg/j selon DFG) | Déshydratation, mycoses génitales |
| **Fosfomycine** | Cystite simple non compliquée | 3 g en dose unique orale | Non adapté à la pyélonéphrite |
| **Gliclazide LP** | Diabète de type 2 | 30 mg/j au début, titration | Risque majeur d'hypoglycémie |
| **Hydrochlorothiazide**| HTA | 12,5 à 25 mg/j | Natrémie, kaliémie (hypoK), uricémie, fonction rénale |
| **Ibuprofène** | Douleur inflammatoire | 200 à 400 mg par prise (max 1 200 mg/j) | Rein, estomac (ulcères), HTA, contre-indiqué 3e trim grossesse |
| **Ipratropium** | Bronchospasme, BPCO | Selon dispositif | Glaucome à angle fermé, rétention urinaire |
| **Lactulose** | Constipation | 15 à 30 mL/j initialement | Ballonnements, météorisme |
| **Lévothyroxine** | Hypothyroïdie | Dose individualisée (1,6 µg/kg ou 12,5-25 µg)| Titration prudente chez coronarien, prise à jeun |
| **Loratadine** | Allergie, urticaire | 10 mg/j | Fonction hépatique selon le contexte |
| **Losartan** | HTA | 50 mg/j (jusqu'à 100 mg/j) | Kaliémie, créatinine, contre-indiqué pendant la grossesse |
| **Macrogol** | Constipation | 10 à 20 g/j selon produit | Tolérance digestive excellente, exclure occlusion |
| **Metformine** | Diabète de type 2 | 500 mg 1 à 2 fois/j au repas, puis titration | DFG (arrêt si < 30 mL/min), arrêt si déshydratation/hypoxie |
| **Métronidazole** | Infections anaérobies, amibiase | Dose variable selon indication | Effet antabuse strict avec l'alcool, neuropathies |
| **Nitrofurantoïne** | Cystite simple | 100 mg 2 fois par jour pendant 5 jours | DFG (> 30-45 mL/min), inefficace sur pyélonéphrite |
| **Oméprazole** | RGO, ulcère gastrique | 20 mg/j (le matin à jeun) | Durée limitée, éliminer signes d'alarme néoplasiques |
| **Paracétamol** | Douleur, fièvre | 500 à 1 000 mg par prise (max 3-4 g/j) | Toxicité hépatique, dénutrition, dose cumulée |
| **Périndopril** | HTA, insuffisance cardiaque | 5 mg/j au départ | Toux sèche, kaliémie, créatinine, contre-indiqué grossesse |
| **Perméthrine 5%** | Gale | Application cutanée corporelle totale | Répéter à J7-J14, traiter l'entourage et le linge |
| **Prednisone** | Corticothérapie systémique | Dose variable selon pathologie | Glycémie, TA, risque infectieux, arrêt progressif |
| **Sacubitril / valsartan**| Insuffisance cardiaque FEVG altérée | Dose progressive par paliers | Hypotension, kaliémie, respecter 36h après un IEC |
| **Salbutamol** | Bronchospasme aigu | 100 µg/bouffée (1-2 bouffées) | Tachycardie, tremblements, témoin de mauvais contrôle |
| **Sitagliptine** | Diabète de type 2 | 100 mg/j si DFG normal | Adapter la posologie au DFG |
| **Spironolactone** | Insuffisance cardiaque | 25 mg/j | Hyperkaliémie, gynécomastie, fonction rénale |
| **Sumatriptan** | Crise migraineuse | 50 mg dès le début de la céphalée | Contre-indications cardiovasculaires formelles |`
    },
    {
      num: "XLVI",
      category: "terrains",
      title: "Adaptation rénale : Mémo pratique",
      isUrgent: false,
      summary: "Synthèse des molécules critiques nécessitant une vérification systématique de la clairance rénale.",
      content: `### Vérifier systématiquement le DFG avant de prescrire :
- **Metformine** (adapter et suspendre si DFG < 30 mL/min) ;
- **Sitagliptine** et la plupart des antidiabétiques oraux ;
- **Certains antibiotiques** (Aminosides, Fluoroquinolones, Bêtalactamines) ;
- **Nitrofurantoïne** ;
- **Anticoagulants oraux directs (AOD)** (Apixaban, Rivaroxaban, Dabigatran) ;
- **Colchicine** ;
- **Digoxine** (accumulation et toxicité rapide) ;
- **Certains antalgiques morphiniques** ;
- **Médicaments cardiovasculaires** (IEC, ARA2, Diurétiques).

⚠️ **Attention aux néphrotoxiques majeurs :** Éviter formellement les AINS en cas de maladie rénale chronique. En cas d'insuffisance rénale aiguë, de déshydratation fébrile ou de choc, réévaluer sans délai l'ensemble de l'ordonnance.`
    },
    {
      num: "XLVII",
      category: "terrains",
      title: "Personne âgée : Médicaments à haut risque",
      isUrgent: false,
      summary: "Classes médicamenteuses sources majeures d'hospitalisations et d'effets indésirables chez les seniors.",
      content: `### Classes à surveiller avec une vigilance extrême :
- **AINS** (hémorragies digestives graves, insuffisance rénale aiguë, décompensation cardiaque) ;
- **Benzodiazépines et hypnotiques** (sédation diurne, troubles mnésiques, chutes, fractures du col fémoral) ;
- **Médicaments anticholinergiques** (confusion mentale, rétention aiguë d'urine, fécalome, glaucome) ;
- **Opioïdes** (confusion, constipation opiniâtre, détresse respiratoire) ;
- **Sulfamides hypoglycémiants** (hypoglycémies sévères et prolongées) ;
- **Anticoagulants** (surdosage hémorragique favorisé par les chutes) ;
- **Digoxine** ;
- **Corticostéroïdes au long cours** ;
- **Polymédication antihypertensive** (hypotension orthostatique et syncopes).

> **Question réflexe du prescripteur :** « Ce médicament est-il réellement indispensable aujourd'hui ? »`
    },
    {
      num: "XLVIII",
      category: "terrains",
      title: "Grossesse : Mémo pratique",
      isUrgent: false,
      summary: "Synthèse des médicaments nécessitant une vigilance particulière ou une contre-indication stricte.",
      content: `### Classes à haut risque ou contre-indiquées :
- **IEC & ARA2** : formellement contre-indiqués dès le début de la grossesse ;
- **Statines** ;
- **AINS** : formellement contre-indiqués dès le 6e mois (24 SA) et fortement déconseillés avant ;
- **Antiépileptiques** (notamment Valproate) ;
- **Anticoagulants oraux** (les AVK et AOD sont remplacés par des HBPM selon avis spécialisé) ;
- **Certains antibiotiques** (Cyclines, Quinolones).

> ⚠️ Ne jamais interrompre brutalement ni remplacer un traitement chronique fondamental (ex: antiépileptique, insuline, antihypertenseur) par une alternative choisie au hasard sans concertation médicale spécialisée.`
    },
    {
      num: "XLIX",
      category: "methodologie",
      title: "Formules pratiques et conversions",
      isUrgent: false,
      summary: "Règles de calcul pédiatriques, conversions d'unités de masse et équivalences de glycémie.",
      content: `### Calculs Posologiques Pédiatriques
> 📐 **Dose par prise (mg)** = **Poids (kg)** × **Dose recommandée (mg/kg/prise)**

> 📐 **Dose quotidienne (mg)** = **Poids (kg)** × **Dose recommandée (mg/kg/jour)**

### Conversions de masse usuelles
- **1 g** = **1 000 mg**
- **1 mg** = **1 000 µg**

### Équivalences glycémiques
- **1 g/L** ≈ **100 mg/dL** ≈ **5,55 mmol/L**
- **Seuil d'hypoglycémie :** **< 0,70 g/L** (soit **< 70 mg/dL** ou **< 3,9 mmol/L**)`
    },
    {
      num: "L",
      category: "methodologie",
      title: "Réévaluation thérapeutique",
      isUrgent: false,
      summary: "Toute prescription a une date d'échéance : vérifier efficacité, tolérance, observance et déprescription.",
      content: `### Règle d'or :
**Toute prescription médicale doit comporter une échéance claire de réévaluation.**

### Paramètres à évaluer systématiquement lors du suivi :
- **Efficacité :** L'objectif clinique ou biologique fixé est-il atteint ?
- **Tolérance :** Existe-t-il des effets indésirables rapportés ou méconnus ?
- **Observance :** Le schéma est-il bien compris et suivi par le patient ?
- **Évolution clinique :** Y a-t-il apparition de nouveaux symptômes ou de complications ?
- **Nécessité :** Le traitement doit-il être poursuivi, intensifié ou diminué ?
- **Déprescription :** Peut-on arrêter une molécule dont l'indication n'est plus justifiée ?

> En cas d'échec d'un traitement, réévaluer d'abord le diagnostic initial, l'observance réelle, la posologie et les facteurs intercurrents avant d'ajouter une nouvelle molécule.`
    },
    {
      num: "LI",
      category: "methodologie",
      title: "Règles d'or de la thérapeutique clinique",
      isUrgent: false,
      summary: "Les 15 préceptes cardinaux pour une pratique médicale rationnelle, éthique et sécurisée.",
      content: `### Les 15 Préceptes Cardinaux :
1. **Diagnostiquer avant de prescrire** ;
2. **Traiter la cause** lorsque cela est possible ;
3. **Ne pas traiter systématiquement les symptômes bénins** par une cascade de molécules ;
4. **Utiliser les antibiotiques uniquement lorsqu'ils sont formellement indiqués** ;
5. **Prescrire en DCI** (Dénomination Commune Internationale) ;
6. **Adapter les doses** au terrain individuel du patient ;
7. **Vérifier la fonction rénale** lorsque nécessaire ;
8. **Vérifier les interactions médicamenteuses** ;
9. **Prévoir une surveillance clinique et biologique** ;
10. **Réévaluer régulièrement** chaque ligne de l'ordonnance ;
11. **Déprescrire** lorsqu'un médicament n'est plus utile ;
12. **Orienter rapidement** en présence d'un signe de gravité ;
13. **Documenter les objectifs thérapeutiques** dans le dossier médical ;
14. **Informer le patient** sur les bénéfices attendus, les risques et les signaux d'alarme ;
15. **Tenir compte des recommandations actualisées** et des résistances locales.`
    }
  ],

  conclusion: {
    text: `La thérapeutique clinique moderne ne consiste pas à multiplier les médicaments. Elle consiste à choisir, pour chaque patient, le traitement dont le bénéfice attendu est supérieur aux risques, à la dose appropriée et pour la durée nécessaire.`,
    sixQuestions: [
      { q: "Pourquoi ?", desc: "Quelle est l'indication précise et le diagnostic certain ?" },
      { q: "Quoi ?", desc: "Quelle molécule en DCI au profil bénéfice-risque le plus favorable ?" },
      { q: "Combien ?", desc: "Quelle posologie exacte adaptée au poids, à l'âge et au rein ?" },
      { q: "Comment ?", desc: "Quelle voie d'administration, quelle forme galénique et quelles consignes de prise ?" },
      { q: "Pendant combien de temps ?", desc: "Quelle durée minimale efficace justifiée ?" },
      { q: "Quand réévaluer ?", desc: "À quelle date et sur quels critères d'efficacité et de tolérance ?" }
    ]
  },

  references: [
    "World Health Organization. Guide to good prescribing: a practical manual. Geneva: World Health Organization; 1994.",
    "World Health Organization. WHO model list of essential medicines: 23rd list. Geneva: World Health Organization; 2023.",
    "World Health Organization. Guideline for the pharmacological treatment of hypertension in adults. Geneva: World Health Organization; 2021.",
    "European Society of Cardiology. 2024 ESC Guidelines for the management of elevated blood pressure and hypertension. Eur Heart J. 2024.",
    "American Diabetes Association Professional Practice Committee. Standards of Care in Diabetes—2026. Diabetes Care. 2026;49 Suppl 1.",
    "Davies MJ, Aroda VR, Collins BS, Gabbay RA, Green J, Maruthur NM, et al. Management of hyperglycaemia in type 2 diabetes, 2022: a consensus report by the ADA and the EASD. Diabetologia. 2022;65:1925-66.",
    "Global Initiative for Asthma. Global strategy for asthma management and prevention: 2026 update. Fontana: Global Initiative for Asthma; 2026.",
    "Global Initiative for Chronic Obstructive Lung Disease. Global strategy for the prevention, diagnosis and management of COPD: 2026 report. Fontana: GOLD; 2026.",
    "World Health Organization. The WHO AWaRe antibiotic book. Geneva: World Health Organization; 2022.",
    "World Health Organization. Antimicrobial resistance: global report on surveillance. Geneva: World Health Organization; 2022.",
    "Malfertheiner P, Megraud F, Rokkas T, Gisbert JP, Liou JM, Schulz C, et al. Management of Helicobacter pylori infection: the Maastricht VI/Florence consensus report. Gut. 2022;71:1724-62.",
    "National Institute for Health and Care Excellence. Low back pain and sciatica in over 16s: assessment and management. NICE guideline NG59. London: NICE; updated 2024.",
    "FitzGerald JD, Dalbeth N, Mikuls T, Brignardello-Petersen R, Guyatt G, Abhishek A, et al. 2020 American College of Rheumatology guideline for the management of gout. Arthritis Care Res. 2020;72(6):744-60.",
    "Kleindorfer DO, Towfighi A, Chaturvedi S, Cockroft KM, Gutierrez J, Lombardi-Hill D, et al. 2021 guideline for the prevention of stroke in patients with stroke and transient ischemic attack. Stroke. 2021;52:e364-e467.",
    "McDonagh TA, Metra M, Adamo M, Gardner RS, Baumbach A, Böhm M, et al. 2021 ESC Guidelines for the diagnosis and treatment of acute and chronic heart failure. Eur Heart J. 2021;42:3599-726.",
    "Visseren FLJ, Mach F, Smulders YM, Carballo D, Koskinas KC, Bäck M, et al. 2021 ESC Guidelines on cardiovascular disease prevention in clinical practice. Eur Heart J. 2021;42:3227-337.",
    "World Allergy Organization. World Allergy Organization anaphylaxis guidance 2020. World Allergy Organ J. 2020;13(10):100472.",
    "National Institute for Health and Care Excellence. Drug allergy: diagnosis and management. NICE guideline CG183. London: NICE; updated 2024.",
    "Katz PO, Dunbar KB, Schnoll-Sussman FH, Greer KB, Yadlapati R, Spechler SJ. ACG clinical guideline for the diagnosis and management of gastroesophageal reflux disease. Am J Gastroenterol. 2022;117(1):27-56.",
    "Metlay JP, Waterer GW, Long AC, Anzueto A, Brozek J, Crothers K, et al. Diagnosis and treatment of adults with community-acquired pneumonia. Am J Respir Crit Care Med. 2019;200(7):e45-e67.",
    "European Association of Urology. EAU Guidelines on urological infections 2025. Arnhem: European Association of Urology; 2025.",
    "National Institute for Health and Care Excellence. Stroke and transient ischaemic attack in over 16s: diagnosis and initial management. NICE guideline NG128. London: NICE; updated 2024.",
    "National Institute for Health and Care Excellence. Osteoarthritis in over 16s: diagnosis and management. NICE guideline NG226. London: NICE; 2022.",
    "National Institute for Health and Care Excellence. Medicines optimisation: the safe and effective use of medicines to enable the best possible outcomes. NICE guideline NG5. London: NICE; updated 2023.",
    "International Committee of Medical Journal Editors. Recommendations for the conduct, reporting, editing, and publication of scholarly work in medical journals. ICMJE; updated 2025.",
    "National Library of Medicine. Citing medicine: the NLM style guide for authors, editors, and publishers. Bethesda: NLM; updated 2024."
  ]
};

if (typeof window !== 'undefined') window.GENERAL_MANUAL_DATA = GENERAL_MANUAL_DATA;
if (typeof module !== 'undefined') module.exports = GENERAL_MANUAL_DATA;

