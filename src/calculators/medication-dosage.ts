import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const medicationDosageCalculator: CalculatorDefinition = {
  slug: "medication-dosage-calculator",
  title: "Medication Dosage Calculator",
  description:
    "Free weight-based medication dosage calculator. Calculate proper doses based on patient weight, prescribed mg/kg, and dosing frequency.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["medication dosage", "weight-based dosing", "mg per kg", "drug dosage"],
  variants: [
    {
      id: "weightBased",
      name: "Weight-Based Dosing",
      fields: [
        {
          name: "weight",
          label: "Patient Weight (kg)",
          type: "number",
          placeholder: "e.g. 70",
        },
        {
          name: "mgPerKg",
          label: "Prescribed Dose (mg/kg)",
          type: "number",
          placeholder: "e.g. 10",
        },
        {
          name: "frequency",
          label: "Doses Per Day",
          type: "number",
          placeholder: "e.g. 3",
        },
      ],
      calculate: (inputs) => {
        const weight = inputs.weight as number;
        const mgPerKg = inputs.mgPerKg as number;
        const frequency = inputs.frequency as number;
        if (!weight || !mgPerKg || !frequency) return null;

        const singleDose = weight * mgPerKg;
        const dailyDose = singleDose * frequency;
        const intervalHours = 24 / frequency;

        return {
          primary: {
            label: "Single Dose",
            value: `${formatNumber(singleDose, 1)} mg`,
          },
          details: [
            { label: "Daily Total Dose", value: `${formatNumber(dailyDose, 1)} mg/day` },
            { label: "Doses Per Day", value: `${formatNumber(frequency, 0)} times` },
            { label: "Dosing Interval", value: `Every ${formatNumber(intervalHours, 1)} hours` },
            { label: "Patient Weight", value: `${formatNumber(weight, 1)} kg` },
            { label: "Prescribed mg/kg", value: `${formatNumber(mgPerKg, 2)} mg/kg` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["pediatric-dose-calculator", "insulin-dose-calculator"],
  faq: [
    {
      question: "How is weight-based dosing calculated?",
      answer:
        "Weight-based dosing multiplies the patient's weight in kilograms by the prescribed dose in mg/kg to determine the appropriate amount per administration.",
    },
    {
      question: "Why is weight-based dosing important?",
      answer:
        "Weight-based dosing ensures patients receive a dose proportional to their body size, which is critical for drug effectiveness and safety, especially in pediatric and oncology settings.",
    },
  ],
  formula:
    "Single Dose = Weight (kg) \u00D7 mg/kg. Daily Dose = Single Dose \u00D7 frequency.",
};
