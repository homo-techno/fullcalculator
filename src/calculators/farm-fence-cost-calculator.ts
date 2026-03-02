import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const farmFenceCostCalculator: CalculatorDefinition = {
  slug: "farm-fence-cost-calculator",
  title: "Farm Fence Cost Calculator",
  description: "Estimate the total cost of fencing a farm area including materials, posts, gates, and labor for various fence types.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["farm fence cost","fencing calculator","pasture fence estimate"],
  variants: [{
    id: "standard",
    name: "Farm Fence Cost",
    description: "Estimate the total cost of fencing a farm area including materials, posts, gates, and labor for various fence types.",
    fields: [
      { name: "fenceType", label: "Fence Type", type: "select", options: [{ value: "1", label: "Barbed Wire (4-strand)" }, { value: "2", label: "Woven Wire" }, { value: "3", label: "Electric (3-wire)" }, { value: "4", label: "Board Fence" }], defaultValue: "1" },
      { name: "perimeter", label: "Total Length (feet)", type: "number", min: 100, max: 100000, defaultValue: 5280 },
      { name: "postSpacing", label: "Post Spacing (feet)", type: "number", min: 6, max: 30, defaultValue: 12 },
      { name: "numGates", label: "Number of Gates", type: "number", min: 0, max: 50, defaultValue: 4 },
      { name: "laborRate", label: "Labor Rate ($/hour)", type: "number", min: 0, max: 100, defaultValue: 20 },
    ],
    calculate: (inputs) => {
      const ft = inputs.fenceType as number;
      const per = inputs.perimeter as number;
      const ps = inputs.postSpacing as number;
      const ng = inputs.numGates as number;
      const lr = inputs.laborRate as number;
      if (!per || !ps) return null;
      var matCostPerFt = 0;
      if (ft == 1) matCostPerFt = 1.5;
      else if (ft == 2) matCostPerFt = 3.0;
      else if (ft == 3) matCostPerFt = 0.75;
      else matCostPerFt = 8.0;
      var numPosts = Math.ceil(per / ps) + 1;
      var postCost = ft == 4 ? 15 : 8;
      var materialCost = Math.round(per * matCostPerFt + numPosts * postCost);
      var gateCost = ng * 250;
      var ftPerHour = ft == 4 ? 15 : 30;
      var laborHours = Math.round(per / ftPerHour);
      var laborCost = Math.round(laborHours * lr);
      var totalCost = materialCost + gateCost + laborCost;
      var costPerFoot = Math.round(totalCost / per * 100) / 100;
      return {
        primary: { label: "Total Fence Cost", value: "$" + formatNumber(totalCost) },
        details: [
          { label: "Material Cost", value: "$" + formatNumber(materialCost) },
          { label: "Gate Cost", value: "$" + formatNumber(gateCost) },
          { label: "Labor Cost", value: "$" + formatNumber(laborCost) },
          { label: "Cost Per Foot", value: "$" + formatNumber(costPerFoot) },
          { label: "Number of Posts", value: formatNumber(numPosts) },
        ],
      };
  },
  }],
  relatedSlugs: ["fence-material-calculator","pasture-stocking-rate-calculator"],
  faq: [
    { question: "What is the cheapest farm fence?", answer: "Electric fencing is typically the cheapest option at $0.50 to $1.50 per foot installed. Barbed wire runs $1.50 to $3.00, woven wire $3.00 to $6.00, and board fence $8.00 to $15.00 per foot." },
    { question: "How far apart should fence posts be?", answer: "Standard post spacing is 8 to 12 feet for most wire fences. Electric fence can use 20 to 30 foot spacing. Board fence posts are typically 8 feet apart. Corner and gate posts should be braced." },
  ],
  formula: "Material Cost = Length x Cost Per Foot + Posts x Post Cost
Labor Cost = (Length / Feet Per Hour) x Labor Rate
Total = Materials + Gates + Labor",
};
