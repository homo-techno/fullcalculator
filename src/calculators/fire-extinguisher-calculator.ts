import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const fireExtinguisherCalculator: CalculatorDefinition = {
  slug: "fire-extinguisher-calculator",
  title: "Fire Extinguisher Calculator",
  description: "Calculate the number of extinguishers needed for a building.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["fire extinguisher","fire extinguisher placement"],
  variants: [{
    id: "standard",
    name: "Fire Extinguisher",
    description: "Calculate the number of extinguishers needed for a building.",
    fields: [
      { name: "sqft", label: "Building Area (sq ft)", type: "number", min: 100, max: 500000, defaultValue: 5000 },
      { name: "floors", label: "Number of Floors", type: "number", min: 1, max: 50, defaultValue: 2 },
      { name: "hazardLevel", label: "Hazard Level", type: "select", options: [{ value: "1", label: "Light (Office)" }, { value: "2", label: "Ordinary (Retail)" }, { value: "3", label: "Extra (Industrial)" }], defaultValue: "1" },
    ],
    calculate: (inputs) => {
      const sqft = inputs.sqft as number;
      const floors = inputs.floors as number;
      const hazard = Number(inputs.hazardLevel as number);
      if (!sqft || !floors || !hazard) return null;
      const maxTravel = hazard === 3 ? 50 : hazard === 2 ? 50 : 75;
      const coveragePerUnit = Math.PI * maxTravel * maxTravel;
      const perFloor = Math.ceil((sqft / floors) / coveragePerUnit);
      const minPerFloor = hazard === 3 ? 3 : 2;
      const actual = Math.max(perFloor, minPerFloor);
      const total = actual * floors;
      return {
        primary: { label: "Extinguishers Needed", value: formatNumber(total) },
        details: [
          { label: "Per Floor", value: formatNumber(actual) },
          { label: "Max Travel Distance", value: formatNumber(maxTravel) + " ft" },
          { label: "Coverage Per Unit", value: formatNumber(Math.round(coveragePerUnit)) + " sq ft" },
        ],
      };
  },
  }],
  relatedSlugs: [],
  faq: [
    { question: "How far apart should fire extinguishers be?", answer: "NFPA code requires no more than 75 feet of travel for light hazard areas." },
    { question: "What type of extinguisher do I need?", answer: "ABC-rated extinguishers cover most ordinary fire risks in commercial buildings." },
  ],
  formula: "Total = max(ceil(Floor Area / Coverage), Min Per Floor) x Floors",
};
