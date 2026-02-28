import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const turkeyIncomeTaxCalculator: CalculatorDefinition = {
  slug: "turkey-income-tax-calculator",
  title: "Turkey Income Tax Calculator",
  description: "Free Turkey income tax (Gelir Vergisi) calculator for 2025. Calculate progressive tax on salary income with current brackets.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["turkey income tax calculator", "turkey gelir vergisi calculator", "turkey tax calculator 2025"],
  variants: [{
    id: "standard",
    name: "Turkey Income Tax",
    description: "Free Turkey income tax (Gelir Vergisi) calculator for 2025",
    fields: [
      { name: "income", label: "Annual Salary Income", type: "number", prefix: "₺", min: 0 },
    ],
    calculate: (inputs) => {
      const income = inputs.income as number;
      if (!income || income <= 0) return null;
      const brackets = [{l:158000,r:0.15},{l:330000,r:0.20},{l:1200000,r:0.27},{l:4300000,r:0.35},{l:Infinity,r:0.40}];
      let tax = 0, rem = income, prev = 0, marginal = 0;
      for (const s of brackets) { const t = Math.min(rem, s.l - prev); if (t <= 0) break; tax += t * s.r; marginal = s.r; rem -= t; prev = s.l; }
      return {
        primary: { label: "Income Tax", value: "₺" + formatNumber(tax) },
        details: [
          { label: "Annual income", value: "₺" + formatNumber(income) },
          { label: "Effective rate", value: formatNumber((tax / income) * 100) + "%" },
          { label: "Marginal rate", value: (marginal * 100) + "%" },
          { label: "After-tax", value: "₺" + formatNumber(income - tax) },
        ],
        note: "2025 salary income brackets. Non-salary income has different thresholds for the 27% bracket (₺800K).",
      };
    },
  }],
  relatedSlugs: ["tax-calculator", "salary-calculator"],
  faq: [
    { question: "What are Turkey income tax brackets for 2025?", answer: "Salary brackets: 15% up to ₺158K, 20% (₺158-330K), 27% (₺330K-1.2M), 35% (₺1.2-4.3M), 40% above ₺4.3M." },
    { question: "Is there stamp tax on salary in Turkey?", answer: "Yes, 0.759% stamp tax is applied to gross salary before all other deductions." },
  ],
  formula: "Tax = Progressive rates: 15% / 20% / 27% / 35% / 40% on salary brackets",
};
