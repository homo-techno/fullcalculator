import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const sodiumCorrectionCalculator: CalculatorDefinition = {
  slug: "sodium-correction-calculator",
  title: "Sodium Correction Calculator",
  description:
    "Free sodium correction calculator. Calculate sodium deficit based on total body water, current sodium, and desired sodium levels.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["sodium correction", "sodium deficit", "hyponatremia", "electrolyte correction"],
  variants: [
    {
      id: "male",
      name: "Male (TBW factor 0.6)",
      fields: [
        {
          name: "weight",
          label: "Body Weight (kg)",
          type: "number",
          placeholder: "e.g. 80",
        },
        {
          name: "currentNa",
          label: "Current Sodium (mEq/L)",
          type: "number",
          placeholder: "e.g. 125",
        },
        {
          name: "desiredNa",
          label: "Desired Sodium (mEq/L)",
          type: "number",
          placeholder: "e.g. 140",
        },
      ],
      calculate: (inputs) => {
        const weight = inputs.weight as number;
        const currentNa = inputs.currentNa as number;
        const desiredNa = inputs.desiredNa as number;
        if (!weight || !currentNa || !desiredNa) return null;

        const tbw = weight * 0.6;
        const naDeficit = tbw * (desiredNa - currentNa);

        return {
          primary: {
            label: "Sodium Deficit",
            value: `${formatNumber(naDeficit, 0)} mEq`,
          },
          details: [
            { label: "Total Body Water", value: `${formatNumber(tbw, 1)} L` },
            { label: "TBW Factor", value: "0.6 (male)" },
            { label: "Current Na+", value: `${formatNumber(currentNa, 0)} mEq/L` },
            { label: "Desired Na+", value: `${formatNumber(desiredNa, 0)} mEq/L` },
            { label: "Na+ Difference", value: `${formatNumber(desiredNa - currentNa, 0)} mEq/L` },
            { label: "Body Weight", value: `${formatNumber(weight, 1)} kg` },
          ],
        };
      },
    },
    {
      id: "female",
      name: "Female (TBW factor 0.5)",
      fields: [
        {
          name: "weight",
          label: "Body Weight (kg)",
          type: "number",
          placeholder: "e.g. 65",
        },
        {
          name: "currentNa",
          label: "Current Sodium (mEq/L)",
          type: "number",
          placeholder: "e.g. 125",
        },
        {
          name: "desiredNa",
          label: "Desired Sodium (mEq/L)",
          type: "number",
          placeholder: "e.g. 140",
        },
      ],
      calculate: (inputs) => {
        const weight = inputs.weight as number;
        const currentNa = inputs.currentNa as number;
        const desiredNa = inputs.desiredNa as number;
        if (!weight || !currentNa || !desiredNa) return null;

        const tbw = weight * 0.5;
        const naDeficit = tbw * (desiredNa - currentNa);

        return {
          primary: {
            label: "Sodium Deficit",
            value: `${formatNumber(naDeficit, 0)} mEq`,
          },
          details: [
            { label: "Total Body Water", value: `${formatNumber(tbw, 1)} L` },
            { label: "TBW Factor", value: "0.5 (female)" },
            { label: "Current Na+", value: `${formatNumber(currentNa, 0)} mEq/L` },
            { label: "Desired Na+", value: `${formatNumber(desiredNa, 0)} mEq/L` },
            { label: "Na+ Difference", value: `${formatNumber(desiredNa - currentNa, 0)} mEq/L` },
            { label: "Body Weight", value: `${formatNumber(weight, 1)} kg` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["anion-gap-calculator", "corrected-calcium-calculator"],
  faq: [
    {
      question: "How is sodium deficit calculated?",
      answer:
        "Sodium deficit = Total Body Water \u00D7 (Desired Na \u2212 Current Na). TBW is estimated as weight \u00D7 0.6 for males and weight \u00D7 0.5 for females.",
    },
    {
      question: "How fast should sodium be corrected?",
      answer:
        "Sodium should generally be corrected no faster than 8\u201310 mEq/L per 24 hours to avoid osmotic demyelination syndrome. Rapid correction is dangerous.",
    },
  ],
  formula:
    "Na Deficit = TBW \u00D7 (Desired Na \u2212 Current Na). TBW = Weight \u00D7 0.6 (male) or 0.5 (female).",
};
