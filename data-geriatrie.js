/**
 * FICHES DE THÉRAPEUTIQUE EN GÉRIATRIE
 * Guide pratique pour une prise en charge adaptée des personnes âgées
 * Des solutions thérapeutiques adaptées à chaque étape du vieillissement
 * Édition Septembre 2026 - Collection TRIMOBE - Fiches Pratiques de FMC
 * 
 * Sous la direction du : Dr Elisette ANDRIANANJA (Présidente de l'Association TRIMOBE)
 * Coordination scientifique : Dr Eric Naivolala ANDRIANASOLO
 * Relecture : Dr Patricia RAZAFINDRABEKOTO, Dr Andy RANJALAHY
 */

const GERIATRIE_MANUAL_DATA = {
  id: "geriatrie",
  title: "Fiches de Thérapeutique en Gériatrie",
  subtitle: "Guide pratique pour une prise en charge adaptée des personnes âgées",
  badge: "Gériatrie & Sujet Âgé",
  edition: "Septembre 2026",
  organizations: [
    { name: "Association TRIMOBE.org", president: "Dr Elisette ANDRIANANJA" }
  ],
  scientificCoordination: "Dr Eric Naivolala ANDRIANASOLO",
  reviewers: ["Dr Patricia RAZAFINDRABEKOTO", "Dr Andy RANJALAHY"],
  avertissement: `Support de synthèse pédagogique destiné à la Formation Médicale Continue.

Toute décision clinique implique une vérification préalable de l'adaptation à la fonction rénale, des interactions médicamenteuses, des contre-indications, des recommandations professionnelles actualisées et du RCP des molécules.

Les objectifs thérapeutiques doivent être individualisés selon l'âge physiologique, l'état fonctionnel, la fragilité, les comorbidités, l'espérance de vie, les objectifs de soins et les souhaits du patient.`,
  
  registres: [
    {
      id: "reg-0",
      title: "Principes Généraux de Prescription en Gériatrie",
      description: "Modifications pharmacocinétiques / pharmacodynamiques et règles d'or (Start low, go slow, STOPP/START, Beers)",
      icon: "⚖️"
    },
    {
      id: "reg-1",
      title: "Registre I — Pathologies Chroniques",
      description: "Prise en charge au long cours des grandes pathologies chroniques du sujet âgé (HTA, IC, FA, Diabète, Dépression, Démence...)",
      icon: "🩺"
    },
    {
      id: "reg-2",
      title: "Registre II — Pathologies Aiguës",
      description: "Gestion en urgence des situations aiguës (Delirium, OAP, PAC, Infection urinaire, AVC, Rétention, Déshydratation...)",
      icon: "🚨"
    },
    {
      id: "reg-3",
      title: "Registre III — Pathologies et Syndromes Gériatriques",
      description: "Grands syndromes gériatriques (Fragilité, Chutes, Dénutrition, Escarres, Iatrogénie, Déglutition...)",
      icon: "👴"
    }
  ],

  fiches: [
    {
      num: 0,
      registreId: "reg-0",
      title: "Principes généraux de prescription en gériatrie",
      isUrgent: false,
      summary: "Modifications pharmacocinétiques (PK/PD) liées au vieillissement et règles d'or de la prescription gériatrique.",
      content: `### 1. Modifications pharmacocinétiques et pharmacodynamiques liées à l'âge

- **Absorption :**
  - Diminution de l'acidité gastrique (hypochlorhydrie) ;
  - Ralentissement de la vidange gastrique ;
  - Réduction de la surface d'absorption intestinale.

- **Distribution :**
  - **Diminution de la masse maigre et de l'eau corporelle totale :** Entraîne une diminution nette du volume de distribution des molécules hydrosolubles (*lithium, aminosides, digoxine*), avec un **risque majeur de surdosage et de toxicité précoce**.
  - **Augmentation de la masse grasse relative :** Augmentation du volume de distribution et de la demi-vie d'élimination des molécules liposolubles (*benzodiazépines à longue demi-vie, neuroleptiques, amiodarone*), favorisant leur accumulation tissulaire et prolongeant les effets sédatifs ou confusionnels résiduels.
  - **Hypoalbuminémie :** Fréquente chez le sujet âgé (dénutrition, états inflammatoires chroniques), elle augmente significativement la fraction libre active des médicaments fortement liés aux protéines plasmatiques (*AVK, AINS, sulfamides hypoglycémiants, phénytoïne*).

- **Métabolisme hépatique :**
  - Diminution physiologique du débit sanguin hépatique et du volume hépatique ;
  - Diminution de certaines capacités de clairance métabolique de premier passage.

- **Élimination rénale :**
  - Diminution progressive physiologique du Débit de Filtration Glomérulaire (DFG) et du flux sanguin rénal ;
  - ⚠️ **Piège fondamental :** Une créatininémie apparemment normale chez une personne âgée sarcopénique masque très fréquemment une insuffisance rénale sévère !
  - L'estimation de la fonction rénale doit être systématiquement calculée avant de prescrire un médicament à élimination rénale.

---

### 2. Les 10 Règles d'or de la prescription gériatrique

1. **Start low, go slow :** débuter systématiquement à la posologie minimale efficace et titrer très progressivement.
2. **Réévaluer régulièrement la pertinence de chaque médicament :** toute ordonnance doit être remise en question périodiquement.
3. **Utiliser les outils validés :** critères **STOPP/START** et critères de **Beers** pour traquer les prescriptions inappropriées.
4. **Simplifier le schéma thérapeutique :** réduire le nombre de prises quotidiennes, harmoniser les horaires.
5. **Privilégier les formes galéniques adaptées :** tenir compte des capacités motrices (arthrose des mains, ouverture des flacons) et des troubles de déglutition.
6. **Éviter les médicaments à forte charge anticholinergique :** source majeure de confusion, rétention urinaire, constipation et chutes.
7. **Prévenir activement les interactions médicamenteuses :** surveiller les redondances pharmacodynamiques.
8. **Adapter les traitements à la fonction rénale et hépatique.**
9. **Individualiser les objectifs thérapeutiques :** privilégier l'état fonctionnel et la qualité de vie plutôt que des cibles purement chiffrées.
10. **Toujours rechercher un équilibre :** entre le bénéfice attendu, les risques iatrogènes, l'autonomie et les souhaits du patient.`
    },
    {
      num: 1,
      registreId: "reg-1",
      title: "Hypertension artérielle du sujet âgé",
      isUrgent: false,
      summary: "Cibles tensionnelles adaptées à la fragilité (130-139 mmHg si robuste), dépistage systématique de l'hypotension orthostatique.",
      content: `### Objectifs thérapeutiques individualisés
- **Chez le patient âgé autonome et robuste :**
  - Rechercher une pression artérielle systolique (PAS) généralement comprise **entre 130 et 139 mmHg** si elle est parfaitement tolérée cliniquement.
- **Chez le sujet très âgé, fragile ou polypathologique :**
  - L'objectif doit être individualisé selon le degré de fragilité, le statut fonctionnel, les comorbidités et la tolérance.
  - **La tolérance clinique doit toujours primer sur le chiffre tensionnel !**

### ⚠️ Dépistage systématique de l'Hypotension Orthostatique
- Mesurer la pression artérielle en position couchée puis debout (à 1 minute et à 3 minutes).
- À rechercher impérativement après toute introduction ou modification d'un traitement antihypertenseur.
- Réévaluer le rapport bénéfice/risque en cas de chutes répétées, de dénutrition, de déshydratation aiguë ou de déclin fonctionnel rapide.`
    },
    {
      num: 2,
      registreId: "reg-1",
      title: "Insuffisance cardiaque chronique à FEVG altérée",
      isUrgent: false,
      summary: "4 piliers thérapeutiques adaptés, titration prudente du Bisoprolol, dérivés nitrés, diurétiques et surveillance du poids.",
      content: `### Objectifs cliniques
Réduire la mortalité globale, prévenir les hospitalisations répétées en urgence et préserver au maximum l'autonomie et la qualité de vie.

### Traitement de fond adapté au sujet âgé
- **Bêtabloquant cardio-sélectif :** **Bisoprolol**, débuté à posologie très faible (1,25 mg/jour) et titré très prudemment selon la fréquence cardiaque et la tolérance.
- **Inhibition du SRAA :** IEC/ARA2 ou, préférentiellement lorsque indiqué, **ARNI (Sacubitril/valsartan)**.  
  ⚠️ Lors du passage d'un IEC au sacubitril/valsartan, respecter impérativement le délai de sécurité de **36 heures**.
- **Antagoniste des récepteurs des minéralocorticoïdes (ARM) :** **Spironolactone** ou éplérénone. Surveillance rapprochée de la fonction rénale et de la kaliémie.
- **Inhibiteur de SGLT2 :** **Dapagliflozine** 10 mg ou empagliflozine 10 mg/j, indépendamment du statut diabétique.
- **Diurétique de l'anse :** **Furosémide** pour éliminer la surcharge hydrosodée, à la dose minimale efficace. À réduire ou arrêter dès l'euvolémie atteinte pour prévenir la déshydratation et l'insuffisance rénale fonctionnelle.

### Surveillance clinique rigoureuse :
Surveiller le poids corporel (une prise pondérale rapide > 1,5 kg en quelques jours traduit une rétention hydrosodée débutante), la pression artérielle, les symptômes fonctionnels et le ionogramme sanguin.`
    },
    {
      num: 3,
      registreId: "reg-1",
      title: "Fibrillation atriale et anticoagulation",
      isUrgent: false,
      summary: "Score CHA2DS2-VASc, utilité du score HAS-BLED, AOD de 1ère intention, réduction de dose et risque de chute.",
      content: `### Évaluation du risque thromboembolique et hémorragique
- Évaluer le risque embolique par le score **CHA2DS2-VASc** (l'âge confère d'emblée une indication d'anticoagulation curative chez la grande majorité des personnes âgées).
- Le score **HAS-BLED** sert à identifier et corriger les facteurs de risque hémorragique modifiables (HTA non équilibrée, consommation d'alcool, AINS ou antiagrégants superflus) : **il ne doit jamais être utilisé isolément pour refuser une anticoagulation nécessaire**.
- 💡 **Règle fondamentale : Le risque de chute, pris isolément, ne constitue pas une contre-indication systématique à l'anticoagulation.**

### Anticoagulants Oraux Directs (AOD)
Pour une première instauration, les **AOD sont généralement privilégiés par rapport aux AVK** (meilleure sécurité vis-à-vis des hémorragies intracrâniennes). Si le patient est déjà sous AVK bien équilibré avec un INR stable, le maintien de l'AVK est tout à fait légitime.
- **Apixaban :** Posologie standard de 5 mg x 2/jour.  
  *Critères de réduction à 2,5 mg x 2/jour :* Présence d'au moins deux des critères suivants : Âge ≥ 80 ans, Poids ≤ 60 kg, Créatininémie ≥ 133 µmol/L (1,5 mg/dL).
- **Rivaroxaban :** Adaptation posologique à la clairance de la créatinine.
- **Dabigatran :** Prudence accrue et réduction de dose selon l'âge et la fonction rénale.

### Contrôle de la fréquence cardiaque
- **Bisoprolol** à faible dose.
- La **digoxine** possède une marge thérapeutique extrêmement étroite chez le sujet âgé : surveillance impérative de la fonction rénale et de la kaliémie.`
    },
    {
      num: 4,
      registreId: "reg-1",
      title: "Diabète de type 2 du sujet âgé",
      isUrgent: false,
      summary: "Cibles d'HbA1c selon profil (robuste vs fragile vs très fragile), Metformine, iDPP-4 et danger des sulfamides.",
      content: `### Individualisation des cibles d'HbA1c
- **Patient âgé robuste / autonome :** Cible d'HbA1c relativement stricte (< 7,0% à 7,5%) si le risque hypoglycémique est minime.
- **Patient fragile / polypathologique :** Cible assouplie (HbA1c entre **7,5% et 8,5%**).
- **Patient très fragile, dépendant ou atteint de démence sévère :**  
  **Priorité absolue : Éviter les hypoglycémies** et prévenir les complications aiguës (syndrome d'hyperosmolarité, déshydratation). Ne pas chercher un contrôle glycémique serré (HbA1c tolérée jusqu'à 8,5% - 9,0%).

### Stratégie médicamenteuse
- **Metformine :** Première intention si le DFG et la tolérance le permettent. Débuter à faible dose, adapter au DFG et suspendre en cas de risque de déshydratation ou d'acidose.
- **Inhibiteurs de la DPP-4 (Sitagliptine) :** Excellent profil de tolérance (aucun risque propre d'hypoglycémie), adapter la dose au DFG.
- **Sulfamides hypoglycémiants :** Extrême prudence chez le sujet âgé ! Éviter formellement les molécules à longue demi-vie (glibenclamide) pourvoyeuses de comas hypoglycémiques prolongés.
- **Insuline :** Privilégier les schémas basaux simples en 1 injection par jour (insuline glargine ou dégludec). Éviter les schémas complexes chez les patients isolés.`
    },
    {
      num: 5,
      registreId: "reg-1",
      title: "Ostéoporose",
      isUrgent: false,
      summary: "Bilan préalable, apports calciques et vitamine D, Alendronate, Acide zolédronique, Dénosumab et risque de rebond.",
      content: `### Bilan préalable et prévention des fractures
- Doser calcium sérique, phosphate, 25-OH-vitamine D et évaluer la fonction rénale.
- Rechercher une cause secondaire d'ostéoporose.
- **Associer systématiquement une évaluation rigoureuse du risque de chute** et corriger les facteurs modifiables de chute (environnement, vision, iatrogénie).

### Vitamine D et calcium
- Privilégier en priorité les apports alimentaires en calcium (produits laitiers, eaux riches en calcium).
- La supplémentation en vitamine D et/ou calcium doit être ciblée sur les déficits et carences avérés, plutôt que systématique et aveugle.

### Traitements anti-ostéoporotiques spécifiques :
- **Alendronate :** 70 mg une fois par semaine. Respecter scrupuleusement les consignes de prise (le matin à jeun avec un grand verre d'eau, rester en position assise ou debout sans se recoucher pendant 30 minutes).
- **Acide zolédronique :** 5 mg en perfusion IV annuelle, après vérification de la clairance rénale et bonne hydratation.
- **Dénosumab :** 60 mg en injection sous-cutanée tous les 6 mois.  
  ⚠️ **Alerte majeure :** Ne jamais interrompre le dénosumab sans relais thérapeutique immédiat par un bisphosphonate (risque majeur d'effet rebond avec fractures vertébrales multiples par emballement ostéoclastique).`
    },
    {
      num: 6,
      registreId: "reg-1",
      title: "Dépression du sujet âgé",
      isUrgent: false,
      summary: "Présentation clinique atypique (pseudo-démence), éviction des tricycliques, prescription d'ISRS et Mirtazapine.",
      content: `### Présentation clinique souvent atypique :
Chez la personne âgée, la dépression se masque fréquemment sous forme de plaintes somatiques polymorphes, de fatigue inexpliquée, d'irritabilité, de ralentissement psychomoteur ou de troubles mnésiques pouvant simuler une démence (« pseudo-démence dépressive »).

### Précautions et choix de l'antidépresseur :
- ⛔ **Éviter autant que possible les antidépresseurs tricycliques** en raison de leurs effets anticholinergiques massifs (confusion, rétention, glaucome) et de leur cardiotoxicité.
- **Inhibiteurs sélectifs de la recapture de la sérotonine (ISRS) :**
  - **Escitalopram** ou **Sertraline** : débuter à très faible dose et augmenter lentement.
  - *Vigilance :* Surveiller la natrémie (risque d'hyponatrémie par SIADH) et l'intervalle QT.
- **Mirtazapine :** Molécule particulièrement avantageuse lorsqu'une anorexie avec perte de poids et une insomnie majeure sont associées au syndrome dépressif.
- Toujours associer un soutien psychologique et des mesures de réinsertion sociale. Arrêt obligatoirement progressif.`
    },
    {
      num: 7,
      registreId: "reg-1",
      title: "Troubles neurocognitifs majeurs",
      isUrgent: false,
      summary: "Donépézil, Rivastigmine, Mémantine, gestion non médicamenteuse des troubles du comportement et danger des neuroleptiques.",
      content: `### Traitements médicamenteux symptomatiques
- **Inhibiteurs de l'acétylcholinestérase (Donépézil, Rivastigmine en patch transdermique) :**
  - Débuter à faible dose avec surveillance de la fréquence cardiaque (bradycardie, syncope), des troubles digestifs et du poids.
- **Mémantine :** Utilisée dans les stades modérés à sévères. Adapter au DFG.

### ⚠️ Prise en charge des troubles sévères du comportement :
- **L'approche non médicamenteuse est la priorité absolue !**
- Avant de conclure à une aggravation de la maladie neurodégénérative, **rechercher une cause aiguë traitable :**
  - Fécalome ou rétention aiguë d'urine ;
  - Douleur non exprimée verbalement ;
  - Infection intercurrente (urinaire, pulmonaire) ;
  - Déshydratation ou trouble ionique ;
  - Iatrogénie médicamenteuse récente ;
  - Inadéquation de l'environnement humain ou matériel.
- **Antipsychotiques :** À réserver au strict dernier recours en cas de danger immédiat pour le patient ou les soignants, à dose minimale et pour une durée la plus courte possible.  
  ⚠️ Les antipsychotiques majorent significativement le risque d'AVC et de mortalité chez les patients atteints de démence. Prudence extrême dans la démence à corps de Lewy (syndrome parkinsonien majeur induit).`
    },
    {
      num: 8,
      registreId: "reg-1",
      title: "Douleur chronique",
      isUrgent: false,
      summary: "Échelles Algoplus/Doloplus, Paracétamol adapté, pièges du Tramadol, limitation des AINS et laxatif systématique sous morphiniques.",
      content: `### Évaluation clinique rigoureuse
- Chez le patient communicant : échelle visuelle analogique (EVA) ou échelle verbale simple (EVS).
- Chez le patient présentant des troubles cognitifs ou de communication : utiliser obligatoirement des échelles comportementales d'hétéro-évaluation validées telles qu'**ALGOPLUS** ou **DOLOPLUS**.

### Stratégie antalgique multimodale
- **Palier 1 : Paracétamol** adapté au terrain, au poids et à l'état nutritionnel (max 2 à 3 g/jour chez le sujet dénutri).
- **AINS :** À éviter ou restreindre drastiquement chez le sujet très âgé en raison des risques rénaux, digestifs et cardiovasculaires majeurs.
- **Tramadol :** Utilisation très prudente en raison des risques de confusion mentale aiguë, d'hyponatrémie, de vertiges/chutes et de syndrome sérotoninergique.
- **Opioïdes forts :** Débuter à faible dose avec titration très progressive. En cas d'insuffisance rénale sévère, attention à l'accumulation des métabolites actifs de la morphine.  
  💡 **Règle absolue : La coprescription d'un laxatif osmotique (macrogol) est systématique dès l'instauration d'un opioïde.**
- **Douleurs neuropathiques :** **Prégabaline** (à adapter strictement au DFG) ou **Duloxétine**.`
    },
    {
      num: 9,
      registreId: "reg-1",
      title: "Insomnie chronique",
      isUrgent: false,
      summary: "Priorité absolue aux mesures non pharmacologiques, respect du rythme circadien et danger des benzodiazépines.",
      content: `### Mesures non médicamenteuses prioritaires :
- Respecter le rythme circadien propre à chaque personne âgée (ne pas forcer un coucher trop précoce à 19h) ;
- Améliorer l'hygiène du sommeil (chambre calme, température adéquate) ;
- **Exposition à la lumière naturelle le matin** (resynchronisation de l'horloge biologique) ;
- Maintien d'une activité physique et relationnelle dans la journée ;
- Réduction du temps passé au lit sans dormir ;
- Thérapie cognitivo-comportementale de l'insomnie (TCC-I).

### Médicaments du sommeil :
- **Les hypnotiques ne doivent pas être utilisés au long cours chez la personne âgée.**
- Si un traitement est exceptionnellement requis : dose minimale et durée très brève (quelques jours).
- ⚠️ **Danger des Benzodiazépines et molécules apparentées :** Elles majorent considérablement le risque de chutes nocturnes, de fractures du col du fémur, de confusion, d'aggravation des troubles cognitifs et de dépendance.`
    },
    {
      num: 10,
      registreId: "reg-1",
      title: "Constipation chronique",
      isUrgent: false,
      summary: "Hydratation, fibres progressives, Macrogol en première ligne, laxatifs de lest et place de la voie rectale.",
      content: `### Mesures hygiéno-diététiques
- Hydratation suffisante et adaptée (1,5 L/jour) ;
- Alimentation équilibrée avec augmentation très progressive des fibres alimentaires ;
- Mobilisation active, marche quotidienne et verticalisation ;
- Éviction des médicaments constipants lorsque cela est possible.

### Laxatifs par voie orale
- **Laxatifs osmotiques (1ère intention) :**  
  **Macrogol** : 1 à 2 sachets par jour selon les besoins et la formulation (excellent profil d'efficacité et de sécurité sans irritation colique).  
  *Lactulose / lactitol :* utilisables mais peuvent générer météorisme et ballonnements gênants.
- **Laxatifs de lest :** **Psyllium**, à condition formelle que les apports hydriques soient abondants et vérifiés (sinon risque d'obstruction).

### Traitement par voie rectale et stimulants :
- Suppositoires à dégagement gazeux ou lavements doux utiles en cas de dyschésie rectale ou de fécalome bas situé.
- Les laxatifs stimulants (anthracéniques) doivent rester exceptionnels et ne jamais être prescrits de façon chronique.`
    },
    {
      num: 11,
      registreId: "reg-2",
      title: "Confusion aiguë (Delirium)",
      isUrgent: true,
      summary: "Urgence médicale gériatrique absolue, démarche étiologique systématique et prise en charge non médicamenteuse.",
      content: `### Définition & Gravité
Le delirium est une **urgence médicale** caractérisée par un trouble aigu et fluctuant de l'attention, de la vigilance et de la cognition. Sa mortalité est élevée si la cause n'est pas traitée.

### Recherche étiologique systématique (Bilan des déclencheurs) :
- **Fécalome** (toucher rectal systématique) ;
- **Globe vésical / Rétention aiguë d'urine** (palpation hypogastrique, bladder scan) ;
- **Infection aiguë sous-jacente** (pneumonie communautaire, infection urinaire, sepsis sans fièvre franche) ;
- **Complications cérébrales :** AVC ischémique ou hémorragique, hématome sous-dural post-chute ;
- **Désordres métaboliques :** Hypoglycémie, hyponatrémie, hypercalcémie, déshydratation ;
- **Hypoxémie** (embolie pulmonaire, insuffisance respiratoire) ;
- **Douleur aiguë méconnue ou non traitée** ;
- **Iatrogénie médicamenteuse récente** (introduction d'un anticholinergique, sédatif, corticoïde) ;
- **Sevrage brutal** (alcool, benzodiazépines).

### Prise en charge :
- **La prise en charge non médicamenteuse est prioritaire :** présence rassurante des proches, réassurance verbale, chambre éclairée le jour et calme la nuit, maintien des lunettes et appareils auditifs, hydratation.
- **Éviter les benzodiazépines** (qui aggravent la confusion, sauf en cas de sevrage alcoolique avéré).
- Les antipsychotiques ne sont envisagés qu'en situation d'agitation dangereuse extrême réfractaire, à posologie minime et pour la durée la plus courte possible.`
    },
    {
      num: 12,
      registreId: "reg-2",
      title: "Décompensation cardiaque aiguë / OAP",
      isUrgent: true,
      summary: "Position assise, oxygénothérapie, Furosémide IV, dérivés nitrés, VNI et bilan biologique d'urgence.",
      content: `### Prise en charge immédiate d'urgence :
1. **Installer le patient en position assise ou demi-assise stricte**, jambes pendantes si possible pour réduire le retour veineux.
2. **Oxygénothérapie** adaptée pour maintenir une SpO2 > 92-94%.
3. Mettre en place un monitorage continu : pression artérielle, fréquence cardiaque, saturation et tracé ECG.

### Traitements médicamenteux d'urgence :
- **Furosémide injectable (IV) :** Dose initiale adaptée aux prises habituelles et au degré d'œdème pulmonaire (ex: 40 à 80 mg IV directe).
- **Dérivés nitrés :** En l'absence d'hypotension (PAS > 110 mmHg), ils réduisent puissamment la précharge et la postcharge.
- **Ventilation Non Invasive (VNI) en mode CPAP :** À débuter précocement en cas de détresse respiratoire persistante ou d'hypercapnie.

### Bilan complémentaire d'urgence :
Troponine, NT-proBNP, ionogramme sanguin, créatinine et gaz du sang. Surveiller la diurèse horaire, l'état hémodynamique et la tolérance rénale.`
    },
    {
      num: 13,
      registreId: "reg-2",
      title: "Pneumonie aiguë communautaire du sujet âgé",
      isUrgent: true,
      summary: "Score de gravité CRB-65, prise en compte de la fragilité et de l'isolement, antibiothérapie probabiliste adaptée.",
      content: `### Évaluation de la gravité clinique
- Utiliser le score clinique **CRB-65** :
  - **C** : Confusion mentale récente
  - **R** : Fréquence respiratoire ≥ 30/min
  - **B** : Blood pressure (PAS < 90 mmHg ou PAD ≤ 60 mmHg)
  - **65** : Âge ≥ 65 ans.
- Chez la personne âgée, l'évaluation doit impérativement intégrer la fragilité sous-jacente, les comorbidités multiples, la dénutrition, l'autonomie et l'entourage social.

### Antibiothérapie probabiliste :
- En ambulatoire chez le sujet âgé ou polypathologique : **Amoxicilline / acide clavulanique** est souvent privilégiée (couverture élargie des entérobactéries et anaérobies de déglutition).
- En milieu hospitalier : Bêta-lactamine injectable adaptée, avec adjonction éventuelle d'un macrolide en cas de suspicion de légionellose ou germe atypique.
- Durée de traitement adaptée à l'évolution clinique (généralement 5 à 7 jours chez le patient rapidement apyrétique).`
    },
    {
      num: 14,
      registreId: "reg-2",
      title: "Infection urinaire aiguë chez le sujet âgé",
      isUrgent: false,
      summary: "Ne pas traiter la bactériurie asymptomatique, Fosfomycine / Pivmécillinam dans la cystite, C3G dans les formes fébriles.",
      content: `### ⚠️ Règle fondamentale en gériatrie :
**Une bactériurie asymptomatique (BU ou ECBU positif sans aucun signe clinique urinaire ni fièvre) NE DOIT PAS être traitée par antibiotique chez la personne âgée !** L'antibiothérapie ne prévient aucune complication et sélectionne des germes résistants.

### Cystite aiguë symptomatique (chez la femme âgée) :
- **Fosfomycine-trométamol** : 3 g en dose unique dans les situations appropriées.
- **Pivmécillinam** : excellente alternative selon les caractéristiques du patient.
- Hydratation suffisante encouragée.

### Pyélonéphrite aiguë & Infection urinaire masculine :
- Prélèvement bactériologique systématique (**ECBU avant toute antibiothérapie**).
- Céphalosporines de 3e génération injectables (ex: **Ceftriaxone**) ou alternatives orales adaptées.
- Hospitalisation requise en cas de signes de sepsis, rétention d'urine ou vomissements.
- Réévaluation obligatoire à 48h pour adapter l'antibiothérapie au résultat de l'antibiogramme (désescalade). Adaptation stricte au DFG.`
    },
    {
      num: 15,
      registreId: "reg-2",
      title: "AVC ischémique aigu chez le sujet âgé",
      isUrgent: true,
      summary: "Urgence neurovasculaire, imagerie cérébrale sans délai, critères de thrombolyse/thrombectomie et évaluation bénéfice-risque.",
      content: `### Urgence neurovasculaire absolue
- Une imagerie cérébrale urgente (IRM ou scanner cérébral sans injection) est indispensable immédiatement pour éliminer une hémorragie intracrânienne.

### Reperfusion cérébrale d'urgence :
- **Thrombolyse intraveineuse par Altéplase :**
  - Dose classique : 0,9 mg/kg (dose max 90 mg) dans la fenêtre des 4h30.
  - **L'âge chronologique seul ne constitue pas une contre-indication automatique à la reperfusion.**
- **Thrombectomie mécanique :** À discuter jusqu'à 6-24h en cas d'occlusion d'une grosse artère intracrânienne proximale chez un patient éligible.
- *Chez la personne âgée très fragile avec haut risque hémorragique :* Évaluer collégialement la balance bénéfice/risque.

### Antiagrégation plaquettaire :
- **Aspirine** introduite après élimination d'une hémorragie (ou après le scanner de contrôle à 24h post-thrombolyse).
- Contrôle de la pression artérielle, de la glycémie et de la température corporelle.`
    },
    {
      num: 16,
      registreId: "reg-2",
      title: "Syndrome coronarien aigu (SCA)",
      isUrgent: true,
      summary: "Présentation souvent indolore ou atypique (dyspnée, malaise), traitement antithrombotique initial et coronarographie.",
      content: `### Présentation gériatrique trompeuse :
Chez le sujet âgé ou diabétique, la douleur thoracique typique fait souvent défaut. Le SCA se manifeste fréquemment par un équivalent ischémique : dyspnée aiguë isolée, malaise, chute inexpliquée, confusion subite ou poussée d'insuffisance cardiaque.

### Traitement antithrombotique initial d'urgence :
- **Aspirine :** Dose de charge (150 à 300 mg per os ou IV) puis dose d'entretien quotidienne.
- **Anti-P2Y12 :** **Clopidogrel** (ou autre agent selon le type de SCA et la stratégie invasive).
- **Anticoagulation parentérale :** À posologie adaptée à la fonction rénale et au poids.

### Traitement complémentaire et stratégie invasive :
- Bêtabloquant précoce en l'absence de signes d'insuffisance cardiaque aiguë ou de bradycardie.
- Statine à forte intensité adaptée à la tolérance.
- La décision d'une coronarographie d'urgence doit reposer sur l'état fonctionnel, les comorbidités et les souhaits du patient, et non sur l'âge civil isolé.`
    },
    {
      num: 17,
      registreId: "reg-2",
      title: "Hypoglycémie aiguë du sujet âgé",
      isUrgent: true,
      summary: "Resucrage per os (15-20g) ou Glucose IV / Glucagon, vigilance sur dénutrition et enquête étiologique.",
      content: `### Prise en charge immédiate
- **Patient conscient :**
  - Resucrage immédiat par environ **15 à 20 g de glucides d'action rapide** (3 à 4 morceaux de sucre ou jus de fruit).
  - Contrôle glycémique après 15 minutes, à répéter si nécessaire.
  - Fournir ensuite une source de glucides lents pour éviter une rechute.
- **Trouble de la conscience ou coma :**
  - **Glucose intraveineux concentré (G30%)** d'urgence par voie veineuse.
  - À défaut d'accès veineux, **Glucagon 1 mg IM/SC** (attention : efficacité potentiellement diminuée chez le patient très dénutri aux réserves glycogéniques épuisées).

### Enquête étiologique obligatoire :
Rechercher un surdosage en sulfamide hypoglycémiant (nécessite une surveillance prolongée de 48h car risque d'hypoglycémies récurrentes), une aggravation rénale aiguë, un repas sauté ou des apports diminués. Réévaluer sans délai le traitement antidiabétique.`
    },
    {
      num: 18,
      registreId: "reg-2",
      title: "Rétention aiguë d'urine (RAU)",
      isUrgent: true,
      summary: "Diagnostic clinique / Bladder scan, drainage vésical d'urgence et enquête étiologique (médicaments anticholinergiques, fécalome).",
      content: `### Tableau clinique
Impossibilité brutale d'uriner, douleur pelvienne intense avec masse hypogastrique mate à la percussion (globe vésical), ou état confusionnel aigu chez le patient non communicant.  
*Confirmation :* Échographie sus-pubienne ou bladder scan au lit du patient.

### Geste d'urgence
- **Drainage vésical immédiat :** Pose d'une sonde urinaire à demeure ou cathéter sus-pubien selon les règles d'asepsie rigoureuses.
- Surveiller la diurèse après la vidange vésicale (risque de syndrome de levée d'obstacle avec polyurie massive et déshydratation).

### Recherche étiologique systématique :
- **Fécalome ou constipation sévère** (compression mécanique de l'urètre) ;
- **Médicaments iatrogènes :** Molécules à effet anticholinergique, opioïdes, benzodiazépines ;
- Hypertrophie bénigne de la prostate (HBP) ou prostatite aiguë ;
- Infection urinaire fébrile.  
*Chez l'homme avec HBP :* Un alpha-bloquant (tamsulosine) peut être introduit avant d'envisager le retrait de la sonde.`
    },
    {
      num: 19,
      registreId: "reg-2",
      title: "Déshydratation aiguë du sujet âgé",
      isUrgent: true,
      summary: "Déshydratation extra vs intracellulaire, hypodermoclyse sous-cutanée, risque d'OAP et suspension médicamenteuse.",
      content: `### Formes cliniques
- **Déshydratation extracellulaire :** Hypotension artérielle, tachycardie, pli cutané sous-claviculaire, oligurie, perte de poids rapide.
- **Déshydratation intracellulaire :** Sécheresse des muqueuses (face interne des joues), soif (souvent émoussée chez le vieillard), somnolence, hypernatrémie.

### Modalités de réhydratation
- **Voie orale :** Toujours privilégiée si le patient est conscient et déglutit sans fausse route.
- **Hypodermoclyse (perfusion sous-cutanée) :** Excellente technique très bien tolérée chez le sujet âgé fragile en l'absence d'urgence hémodynamique (500 à 1 500 mL/jour de sérum salé isotonique ou glucosé).
- **Voie intraveineuse :** Nécessaire en cas de choc, collapsus ou déshydratation sévère.
- ⚠️ **Prudence :** Adapter les volumes au statut cardiologique pour éviter la surcharge volémique et l'OAP. En cas d'hypernatrémie, la correction doit être lente et progressive.

### Médicaments à suspendre temporairement :
Suspendre immédiatement diurétiques, IEC, ARA2, gliflozines, metformine et AINS jusqu'à normalisation clinique et biologique.`
    },
    {
      num: 20,
      registreId: "reg-2",
      title: "Douleur aiguë chez le sujet âgé",
      isUrgent: false,
      summary: "Traitement précoce pour prévenir le delirium, posologie adaptée de Paracétamol, titration des opioïdes et AINS proscrits.",
      content: `### Urgence thérapeutique de la douleur :
Une douleur aiguë non ou insuffisamment soulagée est un facteur déclenchant majeur de **delirium (confusion)**, d'agitation, d'immobilisation au lit et de perte rapide d'autonomie fonctionnelle.

### Prise en charge médicamenteuse
- **Paracétamol :** Traitement de base, à posologie adaptée (espacer les prises de 6 heures, dose maximale 2 à 3 g/jour chez le sujet dénutri).
- **Opioïdes :** En cas de douleur sévère (fracture, colique néphrétique, ischémie), les morphiniques peuvent être utilisés à posologie initiale très réduite avec titration prudente.
  - Privilégier des formes à libération immédiate (morphine ou oxycodone).
  - Prévenir obligatoirement la constipation par un laxatif osmotique.
  - Surveiller fréquence respiratoire, niveau de sédation et conscience.
- ⛔ **AINS systémiques :** À proscrire ou utiliser avec une extrême réserve chez la personne âgée polypathologique.`
    },
    {
      num: 21,
      registreId: "reg-3",
      title: "Fragilité gériatrique",
      isUrgent: false,
      summary: "Diminution des réserves physiologiques, dépistage des critères de fragilité et plan personnalisé d'intervention.",
      content: `### Concept de fragilité
La fragilité correspond à une diminution des réserves physiologiques de l'organisme, exposant la personne âgée à un risque considérablement accru de chutes, d'hospitalisations imprévues, de dépendance et d'événements indésirables lors d'un stress mineur.

### Éléments d'alerte à rechercher activement :
- Perte de poids involontaire récente ;
- Fatigue chronique déclarée ou asthénie ;
- Faiblesse musculaire (diminution de la force de préhension) ;
- Ralentissement franc de la vitesse de marche ;
- Réduction significative de l'activité physique habituelle.

### Prise en charge globale et multidisciplinaire :
- **Activité Physique Adaptée (APA) :** Renforcement musculaire des membres inférieurs et travail régulier de l'équilibre.
- **Optimisation nutritionnelle :** Apports protéiques et caloriques suffisants.
- **Révision médicamenteuse systématique :** Allègement de l'ordonnance et arrêt des molécules sédatives ou hypotensives.
- Dépistage précoce des déficits sensoriels (audition, vision).`
    },
    {
      num: 22,
      registreId: "reg-3",
      title: "Chutes et troubles de l'équilibre",
      isUrgent: false,
      summary: "Bilan post-chute, traumatisme crânien sous anticoagulant (scanner urgent), rééducation et sécurisation du domicile.",
      content: `### Bilan étiologique post-chute
- Rechercher hypotension orthostatique, faiblesse musculaire, troubles visuels, pathologies vestibulaires ou articulaires ;
- Identifier les médicaments favorisant les chutes (psychotropes, antihypertenseurs, anticholinergiques) ;
- Éliminer une cause aiguë déclenchante : SCA, trouble du rythme, AVC, déshydratation ou infection.

### 🚨 Alerte traumatisme crânien :
**Toute chute avec traumatisme crânien chez une personne âgée traitée par anticoagulant ou antiagrégant plaquettaire impose un scanner cérébral urgent**, même en l'absence totale de perte de connaissance ou de symptôme neurologique initial (risque majeur d'hématome sous-dural retardé).

### Mesures de prévention pérennes :
- Programme d'exercices physiques et de kinésithérapie ciblé sur l'équilibre ;
- Correction de l'acuité visuelle et adaptation des verres ;
- Sécurisation du logement (retrait des tapis glissants, éclairage nocturne automatique, barres d'appui dans la salle de bain) ;
- Allègement drastique des médicaments sédatifs et psychotropes.`
    },
    {
      num: 23,
      registreId: "reg-3",
      title: "Dénutrition protéino-énergétique",
      isUrgent: false,
      summary: "Dépistage, évaluation du poids et de l'IMC, alimentation enrichie en première intention et compléments nutritionnels oraux.",
      content: `### Dépistage systématique
- Pesée régulière à chaque consultation ;
- Calcul de l'IMC et mesure de la cinétique de perte de poids (perte ≥ 5% en 1 mois ou ≥ 10% en 6 mois = dénutrition sévère) ;
- Rechercher difficultés de mastication, état de la dentition, sécheresse buccale, difficultés de déglutition, dépression ou isolement social.

### Stratégie nutritionnelle par étapes :
1. **Alimentation enrichie naturelle :**
   - Augmenter la densité calorique et protéique des repas usuels sans en augmenter le volume (ajout de fromage râpé, poudre de lait, beurre, crème fraîche, œufs dans les potages et purées).
   - Fractionnement des prises alimentaires (3 repas + 2 collations).
2. **Compléments Nutritionnels Oraux (CNO) :**
   - Indiqués lorsque l'enrichissement alimentaire demeure insuffisant.
   - À prescrire à distance des repas (en collation à 10h et 16h) pour ne pas couper l'appétit du repas principal.
   - Adapter les textures en cas de troubles de déglutition.`
    },
    {
      num: 24,
      registreId: "reg-3",
      title: "Escarres / Lésions de pression",
      isUrgent: false,
      summary: "Facteurs de risque, prévention par changements de position et matelas adaptés, décharge et soins locaux.",
      content: `### Populations à très haut risque :
Personnes âgées alitées ou dépendantes au fauteuil, dénutries, incontinentes ou présentant des troubles de la sensibilité et de la vigilance.

### Prévention (Clé de voûte) :
- **Mobilisation fréquente et changements réguliers de position** (au minimum toutes les 2 à 3 heures) ;
- Utilisation de **supports adaptés** (matelas et coussins anti-escarres à air ou mousse viscoélastique) ;
- Protection cutanée et contrôle de l'humidité (changement rapide des protections d'incontinence) ;
- Optimisation des apports nutritionnels protéiques et hydriques.

### Traitement des lésions constituées :
- **Décharge totale et permanente de la zone lésée** (sans décharge, aucun pansement ne permet la cicatrisation) ;
- Soins locaux avec pansements modernes adaptés au stade de l'escarre (hydrocellulaires, hydrogels) ;
- Contrôle rigoureux de la douleur lors des pansements ;
- ⚠️ **Pas d'antibiothérapie générale systématique** en l'absence de signes d'infection locale profonde ou systémique cliniquement documentée.`
    },
    {
      num: 25,
      registreId: "reg-3",
      title: "Hypertrophie bénigne de la prostate (HBP)",
      isUrgent: false,
      summary: "Symptômes du bas appareil urinaire, alpha-bloquants et risque de chutes, indications de recours à l'urologue.",
      content: `### Symptômes révélateurs :
Dysurie, jet urinaire faible ou haché, pollakiurie diurne, nycturie fréquente, mictions impérieuses et sensation de vidange vésicale incomplète.

### Mesures hygiéno-diététiques simples :
- Diminuer la prise de boissons après 18h le soir ;
- Limiter les boissons irritantes pour la vessie (café, thé, alcool) ;
- Réévaluer et éliminer les médicaments aggravants (anticholinergiques, diurétiques pris tardivement).

### Traitements médicamenteux :
- **Alpha-bloquants (ex: Tamsulosine) :** Améliorent rapidement le débit urinaire.  
  ⚠️ **Vigilance gériatrique majeure :** Risque marqué d'hypotension orthostatique, de malaises et de chutes traumatiques.
- **Inhibiteurs de la 5-alpha réductase :** Utilisés pour réduire le volume prostatique au long cours.

### 🚩 Signaux imposant une évaluation urologique :
Épisode de rétention aiguë d'urine, hématurie macroscopique, insuffisance rénale obstructive ou infections urinaires récidivantes.`
    },
    {
      num: 26,
      registreId: "reg-3",
      title: "Maladie rénale chronique du sujet âgé",
      isUrgent: false,
      summary: "Piège de la créatinine isolée chez le patient sarcopénique, adaptation des doses et prévention de l'insuffisance rénale aiguë.",
      content: `### Particularités diagnostiques
- Chez le vieillard, la perte de masse musculaire (sarcopénie) entraîne une production réduite de créatinine endogène : une **créatinine sérique normale peut masquer un DFG effondré**.
- L'estimation du DFG (par les formules Cockcroft-Gault ou CKD-EPI) est obligatoire avant toute prescription médicamenteuse.
- Rechercher systématiquement HTA, diabète, albuminurie et antécédents d'épisodes de défaillance rénale aiguë.

### Adaptation et protection néphrologique :
- Adapter individuellement la posologie de toutes les molécules à élimination rénale ;
- Éviter les associations synergiques délétères (ex: AINS + diurétique + IEC/ARA2 = « triple whammy » hautement pourvoyeur d'anurie aiguë) ;
- Hydratation suffisante et surveillance biologique régulière de la créatininémie et de la kaliémie.`
    },
    {
      num: 27,
      registreId: "reg-3",
      title: "BPCO et exacerbation respiratoire du sujet âgé",
      isUrgent: false,
      summary: "Vérification rigoureuse de la technique d'inhalation, traitement de fond adapté, détection des signes d'épuisement.",
      content: `### Prise en charge chronique
- Sevrage tabagique impératif ;
- Vaccinations complètes (grippe, pneumocoque) ;
- Bronchodilatateurs inhalés adaptés (LAMA, LABA) ;
- **Vérification régulière de la technique d'inhalation :** Les troubles cognitifs ou la faiblesse inspiratoire rendent souvent l'utilisation des sprays classiques inefficace (privilégier les chambres d'inhalation ou dispositifs adaptés).

### Prise en charge des exacerbations :
- Rechercher le facteur déclenchant (infection bronchique, survenue d'un OAP associé, embolie pulmonaire) ;
- Majorer les bronchodilatateurs à action rapide ;
- Corticothérapie courte par voie orale (**Prednisone 40 mg/jour pendant 5 jours**) ;
- 🚨 **Signes de gravité imposant le transfert d'urgence :** Détresse respiratoire aiguë, tirage, cyanose, désaturation SpO2 < 88%, troubles de la conscience ou somnolence (hypercapnie).`
    },
    {
      num: 28,
      registreId: "reg-3",
      title: "Arthrose et douleur ostéoarticulaire",
      isUrgent: false,
      summary: "Socle non pharmacologique (APA, kiné, perte de poids), place des AINS topiques et prudence AINS per os.",
      content: `### Mesures non médicamenteuses fondamentales :
- Activité physique adaptée régulière et maintien de la marche ;
- Renforcement musculaire péri-articulaire et kinésithérapie ;
- Aménagement ergonomique et aides techniques à la marche (canne) ;
- Lutte contre la surcharge pondérale.

### Traitements médicamenteux raisonnés :
- **AINS topiques (gels/emplâtres) :** Première intention dans les arthroses superficielles (genoux, mains), sans toxicité rénale ni gastrique systémique.
- **Paracétamol :** En cure courte lors des accès douloureux.
- ⛔ **AINS par voie générale :** À éviter formellement chez la personne âgée fragile ou à limiter à des cures ultra-courtes de 48-72h après bilan de sécurité rigoureux.`
    },
    {
      num: 29,
      registreId: "reg-3",
      title: "Dyslipidémie et prévention cardiovasculaire",
      isUrgent: false,
      summary: "Statines en prévention secondaire, prudence sur les myalgies et chutes, individualisation en prévention primaire.",
      content: `### Individualisation de la stratégie thérapeutique
Prendre en compte le risque cardiovasculaire global, l'espérance de vie, les comorbidités, le statut de fragilité et la polymédication.

### Prévention secondaire (après infarctus, AVC ischémique, AOMI) :
- Les **statines** constituent un pilier éprouvé pour réduire les récidives cardiovasculaires, sous réserve d'une bonne tolérance clinique.
- Surveiller étroitement l'apparition de myalgies, de crampes ou de faiblesse musculaire risquant de précipiter des chutes.

### Prévention primaire chez le grand vieillard :
- L'instauration d'un traitement hypolipémiant chez les personnes de plus de 80-85 ans sans antécédent vasculaire n'est généralement pas recommandée ;
- Réévaluer régulièrement la pertinence de poursuivre un traitement hypolipémiant chez le patient très fragile ou dénutri.`
    },
    {
      num: 30,
      registreId: "reg-3",
      title: "Reflux gastro-œsophagien (RGO) chez le sujet âgé",
      isUrgent: false,
      summary: "Mesures positionnelles et alimentaires, posologie minimale efficace d'IPP et recherche des signaux d'alarme néoplasiques.",
      content: `### Mesures simples de première intention :
- Fractionner les repas et éviter les dîners trop tardifs ou copieux ;
- Surélever la tête du lit de 15 cm en cas de pyrosis nocturne ;
- Réduire les aliments irritants connus.

### Utilisation raisonnée des IPP (Oméprazole, Pantoprazole) :
- Utiliser la **posologie minimale efficace** pour une durée bien délimitée.
- ⚠️ Éviter les prescriptions indéfinies au long cours sans réévaluation (risques associés : malabsorption de la vit B12, hypomagnésémie, infections à *Clostridioides difficile*, fractures ostéoporotiques).

### 🚩 Signaux d'alarme imposant une endoscopie digestive haute :
Dysphagie (sensation d'accrochage alimentaire), odynophagie, anémie inexpliquée, saignement extériorisé ou amaigrissement rapide.`
    },
    {
      num: 31,
      registreId: "reg-3",
      title: "Polymédication, iatrogénie et critères STOPP/START",
      isUrgent: false,
      summary: "Dépistage des prescriptions inappropriées, cascades médicamenteuses, grille STOPP/START v3 (2023) et démarche de déprescription.",
      content: `### L'enjeu de la polymédication en gériatrie :
La polymédication (prise simultanée de 5 médicaments ou plus, et hyperpolymédication à >= 10 molécules) expose la personne âgée à un risque exponentiel d'effets indésirables, d'interactions médicamenteuses délétères, de chutes avec fractures, de confusion mentale aiguë, d'insuffisance rénale et d'hospitalisations évitables.

### Démarche méthodique de révision d'ordonnance :
- Rechercher les traitements sans indication clinique actuelle ou dont l'indication initiale a disparu ;
- Traquer les doublons thérapeutiques et les cascades iatrogènes (médicament prescrit pour traiter l'effet indésirable méconnu d'un autre médicament) ;
- Vérifier l'adéquation rigoureuse des posologies au Débit de Filtration Glomérulaire (DFG estimé par la formule de Cockcroft-Gault) ;
- Utiliser les outils d'aide à la décision validés internationalement : **Critères STOPP/START v3 (2023)** et critères de **Beers 2023**.

### Tableau de synthèse des critères STOPP v3 & START v3 par système d'organes :

| Système d'organes | STOPP v3 (Prescriptions à proscrire / déprescrire) | START v3 (Prescriptions à initier / optimiser) |
| :--- | :--- | :--- |
| **Cardiovasculaire** | **Aspirine en prévention primaire** sans atteinte athéromateuse (sur-risque hémorragique supérieur au bénéfice) | **AOD ou AVK** si FA non valvulaire avec CHA2DS2-VASc >= 2 (prévention de l'AVC cardio-embolique) |
| **Cardiovasculaire** | **Digoxine > 125 µg/j** ou si DFG < 30 mL/min (marge étroite, risque d'arythmie ventriculaire) | **IEC ou ARA2** dans l'IC à fraction d'éjection réduite (IC-FEr) ou post-IDM |
| **Cardiovasculaire** | **Bêtabloquant + Vérapamil / Diltiazem** (risque majeur de BAV complet, bradycardie et collapsus) | **Bêtabloquant cardio-sélectif** (bisoprolol, carvédilol) si IC-FEr stable ou angor documenté |
| **Cardiovasculaire** | **Antihypertenseurs d'action centrale** (clonidine, moxonidine : somnolence, hypotension, effet rebond) | **Statine** en prévention secondaire cardiovasculaire avérée si espérance de vie > 1 an |
| **Système Nerveux Central** | **Benzodiazépines & Z-drugs > 4 semaines** (somnolence, troubles mnésiques, chutes, fractures) | **ISRS** (sertraline, escitalopram) en 1ère intention si épisode dépressif caractérisé avéré |
| **Système Nerveux Central** | **Antipsychotiques** dans les démences pour symptômes bénins (triplement du risque d'AVC et surmortalité) | **L-Dopa ou agoniste dopaminergique** dans la maladie de Parkinson si gêne motrice invalidante |
| **Système Nerveux Central** | **Antidépresseurs tricycliques** (effets anticholinergiques : confusion, rétention d'urine, glaucome) | — |
| **Système Nerveux Central** | **Antihistaminiques H1 sédatifs** (hydroxyzine, prométhazine en hypnotiques : sédation résiduelle, chutes) | — |
| **Gastro-intestinal** | **IPP pleine dose > 8 semaines** sans indication prouvée (risque de C. difficile, fractures, carence B12) | **IPP de coprotection** si AINS au long cours, double antiagrégation ou antécédent d'ulcère |
| **Gastro-intestinal** | **Huile de paraffine au long cours** (pneumopathie lipidique d'inhalation et malabsorption des vit. A, D, E, K) | **Laxatif osmotique** (macrogol) ou mucilage systématique sous traitement opioïde au long cours |
| **Gastro-intestinal** | **Métoclopramide ou Dompéridone > 5 jours** (dyskinésies extrapyramidales aiguës ou tardives, allongement QT) | — |
| **Musculo-squelettique** | **AINS par voie générale > 3-5 jours** (insuffisance rénale aiguë, décompensation d'IC, poussée d'HTA, UGD) | **Bisphosphonate oral ou IV** chez le patient ostéoporotique avec fracture de fragilité |
| **Musculo-squelettique** | **AINS + IEC/ARA2 + Diurétique** (« triple whammy » : risque foudroyant d'anurie et d'insuffisance rénale) | **Vitamine D + Calcium** chez le sujet âgé ostéoporotique, carencé ou institutionnalisé |
| **Musculo-squelettique** | **Opioïdes forts en 1ère intention** dans l'arthrose chronique non cancéreuse sans palier analgésique | **Allopurinol ou Fébuxostat** si goutte récurrente (>= 2 crises/an), tophi ou lithiase urique |
| **Musculo-squelettique** | **Myorelaxants** (méphénésine, thiocolchicoside : efficacité non démontrée, sédation et risque de chute) | — |
| **Endocrinien & Métabolisme** | **Sulfamides à demi-vie longue** (glibenclamide, glimépiride : hypoglycémies sévères prolongées) | **iSGLT2 (gliflozines)** si DT2 avec coronaropathie, IC ou maladie rénale chronique |
| **Endocrinien & Métabolisme** | **Cibles d'HbA1c trop strictes (< 7.0%)** chez le sujet âgé fragile (surmortalité par hypoglycémies, viser 7.5-8.5%) | **Statine** chez le diabétique âgé de plus de 65 ans avec au moins un autre FRCV |
| **Endocrinien & Métabolisme** | **Œstrogènes systémiques (THM)** débutés après 65 ans (risque accru de thrombose veineuse, AVC et démence) | **Lévothyroxine** en cas d'hypothyroïdie patente confirmée (TSH élevée, T4L basse) |
| **Néphrologie & Urologie** | **Antispasmodiques urinaires anticholinergiques** (oxybutynine si déclin cognitif : confusion, rétention aiguë) | **IEC ou ARA2** si maladie rénale chronique avec protéinurie significative (> 300 mg/g) |
| **Néphrologie & Urologie** | **Alpha-1 bloquants** (tamsulosine si antécédent d'hypotension orthostatique sévère ou de chutes récurrentes) | **Inhibiteur 5-alpha réductase** (finastéride) si HBP volumineuse (> 40 g) symptomatique |
| **Néphrologie & Urologie** | **Diurétique de l'anse à forte dose** pour œdèmes malléolaires isolés sans insuffisance cardiaque (déshydratation) | — |
| **Néphrologie & Urologie** | **Spironolactone à forte dose** si DFG < 30 mL/min ou kaliémie > 5.0 mmol/L (risque d'arrêt cardiaque) | — |

### Démarche pratique de déprescription en 5 étapes :
- **1. Inventaire exhaustif :** Recenser l'ensemble des molécules consommées (ordonnances, spécialistes, automédication, phytothérapie et compléments).
- **2. Ciblage des PIM :** Identifier les prescriptions inappropriées à l'aide de la grille STOPP/START v3 et des critères de Beers 2023.
- **3. Priorisation concertée :** Déterminer avec le patient et son entourage les molécules à arrêter en priorité selon les objectifs de vie et l'espérance de vie.
- **4. Sevrage progressif :** Échelonner l'arrêt molécule par molécule avec réduction progressive des doses pour prévenir les syndromes de sevrage ou de rebond (bêtabloquants, benzodiazépines, IPP).
- **5. Surveillance clinique rapprochée :** Programmer une réévaluation clinique systématique à 4 et 8 semaines pour vérifier l'absence de récidive symptomatique.`
    },
    {
      num: 32,
      registreId: "reg-3",
      title: "Troubles de la déglutition et fausses routes",
      isUrgent: true,
      summary: "Dépistage des signes d'appel, adaptation des textures, posture lors des repas et interdiction d'écraser certaines formes.",
      content: `### Signes d'alerte cliniques de fausse route :
- Toux survenant pendant ou immédiatement après la prise alimentaire ;
- Voix modifiée, rauque ou « mouillée » après déglutition ;
- Allongement inhabituel de la durée des repas (> 45 minutes) ;
- Refus de s'alimenter ou anxiété au moment des repas ;
- Pneumopathies d'inhalation à répétition ou perte de poids inexpliquée.

### Mesures préventives et d'adaptation :
- **Posture :** Installer impérativement le patient en position assise à 90°, tête légèrement fléchie vers l'avant lors de la déglutition.
- Maintenir le patient assis pendant au moins 30 minutes après le repas.
- **Textures :** Adapter la consistance des solides (aliments hachés ou mixés) et épaissir les liquides à l'aide de poudres épaississantes ou proposer de l'eau gélifiée.
- Soins bucco-dentaires rigoureux après chaque repas.

### ⛔ Alerte majeure sur la prise des médicaments :
**Certaines formes galéniques (comprimés à libération prolongée LP, comprimés gastro-résistants ou gélules) NE DOIVENT JAMAIS ÊTRE ÉCRASÉES OU OUVERTES**, sous peine de surdosage massif immédiat ou d'inefficacité par destruction gastrique. Privilégier les formes liquides ou orodispersibles adaptées.`
    }
  ],

  noteIA: `Une intelligence artificielle générative a été utilisée comme outil d'assistance dans la recherche bibliographique, l'organisation de certaines informations et l'amélioration de la rédaction de cet ouvrage. Cette utilisation a été réalisée sous la vigilance des auteurs.`,

  references: [
    "Haute Autorité de Santé (HAS). Recommandations et guides relatifs à la prise en charge de la personne âgée.",
    "Société Française de Gériatrie et Gérontologie (SFGG). Recommandations relatives à la prescription médicamenteuse et à la prévention de la iatrogénie chez le sujet âgé.",
    "O’Mahony D, et al. STOPP/START criteria for potentially inappropriate prescribing in older people (version 3).",
    "American Geriatrics Society. 2023 Updated AGS Beers Criteria® for Potentially Inappropriate Medication Use in Older Adults. J Am Geriatr Soc. 2023.",
    "Collège National des Enseignants de Gériatrie (CNEG). Gériatrie : référentiel pour la préparation des épreuves nationales. Elsevier Masson.",
    "European Society of Cardiology (ESC). Recommandations relatives à l'insuffisance cardiaque.",
    "ESC/EHRA. Recommandations relatives à la fibrillation atriale.",
    "American Diabetes Association. Standards of Care in Diabetes — Older Adults.",
    "Société de Pathologie Infectieuse de Langue Française (SPILF). Recommandations relatives aux infections urinaires et aux pneumonies aiguës communautaires.",
    "Haute Autorité de Santé. Recommandations relatives aux maladies neurocognitives et aux troubles du comportement.",
    "Vidal. Dictionnaire des médicaments, monographies et informations de prescription.",
    "Collège National des Enseignants de Gériatrie. Référentiel de gériatrie."
  ]
};

if (typeof window !== 'undefined') window.GERIATRIE_MANUAL_DATA = GERIATRIE_MANUAL_DATA;
if (typeof module !== 'undefined') module.exports = GERIATRIE_MANUAL_DATA;

