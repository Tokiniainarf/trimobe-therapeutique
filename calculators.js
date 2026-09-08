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
    const times = parseInt(timesPerDay, 10) || 1;
    const conc = syrupConcentrationMgPerMl ? parseFloat(syrupConcentrationMgPerMl) : null;

    if (isNaN(weight) || weight <= 0 || isNaN(dosePerKg) || dosePerKg <= 0) {
      return { error: "Veuillez saisir un poids valide et une posologie en mg/kg/prise." };
    }

    const dosePerTakeMg = Math.round((weight * dosePerKg) * 10) / 10;
    const totalDailyMg = Math.round((dosePerTakeMg * times) * 10) / 10;
    let mlPerTake = null;
    let totalDailyMl = null;

    if (conc && conc > 0) {
      mlPerTake = Math.round((dosePerTakeMg / conc) * 100) / 100;
      totalDailyMl = Math.round((totalDailyMg / conc) * 100) / 100;
    }

    return {
      weight,
      dosePerTakeMg,
      totalDailyMg,
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
    let creat = parseFloat(creatinemia);

    if (isNaN(age) || age < 18 || isNaN(weight) || weight <= 0 || isNaN(creat) || creat <= 0) {
      return { error: "Veuillez renseigner un âge (≥18 ans), un poids et une créatininémie valides." };
    }

    // Normalisation en µmol/L
    let creatUmol = creat;
    if (unitCreat === "mg_dl") {
      creatUmol = creat * 88.4;
    } else if (unitCreat === "mg_l") {
      creatUmol = (creat / 10) * 88.4;
    }

    const factor = isFemale ? 1.04 : 1.23;
    const clCr = Math.round(((140 - age) * weight * factor) / creatUmol);

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
    const score = (c ? 1 : 0) + (r ? 1 : 0) + (b ? 1 : 0) + (age65 ? 1 : 0);
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

    return { score, riskLevel, recommendation, alertClass };
  },

  /**
   * 4. Déficit en eau libre (Déshydratation hypernatrémique)
   * Déficit (L) = Facteur * Poids (kg) * ( [Na+]/140 - 1 )
   * Facteur = 0.6 pour homme jeune, 0.5 pour femme ou homme âgé, 0.45 pour femme âgée
   */
  calculateWaterDeficit(weightKg, natremiaMmolL, isElderly = true, isFemale = false) {
    const weight = parseFloat(weightKg);
    const na = parseFloat(natremiaMmolL);

    if (isNaN(weight) || weight <= 0 || isNaN(na) || na <= 140) {
      return { error: "Veuillez saisir un poids valide et une natrémie supérieure à 140 mmol/L." };
    }

    let factor = 0.5;
    if (isElderly) {
      factor = isFemale ? 0.45 : 0.5;
    } else {
      factor = isFemale ? 0.5 : 0.6;
    }

    const deficitLiters = Math.round((factor * weight * ((na / 140) - 1)) * 10) / 10;
    const maxCorrectionPerDayMmol = 10; // correction lente pour éviter œdème cérébral

    return {
      deficitLiters,
      factor,
      natremia: na,
      advice: "La correction de l'hypernatrémie doit être lente et progressive (ne pas baisser la natrémie de plus de 10 à 12 mmol/L par 24 heures afin de prévenir l'œdème cérébral osmotique)."
    };
  },

  /**
   * 5. Convertisseur de Glycémie
   */
  convertGlucose(value, fromUnit) {
    const val = parseFloat(value);
    if (isNaN(val) || val <= 0) return { error: "Valeur de glycémie invalide." };

    let gPerL = 0;
    let mmolL = 0;
    let mgDl = 0;

    if (fromUnit === "g_l") {
      gPerL = val;
      mmolL = val * 5.55;
      mgDl = val * 100;
    } else if (fromUnit === "mmol_l") {
      mmolL = val;
      gPerL = val / 5.55;
      mgDl = (val / 5.55) * 100;
    } else if (fromUnit === "mg_dl") {
      mgDl = val;
      gPerL = val / 100;
      mmolL = (val / 100) * 5.55;
    }

    gPerL = Math.round(gPerL * 100) / 100;
    mmolL = Math.round(mmolL * 10) / 10;
    mgDl = Math.round(mgDl);

    let status = "";
    let alertClass = "";
    if (gPerL < 0.70) {
      status = "HYPOGLYCÉMIE (< 0,70 g/L / < 3,9 mmol/L)";
      alertClass = "danger";
    } else if (gPerL <= 1.10) {
      status = "Normoglycémie à jeun (0,70 - 1,10 g/L)";
      alertClass = "success";
    } else if (gPerL <= 1.25) {
      status = "Hyperglycémie modérée à jeun (1,11 - 1,25 g/L)";
      alertClass = "warning";
    } else {
      status = "Diabète probable si répété à jeun (≥ 1,26 g/L / ≥ 7,0 mmol/L)";
      alertClass = "warning";
    }

    return { gPerL, mmolL, mgDl, status, alertClass };
  }
};

if (typeof window !== 'undefined') window.Calculators = Calculators;
if (typeof module !== 'undefined') module.exports = Calculators;

