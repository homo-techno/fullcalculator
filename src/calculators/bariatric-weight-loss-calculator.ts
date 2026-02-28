import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const bariatricWeightLossCalculator: CalculatorDefinition = {
  slug: "bariatric-weight-loss-calculator",
  title: "Bariatric Surgery Weight Loss Calculator",
  description: "Free bariatric surgery weight loss projector. Estimate expected weight loss by procedure type over 12-24 months.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["bariatric weight loss calculator", "gastric bypass weight loss calculator", "weight loss surgery calculator"],
  variants: [{
    id: "standard",
    name: "Bariatric Surgery Weight Loss",
    description: "Free bariatric surgery weight loss projector",
    fields: [
      { name: "weight", label: "Current Weight", type: "number", suffix: "kg", min: 50, max: 400 },
      { name: "height", label: "Height", type: "number", suffix: "cm", min: 100, max: 250 },
      { name: "procedure", label: "Procedure Type", type: "select", options: [{ label: "Gastric Sleeve (60-70% EWL)", value: "0.65" }, { label: "Gastric Bypass (70-80% EWL)", value: "0.75" }, { label: "Gastric Band (40-50% EWL)", value: "0.45" }, { label: "Duodenal Switch (80-90% EWL)", value: "0.85" }], defaultValue: "0.65" },
    ],
    calculate: (inputs) => {
      const weight = inputs.weight as number;
      const height = (inputs.height as number) / 100;
      const ewlRate = parseFloat(inputs.procedure as string);
      if (!weight || !height) return null;
      const bmi = weight / (height * height);
      const idealBMI = 25;
      const idealWeight = idealBMI * height * height;
      const excessWeight = Math.max(0, weight - idealWeight);
      const expectedLoss = excessWeight * ewlRate;
      const newWeight = weight - expectedLoss;
      const newBMI = newWeight / (height * height);
      return {
        primary: { label: "Expected Weight Loss", value: formatNumber(expectedLoss) + " kg" },
        details: [
          { label: "Current BMI", value: formatNumber(bmi) },
          { label: "Excess weight", value: formatNumber(excessWeight) + " kg" },
          { label: "Expected EWL", value: (ewlRate * 100) + "%" },
          { label: "Projected weight", value: formatNumber(newWeight) + " kg" },
          { label: "Projected BMI", value: formatNumber(newBMI) },
        ],
        note: "Excess Weight Loss (EWL) is measured against ideal weight (BMI 25). Results typically achieved over 12-24 months. Individual results vary.",
      };
    },
  }],
  relatedSlugs: ["bmi-calculator", "bmr-calculator"],
  faq: [
    { question: "How much weight will I lose after bariatric surgery?", answer: "Typical excess weight loss: Gastric Band 40-50%, Sleeve 60-70%, Bypass 70-80%, Duodenal Switch 80-90%. Most loss occurs in the first 12-18 months." },
    { question: "What is excess weight loss (EWL)?", answer: "EWL measures how much of your weight above a BMI of 25 you lose. If you have 50kg excess weight and lose 35kg, thats 70% EWL." },
  ],
  formula: "Expected Loss = (Current Weight - Ideal Weight at BMI 25) × Procedure EWL%",
};
