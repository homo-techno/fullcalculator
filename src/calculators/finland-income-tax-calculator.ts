import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const finlandIncomeTaxCalculator: CalculatorDefinition = {
  slug: "finland-income-tax-calculator",
  title: "Finland Income Tax Calculator",
  description: "Free Finland income tax calculator. Calculate your tax liability with current progressive brackets and deductions.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["finland income tax calculator", "finland tax calculator", "finland tax calculator"],
  variants: [{
    id: "standard",
    name: "Finland Income Tax",
    description: "Free Finland income tax calculator",
    fields: [
      { name: "income", label: "Annual Taxable Income", type: "number", prefix: "€", min: 0 },
    ],
    calculate: (inputs) => {
      const income = inputs.income as number;
      if (!income || income <= 0) return null;
      const brackets = [{l:19900,r:0},{l:29700,r:0.26},{l:49000,r:0.37},{l:85800,r:0.41},{l:Infinity,r:0.51}];
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
        note: "Approximate total = state progressive tax + municipal tax (~20%). Basic deduction ~€19,900. Church tax (1-2%) not included.",
      };
    },
  }],
  relatedSlugs: ["tax-calculator", "salary-calculator"],
  faq: [
    { question: "How is income tax calculated in Finland?", answer: "Finland uses a progressive tax system where higher income portions are taxed at higher rates." },
    { question: "What is the top tax rate in Finland?", answer: "The highest marginal rate is 51%." },
  ],
  formula: "Tax = Sum of (income in bracket × rate)",
};
