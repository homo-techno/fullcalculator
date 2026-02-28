import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const indonesiaIncomeTaxCalculator: CalculatorDefinition = {
  slug: "indonesia-income-tax-calculator",
  title: "Indonesia Income Tax Calculator",
  description: "Free Indonesia income tax calculator. Calculate your tax liability with current progressive brackets and deductions.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["indonesia income tax calculator", "indonesia tax calculator", "indonesia tax calculator"],
  variants: [{
    id: "standard",
    name: "Indonesia Income Tax",
    description: "Free Indonesia income tax calculator",
    fields: [
      { name: "income", label: "Annual Taxable Income", type: "number", prefix: "Rp", min: 0 },
    ],
    calculate: (inputs) => {
      const income = inputs.income as number;
      if (!income || income <= 0) return null;
      const brackets = [{l:60000000,r:0.05},{l:250000000,r:0.15},{l:500000000,r:0.25},{l:5000000000,r:0.3},{l:Infinity,r:0.35}];
      let tax = 0, rem = income, prev = 0, marginal = 0;
      for (const s of brackets) { const t = Math.min(rem, s.l - prev); if (t <= 0) break; tax += t * s.r; marginal = s.r; rem -= t; prev = s.l; }
      return {
        primary: { label: "Income Tax", value: "Rp" + formatNumber(tax) },
        details: [
          { label: "Taxable income", value: "Rp" + formatNumber(income) },
          { label: "Effective rate", value: formatNumber((tax / income) * 100) + "%" },
          { label: "Marginal rate", value: (marginal * 100).toFixed(0) + "%" },
          { label: "After-tax income", value: "Rp" + formatNumber(income - tax) },
          { label: "Monthly after-tax", value: "Rp" + formatNumber((income - tax) / 12) },
        ],
        note: "PTKP (non-taxable threshold) not subtracted. Single: Rp54M, Married: Rp58.5M, per dependent: +Rp4.5M.",
      };
    },
  }],
  relatedSlugs: ["tax-calculator", "salary-calculator"],
  faq: [
    { question: "How is income tax calculated in Indonesia?", answer: "Indonesia uses a progressive tax system where higher income portions are taxed at higher rates." },
    { question: "What is the top tax rate in Indonesia?", answer: "The highest marginal rate is 35%." },
  ],
  formula: "Tax = Sum of (income in bracket × rate)",
};
