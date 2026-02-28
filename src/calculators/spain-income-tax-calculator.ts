import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const spainIncomeTaxCalculator: CalculatorDefinition = {
  slug: "spain-income-tax-calculator",
  title: "Spain Income Tax Calculator",
  description: "Free Spain income tax calculator. Calculate your tax liability with current progressive brackets and deductions.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["spain income tax calculator", "spain tax calculator", "spain tax calculator"],
  variants: [{
    id: "standard",
    name: "Spain Income Tax",
    description: "Free Spain income tax calculator",
    fields: [
      { name: "income", label: "Annual Taxable Income", type: "number", prefix: "€", min: 0 },
    ],
    calculate: (inputs) => {
      const income = inputs.income as number;
      if (!income || income <= 0) return null;
      const brackets = [{l:12450,r:0.19},{l:20200,r:0.24},{l:35200,r:0.3},{l:60000,r:0.37},{l:300000,r:0.45},{l:Infinity,r:0.47}];
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
        note: "2025 combined state + general regional IRPF brackets. Actual rates vary by autonomous community.",
      };
    },
  }],
  relatedSlugs: ["tax-calculator", "salary-calculator"],
  faq: [
    { question: "How is income tax calculated in Spain?", answer: "Spain uses a progressive tax system where higher income portions are taxed at higher rates." },
    { question: "What is the top tax rate in Spain?", answer: "The highest marginal rate is 47%." },
  ],
  formula: "Tax = Sum of (income in bracket × rate)",
};
