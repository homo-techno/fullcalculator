import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const meldScoreCalculator: CalculatorDefinition = {
  slug: "meld-score",
  title: "MELD Score Calculator",
  description: "Free MELD score calculator. Estimate severity of chronic liver disease and prioritize organ allocation using bilirubin, creatinine, and INR.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["meld score", "meld calculator", "liver disease score", "end stage liver", "transplant priority", "hepatology calculator"],
  variants: [
    {
      id: "meld-score",
      name: "MELD Score",
      fields: [
        { name: "bilirubin", label: "Total Bilirubin (mg/dL)", type: "number", placeholder: "e.g. 1.2", min: 0.1, max: 50, step: 0.1 },
        { name: "creatinine", label: "Serum Creatinine (mg/dL)", type: "number", placeholder: "e.g. 1.0", min: 0.1, max: 15, step: 0.01 },
        { name: "inr", label: "INR", type: "number", placeholder: "e.g. 1.1", min: 0.5, max: 20, step: 0.01 },
        { name: "sodium", label: "Serum Sodium (mEq/L)", type: "number", placeholder: "e.g. 140", min: 100, max: 160, step: 1 },
        { name: "dialysis", label: "Dialysis (at least 2x in past week)?", type: "select", options: [{ label: "No", value: "no" }, { label: "Yes", value: "yes" }] },
      ],
      calculate: (inputs) => {
        let bil = inputs.bilirubin as number;
        let cr = inputs.creatinine as number;
        let inr = inputs.inr as number;
        const na = inputs.sodium as number;
        const dialysis = inputs.dialysis === "yes";
        if (!bil || !cr || !inr) return null;
        if (bil < 1) bil = 1;
        if (cr < 1) cr = 1;
        if (cr > 4 || dialysis) cr = 4;
        if (inr < 1) inr = 1;
        const meld = Math.round(10 * (0.957 * Math.log(cr) + 0.378 * Math.log(bil) + 1.120 * Math.log(inr) + 0.643));
        let meldNa = meld;
        if (na) {
          const naClamped = Math.max(125, Math.min(137, na));
          meldNa = Math.round(meld + 1.32 * (137 - naClamped) - 0.033 * meld * (137 - naClamped));
          meldNa = Math.max(meldNa, 6);
          meldNa = Math.min(meldNa, 40);
        }
        let mortality3mo = "";
        if (meld >= 40) mortality3mo = "71.3% 3-month mortality";
        else if (meld >= 30) mortality3mo = "52.6% 3-month mortality";
        else if (meld >= 20) mortality3mo = "19.6% 3-month mortality";
        else if (meld >= 10) mortality3mo = "6.0% 3-month mortality";
        else mortality3mo = "1.9% 3-month mortality";
        return {
          primary: { label: "MELD Score", value: formatNumber(meld, 0) },
          details: [
            { label: "MELD Score", value: formatNumber(meld, 0) },
            { label: "MELD-Na Score", value: na ? formatNumber(meldNa, 0) : "Sodium not provided" },
            { label: "Estimated Mortality", value: mortality3mo },
            { label: "Bilirubin", value: formatNumber(inputs.bilirubin as number, 1) + " mg/dL" },
            { label: "Creatinine", value: formatNumber(inputs.creatinine as number, 2) + " mg/dL" + (dialysis ? " (dialysis)" : "") },
            { label: "INR", value: formatNumber(inputs.inr as number, 2) },
          ],
          note: "MELD score range: 6-40. Higher scores indicate more severe liver disease. MELD-Na incorporates sodium for better prognostication. Used by UNOS for liver transplant prioritization.",
        };
      },
    },
  ],
  relatedSlugs: ["bun-creatinine", "egfr-calculator", "apache-score"],
  faq: [
    { question: "What is the MELD score?", answer: "MELD (Model for End-Stage Liver Disease) predicts 3-month mortality in chronic liver disease using bilirubin, creatinine, and INR. It is used to prioritize liver transplant candidates." },
    { question: "What is MELD-Na?", answer: "MELD-Na adds serum sodium to the MELD formula, improving prognostic accuracy. Hyponatremia in liver disease is associated with worse outcomes." },
    { question: "What MELD score requires transplant consideration?", answer: "Patients are generally listed for transplant with MELD >= 15. Higher scores receive priority. MELD >= 25 indicates significant mortality risk without transplant." },
  ],
  formula: "MELD = 10 x (0.957 x ln(Cr) + 0.378 x ln(Bil) + 1.120 x ln(INR) + 0.643)",
};
