import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const termLifeInsuranceCalculator: CalculatorDefinition = {
  slug: "term-life-insurance-calculator",
  title: "Term Life Insurance Calculator",
  description:
    "Estimate your term life insurance premium and coverage needs. Compare costs by term length, coverage amount, and health factors.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["term life insurance", "life insurance premium", "coverage amount", "insurance cost", "death benefit"],
  variants: [
    {
      id: "premiumEstimate",
      name: "Premium Estimate",
      fields: [
        { name: "coverageAmount", label: "Coverage Amount ($)", type: "number", placeholder: "e.g. 500000" },
        { name: "termLength", label: "Term Length (years)", type: "number", placeholder: "e.g. 20" },
        { name: "age", label: "Current Age", type: "number", placeholder: "e.g. 35" },
        { name: "healthClass", label: "Health Class (1=Preferred Plus, 2=Preferred, 3=Standard, 4=Substandard)", type: "number", placeholder: "e.g. 2" },
        { name: "isSmoker", label: "Smoker? (0=No, 1=Yes)", type: "number", placeholder: "e.g. 0" },
      ],
      calculate: (inputs) => {
        const coverageAmount = inputs.coverageAmount as number;
        const termLength = inputs.termLength as number;
        const age = inputs.age as number;
        const healthClass = inputs.healthClass as number;
        const isSmoker = inputs.isSmoker as number;

        if (!coverageAmount || !termLength || !age) return null;

        const baseRate = 0.1; // per $1000 per year base
        const ageFactor = 1 + (age - 25) * 0.04;
        const healthMultiplier = healthClass === 1 ? 0.8 : healthClass === 2 ? 1.0 : healthClass === 3 ? 1.4 : 2.0;
        const smokerMultiplier = isSmoker ? 2.5 : 1.0;
        const termMultiplier = termLength <= 10 ? 0.8 : termLength <= 20 ? 1.0 : 1.3;

        const annualPremium = (coverageAmount / 1000) * baseRate * ageFactor * healthMultiplier * smokerMultiplier * termMultiplier;
        const monthlyPremium = annualPremium / 12;
        const totalPremiums = annualPremium * termLength;
        const costPerThousand = annualPremium / (coverageAmount / 1000);

        return {
          primary: { label: "Estimated Monthly Premium", value: `$${formatNumber(monthlyPremium, 2)}` },
          details: [
            { label: "Annual Premium", value: `$${formatNumber(annualPremium, 2)}` },
            { label: "Total Premiums Over Term", value: `$${formatNumber(totalPremiums, 2)}` },
            { label: "Coverage Amount", value: `$${formatNumber(coverageAmount, 0)}` },
            { label: "Cost per $1,000 Coverage", value: `$${formatNumber(costPerThousand, 2)}` },
            { label: "Term Length", value: `${termLength} years` },
          ],
        };
      },
    },
    {
      id: "coverageComparison",
      name: "Term Comparison",
      fields: [
        { name: "coverageAmount", label: "Coverage Amount ($)", type: "number", placeholder: "e.g. 500000" },
        { name: "age", label: "Current Age", type: "number", placeholder: "e.g. 35" },
        { name: "healthClass", label: "Health Class (1-4)", type: "number", placeholder: "e.g. 2" },
      ],
      calculate: (inputs) => {
        const coverageAmount = inputs.coverageAmount as number;
        const age = inputs.age as number;
        const healthClass = inputs.healthClass as number || 2;

        if (!coverageAmount || !age) return null;

        const baseRate = 0.1;
        const ageFactor = 1 + (age - 25) * 0.04;
        const healthMultiplier = healthClass === 1 ? 0.8 : healthClass === 2 ? 1.0 : healthClass === 3 ? 1.4 : 2.0;

        const terms = [10, 15, 20, 25, 30];
        const termMultipliers = [0.8, 0.9, 1.0, 1.15, 1.3];

        const results = terms.map((term, i) => {
          const annual = (coverageAmount / 1000) * baseRate * ageFactor * healthMultiplier * termMultipliers[i];
          return { term, monthly: annual / 12, total: annual * term };
        });

        return {
          primary: { label: "10-Year Monthly Premium", value: `$${formatNumber(results[0].monthly, 2)}` },
          details: results.map((r) => ({
            label: `${r.term}-Year Term (monthly / total)`,
            value: `$${formatNumber(r.monthly, 2)} / $${formatNumber(r.total, 0)}`,
          })),
        };
      },
    },
  ],
  relatedSlugs: ["life-insurance-need-calculator", "whole-life-insurance-calculator", "retirement-calculator"],
  faq: [
    { question: "What is term life insurance?", answer: "Term life insurance provides coverage for a specific period (e.g., 10, 20, or 30 years). If you pass away during the term, your beneficiaries receive the death benefit. It's typically the most affordable type of life insurance." },
    { question: "How much term life insurance do I need?", answer: "A common rule of thumb is 10-12 times your annual income. Consider debts, mortgage, children's education costs, and your spouse's income needs when determining coverage." },
  ],
  formula: "Premium ≈ (Coverage / 1000) × Base Rate × Age Factor × Health Multiplier × Smoker Multiplier × Term Multiplier",
};
