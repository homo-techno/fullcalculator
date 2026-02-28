import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const swedenIncomeTaxCalculator: CalculatorDefinition = {
  slug: "sweden-income-tax-calculator",
  title: "Sweden Income Tax Calculator",
  description: "Free Sweden income tax calculator. Calculate your tax liability with current progressive brackets and deductions.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["sweden income tax calculator", "sweden tax calculator", "sweden tax calculator"],
  variants: [{
    id: "standard",
    name: "Sweden Income Tax",
    description: "Free Sweden income tax calculator",
    fields: [
      { name: "income", label: "Annual Taxable Income", type: "number", prefix: "kr", min: 0 },
    ],
    calculate: (inputs) => {
      const income = inputs.income as number;
      if (!income || income <= 0) return null;
      const brackets = [{l:22200,r:0},{l:598500,r:0.32},{l:Infinity,r:0.52}];
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
        note: "Municipal tax ~32% (average, varies 29-35%). State marginal tax 20% above SEK 598,500. Basic deduction ~SEK 22,200.",
      };
    },
  }],
  relatedSlugs: ["tax-calculator", "salary-calculator"],
  faq: [
    { question: "How is income tax calculated in Sweden?", answer: "Sweden uses a progressive tax system where higher income portions are taxed at higher rates." },
    { question: "What is the top tax rate in Sweden?", answer: "The highest marginal rate is 52%." },
  ],
  formula: "Tax = Sum of (income in bracket × rate)",
};
