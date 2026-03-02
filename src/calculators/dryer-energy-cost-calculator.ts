import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const dryerEnergyCostCalculator: CalculatorDefinition = {
  slug: "dryer-energy-cost-calculator",
  title: "Dryer Energy Cost Calculator",
  description: "Calculate dryer electricity cost per load.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["dryer","energy","cost","electricity"],
  variants: [{
    id: "standard",
    name: "Dryer Energy Cost",
    description: "Calculate dryer electricity cost per load.",
    fields: [
      { name: "wattage", label: "Dryer Wattage", type: "number", min: 1000, max: 6000, defaultValue: 3000 },
      { name: "dryTime", label: "Dry Time (minutes)", type: "number", min: 20, max: 90, defaultValue: 50 },
      { name: "costPerKwh", label: "Electricity Rate ($/kWh)", type: "number", min: 0.05, max: 0.5, defaultValue: 0.13 },
      { name: "loadsPerWeek", label: "Loads Per Week", type: "number", min: 1, max: 20, defaultValue: 5 },
    ],
    calculate: (inputs) => {
    const wattage = inputs.wattage as number;
    const dryTime = inputs.dryTime as number;
    const costPerKwh = inputs.costPerKwh as number;
    const loadsPerWeek = inputs.loadsPerWeek as number;
    const kwhPerLoad = (wattage / 1000) * (dryTime / 60);
    const costPerLoad = kwhPerLoad * costPerKwh;
    const monthlyCost = costPerLoad * loadsPerWeek * 4.33;
    const yearlyCost = monthlyCost * 12;
    return { primary: { label: "Cost Per Dryer Load", value: "$" + costPerLoad.toFixed(2) }, details: [{ label: "kWh Per Load", value: kwhPerLoad.toFixed(2) + " kWh" }, { label: "Monthly Dryer Cost", value: "$" + formatNumber(monthlyCost) }, { label: "Annual Dryer Cost", value: "$" + formatNumber(yearlyCost) }] };
  },
  }],
  relatedSlugs: ["laundry-cost-calculator","clothesline-savings-calculator","laundry-load-calculator"],
  faq: [
    { question: "How much electricity does a dryer use?", answer: "About 2 to 5 kWh per load depending on the model." },
    { question: "Are gas dryers cheaper to run?", answer: "Yes, gas dryers typically cost less per load than electric." },
    { question: "How can I reduce dryer energy costs?", answer: "Clean the lint filter and use dryer balls." },
  ],
  formula: "CostPerLoad = (Wattage / 1000) * (Minutes / 60) * Rate",
};
