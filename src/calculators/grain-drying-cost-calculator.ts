import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const grainDryingCostCalculator: CalculatorDefinition = {
  slug: "grain-drying-cost-calculator",
  title: "Grain Drying Cost Calculator",
  description: "Estimate the cost of drying grain based on initial and target moisture content, fuel type, and grain volume.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["grain drying cost","corn drying calculator","grain dryer fuel cost"],
  variants: [{
    id: "standard",
    name: "Grain Drying Cost",
    description: "Estimate the cost of drying grain based on initial and target moisture content, fuel type, and grain volume.",
    fields: [
      { name: "bushels", label: "Bushels to Dry", type: "number", min: 100, max: 5000000, defaultValue: 50000 },
      { name: "initialMoisture", label: "Initial Moisture (%)", type: "number", min: 14, max: 35, defaultValue: 22 },
      { name: "targetMoisture", label: "Target Moisture (%)", type: "number", min: 10, max: 18, defaultValue: 15 },
      { name: "fuelType", label: "Fuel Type", type: "select", options: [{ value: "1", label: "Propane" }, { value: "2", label: "Natural Gas" }], defaultValue: "1" },
      { name: "fuelPrice", label: "Fuel Price ($/gallon or $/therm)", type: "number", min: 0.5, max: 10, defaultValue: 2.5 },
    ],
    calculate: (inputs) => {
      const bu = inputs.bushels as number;
      const im = inputs.initialMoisture as number;
      const tm = inputs.targetMoisture as number;
      const ft = inputs.fuelType as number;
      const fp = inputs.fuelPrice as number;
      if (!bu || !im || !tm || !fp || im <= tm) return null;
      var pointsToRemove = im - tm;
      var btuPerPointPerBu = ft == 1 ? 2200 : 2000;
      var totalBtu = bu * pointsToRemove * btuPerPointPerBu;
      var fuelUnits = ft == 1 ? Math.round(totalBtu / 91500) : Math.round(totalBtu / 100000);
      var fuelCost = Math.round(fuelUnits * fp * 100) / 100;
      var electricCost = Math.round(bu * pointsToRemove * 0.005 * 100) / 100;
      var totalCost = Math.round((fuelCost + electricCost) * 100) / 100;
      var costPerBu = Math.round(totalCost / bu * 1000) / 1000;
      var costPerPoint = Math.round(costPerBu / pointsToRemove * 1000) / 1000;
      var shrinkPct = Math.round(pointsToRemove * 1.183 * 100) / 100;
      return {
        primary: { label: "Total Drying Cost", value: "$" + formatNumber(totalCost) },
        details: [
          { label: "Cost Per Bushel", value: "$" + formatNumber(costPerBu) },
          { label: "Cost Per Point Removed", value: "$" + formatNumber(costPerPoint) + "/bu" },
          { label: "Fuel Cost", value: "$" + formatNumber(fuelCost) },
          { label: "Moisture Points Removed", value: formatNumber(pointsToRemove) },
          { label: "Shrink Factor", value: formatNumber(shrinkPct) + "%" },
        ],
      };
  },
  }],
  relatedSlugs: ["grain-storage-moisture-calculator","grain-bin-capacity-calculator"],
  faq: [
    { question: "How much does it cost to dry corn per bushel?", answer: "Drying corn typically costs $0.03 to $0.06 per bushel per point of moisture removed. Drying from 22% to 15% (7 points) costs roughly $0.21 to $0.42 per bushel depending on fuel prices." },
    { question: "What is grain shrink?", answer: "Shrink is the weight loss that occurs during drying. For every 1 point of moisture removed, approximately 1.183% of weight is lost. This reduces the number of marketable bushels." },
  ],
  formula: "BTU Needed = Bushels x Points x BTU Per Point Per Bushel
Fuel Gallons = Total BTU / 91,500 (propane)
Shrink = Points Removed x 1.183%",
};
