import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const evSavingsCalculator: CalculatorDefinition = {
  slug: "ev-savings-calculator",
  title: "EV vs Gas Savings Calculator",
  description: "Free EV vs gas savings calculator. Compare the total cost of owning an electric vehicle versus a gas-powered car over time.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["ev vs gas savings", "electric vs gas car cost", "EV savings calculator", "electric car savings", "gas vs electric comparison"],
  variants: [
    {
      id: "fuel",
      name: "Fuel Cost Savings",
      description: "Compare annual fuel costs between EV and gas vehicle",
      fields: [
        { name: "annualMiles", label: "Annual Miles Driven", type: "number", placeholder: "e.g. 12000" },
        { name: "gasMpg", label: "Gas Car MPG", type: "number", placeholder: "e.g. 28", suffix: "MPG" },
        { name: "gasPrice", label: "Gas Price per Gallon", type: "number", placeholder: "e.g. 3.50", prefix: "$", step: 0.01 },
        { name: "evEfficiency", label: "EV Efficiency", type: "number", placeholder: "e.g. 3.5", suffix: "mi/kWh" },
        { name: "electricityRate", label: "Electricity Rate", type: "number", placeholder: "e.g. 0.13", prefix: "$", step: 0.01, suffix: "/kWh" },
      ],
      calculate: (inputs) => {
        const miles = inputs.annualMiles as number;
        const mpg = inputs.gasMpg as number;
        const gasPrice = inputs.gasPrice as number;
        const evEff = inputs.evEfficiency as number;
        const elecRate = inputs.electricityRate as number;
        if (!miles || !mpg || !gasPrice || !evEff || !elecRate) return null;

        const gasCostAnnual = (miles / mpg) * gasPrice;
        const evCostAnnual = (miles / evEff) * elecRate;
        const annualSavings = gasCostAnnual - evCostAnnual;
        const fiveYearSavings = annualSavings * 5;

        return {
          primary: { label: "Annual Fuel Savings (EV)", value: `$${formatNumber(annualSavings)}` },
          details: [
            { label: "Annual gas cost", value: `$${formatNumber(gasCostAnnual)}` },
            { label: "Annual EV electricity cost", value: `$${formatNumber(evCostAnnual)}` },
            { label: "Monthly savings", value: `$${formatNumber(annualSavings / 12)}` },
            { label: "5-year fuel savings", value: `$${formatNumber(fiveYearSavings)}` },
            { label: "Gas cost per mile", value: `$${formatNumber(gasCostAnnual / miles, 3)}` },
            { label: "EV cost per mile", value: `$${formatNumber(evCostAnnual / miles, 3)}` },
          ],
        };
      },
    },
    {
      id: "total",
      name: "Total Cost Comparison",
      description: "Compare total ownership costs over time",
      fields: [
        { name: "evPrice", label: "EV Purchase Price", type: "number", placeholder: "e.g. 42000", prefix: "$" },
        { name: "gasPrice", label: "Gas Car Purchase Price", type: "number", placeholder: "e.g. 30000", prefix: "$" },
        { name: "evFuelAnnual", label: "EV Annual Energy Cost", type: "number", placeholder: "e.g. 500", prefix: "$" },
        { name: "gasFuelAnnual", label: "Gas Annual Fuel Cost", type: "number", placeholder: "e.g. 1800", prefix: "$" },
        { name: "evMaintenance", label: "EV Annual Maintenance", type: "number", placeholder: "e.g. 400", prefix: "$" },
        { name: "gasMaintenance", label: "Gas Annual Maintenance", type: "number", placeholder: "e.g. 800", prefix: "$" },
        { name: "taxCredit", label: "EV Tax Credit", type: "number", placeholder: "e.g. 7500", prefix: "$" },
        { name: "years", label: "Ownership Period", type: "number", placeholder: "e.g. 8", suffix: "years" },
      ],
      calculate: (inputs) => {
        const evPrice = (inputs.evPrice as number) || 0;
        const gasCarPrice = (inputs.gasPrice as number) || 0;
        const evFuel = (inputs.evFuelAnnual as number) || 0;
        const gasFuel = (inputs.gasFuelAnnual as number) || 0;
        const evMaint = (inputs.evMaintenance as number) || 0;
        const gasMaint = (inputs.gasMaintenance as number) || 0;
        const credit = (inputs.taxCredit as number) || 0;
        const years = (inputs.years as number) || 5;

        const evTotal = (evPrice - credit) + (evFuel + evMaint) * years;
        const gasTotal = gasCarPrice + (gasFuel + gasMaint) * years;
        const diff = gasTotal - evTotal;
        const breakEvenYears = (evPrice - credit - gasCarPrice) / ((gasFuel + gasMaint) - (evFuel + evMaint));

        return {
          primary: { label: `${years}-Year Savings (EV)`, value: diff > 0 ? `$${formatNumber(diff)}` : `-$${formatNumber(Math.abs(diff))}` },
          details: [
            { label: `EV total cost (${years} yr)`, value: `$${formatNumber(evTotal)}` },
            { label: `Gas car total cost (${years} yr)`, value: `$${formatNumber(gasTotal)}` },
            { label: "Break-even point", value: breakEvenYears > 0 ? `${formatNumber(breakEvenYears, 1)} years` : "Immediate" },
            { label: "EV net purchase price", value: `$${formatNumber(evPrice - credit)}` },
            { label: "Annual operating savings", value: `$${formatNumber((gasFuel + gasMaint) - (evFuel + evMaint))}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["ev-range-calculator", "ev-charging-cost-calculator", "fuel-cost-calculator"],
  faq: [
    { question: "How much do you save with an electric car?", answer: "EV owners typically save $800-$1,500 per year on fuel and $300-$500 on maintenance compared to gas cars. Over 10 years, total savings can reach $10,000-$20,000, depending on driving habits and energy costs." },
    { question: "When does an EV break even vs a gas car?", answer: "With federal tax credits, many EVs break even in 4-7 years. Without credits, it may take 6-10 years. Higher gas prices and lower electricity rates speed up the break-even point." },
  ],
  formula: "Annual Savings = (Miles / Gas MPG × Gas Price) - (Miles / EV Efficiency × Electricity Rate)",
};
