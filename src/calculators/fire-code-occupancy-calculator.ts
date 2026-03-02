import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const fireCodeOccupancyCalculator: CalculatorDefinition = {
  slug: "fire-code-occupancy-calculator",
  title: "Fire Code Occupancy Calculator",
  description: "Calculate maximum occupancy per fire code standards.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["fire code occupancy","max occupancy calculator"],
  variants: [{
    id: "standard",
    name: "Fire Code Occupancy",
    description: "Calculate maximum occupancy per fire code standards.",
    fields: [
      { name: "sqft", label: "Floor Area (sq ft)", type: "number", min: 100, max: 500000, defaultValue: 2000 },
      { name: "useType", label: "Occupancy Type", type: "select", options: [{ value: "7", label: "Assembly (standing) - 7 sqft" }, { value: "15", label: "Assembly (seating) - 15 sqft" }, { value: "100", label: "Business/Office - 100 sqft" }, { value: "200", label: "Industrial - 200 sqft" }, { value: "50", label: "Mercantile - 50 sqft" }], defaultValue: "15" },
      { name: "exits", label: "Number of Exits", type: "number", min: 1, max: 10, defaultValue: 2 },
    ],
    calculate: (inputs) => {
      const sqft = inputs.sqft as number;
      const factor = Number(inputs.useType as number);
      const exits = inputs.exits as number;
      if (!sqft || !factor || !exits) return null;
      const maxByArea = Math.floor(sqft / factor);
      const maxByExit = exits * 250;
      const maxOccupancy = Math.min(maxByArea, maxByExit);
      return {
        primary: { label: "Maximum Occupancy", value: formatNumber(maxOccupancy) },
        details: [
          { label: "By Floor Area", value: formatNumber(maxByArea) + " persons" },
          { label: "By Exit Capacity", value: formatNumber(maxByExit) + " persons" },
          { label: "Load Factor Used", value: formatNumber(factor) + " sq ft/person" },
        ],
      };
  },
  }],
  relatedSlugs: [],
  faq: [
    { question: "How is maximum occupancy calculated?", answer: "Divide the floor area by the occupancy load factor for the use type." },
    { question: "How many exits are required?", answer: "Two exits are required when occupancy exceeds 49 people in most jurisdictions." },
  ],
  formula: "Max Occupancy = min(Floor Area / Load Factor, Exits x 250)",
};
