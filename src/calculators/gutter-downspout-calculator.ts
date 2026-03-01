import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const gutterDownspoutCalculator: CalculatorDefinition = {
  slug: "gutter-downspout-calculator",
  title: "Gutter Downspout Calculator",
  description: "Size gutters and downspouts for your roof.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["gutter sizing","downspout calculator"],
  variants: [{
    id: "standard",
    name: "Gutter Downspout",
    description: "Size gutters and downspouts for your roof.",
    fields: [
      { name: "roofArea", label: "Roof Area (sq ft)", type: "number", min: 50, max: 100000, defaultValue: 1500 },
      { name: "rainfall", label: "Rainfall Intensity (in/hr)", type: "number", min: 0.5, max: 15, defaultValue: 4 },
    ],
    calculate: (inputs) => {
      const area = inputs.roofArea as number;
      const rain = inputs.rainfall as number;
      if (!area || !rain) return null;
      const flowRate = area * rain * 0.0104;
      const gutterSize = flowRate <= 5.5 ? "5-inch K-style" : "6-inch K-style";
      const downspouts = Math.max(1, Math.ceil(area / 600));
      const dsSize = flowRate / downspouts <= 5 ? "2x3 inch" : "3x4 inch";
      return {
        primary: { label: "Gutter Size", value: gutterSize },
        details: [
          { label: "Flow Rate", value: flowRate.toFixed(1) + " gal/min" },
          { label: "Downspouts Needed", value: String(downspouts) },
          { label: "Downspout Size", value: dsSize },
        ],
      };
  },
  }],
  relatedSlugs: [],
  faq: [
    { question: "How many downspouts do I need?", answer: "One downspout per 600 square feet of roof area is typical." },
    { question: "What gutter size is most common?", answer: "5-inch K-style gutters are the most common for residential use." },
  ],
  formula: "Flow Rate = Roof Area x Rainfall x 0.0104",
};
