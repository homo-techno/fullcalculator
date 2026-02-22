import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const timiScoreCalculator: CalculatorDefinition = {
  slug: "timi-score",
  title: "TIMI Risk Score Calculator",
  description: "Free TIMI Risk Score calculator for acute coronary syndrome. Assess 14-day risk of death, MI, or urgent revascularization in UA/NSTEMI patients.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["timi score", "timi risk score", "acs risk calculator", "nstemi risk", "unstable angina", "cardiac risk stratification"],
  variants: [
    {
      id: "timi-ua-nstemi",
      name: "TIMI Risk Score (UA/NSTEMI)",
      fields: [
        { name: "age65", label: "Age >= 65 years", type: "select", options: [{ label: "No", value: "0" }, { label: "Yes", value: "1" }] },
        { name: "cadRisk", label: ">= 3 CAD Risk Factors", type: "select", options: [{ label: "No", value: "0" }, { label: "Yes (HTN, DM, dyslipidemia, smoking, family Hx)", value: "1" }] },
        { name: "knownCAD", label: "Known CAD (stenosis >= 50%)", type: "select", options: [{ label: "No", value: "0" }, { label: "Yes", value: "1" }] },
        { name: "aspirinUse", label: "Aspirin Use in Past 7 Days", type: "select", options: [{ label: "No", value: "0" }, { label: "Yes", value: "1" }] },
        { name: "anginaEpisodes", label: ">= 2 Angina Episodes in 24 hrs", type: "select", options: [{ label: "No", value: "0" }, { label: "Yes", value: "1" }] },
        { name: "stDeviation", label: "ST Deviation >= 0.5 mm", type: "select", options: [{ label: "No", value: "0" }, { label: "Yes", value: "1" }] },
        { name: "cardiacMarkers", label: "Elevated Cardiac Markers (troponin/CK-MB)", type: "select", options: [{ label: "No", value: "0" }, { label: "Yes", value: "1" }] },
      ],
      calculate: (inputs) => {
        const age = parseInt(inputs.age65 as string);
        const cad = parseInt(inputs.cadRisk as string);
        const known = parseInt(inputs.knownCAD as string);
        const asa = parseInt(inputs.aspirinUse as string);
        const angina = parseInt(inputs.anginaEpisodes as string);
        const st = parseInt(inputs.stDeviation as string);
        const markers = parseInt(inputs.cardiacMarkers as string);
        if (isNaN(age) || isNaN(cad) || isNaN(known) || isNaN(asa) || isNaN(angina) || isNaN(st) || isNaN(markers)) return null;
        const score = age + cad + known + asa + angina + st + markers;
        let risk = "";
        let recommendation = "";
        const riskPct = [4.7, 4.7, 8.3, 13.2, 19.9, 26.2, 40.9, 40.9];
        const pct = riskPct[Math.min(score, 7)];
        if (score <= 2) { risk = "Low risk"; recommendation = "Consider non-invasive testing, conservative management may be appropriate"; }
        else if (score <= 4) { risk = "Intermediate risk"; recommendation = "Consider early invasive strategy, cardiology consultation"; }
        else { risk = "High risk"; recommendation = "Recommend early invasive strategy (angiography within 24-72 hours), cardiology consultation"; }
        return {
          primary: { label: "TIMI Risk Score", value: formatNumber(score, 0) + " / 7" },
          details: [
            { label: "Total Score", value: formatNumber(score, 0) + " / 7" },
            { label: "Risk Level", value: risk },
            { label: "14-Day Event Rate", value: formatNumber(pct, 1) + "%" },
            { label: "Recommendation", value: recommendation },
            { label: "Age >= 65", value: age === 1 ? "Yes (+1)" : "No (0)" },
            { label: ">= 3 Risk Factors", value: cad === 1 ? "Yes (+1)" : "No (0)" },
            { label: "Known CAD", value: known === 1 ? "Yes (+1)" : "No (0)" },
            { label: "Elevated Markers", value: markers === 1 ? "Yes (+1)" : "No (0)" },
          ],
          note: "TIMI Risk Score predicts 14-day risk of death, MI, or urgent revascularization in UA/NSTEMI. Higher scores support early invasive strategy. Always combine with clinical judgment.",
        };
      },
    },
  ],
  relatedSlugs: ["wells-score", "framingham-score", "news-score"],
  faq: [
    { question: "What is the TIMI Risk Score?", answer: "TIMI (Thrombolysis in Myocardial Infarction) Risk Score predicts 14-day risk of death, MI, or urgent revascularization in patients with UA/NSTEMI using 7 clinical variables." },
    { question: "What TIMI score is high risk?", answer: "Scores 5-7 are high risk (26-41% event rate). Scores 3-4 are intermediate. Scores 0-2 are low risk (5-8% event rate)." },
    { question: "How does TIMI score guide treatment?", answer: "Higher scores support an early invasive strategy (cardiac catheterization). Lower scores may be managed with conservative, non-invasive approaches." },
  ],
  formula: "TIMI = Age>=65 + >=3 Risk Factors + Known CAD + ASA Use + >=2 Angina Episodes + ST Deviation + Elevated Markers (0-7)",
};
