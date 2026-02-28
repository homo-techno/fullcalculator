import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const romaniaIncomeTaxCalculator: CalculatorDefinition = {
  slug: "romania-income-tax-calculator",
  title: "Romania Income Tax Calculator",
  description: "Free Romania income tax calculator. Calculate your tax liability with current progressive brackets and deductions.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["romania income tax calculator", "romania tax calculator", "romania tax calculator"],
  variants: [{
    id: "standard",
    name: "Romania Income Tax",
    description: "Free Romania income tax calculator",
    fields: [
      { name: "income", label: "Annual Taxable Income", type: "number", prefix: "lei", min: 0 },
    ],
    calculate: (inputs) => {
      const income = inputs.income as number;
      if (!income || income <= 0) return null;
      const brackets = [{l:Infinity,r:0.1}];
      let tax = 0, rem = income, prev = 0, marginal = 0;
      for (const s of brackets) { const t = Math.min(rem, s.l - prev); if (t <= 0) break; tax += t * s.r; marginal = s.r; rem -= t; prev = s.l; }
      return {
        primary: { label: "Income Tax", value: "lei" + formatNumber(tax) },
        details: [
          { label: "Taxable income", value: "lei" + formatNumber(income) },
          { label: "Effective rate", value: formatNumber((tax / income) * 100) + "%" },
          { label: "Marginal rate", value: (marginal * 100).toFixed(0) + "%" },
          { label: "After-tax income", value: "lei" + formatNumber(income - tax) },
          { label: "Monthly after-tax", value: "lei" + formatNumber((income - tax) / 12) },
        ],
        note: "Flat 10% income tax. Employee contributions: CAS (pension) 25% + CASS (health) 10% = 35% total.",
      };
    },
  }],
  relatedSlugs: ["tax-calculator", "salary-calculator"],
  faq: [
    { question: "How is income tax calculated in Romania?", answer: "Romania uses a progressive tax system where higher income portions are taxed at higher rates." },
    { question: "What is the top tax rate in Romania?", answer: "The highest marginal rate is 10%." },
  ],
  formula: "Tax = Sum of (income in bracket × rate)",
};
