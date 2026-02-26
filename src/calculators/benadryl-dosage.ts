import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const benadrylDosageCalculator: CalculatorDefinition = {
  slug: "benadryl-dosage",
  title: "Benadryl (Diphenhydramine) Dosage Calculator",
  description:
    "Free online Benadryl dosage calculator by weight and age for children and adults.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "benadryl",
    "diphenhydramine",
    "antihistamine",
    "allergy",
    "dosage",
    "pediatric",
    "children dosage",
    "OTC",
  ],
  variants: [
    {
      id: "by-weight",
      name: "Dosage by Weight",
      description:
        "Calculate diphenhydramine dose based on body weight (1-1.25 mg/kg per dose).",
      fields: [
        {
          name: "weightUnit",
          label: "Weight Unit",
          type: "select",
          options: [
            { label: "kg", value: "kg" },
            { label: "lbs", value: "lbs" },
          ],
        },
        {
          name: "weight",
          label: "Body Weight",
          type: "number",
          placeholder: "e.g. 25",
        },
        {
          name: "ageGroup",
          label: "Age Group",
          type: "select",
          options: [
            { label: "Child (2-5 years)", value: "child_young" },
            { label: "Child (6-11 years)", value: "child_older" },
            { label: "Adolescent/Adult (12+ years)", value: "adult" },
          ],
        },
        {
          name: "formulation",
          label: "Formulation",
          type: "select",
          options: [
            { label: "Liquid (12.5 mg/5 mL)", value: "liquid" },
            { label: "Chewable Tablets (12.5 mg)", value: "chewable" },
            { label: "Tablets/Capsules (25 mg)", value: "tablet" },
          ],
        },
      ],
      calculate: (inputs) => {
        let weight = parseFloat(inputs.weight as string) || 0;
        const unit = inputs.weightUnit as string;
        const ageGroup = inputs.ageGroup as string;
        const formulation = inputs.formulation as string;

        if (weight <= 0) return null;

        // Convert lbs to kg
        if (unit === "lbs") {
          weight = weight * 0.453592;
        }

        // Standard dose: 1.25 mg/kg per dose, max per age group
        const dosePerKg = 1.25; // mg/kg
        let calculatedDose = weight * dosePerKg;

        // Max single dose by age
        let maxSingleDose: number;
        if (ageGroup === "child_young") {
          maxSingleDose = 6.25; // Not generally recommended, but max
          // Actually for 2-5 years: 6.25 mg per dose is the typical OTC dose
          calculatedDose = Math.min(calculatedDose, 6.25);
        } else if (ageGroup === "child_older") {
          maxSingleDose = 25;
          calculatedDose = Math.min(calculatedDose, maxSingleDose);
        } else {
          maxSingleDose = 50;
          calculatedDose = Math.min(calculatedDose, maxSingleDose);
        }

        // Round to nearest 6.25 mg
        calculatedDose = Math.round(calculatedDose / 6.25) * 6.25;
        if (calculatedDose < 6.25) calculatedDose = 6.25;

        const maxDailyDose = calculatedDose * 4; // Every 6 hours max
        const maxDailyLimit = ageGroup === "adult" ? 300 : 150;
        const safeDailyDose = Math.min(maxDailyDose, maxDailyLimit);

        // Formulation amounts
        let formAmount: string;
        if (formulation === "liquid") {
          const ml = (calculatedDose / 12.5) * 5;
          formAmount = formatNumber(ml) + " mL";
        } else if (formulation === "chewable") {
          const tabs = calculatedDose / 12.5;
          formAmount = formatNumber(tabs) + " chewable tablet(s)";
        } else {
          const tabs = calculatedDose / 25;
          formAmount = formatNumber(tabs) + " tablet(s)/capsule(s)";
        }

        return {
          primary: {
            label: "Recommended Single Dose",
            value: formatNumber(calculatedDose),
            suffix: "mg",
          },
          details: [
            { label: "Formulation Amount", value: formAmount },
            { label: "Frequency", value: "Every 4-6 hours as needed" },
            {
              label: "Max Daily Dose",
              value: formatNumber(safeDailyDose) + " mg",
            },
            {
              label: "Max Single Dose (age group)",
              value: formatNumber(maxSingleDose) + " mg",
            },
            {
              label: "Weight Used",
              value: formatNumber(weight) + " kg",
            },
            {
              label: "Calculated Dose (by weight)",
              value: formatNumber(weight * dosePerKg) + " mg",
            },
          ],
          note: "Diphenhydramine should NOT be given to children under 2 years unless directed by a physician. Do not exceed 4 doses in 24 hours. This calculator is for informational purposes only.",
        };
      },
    },
  ],
  relatedSlugs: ["tylenol-dosage", "pediatric-dosage", "melatonin-dosage"],
  faq: [
    {
      question: "What is the standard Benadryl dose for children?",
      answer:
        "The standard diphenhydramine dose for children is 1-1.25 mg/kg per dose, given every 4-6 hours as needed. For children 2-5 years: 6.25 mg per dose; ages 6-11: 12.5-25 mg per dose; ages 12+: 25-50 mg per dose. Never exceed 4 doses in 24 hours.",
    },
    {
      question: "Can I give Benadryl to a child under 2?",
      answer:
        "Diphenhydramine is not recommended for children under 2 years of age without a doctor's explicit direction. Young children are at higher risk for side effects including paradoxical excitability, respiratory depression, and seizures.",
    },
    {
      question: "What are the side effects of Benadryl?",
      answer:
        "Common side effects include drowsiness, dry mouth, dizziness, and constipation. In some children, it can cause paradoxical hyperactivity. Serious side effects include difficulty breathing, seizures, and cardiac arrhythmias at toxic doses.",
    },
  ],
  formula:
    "Dose = 1.25 mg/kg per dose (max varies by age: 6.25 mg for ages 2-5, 25 mg for ages 6-11, 50 mg for adults). Given every 4-6 hours, max 4 doses/day.",
};
