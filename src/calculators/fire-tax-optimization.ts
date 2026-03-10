import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const fireT axOptimization: CalculatorDefinition = {
  slug: "fire-tax-optimization",
  title: "FIRE Tax Optimization Calculator",
  description:
    "Optimize taxes in early retirement. Calculate Roth conversions, capital gains harvesting, and tax-advantaged withdrawal strategies.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "FIRE tax optimization",
    "retirement tax strategy",
    "Roth conversion",
    "capital gains tax",
    "tax-efficient withdrawal",
  ],
  variants: [
    {
      id: "calculate",
      name: "Tax-Efficient Withdrawal",
      description: "Plan tax-optimal withdrawal sequence",
      fields: [
        {
          name: "annualExpenses",
          label: "Annual Expenses",
          type: "number",
          placeholder: "e.g. 60000",
          prefix: "$",
        },
        {
          name: "capitalGains",
          label: "Unrealized Capital Gains",
          type: "number",
          placeholder: "e.g. 200000",
          prefix: "$",
        },
      ],
      calculate: (inputs) => {
        const expenses = parseFloat(inputs.annualExpenses as string) || 60000;
        const gains = parseFloat(inputs.capitalGains as string) || 200000;

        // Tax brackets (2026 estimates)
        const standardDeduction = 15000;
        const bracket22 = 23200;
        const longTermCapGainsBracket = 47025;

        const taxableExpenses = Math.max(0, expenses - standardDeduction);
        const taxFromExpenses = taxableExpenses * 0.12; // Rough 12% rate

        // Optimal: harvest long-term gains up to bracket threshold
        const gainHarvest = Math.min(gains, longTermCapGainsBracket - expenses);
        const taxFromGains = gainHarvest * 0.15; // 15% long-term rate

        const totalTax = taxFromExpenses + taxFromGains;
        const effectiveRate = (totalTax / expenses) * 100;

        return {
          primary: { label: "Estimated Tax", value: `$${formatNumber(totalTax, 0)}` },
          details: [
            { label: "Annual expenses", value: `$${formatNumber(expenses, 0)}` },
            { label: "Standard deduction", value: `$${formatNumber(standardDeduction, 0)}` },
            { label: "Taxable income", value: `$${formatNumber(taxableExpenses, 0)}` },
            { label: "Tax on ordinary income", value: `$${formatNumber(taxFromExpenses, 0)}` },
            { label: "Recommended gain harvest", value: `$${formatNumber(gainHarvest, 0)}` },
            { label: "Tax on long-term gains", value: `$${formatNumber(taxFromGains, 0)}` },
            { label: "Total annual tax", value: `$${formatNumber(totalTax, 0)}` },
            { label: "Effective tax rate", value: `${formatNumber(effectiveRate, 2)}%` },
          ],
          note: "Strategy: use standard deduction, harvest long-term gains below bracket limits, delay qualified dividends. Consult tax professional.",
        };
      },
    },
  ],
  relatedSlugs: ["fire-number-calculator", "roth-conversion-ladder-calculator"],
  faq: [
    {
      question: "What's the best withdrawal order in FIRE?",
      answer:
        "1) Tax-loss harvest. 2) Standard deduction worth of ordinary income. 3) Long-term capital gains up to bracket limit. 4) Qualified dividends. 5) Roth conversions (if beneficial).",
    },
    {
      question: "Should I harvest capital gains in FIRE?",
      answer:
        "Yes! In FIRE with low income, long-term gains may be taxed at 0%. Harvesting up to bracket limits saves taxes. Good 'tax-free' income during low-earning years.",
    },
  ],
  formula: "Tax = (Ordinary Income × Tax Rate) + (Long-Term Gains × 15% or 0%)",
};
