import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const italyIncomeTaxCalculator: CalculatorDefinition = {
  slug: "italy-income-tax-calculator",
  title: "Italy Income Tax Calculator",
  description: "Free Italy income tax calculator. Calculate your tax liability with current progressive brackets and deductions.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["italy income tax calculator", "italy tax calculator", "italy tax calculator"],
  variants: [{
    id: "standard",
    name: "Italy Income Tax",
    description: "Free Italy income tax calculator",
    fields: [
      { name: "income", label: "Annual Taxable Income", type: "number", prefix: "€", min: 0 },
    ],
    calculate: (inputs) => {
      const income = inputs.income as number;
      if (!income || income <= 0) return null;
      const brackets = [{l:15000,r:0.23},{l:28000,r:0.25},{l:50000,r:0.35},{l:Infinity,r:0.43}];
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
        note: "2025 IRPEF brackets. Regional surcharge (0.9-3.33%) and municipal surcharge (0-0.9%) apply additionally.",
      };
    },
  }],
  relatedSlugs: ["tax-calculator", "salary-calculator"],
  faq: [
    { question: "How is income tax calculated in Italy?", answer: "Italy uses a progressive tax system where higher income portions are taxed at higher rates." },
    { question: "What is the top tax rate in Italy?", answer: "The highest marginal rate is 43%." },
  ],
  formula: "Tax = Sum of (income in bracket × rate)",
};
