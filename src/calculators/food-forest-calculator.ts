import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const foodForestCalculator: CalculatorDefinition = {
  slug: "food-forest-calculator",
  title: "Food Forest Calculator",
  description: "Plan your food forest layout by estimating tree count, yield, and spacing for your available area.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["food forest", "permaculture calculator", "food forest planner"],
  variants: [{
    id: "standard",
    name: "Food Forest",
    description: "Plan your food forest layout by estimating tree count, yield, and spacing for your available area",
    fields: [
      { name: "area", label: "Available Area", type: "number", suffix: "sq ft", min: 100, max: 100000, defaultValue: 5000 },
      { name: "treeType", label: "Primary Tree Type", type: "select", options: [{value:"fruit",label:"Fruit Trees"},{value:"nut",label:"Nut Trees"},{value:"mixed",label:"Mixed Orchard"}], defaultValue: "mixed" },
      { name: "climate", label: "Climate Zone", type: "select", options: [{value:"tropical",label:"Tropical"},{value:"temperate",label:"Temperate"},{value:"arid",label:"Arid"}], defaultValue: "temperate" },
    ],
    calculate: (inputs) => {
      const area = inputs.area as number;
      const treeType = inputs.treeType as string;
      const climate = inputs.climate as string;
      if (!area || area <= 0) return null;
      const spacing: Record<string, number> = { fruit: 200, nut: 400, mixed: 300 };
      const yieldPerTree: Record<string, number> = { fruit: 100, nut: 50, mixed: 75 };
      const climateMod: Record<string, number> = { tropical: 1.3, temperate: 1.0, arid: 0.7 };
      const treeCount = Math.floor(area / (spacing[treeType] || 300));
      const annualYield = treeCount * (yieldPerTree[treeType] || 75) * (climateMod[climate] || 1.0);
      const understoryPlants = treeCount * 3;
      return {
        primary: { label: "Trees You Can Plant", value: formatNumber(treeCount) + " trees" },
        details: [
          { label: "Estimated Annual Yield", value: formatNumber(Math.round(annualYield)) + " lbs" },
          { label: "Understory Plant Slots", value: formatNumber(understoryPlants) },
          { label: "Spacing per Tree", value: formatNumber(spacing[treeType] || 300) + " sq ft" },
        ],
      };
    },
  }],
  relatedSlugs: ["tree-carbon-calculator", "water-conservation-calculator"],
  faq: [
    { question: "What is a food forest?", answer: "A food forest is a diverse planting of edible plants that mimics the structure and function of a natural forest ecosystem, with layers of trees, shrubs, and ground cover." },
    { question: "How long does a food forest take to establish?", answer: "Most food forests begin producing meaningful harvests within 3 to 5 years, with full maturity reached in 10 to 15 years depending on the species planted." },
  ],
  formula: "Tree Count = Available Area / Spacing per Tree",
};
