import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const babyClothesSizePredictorCalculator: CalculatorDefinition = {
  slug: "baby-clothes-size-predictor",
  title: "Baby Clothes Size Predictor",
  description: "Predict the baby clothing size needed based on age, current weight, and growth rate to help with shopping and gift planning.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["baby clothes size","infant clothing size","baby growth chart","baby size predictor","newborn clothing"],
  variants: [{
    id: "standard",
    name: "Baby Clothes Size Predictor",
    description: "Predict the baby clothing size needed based on age, current weight, and growth rate to help with shopping and gift planning.",
    fields: [
      { name: "ageMonths", label: "Current Age (Months)", type: "number", min: 0, max: 36, defaultValue: 6 },
      { name: "currentWeight", label: "Current Weight (lbs)", type: "number", min: 5, max: 40, defaultValue: 16 },
      { name: "currentLength", label: "Current Length (inches)", type: "number", min: 18, max: 40, defaultValue: 26 },
      { name: "monthsAhead", label: "Months Ahead to Predict", type: "number", min: 1, max: 12, defaultValue: 3 },
    ],
    calculate: (inputs) => {
    const ageMonths = inputs.ageMonths as number;
    const currentWeight = inputs.currentWeight as number;
    const currentLength = inputs.currentLength as number;
    const monthsAhead = inputs.monthsAhead as number;
    const futureAge = ageMonths + monthsAhead;
    const monthlyWeightGain = ageMonths < 6 ? 1.5 : (ageMonths < 12 ? 1.0 : 0.5);
    const monthlyLengthGain = ageMonths < 6 ? 1.0 : (ageMonths < 12 ? 0.6 : 0.4);
    const futureWeight = currentWeight + (monthlyWeightGain * monthsAhead);
    const futureLength = currentLength + (monthlyLengthGain * monthsAhead);
    var size = "Newborn";
    if (futureWeight >= 8 || futureLength >= 21) { size = "0-3 Months"; }
    if (futureWeight >= 12 || futureLength >= 24) { size = "3-6 Months"; }
    if (futureWeight >= 16 || futureLength >= 27) { size = "6-9 Months"; }
    if (futureWeight >= 20 || futureLength >= 29) { size = "9-12 Months"; }
    if (futureWeight >= 24 || futureLength >= 31) { size = "12-18 Months"; }
    if (futureWeight >= 28 || futureLength >= 34) { size = "18-24 Months"; }
    if (futureWeight >= 32 || futureLength >= 36) { size = "2T"; }
    if (futureWeight >= 36 || futureLength >= 39) { size = "3T"; }
    return {
      primary: { label: "Predicted Size", value: size },
      details: [
        { label: "Predicted Weight", value: formatNumber(Math.round(futureWeight * 10) / 10) + " lbs" },
        { label: "Predicted Length", value: formatNumber(Math.round(futureLength * 10) / 10) + " in" },
        { label: "Future Age", value: formatNumber(futureAge) + " months" },
        { label: "Monthly Weight Gain Rate", value: formatNumber(monthlyWeightGain) + " lbs/mo" }
      ]
    };
  },
  }],
  relatedSlugs: ["car-seat-expiration-calculator","baby-food-stage-calculator","baby-name-popularity-calculator"],
  faq: [
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
  ],
  formula: "Future Weight = Current Weight + (Monthly Gain x Months Ahead)
Size based on predicted weight and length thresholds",
};
