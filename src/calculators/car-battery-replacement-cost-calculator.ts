import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const carBatteryReplacementCostCalculator: CalculatorDefinition = {
  slug: "car-battery-replacement-cost-calculator",
  title: "Car Battery Replacement Cost Calculator",
  description: "Estimate battery replacement cost and remaining battery life based on battery type, climate, and vehicle usage patterns.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["car battery cost","battery replacement","auto battery life","car battery calculator"],
  variants: [{
    id: "standard",
    name: "Car Battery Replacement Cost",
    description: "Estimate battery replacement cost and remaining battery life based on battery type, climate, and vehicle usage patterns.",
    fields: [
      { name: "batteryType", label: "Battery Type", type: "select", options: [{ value: "1", label: "Standard Lead-Acid ($100-150)" }, { value: "2", label: "AGM ($200-300)" }, { value: "3", label: "Enhanced Flooded ($150-200)" }, { value: "4", label: "Lithium (Starter) ($250-400)" }], defaultValue: "1" },
      { name: "batteryAge", label: "Battery Age (years)", type: "number", min: 0, max: 10, defaultValue: 3 },
      { name: "climate", label: "Climate", type: "select", options: [{ value: "1", label: "Mild" }, { value: "2", label: "Hot (over 90F summers)" }, { value: "3", label: "Cold (below 20F winters)" }, { value: "4", label: "Extreme (both hot and cold)" }], defaultValue: "1" },
      { name: "installationType", label: "Installation", type: "select", options: [{ value: "1", label: "DIY" }, { value: "2", label: "Shop Install ($30-50)" }, { value: "3", label: "Dealer Install ($75-125)" }], defaultValue: "2" },
    ],
    calculate: (inputs) => {
    const batteryType = parseInt(inputs.batteryType as string);
    const age = inputs.batteryAge as number;
    const climate = parseInt(inputs.climate as string);
    const install = parseInt(inputs.installationType as string);
    const batteryCosts = { 1: 125, 2: 250, 3: 175, 4: 325 };
    const baseLife = { 1: 4, 2: 6, 3: 5, 4: 8 };
    const climateMultiplier = { 1: 1.0, 2: 0.75, 3: 0.85, 4: 0.65 };
    const installCosts = { 1: 0, 2: 40, 3: 100 };
    const batteryCost = batteryCosts[batteryType] || 125;
    const expectedLife = Math.round((baseLife[batteryType] || 4) * (climateMultiplier[climate] || 1) * 10) / 10;
    const installCost = installCosts[install] || 0;
    const totalCost = batteryCost + installCost;
    const remainingLife = Math.max(expectedLife - age, 0);
    const costPerYear = Math.round(totalCost / expectedLife * 100) / 100;
    return {
      primary: { label: "Total Replacement Cost", value: "$" + formatNumber(totalCost) },
      details: [
        { label: "Battery Cost", value: "$" + formatNumber(batteryCost) },
        { label: "Installation Cost", value: "$" + formatNumber(installCost) },
        { label: "Expected Battery Life", value: formatNumber(expectedLife) + " years" },
        { label: "Estimated Remaining Life", value: formatNumber(Math.round(remainingLife * 10) / 10) + " years" },
        { label: "Cost Per Year", value: "$" + formatNumber(Math.round(costPerYear)) }
      ]
    };
  },
  }],
  relatedSlugs: ["car-annual-maintenance-cost-calculator","spark-plug-replacement-calculator"],
  faq: [
    { question: "How long do car batteries last?", answer: "Standard lead-acid batteries last 3 to 5 years, AGM batteries last 5 to 7 years, and lithium starter batteries can last 8 to 10 years. Hot climates significantly shorten battery life." },
    { question: "What are signs of a dying battery?", answer: "Slow cranking, dim headlights, electrical issues, a swollen battery case, a sulfur smell, and needing frequent jump-starts are all signs your battery is failing." },
    { question: "Should I choose AGM over standard?", answer: "AGM batteries are better for vehicles with start-stop technology, high electrical demands, or extreme climates. They cost more but last longer and handle deep discharges better." },
  ],
  formula: "Total Cost = Battery Cost + Installation Cost; Expected Life = Base Life (by type) x Climate Multiplier; Remaining Life = Expected Life - Current Age",
};
