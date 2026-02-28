import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const irelandIncomeTaxCalculator: CalculatorDefinition = {
  slug: "ireland-income-tax-calculator",
  title: "Ireland Income Tax Calculator",
  description: "Free Ireland income tax calculator. Calculate your tax liability with current progressive brackets and deductions.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["ireland income tax calculator", "ireland tax calculator", "ireland tax calculator"],
  variants: [{
    id: "standard",
    name: "Ireland Income Tax",
    description: "Free Ireland income tax calculator",
    fields: [
      { name: "income", label: "Annual Taxable Income", type: "number", prefix: "€", min: 0 },
    ],
    calculate: (inputs) => {
      const income = inputs.income as number;
      if (!income || income <= 0) return null;
      const brackets = [{l:44000,r:0.2},{l:Infinity,r:0.4}];
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
        note: "Standard rate band: €44,000 (single). Married (one earner): €53,000. USC and PRSI apply additionally.",
      };
    },
  }],
  relatedSlugs: ["tax-calculator", "salary-calculator"],
  faq: [
    { question: "How is income tax calculated in Ireland?", answer: "Ireland uses a progressive tax system where higher income portions are taxed at higher rates." },
    { question: "What is the top tax rate in Ireland?", answer: "The highest marginal rate is 40%." },
  ],
  formula: "Tax = Sum of (income in bracket × rate)",
};
