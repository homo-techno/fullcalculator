import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const denmarkIncomeTaxCalculator: CalculatorDefinition = {
  slug: "denmark-income-tax-calculator",
  title: "Denmark Income Tax Calculator",
  description: "Free Denmark income tax calculator. Calculate your tax liability with current progressive brackets and deductions.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["denmark income tax calculator", "denmark tax calculator", "denmark tax calculator"],
  variants: [{
    id: "standard",
    name: "Denmark Income Tax",
    description: "Free Denmark income tax calculator",
    fields: [
      { name: "income", label: "Annual Taxable Income", type: "number", prefix: "kr", min: 0 },
    ],
    calculate: (inputs) => {
      const income = inputs.income as number;
      if (!income || income <= 0) return null;
      const brackets = [{l:49700,r:0},{l:588900,r:0.37},{l:Infinity,r:0.52}];
      let tax = 0, rem = income, prev = 0, marginal = 0;
      for (const s of brackets) { const t = Math.min(rem, s.l - prev); if (t <= 0) break; tax += t * s.r; marginal = s.r; rem -= t; prev = s.l; }
      return {
        primary: { label: "Income Tax", value: "kr" + formatNumber(tax) },
        details: [
          { label: "Taxable income", value: "kr" + formatNumber(income) },
          { label: "Effective rate", value: formatNumber((tax / income) * 100) + "%" },
          { label: "Marginal rate", value: (marginal * 100).toFixed(0) + "%" },
          { label: "After-tax income", value: "kr" + formatNumber(income - tax) },
          { label: "Monthly after-tax", value: "kr" + formatNumber((income - tax) / 12) },
        ],
        note: "Approximate total: AM-bidrag 8% (deducted first) + bundskat 12.09% + municipal ~25%. Top tax 15% above DKK 588,900. Personal deduction ~DKK 49,700.",
      };
    },
  }],
  relatedSlugs: ["tax-calculator", "salary-calculator"],
  faq: [
    { question: "How is income tax calculated in Denmark?", answer: "Denmark uses a progressive tax system where higher income portions are taxed at higher rates." },
    { question: "What is the top tax rate in Denmark?", answer: "The highest marginal rate is 52%." },
  ],
  formula: "Tax = Sum of (income in bracket × rate)",
};
