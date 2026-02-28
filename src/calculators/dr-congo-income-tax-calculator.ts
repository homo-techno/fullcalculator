import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const drCongoIncomeTaxCalculator: CalculatorDefinition = {
  slug: "dr-congo-income-tax-calculator",
  title: "DR Congo Income Tax Calculator",
  description: "Free DR Congo income tax calculator. Calculate your tax liability with current progressive brackets and deductions.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["dr congo income tax calculator", "dr congo tax calculator", "dr-congo tax calculator"],
  variants: [{
    id: "standard",
    name: "DR Congo Income Tax",
    description: "Free DR Congo income tax calculator",
    fields: [
      { name: "income", label: "Annual Taxable Income", type: "number", prefix: "CDF", min: 0 },
    ],
    calculate: (inputs) => {
      const income = inputs.income as number;
      if (!income || income <= 0) return null;
      const brackets = [{l:1944000,r:0.03},{l:21600000,r:0.15},{l:43200000,r:0.3},{l:Infinity,r:0.4}];
      let tax = 0, rem = income, prev = 0, marginal = 0;
      for (const s of brackets) { const t = Math.min(rem, s.l - prev); if (t <= 0) break; tax += t * s.r; marginal = s.r; rem -= t; prev = s.l; }
      return {
        primary: { label: "Income Tax", value: "CDF" + formatNumber(tax) },
        details: [
          { label: "Taxable income", value: "CDF" + formatNumber(income) },
          { label: "Effective rate", value: formatNumber((tax / income) * 100) + "%" },
          { label: "Marginal rate", value: (marginal * 100).toFixed(0) + "%" },
          { label: "After-tax income", value: "CDF" + formatNumber(income - tax) },
          { label: "Monthly after-tax", value: "CDF" + formatNumber((income - tax) / 12) },
        ],
        note: "IPR brackets. Tax cannot exceed 30% of total taxable salary. Dependent rebate: 2% per dependent (max 9).",
      };
    },
  }],
  relatedSlugs: ["tax-calculator", "salary-calculator"],
  faq: [
    { question: "How is income tax calculated in DR Congo?", answer: "DR Congo uses a progressive tax system where higher income portions are taxed at higher rates." },
    { question: "What is the top tax rate in DR Congo?", answer: "The highest marginal rate is 40%." },
  ],
  formula: "Tax = Sum of (income in bracket × rate)",
};
