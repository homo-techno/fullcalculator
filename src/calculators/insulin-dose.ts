import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const insulinDoseCalculator: CalculatorDefinition = {
  slug: "insulin-dose-calculator",
  title: "Insulin Dose Calculator",
  description:
    "Free insulin dose calculator. Calculate correction dose and carbohydrate coverage dose based on blood glucose, carb ratio, and correction factor.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["insulin dose", "correction dose", "carb ratio", "blood glucose"],
  variants: [
    {
      id: "insulinDose",
      name: "Correction + Carb Dose",
      fields: [
        {
          name: "currentBG",
          label: "Current Blood Glucose (mg/dL)",
          type: "number",
          placeholder: "e.g. 250",
        },
        {
          name: "targetBG",
          label: "Target Blood Glucose (mg/dL)",
          type: "number",
          placeholder: "e.g. 120",
        },
        {
          name: "correctionFactor",
          label: "Correction Factor (mg/dL per unit)",
          type: "number",
          placeholder: "e.g. 50",
        },
        {
          name: "carbs",
          label: "Carbohydrates (grams)",
          type: "number",
          placeholder: "e.g. 60",
        },
        {
          name: "carbRatio",
          label: "Carb Ratio (grams per unit)",
          type: "number",
          placeholder: "e.g. 10",
        },
      ],
      calculate: (inputs) => {
        const currentBG = inputs.currentBG as number;
        const targetBG = inputs.targetBG as number;
        const correctionFactor = inputs.correctionFactor as number;
        const carbs = inputs.carbs as number;
        const carbRatio = inputs.carbRatio as number;
        if (!currentBG || !targetBG || !correctionFactor || !carbRatio) return null;

        const correctionDose = Math.max(0, (currentBG - targetBG) / correctionFactor);
        const carbDose = (carbs || 0) / carbRatio;
        const totalDose = correctionDose + carbDose;

        return {
          primary: {
            label: "Total Insulin Dose",
            value: `${formatNumber(totalDose, 1)} units`,
          },
          details: [
            { label: "Correction Dose", value: `${formatNumber(correctionDose, 1)} units` },
            { label: "Carb Coverage Dose", value: `${formatNumber(carbDose, 1)} units` },
            { label: "Current BG", value: `${formatNumber(currentBG, 0)} mg/dL` },
            { label: "Target BG", value: `${formatNumber(targetBG, 0)} mg/dL` },
            { label: "BG Difference", value: `${formatNumber(currentBG - targetBG, 0)} mg/dL` },
            { label: "Correction Factor", value: `1 unit per ${formatNumber(correctionFactor, 0)} mg/dL` },
            { label: "Carb Ratio", value: `1 unit per ${formatNumber(carbRatio, 0)} g carbs` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["medication-dosage-calculator", "pediatric-dose-calculator"],
  faq: [
    {
      question: "How is the correction dose calculated?",
      answer:
        "Correction dose = (Current Blood Glucose \u2212 Target Blood Glucose) / Correction Factor. For example, if BG is 250, target is 120, and correction factor is 50, the dose is (250\u2212120)/50 = 2.6 units.",
    },
    {
      question: "What is a carb ratio?",
      answer:
        "A carb ratio (or insulin-to-carb ratio) is the number of grams of carbohydrate covered by one unit of rapid-acting insulin. For example, a ratio of 1:10 means 1 unit covers 10 grams of carbs.",
    },
  ],
  formula:
    "Correction Dose = (Current BG \u2212 Target BG) / Correction Factor. Carb Dose = Carbs (g) / Carb Ratio. Total = Correction + Carb Dose.",
};
