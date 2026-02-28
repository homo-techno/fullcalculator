import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const greeceIncomeTaxCalculator: CalculatorDefinition = {
  slug: "greece-income-tax-calculator",
  title: "Greece Income Tax Calculator",
  description: "Free Greece income tax calculator. Calculate your tax liability with current progressive brackets and deductions.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["greece income tax calculator", "greece tax calculator", "greece tax calculator"],
  variants: [{
    id: "standard",
    name: "Greece Income Tax",
    description: "Free Greece income tax calculator",
    fields: [
      { name: "income", label: "Annual Taxable Income", type: "number", prefix: "€", min: 0 },
    ],
    calculate: (inputs) => {
      const income = inputs.income as number;
      if (!income || income <= 0) return null;
      const brackets = [{l:10000,r:0.09},{l:20000,r:0.22},{l:30000,r:0.28},{l:40000,r:0.36},{l:Infinity,r:0.44}];
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
        note: "2025 income tax scale. Solidarity contribution suspended. Freelancers may use flat 9% for first 3 years.",
      };
    },
  }],
  relatedSlugs: ["tax-calculator", "salary-calculator"],
  faq: [
    { question: "How is income tax calculated in Greece?", answer: "Greece uses a progressive tax system where higher income portions are taxed at higher rates." },
    { question: "What is the top tax rate in Greece?", answer: "The highest marginal rate is 44%." },
  ],
  formula: "Tax = Sum of (income in bracket × rate)",
};
