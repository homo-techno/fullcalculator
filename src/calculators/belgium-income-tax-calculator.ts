import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const belgiumIncomeTaxCalculator: CalculatorDefinition = {
  slug: "belgium-income-tax-calculator",
  title: "Belgium Income Tax Calculator",
  description: "Free Belgium income tax calculator. Calculate your tax liability with current progressive brackets and deductions.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["belgium income tax calculator", "belgium tax calculator", "belgium tax calculator"],
  variants: [{
    id: "standard",
    name: "Belgium Income Tax",
    description: "Free Belgium income tax calculator",
    fields: [
      { name: "income", label: "Annual Taxable Income", type: "number", prefix: "€", min: 0 },
    ],
    calculate: (inputs) => {
      const income = inputs.income as number;
      if (!income || income <= 0) return null;
      const brackets = [{l:15820,r:0.25},{l:27920,r:0.4},{l:48320,r:0.45},{l:Infinity,r:0.5}];
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
        note: "Federal IPP/PB brackets. Tax-free amount: €10,570. Municipal surcharge (0-9%) applies on top.",
      };
    },
  }],
  relatedSlugs: ["tax-calculator", "salary-calculator"],
  faq: [
    { question: "How is income tax calculated in Belgium?", answer: "Belgium uses a progressive tax system where higher income portions are taxed at higher rates." },
    { question: "What is the top tax rate in Belgium?", answer: "The highest marginal rate is 50%." },
  ],
  formula: "Tax = Sum of (income in bracket × rate)",
};
