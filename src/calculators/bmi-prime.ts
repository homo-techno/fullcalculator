import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const bmiPrimeCalculator: CalculatorDefinition = {
  slug: "bmi-prime-calculator",
  title: "BMI Prime Calculator",
  description: "Free BMI Prime calculator. Calculate your BMI Prime ratio to see how your weight compares to the upper limit of normal BMI.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["bmi prime calculator", "bmi prime", "bmi ratio", "body mass index prime", "healthy weight ratio"],
  variants: [
    {
      id: "imperial",
      name: "BMI Prime (Imperial)",
      fields: [
        { name: "weight", label: "Weight", type: "number", placeholder: "e.g. 160", suffix: "lbs", min: 50, max: 1000 },
        { name: "heightFt", label: "Height (feet)", type: "number", placeholder: "e.g. 5", suffix: "ft", min: 1, max: 9 },
        { name: "heightIn", label: "Height (inches)", type: "number", placeholder: "e.g. 9", suffix: "in", min: 0, max: 11 },
      ],
      calculate: (inputs) => {
        const weight = inputs.weight as number;
        const feet = inputs.heightFt as number;
        const inches = (inputs.heightIn as number) || 0;
        if (!weight || !feet) return null;

        const totalInches = feet * 12 + inches;
        const heightM = totalInches * 0.0254;
        const bmi = weight * 0.4536 / (heightM * heightM);
        const bmiPrime = bmi / 25;

        let category: string;
        let interpretation: string;
        if (bmiPrime < 0.74) {
          category = "Underweight";
          interpretation = "BMI Prime below 0.74 indicates underweight. Consider consulting a healthcare provider.";
        } else if (bmiPrime < 1.0) {
          category = "Normal Weight";
          interpretation = "BMI Prime below 1.0 means you are within the healthy weight range.";
        } else if (bmiPrime < 1.2) {
          category = "Overweight";
          interpretation = "BMI Prime between 1.0 and 1.2 indicates overweight. Small lifestyle changes may help.";
        } else {
          category = "Obese";
          interpretation = "BMI Prime above 1.2 indicates obesity. Consider consulting a healthcare provider for guidance.";
        }

        // How far from normal upper limit
        const normalMaxWeight = 25 * heightM * heightM / 0.4536;
        const weightDiff = weight - normalMaxWeight;

        // Percentage over/under normal
        const percentFromNormal = (bmiPrime - 1) * 100;

        return {
          primary: { label: "BMI Prime", value: formatNumber(bmiPrime, 2) },
          details: [
            { label: "BMI", value: formatNumber(bmi, 1) },
            { label: "Category", value: category },
            { label: "Interpretation", value: interpretation },
            { label: "Distance from Normal (1.0)", value: `${percentFromNormal >= 0 ? "+" : ""}${formatNumber(percentFromNormal, 1)}%` },
            { label: "Max Normal Weight", value: `${formatNumber(normalMaxWeight, 0)} lbs (BMI 25)` },
            { label: "Weight Difference", value: weightDiff > 0 ? `${formatNumber(weightDiff, 0)} lbs over` : `${formatNumber(Math.abs(weightDiff), 0)} lbs under max normal` },
          ],
          note: "BMI Prime of 1.0 corresponds to the upper limit of normal BMI (25). Values below 1.0 are normal, above 1.0 indicates excess weight. BMI does not distinguish muscle from fat.",
        };
      },
    },
    {
      id: "metric",
      name: "BMI Prime (Metric)",
      fields: [
        { name: "weightKg", label: "Weight", type: "number", placeholder: "e.g. 72", suffix: "kg", min: 20, max: 500 },
        { name: "heightCm", label: "Height", type: "number", placeholder: "e.g. 175", suffix: "cm", min: 100, max: 250 },
      ],
      calculate: (inputs) => {
        const weight = inputs.weightKg as number;
        const heightCm = inputs.heightCm as number;
        if (!weight || !heightCm) return null;

        const heightM = heightCm / 100;
        const bmi = weight / (heightM * heightM);
        const bmiPrime = bmi / 25;

        let category: string;
        if (bmiPrime < 0.74) category = "Underweight";
        else if (bmiPrime < 1.0) category = "Normal Weight";
        else if (bmiPrime < 1.2) category = "Overweight";
        else category = "Obese";

        const normalMaxWeight = 25 * heightM * heightM;
        const weightDiff = weight - normalMaxWeight;
        const percentFromNormal = (bmiPrime - 1) * 100;

        return {
          primary: { label: "BMI Prime", value: formatNumber(bmiPrime, 2) },
          details: [
            { label: "BMI", value: formatNumber(bmi, 1) },
            { label: "Category", value: category },
            { label: "Distance from Normal (1.0)", value: `${percentFromNormal >= 0 ? "+" : ""}${formatNumber(percentFromNormal, 1)}%` },
            { label: "Max Normal Weight", value: `${formatNumber(normalMaxWeight, 1)} kg (BMI 25)` },
            { label: "Weight Difference", value: weightDiff > 0 ? `${formatNumber(weightDiff, 1)} kg over` : `${formatNumber(Math.abs(weightDiff), 1)} kg under max normal` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["bmi-calculator", "body-fat-calculator", "ideal-weight-calculator", "body-shape-calculator"],
  faq: [
    { question: "What is BMI Prime?", answer: "BMI Prime is your BMI divided by 25 (the upper limit of normal BMI). A BMI Prime of 1.0 means you are exactly at the upper limit of normal weight. Below 1.0 is normal, above 1.0 is overweight." },
    { question: "Why use BMI Prime instead of BMI?", answer: "BMI Prime makes it easier to see how far you are from the normal range. A value of 0.95 means you are 5% below the upper limit of normal. A value of 1.10 means you are 10% above it." },
    { question: "What is a healthy BMI Prime?", answer: "A healthy BMI Prime is between 0.74 and 1.0. Below 0.74 is considered underweight, 1.0–1.2 is overweight, and above 1.2 is obese." },
  ],
  formula: "BMI Prime = BMI / 25 | BMI = weight (kg) / height (m)² | Normal: 0.74–1.0",
};
