import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const dishwasherCycleCostCalculator: CalculatorDefinition = {
  slug: "dishwasher-cycle-cost-calculator",
  title: "Dishwasher Cycle Cost Calculator",
  description: "Calculate the cost per cycle and monthly operating cost of a commercial dishwasher including water, electricity, detergent, and rinse aid consumption.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["dishwasher cycle cost","commercial dishwasher cost","warewashing cost","dish machine operating cost"],
  variants: [{
    id: "standard",
    name: "Dishwasher Cycle Cost",
    description: "Calculate the cost per cycle and monthly operating cost of a commercial dishwasher including water, electricity, detergent, and rinse aid consumption.",
    fields: [
      { name: "machineType", label: "Machine Type", type: "select", options: [{ value: "1", label: "Under-counter (1 gal/cycle)" }, { value: "2", label: "Door-Type (2 gal/cycle)" }, { value: "3", label: "Conveyor (3.5 gal/cycle)" }, { value: "4", label: "Flight-Type (5 gal/cycle)" }], defaultValue: "2" },
      { name: "cyclesPerDay", label: "Cycles Per Day", type: "number", min: 5, max: 500, defaultValue: 40 },
      { name: "waterCost", label: "Water Cost Per 1000 Gallons ($)", type: "number", min: 1, max: 30, defaultValue: 8 },
      { name: "electricityRate", label: "Electricity Rate ($/kWh)", type: "number", min: 0.05, max: 0.50, defaultValue: 0.14 },
      { name: "detergentPerCycle", label: "Detergent Cost Per Cycle ($)", type: "number", min: 0.01, max: 2, defaultValue: 0.12 },
      { name: "daysPerMonth", label: "Operating Days Per Month", type: "number", min: 15, max: 31, defaultValue: 26 },
    ],
    calculate: (inputs) => {
    const machine = parseInt(inputs.machineType as string);
    const cycles = inputs.cyclesPerDay as number;
    const waterRate = inputs.waterCost as number;
    const elecRate = inputs.electricityRate as number;
    const detergent = inputs.detergentPerCycle as number;
    const days = inputs.daysPerMonth as number;
    const galPerCycle = { 1: 1, 2: 2, 3: 3.5, 4: 5 };
    const kwhPerCycle = { 1: 1.2, 2: 2.0, 3: 3.5, 4: 5.5 };
    const water = galPerCycle[machine] || 2;
    const kwh = kwhPerCycle[machine] || 2;
    const waterCostPerCycle = (water / 1000) * waterRate;
    const elecCostPerCycle = kwh * elecRate;
    const costPerCycle = waterCostPerCycle + elecCostPerCycle + detergent;
    const dailyCost = costPerCycle * cycles;
    const monthlyCost = dailyCost * days;
    const annualCost = monthlyCost * 12;
    return {
      primary: { label: "Cost Per Cycle", value: "$" + formatNumber(Math.round(costPerCycle * 1000) / 1000) },
      details: [
        { label: "Water Cost Per Cycle", value: "$" + formatNumber(Math.round(waterCostPerCycle * 1000) / 1000) },
        { label: "Electricity Per Cycle", value: "$" + formatNumber(Math.round(elecCostPerCycle * 1000) / 1000) },
        { label: "Daily Operating Cost", value: "$" + formatNumber(Math.round(dailyCost * 100) / 100) },
        { label: "Monthly Operating Cost", value: "$" + formatNumber(Math.round(monthlyCost)) },
        { label: "Annual Operating Cost", value: "$" + formatNumber(Math.round(annualCost)) }
      ]
    };
  },
  }],
  relatedSlugs: ["kitchen-equipment-cost-calculator","food-waste-cost-calculator"],
  faq: [
    { question: "How much does it cost to run a commercial dishwasher?", answer: "A commercial door-type dishwasher costs approximately $0.35 to $0.60 per cycle including water, electricity, and chemicals. Running 40 cycles per day costs roughly $15 to $25 daily or $400 to $650 per month." },
    { question: "Which type of commercial dishwasher is most efficient?", answer: "Modern door-type dishwashers with heat recovery and energy-star ratings are the most efficient for mid-volume operations. Conveyor machines are more efficient per rack for high-volume operations exceeding 150 racks per hour." },
    { question: "How can I reduce dishwasher operating costs?", answer: "Scrape plates properly before loading, run full racks only, maintain proper water temperature, use correct detergent dosing, clean machine daily, and install a heat recovery system to preheat incoming water with exhaust heat." },
  ],
  formula: "Cost Per Cycle = Water Cost + Electricity Cost + Detergent Cost
Water Cost = (Gallons/Cycle / 1000) x Water Rate
Monthly Cost = Cost Per Cycle x Cycles/Day x Operating Days",
};
