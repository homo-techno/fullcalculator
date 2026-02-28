import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const switzerlandIncomeTaxCalculator: CalculatorDefinition = {
  slug: "switzerland-income-tax-calculator",
  title: "Switzerland Income Tax Calculator",
  description: "Free Switzerland income tax calculator. Calculate your tax liability with current progressive brackets and deductions.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["switzerland income tax calculator", "switzerland tax calculator", "switzerland tax calculator"],
  variants: [{
    id: "standard",
    name: "Switzerland Income Tax",
    description: "Free Switzerland income tax calculator",
    fields: [
      { name: "income", label: "Annual Taxable Income", type: "number", prefix: "CHF", min: 0 },
    ],
    calculate: (inputs) => {
      const income = inputs.income as number;
      if (!income || income <= 0) return null;
      const brackets = [{l:17800,r:0},{l:31600,r:0.01},{l:55200,r:0.02},{l:103600,r:0.05},{l:176000,r:0.09},{l:Infinity,r:0.115}];
      let tax = 0, rem = income, prev = 0, marginal = 0;
      for (const s of brackets) { const t = Math.min(rem, s.l - prev); if (t <= 0) break; tax += t * s.r; marginal = s.r; rem -= t; prev = s.l; }
      return {
        primary: { label: "Income Tax", value: "CHF" + formatNumber(tax) },
        details: [
          { label: "Taxable income", value: "CHF" + formatNumber(income) },
          { label: "Effective rate", value: formatNumber((tax / income) * 100) + "%" },
          { label: "Marginal rate", value: (marginal * 100).toFixed(0) + "%" },
          { label: "After-tax income", value: "CHF" + formatNumber(income - tax) },
          { label: "Monthly after-tax", value: "CHF" + formatNumber((income - tax) / 12) },
        ],
        note: "Federal tax only! Cantonal/communal tax adds 10-35% depending on location (Zurich ~24%, Geneva ~33%, Zug ~10%). Total effective rate much higher.",
      };
    },
  }],
  relatedSlugs: ["tax-calculator", "salary-calculator"],
  faq: [
    { question: "How is income tax calculated in Switzerland?", answer: "Switzerland uses a progressive tax system where higher income portions are taxed at higher rates." },
    { question: "What is the top tax rate in Switzerland?", answer: "The highest marginal rate is 11.5%." },
  ],
  formula: "Tax = Sum of (income in bracket × rate)",
};
