import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const liquidMedicationCalculator: CalculatorDefinition = {
  slug: "liquid-medication-calculator",
  title: "Liquid Medication Calculator",
  description: "Calculate liquid medication dose by body weight and concentration.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["liquid medication dose","suspension dosage calculator","pediatric liquid dose"],
  variants: [{
    id: "standard",
    name: "Liquid Medication",
    description: "Calculate liquid medication dose by body weight and concentration.",
    fields: [
      { name: "bodyWeight", label: "Body Weight (kg)", type: "number", min: 1, max: 200, defaultValue: 20 },
      { name: "doseRate", label: "Dose Rate (mg/kg)", type: "number", min: 0.1, max: 100, defaultValue: 15 },
      { name: "concentration", label: "Concentration (mg/mL)", type: "number", min: 1, max: 500, defaultValue: 25 },
      { name: "frequency", label: "Doses per Day", type: "number", min: 1, max: 6, defaultValue: 3 },
    ],
    calculate: (inputs) => {
    const bodyWeight = inputs.bodyWeight as number;
    const doseRate = inputs.doseRate as number;
    const concentration = inputs.concentration as number;
    const frequency = inputs.frequency as number;
    const singleDoseMg = bodyWeight * doseRate;
    const singleDoseMl = singleDoseMg / concentration;
    const dailyMl = singleDoseMl * frequency;
    const dailyMg = singleDoseMg * frequency;
    return {
      primary: { label: "Volume per Dose", value: formatNumber(Math.round(singleDoseMl * 10) / 10) + " mL" },
      details: [
        { label: "Dose per Administration", value: formatNumber(singleDoseMg) + " mg" },
        { label: "Total Daily Volume", value: formatNumber(Math.round(dailyMl * 10) / 10) + " mL" },
        { label: "Total Daily Dose", value: formatNumber(dailyMg) + " mg" },
        { label: "Frequency", value: frequency + " times per day" }
      ]
    };
  },
  }],
  relatedSlugs: ["pill-dosage-calculator","iv-drip-rate-calculator","medication-half-life-calculator"],
  faq: [
    { question: "How do you calculate liquid medication dosage?", answer: "Divide the required dose (mg) by the concentration (mg/mL) to get the volume." },
    { question: "Why are liquid medications used for children?", answer: "Liquids allow precise dosing for smaller body weights and are easier to swallow." },
    { question: "How should liquid medications be measured?", answer: "Use an oral syringe or dosing cup for accuracy instead of household spoons." },
  ],
  formula: "Volume (mL) = (Body Weight x Dose Rate) / Concentration",
};
