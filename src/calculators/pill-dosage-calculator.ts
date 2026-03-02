import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const pillDosageCalculator: CalculatorDefinition = {
  slug: "pill-dosage-calculator",
  title: "Pill Dosage Calculator",
  description: "Calculate pill dosage based on body weight and prescribed dose rate.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["pill dosage by weight","tablet dose calculator","medication dosage weight"],
  variants: [{
    id: "standard",
    name: "Pill Dosage",
    description: "Calculate pill dosage based on body weight and prescribed dose rate.",
    fields: [
      { name: "bodyWeight", label: "Body Weight (kg)", type: "number", min: 1, max: 300, defaultValue: 70 },
      { name: "doseRate", label: "Dose Rate (mg/kg)", type: "number", min: 0.1, max: 100, defaultValue: 10 },
      { name: "pillStrength", label: "Pill Strength (mg)", type: "number", min: 1, max: 1000, defaultValue: 500 },
      { name: "frequency", label: "Doses per Day", type: "number", min: 1, max: 6, defaultValue: 2 },
    ],
    calculate: (inputs) => {
    const bodyWeight = inputs.bodyWeight as number;
    const doseRate = inputs.doseRate as number;
    const pillStrength = inputs.pillStrength as number;
    const frequency = inputs.frequency as number;
    const totalDailyDose = bodyWeight * doseRate * frequency;
    const singleDose = bodyWeight * doseRate;
    const pillsPerDose = singleDose / pillStrength;
    const pillsPerDay = pillsPerDose * frequency;
    return {
      primary: { label: "Pills per Dose", value: formatNumber(Math.ceil(pillsPerDose * 10) / 10) },
      details: [
        { label: "Single Dose", value: formatNumber(singleDose) + " mg" },
        { label: "Total Daily Dose", value: formatNumber(totalDailyDose) + " mg" },
        { label: "Pills per Day", value: formatNumber(Math.ceil(pillsPerDay * 10) / 10) },
        { label: "Doses per Day", value: formatNumber(frequency) }
      ]
    };
  },
  }],
  relatedSlugs: ["liquid-medication-calculator","medication-half-life-calculator","iv-drip-rate-calculator"],
  faq: [
    { question: "How is pill dosage calculated by weight?", answer: "Multiply the dose rate (mg/kg) by body weight (kg) to get the dose in mg." },
    { question: "Should I round pill dosages up or down?", answer: "Always consult your prescriber before rounding doses, especially with potent drugs." },
    { question: "What if the calculated dose is between pill sizes?", answer: "A pharmacist can advise whether to round up, round down, or split tablets." },
  ],
  formula: "Pills per Dose = (Body Weight x Dose Rate) / Pill Strength",
};
