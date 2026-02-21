import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const creatinineCalculator: CalculatorDefinition = {
  slug: "creatinine-calculator",
  title: "GFR & Creatinine Calculator",
  description:
    "Free GFR and creatinine calculator. Estimate your kidney function using the CKD-EPI equation. Calculate estimated glomerular filtration rate (eGFR) from serum creatinine.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "GFR calculator",
    "creatinine calculator",
    "kidney function",
    "eGFR",
    "glomerular filtration rate",
    "CKD-EPI",
    "kidney disease",
    "renal function",
  ],
  variants: [
    {
      id: "ckd-epi",
      name: "CKD-EPI eGFR (2021)",
      description: "Calculate estimated GFR using the 2021 CKD-EPI equation (race-free)",
      fields: [
        {
          name: "creatinine",
          label: "Serum Creatinine",
          type: "number",
          placeholder: "e.g. 1.0",
          suffix: "mg/dL",
          min: 0.1,
          max: 20,
          step: 0.01,
        },
        {
          name: "age",
          label: "Age",
          type: "number",
          placeholder: "e.g. 45",
          suffix: "years",
          min: 18,
          max: 120,
        },
        {
          name: "sex",
          label: "Sex",
          type: "select",
          options: [
            { label: "Female", value: "female" },
            { label: "Male", value: "male" },
          ],
        },
      ],
      calculate: (inputs) => {
        const scr = inputs.creatinine as number;
        const age = inputs.age as number;
        const sex = inputs.sex as string;
        if (!scr || !age || !sex) return null;
        // 2021 CKD-EPI Creatinine equation (race-free)
        const isFemale = sex === "female";
        const kappa = isFemale ? 0.7 : 0.9;
        const alpha = isFemale ? -0.241 : -0.302;
        const sexMultiplier = isFemale ? 1.012 : 1.0;
        const scrKappa = scr / kappa;
        const minVal = Math.min(scrKappa, 1);
        const maxVal = Math.max(scrKappa, 1);
        const egfr = 142 * Math.pow(minVal, alpha) * Math.pow(maxVal, -1.200) * Math.pow(0.9938, age) * sexMultiplier;
        let stage: string;
        let description: string;
        if (egfr >= 90) { stage = "G1"; description = "Normal or high kidney function"; }
        else if (egfr >= 60) { stage = "G2"; description = "Mildly decreased kidney function"; }
        else if (egfr >= 45) { stage = "G3a"; description = "Mildly to moderately decreased"; }
        else if (egfr >= 30) { stage = "G3b"; description = "Moderately to severely decreased"; }
        else if (egfr >= 15) { stage = "G4"; description = "Severely decreased kidney function"; }
        else { stage = "G5"; description = "Kidney failure"; }
        return {
          primary: { label: "eGFR", value: `${formatNumber(egfr, 0)}`, suffix: "mL/min/1.73m²" },
          details: [
            { label: "eGFR", value: `${formatNumber(egfr, 1)} mL/min/1.73m²` },
            { label: "CKD Stage", value: `Stage ${stage}` },
            { label: "Interpretation", value: description },
            { label: "Serum creatinine", value: `${scr} mg/dL` },
            { label: "Equation used", value: "2021 CKD-EPI (race-free)" },
          ],
          note: "This uses the 2021 CKD-EPI creatinine equation recommended by NKF and ASN (race-free). eGFR is an estimate — confirm with your healthcare provider. A single result does not diagnose CKD; abnormal results must persist for 3+ months.",
        };
      },
    },
    {
      id: "cockcroft-gault",
      name: "Cockcroft-Gault CrCl",
      description: "Calculate creatinine clearance using the Cockcroft-Gault formula",
      fields: [
        {
          name: "creatinine",
          label: "Serum Creatinine",
          type: "number",
          placeholder: "e.g. 1.0",
          suffix: "mg/dL",
          min: 0.1,
          max: 20,
          step: 0.01,
        },
        {
          name: "age",
          label: "Age",
          type: "number",
          placeholder: "e.g. 45",
          suffix: "years",
          min: 18,
          max: 120,
        },
        {
          name: "weight",
          label: "Weight",
          type: "number",
          placeholder: "e.g. 70",
          suffix: "kg",
          min: 20,
          max: 300,
        },
        {
          name: "sex",
          label: "Sex",
          type: "select",
          options: [
            { label: "Female", value: "female" },
            { label: "Male", value: "male" },
          ],
        },
      ],
      calculate: (inputs) => {
        const scr = inputs.creatinine as number;
        const age = inputs.age as number;
        const weight = inputs.weight as number;
        const sex = inputs.sex as string;
        if (!scr || !age || !weight || !sex) return null;
        // Cockcroft-Gault: CrCl = [(140 - age) × weight] / (72 × SCr) × 0.85 if female
        let crcl = ((140 - age) * weight) / (72 * scr);
        if (sex === "female") crcl *= 0.85;
        return {
          primary: { label: "Creatinine Clearance", value: `${formatNumber(crcl, 0)}`, suffix: "mL/min" },
          details: [
            { label: "CrCl", value: `${formatNumber(crcl, 1)} mL/min` },
            { label: "Equation", value: "Cockcroft-Gault" },
            { label: "Normal range", value: "90-120 mL/min" },
          ],
          note: "Cockcroft-Gault estimates creatinine clearance (not GFR) and is commonly used for drug dosing. It is not adjusted for body surface area. This is an estimate — consult your healthcare provider.",
        };
      },
    },
  ],
  relatedSlugs: ["blood-pressure-calculator", "cholesterol-ratio-calculator", "bmi-calculator"],
  faq: [
    {
      question: "What is eGFR?",
      answer:
        "eGFR (estimated glomerular filtration rate) measures how well your kidneys filter blood. Normal is 90+ mL/min/1.73m². Values below 60 for 3+ months indicate chronic kidney disease.",
    },
    {
      question: "What is a normal creatinine level?",
      answer:
        "Normal serum creatinine is typically 0.6-1.2 mg/dL for men and 0.5-1.1 mg/dL for women. However, creatinine alone is less informative than eGFR for assessing kidney function.",
    },
    {
      question: "What is the CKD-EPI equation?",
      answer:
        "CKD-EPI (Chronic Kidney Disease Epidemiology Collaboration) is the recommended equation for estimating GFR. The 2021 version is race-free, as recommended by NKF and ASN.",
    },
    {
      question: "When should I be concerned about my eGFR?",
      answer:
        "eGFR below 60 that persists for 3+ months suggests chronic kidney disease. eGFR below 15 indicates kidney failure. See a nephrologist if eGFR is below 30 or declining rapidly.",
    },
  ],
  formula:
    "CKD-EPI 2021: eGFR = 142 × min(Scr/κ, 1)^α × max(Scr/κ, 1)^-1.200 × 0.9938^Age × (1.012 if female) | κ = 0.7 (female), 0.9 (male) | α = -0.241 (female), -0.302 (male) | Cockcroft-Gault: CrCl = [(140 - age) × weight] / (72 × SCr) × 0.85 if female",
};
