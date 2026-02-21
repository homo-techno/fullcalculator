import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const petMedicationDoseCalculator: CalculatorDefinition = {
  slug: "pet-medication-dose-calculator",
  title: "Pet Medication Dosage Calculator",
  description:
    "Free pet medication dosage calculator. Calculate correct medication doses for dogs and cats based on weight and prescribed dosage rate.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "pet medication calculator",
    "dog medication dosage",
    "cat medication dosage",
    "pet drug dose calculator",
    "veterinary dosage calculator",
  ],
  variants: [
    {
      id: "weightBased",
      name: "Weight-Based Dosing",
      fields: [
        {
          name: "petWeight",
          label: "Pet Weight (lbs)",
          type: "number",
          placeholder: "e.g. 50",
          min: 0.5,
          max: 250,
          step: 0.5,
        },
        {
          name: "doseRate",
          label: "Dose Rate (mg per lb)",
          type: "number",
          placeholder: "e.g. 5",
          min: 0.01,
          step: 0.01,
        },
        {
          name: "frequency",
          label: "Frequency",
          type: "select",
          options: [
            { label: "Once daily (SID)", value: "1" },
            { label: "Twice daily (BID)", value: "2" },
            { label: "Three times daily (TID)", value: "3" },
            { label: "Every other day", value: "0.5" },
          ],
        },
        {
          name: "concentration",
          label: "Medication Strength (mg per tablet/mL)",
          type: "number",
          placeholder: "e.g. 100",
          min: 0.1,
          step: 0.1,
        },
      ],
      calculate: (inputs) => {
        const petWeight = inputs.petWeight as number;
        const doseRate = inputs.doseRate as number;
        const frequency = parseFloat((inputs.frequency as string) || "1");
        const concentration = inputs.concentration as number;
        if (!petWeight || !doseRate || petWeight <= 0 || doseRate <= 0) return null;

        const dosePerAdmin = petWeight * doseRate; // mg per dose
        const dailyDose = dosePerAdmin * frequency;
        const weightKg = petWeight * 0.453592;
        const dosePerKg = doseRate * 2.20462; // convert mg/lb to mg/kg

        const details: { label: string; value: string }[] = [
          { label: "Dose Per Administration", value: formatNumber(dosePerAdmin, 2) + " mg" },
          { label: "Total Daily Dose", value: formatNumber(dailyDose, 2) + " mg" },
          { label: "Dose Rate (per kg)", value: formatNumber(dosePerKg, 2) + " mg/kg" },
          { label: "Pet Weight", value: formatNumber(petWeight, 1) + " lbs (" + formatNumber(weightKg, 1) + " kg)" },
          {
            label: "Frequency",
            value:
              frequency === 0.5
                ? "Every other day"
                : frequency === 1
                ? "Once daily"
                : frequency === 2
                ? "Twice daily"
                : "Three times daily",
          },
        ];

        if (concentration && concentration > 0) {
          const unitsPerDose = dosePerAdmin / concentration;
          details.push({
            label: "Tablets/mL Per Dose",
            value: formatNumber(unitsPerDose, 2),
          });
        }

        return {
          primary: {
            label: "Per Dose",
            value: formatNumber(dosePerAdmin, 2) + " mg",
          },
          details,
          note: "Always consult your veterinarian before administering any medication. This calculator is for reference only.",
        };
      },
    },
    {
      id: "liquidDosing",
      name: "Liquid Medication",
      fields: [
        {
          name: "petWeight",
          label: "Pet Weight (lbs)",
          type: "number",
          placeholder: "e.g. 20",
          min: 0.5,
          max: 250,
        },
        {
          name: "doseRate",
          label: "Dose Rate (mg per lb)",
          type: "number",
          placeholder: "e.g. 2.5",
          min: 0.01,
          step: 0.01,
        },
        {
          name: "liquidConc",
          label: "Liquid Concentration (mg/mL)",
          type: "number",
          placeholder: "e.g. 25",
          min: 0.1,
          step: 0.1,
        },
      ],
      calculate: (inputs) => {
        const petWeight = inputs.petWeight as number;
        const doseRate = inputs.doseRate as number;
        const liquidConc = inputs.liquidConc as number;
        if (!petWeight || !doseRate || !liquidConc || petWeight <= 0 || doseRate <= 0 || liquidConc <= 0) return null;

        const doseMg = petWeight * doseRate;
        const doseML = doseMg / liquidConc;
        const doseTeaspoons = doseML / 5;

        return {
          primary: {
            label: "Volume Per Dose",
            value: formatNumber(doseML, 2) + " mL",
          },
          details: [
            { label: "Dose (mg)", value: formatNumber(doseMg, 2) + " mg" },
            { label: "Volume (mL)", value: formatNumber(doseML, 2) + " mL" },
            { label: "Volume (tsp)", value: formatNumber(doseTeaspoons, 2) + " teaspoons" },
            { label: "Concentration", value: liquidConc + " mg/mL" },
          ],
          note: "Always verify dosing with your veterinarian. Use an oral syringe for accurate measurement.",
        };
      },
    },
  ],
  relatedSlugs: ["pet-food-calculator", "dog-calorie-calculator", "cat-calorie-calculator"],
  faq: [
    {
      question: "How do I calculate medication dosage for my pet?",
      answer:
        "Multiply your pet's weight (in lbs) by the prescribed dose rate (mg per lb) to get the total dose in milligrams. Then divide by the medication strength (mg per tablet or mg per mL) to find how many tablets or mL to give. Always follow your veterinarian's specific instructions.",
    },
    {
      question: "Why is accurate pet weight important for dosing?",
      answer:
        "Even small weight differences can significantly affect drug dosage, especially in small pets. A 1-lb error in a 5-lb cat represents a 20% dosing error. Always weigh your pet on an accurate scale before calculating medication doses.",
    },
    {
      question: "Can I use human medications for my pet?",
      answer:
        "Some human medications can be used in pets at different dosages (like diphenhydramine), but many are toxic to animals (such as acetaminophen for cats, xylitol-containing products, and ibuprofen). Never give your pet human medication without explicit veterinary guidance.",
    },
  ],
  formula:
    "Dose (mg) = Pet Weight (lbs) x Dose Rate (mg/lb). Tablets = Dose (mg) / Tablet Strength (mg). Volume (mL) = Dose (mg) / Concentration (mg/mL). Daily total = single dose x frequency.",
};
