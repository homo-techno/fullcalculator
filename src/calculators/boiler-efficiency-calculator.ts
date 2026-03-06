import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const boilerEfficiencyCalculator: CalculatorDefinition = {
  slug: "boiler-efficiency-calculator",
  title: "Boiler Efficiency Calculator",
  description: "Calculate boiler operating efficiency by comparing fuel input energy to useful heat output, accounting for stack losses, radiation losses, and combustion efficiency.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["boiler efficiency","combustion efficiency calculator","boiler performance","heating efficiency"],
  variants: [{
    id: "standard",
    name: "Boiler Efficiency",
    description: "Calculate boiler operating efficiency by comparing fuel input energy to useful heat output, accounting for stack losses, radiation losses, and combustion efficiency.",
    fields: [
      { name: "fuelInput", label: "Fuel Input (BTU/hr)", type: "number", min: 10000, max: 5000000, defaultValue: 100000 },
      { name: "steamOutput", label: "Useful Heat Output (BTU/hr)", type: "number", min: 5000, max: 5000000, defaultValue: 82000 },
      { name: "stackTemp", label: "Stack Temperature (F)", type: "number", min: 200, max: 800, defaultValue: 350 },
      { name: "fuelType", label: "Fuel Type", type: "select", options: [{ value: "1", label: "Natural Gas" }, { value: "2", label: "Propane" }, { value: "3", label: "Fuel Oil #2" }, { value: "4", label: "Electric" }], defaultValue: "1" },
    ],
    calculate: (inputs) => {
    const fuelInput = inputs.fuelInput as number;
    const heatOutput = inputs.steamOutput as number;
    const stackTemp = inputs.stackTemp as number;
    const fuelType = parseInt(inputs.fuelType as string);
    const combustionEff = fuelType === 4 ? 100 : Math.max(70, 100 - (stackTemp - 300) * 0.05);
    const grossEff = (heatOutput / fuelInput) * 100;
    const radiationLoss = fuelInput * 0.02;
    const stackLoss = fuelInput * (1 - grossEff / 100) * 0.7;
    const netEff = grossEff * 0.98;
    const fuelCostPerMBTU = { 1: 10, 2: 25, 3: 20, 4: 30 };
    const annualFuelCost = (fuelInput / 1000000) * (fuelCostPerMBTU[fuelType] || 10) * 2000;
    const savingsIfUpgrade = annualFuelCost * (1 - grossEff / 95);
    return {
      primary: { label: "Gross Efficiency", value: formatNumber(Math.round(grossEff * 10) / 10) + "%" },
      details: [
        { label: "Net Efficiency", value: formatNumber(Math.round(netEff * 10) / 10) + "%" },
        { label: "Combustion Efficiency", value: formatNumber(Math.round(combustionEff * 10) / 10) + "%" },
        { label: "Estimated Annual Fuel Cost", value: "$" + formatNumber(Math.round(annualFuelCost)) },
        { label: "Savings if Upgraded to 95%", value: "$" + formatNumber(Math.round(Math.abs(savingsIfUpgrade))) + "/yr" }
      ]
    };
  },
  }],
  relatedSlugs: ["heat-pump-cop-calculator","btu-heating-calculator"],
  faq: [
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
  ],
  formula: "Gross Efficiency = (Heat Output / Fuel Input) x 100; Net Efficiency = Gross Efficiency x 0.98 (radiation loss); Combustion Efficiency = 100 - (Stack Temp - 300) x 0.05; Annual Cost = (Input / 1M BTU) x Fuel Cost x Operating Hours",
};
