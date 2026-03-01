import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const autoInsuranceDeductibleComparisonCalculator: CalculatorDefinition = {
  slug: "auto-insurance-deductible-comparison-calculator",
  title: "Auto Insurance Deductible Calculator",
  description: "Compare auto insurance deductibles and find the break-even claim frequency.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["auto insurance deductible", "deductible comparison", "insurance deductible calculator"],
  variants: [{
    id: "standard",
    name: "Auto Insurance Deductible",
    description: "Compare auto insurance deductibles and find the break-even claim frequency",
    fields: [
      { name: "currentDeductible", label: "Current Deductible", type: "number", prefix: "$", min: 0, max: 10000, defaultValue: 500 },
      { name: "newDeductible", label: "New Deductible", type: "number", prefix: "$", min: 0, max: 10000, defaultValue: 1000 },
      { name: "premiumDifference", label: "Annual Premium Savings", type: "number", prefix: "$", min: 0, max: 5000, defaultValue: 200 },
    ],
    calculate: (inputs) => {
      const current = inputs.currentDeductible as number;
      const newDed = inputs.newDeductible as number;
      const savings = inputs.premiumDifference as number;
      if (newDed <= current || !savings || savings <= 0) return null;
      const extraRisk = newDed - current;
      const breakEvenYears = extraRisk / savings;
      const fiveYearSavings = savings * 5 - extraRisk;
      return {
        primary: { label: "Break-Even Period", value: breakEvenYears.toFixed(1) + " years without a claim" },
        details: [
          { label: "Extra Out-of-Pocket Risk", value: "$" + formatNumber(extraRisk) },
          { label: "Annual Premium Savings", value: "$" + formatNumber(savings) },
          { label: "5-Year Net Savings (no claims)", value: "$" + formatNumber(fiveYearSavings) },
        ],
      };
    },
  }],
  relatedSlugs: ["sr22-insurance-cost-calculator", "homeowners-insurance-estimate-calculator"],
  faq: [
    { question: "Should I raise my auto insurance deductible?", answer: "Raising your deductible saves on premiums but increases your cost per claim. It is best if you rarely file claims and can cover the higher deductible." },
    { question: "What is the most common auto insurance deductible?", answer: "The most common deductible is $500, though $1,000 deductibles are increasingly popular for the premium savings." },
  ],
  formula: "Break-Even Years = (New Deductible - Current Deductible) / Annual Premium Savings",
};
