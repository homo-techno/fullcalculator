import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const tileGroutCalculator: CalculatorDefinition = {
  slug: "tile-grout-calculator",
  title: "Tile Grout Calculator",
  description: "Calculate grout amount needed for a tile installation.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["tile grout","grout amount","grout calculator"],
  variants: [{
    id: "standard",
    name: "Tile Grout",
    description: "Calculate grout amount needed for a tile installation.",
    fields: [
      { name: "area", label: "Tile Area (sq ft)", type: "number", min: 1, max: 5000, defaultValue: 100 },
      { name: "tileWidth", label: "Tile Width (in)", type: "number", min: 1, max: 48, defaultValue: 12 },
      { name: "tileLength", label: "Tile Length (in)", type: "number", min: 1, max: 48, defaultValue: 12 },
      { name: "groutWidth", label: "Grout Joint Width (in)", type: "number", min: 0.06, max: 1, defaultValue: 0.125 },
      { name: "tileThickness", label: "Tile Thickness (in)", type: "number", min: 0.2, max: 1, defaultValue: 0.375 },
    ],
    calculate: (inputs) => {
      const area = inputs.area as number;
      const tw = inputs.tileWidth as number;
      const tl = inputs.tileLength as number;
      const gw = inputs.groutWidth as number;
      const tt = inputs.tileThickness as number;
      if (!area || !tw || !tl || !gw || !tt) return null;
      const jointLength = area * 144 * (1/tw + 1/tl);
      const groutVolume = jointLength * gw * tt;
      const lbs = groutVolume * 100 / 1728;
      const bags = Math.ceil(lbs / 25);
      return {
        primary: { label: "Grout Bags Needed", value: formatNumber(bags) + " bags (25 lb)" },
        details: [
          { label: "Grout Weight", value: formatNumber(Math.round(lbs * 10) / 10) + " lbs" },
          { label: "Joint Length", value: formatNumber(Math.round(jointLength / 12)) + " ft" },
          { label: "Tile Area", value: formatNumber(area) + " sq ft" },
        ],
      };
  },
  }],
  relatedSlugs: ["shower-tile-calculator","backsplash-tile-calculator"],
  faq: [
    { question: "How much grout do I need per square foot?", answer: "About 0.5 to 1.5 lbs per sq ft depending on tile size and joint width." },
    { question: "What size grout joint should I use?", answer: "Use 1/8 inch for rectified tile and 3/16 inch for standard tile." },
  ],
  formula: "Grout = Area x Joint Length Factor x Joint Width x Thickness",
};
