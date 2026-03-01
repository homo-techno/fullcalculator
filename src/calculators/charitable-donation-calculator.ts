import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const charitableDonationCalculator: CalculatorDefinition = {
  slug: "charitable-donation-calculator",
  title: "Charitable Donation Calculator",
  description: "Calculate the tax savings from charitable donations based on your tax bracket.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["charitable donation tax savings", "donation deduction", "charity tax benefit"],
  variants: [{
    id: "standard",
    name: "Charitable Donation",
    description: "Calculate the tax savings from charitable donations based on your tax bracket",
    fields: [
      { name: "donationAmount", label: "Donation Amount", type: "number", prefix: "$", min: 0, max: 10000000, defaultValue: 5000 },
      { name: "taxBracket", label: "Tax Bracket", type: "select", options: [{value:"0.12",label:"12%"},{value:"0.22",label:"22%"},{value:"0.24",label:"24%"},{value:"0.32",label:"32%"},{value:"0.35",label:"35%"},{value:"0.37",label:"37%"}], defaultValue: "0.22" },
      { name: "agi", label: "Adjusted Gross Income", type: "number", prefix: "$", min: 0, max: 10000000, defaultValue: 100000 },
    ],
    calculate: (inputs) => {
      const donation = inputs.donationAmount as number;
      const bracket = parseFloat(inputs.taxBracket as string);
      const agi = inputs.agi as number;
      if (!donation || donation <= 0 || !agi) return null;
      const maxDeduction = agi * 0.60;
      const deductible = Math.min(donation, maxDeduction);
      const taxSavings = deductible * bracket;
      const effectiveCost = donation - taxSavings;
      const carryover = donation > maxDeduction ? donation - maxDeduction : 0;
      return {
        primary: { label: "Tax Savings", value: "$" + formatNumber(Math.round(taxSavings)) },
        details: [
          { label: "Deductible Amount", value: "$" + formatNumber(deductible) },
          { label: "Effective Cost of Donation", value: "$" + formatNumber(Math.round(effectiveCost)) },
          { label: "Max Deduction (60% AGI)", value: "$" + formatNumber(maxDeduction) },
          { label: "Carryover to Next Year", value: "$" + formatNumber(carryover) },
        ],
      };
    },
  }],
  relatedSlugs: ["itemized-deduction-calculator", "effective-tax-rate-calculator"],
  faq: [
    { question: "How much can I deduct for charitable donations?", answer: "Cash donations to qualifying charities are deductible up to 60% of your adjusted gross income, with excess carrying forward 5 years." },
    { question: "Do I need a receipt for charitable donations?", answer: "You need written acknowledgment from the charity for donations of $250 or more, and records for all donations you claim." },
  ],
  formula: "Tax Savings = min(Donation, AGI x 60%) x Tax Bracket Rate",
};
