import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const hurricanePrepCostCalculator: CalculatorDefinition = {
  slug: "hurricane-prep-cost-calculator",
  title: "Hurricane Prep Cost Calculator",
  description: "Estimate the cost of hurricane preparation including supplies, shutters, and emergency provisions.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["hurricane prep cost", "hurricane preparation", "storm preparation cost"],
  variants: [{
    id: "standard",
    name: "Hurricane Prep Cost",
    description: "Estimate the cost of hurricane preparation including supplies, shutters, and emergency provisions",
    fields: [
      { name: "homeSize", label: "Home Size", type: "number", suffix: "sq ft", min: 500, max: 20000, defaultValue: 2000 },
      { name: "occupants", label: "Number of Occupants", type: "number", min: 1, max: 12, defaultValue: 4 },
      { name: "protection", label: "Window Protection", type: "select", options: [{value:"plywood",label:"Plywood Boards"},{value:"shutters",label:"Storm Shutters"},{value:"impact",label:"Impact Windows"},{value:"none",label:"None"}], defaultValue: "shutters" },
      { name: "generator", label: "Generator", type: "select", options: [{value:"none",label:"None"},{value:"portable",label:"Portable Generator"},{value:"standby",label:"Standby Generator"}], defaultValue: "portable" },
    ],
    calculate: (inputs) => {
      const size = inputs.homeSize as number;
      const people = inputs.occupants as number;
      const protection = inputs.protection as string;
      const generator = inputs.generator as string;
      if (!size || !people) return null;
      const supplyKit = people * 75;
      const waterCost = people * 14 * 2;
      const foodCost = people * 10 * 7;
      const protectionCost: Record<string, number> = { plywood: size * 0.5, shutters: size * 3, impact: size * 15, none: 0 };
      const genCost: Record<string, number> = { none: 0, portable: 800, standby: 5000 };
      const windowCost = protectionCost[protection] || 0;
      const generatorCost = genCost[generator] || 0;
      const supplies = supplyKit + waterCost + foodCost;
      const total = Math.round(supplies + windowCost + generatorCost);
      return {
        primary: { label: "Total Prep Cost", value: "$" + formatNumber(total) },
        details: [
          { label: "Emergency Supplies", value: "$" + formatNumber(Math.round(supplies)) },
          { label: "Window Protection", value: "$" + formatNumber(Math.round(windowCost)) },
          { label: "Generator", value: generatorCost > 0 ? "$" + formatNumber(generatorCost) : "None" },
        ],
      };
    },
  }],
  relatedSlugs: ["flood-damage-calculator", "wildfire-prep-calculator"],
  faq: [
    { question: "How much does hurricane preparation cost?", answer: "Basic hurricane preparation costs $200-$500 for supplies. Adding storm shutters and a generator can bring total costs to $2,000-$10,000 or more." },
    { question: "What supplies do I need for a hurricane?", answer: "Essential supplies include water (1 gallon per person per day for 14 days), non-perishable food, flashlights, batteries, first aid kit, and important documents." },
  ],
  formula: "Total = Emergency Supplies + Window Protection + Generator Cost",
};
