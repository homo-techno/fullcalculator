import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const philippinesIncomeTaxCalculator: CalculatorDefinition = {
  slug: "philippines-income-tax-calculator",
  title: "Philippines Income Tax Calculator",
  description: "Free Philippines income tax calculator with 2025 TRAIN law brackets. Calculate BIR tax on your annual taxable compensation.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["philippines income tax calculator", "bir tax calculator", "train law tax calculator 2025"],
  variants: [{
    id: "standard",
    name: "Philippines Income Tax",
    description: "Free Philippines income tax calculator with 2025 TRAIN law brackets",
    fields: [
      { name: "income", label: "Annual Taxable Income", type: "number", prefix: "₱", min: 0 },
    ],
    calculate: (inputs) => {
      const income = inputs.income as number;
      if (!income || income <= 0) return null;
      let tax = 0;
      if (income <= 250000) tax = 0;
      else if (income <= 400000) tax = (income - 250000) * 0.15;
      else if (income <= 800000) tax = 22500 + (income - 400000) * 0.20;
      else if (income <= 2000000) tax = 102500 + (income - 800000) * 0.25;
      else if (income <= 8000000) tax = 402500 + (income - 2000000) * 0.30;
      else tax = 2202500 + (income - 8000000) * 0.35;
      return {
        primary: { label: "Annual Income Tax", value: "₱" + formatNumber(tax) },
        details: [
          { label: "Taxable income", value: "₱" + formatNumber(income) },
          { label: "Effective rate", value: formatNumber((tax / income) * 100) + "%" },
          { label: "Monthly tax", value: "₱" + formatNumber(tax / 12) },
          { label: "Annual after-tax", value: "₱" + formatNumber(income - tax) },
        ],
        note: "2025 TRAIN law brackets. First ₱250,000 is tax-exempt.",
      };
    },
  }],
  relatedSlugs: ["tax-calculator", "salary-calculator"],
  faq: [
    { question: "What are the 2025 Philippines tax brackets?", answer: "0% up to ₱250K, 15% (₱250-400K), 20% (₱400-800K), 25% (₱800K-2M), 30% (₱2-8M), 35% (above ₱8M). Under TRAIN law effective 2025." },
    { question: "Is the first ₱250,000 tax-free?", answer: "Yes, under the TRAIN law, the first ₱250,000 of annual taxable income is completely exempt from income tax." },
  ],
  formula: "Tax = Fixed amount per bracket + Rate × excess over bracket floor",
};
