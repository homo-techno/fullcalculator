import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const tvViewingDistanceCalculator: CalculatorDefinition = {
  slug: "tv-viewing-distance-calculator",
  title: "TV Viewing Distance Calculator",
  description: "Find the optimal viewing distance for your TV size.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["TV viewing distance","TV distance calculator"],
  variants: [{
    id: "standard",
    name: "TV Viewing Distance",
    description: "Find the optimal viewing distance for your TV size.",
    fields: [
      { name: "tvSize", label: "TV Screen Size (in diagonal)", type: "number", min: 20, max: 120, defaultValue: 55 },
      { name: "resolution", label: "Resolution", type: "select", options: [{ value: "1", label: "1080p (Full HD)" }, { value: "2", label: "4K (Ultra HD)" }, { value: "3", label: "8K" }], defaultValue: "2" },
    ],
    calculate: (inputs) => {
      const size = inputs.tvSize as number;
      const res = inputs.resolution as number;
      if (!size || !res) return null;
      const multiplier = res === 1 ? 1.6 : res === 2 ? 1.0 : 0.75;
      const minDist = Math.round(size * multiplier * 10) / 10;
      const maxDist = Math.round(size * multiplier * 1.5 * 10) / 10;
      const heightFt = Math.round(size * 0.49 / 12 * 10) / 10;
      return {
        primary: { label: "Optimal Distance", value: formatNumber(minDist) + " - " + formatNumber(maxDist) + " in" },
        details: [
          { label: "Minimum Distance", value: formatNumber(Math.round(minDist / 12 * 10) / 10) + " ft" },
          { label: "Maximum Distance", value: formatNumber(Math.round(maxDist / 12 * 10) / 10) + " ft" },
          { label: "Screen Height", value: formatNumber(heightFt) + " ft" },
        ],
      };
  },
  }],
  relatedSlugs: [],
  faq: [
    { question: "How far should I sit from a 65 inch TV?", answer: "For 4K, sit about 5.4 to 8.1 feet away from a 65 inch TV." },
    { question: "Does resolution affect viewing distance?", answer: "Yes. Higher resolution allows you to sit closer without seeing pixels." },
  ],
  formula: "Distance = TV Size x Resolution Multiplier",
};
