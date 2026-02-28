import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const norwayIncomeTaxCalculator: CalculatorDefinition = {
  slug: "norway-income-tax-calculator",
  title: "Norway Income Tax Calculator",
  description: "Free Norway income tax calculator. Calculate your tax liability with current progressive brackets and deductions.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["norway income tax calculator", "norway tax calculator", "norway tax calculator"],
  variants: [{
    id: "standard",
    name: "Norway Income Tax",
    description: "Free Norway income tax calculator",
    fields: [
      { name: "income", label: "Annual Taxable Income", type: "number", prefix: "kr", min: 0 },
    ],
    calculate: (inputs) => {
      const income = inputs.income as number;
      if (!income || income <= 0) return null;
      const brackets = [{l:88250,r:0},{l:208050,r:0.22},{l:292850,r:0.237},{l:670000,r:0.26},{l:937900,r:0.356},{l:1350000,r:0.386},{l:Infinity,r:0.396}];
      let tax = 0, rem = income, prev = 0, marginal = 0;
      for (const s of brackets) { const t = Math.min(rem, s.l - prev); if (t <= 0) break; tax += t * s.r; marginal = s.r; rem -= t; prev = s.l; }
      return {
        primary: { label: "Income Tax", value: "kr" + formatNumber(tax) },
        details: [
          { label: "Taxable income", value: "kr" + formatNumber(income) },
          { label: "Effective rate", value: formatNumber((tax / income) * 100) + "%" },
          { label: "Marginal rate", value: (marginal * 100).toFixed(0) + "%" },
          { label: "After-tax income", value: "kr" + formatNumber(income - tax) },
          { label: "Monthly after-tax", value: "kr" + formatNumber((income - tax) / 12) },
        ],
        note: "Combined ordinary tax (22%) + trinnskatt (bracket surtax). Standard deduction ~NOK 88,250. Trinnskatt: 1.7-17.6% in steps.",
      };
    },
  }],
  relatedSlugs: ["tax-calculator", "salary-calculator"],
  faq: [
    { question: "How is income tax calculated in Norway?", answer: "Norway uses a progressive tax system where higher income portions are taxed at higher rates." },
    { question: "What is the top tax rate in Norway?", answer: "The highest marginal rate is 39.6%." },
  ],
  formula: "Tax = Sum of (income in bracket × rate)",
};
