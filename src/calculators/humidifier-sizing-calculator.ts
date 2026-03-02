import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const humidifierSizingCalculator: CalculatorDefinition = {
  slug: "humidifier-sizing-calculator",
  title: "Humidifier Sizing Calculator",
  description: "Determine humidifier output for your home size.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["humidifier size","humidifier gallons"],
  variants: [{
    id: "standard",
    name: "Humidifier Sizing",
    description: "Determine humidifier output for your home size.",
    fields: [
      { name: "sqft", label: "Home Size (sq ft)", type: "number", min: 200, max: 10000, defaultValue: 1500 },
      { name: "tightness", label: "Home Tightness", type: "select", options: [{ value: "0.5", label: "Tight (New)" }, { value: "1", label: "Average" }, { value: "1.5", label: "Loose (Old)" }], defaultValue: "1" },
    ],
    calculate: (inputs) => {
      const sqft = inputs.sqft as number;
      const tight = Number(inputs.tightness as number);
      const gallonsPerDay = (sqft / 1000) * 2 * tight;
      return {
        primary: { label: "Output Needed", value: formatNumber(Math.round(gallonsPerDay * 10) / 10) + " gal/day" },
        details: [
          { label: "Home Size", value: formatNumber(sqft) + " sq ft" },
          { label: "Tightness Factor", value: formatNumber(tight) + "x" },
        ],
      };
  },
  }],
  relatedSlugs: [],
  faq: [
    { question: "What humidity level is ideal?", answer: "Keep indoor humidity between 30 and 50 percent for comfort." },
    { question: "Do I need a whole-house humidifier?", answer: "Homes over 1500 sq ft benefit from a whole-house unit." },
  ],
  formula: "Gallons/Day = (Sq Ft / 1000) x 2 x Tightness",
};
