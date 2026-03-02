import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const dehumidifierSizingCalculator: CalculatorDefinition = {
  slug: "dehumidifier-sizing-calculator",
  title: "Dehumidifier Sizing Calculator",
  description: "Find the right dehumidifier capacity for your room.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["dehumidifier size","dehumidifier pints"],
  variants: [{
    id: "standard",
    name: "Dehumidifier Sizing",
    description: "Find the right dehumidifier capacity for your room.",
    fields: [
      { name: "sqft", label: "Room Size (sq ft)", type: "number", min: 50, max: 5000, defaultValue: 500 },
      { name: "dampness", label: "Dampness Level", type: "select", options: [{ value: "1", label: "Slightly Damp" }, { value: "1.4", label: "Moderately Damp" }, { value: "1.8", label: "Very Damp" }, { value: "2.2", label: "Wet" }], defaultValue: "1.4" },
    ],
    calculate: (inputs) => {
      const sqft = inputs.sqft as number;
      const factor = Number(inputs.dampness as number);
      const basePints = sqft * 0.06;
      const pints = Math.ceil(basePints * factor);
      return {
        primary: { label: "Capacity Needed", value: formatNumber(pints) + " pints/day" },
        details: [
          { label: "Room Size", value: formatNumber(sqft) + " sq ft" },
          { label: "Base Capacity", value: formatNumber(Math.round(basePints)) + " pints/day" },
        ],
      };
  },
  }],
  relatedSlugs: [],
  faq: [
    { question: "What size dehumidifier do I need?", answer: "Use 30 pints for damp 500 sq ft or 50 pints for wet areas." },
    { question: "Where should I place a dehumidifier?", answer: "Place it in the dampest area with good air circulation." },
  ],
  formula: "Pints/Day = Sq Ft x 0.06 x Dampness Factor",
};
