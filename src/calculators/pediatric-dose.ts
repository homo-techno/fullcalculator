import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const pediatricDoseCalculator: CalculatorDefinition = {
  slug: "pediatric-dose-calculator",
  title: "Pediatric Dose Calculator",
  description:
    "Free pediatric dose calculator using Clark's rule. Estimate appropriate child medication doses based on weight and adult dose.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["pediatric dose", "Clark's rule", "child dosage", "medication"],
  variants: [
    {
      id: "clarks",
      name: "Clark's Rule",
      fields: [
        {
          name: "adultDose",
          label: "Adult Dose (mg)",
          type: "number",
          placeholder: "e.g. 500",
        },
        {
          name: "childWeight",
          label: "Child Weight (kg)",
          type: "number",
          placeholder: "e.g. 25",
        },
      ],
      calculate: (inputs) => {
        const adultDose = inputs.adultDose as number;
        const childWeight = inputs.childWeight as number;
        if (!adultDose || !childWeight) return null;

        const childDose = (childWeight / 70) * adultDose;
        const percentage = (childWeight / 70) * 100;

        return {
          primary: {
            label: "Pediatric Dose",
            value: `${formatNumber(childDose, 1)} mg`,
          },
          details: [
            { label: "Adult Dose", value: `${formatNumber(adultDose, 1)} mg` },
            { label: "Child Weight", value: `${formatNumber(childWeight, 1)} kg` },
            { label: "Dose Fraction", value: `${formatNumber(percentage, 1)}% of adult dose` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["medication-dosage-calculator", "body-surface-area-calculator"],
  faq: [
    {
      question: "What is Clark's rule?",
      answer:
        "Clark's rule estimates a child's medication dose by dividing the child's weight in kg by 70 (average adult weight) and multiplying by the standard adult dose.",
    },
    {
      question: "Is Clark's rule accurate for all medications?",
      answer:
        "Clark's rule provides a rough estimate. Many medications have specific pediatric dosing guidelines that should be followed. Always consult a healthcare professional.",
    },
  ],
  formula: "Child Dose = (Child Weight in kg / 70) \u00D7 Adult Dose",
};
