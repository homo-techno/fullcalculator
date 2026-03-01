import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const petMedicationDosageCalculator: CalculatorDefinition = {
  slug: "pet-medication-dosage-calculator",
  title: "Pet Medication Dosage Calculator",
  description: "Calculate pet medication dose based on weight.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["pet medication dose","dog medicine dosage"],
  variants: [{
    id: "standard",
    name: "Pet Medication Dosage",
    description: "Calculate pet medication dose based on weight.",
    fields: [
      { name: "petWeight", label: "Pet Weight (lbs)", type: "number", min: 1, max: 200, defaultValue: 30 },
      { name: "dosePerKg", label: "Dose Per kg (mg)", type: "number", min: 0.1, max: 500, defaultValue: 10 },
      { name: "frequency", label: "Doses Per Day", type: "number", min: 1, max: 4, defaultValue: 2 },
    ],
    calculate: (inputs) => {
      const weightLbs = inputs.petWeight as number;
      const dosePerKg = inputs.dosePerKg as number;
      const freq = inputs.frequency as number;
      if (!weightLbs || !dosePerKg || !freq) return null;
      const weightKg = weightLbs * 0.4536;
      const singleDose = weightKg * dosePerKg;
      const dailyDose = singleDose * freq;
      const weeklyDose = dailyDose * 7;
      return {
        primary: { label: "Single Dose", value: formatNumber(Math.round(singleDose * 10) / 10) + " mg" },
        details: [
          { label: "Weight (kg)", value: formatNumber(Math.round(weightKg * 10) / 10) },
          { label: "Daily Total", value: formatNumber(Math.round(dailyDose * 10) / 10) + " mg" },
          { label: "Weekly Total", value: formatNumber(Math.round(weeklyDose)) + " mg" },
        ],
      };
  },
  }],
  relatedSlugs: [],
  faq: [
    { question: "Can I use human medicine for pets?", answer: "Never give pets human medicine without consulting a veterinarian." },
    { question: "How do I convert lbs to kg for dosing?", answer: "Divide the weight in pounds by 2.205 to get kilograms." },
  ],
  formula: "Dose = Weight (kg) x Dose Per kg",
};
