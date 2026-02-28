import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const czechRepublicIncomeTaxCalculator: CalculatorDefinition = {
  slug: "czech-republic-income-tax-calculator",
  title: "Czech Republic Income Tax Calculator",
  description: "Free Czech Republic income tax calculator. Calculate your tax liability with current progressive brackets and deductions.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["czech republic income tax calculator", "czech republic tax calculator", "czech-republic tax calculator"],
  variants: [{
    id: "standard",
    name: "Czech Republic Income Tax",
    description: "Free Czech Republic income tax calculator",
    fields: [
      { name: "income", label: "Annual Taxable Income", type: "number", prefix: "Kč", min: 0 },
    ],
    calculate: (inputs) => {
      const income = inputs.income as number;
      if (!income || income <= 0) return null;
      const brackets = [{l:1935552,r:0.15},{l:Infinity,r:0.23}];
      let tax = 0, rem = income, prev = 0, marginal = 0;
      for (const s of brackets) { const t = Math.min(rem, s.l - prev); if (t <= 0) break; tax += t * s.r; marginal = s.r; rem -= t; prev = s.l; }
      return {
        primary: { label: "Income Tax", value: "Kč" + formatNumber(tax) },
        details: [
          { label: "Taxable income", value: "Kč" + formatNumber(income) },
          { label: "Effective rate", value: formatNumber((tax / income) * 100) + "%" },
          { label: "Marginal rate", value: (marginal * 100).toFixed(0) + "%" },
          { label: "After-tax income", value: "Kč" + formatNumber(income - tax) },
          { label: "Monthly after-tax", value: "Kč" + formatNumber((income - tax) / 12) },
        ],
        note: "2025 brackets. 23% rate applies above 36× average wage (~CZK 1,935,552). Employee social/health: 11%.",
      };
    },
  }],
  relatedSlugs: ["tax-calculator", "salary-calculator"],
  faq: [
    { question: "How is income tax calculated in Czech Republic?", answer: "Czech Republic uses a progressive tax system where higher income portions are taxed at higher rates." },
    { question: "What is the top tax rate in Czech Republic?", answer: "The highest marginal rate is 23%." },
  ],
  formula: "Tax = Sum of (income in bracket × rate)",
};
