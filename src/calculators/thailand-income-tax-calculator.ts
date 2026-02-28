import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const thailandIncomeTaxCalculator: CalculatorDefinition = {
  slug: "thailand-income-tax-calculator",
  title: "Thailand Income Tax Calculator",
  description: "Free Thailand income tax calculator. Calculate your tax liability with current progressive brackets and deductions.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["thailand income tax calculator", "thailand tax calculator", "thailand tax calculator"],
  variants: [{
    id: "standard",
    name: "Thailand Income Tax",
    description: "Free Thailand income tax calculator",
    fields: [
      { name: "income", label: "Annual Taxable Income", type: "number", prefix: "฿", min: 0 },
    ],
    calculate: (inputs) => {
      const income = inputs.income as number;
      if (!income || income <= 0) return null;
      const brackets = [{l:150000,r:0},{l:300000,r:0.05},{l:500000,r:0.1},{l:750000,r:0.15},{l:1000000,r:0.2},{l:2000000,r:0.25},{l:5000000,r:0.3},{l:Infinity,r:0.35}];
      let tax = 0, rem = income, prev = 0, marginal = 0;
      for (const s of brackets) { const t = Math.min(rem, s.l - prev); if (t <= 0) break; tax += t * s.r; marginal = s.r; rem -= t; prev = s.l; }
      return {
        primary: { label: "Income Tax", value: "฿" + formatNumber(tax) },
        details: [
          { label: "Taxable income", value: "฿" + formatNumber(income) },
          { label: "Effective rate", value: formatNumber((tax / income) * 100) + "%" },
          { label: "Marginal rate", value: (marginal * 100).toFixed(0) + "%" },
          { label: "After-tax income", value: "฿" + formatNumber(income - tax) },
          { label: "Monthly after-tax", value: "฿" + formatNumber((income - tax) / 12) },
        ],
        note: "Net annual income after deductions. Employment deduction: 50% of income (max ฿100,000). Personal allowance: ฿60,000.",
      };
    },
  }],
  relatedSlugs: ["tax-calculator", "salary-calculator"],
  faq: [
    { question: "How is income tax calculated in Thailand?", answer: "Thailand uses a progressive tax system where higher income portions are taxed at higher rates." },
    { question: "What is the top tax rate in Thailand?", answer: "The highest marginal rate is 35%." },
  ],
  formula: "Tax = Sum of (income in bracket × rate)",
};
