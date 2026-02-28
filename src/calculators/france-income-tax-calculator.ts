import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const franceIncomeTaxCalculator: CalculatorDefinition = {
  slug: "france-income-tax-calculator",
  title: "France Income Tax Calculator",
  description: "Free France income tax calculator. Calculate your tax liability with current progressive brackets and deductions.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["france income tax calculator", "france tax calculator", "france tax calculator"],
  variants: [{
    id: "standard",
    name: "France Income Tax",
    description: "Free France income tax calculator",
    fields: [
      { name: "income", label: "Annual Taxable Income", type: "number", prefix: "€", min: 0 },
    ],
    calculate: (inputs) => {
      const income = inputs.income as number;
      if (!income || income <= 0) return null;
      const brackets = [{l:11294,r:0},{l:28797,r:0.11},{l:82341,r:0.3},{l:177106,r:0.41},{l:Infinity,r:0.45}];
      let tax = 0, rem = income, prev = 0, marginal = 0;
      for (const s of brackets) { const t = Math.min(rem, s.l - prev); if (t <= 0) break; tax += t * s.r; marginal = s.r; rem -= t; prev = s.l; }
      return {
        primary: { label: "Income Tax", value: "€" + formatNumber(tax) },
        details: [
          { label: "Taxable income", value: "€" + formatNumber(income) },
          { label: "Effective rate", value: formatNumber((tax / income) * 100) + "%" },
          { label: "Marginal rate", value: (marginal * 100).toFixed(0) + "%" },
          { label: "After-tax income", value: "€" + formatNumber(income - tax) },
          { label: "Monthly after-tax", value: "€" + formatNumber((income - tax) / 12) },
        ],
        note: "Per-share brackets (quotient familial). Single=1 share, couple=2, +0.5 per child. Brackets shown for 1 share.",
      };
    },
  }],
  relatedSlugs: ["tax-calculator", "salary-calculator"],
  faq: [
    { question: "How is income tax calculated in France?", answer: "France uses a progressive tax system where higher income portions are taxed at higher rates." },
    { question: "What is the top tax rate in France?", answer: "The highest marginal rate is 45%." },
  ],
  formula: "Tax = Sum of (income in bracket × rate)",
};
