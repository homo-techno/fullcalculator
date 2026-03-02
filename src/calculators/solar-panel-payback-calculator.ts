import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const solarPanelPaybackCalculator: CalculatorDefinition = {
  slug: "solar-panel-payback-calculator",
  title: "Solar Panel Payback Calculator",
  description: "Calculate the break-even timeline for solar panel installation based on system cost, energy production, electricity rates, and incentives.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["solar payback","solar roi","solar panel break even","solar investment","solar energy savings"],
  variants: [{
    id: "standard",
    name: "Solar Panel Payback",
    description: "Calculate the break-even timeline for solar panel installation based on system cost, energy production, electricity rates, and incentives.",
    fields: [
      { name: "systemCost", label: "Total System Cost ($)", type: "number", min: 1000, max: 100000, defaultValue: 20000 },
      { name: "annualProduction", label: "Annual Production (kWh)", type: "number", min: 500, max: 30000, defaultValue: 8000 },
      { name: "electricityRate", label: "Electricity Rate ($/kWh)", type: "number", min: 0.05, max: 0.50, defaultValue: 0.13 },
      { name: "incentivePercent", label: "Tax Credit / Incentive (%)", type: "number", min: 0, max: 50, defaultValue: 30 },
    ],
    calculate: (inputs) => {
    const systemCost = inputs.systemCost as number;
    const annualProduction = inputs.annualProduction as number;
    const electricityRate = inputs.electricityRate as number;
    const incentivePercent = inputs.incentivePercent as number;
    const netCost = systemCost * (1 - incentivePercent / 100);
    const annualSavings = annualProduction * electricityRate;
    const paybackYears = netCost / annualSavings;
    const twentyYearSavings = annualSavings * 20 - netCost;
    const roi = (twentyYearSavings / netCost) * 100;
    const monthlySavings = annualSavings / 12;
    return {
      primary: { label: "Payback Period", value: formatNumber(Math.round(paybackYears * 10) / 10) + " years" },
      details: [
        { label: "Net System Cost (After Incentives)", value: "$" + formatNumber(Math.round(netCost)) },
        { label: "Annual Savings", value: "$" + formatNumber(Math.round(annualSavings)) },
        { label: "Monthly Savings", value: "$" + formatNumber(Math.round(monthlySavings)) },
        { label: "20-Year Net Savings", value: "$" + formatNumber(Math.round(twentyYearSavings)) },
        { label: "20-Year ROI", value: formatNumber(Math.round(roi)) + "%" }
      ]
    };
  },
  }],
  relatedSlugs: ["solar-panel-savings-calculator","carbon-footprint-calculator","rainfall-collection-calculator"],
  faq: [
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
  ],
  formula: "Net Cost = System Cost x (1 - Incentive%)
Payback Years = Net Cost / (Annual kWh x Rate)
20-Year Savings = (Annual Savings x 20) - Net Cost",
};
