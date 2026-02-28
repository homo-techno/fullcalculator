import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const egyptIncomeTaxCalculator: CalculatorDefinition = {
  slug: "egypt-income-tax-calculator",
  title: "Egypt Income Tax Calculator",
  description: "Free Egypt income tax calculator. Calculate your tax liability with current progressive brackets and deductions.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["egypt income tax calculator", "egypt tax calculator", "egypt tax calculator"],
  variants: [{
    id: "standard",
    name: "Egypt Income Tax",
    description: "Free Egypt income tax calculator",
    fields: [
      { name: "income", label: "Annual Taxable Income", type: "number", prefix: "EGP", min: 0 },
    ],
    calculate: (inputs) => {
      const income = inputs.income as number;
      if (!income || income <= 0) return null;
      const brackets = [{l:40000,r:0},{l:55000,r:0.1},{l:70000,r:0.15},{l:200000,r:0.2},{l:400000,r:0.225},{l:1200000,r:0.25},{l:Infinity,r:0.275}];
      let tax = 0, rem = income, prev = 0, marginal = 0;
      for (const s of brackets) { const t = Math.min(rem, s.l - prev); if (t <= 0) break; tax += t * s.r; marginal = s.r; rem -= t; prev = s.l; }
      return {
        primary: { label: "Income Tax", value: "EGP" + formatNumber(tax) },
        details: [
          { label: "Taxable income", value: "EGP" + formatNumber(income) },
          { label: "Effective rate", value: formatNumber((tax / income) * 100) + "%" },
          { label: "Marginal rate", value: (marginal * 100).toFixed(0) + "%" },
          { label: "After-tax income", value: "EGP" + formatNumber(income - tax) },
          { label: "Monthly after-tax", value: "EGP" + formatNumber((income - tax) / 12) },
        ],
        note: "Personal exemption of EGP 20,000/year deducted before applying brackets (not included here).",
      };
    },
  }],
  relatedSlugs: ["tax-calculator", "salary-calculator"],
  faq: [
    { question: "How is income tax calculated in Egypt?", answer: "Egypt uses a progressive tax system where higher income portions are taxed at higher rates." },
    { question: "What is the top tax rate in Egypt?", answer: "The highest marginal rate is 27.500000000000004%." },
  ],
  formula: "Tax = Sum of (income in bracket × rate)",
};
