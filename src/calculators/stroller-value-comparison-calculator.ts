import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const strollerValueComparisonCalculator: CalculatorDefinition = {
  slug: "stroller-value-comparison-calculator",
  title: "Stroller Value Comparison Calculator",
  description: "Compare the long-term value of strollers by calculating cost per use based on price, expected usage frequency, and years of use.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["stroller comparison","stroller value","stroller cost per use","stroller budget","baby stroller calculator"],
  variants: [{
    id: "standard",
    name: "Stroller Value Comparison",
    description: "Compare the long-term value of strollers by calculating cost per use based on price, expected usage frequency, and years of use.",
    fields: [
      { name: "price", label: "Stroller Price ($)", type: "number", min: 50, max: 3000, defaultValue: 400 },
      { name: "usesPerWeek", label: "Uses Per Week", type: "number", min: 1, max: 14, defaultValue: 5 },
      { name: "yearsOfUse", label: "Years of Use", type: "number", min: 1, max: 6, defaultValue: 3 },
      { name: "accessories", label: "Accessories Cost ($)", type: "number", min: 0, max: 500, defaultValue: 75 },
      { name: "resalePercent", label: "Expected Resale Value (%)", type: "number", min: 0, max: 60, defaultValue: 30 },
    ],
    calculate: (inputs) => {
    const price = inputs.price as number;
    const usesPerWeek = inputs.usesPerWeek as number;
    const yearsOfUse = inputs.yearsOfUse as number;
    const accessories = inputs.accessories as number;
    const resalePercent = inputs.resalePercent as number;
    const totalCost = price + accessories;
    const resaleValue = price * (resalePercent / 100);
    const netCost = totalCost - resaleValue;
    const totalUses = usesPerWeek * 52 * yearsOfUse;
    const costPerUse = netCost / totalUses;
    const monthlyCost = netCost / (yearsOfUse * 12);
    return {
      primary: { label: "Cost Per Use", value: "$" + formatNumber(Math.round(costPerUse * 100) / 100) },
      details: [
        { label: "Total Cost With Accessories", value: "$" + formatNumber(Math.round(totalCost)) },
        { label: "Estimated Resale Value", value: "$" + formatNumber(Math.round(resaleValue)) },
        { label: "Net Cost", value: "$" + formatNumber(Math.round(netCost)) },
        { label: "Total Estimated Uses", value: formatNumber(totalUses) },
        { label: "Monthly Cost", value: "$" + formatNumber(Math.round(monthlyCost * 100) / 100) }
      ]
    };
  },
  }],
  relatedSlugs: ["car-seat-expiration-calculator","nursery-setup-cost-calculator","baby-clothes-size-predictor"],
  faq: [
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
  ],
  formula: "Net Cost = Price + Accessories - (Price x Resale%)
Cost Per Use = Net Cost / (Uses/Week x 52 x Years)",
};
