import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const landClearingCostCalculator: CalculatorDefinition = {
  slug: "land-clearing-cost-calculator",
  title: "Land Clearing Cost Calculator",
  description: "Estimate land clearing costs per acre based on terrain type, vegetation density, and debris removal needs.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["land clearing cost", "lot clearing cost per acre", "brush clearing estimate"],
  variants: [{
    id: "standard",
    name: "Land Clearing Cost",
    description: "Estimate land clearing costs per acre based on terrain type, vegetation density, and debris removal needs",
    fields: [
      { name: "acres", label: "Acreage to Clear", type: "number", suffix: "acres", min: 0.1, max: 500, step: 0.1, defaultValue: 2 },
      { name: "terrain", label: "Terrain Type", type: "select", options: [{value:"flat",label:"Flat with Light Brush"},{value:"moderate",label:"Moderate Trees and Brush"},{value:"heavy",label:"Heavy Timber and Stumps"},{value:"rocky",label:"Rocky with Heavy Timber"}], defaultValue: "moderate" },
      { name: "debrisRemoval", label: "Debris Removal Method", type: "select", options: [{value:"burn",label:"On-site Burning"},{value:"haul",label:"Haul Away"},{value:"chip",label:"Chip and Mulch"}], defaultValue: "chip" },
    ],
    calculate: (inputs) => {
      const acres = inputs.acres as number;
      const terrain = inputs.terrain as string;
      const debris = inputs.debrisRemoval as string;
      if (!acres || acres <= 0) return null;
      const terrainCost: Record<string, number> = { flat: 1500, moderate: 3500, heavy: 6000, rocky: 8500 };
      const debrisCost: Record<string, number> = { burn: 200, haul: 1200, chip: 800 };
      const clearingCost = acres * (terrainCost[terrain] || 3500);
      const removalCost = acres * (debrisCost[debris] || 800);
      const totalCost = clearingCost + removalCost;
      const costPerAcre = totalCost / acres;
      return {
        primary: { label: "Total Clearing Cost", value: "$" + formatNumber(Math.round(totalCost)) },
        details: [
          { label: "Cost per Acre", value: "$" + formatNumber(Math.round(costPerAcre)) },
          { label: "Clearing Labor and Equipment", value: "$" + formatNumber(Math.round(clearingCost)) },
          { label: "Debris Removal Cost", value: "$" + formatNumber(Math.round(removalCost)) },
        ],
      };
    },
  }],
  relatedSlugs: ["well-drilling-cost-calculator", "septic-installation-cost-calculator"],
  faq: [
    { question: "How much does land clearing cost per acre?", answer: "Land clearing costs typically range from $1,500 per acre for flat land with light brush to over $8,000 per acre for heavily wooded or rocky terrain." },
    { question: "What is the cheapest way to clear land?", answer: "On-site burning is usually the least expensive debris removal method, but it requires a burn permit and is not allowed in all areas. Mulching is often the best balance of cost and environmental benefit." },
  ],
  formula: "Total Cost = (Acres x Terrain Cost per Acre) + (Acres x Debris Removal Cost per Acre)",
};
