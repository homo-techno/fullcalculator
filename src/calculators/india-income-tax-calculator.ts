import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const indiaIncomeTaxCalculator: CalculatorDefinition = {
  slug: "india-income-tax-calculator",
  title: "India Income Tax Calculator",
  description: "Free India income tax calculator for FY 2024-25. Calculate tax under new and old regime with slabs, cess, and rebate u/s 87A.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["india income tax calculator", "india tax calculator", "income tax india", "new regime tax calculator"],
  variants: [{
    id: "standard",
    name: "India Income Tax",
    description: "Free India income tax calculator for FY 2024-25",
    fields: [
      { name: "income", label: "Annual Gross Income", type: "number", placeholder: "e.g. 1200000", prefix: "₹", min: 0 },
      { name: "regime", label: "Tax Regime", type: "select", options: [{ label: "New Regime (2024-25)", value: "new" }, { label: "Old Regime", value: "old" }], defaultValue: "new" },
    ],
    calculate: (inputs) => {
      const income = inputs.income as number;
      const regime = inputs.regime as string;
      if (!income || income <= 0) return null;
      const stdDed = regime === "new" ? 75000 : 50000;
      const taxableIncome = Math.max(0, income - stdDed);
      let tax = 0;
      if (regime === "new") {
        const b = [{l:400000,r:0},{l:800000,r:0.05},{l:1200000,r:0.10},{l:1600000,r:0.15},{l:2000000,r:0.20},{l:2400000,r:0.25},{l:Infinity,r:0.30}];
        let rem = taxableIncome, prev = 0;
        for (const s of b) { const t = Math.min(rem, s.l - prev); if (t <= 0) break; tax += t * s.r; rem -= t; prev = s.l; }
        if (taxableIncome <= 700000) tax = 0;
      } else {
        const b = [{l:250000,r:0},{l:500000,r:0.05},{l:1000000,r:0.20},{l:Infinity,r:0.30}];
        let rem = taxableIncome, prev = 0;
        for (const s of b) { const t = Math.min(rem, s.l - prev); if (t <= 0) break; tax += t * s.r; rem -= t; prev = s.l; }
        if (taxableIncome <= 500000) tax = Math.max(0, tax - 12500);
      }
      const cess = tax * 0.04;
      const totalTax = tax + cess;
      return {
        primary: { label: "Total Tax", value: "₹" + formatNumber(totalTax) },
        details: [
          { label: "Taxable income", value: "₹" + formatNumber(taxableIncome) },
          { label: "Tax before cess", value: "₹" + formatNumber(tax) },
          { label: "Health & Education Cess (4%)", value: "₹" + formatNumber(cess) },
          { label: "Effective rate", value: formatNumber((totalTax / income) * 100) + "%" },
          { label: "Monthly tax", value: "₹" + formatNumber(totalTax / 12) },
        ],
        note: "Surcharge not included. Applies for income above ₹50 lakh.",
      };
    },
  }],
  relatedSlugs: ["tax-calculator", "salary-calculator"],
  faq: [
    { question: "What are the income tax slabs for FY 2024-25 new regime?", answer: "Under the new regime: 0% up to ₹4L, 5% (₹4-8L), 10% (₹8-12L), 15% (₹12-16L), 20% (₹16-20L), 25% (₹20-24L), 30% above ₹24L. Standard deduction is ₹75,000." },
    { question: "Which regime is better - old or new?", answer: "The new regime is better for most taxpayers unless you have significant deductions (HRA, 80C, 80D etc.) exceeding ₹3-4 lakh under the old regime." },
  ],
  formula: "Tax = Progressive slab rates × Taxable income + 4% Cess",
};
