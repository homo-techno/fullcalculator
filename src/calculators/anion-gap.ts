import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const anionGapCalculator: CalculatorDefinition = {
  slug: "anion-gap-calculator",
  title: "Anion Gap Calculator",
  description:
    "Free anion gap calculator. Calculate the anion gap from sodium, chloride, and bicarbonate to evaluate metabolic acidosis.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["anion gap", "metabolic acidosis", "electrolytes", "sodium chloride bicarbonate"],
  variants: [
    {
      id: "anionGap",
      name: "Anion Gap",
      fields: [
        {
          name: "sodium",
          label: "Sodium Na+ (mEq/L)",
          type: "number",
          placeholder: "e.g. 140",
        },
        {
          name: "chloride",
          label: "Chloride Cl- (mEq/L)",
          type: "number",
          placeholder: "e.g. 104",
        },
        {
          name: "bicarbonate",
          label: "Bicarbonate HCO3- (mEq/L)",
          type: "number",
          placeholder: "e.g. 24",
        },
      ],
      calculate: (inputs) => {
        const na = inputs.sodium as number;
        const cl = inputs.chloride as number;
        const hco3 = inputs.bicarbonate as number;
        if (!na || !cl || !hco3) return null;

        const ag = na - (cl + hco3);
        let interpretation: string;
        if (ag < 8) {
          interpretation = "Low (may indicate lab error or hypoalbuminemia)";
        } else if (ag <= 12) {
          interpretation = "Normal (8\u201312 mEq/L)";
        } else {
          interpretation = "Elevated (suggests anion gap metabolic acidosis)";
        }

        return {
          primary: {
            label: "Anion Gap",
            value: `${formatNumber(ag, 1)} mEq/L`,
          },
          details: [
            { label: "Interpretation", value: interpretation },
            { label: "Na+", value: `${formatNumber(na, 1)} mEq/L` },
            { label: "Cl-", value: `${formatNumber(cl, 1)} mEq/L` },
            { label: "HCO3-", value: `${formatNumber(hco3, 1)} mEq/L` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["sodium-correction-calculator", "corrected-calcium-calculator"],
  faq: [
    {
      question: "What is a normal anion gap?",
      answer:
        "A normal anion gap is typically 8\u201312 mEq/L. An elevated anion gap (>12) may indicate metabolic acidosis caused by conditions such as diabetic ketoacidosis, lactic acidosis, or toxic ingestions.",
    },
    {
      question: "How is the anion gap calculated?",
      answer:
        "The anion gap is calculated as AG = Na+ \u2212 (Cl\u2212 + HCO3\u2212). It represents the difference between measured cations and measured anions in the blood.",
    },
  ],
  formula: "Anion Gap = Na+ \u2212 (Cl\u2212 + HCO3\u2212). Normal range: 8\u201312 mEq/L.",
};
