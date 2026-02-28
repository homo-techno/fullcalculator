import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const ukIncomeTaxCalculator: CalculatorDefinition = {
  slug: "uk-income-tax-calculator",
  title: "United Kingdom Income Tax Calculator",
  description: "Free United Kingdom income tax calculator. Calculate your tax liability with current progressive brackets and deductions.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["united kingdom income tax calculator", "united kingdom tax calculator", "uk tax calculator"],
  variants: [{
    id: "standard",
    name: "United Kingdom Income Tax",
    description: "Free United Kingdom income tax calculator",
    fields: [
      { name: "income", label: "Annual Taxable Income", type: "number", prefix: "£", min: 0 },
    ],
    calculate: (inputs) => {
      const income = inputs.income as number;
      if (!income || income <= 0) return null;
      const brackets = [{l:12570,r:0},{l:50270,r:0.2},{l:125140,r:0.4},{l:Infinity,r:0.45}];
      let tax = 0, rem = income, prev = 0, marginal = 0;
      for (const s of brackets) { const t = Math.min(rem, s.l - prev); if (t <= 0) break; tax += t * s.r; marginal = s.r; rem -= t; prev = s.l; }
      return {
        primary: { label: "Income Tax", value: "£" + formatNumber(tax) },
        details: [
          { label: "Taxable income", value: "£" + formatNumber(income) },
          { label: "Effective rate", value: formatNumber((tax / income) * 100) + "%" },
          { label: "Marginal rate", value: (marginal * 100).toFixed(0) + "%" },
          { label: "After-tax income", value: "£" + formatNumber(income - tax) },
          { label: "Monthly after-tax", value: "£" + formatNumber((income - tax) / 12) },
        ],
        note: "Personal Allowance: £12,570 (tapers £1 for every £2 above £100K). Scottish rates differ.",
      };
    },
  }],
  relatedSlugs: ["tax-calculator", "salary-calculator"],
  faq: [
    { question: "How is income tax calculated in United Kingdom?", answer: "United Kingdom uses a progressive tax system where higher income portions are taxed at higher rates." },
    { question: "What is the top tax rate in United Kingdom?", answer: "The highest marginal rate is 45%." },
  ],
  formula: "Tax = Sum of (income in bracket × rate)",
};
