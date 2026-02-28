import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const hungaryIncomeTaxCalculator: CalculatorDefinition = {
  slug: "hungary-income-tax-calculator",
  title: "Hungary Income Tax Calculator",
  description: "Free Hungary income tax calculator. Calculate your tax liability with current progressive brackets and deductions.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["hungary income tax calculator", "hungary tax calculator", "hungary tax calculator"],
  variants: [{
    id: "standard",
    name: "Hungary Income Tax",
    description: "Free Hungary income tax calculator",
    fields: [
      { name: "income", label: "Annual Taxable Income", type: "number", prefix: "Ft", min: 0 },
    ],
    calculate: (inputs) => {
      const income = inputs.income as number;
      if (!income || income <= 0) return null;
      const brackets = [{l:Infinity,r:0.15}];
      let tax = 0, rem = income, prev = 0, marginal = 0;
      for (const s of brackets) { const t = Math.min(rem, s.l - prev); if (t <= 0) break; tax += t * s.r; marginal = s.r; rem -= t; prev = s.l; }
      return {
        primary: { label: "Income Tax", value: "Ft" + formatNumber(tax) },
        details: [
          { label: "Taxable income", value: "Ft" + formatNumber(income) },
          { label: "Effective rate", value: formatNumber((tax / income) * 100) + "%" },
          { label: "Marginal rate", value: (marginal * 100).toFixed(0) + "%" },
          { label: "After-tax income", value: "Ft" + formatNumber(income - tax) },
          { label: "Monthly after-tax", value: "Ft" + formatNumber((income - tax) / 12) },
        ],
        note: "Flat 15% personal income tax (SZJA). Social contribution: 13% employer, 18.5% employee (pension 10% + health 8.5%).",
      };
    },
  }],
  relatedSlugs: ["tax-calculator", "salary-calculator"],
  faq: [
    { question: "How is income tax calculated in Hungary?", answer: "Hungary uses a progressive tax system where higher income portions are taxed at higher rates." },
    { question: "What is the top tax rate in Hungary?", answer: "The highest marginal rate is 15%." },
  ],
  formula: "Tax = Sum of (income in bracket × rate)",
};
