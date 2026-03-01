import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const homeownersInsuranceEstimateCalculator: CalculatorDefinition = {
  slug: "homeowners-insurance-estimate-calculator",
  title: "Homeowners Insurance Estimate Calculator",
  description: "Estimate your annual homeowners insurance premium based on home value and coverage.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["homeowners insurance estimate", "home insurance cost", "dwelling coverage calculator"],
  variants: [{
    id: "standard",
    name: "Homeowners Insurance Estimate",
    description: "Estimate your annual homeowners insurance premium based on home value and coverage",
    fields: [
      { name: "homeValue", label: "Home Value", type: "number", prefix: "$", min: 50000, max: 10000000, defaultValue: 350000 },
      { name: "dwellingCoverage", label: "Dwelling Coverage", type: "number", prefix: "$", min: 50000, max: 10000000, defaultValue: 300000 },
      { name: "deductible", label: "Deductible", type: "number", prefix: "$", min: 500, max: 25000, defaultValue: 1000 },
    ],
    calculate: (inputs) => {
      const value = inputs.homeValue as number;
      const dwelling = inputs.dwellingCoverage as number;
      const deductible = inputs.deductible as number;
      if (!value || value <= 0 || !dwelling || dwelling <= 0) return null;
      const baseRate = 0.0035;
      const basePremium = dwelling * baseRate;
      const deductibleDiscount = deductible >= 2500 ? 0.85 : deductible >= 1000 ? 0.95 : 1.0;
      const annualPremium = basePremium * deductibleDiscount;
      const monthlyPremium = annualPremium / 12;
      const coverageRatio = (dwelling / value) * 100;
      return {
        primary: { label: "Estimated Annual Premium", value: "$" + formatNumber(Math.round(annualPremium)) },
        details: [
          { label: "Monthly Premium", value: "$" + formatNumber(Math.round(monthlyPremium)) },
          { label: "Coverage Ratio", value: coverageRatio.toFixed(0) + "% of home value" },
          { label: "Deductible Discount", value: ((1 - deductibleDiscount) * 100).toFixed(0) + "%" },
          { label: "Cost per $1,000 Coverage", value: "$" + formatNumber(annualPremium / (dwelling / 1000)) },
        ],
      };
    },
  }],
  relatedSlugs: ["umbrella-insurance-coverage-calculator", "home-value-estimator"],
  faq: [
    { question: "How much homeowners insurance do I need?", answer: "You should insure your dwelling for its full replacement cost, which is the cost to rebuild it, not the market value." },
    { question: "What affects homeowners insurance cost?", answer: "Location, home age, construction type, coverage amounts, deductible, and claims history all affect your premium." },
  ],
  formula: "Annual Premium = Dwelling Coverage x Base Rate x Deductible Discount",
};
