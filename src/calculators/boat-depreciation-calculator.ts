import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const boatDepreciationCalculator: CalculatorDefinition = {
  slug: "boat-depreciation-calculator",
  title: "Boat Depreciation Calculator",
  description: "Calculate your boat depreciation and current market value based on purchase price, age, condition, and type using standard marine depreciation curves.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["boat depreciation","boat value calculator","marine depreciation","used boat value"],
  variants: [{
    id: "standard",
    name: "Boat Depreciation",
    description: "Calculate your boat depreciation and current market value based on purchase price, age, condition, and type using standard marine depreciation curves.",
    fields: [
      { name: "purchasePrice", label: "Original Purchase Price ($)", type: "number", min: 1000, max: 5000000, defaultValue: 50000 },
      { name: "boatAge", label: "Current Age (years)", type: "number", min: 0, max: 40, defaultValue: 5 },
      { name: "condition", label: "Condition", type: "select", options: [{ value: "0.85", label: "Excellent" }, { value: "0.75", label: "Good" }, { value: "0.65", label: "Fair" }, { value: "0.50", label: "Poor" }], defaultValue: "0.75" },
      { name: "boatType", label: "Boat Type", type: "select", options: [{ value: "0.12", label: "Runabout / Bowrider" }, { value: "0.10", label: "Center Console" }, { value: "0.08", label: "Sailboat" }, { value: "0.15", label: "Pontoon" }, { value: "0.18", label: "Jet Ski / PWC" }], defaultValue: "0.12" },
      { name: "engineHours", label: "Engine Hours", type: "number", min: 0, max: 10000, defaultValue: 300 },
    ],
    calculate: (inputs) => {
    const price = inputs.purchasePrice as number;
    const age = inputs.boatAge as number;
    const condition = parseFloat(inputs.condition as string);
    const depRate = parseFloat(inputs.boatType as string);
    const hours = inputs.engineHours as number;
    const baseValue = price * Math.pow(1 - depRate, age);
    const hoursAdjust = hours > 500 ? 0.95 : hours > 1000 ? 0.88 : 1.0;
    const currentValue = baseValue * condition * hoursAdjust;
    const totalDepreciation = price - currentValue;
    const depPercent = (totalDepreciation / price) * 100;
    const annualDep = age > 0 ? totalDepreciation / age : price * depRate;
    const fiveYearValue = price * Math.pow(1 - depRate, 5) * condition;
    return {
      primary: { label: "Estimated Current Value", value: "$" + formatNumber(Math.round(currentValue)) },
      details: [
        { label: "Total Depreciation", value: "$" + formatNumber(Math.round(totalDepreciation)) },
        { label: "Depreciation Percentage", value: formatNumber(Math.round(depPercent)) + "%" },
        { label: "Average Annual Depreciation", value: "$" + formatNumber(Math.round(annualDep)) },
        { label: "5-Year Value Estimate", value: "$" + formatNumber(Math.round(fiveYearValue)) },
        { label: "Value Retained", value: formatNumber(Math.round(100 - depPercent)) + "%" }
      ]
    };
  },
  }],
  relatedSlugs: ["boat-insurance-cost-calculator","marina-slip-cost-calculator"],
  faq: [
    { question: "How fast do boats depreciate?", answer: "Boats typically lose 10 to 15 percent of their value in the first year and 5 to 10 percent each subsequent year. After 10 years, most boats retain 30 to 50 percent of their original value depending on type and condition." },
    { question: "What boats hold their value best?", answer: "Center console fishing boats, quality sailboats, and well-known brands like Boston Whaler tend to hold value best. Pontoon boats and personal watercraft generally depreciate faster." },
    { question: "Do engine hours affect boat value?", answer: "Yes, high engine hours reduce value similar to high mileage on a car. Boats with under 500 hours are generally considered low-use. Over 1,000 hours on a gasoline engine may significantly reduce resale value." },
  ],
  formula: "Base Value = Purchase Price x (1 - Annual Depreciation Rate) ^ Age; Current Value = Base Value x Condition Factor x Engine Hours Adjustment; Total Depreciation = Purchase Price - Current Value",
};
