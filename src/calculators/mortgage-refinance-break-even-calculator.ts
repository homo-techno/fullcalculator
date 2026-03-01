import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const mortgageRefinanceBreakEvenCalculator: CalculatorDefinition = {
  slug: "mortgage-refinance-break-even-calculator",
  title: "Mortgage Refinance Break-Even Calculator",
  description: "Calculate how many months it takes to recoup refinancing costs.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["mortgage refinance break even", "refinance payback period", "refinance calculator"],
  variants: [{
    id: "standard",
    name: "Mortgage Refinance Break-Even",
    description: "Calculate how many months it takes to recoup refinancing costs",
    fields: [
      { name: "balance", label: "Current Loan Balance", type: "number", prefix: "$", min: 10000, max: 2000000, defaultValue: 300000 },
      { name: "currentRate", label: "Current Interest Rate", type: "number", suffix: "%", min: 0.1, max: 15, step: 0.01, defaultValue: 6.5 },
      { name: "newRate", label: "New Interest Rate", type: "number", suffix: "%", min: 0.1, max: 15, step: 0.01, defaultValue: 5.5 },
      { name: "closingCosts", label: "Closing Costs", type: "number", prefix: "$", min: 0, max: 50000, defaultValue: 5000 },
    ],
    calculate: (inputs) => {
      const bal = inputs.balance as number;
      const oldR = (inputs.currentRate as number) / 100 / 12;
      const newR = (inputs.newRate as number) / 100 / 12;
      const costs = inputs.closingCosts as number;
      if (!bal || bal <= 0 || !oldR || !newR || oldR <= newR === false) return null;
      const n = 360;
      const oldPmt = bal * oldR / (1 - Math.pow(1 + oldR, -n));
      const newPmt = bal * newR / (1 - Math.pow(1 + newR, -n));
      const monthlySavings = oldPmt - newPmt;
      if (monthlySavings <= 0) return null;
      const breakEvenMonths = Math.ceil(costs / monthlySavings);
      return {
        primary: { label: "Break-Even Period", value: breakEvenMonths + " months" },
        details: [
          { label: "Old Monthly Payment", value: "$" + formatNumber(oldPmt) },
          { label: "New Monthly Payment", value: "$" + formatNumber(newPmt) },
          { label: "Monthly Savings", value: "$" + formatNumber(monthlySavings) },
          { label: "5-Year Net Savings", value: "$" + formatNumber(monthlySavings * 60 - costs) },
        ],
      };
    },
  }],
  relatedSlugs: ["biweekly-mortgage-payment-calculator", "mortgage-payoff-calculator"],
  faq: [
    { question: "How long does it take to break even on a refinance?", answer: "It typically takes 2 to 5 years depending on the rate reduction and closing costs." },
    { question: "Is refinancing worth it if I plan to move soon?", answer: "If you will move before reaching the break-even point, refinancing may not save you money." },
  ],
  formula: "Break-Even Months = Closing Costs / (Old Payment - New Payment)",
};
