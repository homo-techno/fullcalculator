import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const healthInsurancePremiumTaxCreditCalculator: CalculatorDefinition = {
  slug: "health-insurance-premium-tax-credit-calculator",
  title: "Health Insurance Tax Credit Calculator",
  description: "Estimate your ACA premium tax credit based on household size and income.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["ACA tax credit", "premium tax credit", "health insurance subsidy"],
  variants: [{
    id: "standard",
    name: "Health Insurance Tax Credit",
    description: "Estimate your ACA premium tax credit based on household size and income",
    fields: [
      { name: "householdSize", label: "Household Size", type: "number", min: 1, max: 10, defaultValue: 3 },
      { name: "income", label: "Annual Household Income", type: "number", prefix: "$", min: 0, max: 500000, defaultValue: 60000 },
      { name: "benchmarkPremium", label: "Benchmark Plan Monthly Premium", type: "number", prefix: "$", min: 100, max: 5000, defaultValue: 1200 },
    ],
    calculate: (inputs) => {
      const size = inputs.householdSize as number;
      const income = inputs.income as number;
      const benchmark = inputs.benchmarkPremium as number;
      if (!size || !income || income <= 0 || !benchmark) return null;
      const fpl: Record<number, number> = { 1: 15060, 2: 20440, 3: 25820, 4: 31200, 5: 36580, 6: 41960, 7: 47340, 8: 52720, 9: 58100, 10: 63480 };
      const povertyLevel = fpl[Math.min(size, 10)] || 15060;
      const fplPercent = (income / povertyLevel) * 100;
      let expectedPct = 0;
      if (fplPercent <= 150) expectedPct = 0;
      else if (fplPercent <= 200) expectedPct = 0.02;
      else if (fplPercent <= 250) expectedPct = 0.04;
      else if (fplPercent <= 300) expectedPct = 0.06;
      else if (fplPercent <= 400) expectedPct = 0.085;
      else expectedPct = 0.085;
      const expectedContribution = income * expectedPct / 12;
      const monthlyCredit = Math.max(0, benchmark - expectedContribution);
      const annualCredit = monthlyCredit * 12;
      return {
        primary: { label: "Monthly Tax Credit", value: "$" + formatNumber(Math.round(monthlyCredit)) },
        details: [
          { label: "Annual Tax Credit", value: "$" + formatNumber(Math.round(annualCredit)) },
          { label: "FPL Percentage", value: fplPercent.toFixed(0) + "%" },
          { label: "Expected Monthly Contribution", value: "$" + formatNumber(Math.round(expectedContribution)) },
          { label: "Effective Monthly Premium", value: "$" + formatNumber(Math.round(benchmark - monthlyCredit)) },
        ],
      };
    },
  }],
  relatedSlugs: ["disability-insurance-benefit-calculator", "medicare-part-b-premium-calculator"],
  faq: [
    { question: "Who qualifies for ACA premium tax credits?", answer: "Households with income between 100% and 400% of the federal poverty level may qualify, though expanded subsidies may extend eligibility." },
    { question: "How is the premium tax credit calculated?", answer: "The credit equals the benchmark plan premium minus your expected contribution, which is a percentage of income based on your FPL level." },
  ],
  formula: "Monthly Credit = Benchmark Premium - (Income x Expected Contribution % / 12)",
};
