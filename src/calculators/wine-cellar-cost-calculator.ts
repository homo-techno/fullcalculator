import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const wineCellarCostCalculator: CalculatorDefinition = {
  slug: "wine-cellar-cost-calculator",
  title: "Wine Cellar Cost Calculator",
  description: "Estimate the cost to build a residential wine cellar including racking, climate control, and construction.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["wine cellar cost", "wine room cost", "wine storage cost"],
  variants: [{
    id: "standard",
    name: "Wine Cellar Cost",
    description: "Estimate the cost to build a residential wine cellar including racking, climate control, and construction",
    fields: [
      { name: "bottles", label: "Bottle Capacity", type: "number", suffix: "bottles", min: 50, max: 5000, defaultValue: 500 },
      { name: "racking", label: "Racking Material", type: "select", options: [{value:"metal",label:"Metal Racks"},{value:"wood",label:"Redwood/Mahogany"},{value:"custom",label:"Custom Cabinetry"}], defaultValue: "wood" },
      { name: "cooling", label: "Cooling System", type: "select", options: [{value:"selfcontained",label:"Self-Contained Unit"},{value:"split",label:"Split System"},{value:"ducted",label:"Ducted System"}], defaultValue: "split" },
      { name: "space", label: "Space Type", type: "select", options: [{value:"existing",label:"Existing Room/Closet"},{value:"basement",label:"Basement Conversion"},{value:"new",label:"New Construction"}], defaultValue: "basement" },
    ],
    calculate: (inputs) => {
      const bottles = inputs.bottles as number;
      const racking = inputs.racking as string;
      const cooling = inputs.cooling as string;
      const space = inputs.space as string;
      if (!bottles || bottles <= 0) return null;
      const rackRate: Record<string, number> = { metal: 2, wood: 5, custom: 12 };
      const coolingCost: Record<string, number> = { selfcontained: 1500, split: 3500, ducted: 6000 };
      const spaceCost: Record<string, number> = { existing: 2000, basement: 5000, new: 12000 };
      const rackCost = bottles * (rackRate[racking] || 5);
      const coolCost = coolingCost[cooling] || 3500;
      const construction = spaceCost[space] || 5000;
      const insulation = 1500;
      const door = 800;
      const lighting = 600;
      const total = rackCost + coolCost + construction + insulation + door + lighting;
      return {
        primary: { label: "Estimated Total Cost", value: "$" + formatNumber(total) },
        details: [
          { label: "Wine Racking", value: "$" + formatNumber(rackCost) },
          { label: "Cooling System", value: "$" + formatNumber(coolCost) },
          { label: "Construction", value: "$" + formatNumber(construction) },
          { label: "Insulation", value: "$" + formatNumber(insulation) },
          { label: "Door and Lighting", value: "$" + formatNumber(door + lighting) },
          { label: "Cost per Bottle Slot", value: "$" + formatNumber(total / bottles) },
        ],
      };
    },
  }],
  relatedSlugs: ["sunroom-cost-calculator", "carport-cost-calculator"],
  faq: [
    { question: "How much does a wine cellar cost?", answer: "A small wine closet conversion costs $5,000 to $15,000. A full basement wine cellar typically ranges from $15,000 to $50,000 depending on size and finishes." },
    { question: "What temperature should a wine cellar be?", answer: "A wine cellar should maintain 55 degrees Fahrenheit with 60-70 percent humidity for optimal long-term wine storage." },
  ],
  formula: "Total = (Bottles x Rack Rate) + Cooling + Construction + Insulation + Door + Lighting",
};
