import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const absiCalculator: CalculatorDefinition = {
  slug: "absi-calculator",
  title: "A Body Shape Index (ABSI) Calculator",
  description: "Free ABSI calculator. Assess health risk based on waist circumference, height, and BMI using the A Body Shape Index formula.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["absi calculator", "a body shape index calculator", "body shape index risk calculator"],
  variants: [{
    id: "standard",
    name: "A Body Shape Index (ABSI)",
    description: "Free ABSI calculator",
    fields: [
      { name: "waist", label: "Waist Circumference", type: "number", suffix: "cm", min: 40, max: 200 },
      { name: "height", label: "Height", type: "number", suffix: "cm", min: 100, max: 250 },
      { name: "weight", label: "Weight", type: "number", suffix: "kg", min: 20, max: 300 },
    ],
    calculate: (inputs) => {
      const waist = (inputs.waist as number) / 100;
      const height = (inputs.height as number) / 100;
      const weight = inputs.weight as number;
      if (!waist || !height || !weight) return null;
      const bmi = weight / (height * height);
      const absi = waist / (Math.pow(bmi, 2/3) * Math.pow(height, 0.5));
      const zScore = (absi - 0.0749) / 0.0048;
      let risk = "Average";
      if (zScore < -0.868) risk = "Very Low";
      else if (zScore < -0.272) risk = "Low";
      else if (zScore < 0.229) risk = "Average";
      else if (zScore < 0.798) risk = "High";
      else risk = "Very High";
      return {
        primary: { label: "ABSI", value: formatNumber(absi * 1000) + " ×10⁻³" },
        details: [
          { label: "Z-score", value: formatNumber(zScore) },
          { label: "Mortality risk", value: risk },
          { label: "BMI", value: formatNumber(bmi) },
          { label: "Waist/Height ratio", value: formatNumber(waist / height) },
        ],
        note: "ABSI measures abdominal obesity risk beyond BMI. Higher values indicate greater visceral fat and mortality risk.",
      };
    },
  }],
  relatedSlugs: ["bmi-calculator", "body-fat-calculator"],
  faq: [
    { question: "What is ABSI?", answer: "A Body Shape Index measures health risk from abdominal obesity. It combines waist circumference with BMI and height, providing better mortality prediction than BMI alone." },
    { question: "What is a good ABSI score?", answer: "Average ABSI is ~0.0749. Z-scores below -0.3 indicate lower risk; above 0.8 indicates very high risk." },
  ],
  formula: "ABSI = Waist / (BMI^(2/3) × Height^(1/2))",
};
