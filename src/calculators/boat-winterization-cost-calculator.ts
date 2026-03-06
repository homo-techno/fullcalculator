import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const boatWinterizationCostCalculator: CalculatorDefinition = {
  slug: "boat-winterization-cost-calculator",
  title: "Boat Winterization Cost Calculator",
  description: "Estimate the cost to winterize your boat based on engine type, number of engines, and whether you choose professional or DIY service.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["boat winterization cost","winterize boat","boat winter storage","boat seasonal maintenance"],
  variants: [{
    id: "standard",
    name: "Boat Winterization Cost",
    description: "Estimate the cost to winterize your boat based on engine type, number of engines, and whether you choose professional or DIY service.",
    fields: [
      { name: "engineType", label: "Engine Type", type: "select", options: [{ value: "1", label: "Outboard" }, { value: "2", label: "Inboard/Stern Drive" }, { value: "3", label: "Inboard Diesel" }], defaultValue: "1" },
      { name: "numEngines", label: "Number of Engines", type: "number", min: 1, max: 4, defaultValue: 1 },
      { name: "serviceType", label: "Service Type", type: "select", options: [{ value: "1.0", label: "DIY" }, { value: "2.5", label: "Professional" }], defaultValue: "2.5" },
      { name: "boatLength", label: "Boat Length (feet)", type: "number", min: 12, max: 100, defaultValue: 24 },
      { name: "shrinkWrap", label: "Shrink Wrap", type: "select", options: [{ value: "0", label: "No" }, { value: "1", label: "Yes" }], defaultValue: "1" },
    ],
    calculate: (inputs) => {
    const engineType = parseInt(inputs.engineType as string);
    const numEngines = inputs.numEngines as number;
    const serviceMult = parseFloat(inputs.serviceType as string);
    const length = inputs.boatLength as number;
    const wrap = parseInt(inputs.shrinkWrap as string);
    const engineCosts = [150, 250, 350];
    const baseCost = engineCosts[engineType - 1] * numEngines;
    const fuelStabilizer = 15;
    const antifreeze = 25 * numEngines;
    const oilChange = (engineType === 1 ? 40 : 80) * numEngines;
    const wrapCost = wrap === 1 ? length * 12 : 0;
    const materialCost = baseCost + fuelStabilizer + antifreeze + oilChange;
    const totalCost = materialCost * serviceMult + wrapCost;
    return {
      primary: { label: "Total Winterization Cost", value: "$" + formatNumber(Math.round(totalCost)) },
      details: [
        { label: "Engine Service", value: "$" + formatNumber(Math.round(baseCost * serviceMult)) },
        { label: "Oil Change", value: "$" + formatNumber(Math.round(oilChange * serviceMult)) },
        { label: "Antifreeze and Stabilizer", value: "$" + formatNumber(Math.round((antifreeze + fuelStabilizer) * serviceMult)) },
        { label: "Shrink Wrap", value: wrapCost > 0 ? "$" + formatNumber(Math.round(wrapCost)) : "None" },
        { label: "Service Type", value: serviceMult > 1 ? "Professional" : "DIY" }
      ]
    };
  },
  }],
  relatedSlugs: ["boat-engine-hours-maintenance-calculator","marina-slip-cost-calculator"],
  faq: [
    { question: "When should I winterize my boat?", answer: "Winterize your boat before the first hard freeze, typically in October or November depending on your region. Engine damage from frozen water can be extremely costly to repair." },
    { question: "What does boat winterization include?", answer: "Winterization includes draining and flushing the cooling system, fogging the engine, changing oil and filters, adding fuel stabilizer, draining water systems, disconnecting batteries, and covering or shrink-wrapping the boat." },
    { question: "Can I winterize my boat myself?", answer: "Yes, DIY winterization is possible with basic mechanical skills. You will need antifreeze, fogging oil, fuel stabilizer, and oil change supplies. Outboard engines are the easiest to winterize yourself." },
  ],
  formula: "Engine Service Cost = Base Cost per Engine x Number of Engines
Material Cost = Engine Service + Fuel Stabilizer + Antifreeze + Oil Change
Total Cost = Material Cost x Service Multiplier + Shrink Wrap Cost",
};
