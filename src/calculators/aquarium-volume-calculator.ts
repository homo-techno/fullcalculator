import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const aquariumVolumeCalculator: CalculatorDefinition = {
  slug: "aquarium-volume-calculator",
  title: "Aquarium Volume Calculator",
  description: "Calculate fish tank water volume from dimensions.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["aquarium volume","fish tank gallons"],
  variants: [{
    id: "standard",
    name: "Aquarium Volume",
    description: "Calculate fish tank water volume from dimensions.",
    fields: [
      { name: "length", label: "Length (in)", type: "number", min: 1, max: 120, defaultValue: 24 },
      { name: "width", label: "Width (in)", type: "number", min: 1, max: 60, defaultValue: 12 },
      { name: "height", label: "Height (in)", type: "number", min: 1, max: 48, defaultValue: 16 },
    ],
    calculate: (inputs) => {
      const l = inputs.length as number;
      const w = inputs.width as number;
      const h = inputs.height as number;
      if (!l || !w || !h) return null;
      const cubicIn = l * w * h;
      const gallons = cubicIn / 231;
      const liters = gallons * 3.785;
      const waterWeightLbs = gallons * 8.34;
      return {
        primary: { label: "Volume", value: formatNumber(Math.round(gallons * 10) / 10) + " gallons" },
        details: [
          { label: "Liters", value: formatNumber(Math.round(liters * 10) / 10) },
          { label: "Cubic Inches", value: formatNumber(Math.round(cubicIn)) },
          { label: "Water Weight", value: formatNumber(Math.round(waterWeightLbs)) + " lbs" },
        ],
      };
  },
  }],
  relatedSlugs: [],
  faq: [
    { question: "How many fish per gallon?", answer: "A common guideline is 1 inch of fish per gallon of water." },
    { question: "Should I fill the tank completely?", answer: "Leave about 1 inch of space at the top for gas exchange." },
  ],
  formula: "Gallons = (Length x Width x Height) / 231",
};
