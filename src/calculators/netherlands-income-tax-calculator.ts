import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const netherlandsIncomeTaxCalculator: CalculatorDefinition = {
  slug: "netherlands-income-tax-calculator",
  title: "Netherlands Income Tax Calculator",
  description: "Free Netherlands income tax calculator. Calculate your tax liability with current progressive brackets and deductions.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["netherlands income tax calculator", "netherlands tax calculator", "netherlands tax calculator"],
  variants: [{
    id: "standard",
    name: "Netherlands Income Tax",
    description: "Free Netherlands income tax calculator",
    fields: [
      { name: "income", label: "Annual Taxable Income", type: "number", prefix: "€", min: 0 },
    ],
    calculate: (inputs) => {
      const income = inputs.income as number;
      if (!income || income <= 0) return null;
      const brackets = [{l:75518,r:0.3697},{l:Infinity,r:0.495}];
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
        note: "Box 1 rates (2025). Social premiums included in 36.97%. General tax credit ~€3,362 (phases out). Box 2 (shares): 24.5%/33%. Box 3 (savings): deemed return taxed at 36%.",
      };
    },
  }],
  relatedSlugs: ["tax-calculator", "salary-calculator"],
  faq: [
    { question: "How is income tax calculated in Netherlands?", answer: "Netherlands uses a progressive tax system where higher income portions are taxed at higher rates." },
    { question: "What is the top tax rate in Netherlands?", answer: "The highest marginal rate is 49.5%." },
  ],
  formula: "Tax = Sum of (income in bracket × rate)",
};
