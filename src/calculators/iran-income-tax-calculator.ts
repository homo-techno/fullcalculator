import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const iranIncomeTaxCalculator: CalculatorDefinition = {
  slug: "iran-income-tax-calculator",
  title: "Iran Income Tax Calculator",
  description: "Free Iran income tax calculator. Calculate your tax liability with current progressive brackets and deductions.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["iran income tax calculator", "iran tax calculator", "iran tax calculator"],
  variants: [{
    id: "standard",
    name: "Iran Income Tax",
    description: "Free Iran income tax calculator",
    fields: [
      { name: "income", label: "Annual Taxable Income", type: "number", prefix: "IRR", min: 0 },
    ],
    calculate: (inputs) => {
      const income = inputs.income as number;
      if (!income || income <= 0) return null;
      const brackets = [{l:2880000000000,r:0},{l:4320000000000,r:0.1},{l:7200000000000,r:0.15},{l:10080000000000,r:0.2},{l:14400000000000,r:0.25},{l:20160000000000,r:0.3},{l:Infinity,r:0.35}];
      let tax = 0, rem = income, prev = 0, marginal = 0;
      for (const s of brackets) { const t = Math.min(rem, s.l - prev); if (t <= 0) break; tax += t * s.r; marginal = s.r; rem -= t; prev = s.l; }
      return {
        primary: { label: "Income Tax", value: "IRR" + formatNumber(tax) },
        details: [
          { label: "Taxable income", value: "IRR" + formatNumber(income) },
          { label: "Effective rate", value: formatNumber((tax / income) * 100) + "%" },
          { label: "Marginal rate", value: (marginal * 100).toFixed(0) + "%" },
          { label: "After-tax income", value: "IRR" + formatNumber(income - tax) },
          { label: "Monthly after-tax", value: "IRR" + formatNumber((income - tax) / 12) },
        ],
        note: "FY 1404 brackets (March 2025-2026). Annual exemption: IRR 2.88 trillion.",
      };
    },
  }],
  relatedSlugs: ["tax-calculator", "salary-calculator"],
  faq: [
    { question: "How is income tax calculated in Iran?", answer: "Iran uses a progressive tax system where higher income portions are taxed at higher rates." },
    { question: "What is the top tax rate in Iran?", answer: "The highest marginal rate is 35%." },
  ],
  formula: "Tax = Sum of (income in bracket × rate)",
};
