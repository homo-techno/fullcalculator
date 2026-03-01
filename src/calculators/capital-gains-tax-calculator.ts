import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const capitalGainsTaxCalculator: CalculatorDefinition = {
  slug: "capital-gains-tax-calculator",
  title: "Capital Gains Tax Calculator",
  description: "Estimate federal capital gains tax on investment profits based on holding period and income.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["capital gains tax", "investment tax calculator", "long term capital gains"],
  variants: [{
    id: "standard",
    name: "Capital Gains Tax",
    description: "Estimate federal capital gains tax on investment profits based on holding period and income",
    fields: [
      { name: "purchasePrice", label: "Purchase Price", type: "number", prefix: "$", min: 0, max: 100000000, defaultValue: 10000 },
      { name: "salePrice", label: "Sale Price", type: "number", prefix: "$", min: 0, max: 100000000, defaultValue: 15000 },
      { name: "holdingPeriod", label: "Holding Period", type: "select", options: [{value:"short",label:"Short-Term (under 1 year)"},{value:"long",label:"Long-Term (1 year or more)"}], defaultValue: "long" },
      { name: "taxableIncome", label: "Taxable Income", type: "number", prefix: "$", min: 0, max: 10000000, defaultValue: 80000 },
    ],
    calculate: (inputs) => {
      const purchase = inputs.purchasePrice as number;
      const sale = inputs.salePrice as number;
      const holding = inputs.holdingPeriod as string;
      const income = inputs.taxableIncome as number;
      if (!sale || sale <= 0) return null;
      const gain = sale - purchase;
      if (gain <= 0) return { primary: { label: "Capital Gain", value: "No gain (loss of $" + formatNumber(Math.abs(gain)) + ")" }, details: [{ label: "Loss Deduction Limit", value: "$3,000/year" }] };
      let taxRate;
      if (holding === "short") {
        if (income > 578125) taxRate = 0.37;
        else if (income > 231250) taxRate = 0.35;
        else if (income > 182100) taxRate = 0.32;
        else if (income > 95375) taxRate = 0.24;
        else if (income > 44725) taxRate = 0.22;
        else taxRate = 0.12;
      } else {
        if (income > 492300) taxRate = 0.20;
        else if (income > 44625) taxRate = 0.15;
        else taxRate = 0;
      }
      const tax = gain * taxRate;
      const netProfit = gain - tax;
      return {
        primary: { label: "Estimated Tax", value: "$" + formatNumber(Math.round(tax)) },
        details: [
          { label: "Capital Gain", value: "$" + formatNumber(gain) },
          { label: "Tax Rate", value: (taxRate * 100).toFixed(0) + "%" },
          { label: "Net Profit After Tax", value: "$" + formatNumber(Math.round(netProfit)) },
          { label: "Effective Return", value: ((netProfit / purchase) * 100).toFixed(1) + "%" },
        ],
      };
    },
  }],
  relatedSlugs: ["estimated-tax-calculator", "effective-tax-rate-calculator"],
  faq: [
    { question: "What is the long-term capital gains tax rate?", answer: "Long-term capital gains (held over 1 year) are taxed at 0%, 15%, or 20% depending on your taxable income." },
    { question: "Can capital losses offset gains?", answer: "Yes, capital losses offset gains dollar for dollar, and you can deduct up to $3,000 of excess losses against ordinary income per year." },
  ],
  formula: "Tax = Capital Gain x Tax Rate (based on holding period and income bracket)",
};
