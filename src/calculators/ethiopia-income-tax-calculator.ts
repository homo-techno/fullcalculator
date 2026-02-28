import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const ethiopiaIncomeTaxCalculator: CalculatorDefinition = {
  slug: "ethiopia-income-tax-calculator",
  title: "Ethiopia Income Tax Calculator",
  description: "Free Ethiopia income tax calculator. Calculate your tax liability with current progressive brackets and deductions.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["ethiopia income tax calculator", "ethiopia tax calculator", "ethiopia tax calculator"],
  variants: [{
    id: "standard",
    name: "Ethiopia Income Tax",
    description: "Free Ethiopia income tax calculator",
    fields: [
      { name: "income", label: "Annual Taxable Income", type: "number", prefix: "ETB", min: 0 },
    ],
    calculate: (inputs) => {
      const income = inputs.income as number;
      if (!income || income <= 0) return null;
      const brackets = [{l:7200,r:0},{l:19800,r:0.1},{l:38400,r:0.15},{l:63000,r:0.2},{l:93600,r:0.25},{l:130800,r:0.3},{l:Infinity,r:0.35}];
      let tax = 0, rem = income, prev = 0, marginal = 0;
      for (const s of brackets) { const t = Math.min(rem, s.l - prev); if (t <= 0) break; tax += t * s.r; marginal = s.r; rem -= t; prev = s.l; }
      return {
        primary: { label: "Income Tax", value: "ETB" + formatNumber(tax) },
        details: [
          { label: "Taxable income", value: "ETB" + formatNumber(income) },
          { label: "Effective rate", value: formatNumber((tax / income) * 100) + "%" },
          { label: "Marginal rate", value: (marginal * 100).toFixed(0) + "%" },
          { label: "After-tax income", value: "ETB" + formatNumber(income - tax) },
          { label: "Monthly after-tax", value: "ETB" + formatNumber((income - tax) / 12) },
        ],
        note: "Monthly brackets annualized (×12). Original monthly: 0% up to 600, 10% to 1,650, 15% to 3,200, 20% to 5,250, 25% to 7,800, 30% to 10,900, 35% above.",
      };
    },
  }],
  relatedSlugs: ["tax-calculator", "salary-calculator"],
  faq: [
    { question: "How is income tax calculated in Ethiopia?", answer: "Ethiopia uses a progressive tax system where higher income portions are taxed at higher rates." },
    { question: "What is the top tax rate in Ethiopia?", answer: "The highest marginal rate is 35%." },
  ],
  formula: "Tax = Sum of (income in bracket × rate)",
};
