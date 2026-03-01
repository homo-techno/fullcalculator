import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const zeroWasteSavingsCalculator: CalculatorDefinition = {
  slug: "zero-waste-savings-calculator",
  title: "Zero Waste Savings Calculator",
  description: "Estimate the money you can save by adopting zero waste habits across common household categories.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["zero waste savings", "zero waste lifestyle", "waste reduction savings"],
  variants: [{
    id: "standard",
    name: "Zero Waste Savings",
    description: "Estimate the money you can save by adopting zero waste habits across common household categories",
    fields: [
      { name: "monthlyGrocery", label: "Monthly Grocery Budget", type: "number", prefix: "$", min: 50, max: 5000, defaultValue: 600 },
      { name: "adoptionLevel", label: "Zero Waste Adoption Level", type: "select", options: [{value:"beginner",label:"Beginner (25%)"},{value:"intermediate",label:"Intermediate (50%)"},{value:"advanced",label:"Advanced (75%)"}], defaultValue: "intermediate" },
      { name: "householdSize", label: "Household Size", type: "number", suffix: "people", min: 1, max: 12, defaultValue: 3 },
    ],
    calculate: (inputs) => {
      const grocery = inputs.monthlyGrocery as number;
      const level = inputs.adoptionLevel as string;
      const household = inputs.householdSize as number;
      if (!grocery || !household) return null;
      const savingsRate: Record<string, number> = { beginner: 0.10, intermediate: 0.20, advanced: 0.30 };
      const rate = savingsRate[level] || 0.20;
      const monthlyFoodSavings = grocery * rate;
      const monthlyProductSavings = household * 15 * rate * 3;
      const totalMonthlySavings = monthlyFoodSavings + monthlyProductSavings;
      const annualSavings = totalMonthlySavings * 12;
      const wasteReduction = household * 4.4 * (rate * 2.5) * 52;
      return {
        primary: { label: "Annual Savings", value: "$" + formatNumber(Math.round(annualSavings)) },
        details: [
          { label: "Monthly Savings", value: "$" + formatNumber(Math.round(totalMonthlySavings)) },
          { label: "Waste Reduced per Year", value: formatNumber(Math.round(wasteReduction)) + " lbs" },
          { label: "Adoption Level", value: level.charAt(0).toUpperCase() + level.slice(1) },
        ],
      };
    },
  }],
  relatedSlugs: ["cloth-diaper-savings-calculator", "water-conservation-calculator"],
  faq: [
    { question: "How much money can zero waste living save?", answer: "Most households save between $1,000 and $5,000 per year by reducing packaging waste, buying in bulk, and choosing reusable products over disposable ones." },
    { question: "What are easy first steps for zero waste?", answer: "Start with reusable bags, water bottles, and containers. Buy in bulk, compost food scraps, and switch to bar soap and shampoo to reduce packaging." },
  ],
  formula: "Annual Savings = (Grocery Budget x Savings Rate + Product Savings) x 12",
};
