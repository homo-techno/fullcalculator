import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const bodyWaterCalculator: CalculatorDefinition = {
  slug: "body-water-calculator",
  title: "Body Water Calculator",
  description:
    "Free total body water calculator using the Watson formula. Estimate TBW for male and female patients based on age, height, and weight.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["total body water", "Watson formula", "TBW", "fluid balance"],
  variants: [
    {
      id: "male",
      name: "Male (Watson Formula)",
      fields: [
        {
          name: "age",
          label: "Age (years)",
          type: "number",
          placeholder: "e.g. 35",
        },
        {
          name: "height",
          label: "Height (cm)",
          type: "number",
          placeholder: "e.g. 175",
        },
        {
          name: "weight",
          label: "Weight (kg)",
          type: "number",
          placeholder: "e.g. 80",
        },
      ],
      calculate: (inputs) => {
        const age = inputs.age as number;
        const height = inputs.height as number;
        const weight = inputs.weight as number;
        if (!age || !height || !weight) return null;

        const tbw = 2.447 - 0.09156 * age + 0.1074 * height + 0.3362 * weight;
        const bodyWaterPercent = (tbw / weight) * 100;

        return {
          primary: {
            label: "Total Body Water",
            value: `${formatNumber(tbw, 1)} L`,
          },
          details: [
            { label: "Body Water %", value: `${formatNumber(bodyWaterPercent, 1)}%` },
            { label: "Sex", value: "Male" },
            { label: "Age", value: `${formatNumber(age, 0)} years` },
            { label: "Height", value: `${formatNumber(height, 1)} cm` },
            { label: "Weight", value: `${formatNumber(weight, 1)} kg` },
          ],
        };
      },
    },
    {
      id: "female",
      name: "Female (Watson Formula)",
      fields: [
        {
          name: "age",
          label: "Age (years)",
          type: "number",
          placeholder: "e.g. 35",
        },
        {
          name: "height",
          label: "Height (cm)",
          type: "number",
          placeholder: "e.g. 162",
        },
        {
          name: "weight",
          label: "Weight (kg)",
          type: "number",
          placeholder: "e.g. 65",
        },
      ],
      calculate: (inputs) => {
        const age = inputs.age as number;
        const height = inputs.height as number;
        const weight = inputs.weight as number;
        if (!age || !height || !weight) return null;

        const tbw = -2.097 + 0.1069 * height + 0.2466 * weight;
        const bodyWaterPercent = (tbw / weight) * 100;

        return {
          primary: {
            label: "Total Body Water",
            value: `${formatNumber(tbw, 1)} L`,
          },
          details: [
            { label: "Body Water %", value: `${formatNumber(bodyWaterPercent, 1)}%` },
            { label: "Sex", value: "Female" },
            { label: "Age", value: `${formatNumber(age, 0)} years` },
            { label: "Height", value: `${formatNumber(height, 1)} cm` },
            { label: "Weight", value: `${formatNumber(weight, 1)} kg` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["hydration-calculator", "sodium-correction-calculator"],
  faq: [
    {
      question: "What is the Watson formula?",
      answer:
        "The Watson formula estimates total body water (TBW). For males: TBW = 2.447 \u2212 0.09156\u00D7age + 0.1074\u00D7height(cm) + 0.3362\u00D7weight(kg). For females: TBW = \u22122.097 + 0.1069\u00D7height + 0.2466\u00D7weight.",
    },
    {
      question: "Why is total body water important?",
      answer:
        "Total body water is used in clinical settings for calculating fluid replacement, drug dosing, and correcting electrolyte imbalances such as sodium disorders.",
    },
  ],
  formula:
    "Male TBW = 2.447 \u2212 0.09156\u00D7age + 0.1074\u00D7height + 0.3362\u00D7weight. Female TBW = \u22122.097 + 0.1069\u00D7height + 0.2466\u00D7weight.",
};
