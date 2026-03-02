import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const frenchDrainGravelCalculator: CalculatorDefinition = {
  slug: "french-drain-gravel-calculator",
  title: "French Drain Gravel Calculator",
  description: "Calculate gravel needed for a french drain installation.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["french drain gravel","drain rock","french drain material"],
  variants: [{
    id: "standard",
    name: "French Drain Gravel",
    description: "Calculate gravel needed for a french drain installation.",
    fields: [
      { name: "drainLength", label: "Drain Length (ft)", type: "number", min: 5, max: 500, defaultValue: 50 },
      { name: "trenchWidth", label: "Trench Width (in)", type: "number", min: 6, max: 24, defaultValue: 12 },
      { name: "trenchDepth", label: "Trench Depth (in)", type: "number", min: 12, max: 48, defaultValue: 24 },
    ],
    calculate: (inputs) => {
      const len = inputs.drainLength as number;
      const w = inputs.trenchWidth as number;
      const d = inputs.trenchDepth as number;
      if (!len || !w || !d) return null;
      const cubicFt = len * (w / 12) * (d / 12);
      const cubicYards = cubicFt / 27;
      const tons = cubicYards * 1.4;
      return {
        primary: { label: "Gravel Needed", value: formatNumber(Math.round(tons * 10) / 10) + " tons" },
        details: [
          { label: "Cubic Yards", value: formatNumber(Math.round(cubicYards * 10) / 10) },
          { label: "Cubic Feet", value: formatNumber(Math.round(cubicFt)) },
          { label: "Estimated Cost", value: "$" + formatNumber(Math.round(tons * 50)) },
        ],
      };
  },
  }],
  relatedSlugs: ["gravel-calculator","gutter-rain-calculator"],
  faq: [
    { question: "What type of gravel is best for french drains?", answer: "Use washed 3/4 inch crushed stone or river rock for best drainage." },
    { question: "How deep should a french drain be?", answer: "A french drain should be 18 to 24 inches deep for proper function." },
  ],
  formula: "Tons = (Length x Width x Depth / 12^2) / 27 x 1.4",
};
