import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const umbrellaInsuranceCoverageCalculator: CalculatorDefinition = {
  slug: "umbrella-insurance-coverage-calculator",
  title: "Umbrella Insurance Coverage Calculator",
  description: "Determine how much umbrella insurance coverage you need based on your assets and risk.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["umbrella insurance", "umbrella policy calculator", "liability coverage"],
  variants: [{
    id: "standard",
    name: "Umbrella Insurance Coverage",
    description: "Determine how much umbrella insurance coverage you need based on your assets and risk",
    fields: [
      { name: "netWorth", label: "Net Worth", type: "number", prefix: "$", min: 0, max: 50000000, defaultValue: 500000 },
      { name: "annualIncome", label: "Annual Income", type: "number", prefix: "$", min: 0, max: 10000000, defaultValue: 150000 },
      { name: "properties", label: "Number of Properties", type: "number", min: 0, max: 20, defaultValue: 1 },
      { name: "vehicles", label: "Number of Vehicles", type: "number", min: 0, max: 10, defaultValue: 2 },
    ],
    calculate: (inputs) => {
      const netWorth = inputs.netWorth as number;
      const income = inputs.annualIncome as number;
      const props = inputs.properties as number;
      const vehicles = inputs.vehicles as number;
      if (!netWorth && !income) return null;
      const assetBased = Math.ceil(netWorth / 1000000) * 1000000;
      const incomeBased = Math.ceil((income * 5) / 1000000) * 1000000;
      const recommended = Math.max(assetBased, incomeBased, 1000000);
      const riskFactors = props + vehicles;
      const premiumEstimate = recommended / 1000000 * 300 + riskFactors * 50;
      return {
        primary: { label: "Recommended Coverage", value: "$" + formatNumber(recommended) },
        details: [
          { label: "Asset-Based Minimum", value: "$" + formatNumber(assetBased) },
          { label: "Income-Based Minimum", value: "$" + formatNumber(incomeBased) },
          { label: "Risk Factors (props + vehicles)", value: formatNumber(riskFactors) },
          { label: "Estimated Annual Premium", value: "$" + formatNumber(Math.round(premiumEstimate)) },
        ],
      };
    },
  }],
  relatedSlugs: ["homeowners-insurance-estimate-calculator", "auto-insurance-deductible-comparison-calculator"],
  faq: [
    { question: "How much umbrella insurance do I need?", answer: "A common guideline is to have umbrella coverage equal to your net worth or at least 5 times your annual income." },
    { question: "How much does umbrella insurance cost?", answer: "Umbrella policies typically cost $150 to $300 per year for the first million in coverage." },
  ],
  formula: "Recommended = max(Net Worth rounded up to nearest million, Income x 5 rounded up)",
};
