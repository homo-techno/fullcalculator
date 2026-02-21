import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const dosageByWeightCalculator: CalculatorDefinition = {
  slug: "dosage-by-weight-calculator",
  title: "Drug Dosage by Weight Calculator",
  description:
    "Free drug dosage by weight calculator. Calculate medication dosage based on body weight (mg/kg). Commonly used for pediatric and weight-based dosing.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "dosage by weight",
    "mg per kg",
    "drug dose calculator",
    "pediatric dosing",
    "weight based dosing",
    "medication calculator",
    "dose calculation",
  ],
  variants: [
    {
      id: "single-dose",
      name: "Single Dose Calculation",
      description: "Calculate a single dose based on weight and prescribed mg/kg",
      fields: [
        {
          name: "weight",
          label: "Patient Weight",
          type: "number",
          placeholder: "e.g. 25",
          suffix: "kg",
          min: 0.5,
          max: 300,
          step: 0.1,
        },
        {
          name: "dosePerKg",
          label: "Dose per kg",
          type: "number",
          placeholder: "e.g. 10",
          suffix: "mg/kg",
          min: 0.01,
          max: 1000,
          step: 0.01,
        },
        {
          name: "frequency",
          label: "Doses per Day",
          type: "select",
          options: [
            { label: "Once daily (QD)", value: "1" },
            { label: "Twice daily (BID)", value: "2" },
            { label: "Three times daily (TID)", value: "3" },
            { label: "Four times daily (QID)", value: "4" },
            { label: "Every 6 hours (Q6H)", value: "4" },
            { label: "Every 8 hours (Q8H)", value: "3" },
            { label: "Every 12 hours (Q12H)", value: "2" },
          ],
        },
      ],
      calculate: (inputs) => {
        const weight = inputs.weight as number;
        const dosePerKg = inputs.dosePerKg as number;
        const freqStr = inputs.frequency as string;
        if (!weight || !dosePerKg || !freqStr) return null;
        const freq = parseInt(freqStr);

        const singleDose = weight * dosePerKg;
        const dailyDose = singleDose * freq;

        return {
          primary: { label: "Single Dose", value: `${formatNumber(singleDose, 1)} mg` },
          details: [
            { label: "Single dose", value: `${formatNumber(singleDose, 2)} mg` },
            { label: "Daily total dose", value: `${formatNumber(dailyDose, 2)} mg` },
            { label: "Patient weight", value: `${weight} kg` },
            { label: "Dose rate", value: `${dosePerKg} mg/kg/dose` },
            { label: "Frequency", value: `${freq} times per day` },
            { label: "Daily dose per kg", value: `${formatNumber(dosePerKg * freq, 2)} mg/kg/day` },
          ],
          note: "Always verify dosing with official drug references (e.g., Lexicomp, Micromedex) and institutional protocols. Check maximum dose limits, renal/hepatic adjustments, and age-specific dosing. This calculator does not account for maximum dose caps. This is NOT medical advice — always confirm with a pharmacist or physician.",
        };
      },
    },
    {
      id: "liquid-dose",
      name: "Liquid Medication Dose",
      description: "Calculate volume of liquid medication needed based on weight",
      fields: [
        {
          name: "weight",
          label: "Patient Weight",
          type: "number",
          placeholder: "e.g. 20",
          suffix: "kg",
          min: 0.5,
          max: 300,
          step: 0.1,
        },
        {
          name: "dosePerKg",
          label: "Prescribed Dose",
          type: "number",
          placeholder: "e.g. 15",
          suffix: "mg/kg",
          min: 0.01,
          max: 1000,
          step: 0.01,
        },
        {
          name: "concentration",
          label: "Medication Concentration",
          type: "number",
          placeholder: "e.g. 250",
          suffix: "mg per 5 mL",
          min: 0.1,
          max: 10000,
          step: 0.1,
        },
      ],
      calculate: (inputs) => {
        const weight = inputs.weight as number;
        const dosePerKg = inputs.dosePerKg as number;
        const concentration = inputs.concentration as number;
        if (!weight || !dosePerKg || !concentration) return null;

        const doseNeeded = weight * dosePerKg;
        const mgPerMl = concentration / 5;
        const volumeMl = doseNeeded / mgPerMl;
        const volumeTsp = volumeMl / 5;

        return {
          primary: { label: "Volume to Administer", value: `${formatNumber(volumeMl, 1)} mL` },
          details: [
            { label: "Dose needed", value: `${formatNumber(doseNeeded, 1)} mg` },
            { label: "Volume needed", value: `${formatNumber(volumeMl, 2)} mL` },
            { label: "Volume in teaspoons", value: `${formatNumber(volumeTsp, 1)} tsp` },
            { label: "Concentration", value: `${concentration} mg / 5 mL (${formatNumber(mgPerMl, 1)} mg/mL)` },
            { label: "Patient weight", value: `${weight} kg` },
          ],
          note: "Use a measured oral syringe for accurate dosing — kitchen spoons are not accurate. Always verify the drug concentration on the bottle label. Double-check calculations before administering. This is NOT medical advice.",
        };
      },
    },
    {
      id: "weight-conversion",
      name: "Weight Conversion for Dosing",
      description: "Convert weight from pounds to kilograms for dosing purposes",
      fields: [
        {
          name: "weightLbs",
          label: "Weight in Pounds",
          type: "number",
          placeholder: "e.g. 55",
          suffix: "lbs",
          min: 1,
          max: 660,
          step: 0.5,
        },
        {
          name: "dosePerKg",
          label: "Prescribed Dose",
          type: "number",
          placeholder: "e.g. 10",
          suffix: "mg/kg",
          min: 0.01,
          max: 1000,
          step: 0.01,
        },
      ],
      calculate: (inputs) => {
        const lbs = inputs.weightLbs as number;
        const dosePerKg = inputs.dosePerKg as number;
        if (!lbs || !dosePerKg) return null;

        const kg = lbs / 2.205;
        const dose = kg * dosePerKg;

        return {
          primary: { label: "Calculated Dose", value: `${formatNumber(dose, 1)} mg` },
          details: [
            { label: "Weight", value: `${lbs} lbs = ${formatNumber(kg, 1)} kg` },
            { label: "Dose rate", value: `${dosePerKg} mg/kg` },
            { label: "Calculated dose", value: `${formatNumber(dose, 2)} mg` },
          ],
          note: "Always use kilograms for dosing calculations. 1 kg = 2.205 lbs. Verify dosing with official drug references and check maximum dose limits. This is NOT medical advice.",
        };
      },
    },
  ],
  relatedSlugs: ["iv-flow-rate-calculator", "pediatric-dose-calculator", "medication-dosage-calculator"],
  faq: [
    {
      question: "Why are drugs dosed by weight?",
      answer:
        "Weight-based dosing accounts for differences in body size that affect drug distribution, metabolism, and clearance. It is especially important in pediatrics, oncology, and critical care where body size varies significantly.",
    },
    {
      question: "How do I convert pounds to kilograms for dosing?",
      answer:
        "Divide weight in pounds by 2.205 to get kilograms. For example, 110 lbs = 49.9 kg. Always use kilograms for dose calculations. Many medication errors occur from using pounds instead of kilograms.",
    },
    {
      question: "What is mg/kg/dose vs mg/kg/day?",
      answer:
        "mg/kg/dose is the amount per individual dose. mg/kg/day is the total daily amount. For example, amoxicillin 25 mg/kg/day divided TID means each dose is approximately 8.3 mg/kg.",
    },
    {
      question: "Is there a maximum dose even with weight-based dosing?",
      answer:
        "Yes. Most medications have absolute maximum doses regardless of weight. For example, even if weight-based calculation yields more, ibuprofen should not exceed 800 mg per dose or 3200 mg per day in adults.",
    },
  ],
  formula:
    "Dose (mg) = Weight (kg) x Dose rate (mg/kg) | Daily dose = Single dose x Frequency | Liquid volume (mL) = Dose needed (mg) / Concentration (mg/mL)",
};
