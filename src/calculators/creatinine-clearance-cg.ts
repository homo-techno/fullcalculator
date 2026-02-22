import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const creatinineClearanceCgCalculator: CalculatorDefinition = {
  slug: "creatinine-clearance-cg",
  title: "Creatinine Clearance Calculator (Cockcroft-Gault)",
  description: "Free Cockcroft-Gault creatinine clearance calculator. Estimate CrCl for drug dosing adjustments using age, weight, sex, and serum creatinine.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["creatinine clearance", "cockcroft gault", "crcl calculator", "drug dosing renal", "gfr estimate", "renal dose adjustment"],
  variants: [
    {
      id: "cockcroft-gault",
      name: "Cockcroft-Gault Equation",
      fields: [
        { name: "age", label: "Age (years)", type: "number", placeholder: "e.g. 65", min: 18, max: 120 },
        { name: "weight", label: "Weight (kg)", type: "number", placeholder: "e.g. 70", min: 20, max: 300, step: 0.1 },
        { name: "creatinine", label: "Serum Creatinine (mg/dL)", type: "number", placeholder: "e.g. 1.0", min: 0.1, max: 30, step: 0.01 },
        { name: "sex", label: "Sex", type: "select", options: [{ label: "Male", value: "male" }, { label: "Female", value: "female" }] },
      ],
      calculate: (inputs) => {
        const age = inputs.age as number;
        const weight = inputs.weight as number;
        const cr = inputs.creatinine as number;
        const sex = inputs.sex as string;
        if (!age || !weight || !cr || !sex) return null;
        let crcl = ((140 - age) * weight) / (72 * cr);
        if (sex === "female") crcl *= 0.85;
        let stage = "";
        if (crcl >= 90) stage = "Normal or high (G1)";
        else if (crcl >= 60) stage = "Mildly decreased (G2)";
        else if (crcl >= 45) stage = "Mildly to moderately decreased (G3a)";
        else if (crcl >= 30) stage = "Moderately to severely decreased (G3b)";
        else if (crcl >= 15) stage = "Severely decreased (G4)";
        else stage = "Kidney failure (G5)";
        return {
          primary: { label: "Creatinine Clearance", value: formatNumber(crcl, 1) + " mL/min" },
          details: [
            { label: "CrCl", value: formatNumber(crcl, 1) + " mL/min" },
            { label: "CKD Stage", value: stage },
            { label: "Age", value: formatNumber(age, 0) + " years" },
            { label: "Weight", value: formatNumber(weight, 1) + " kg" },
            { label: "Serum Creatinine", value: formatNumber(cr, 2) + " mg/dL" },
            { label: "Sex Adjustment", value: sex === "female" ? "x 0.85 applied" : "None" },
          ],
          note: "Cockcroft-Gault estimates CrCl (not GFR). It uses actual body weight and is commonly used for drug dosing. For obese patients, consider using adjusted body weight.",
        };
      },
    },
  ],
  relatedSlugs: ["egfr-calculator", "bun-creatinine", "fena-calculator"],
  faq: [
    { question: "What is the Cockcroft-Gault formula?", answer: "CrCl = [(140 - age) x weight (kg)] / [72 x serum creatinine (mg/dL)]. Multiply by 0.85 for females. It estimates creatinine clearance for drug dosing." },
    { question: "When is Cockcroft-Gault used instead of eGFR?", answer: "Cockcroft-Gault is preferred for drug dosing adjustments because most drug studies used this formula. eGFR (CKD-EPI) is preferred for CKD staging." },
    { question: "Should I use actual or ideal body weight?", answer: "The original formula uses actual body weight. For obese patients (BMI > 30), many pharmacists use adjusted body weight: IBW + 0.4 x (actual - IBW)." },
  ],
  formula: "CrCl = [(140 - age) x weight] / (72 x SCr) | x 0.85 if female",
};
