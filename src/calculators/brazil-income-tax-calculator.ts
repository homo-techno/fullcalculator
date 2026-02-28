import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const brazilIncomeTaxCalculator: CalculatorDefinition = {
  slug: "brazil-income-tax-calculator",
  title: "Brazil Income Tax Calculator",
  description: "Free Brazil income tax calculator. Calculate your tax liability with current progressive brackets and deductions.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["brazil income tax calculator", "brazil tax calculator", "brazil tax calculator"],
  variants: [{
    id: "standard",
    name: "Brazil Income Tax",
    description: "Free Brazil income tax calculator",
    fields: [
      { name: "income", label: "Annual Taxable Income", type: "number", prefix: "R$", min: 0 },
    ],
    calculate: (inputs) => {
      const income = inputs.income as number;
      if (!income || income <= 0) return null;
      const brackets = [{l:27108,r:0},{l:33919.8,r:0.075},{l:45012.6,r:0.15},{l:55976.16,r:0.225},{l:Infinity,r:0.275}];
      let tax = 0, rem = income, prev = 0, marginal = 0;
      for (const s of brackets) { const t = Math.min(rem, s.l - prev); if (t <= 0) break; tax += t * s.r; marginal = s.r; rem -= t; prev = s.l; }
      return {
        primary: { label: "Income Tax", value: "R$" + formatNumber(tax) },
        details: [
          { label: "Taxable income", value: "R$" + formatNumber(income) },
          { label: "Effective rate", value: formatNumber((tax / income) * 100) + "%" },
          { label: "Marginal rate", value: (marginal * 100).toFixed(0) + "%" },
          { label: "After-tax income", value: "R$" + formatNumber(income - tax) },
          { label: "Monthly after-tax", value: "R$" + formatNumber((income - tax) / 12) },
        ],
        note: "Monthly brackets annualized. Simplified monthly deduction of R$564.80 applies. Per-dependent deduction: R$189.59/month.",
      };
    },
  }],
  relatedSlugs: ["tax-calculator", "salary-calculator"],
  faq: [
    { question: "How is income tax calculated in Brazil?", answer: "Brazil uses a progressive tax system where higher income portions are taxed at higher rates." },
    { question: "What is the top tax rate in Brazil?", answer: "The highest marginal rate is 27.500000000000004%." },
  ],
  formula: "Tax = Sum of (income in bracket × rate)",
};
