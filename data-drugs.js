/**
 * BASE DE DONNÉES DES DCI (MÉDICAMENTS COURANTS & GÉRIATRIE)
 * Données issues du Chapitre XLV du Manuel Général et des fiches de Gériatrie
 */

const DRUGS_DATA = [
  {
    dci: "Amlodipine",
    class: "Inhibiteur calcique dihydropyridinique",
    indication: "Hypertension artérielle, angor d'effort",
    dosage: "5 à 10 mg/jour en une prise le matin",
    precautions: "Œdèmes des membres inférieurs fréquents, hypotension orthostatique, céphalées.",
    renalAdaptation: false,
    renalNote: "Pas d'adaptation nécessaire en cas d'insuffisance rénale.",
    geriatricRisk: "Modéré (surveiller œdèmes et hypotension orthostatique)",
    manuals: ["general", "geriatrie"]
  },
  {
    dci: "Amoxicilline",
    class: "Bêta-lactamine / Pénicilline du groupe A",
    indication: "Pneumonies communautaires, angines à SGA, OMA, infections cutanées",
    dosage: "Adulte : 500 mg à 1 g, 2 à 3 fois/j. Enfant : 50 à 90 mg/kg/j selon foyer.",
    precautions: "Allergie aux pénicillines (rash, anaphylaxie), diarrhée banale.",
    renalAdaptation: true,
    renalNote: "Adapter l'intervalle des prises si DFG < 30 mL/min.",
    geriatricRisk: "Faible (molécule Access OMS)",
    manuals: ["general", "geriatrie"]
  },
  {
    dci: "Amoxicilline / acide clavulanique",
    class: "Bêta-lactamine + inhibiteur de bêta-lactamase",
    indication: "Sinusites aiguës, PAC du sujet âgé, infections polymicrobiennes",
    dosage: "1 g/125 mg 2 à 3 fois/jour selon gravité et protocole.",
    precautions: "Hépatotoxicité cholestatique, diarrhées fréquentes, mycoses secondaires.",
    renalAdaptation: true,
    renalNote: "Adapter les doses ou l'intervalle si DFG < 30 mL/min.",
    geriatricRisk: "Modéré (risque accru de diarrhée à C. difficile et d'ictère)",
    manuals: ["general", "geriatrie"]
  },
  {
    dci: "Apixaban",
    class: "Anticoagulant oral direct (AOD) / Anti-Xa",
    indication: "Prévention des AVC dans la fibrillation atriale non valvulaire, TVP/EP",
    dosage: "5 mg 2 fois/jour. Réduction à 2,5 mg 2 fois/j si critères.",
    precautions: "Surveillance fonction rénale et risque hémorragique. Pas d'AOD si prothèse valvulaire mécanique.",
    renalAdaptation: true,
    renalNote: "Réduire à 2,5 mg x 2/j si créatinine ≥ 133 µmol/L (associée à l'âge ≥80 ou poids ≤60kg) ou DFG 15-29 mL/min.",
    geriatricRisk: "Élevé (surveiller observance, chutes avec TC, interactions)",
    manuals: ["general", "geriatrie"]
  },
  {
    dci: "Atorvastatine",
    class: "Inhibiteur de l'HMG-CoA réductase (Statine)",
    indication: "Dyslipidémie, prévention cardiovasculaire secondaire post-SCA",
    dosage: "10 à 20 mg/j (intensité modérée) ; 40 à 80 mg/j (forte intensité)",
    precautions: "Myalgies, rhabdomyolyse rare, surveillance transaminases hépatiques.",
    renalAdaptation: false,
    renalNote: "Pas d'adaptation rénale nécessaire.",
    geriatricRisk: "Modéré (attention à la faiblesse musculaire et au risque de chute chez le grand vieillard)",
    manuals: ["general", "geriatrie"]
  },
  {
    dci: "Azithromycine",
    class: "Macrolide",
    indication: "Infections respiratoires atypiques, urétrites, alternative pénicillines",
    dosage: "500 mg à J1 puis 250 mg/j de J2 à J5 (ou 500 mg/j pendant 3 jours)",
    precautions: "Allongement de l'intervalle QT (risque de torsade de pointes), interactions cytochrome P450.",
    renalAdaptation: false,
    renalNote: "Prudence si DFG très bas (< 10 mL/min).",
    geriatricRisk: "Modéré (risque cardiaque sur QT long préexistant ou hypokaliémie)",
    manuals: ["general"]
  },
  {
    dci: "Bisoprolol",
    class: "Bêtabloquant cardio-sélectif (bêta-1)",
    indication: "Insuffisance cardiaque FEVG altérée, HTA, contrôle de fréquence dans la FA",
    dosage: "IC : début 1,25 mg/j, titration progressive jusqu'à 10 mg/j. HTA/FA : 2,5 à 10 mg/j.",
    precautions: "Bradycardie excessive, hypotension, bronchospasme (asthme sévère), masquage des signes d'hypoglycémie.",
    renalAdaptation: true,
    renalNote: "Adapter la dose maximale si DFG < 20 mL/min (max 10 mg/j).",
    geriatricRisk: "Modéré (rechercher bradycardie < 50 bpm et hypotension orthostatique)",
    manuals: ["general", "geriatrie"]
  },
  {
    dci: "Budésonide",
    class: "Corticostéroïde inhalé (CSI)",
    indication: "Traitement de fond de l'asthme et de la BPCO sévère",
    dosage: "200 à 800 µg/jour selon dispositif et palier thérapeutique",
    precautions: "Candidose oropharyngée, dysphonie (rincer systématiquement la bouche après inhalation).",
    renalAdaptation: false,
    renalNote: "Pas d'adaptation rénale.",
    geriatricRisk: "Faible (vérifier la bonne technique d'inhalation et la préhension)",
    manuals: ["general"]
  },
  {
    dci: "Cétirizine",
    class: "Antihistaminique H1 de 2e génération",
    indication: "Urticaire aiguë ou chronique, rhinite allergique",
    dosage: "10 mg une fois par jour le soir",
    precautions: "Somnolence légère possible chez certains patients sensibles.",
    renalAdaptation: true,
    renalNote: "Réduire de 50% la dose si DFG < 50 mL/min.",
    geriatricRisk: "Faible (préféré aux antihistaminiques H1 sédatifs anticholinergiques de 1ère génération)",
    manuals: ["general"]
  },
  {
    dci: "Ceftriaxone",
    class: "Céphalosporine de 3e génération injectable (C3G)",
    indication: "Pneumonies communautaires hospitalisées, pyélonéphrites sévères, purpura fébrile",
    dosage: "1 à 2 g par jour en IV lente ou IM",
    precautions: "Allergie aux bêtalactamines, biliaire (lithiases pseudo-biliaires à forte dose).",
    renalAdaptation: false,
    renalNote: "Pas d'adaptation si DFG > 10 mL/min (élimination biliaire conjointe).",
    geriatricRisk: "Faible à modéré (molécule injectable de référence)",
    manuals: ["general", "geriatrie"]
  },
  {
    dci: "Ciprofloxacine",
    class: "Fluoroquinolone",
    indication: "Infections urinaires complexes documentées, pyélonéphrites résistantes",
    dosage: "500 mg 2 fois par jour per os",
    precautions: "Tendinopathies (rupture tendon d'Achille), allongement QT, neuropathie périphérique, confusion chez le sujet âgé.",
    renalAdaptation: true,
    renalNote: "Réduire la dose de moitié si DFG < 30 mL/min.",
    geriatricRisk: "Élevé (critères de Beers : confusion mentale, délires, ruptures tendineuses)",
    manuals: ["general", "geriatrie"]
  },
  {
    dci: "Clotrimazole",
    class: "Antifongique imidazolé topique",
    indication: "Mycoses cutanées superficielles, intertrigo, dermatophyties",
    dosage: "Crème à 1%, 2 applications quotidiennes pendant 2 à 4 semaines",
    precautions: "Irritation locale bénigne. Bien sécher les plis après la toilette.",
    renalAdaptation: false,
    renalNote: "Absorption systémique négligeable.",
    geriatricRisk: "Faible",
    manuals: ["general"]
  },
  {
    dci: "Colchicine",
    class: "Anti-inflammatoire spécifique de la goutte",
    indication: "Accès aigu de goutte, prophylaxie des crises lors de l'introduction d'hypo-uricémiant",
    dosage: "Schéma à faible dose : 1 mg d'emblée puis 0,5 mg 1h après (J1), puis 0,5 à 1 mg/j.",
    precautions: "Diarrhée toxique précoce, marge thérapeutique étroite, surdosage potentiellement mortel. Ne jamais associer aux macrolides ou pristinamycine.",
    renalAdaptation: true,
    renalNote: "Contre-indiquée si DFG < 30 mL/min. Réduire drastiquement les doses si DFG 30-50 mL/min.",
    geriatricRisk: "Très élevé (risque d'accumulation foudroyante)",
    manuals: ["general", "geriatrie"]
  },
  {
    dci: "Dapagliflozine",
    class: "Inhibiteur du co-transporteur SGLT2 (Gliflozine)",
    indication: "Diabète de type 2, insuffisance cardiaque à FEVG réduite, maladie rénale chronique",
    dosage: "10 mg une fois par jour le matin",
    precautions: "Risque de mycoses génitales, déshydratation aiguë, hypotension, acidocétose euglycémique rare.",
    renalAdaptation: true,
    renalNote: "Non recommandée pour le contrôle glycémique si DFG < 25 mL/min, mais poursuivie pour la néphroprotection selon RCP.",
    geriatricRisk: "Modéré (attention à la déshydratation lors des épisodes de canicule ou de gastro-entérite)",
    manuals: ["general", "geriatrie"]
  },
  {
    dci: "Dénosumab",
    class: "Anticorps monoclonal anti-RANKL",
    indication: "Ostéoporose post-ménopausique sévère à haut risque fracturaire",
    dosage: "60 mg en injection sous-cutanée tous les 6 mois",
    precautions: "Hypocalcémie (corriger carence en vitamine D au préalable), ostéonécrose de la mâchoire. Ne jamais arrêter sans relais bisphosphonate (effet rebond fracturaire).",
    renalAdaptation: false,
    renalNote: "Utilisable en cas d'insuffisance rénale mais risque majoré d'hypocalcémie sévère (surveillance stricte).",
    geriatricRisk: "Modéré (règle stricte de non-interruption intempestive)",
    manuals: ["geriatrie"]
  },
  {
    dci: "Diazépam",
    class: "Benzodiazépine à demi-vie longue",
    indication: "Crise convulsive prolongée / état de mal (urgence), sevrage alcoolique",
    dosage: "10 mg IV lente ou intra-rectale chez l'adulte selon protocole d'urgence",
    precautions: "Dépression respiratoire, sédation résiduelle majeure, amnésie antérograde.",
    renalAdaptation: false,
    renalNote: "Élimination hépatique principale.",
    geriatricRisk: "Très élevé (Beers : à proscrire en usage régulier, accumulation majeure de métabolites actifs)",
    manuals: ["general", "geriatrie"]
  },
  {
    dci: "Digoxine",
    class: "Digitalique / Glucoside cardiotonique",
    indication: "Ralentissement de la fréquence dans la fibrillation atriale, insuffisance cardiaque congestive",
    dosage: "0,0625 à 0,125 mg/jour selon poids et fonction rénale",
    precautions: "Marge thérapeutique étroite. Surdosage favorisé par l'hypokaliémie et l'insuffisance rénale. Signes d'intoxication : nausées, vomissements, vision jaune (dyschromatopsie), bradycardie extrême.",
    renalAdaptation: true,
    renalNote: "Élimination rénale prédominante : adaptation stricte de posologie et dosage de la digoxinémie.",
    geriatricRisk: "Très élevé (médicament à haut risque gériatrique)",
    manuals: ["general", "geriatrie"]
  },
  {
    dci: "Empagliflozine",
    class: "Inhibiteur de SGLT2",
    indication: "Diabète de type 2, insuffisance cardiaque chronique",
    dosage: "10 mg une fois par jour (jusqu'à 25 mg/j dans le diabète)",
    precautions: "Déshydratation, infections fongiques génitales, acidocétose euglycémique.",
    renalAdaptation: true,
    renalNote: "Adapter selon DFG conformément aux recommandations.",
    geriatricRisk: "Modéré",
    manuals: ["general", "geriatrie"]
  },
  {
    dci: "Escitalopram",
    class: "Antidépresseur ISRS",
    indication: "Épisode dépressif caractérisé du sujet âgé, anxiété généralisée",
    dosage: "Débuter à 5 mg/jour, augmenter à 10 mg/j (max 10 mg chez > 65 ans)",
    precautions: "Hyponatrémie (SIADH), allongement du QT, troubles digestifs en début de traitement.",
    renalAdaptation: false,
    renalNote: "Pas d'adaptation si DFG > 20 mL/min.",
    geriatricRisk: "Modéré (préféré aux tricycliques, surveiller ionogramme sanguin)",
    manuals: ["geriatrie"]
  },
  {
    dci: "Fosfomycine trométamol",
    class: "Antibiotique bactéricide urinaire",
    indication: "Cystite aiguë simple de la femme",
    dosage: "3 g en prise unique le soir au coucher à distance des repas",
    precautions: "Inefficace et formellement contre-indiqué dans la pyélonéphrite.",
    renalAdaptation: false,
    renalNote: "Ne nécessite pas d'adaptation pour la dose unique si DFG > 10 mL/min.",
    geriatricRisk: "Faible (très bien toléré)",
    manuals: ["general", "geriatrie"]
  },
  {
    dci: "Furosémide",
    class: "Diurétique de l'anse",
    indication: "Surcharge hydrosodée, décompensation cardiaque aiguë, OAP, insuffisance rénale oligurique",
    dosage: "Orale : 20 à 80 mg/jour. IV d'urgence : 40 à 120 mg selon réponse.",
    precautions: "Déshydratation extracellulaire, hypokaliémie, hyponatrémie, insuffisance rénale aiguë fonctionnelle, hypotension orthostatique.",
    renalAdaptation: true,
    renalNote: "Augmenter les doses en cas d'insuffisance rénale sévère pour obtenir un effet natriurétique.",
    geriatricRisk: "Élevé (surveiller le poids, les électrolytes et la pression debout)",
    manuals: ["general", "geriatrie"]
  },
  {
    dci: "Gliclazide LP",
    class: "Sulfamide hypoglycémiant à libération prolongée",
    indication: "Diabète de type 2 de l'adulte",
    dosage: "30 mg le matin au petit-déjeuner, titration progressive jusqu'à 120 mg/j",
    precautions: "Hypoglycémie sévère et prolongée, particulièrement en cas de jeûne ou insuffisance rénale.",
    renalAdaptation: true,
    renalNote: "Contre-indiqué en cas d'insuffisance rénale sévère (DFG < 30 mL/min).",
    geriatricRisk: "Élevé (surveillance rigoureuse des repas et signes d'hypoglycémie)",
    manuals: ["general", "geriatrie"]
  },
  {
    dci: "Hydrochlorothiazide",
    class: "Diurétique thiazidique",
    indication: "Hypertension artérielle essentielle en monothérapie ou association",
    dosage: "12,5 à 25 mg une fois par jour le matin",
    precautions: "Hypokaliémie, hyponatrémie sévère chez le sujet âgé, hyperuricémie (crise de goutte).",
    renalAdaptation: true,
    renalNote: "Inefficace comme antihypertenseur lorsque le DFG < 30 mL/min (remplacer par diurétique de l'anse).",
    geriatricRisk: "Modéré (risque hyponatrémique important)",
    manuals: ["general"]
  },
  {
    dci: "Ibuprofène",
    class: "Anti-inflammatoire non stéroïdien (AINS)",
    indication: "Douleurs inflammatoires aiguës, crise migraineuse débutante, lombalgie courte durée",
    dosage: "200 à 400 mg par prise, max 1 200 mg/j pendant 3 à 5 jours",
    precautions: "Ulcère gastrique, saignement digestif, défaillance rénale aiguë, HTA décompensée, contre-indiqué formellement à partir du 6e mois de grossesse.",
    renalAdaptation: true,
    renalNote: "Contre-indiqué si insuffisance rénale préexistante ou déshydratation.",
    geriatricRisk: "Très élevé (critères STOPP / Beers : cause majeure d'hospitalisation évitable)",
    manuals: ["general", "geriatrie"]
  },
  {
    dci: "Ipratropium",
    class: "Bronchodilatateur anticholinergique inhalé de courte durée (SAMA)",
    indication: "Bronchospasme aigu dans l'asthme et les exacerbations de BPCO",
    dosage: "Selon aérosol-doseur ou nébulisation (ex: 0,5 mg en nébulisation d'urgence)",
    precautions: "Glaucome aigu par fermeture de l'angle si projection oculaire, rétention urinaire.",
    renalAdaptation: false,
    renalNote: "Effet local inhalé prépondérant.",
    geriatricRisk: "Faible à modéré (protéger les yeux lors de la nébulisation)",
    manuals: ["general"]
  },
  {
    dci: "Lactulose",
    class: "Laxatif osmotique doux / disaccharide",
    indication: "Constipation chronique, encéphalopathie hépatique",
    dosage: "15 à 30 mL par jour au repas",
    precautions: "Ballonnements, flatulences, crampes abdominales, diarrhée en cas de surdosage.",
    renalAdaptation: false,
    renalNote: "Pas d'absorption systémique significative.",
    geriatricRisk: "Faible",
    manuals: ["general", "geriatrie"]
  },
  {
    dci: "Lévothyroxine",
    class: "Hormone thyroïdienne de substitution (T4)",
    indication: "Hypothyroïdie primitive ou centrale",
    dosage: "Adulte sain : 1,6 µg/kg/j. Sujet âgé ou coronarien : début à 12,5 - 25 µg/j avec titration.",
    precautions: "Prendre impérativement le matin à jeun 30 min avant le petit-déjeuner. Espacer du fer et calcium de 4h. Risque d'angor si escalade trop rapide.",
    renalAdaptation: false,
    renalNote: "Pas d'adaptation requise.",
    geriatricRisk: "Modéré (risque coronarien si titration trop rapide)",
    manuals: ["general", "geriatrie"]
  },
  {
    dci: "Loratadine",
    class: "Antihistaminique H1 de 2e génération",
    indication: "Urticaire, manifestations allergiques",
    dosage: "10 mg une fois par jour",
    precautions: "Excellente tolérance, somnolence très rare.",
    renalAdaptation: false,
    renalNote: "Pas d'adaptation posologique.",
    geriatricRisk: "Faible (sécurisant)",
    manuals: ["general"]
  },
  {
    dci: "Losartan",
    class: "Antagoniste des récepteurs de l'angiotensine II (ARA2)",
    indication: "Hypertension artérielle, protéinurie du diabète",
    dosage: "50 mg une fois par jour (jusqu'à 100 mg/j)",
    precautions: "Hyperkaliémie, hypotension orthostatique, contre-indiqué formellement pendant la grossesse. Ne pas associer à un IEC.",
    renalAdaptation: true,
    renalNote: "Surveillance de la créatinine et de la kaliémie à J7-J15 post-introduction.",
    geriatricRisk: "Modéré",
    manuals: ["general"]
  },
  {
    dci: "Macrogol",
    class: "Laxatif osmotique de référence (Polyéthylène glycol)",
    indication: "Constipation chronique, prévention de la constipation sous opioïdes",
    dosage: "10 à 20 g par jour (1 à 2 sachets) dissous dans un grand verre d'eau",
    precautions: "Exclure un syndrome occlusif avant administration. Excellente tolérance sans ballonnement.",
    renalAdaptation: false,
    renalNote: "Non absorbé par le tractus digestif.",
    geriatricRisk: "Très faible (laxatif de 1er choix en gériatrie)",
    manuals: ["general", "geriatrie"]
  },
  {
    dci: "Metformine",
    class: "Biguanide / Antidiabétique oral",
    indication: "Diabète de type 2 en première intention",
    dosage: "500 mg 1 à 2 fois/j au milieu des repas, titration progressive jusqu'à 2 000 mg/j max",
    precautions: "Troubles digestifs (titrer lentement). Risque rare mais gravissime d'acidose lactique en cas d'insuffisance rénale, déshydratation aiguë ou hypoxie tissulaire.",
    renalAdaptation: true,
    renalNote: "Dose max 1 000 mg/j si DFG 30-59 mL/min. Arrêt strict si DFG < 30 mL/min.",
    geriatricRisk: "Élevé (à suspendre lors de toute infection aiguë ou gastro-entérite)",
    manuals: ["general", "geriatrie"]
  },
  {
    dci: "Métronidazole",
    class: "Antibactérien et antiparasitaire nitro-imidazolé",
    indication: "Infections à germes anaérobies, vaginoses bactériennes, amibiase, giardiase",
    dosage: "500 mg 2 à 3 fois par jour selon indication",
    precautions: "Effet antabuse strict avec les boissons alcoolisées (vomissements violents, bouffées vasomotrices), goût métallique, neuropathies si traitement prolongé.",
    renalAdaptation: false,
    renalNote: "Prudence en cas d'insuffisance rénale terminale.",
    geriatricRisk: "Modéré",
    manuals: ["general"]
  },
  {
    dci: "Mirtazapine",
    class: "Antidépresseur noradrénergique et sérotoninergique spécifique (NaSSA)",
    indication: "Dépression du sujet âgé avec anorexie, amaigrissement et insomnie",
    dosage: "15 à 30 mg par jour le soir au coucher",
    precautions: "Sédation vespérale (recherchée pour le sommeil), prise de poids par stimulation de l'appétit, hyponatrémie.",
    renalAdaptation: true,
    renalNote: "Clairance diminuée si DFG < 30 mL/min (titration prudente).",
    geriatricRisk: "Faible à modéré (très utile dans le profil dépression + cachexie + insomnie)",
    manuals: ["geriatrie"]
  },
  {
    dci: "Nitrofurantoïne",
    class: "Antibactérien urinaire dérivé des nitrofuranos",
    indication: "Cystite aiguë documentée à E. coli",
    dosage: "100 mg 2 fois par jour pendant 5 jours",
    precautions: "Fibrose pulmonaire et neuropathie périphérique en cas d'utilisation prolongée (strictement proscrite en traitement préventif au long cours).",
    renalAdaptation: true,
    renalNote: "Contre-indiquée si DFG < 30-45 mL/min (inefficacité urinaire et toxicité systémique).",
    geriatricRisk: "Modéré à élevé chez l'insuffisant rénal",
    manuals: ["general"]
  },
  {
    dci: "Oméprazole",
    class: "Inhibiteur de la pompe à protons (IPP)",
    indication: "RGO, ulcère gastroduodénal, protection gastrique sous AINS chez patient à haut risque",
    dosage: "20 mg une fois par jour le matin à jeun pendant 4 à 8 semaines",
    precautions: "Limiter la durée. Risque au long cours : malabsorption B12/magnésium, colite à C. difficile, sur-risque fracturaire.",
    renalAdaptation: false,
    renalNote: "Pas d'adaptation posologique requise.",
    geriatricRisk: "Modéré (éviter les prescriptions perpétuelles injustifiées)",
    manuals: ["general", "geriatrie"]
  },
  {
    dci: "Paracétamol",
    class: "Antalgique et antipyrétique (Palier 1 OMS)",
    indication: "Douleur d'intensité légère à modérée, fièvre",
    dosage: "Adulte : 500 mg à 1 g par prise, espacées de 4 à 6h. Max 3-4 g/j (adulte robuste). Max 2-3 g/j (âgé dénutri). Enfant : 10 à 15 mg/kg/prise (max 60 mg/kg/j).",
    precautions: "Hépatotoxicité majeure en cas de surdosage. Attention aux associations contenant du paracétamol.",
    renalAdaptation: true,
    renalNote: "Espacer les prises à 8 heures d'intervalle si DFG < 30 mL/min.",
    geriatricRisk: "Faible (antalgique de référence sous réserve de respecter la dose max réduite)",
    manuals: ["general", "geriatrie"]
  },
  {
    dci: "Périndopril",
    class: "Inhibiteur de l'enzyme de conversion (IEC)",
    indication: "HTA, insuffisance cardiaque à FEVG réduite, post-infarctus",
    dosage: "Début à 2,5 à 5 mg une fois par jour le matin, adaptation progressive",
    precautions: "Toux sèche persistante (spécifique des IEC), hyperkaliémie, hypotension de première prise, angio-œdème rare, formellement contre-indiqué pendant la grossesse.",
    renalAdaptation: true,
    renalNote: "Adapter la posologie au DFG. Contrôle créatinine et kaliémie à J7-J14.",
    geriatricRisk: "Modéré (dépister hypotension orthostatique)",
    manuals: ["general"]
  },
  {
    dci: "Perméthrine 5%",
    class: "Scabicide pyréthrinoïde topique",
    indication: "Traitement de la gale humaine sarcoptique",
    dosage: "Crème à 5%, application corporelle complète du cou aux orteils pendant 8 à 14h. Répéter à J7-J14.",
    precautions: "Traiter impérativement tous les membres du foyer et laver la literie/linge à 60°C. Le prurit résiduel peut persister plusieurs semaines sans être un échec.",
    renalAdaptation: false,
    renalNote: "Usage topique exclusif.",
    geriatricRisk: "Faible (molécule de 1er choix)",
    manuals: ["general"]
  },
  {
    dci: "Prednisone",
    class: "Glucocorticoïde de synthèse / Anti-inflammatoire stéroïdien",
    indication: "Exacerbations aiguës de BPCO/asthme, maladies inflammatoires, Horton",
    dosage: "BPCO : 40 mg/j pendant 5 jours. Asthme : 40 à 50 mg/j pendant 5 à 7 jours.",
    precautions: "Hyperglycémie aiguë, poussée d'HTA, insomnie/agitation, ostéoporose si prolongé. Arrêt progressif indispensable si cure > 3 semaines.",
    renalAdaptation: false,
    renalNote: "Pas d'adaptation posologique spécifique.",
    geriatricRisk: "Élevé (surveillance stricte de la glycémie et de l'état psychique)",
    manuals: ["general", "geriatrie"]
  },
  {
    dci: "Sacubitril / valsartan",
    class: "ARNI (Inhibiteur du récepteur de l'angiotensine et de la néprilysine)",
    indication: "Insuffisance cardiaque chronique à fraction d'éjection ventriculaire gauche réduite",
    dosage: "Dose initiale de 24/26 mg ou 49/51 mg 2 fois/j, titration progressive jusqu'à 97/103 mg 2 fois/j",
    precautions: "Hypotension artérielle, hyperkaliémie, insuffisance rénale. Respecter un wash-out de 36 heures après l'arrêt d'un IEC avant d'introduire.",
    renalAdaptation: true,
    renalNote: "Débuter à la dose minimale si DFG 30-59 mL/min. Expérience limitée si DFG < 30 mL/min.",
    geriatricRisk: "Élevé (titration progressive et surveillance tensionnelle étroite)",
    manuals: ["general", "geriatrie"]
  },
  {
    dci: "Salbutamol",
    class: "Bêta-2 agoniste de courte durée d'action inhalé (SABA)",
    indication: "Bronchospasme aigu dans l'asthme et la BPCO",
    dosage: "100 µg par bouffée, 1 à 2 bouffées selon le besoin",
    precautions: "Tachycardie sinusale, tremblements des extrémités, hypokaliémie à très forte dose. Une surconsommation témoigne d'un sous-traitement de fond.",
    renalAdaptation: false,
    renalNote: "Pas d'adaptation.",
    geriatricRisk: "Faible (vérifier la bonne délivrance via chambre d'inhalation)",
    manuals: ["general"]
  },
  {
    dci: "Sitagliptine",
    class: "Inhibiteur de la dipeptidyl peptidase-4 (iDPP-4 / Gliptine)",
    indication: "Diabète de type 2 en bithérapie ou trithérapie orale",
    dosage: "100 mg une fois par jour le matin",
    precautions: "Excellent profil de sécurité, aucun risque propre d'hypoglycémie. Risque rare de pancréatite aiguë.",
    renalAdaptation: true,
    renalNote: "50 mg/j si DFG 30-49 mL/min ; 25 mg/j si DFG < 30 mL/min.",
    geriatricRisk: "Faible à modéré (molécule très bien tolérée chez le sujet âgé après adaptation au DFG)",
    manuals: ["general", "geriatrie"]
  },
  {
    dci: "Spironolactone",
    class: "Antagoniste des récepteurs des minéralocorticoïdes (ARM) / Diurétique épargneur de potassium",
    indication: "Insuffisance cardiaque FEVG altérée, HTA résistante, ascite cirrhotique",
    dosage: "25 mg une fois par jour (début possible à 12,5 mg/j chez le sujet âgé)",
    precautions: "Hyperkaliémie sévère (potentiellement mortelle si associée à IEC/ARA2 sans suivi), gynécomastie douloureuse.",
    renalAdaptation: true,
    renalNote: "Contre-indiquée si DFG < 30 mL/min ou kaliémie initiale > 5,0 mmol/L.",
    geriatricRisk: "Élevé (surveillance biologique bimensuelle au début)",
    manuals: ["general", "geriatrie"]
  },
  {
    dci: "Sumatriptan",
    class: "Agoniste sélectif des récepteurs 5-HT1B/1D (Triptan)",
    indication: "Traitement spécifique de la crise de migraine et de l'algie vasculaire de la face",
    dosage: "50 mg par voie orale dès l'apparition de la phase céphalalgique (max 100 mg/j)",
    precautions: "Vasospasme coronarien. Contre-indications absolues : cardiopathie ischémique, angor de Prinzmetal, AVC/AIT, HTA sévère ou mal contrôlée.",
    renalAdaptation: false,
    renalNote: "Élimination hépatique.",
    geriatricRisk: "Élevé (fortement déconseillé chez les plus de 65 ans en raison du risque cardiovasculaire)",
    manuals: ["general"]
  }
];

if (typeof window !== 'undefined') window.DRUGS_DATA = DRUGS_DATA;
if (typeof module !== 'undefined') module.exports = DRUGS_DATA;

