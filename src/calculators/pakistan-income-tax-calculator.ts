import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const pakistanIncomeTaxCalculator: CalculatorDefinition = {
  slug: "pakistan-income-tax-calculator",
  title: "Pakistan Income Tax Calculator",
  description: "Free Pakistan income tax calculator. Calculate your tax liability with current progressive brackets and deductions.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["pakistan income tax calculator", "pakistan tax calculator", "pakistan tax calculator"],
  variants: [{
    id: "standard",
    name: "Pakistan Income Tax",
    description: "Free Pakistan income tax calculator",
    fields: [
      { name: "income", label: "Annual Taxable Income", type: "number", prefix: "Rs", min: 0 },
    ],
    calculate: (inputs) => {
      const income = inputs.income as number;
      if (!income || income <= 0) return null;
      const brackets = [{l:600000,r:0},{l:1200000,r:0.01},{l:2200000,r:0.11},{l:3200000,r:0.23},{l:4100000,r:0.3},{l:Infinity,r:0.35}];
      let tax = 0, rem = income, prev = 0, marginal = 0;
      for (const s of brackets) { const t = Math.min(rem, s.l - prev); if (t <= 0) break; tax += t * s.r; marginal = s.r; rem -= t; prev = s.l; }
      return {
        primary: { label: "Income Tax", value: "Rs" + formatNumber(tax) },
        details: [
          { label: "Taxable income", value: "Rs" + formatNumber(income) },
          { label: "Effective rate", value: formatNumber((tax / income) * 100) + "%" },
          { label: "Marginal rate", value: (marginal * 100).toFixed(0) + "%" },
          { label: "After-tax income", value: "Rs" + formatNumber(income - tax) },
          { label: "Monthly after-tax", value: "Rs" + formatNumber((income - tax) / 12) },
        ],
        note: "Tax year 2025 salaried brackets. Non-salaried have different rates.",
      };
    },
  }],
  relatedSlugs: ["tax-calculator", "salary-calculator"],
  faq: [
    { question: "How is income tax calculated in Pakistan?", answer: "Pakistan uses a progressive tax system where higher income portions are taxed at higher rates." },
    { question: "What is the top tax rate in Pakistan?", answer: "The highest marginal rate is 35%." },
  ],
  formula: "Tax = Sum of (income in bracket × rate)",
};
