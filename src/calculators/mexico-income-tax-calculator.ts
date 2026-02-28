import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const mexicoIncomeTaxCalculator: CalculatorDefinition = {
  slug: "mexico-income-tax-calculator",
  title: "Mexico Income Tax Calculator",
  description: "Free Mexico income tax calculator. Calculate your tax liability with current progressive brackets and deductions.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["mexico income tax calculator", "mexico tax calculator", "mexico tax calculator"],
  variants: [{
    id: "standard",
    name: "Mexico Income Tax",
    description: "Free Mexico income tax calculator",
    fields: [
      { name: "income", label: "Annual Taxable Income", type: "number", prefix: "MX$", min: 0 },
    ],
    calculate: (inputs) => {
      const income = inputs.income as number;
      if (!income || income <= 0) return null;
      const brackets = [{l:8952.48,r:0.0192},{l:75984.6,r:0.064},{l:133536.12,r:0.1088},{l:155229.84,r:0.16},{l:185852.52,r:0.1792},{l:374837.88,r:0.2136},{l:590796,r:0.2352},{l:1127926.8,r:0.3},{l:1503902.4,r:0.32},{l:4511707.32,r:0.34},{l:Infinity,r:0.35}];
      let tax = 0, rem = income, prev = 0, marginal = 0;
      for (const s of brackets) { const t = Math.min(rem, s.l - prev); if (t <= 0) break; tax += t * s.r; marginal = s.r; rem -= t; prev = s.l; }
      return {
        primary: { label: "Income Tax", value: "MX$" + formatNumber(tax) },
        details: [
          { label: "Taxable income", value: "MX$" + formatNumber(income) },
          { label: "Effective rate", value: formatNumber((tax / income) * 100) + "%" },
          { label: "Marginal rate", value: (marginal * 100).toFixed(0) + "%" },
          { label: "After-tax income", value: "MX$" + formatNumber(income - tax) },
          { label: "Monthly after-tax", value: "MX$" + formatNumber((income - tax) / 12) },
        ],
        note: "ISR annual brackets for 2025. Progressive with cuota fija + rate on excess.",
      };
    },
  }],
  relatedSlugs: ["tax-calculator", "salary-calculator"],
  faq: [
    { question: "How is income tax calculated in Mexico?", answer: "Mexico uses a progressive tax system where higher income portions are taxed at higher rates." },
    { question: "What is the top tax rate in Mexico?", answer: "The highest marginal rate is 35%." },
  ],
  formula: "Tax = Sum of (income in bracket × rate)",
};
