import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const egfrCalculator: CalculatorDefinition = {
  slug: "egfr-calculator",
  title: "eGFR Calculator (CKD-EPI)",
  description: "Free eGFR calculator using the CKD-EPI 2021 equation. Estimate glomerular filtration rate from serum creatinine, age, and sex for CKD staging.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["egfr calculator", "ckd epi", "glomerular filtration rate", "kidney function", "ckd staging", "renal function calculator"],
  variants: [
    {
      id: "ckd-epi-2021",
      name: "CKD-EPI 2021 (Race-Free)",
      fields: [
        { name: "creatinine", label: "Serum Creatinine (mg/dL)", type: "number", placeholder: "e.g. 1.0", min: 0.1, max: 30, step: 0.01 },
        { name: "age", label: "Age (years)", type: "number", placeholder: "e.g. 55", min: 18, max: 120 },
        { name: "sex", label: "Sex", type: "select", options: [{ label: "Male", value: "male" }, { label: "Female", value: "female" }] },
      ],
      calculate: (inputs) => {
        const cr = inputs.creatinine as number;
        const age = inputs.age as number;
        const sex = inputs.sex as string;
        if (!cr || !age || !sex) return null;
        let egfr: number;
        if (sex === "female") {
          const kappa = 0.7;
          const alpha = cr <= kappa ? -0.241 : -1.2;
          egfr = 142 * Math.pow(Math.min(cr / kappa, 1), alpha) * Math.pow(Math.max(cr / kappa, 1), -1.2) * Math.pow(0.9938, age) * 1.012;
        } else {
          const kappa = 0.9;
          const alpha = cr <= kappa ? -0.302 : -1.2;
          egfr = 142 * Math.pow(Math.min(cr / kappa, 1), alpha) * Math.pow(Math.max(cr / kappa, 1), -1.2) * Math.pow(0.9938, age);
        }
        let stage = "";
        let description = "";
        if (egfr >= 90) { stage = "G1"; description = "Normal or high"; }
        else if (egfr >= 60) { stage = "G2"; description = "Mildly decreased"; }
        else if (egfr >= 45) { stage = "G3a"; description = "Mildly to moderately decreased"; }
        else if (egfr >= 30) { stage = "G3b"; description = "Moderately to severely decreased"; }
        else if (egfr >= 15) { stage = "G4"; description = "Severely decreased"; }
        else { stage = "G5"; description = "Kidney failure"; }
        return {
          primary: { label: "eGFR", value: formatNumber(egfr, 1) + " mL/min/1.73m2" },
          details: [
            { label: "eGFR", value: formatNumber(egfr, 1) + " mL/min/1.73m2" },
            { label: "CKD Stage", value: stage + " - " + description },
            { label: "Serum Creatinine", value: formatNumber(cr, 2) + " mg/dL" },
            { label: "Age", value: formatNumber(age, 0) + " years" },
            { label: "Sex", value: sex === "female" ? "Female" : "Male" },
            { label: "Equation", value: "CKD-EPI 2021 (race-free)" },
          ],
          note: "CKD-EPI 2021 is the recommended equation (race-free). eGFR < 60 for 3+ months or markers of kidney damage indicate CKD. Confirm with repeat testing.",
        };
      },
    },
  ],
  relatedSlugs: ["creatinine-clearance-cg", "bun-creatinine", "fena-calculator"],
  faq: [
    { question: "What is eGFR?", answer: "eGFR (estimated glomerular filtration rate) measures how well your kidneys filter blood. Normal is above 90 mL/min/1.73m2. It is used to stage chronic kidney disease." },
    { question: "What is the CKD-EPI 2021 equation?", answer: "The CKD-EPI 2021 equation is the recommended race-free formula for estimating GFR using serum creatinine, age, and sex without a race variable." },
    { question: "How is eGFR different from creatinine clearance?", answer: "eGFR is normalized to body surface area (mL/min/1.73m2) and used for CKD staging. CrCl (Cockcroft-Gault) estimates actual clearance (mL/min) and is preferred for drug dosing." },
  ],
  formula: "CKD-EPI 2021: eGFR = 142 x min(SCr/k, 1)^a x max(SCr/k, 1)^-1.2 x 0.9938^age [x 1.012 if female]",
};
