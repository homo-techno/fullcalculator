import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const bangladeshIncomeTaxCalculator: CalculatorDefinition = {
  slug: "bangladesh-income-tax-calculator",
  title: "Bangladesh Income Tax Calculator",
  description: "Free Bangladesh income tax calculator. Calculate your tax liability with current progressive brackets and deductions.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["bangladesh income tax calculator", "bangladesh tax calculator", "bangladesh tax calculator"],
  variants: [{
    id: "standard",
    name: "Bangladesh Income Tax",
    description: "Free Bangladesh income tax calculator",
    fields: [
      { name: "income", label: "Annual Taxable Income", type: "number", prefix: "৳", min: 0 },
    ],
    calculate: (inputs) => {
      const income = inputs.income as number;
      if (!income || income <= 0) return null;
      const brackets = [{l:375000,r:0},{l:675000,r:0.1},{l:1075000,r:0.15},{l:1575000,r:0.2},{l:3575000,r:0.25},{l:Infinity,r:0.3}];
      let tax = 0, rem = income, prev = 0, marginal = 0;
      for (const s of brackets) { const t = Math.min(rem, s.l - prev); if (t <= 0) break; tax += t * s.r; marginal = s.r; rem -= t; prev = s.l; }
      return {
        primary: { label: "Income Tax", value: "৳" + formatNumber(tax) },
        details: [
          { label: "Taxable income", value: "৳" + formatNumber(income) },
          { label: "Effective rate", value: formatNumber((tax / income) * 100) + "%" },
          { label: "Marginal rate", value: (marginal * 100).toFixed(0) + "%" },
          { label: "After-tax income", value: "৳" + formatNumber(income - tax) },
          { label: "Monthly after-tax", value: "৳" + formatNumber((income - tax) / 12) },
        ],
        note: "FY 2025-26 brackets. Women and seniors (65+) exempt up to ৳400,000. Minimum tax: ৳3,000-5,000.",
      };
    },
  }],
  relatedSlugs: ["tax-calculator", "salary-calculator"],
  faq: [
    { question: "How is income tax calculated in Bangladesh?", answer: "Bangladesh uses a progressive tax system where higher income portions are taxed at higher rates." },
    { question: "What is the top tax rate in Bangladesh?", answer: "The highest marginal rate is 30%." },
  ],
  formula: "Tax = Sum of (income in bracket × rate)",
};
