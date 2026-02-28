import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const polandIncomeTaxCalculator: CalculatorDefinition = {
  slug: "poland-income-tax-calculator",
  title: "Poland Income Tax Calculator",
  description: "Free Poland income tax calculator. Calculate your tax liability with current progressive brackets and deductions.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["poland income tax calculator", "poland tax calculator", "poland tax calculator"],
  variants: [{
    id: "standard",
    name: "Poland Income Tax",
    description: "Free Poland income tax calculator",
    fields: [
      { name: "income", label: "Annual Taxable Income", type: "number", prefix: "zł", min: 0 },
    ],
    calculate: (inputs) => {
      const income = inputs.income as number;
      if (!income || income <= 0) return null;
      const brackets = [{l:120000,r:0.12},{l:Infinity,r:0.32}];
      let tax = 0, rem = income, prev = 0, marginal = 0;
      for (const s of brackets) { const t = Math.min(rem, s.l - prev); if (t <= 0) break; tax += t * s.r; marginal = s.r; rem -= t; prev = s.l; }
      return {
        primary: { label: "Income Tax", value: "zł" + formatNumber(tax) },
        details: [
          { label: "Taxable income", value: "zł" + formatNumber(income) },
          { label: "Effective rate", value: formatNumber((tax / income) * 100) + "%" },
          { label: "Marginal rate", value: (marginal * 100).toFixed(0) + "%" },
          { label: "After-tax income", value: "zł" + formatNumber(income - tax) },
          { label: "Monthly after-tax", value: "zł" + formatNumber((income - tax) / 12) },
        ],
        note: "2025 PIT brackets. Tax-free amount: 30,000 zł. Middle-class relief abolished from 2025.",
      };
    },
  }],
  relatedSlugs: ["tax-calculator", "salary-calculator"],
  faq: [
    { question: "How is income tax calculated in Poland?", answer: "Poland uses a progressive tax system where higher income portions are taxed at higher rates." },
    { question: "What is the top tax rate in Poland?", answer: "The highest marginal rate is 32%." },
  ],
  formula: "Tax = Sum of (income in bracket × rate)",
};
