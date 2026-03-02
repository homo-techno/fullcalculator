import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const farmBreakEvenPriceCalculator: CalculatorDefinition = {
  slug: "farm-break-even-price-calculator",
  title: "Farm Break-Even Price Calculator",
  description: "Calculate the minimum commodity price needed to cover all production costs and return a profit on your farm operation.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["break even price","farm breakeven calculator","cost of production calculator"],
  variants: [{
    id: "standard",
    name: "Farm Break-Even Price",
    description: "Calculate the minimum commodity price needed to cover all production costs and return a profit on your farm operation.",
    fields: [
      { name: "totalAcres", label: "Total Planted Acres", type: "number", min: 1, max: 100000, defaultValue: 500 },
      { name: "expectedYield", label: "Expected Yield (bushels/acre)", type: "number", min: 10, max: 500, defaultValue: 180 },
      { name: "variableCost", label: "Variable Cost ($/acre)", type: "number", min: 50, max: 2000, defaultValue: 450 },
      { name: "fixedCost", label: "Fixed Cost ($/acre)", type: "number", min: 50, max: 1000, defaultValue: 200 },
      { name: "targetProfit", label: "Target Profit ($/acre)", type: "number", min: 0, max: 1000, defaultValue: 100 },
    ],
    calculate: (inputs) => {
      const ac = inputs.totalAcres as number;
      const ey = inputs.expectedYield as number;
      const vc = inputs.variableCost as number;
      const fc = inputs.fixedCost as number;
      const tp = inputs.targetProfit as number;
      if (!ac || !ey || !vc || !fc) return null;
      var totalCostPerAcre = vc + fc;
      var breakEvenPrice = Math.round(totalCostPerAcre / ey * 100) / 100;
      var targetPrice = Math.round((totalCostPerAcre + tp) / ey * 100) / 100;
      var totalCost = Math.round(totalCostPerAcre * ac);
      var totalBushels = ey * ac;
      var totalTargetRevenue = Math.round(targetPrice * totalBushels);
      return {
        primary: { label: "Break-Even Price", value: "$" + formatNumber(breakEvenPrice) + "/bu" },
        details: [
          { label: "Target Price (with profit)", value: "$" + formatNumber(targetPrice) + "/bu" },
          { label: "Total Cost Per Acre", value: "$" + formatNumber(totalCostPerAcre) },
          { label: "Total Production Cost", value: "$" + formatNumber(totalCost) },
          { label: "Total Bushels", value: formatNumber(totalBushels) },
          { label: "Revenue Needed at Target", value: "$" + formatNumber(totalTargetRevenue) },
        ],
      };
  },
  }],
  relatedSlugs: ["farm-profit-margin-calculator","crop-yield-calculator"],
  faq: [
    { question: "What costs go into break-even calculations?", answer: "Variable costs include seed, fertilizer, chemicals, fuel, crop insurance, and drying. Fixed costs include land rent or mortgage payments, depreciation, insurance, and taxes. Both must be covered to break even." },
    { question: "How does yield affect break-even price?", answer: "Higher yields lower the break-even price because fixed costs are spread over more bushels. A 10% yield increase can reduce break-even price by roughly 9%, making yield management critical." },
  ],
  formula: "Break-Even Price = (Variable Cost + Fixed Cost) / Expected Yield
Target Price = (Total Cost + Target Profit) / Yield
Total Cost = Cost Per Acre x Acres",
};
