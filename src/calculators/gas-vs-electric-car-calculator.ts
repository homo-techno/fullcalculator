import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const gasVsElectricCarCalculator: CalculatorDefinition = {
  slug: "gas-vs-electric-car-calculator",
  title: "Gas vs Electric Car Calculator",
  description: "Total cost comparison between gas and electric vehicles over time",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["gas vs electric","EV vs gas cost","electric car savings"],
  variants: [{
    id: "standard",
    name: "Gas vs Electric Car",
    description: "Total cost comparison between gas and electric vehicles over time",
    fields: [
      { name: "annualMiles", label: "Annual Miles Driven", type: "number", defaultValue: 12000, min: 0, step: 1000 },
      { name: "gasMpg", label: "Gas Car MPG", type: "number", defaultValue: 28, min: 5, max: 60, step: 1 },
      { name: "gasPrice", label: "Gas Price ($/gallon)", type: "number", defaultValue: 3.50, min: 0, max: 10, step: 0.10 },
      { name: "evEfficiency", label: "EV Efficiency (miles/kWh)", type: "number", defaultValue: 3.5, min: 1, max: 6, step: 0.1 },
      { name: "electricRate", label: "Electricity Rate ($/kWh)", type: "number", defaultValue: 0.13, min: 0, max: 1, step: 0.01 },
    ],
    calculate: (inputs: Record<string, string | number>) => {
      const miles = inputs.annualMiles as number || 12000;
      const mpg = inputs.gasMpg as number || 28;
      const gasPrice = inputs.gasPrice as number || 3.50;
      const evEff = inputs.evEfficiency as number || 3.5;
      const elecRate = inputs.electricRate as number || 0.13;
      const annualGasCost = (miles / mpg) * gasPrice;
      const annualEvCost = (miles / evEff) * elecRate;
      const annualSavings = annualGasCost - annualEvCost;
      const fiveYearSavings = annualSavings * 5;
      const gasCostPerMile = gasPrice / mpg;
      const evCostPerMile = elecRate / evEff;
      return {
        primary: { label: "Annual Fuel Savings (EV)", value: "$" + formatNumber(Math.round(annualSavings)) },
        details: [
          { label: "Annual Gas Cost", value: "$" + formatNumber(Math.round(annualGasCost)) },
          { label: "Annual EV Cost", value: "$" + formatNumber(Math.round(annualEvCost)) },
          { label: "5-Year Savings", value: "$" + formatNumber(Math.round(fiveYearSavings)) },
          { label: "Gas Cost Per Mile", value: "$" + formatNumber(Math.round(gasCostPerMile * 100) / 100) }
        ]
      };
    },
  }],
  relatedSlugs: ["ev-charging-cost-calculator"],
  faq: [
    { question: "Are electric cars cheaper to fuel?", answer: "Yes, electricity is typically 3-5 times cheaper per mile than gasoline for most drivers." },
    { question: "What other EV savings exist?", answer: "EVs also save on maintenance since they have fewer moving parts, no oil changes, and less brake wear." },
  ],
  formula: "Annual Savings = (Miles/MPG x Gas Price) - (Miles/Efficiency x Electric Rate)",
};
