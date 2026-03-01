import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const wellDrillingCostCalculator: CalculatorDefinition = {
  slug: "well-drilling-cost-calculator",
  title: "Well Drilling Cost Calculator",
  description: "Estimate the total cost of drilling a residential water well based on depth, diameter, and pump requirements.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["well drilling cost", "water well cost", "well installation estimate"],
  variants: [{
    id: "standard",
    name: "Well Drilling Cost",
    description: "Estimate the total cost of drilling a residential water well based on depth, diameter, and pump requirements",
    fields: [
      { name: "depth", label: "Estimated Well Depth", type: "number", suffix: "feet", min: 25, max: 1000, step: 25, defaultValue: 200 },
      { name: "diameter", label: "Well Diameter", type: "select", options: [{value:"4",label:"4 inches (residential)"},{value:"6",label:"6 inches (standard)"},{value:"8",label:"8 inches (high capacity)"}], defaultValue: "6" },
      { name: "pumpType", label: "Pump Type", type: "select", options: [{value:"submersible",label:"Submersible Pump"},{value:"jet",label:"Jet Pump"},{value:"hand",label:"Hand Pump"}], defaultValue: "submersible" },
    ],
    calculate: (inputs) => {
      const depth = inputs.depth as number;
      const diameter = inputs.diameter as string;
      const pumpType = inputs.pumpType as string;
      if (!depth || depth <= 0) return null;
      const costPerFoot: Record<string, number> = { "4": 25, "6": 35, "8": 50 };
      const pumpCost: Record<string, number> = { submersible: 2500, jet: 1500, hand: 500 };
      const drillingCost = depth * (costPerFoot[diameter] || 35);
      const pump = pumpCost[pumpType] || 2500;
      const casing = depth * 10;
      const permits = 500;
      const totalCost = drillingCost + pump + casing + permits;
      return {
        primary: { label: "Total Well Installation Cost", value: "$" + formatNumber(Math.round(totalCost)) },
        details: [
          { label: "Drilling Cost", value: "$" + formatNumber(Math.round(drillingCost)) },
          { label: "Pump and Installation", value: "$" + formatNumber(Math.round(pump)) },
          { label: "Casing and Permits", value: "$" + formatNumber(Math.round(casing + permits)) },
        ],
      };
    },
  }],
  relatedSlugs: ["septic-installation-cost-calculator", "land-clearing-cost-calculator"],
  faq: [
    { question: "How much does it cost to drill a well?", answer: "Residential well drilling typically costs between $5,000 and $15,000, with most homeowners paying around $25 to $50 per foot of depth for drilling alone." },
    { question: "How deep does a residential well need to be?", answer: "Residential wells typically range from 100 to 400 feet deep, depending on the local water table depth. Some areas may require depths of 500 feet or more." },
  ],
  formula: "Total Cost = (Depth x Cost per Foot) + Pump Cost + (Depth x Casing Cost) + Permits",
};
