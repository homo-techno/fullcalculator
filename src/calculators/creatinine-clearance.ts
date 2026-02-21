import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const creatinineClearanceCalculator: CalculatorDefinition = {
  slug: "creatinine-clearance-calculator",
  title: "Creatinine Clearance Calculator",
  description:
    "Free creatinine clearance calculator using the Cockcroft-Gault equation. Estimate kidney function for drug dosing adjustments.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "creatinine clearance",
    "Cockcroft-Gault",
    "CrCl",
    "kidney function",
    "GFR",
  ],
  variants: [
    {
      id: "male",
      name: "Male (Cockcroft-Gault)",
      fields: [
        {
          name: "age",
          label: "Age (years)",
          type: "number",
          placeholder: "e.g. 55",
        },
        {
          name: "weight",
          label: "Weight (kg)",
          type: "number",
          placeholder: "e.g. 80",
        },
        {
          name: "serumCr",
          label: "Serum Creatinine (mg/dL)",
          type: "number",
          placeholder: "e.g. 1.2",
        },
      ],
      calculate: (inputs) => {
        const age = inputs.age as number;
        const weight = inputs.weight as number;
        const serumCr = inputs.serumCr as number;
        if (!age || !weight || !serumCr) return null;

        const crcl = ((140 - age) * weight) / (72 * serumCr);

        let stage: string;
        if (crcl >= 90) stage = "Normal or high (Stage 1)";
        else if (crcl >= 60) stage = "Mildly decreased (Stage 2)";
        else if (crcl >= 30) stage = "Moderately decreased (Stage 3)";
        else if (crcl >= 15) stage = "Severely decreased (Stage 4)";
        else stage = "Kidney failure (Stage 5)";

        return {
          primary: {
            label: "Creatinine Clearance",
            value: `${formatNumber(crcl, 1)} mL/min`,
          },
          details: [
            { label: "Kidney Function", value: stage },
            { label: "Sex", value: "Male" },
            { label: "Age", value: `${formatNumber(age, 0)} years` },
            { label: "Weight", value: `${formatNumber(weight, 1)} kg` },
            { label: "Serum Creatinine", value: `${formatNumber(serumCr, 2)} mg/dL` },
          ],
        };
      },
    },
    {
      id: "female",
      name: "Female (Cockcroft-Gault)",
      fields: [
        {
          name: "age",
          label: "Age (years)",
          type: "number",
          placeholder: "e.g. 55",
        },
        {
          name: "weight",
          label: "Weight (kg)",
          type: "number",
          placeholder: "e.g. 65",
        },
        {
          name: "serumCr",
          label: "Serum Creatinine (mg/dL)",
          type: "number",
          placeholder: "e.g. 1.0",
        },
      ],
      calculate: (inputs) => {
        const age = inputs.age as number;
        const weight = inputs.weight as number;
        const serumCr = inputs.serumCr as number;
        if (!age || !weight || !serumCr) return null;

        const crcl = (((140 - age) * weight) / (72 * serumCr)) * 0.85;

        let stage: string;
        if (crcl >= 90) stage = "Normal or high (Stage 1)";
        else if (crcl >= 60) stage = "Mildly decreased (Stage 2)";
        else if (crcl >= 30) stage = "Moderately decreased (Stage 3)";
        else if (crcl >= 15) stage = "Severely decreased (Stage 4)";
        else stage = "Kidney failure (Stage 5)";

        return {
          primary: {
            label: "Creatinine Clearance",
            value: `${formatNumber(crcl, 1)} mL/min`,
          },
          details: [
            { label: "Kidney Function", value: stage },
            { label: "Sex", value: "Female (\u00D70.85 applied)" },
            { label: "Age", value: `${formatNumber(age, 0)} years` },
            { label: "Weight", value: `${formatNumber(weight, 1)} kg` },
            { label: "Serum Creatinine", value: `${formatNumber(serumCr, 2)} mg/dL` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["anion-gap-calculator", "sodium-correction-calculator"],
  faq: [
    {
      question: "What is the Cockcroft-Gault equation?",
      answer:
        "The Cockcroft-Gault equation estimates creatinine clearance: CrCl = ((140 \u2212 age) \u00D7 weight) / (72 \u00D7 serum creatinine). For females, the result is multiplied by 0.85.",
    },
    {
      question: "Why is creatinine clearance important?",
      answer:
        "Creatinine clearance estimates kidney function and is used to adjust medication dosages for patients with renal impairment, preventing drug toxicity.",
    },
  ],
  formula:
    "CrCl = ((140 \u2212 age) \u00D7 weight) / (72 \u00D7 serum Cr). Female: multiply by 0.85.",
};
