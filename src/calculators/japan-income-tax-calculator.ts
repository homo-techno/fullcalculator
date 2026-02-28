import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const japanIncomeTaxCalculator: CalculatorDefinition = {
  slug: "japan-income-tax-calculator",
  title: "Japan Income Tax Calculator",
  description: "Free Japan income tax calculator. Calculate your tax liability with current progressive brackets and deductions.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["japan income tax calculator", "japan tax calculator", "japan tax calculator"],
  variants: [{
    id: "standard",
    name: "Japan Income Tax",
    description: "Free Japan income tax calculator",
    fields: [
      { name: "income", label: "Annual Taxable Income", type: "number", prefix: "¥", min: 0 },
    ],
    calculate: (inputs) => {
      const income = inputs.income as number;
      if (!income || income <= 0) return null;
      const brackets = [{l:1950000,r:0.05},{l:3300000,r:0.1},{l:6950000,r:0.2},{l:9000000,r:0.23},{l:18000000,r:0.33},{l:40000000,r:0.4},{l:Infinity,r:0.45}];
      let tax = 0, rem = income, prev = 0, marginal = 0;
      for (const s of brackets) { const t = Math.min(rem, s.l - prev); if (t <= 0) break; tax += t * s.r; marginal = s.r; rem -= t; prev = s.l; }
      return {
        primary: { label: "Income Tax", value: "¥" + formatNumber(tax) },
        details: [
          { label: "Taxable income", value: "¥" + formatNumber(income) },
          { label: "Effective rate", value: formatNumber((tax / income) * 100) + "%" },
          { label: "Marginal rate", value: (marginal * 100).toFixed(0) + "%" },
          { label: "After-tax income", value: "¥" + formatNumber(income - tax) },
          { label: "Monthly after-tax", value: "¥" + formatNumber((income - tax) / 12) },
        ],
        note: "National income tax + 2.1% reconstruction surtax. Resident tax (10%) not included.",
      };
    },
  }],
  relatedSlugs: ["tax-calculator", "salary-calculator"],
  faq: [
    { question: "How is income tax calculated in Japan?", answer: "Japan uses a progressive tax system where higher income portions are taxed at higher rates." },
    { question: "What is the top tax rate in Japan?", answer: "The highest marginal rate is 45%." },
  ],
  formula: "Tax = Sum of (income in bracket × rate)",
};
