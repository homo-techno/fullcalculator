import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const homeValueEstimatorCalculator: CalculatorDefinition = {
  slug: "home-value-estimator",
  title: "Home Value Estimator",
  description: "Estimate home value based on square footage, bedrooms, and local price per square foot.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["home value estimate", "house value calculator", "property value estimator"],
  variants: [{
    id: "standard",
    name: "Home Value",
    description: "Estimate home value based on square footage, bedrooms, and local price per square foot",
    fields: [
      { name: "sqft", label: "Square Footage", type: "number", suffix: "sq ft", min: 200, max: 20000, defaultValue: 2000 },
      { name: "bedrooms", label: "Bedrooms", type: "number", min: 1, max: 10, defaultValue: 3 },
      { name: "bathrooms", label: "Bathrooms", type: "number", min: 1, max: 10, defaultValue: 2 },
      { name: "pricePerSqft", label: "Local Price per Sq Ft", type: "number", prefix: "$", min: 10, max: 2000, defaultValue: 200 },
    ],
    calculate: (inputs) => {
      const sqft = inputs.sqft as number;
      const beds = inputs.bedrooms as number;
      const baths = inputs.bathrooms as number;
      const ppsf = inputs.pricePerSqft as number;
      if (!sqft || sqft <= 0 || !ppsf || ppsf <= 0) return null;
      const baseValue = sqft * ppsf;
      const bedAdj = (beds - 3) * baseValue * 0.03;
      const bathAdj = (baths - 2) * baseValue * 0.04;
      const estimated = baseValue + bedAdj + bathAdj;
      return {
        primary: { label: "Estimated Home Value", value: "$" + formatNumber(Math.round(estimated)) },
        details: [
          { label: "Base Value (sqft x price)", value: "$" + formatNumber(baseValue) },
          { label: "Bedroom Adjustment", value: "$" + formatNumber(Math.round(bedAdj)) },
          { label: "Bathroom Adjustment", value: "$" + formatNumber(Math.round(bathAdj)) },
        ],
      };
    },
  }],
  relatedSlugs: ["net-operating-income-calculator", "homeowners-insurance-estimate-calculator"],
  faq: [
    { question: "How is home value estimated?", answer: "Home value is commonly estimated using comparable sales, price per square foot, and adjustments for features like bedrooms and bathrooms." },
    { question: "What increases home value the most?", answer: "Kitchen and bathroom remodels, added square footage, and energy efficiency upgrades typically offer the highest return." },
  ],
  formula: "Estimated Value = (Sq Ft x Price/SqFt) + Bedroom Adj + Bathroom Adj",
};
