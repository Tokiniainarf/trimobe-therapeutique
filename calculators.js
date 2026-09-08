/**
 * CALCULATEURS CLINIQUES ET OUTILS MÉDICAUX INTERACTIFS
 * Collection TRIMOBE & UMSP
 */

const Calculators = {
  /**
   * 1. Calculateur Posologique Pédiatrique
   * Formule : Dose/prise = Poids (kg) * Dose recommandée (mg/kg/prise)
   */
  calculatePediatric(weightKg, dosePerKgPerDose, timesPerDay, syrupConcentrationMgPerMl = null) {
    const weight = parseFloat(weightKg);
    const dosePerKg = parseFloat(dosePerKgPerDose);
    const times = parseInt(timesPerDay, 10);
    const conc = syrupConcentrationMgPerMl !== null && syrupConcentrationMgPerMl !== undefined && syrupConcentrationMgPerMl !== ""
      ? parseFloat(syrupConcentrationMgPerMl)
      : null;

    if (!Number.isFinite(weight) || weight <= 0 || !Number.isFinite(dosePerKg) || dosePerKg <= 0) {
      return { error: "Veuillez saisir un poids valide et une posologie en mg/kg/prise." };
    }

    if (!Number.isFinite(times) || times < 1 || times > 12) {
      return { error: "Veuillez renseigner un nombre de prises valide (entre 1 et 12 par jour)." };
    }

    if (conc !== null && (!Number.isFinite(conc) || conc < 0)) {
      return { error: "Veuillez renseigner une concentration de sirop valide." };
    }

    const dosePerTakeMg = Math.round((weight * dosePerKg) * 10) / 10;
    const totalDailyMg = Math.round((dosePerTakeMg * times) * 10) / 10;
    let mlPerTake = null;
    let totalDailyMl = null;

    if (conc !== null && Number.isFinite(conc) && conc > 0) {
      mlPerTake = Math.round((dosePerTakeMg / conc) * 100) / 100;
      totalDailyMl = Math.round((totalDailyMg / conc) * 100) / 100;
    }

    return {
      weight,
      dosePerTakeMg,
      perDoseMg: dosePerTakeMg,
      totalDailyMg,
      dailyMg: totalDailyMg,
      timesPerDay: times,
      mlPerTake,
      totalDailyMl,
      intervalHours: Math.round(24 / times)
    };
  },

  /**
   * 2. Formule de Cockcroft-Gault (Clairance rénale)
   * ClCr (mL/min) = [ (140 - Age) * Poids (kg) * Facteur ] / [ Créat (µmol/L) ]
   * Facteur = 1.23 pour homme, 1.04 pour femme
   * Si créat en mg/dL : [ (140 - Age) * Poids ] / [ 72 * Créat ] (* 0.85 si femme)
   */
  calculateCockcroft(ageYears, weightKg, creatinemia, unitCreat, isFemale) {
    const age = parseFloat(ageYears);
    const weight = parseFloat(weightKg);
    const creat = parseFloat(creatinemia);

    if (!Number.isFinite(age) || age < 18 || age > 120 || !Number.isFinite(weight) || weight <= 0 || !Number.isFinite(creat) || creat <= 0) {
      return { error: "Veuillez renseigner un âge (18 à 120 ans), un poids et une créatininémie valides." };
    }

    // Normalisation en µmol/L
    let creatUmol = creat;
    if (unitCreat === "mg_dl") {
      creatUmol = creat * 88.4;
    } else if (unitCreat === "mg_l") {
      creatUmol = (creat / 10) * 88.4;
    }

    const factor = isFemale ? 1.04 : 1.23;
    const rawClCr = Math.round(((140 - age) * weight * factor) / creatUmol);
    const clCr = Math.max(0, rawClCr);

    let stage = "";
    let interpretation = "";
    let alertClass = "";

    if (clCr >= 90) {
      stage = "Fonction rénale normale";
      interpretation = "DFG ≥ 90 mL/min. Aucune adaptation de dose généralement requise.";
      alertClass = "success";
    } else if (clCr >= 60) {
      stage = "Insuffisance rénale légère";
      interpretation = "DFG 60-89 mL/min. Surveillance standard.";
      alertClass = "info";
    } else if (clCr >= 30) {
      stage = "Insuffisance rénale modérée";
      interpretation = "DFG 30-59 mL/min. Adaptation nécessaire pour Metformine, AOD, Sitagliptine, antibiotiques.";
      alertClass = "warning";
    } else if (clCr >= 15) {
      stage = "Insuffisance rénale sévère";
      interpretation = "DFG 15-29 mL/min. Contre-indication de nombreux médicaments (Metformine, AINS, Nitrofurantoïne, Colchicine). Avis néphrologique.";
      alertClass = "danger";
    } else {
      stage = "Insuffisance rénale terminale";
      interpretation = "DFG < 15 mL/min. Risque iatrogène vital majeur. Pré-dialyse ou dialyse.";
      alertClass = "danger";
    }

    return {
      clCr,
      stage,
      interpretation,
      note: interpretation,
      alertClass,
      creatUmol: Math.round(creatUmol * 10) / 10,
      isSarcopenicWarning: age >= 75 && creatUmol < 70
    };
  },

  /**
   * 3. Score CRB-65 (Gravité des pneumonies communautaires)
   * C = Confusion (1 pt)
   * R = Fréquence respiratoire ≥ 30/min (1 pt)
   * B = Pression artérielle PAS < 90 ou PAD ≤ 60 mmHg (1 pt)
   * 65 = Âge ≥ 65 ans (1 pt)
   */
  calculateCRB65(c, r, b, age65) {
    const toBool = (v) => Boolean(v === true || v === 1 || (typeof v === 'string' && v.trim() !== '' && v !== 'false' && v !== '0'));
    const score = (toBool(c) ? 1 : 0) + (toBool(r) ? 1 : 0) + (toBool(b) ? 1 : 0) + (toBool(age65) ? 1 : 0);
    let recommendation = "";
    let riskLevel = "";
    let alertClass = "";

    if (score === 0) {
      riskLevel = "Risque faible (Mortalité < 1%)";
      recommendation = "Prise en charge ambulatoire à domicile possible avec surveillance.";
      alertClass = "success";
    } else if (score === 1 || score === 2) {
      riskLevel = "Risque intermédiaire (Mortalité 5 à 10%)";
      recommendation = "Hospitalisation en service de médecine conventionnelle à discuter fortement, surtout si âge ≥ 65 ans ou isolement.";
      alertClass = "warning";
    } else {
      riskLevel = "Risque élevé (Mortalité 15 à 30%)";
      recommendation = "Hospitalisation d'urgence indispensable. Avis en soins intensifs / réanimation requis.";
      alertClass = "danger";
    }

    return {
      score,
      riskLevel,
      risk: riskLevel,
      recommendation,
      action: recommendation,
      alertClass
    };
  },

  /**
   * 4. Déficit en eau libre (Déshydratation hypernatrémique)
   * Déficit (L) = Facteur * Poids (kg) * ( [Na+]/140 - 1 )
   * Facteur = 0.6 pour homme jeune, 0.5 pour femme ou homme âgé, 0.45 pour femme âgée
   */
  calculateWaterDeficit(weightKg, natremiaMmolL, isElderly = true, isFemale = false) {
    const weight = parseFloat(weightKg);
    const na = parseFloat(natremiaMmolL);

    if (!Number.isFinite(weight) || weight <= 0 || !Number.isFinite(na) || na <= 140) {
      return { error: "Veuillez saisir un poids valide et une natrémie supérieure à 140 mmol/L." };
    }

    const elderly = Boolean(isElderly === true || isElderly === 'true' || isElderly === 1 || isElderly === '1');
    const female = Boolean(isFemale === true || isFemale === 'true' || isFemale === 1 || isFemale === '1');

    let factor = 0.5;
    if (elderly) {
      factor = female ? 0.45 : 0.5;
    } else {
      factor = female ? 0.5 : 0.6;
    }

    const deficitLiters = Math.round((factor * weight * ((na / 140) - 1)) * 10) / 10;
    const advice = "La correction de l'hypernatrémie doit être lente et progressive (ne pas baisser la natrémie de plus de 10 à 12 mmol/L par 24 heures afin de prévenir l'œdème cérébral osmotique).";

    return {
      deficitLiters,
      factor,
      natremia: na,
      advice,
      recommendation: advice,
      alert: "Correction maximale recommandée : 10 à 12 mmol/L par 24h.",
      alertClass: "warning"
    };
  },

  /**
   * 5. Convertisseur de Glycémie & Protocole de Resucrage
   * Constante : 1 g/L = 5.55 mmol/L = 100 mg/dL
   */
  convertGlucose(value, fromUnit) {
    const val = parseFloat(value);
    if (!Number.isFinite(val) || val <= 0) return { error: "Valeur de glycémie invalide." };

    if (!fromUnit || typeof fromUnit !== 'string') {
      return { error: "Unité de glycémie invalide (choisir g/L, mmol/L ou mg/dL)." };
    }

    const unitKey = fromUnit.trim().toLowerCase().replace('/', '_');
    if (unitKey !== 'g_l' && unitKey !== 'mmol_l' && unitKey !== 'mg_dl') {
      return { error: "Unité de glycémie invalide (choisir g/L, mmol/L ou mg/dL)." };
    }

    let gPerL = 0;
    let mmolL = 0;
    let mgDl = 0;

    if (unitKey === "g_l") {
      gPerL = val;
      mmolL = val * 5.55;
      mgDl = val * 100;
    } else if (unitKey === "mmol_l") {
      mmolL = val;
      gPerL = val / 5.55;
      mgDl = (val / 5.55) * 100;
    } else if (unitKey === "mg_dl") {
      mgDl = val;
      gPerL = val / 100;
      mmolL = (val / 100) * 5.55;
    }

    gPerL = Math.round(gPerL * 100) / 100;
    mmolL = Math.round(mmolL * 10) / 10;
    mgDl = Math.round(mgDl);

    let status = "";
    let alertClass = "";
    let note = "";

    if (gPerL < 0.70) {
      status = "HYPOGLYCÉMIE (< 0,70 g/L / < 3,9 mmol/L)";
      alertClass = "danger";
      note = "Règle des 15 g de sucre rapide si conscient, sinon G30% IV ou Glucagon IM.";
    } else if (gPerL <= 1.10) {
      status = "Normoglycémie à jeun (0,70 - 1,10 g/L)";
      alertClass = "success";
      note = "Glycémie normale à jeun.";
    } else if (gPerL <= 1.25) {
      status = "Hyperglycémie modérée à jeun (1,11 - 1,25 g/L)";
      alertClass = "warning";
      note = "À recontrôler. Règles hygiéno-diététiques.";
    } else if (gPerL < 2.50) {
      status = "Diabète probable si répété à jeun (≥ 1,26 g/L / ≥ 7,0 mmol/L)";
      alertClass = "warning";
      note = "Bilan du diabète requis (HbA1c, bilan rénal, consultation).";
    } else {
      status = "URGENCE : Hyperglycémie aiguë critique (≥ 2,50 g/L / ≥ 13,9 mmol/L)";
      alertClass = "danger";
      note = "Risque aigu de décompensation acido-cétosique ou de syndrome d'hyperosmolarité. Recherche de cétonurie/glycosurie et avis médical urgent requis.";
    }

    return {
      gPerL,
      mmolL,
      mmolPerL: mmolL,
      mgDl,
      mgPerDl: mgDl,
      status,
      alertClass,
      note
    };
  },

  /**
   * 6. Convertisseur HbA1c ↔ eAG (Estimated Average Glucose)
   * Formules ADAG (Nathan et al., Diabetes Care 2008) :
   * eAG (mg/dL) = 28.7 * HbA1c (%) - 46.7
   * eAG (mmol/L) = 1.59 * HbA1c (%) - 2.59
   * Inverses :
   * HbA1c (%) = (eAG_mg_dl + 46.7) / 28.7
   * HbA1c (%) = (eAG_mmol_l + 2.59) / 1.59
   */
  convertHbA1c(value, fromUnit = "percent") {
    const val = parseFloat(value);
    if (!Number.isFinite(val) || val <= 0) {
      return { error: "Veuillez saisir une valeur numérique strictement positive." };
    }

    let hba1c = 0;
    const unitKey = typeof fromUnit === 'string' ? fromUnit.trim().toLowerCase().replace('/', '_') : 'percent';
    if (unitKey === "percent" || unitKey === "hba1c" || unitKey === "%") {
      hba1c = val;
    } else if (unitKey === "mg_dl" || unitKey === "eag_mgdl") {
      hba1c = (val + 46.7) / 28.7;
    } else if (unitKey === "mmol_l" || unitKey === "eag_mmoll") {
      hba1c = (val + 2.59) / 1.59;
    } else {
      hba1c = val;
    }

    if (!Number.isFinite(hba1c) || hba1c < 3.0 || hba1c > 25.0) {
      return { error: "Valeur hors limites physiologiques plausibles (HbA1c équivalente entre 3,0% et 25,0%)." };
    }

    const eagMgDl = Math.round(28.7 * hba1c - 46.7);
    const eagMmolL = Math.round((1.59 * hba1c - 2.59) * 10) / 10;
    const hba1cPercent = Math.round(hba1c * 10) / 10;

    let targetStatus = "";
    let alertClass = "";
    let note = "";

    if (hba1c < 6.0) {
      targetStatus = "HbA1c < 6,0% : Normoglycémie ou risque de surtraitement";
      alertClass = "info";
      note = "Profil non-diabétique ou risque accru d'hypoglycémie si le patient est sous insuline ou sulfamide.";
    } else if (hba1c < 7.0) {
      targetStatus = "Cible optimale : Adulte jeune / Diabète récent (< 7,0%)";
      alertClass = "success";
      note = "Objectif atteint pour un adulte jeune sans comorbidité cardiovasculaire majeure.";
    } else if (hba1c < 7.5) {
      targetStatus = "Contrôle intermédiaire (7,0 - 7,4%)";
      alertClass = "info";
      note = "Objectif standard pour adulte avec diabète installé ou comorbidités modérées.";
    } else if (hba1c <= 8.5) {
      targetStatus = "Cible adaptée : Sujet âgé fragile (7,5 - 8,5%)";
      alertClass = "warning";
      note = "Cible gériatrique recommandée (HAS / SFGG) pour préserver la qualité de vie et prévenir les chutes hypoglycémiques.";
    } else {
      targetStatus = "Contrôle insuffisant (> 8,5%) - Risque de complications";
      alertClass = "danger";
      note = "Objectif dépassé. Risque élevé de complications micro/macro-vasculaires et de décompensation aiguë.";
    }

    return {
      hba1cPercent,
      eagMgDl,
      eagMmolL,
      targetStatus,
      alertClass,
      note
    };
  }
};

if (typeof window !== 'undefined') window.Calculators = Calculators;
if (typeof module !== 'undefined') module.exports = Calculators;

