import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const wellsScoreCalculator: CalculatorDefinition = {
  slug: "wells-score",
  title: "Wells Score Calculator (DVT/PE)",
  description: "Free Wells Score calculator. Assess clinical probability of deep vein thrombosis (DVT) and pulmonary embolism (PE) to guide diagnostic workup.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["wells score", "wells criteria", "dvt probability", "pulmonary embolism score", "pe probability", "vte risk assessment"],
  variants: [
    {
      id: "wells-dvt",
      name: "Wells Score for DVT",
      fields: [
        { name: "activeCancer", label: "Active cancer (treatment within 6 months or palliative)", type: "select", options: [{ label: "No", value: "0" }, { label: "Yes (+1)", value: "1" }] },
        { name: "paralysis", label: "Paralysis, paresis, or recent cast of lower extremity", type: "select", options: [{ label: "No", value: "0" }, { label: "Yes (+1)", value: "1" }] },
        { name: "bedRest", label: "Bedridden > 3 days or major surgery within 12 weeks", type: "select", options: [{ label: "No", value: "0" }, { label: "Yes (+1)", value: "1" }] },
        { name: "tenderness", label: "Localized tenderness along deep venous system", type: "select", options: [{ label: "No", value: "0" }, { label: "Yes (+1)", value: "1" }] },
        { name: "legSwelling", label: "Entire leg swollen", type: "select", options: [{ label: "No", value: "0" }, { label: "Yes (+1)", value: "1" }] },
        { name: "calfSwelling", label: "Calf swelling > 3 cm compared to other leg", type: "select", options: [{ label: "No", value: "0" }, { label: "Yes (+1)", value: "1" }] },
        { name: "pittingEdema", label: "Pitting edema confined to symptomatic leg", type: "select", options: [{ label: "No", value: "0" }, { label: "Yes (+1)", value: "1" }] },
        { name: "collateralVeins", label: "Collateral superficial veins (non-varicose)", type: "select", options: [{ label: "No", value: "0" }, { label: "Yes (+1)", value: "1" }] },
        { name: "previousDVT", label: "Previously documented DVT", type: "select", options: [{ label: "No", value: "0" }, { label: "Yes (+1)", value: "1" }] },
        { name: "altDiagnosis", label: "Alternative diagnosis as likely or more likely", type: "select", options: [{ label: "No", value: "0" }, { label: "Yes (-2)", value: "-2" }] },
      ],
      calculate: (inputs) => {
        const fields = ["activeCancer","paralysis","bedRest","tenderness","legSwelling","calfSwelling","pittingEdema","collateralVeins","previousDVT","altDiagnosis"];
        let score = 0;
        for (const f of fields) {
          const v = parseInt(inputs[f] as string);
          if (isNaN(v)) return null;
          score += v;
        }
        let probability = "";
        let action = "";
        if (score >= 3) { probability = "High probability (75% prevalence)"; action = "Ultrasound recommended; if negative, consider repeat in 1 week or venography"; }
        else if (score >= 1) { probability = "Moderate probability (17% prevalence)"; action = "D-dimer testing; if positive, proceed to ultrasound"; }
        else { probability = "Low probability (3% prevalence)"; action = "D-dimer testing; if negative, DVT effectively excluded"; }
        return {
          primary: { label: "Wells DVT Score", value: formatNumber(score, 0) },
          details: [
            { label: "Total Score", value: formatNumber(score, 0) },
            { label: "Clinical Probability", value: probability },
            { label: "Recommended Workup", value: action },
            { label: "Score Interpretation", value: score >= 3 ? "DVT likely" : "DVT unlikely" },
          ],
          note: "Wells DVT Score: <= 0 = low, 1-2 = moderate, >= 3 = high probability. Use with D-dimer and/or ultrasound for diagnosis. A negative D-dimer with low/moderate probability effectively rules out DVT.",
        };
      },
    },
    {
      id: "wells-pe",
      name: "Wells Score for PE",
      fields: [
        { name: "dvtSymptoms", label: "Clinical signs/symptoms of DVT", type: "select", options: [{ label: "No", value: "0" }, { label: "Yes (+3)", value: "3" }] },
        { name: "peLikely", label: "PE as likely or more likely than alternative diagnosis", type: "select", options: [{ label: "No", value: "0" }, { label: "Yes (+3)", value: "3" }] },
        { name: "heartRate", label: "Heart rate > 100 bpm", type: "select", options: [{ label: "No", value: "0" }, { label: "Yes (+1.5)", value: "1.5" }] },
        { name: "immobilization", label: "Immobilization (>= 3 days) or surgery in past 4 weeks", type: "select", options: [{ label: "No", value: "0" }, { label: "Yes (+1.5)", value: "1.5" }] },
        { name: "previousPE", label: "Previous PE or DVT", type: "select", options: [{ label: "No", value: "0" }, { label: "Yes (+1.5)", value: "1.5" }] },
        { name: "hemoptysis", label: "Hemoptysis", type: "select", options: [{ label: "No", value: "0" }, { label: "Yes (+1)", value: "1" }] },
        { name: "malignancy", label: "Malignancy (treatment within 6 months or palliative)", type: "select", options: [{ label: "No", value: "0" }, { label: "Yes (+1)", value: "1" }] },
      ],
      calculate: (inputs) => {
        const fields = ["dvtSymptoms","peLikely","heartRate","immobilization","previousPE","hemoptysis","malignancy"];
        let score = 0;
        for (const f of fields) {
          const v = parseFloat(inputs[f] as string);
          if (isNaN(v)) return null;
          score += v;
        }
        let probability = "";
        let action = "";
        if (score > 6) { probability = "High probability"; action = "CTPA recommended; do not delay for D-dimer"; }
        else if (score >= 2) { probability = "Moderate probability"; action = "D-dimer testing; if positive, proceed to CTPA"; }
        else { probability = "Low probability"; action = "D-dimer testing; if negative, PE effectively excluded"; }
        let twoTier = score > 4 ? "PE likely" : "PE unlikely";
        return {
          primary: { label: "Wells PE Score", value: formatNumber(score, 1) },
          details: [
            { label: "Total Score", value: formatNumber(score, 1) },
            { label: "Three-Tier Probability", value: probability },
            { label: "Two-Tier Classification", value: twoTier },
            { label: "Recommended Workup", value: action },
          ],
          note: "Wells PE Score: < 2 = low, 2-6 = moderate, > 6 = high probability. Two-tier: <= 4 unlikely, > 4 likely. Use with D-dimer and/or CTPA for diagnosis.",
        };
      },
    },
  ],
  relatedSlugs: ["timi-score", "framingham-score", "qsofa-score"],
  faq: [
    { question: "What is the Wells Score?", answer: "The Wells Score estimates clinical probability of DVT or PE using clinical criteria. Separate scoring systems exist for DVT (10 criteria) and PE (7 criteria)." },
    { question: "When should D-dimer be ordered?", answer: "D-dimer is most useful in low-to-moderate probability patients. A negative D-dimer with low/moderate Wells score effectively rules out DVT/PE. High probability patients should go directly to imaging." },
    { question: "What is the difference between DVT and PE Wells scores?", answer: "They are separate scoring systems. DVT Wells uses 10 criteria for leg symptoms. PE Wells uses 7 criteria including DVT signs, heart rate, immobilization, and hemoptysis." },
  ],
  formula: "Wells DVT: sum of 10 criteria (-2 to +9) | Wells PE: sum of 7 criteria (0-12.5)",
};
