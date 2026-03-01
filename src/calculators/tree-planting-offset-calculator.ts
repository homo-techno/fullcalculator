import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const treePlantingOffsetCalculator: CalculatorDefinition = {
  slug: "tree-planting-offset-calculator",
  title: "Tree Planting Offset Calculator",
  description: "Calculate the number of trees needed to offset your annual carbon dioxide emissions.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["tree carbon offset","trees to offset CO2","tree planting calculator"],
  variants: [{
    id: "standard",
    name: "Tree Planting Offset",
    description: "Calculate the number of trees needed to offset your annual carbon dioxide emissions.",
    fields: [
      { name: "annualCO2Tons", label: "Annual CO2 Emissions (metric tons)", type: "number", min: 0.1, max: 500, defaultValue: 16 },
      { name: "yearsToOffset", label: "Years to Achieve Offset", type: "number", min: 1, max: 50, defaultValue: 10 },
      { name: "costPerTree", label: "Cost Per Tree Planted", type: "number", prefix: "$", min: 0.5, max: 100, defaultValue: 5 },
    ],
    calculate: (inputs) => {
      const co2 = inputs.annualCO2Tons as number;
      const years = inputs.yearsToOffset as number;
      const costPerTree = inputs.costPerTree as number;
      if (!co2 || !years) return null;
      const co2Lbs = co2 * 2204.62;
      const lbsPerTreePerYear = 48;
      const totalCO2ToOffset = co2Lbs * years;
      const treesNeeded = Math.ceil(totalCO2ToOffset / (lbsPerTreePerYear * years));
      const totalCost = treesNeeded * costPerTree;
      return {
        primary: { label: "Trees Needed", value: formatNumber(treesNeeded) },
        details: [
          { label: "Total CO2 to Offset", value: formatNumber(Math.round(co2 * years)) + " metric tons" },
          { label: "CO2 Absorbed Per Tree/Year", value: "48 lbs" },
          { label: "Total Planting Cost", value: "$" + formatNumber(Math.round(totalCost)) },
          { label: "Cost Per Ton Offset", value: "$" + formatNumber(Math.round(totalCost / (co2 * years))) },
        ],
      };
    },
  }],
  relatedSlugs: ["carbon-footprint-calculator","composting-savings-calculator"],
  faq: [
    { question: "How much CO2 does one tree absorb per year?", answer: "A mature tree absorbs approximately 48 pounds (22 kg) of CO2 per year. Younger trees absorb less, while large mature trees in tropical regions can absorb significantly more." },
    { question: "Is tree planting enough to offset carbon emissions?", answer: "Tree planting is a valuable part of carbon offset strategies but should be combined with emission reductions. Trees take years to reach full absorption capacity, and planting alone cannot offset all human emissions." },
  ],
  formula: "Trees Needed = (Annual CO2 in lbs) / (48 lbs absorbed per tree per year); Total Cost = Trees Needed x Cost Per Tree",
};
