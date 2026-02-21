import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const bloodSugarCalculator: CalculatorDefinition = {
  slug: "blood-sugar-converter",
  title: "Blood Sugar Converter",
  description: "Free blood sugar converter. Convert between mg/dL and mmol/L. Check if your glucose level is normal, pre-diabetic, or diabetic.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["blood sugar converter", "glucose converter", "mg/dL to mmol/L", "blood glucose calculator", "diabetes calculator"],
  variants: [
    {
      id: "mgToMmol",
      name: "mg/dL → mmol/L",
      fields: [
        { name: "mgdl", label: "Blood Sugar (mg/dL)", type: "number", placeholder: "e.g. 100" },
        { name: "type", label: "Measurement Type", type: "select", options: [
          { label: "Fasting", value: "fasting" },
          { label: "2 hours after meal", value: "postmeal" },
          { label: "Random", value: "random" },
          { label: "HbA1c (%)", value: "a1c" },
        ]},
      ],
      calculate: (inputs) => {
        const mg = inputs.mgdl as number, type = (inputs.type as string) || "fasting";
        if (!mg) return null;
        if (type === "a1c") {
          const eag = (28.7 * mg) - 46.7;
          return {
            primary: { label: `HbA1c ${mg}%`, value: `eAG: ${formatNumber(eag, 0)} mg/dL (${formatNumber(eag / 18.0182, 1)} mmol/L)` },
            details: [
              { label: "Status", value: mg < 5.7 ? "Normal" : mg < 6.5 ? "Pre-diabetic" : "Diabetic range" },
            ],
          };
        }
        const mmol = mg / 18.0182;
        let status = "Normal";
        if (type === "fasting") {
          if (mg >= 126) status = "Diabetic range";
          else if (mg >= 100) status = "Pre-diabetic";
        } else if (type === "postmeal") {
          if (mg >= 200) status = "Diabetic range";
          else if (mg >= 140) status = "Pre-diabetic";
        }
        return {
          primary: { label: `${mg} mg/dL`, value: `${formatNumber(mmol, 2)} mmol/L` },
          details: [
            { label: "Status", value: status },
            { label: "mg/dL", value: formatNumber(mg, 1) },
            { label: "mmol/L", value: formatNumber(mmol, 2) },
          ],
        };
      },
    },
    {
      id: "mmolToMg",
      name: "mmol/L → mg/dL",
      fields: [
        { name: "mmol", label: "Blood Sugar (mmol/L)", type: "number", placeholder: "e.g. 5.5" },
      ],
      calculate: (inputs) => {
        const mmol = inputs.mmol as number;
        if (!mmol) return null;
        const mg = mmol * 18.0182;
        return {
          primary: { label: `${mmol} mmol/L`, value: `${formatNumber(mg, 1)} mg/dL` },
          details: [
            { label: "mg/dL", value: formatNumber(mg, 1) },
            { label: "mmol/L", value: formatNumber(mmol, 2) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["bmi-calculator", "calorie-calculator", "blood-pressure-calculator"],
  faq: [{ question: "What is a normal blood sugar level?", answer: "Fasting: Normal < 100 mg/dL (5.6 mmol/L), Pre-diabetic 100-125, Diabetic ≥ 126. After meals (2hr): Normal < 140, Pre-diabetic 140-199, Diabetic ≥ 200. HbA1c: Normal < 5.7%, Pre-diabetic 5.7-6.4%, Diabetic ≥ 6.5%." }],
  formula: "mmol/L = mg/dL ÷ 18.0182",
};
