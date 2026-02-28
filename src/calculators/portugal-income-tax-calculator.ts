import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const portugalIncomeTaxCalculator: CalculatorDefinition = {
  slug: "portugal-income-tax-calculator",
  title: "Portugal Income Tax Calculator",
  description: "Free Portugal income tax calculator. Calculate your tax liability with current progressive brackets and deductions.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["portugal income tax calculator", "portugal tax calculator", "portugal tax calculator"],
  variants: [{
    id: "standard",
    name: "Portugal Income Tax",
    description: "Free Portugal income tax calculator",
    fields: [
      { name: "income", label: "Annual Taxable Income", type: "number", prefix: "€", min: 0 },
    ],
    calculate: (inputs) => {
      const income = inputs.income as number;
      if (!income || income <= 0) return null;
      const brackets = [{l:7703,r:0.1325},{l:11623,r:0.18},{l:16472,r:0.23},{l:21321,r:0.26},{l:27146,r:0.3275},{l:39791,r:0.37},{l:51997,r:0.435},{l:81199,r:0.45},{l:Infinity,r:0.48}];
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
        note: "2025 IRS brackets. Non-habitual resident (NHR) regime: flat 20% on Portuguese-source employment income (closed to new applicants from 2024).",
      };
    },
  }],
  relatedSlugs: ["tax-calculator", "salary-calculator"],
  faq: [
    { question: "How is income tax calculated in Portugal?", answer: "Portugal uses a progressive tax system where higher income portions are taxed at higher rates." },
    { question: "What is the top tax rate in Portugal?", answer: "The highest marginal rate is 48%." },
  ],
  formula: "Tax = Sum of (income in bracket × rate)",
};
