import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const nigeriaIncomeTaxCalculator: CalculatorDefinition = {
  slug: "nigeria-income-tax-calculator",
  title: "Nigeria Income Tax Calculator",
  description: "Free Nigeria income tax calculator. Calculate your tax liability with current progressive brackets and deductions.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["nigeria income tax calculator", "nigeria tax calculator", "nigeria tax calculator"],
  variants: [{
    id: "standard",
    name: "Nigeria Income Tax",
    description: "Free Nigeria income tax calculator",
    fields: [
      { name: "income", label: "Annual Taxable Income", type: "number", prefix: "₦", min: 0 },
    ],
    calculate: (inputs) => {
      const income = inputs.income as number;
      if (!income || income <= 0) return null;
      const brackets = [{l:300000,r:0.07},{l:600000,r:0.11},{l:1100000,r:0.15},{l:1600000,r:0.19},{l:3200000,r:0.21},{l:Infinity,r:0.24}];
      let tax = 0, rem = income, prev = 0, marginal = 0;
      for (const s of brackets) { const t = Math.min(rem, s.l - prev); if (t <= 0) break; tax += t * s.r; marginal = s.r; rem -= t; prev = s.l; }
      return {
        primary: { label: "Income Tax", value: "₦" + formatNumber(tax) },
        details: [
          { label: "Taxable income", value: "₦" + formatNumber(income) },
          { label: "Effective rate", value: formatNumber((tax / income) * 100) + "%" },
          { label: "Marginal rate", value: (marginal * 100).toFixed(0) + "%" },
          { label: "After-tax income", value: "₦" + formatNumber(income - tax) },
          { label: "Monthly after-tax", value: "₦" + formatNumber((income - tax) / 12) },
        ],
        note: "Consolidated Relief Allowance (CRA) of 20% of gross income + max(₦200K, 1% of gross) is deducted before applying brackets.",
      };
    },
  }],
  relatedSlugs: ["tax-calculator", "salary-calculator"],
  faq: [
    { question: "How is income tax calculated in Nigeria?", answer: "Nigeria uses a progressive tax system where higher income portions are taxed at higher rates." },
    { question: "What is the top tax rate in Nigeria?", answer: "The highest marginal rate is 24%." },
  ],
  formula: "Tax = Sum of (income in bracket × rate)",
};
