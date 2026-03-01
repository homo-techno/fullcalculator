import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const spiceBlendCalculator: CalculatorDefinition = {
  slug: "spice-blend-calculator",
  title: "Spice Blend Calculator",
  description: "Scale spice blend recipes up or down based on desired batch size and ratio adjustments.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["spice blend ratio", "spice scaling", "seasoning calculator"],
  variants: [{
    id: "standard",
    name: "Spice Blend",
    description: "Scale spice blend recipes up or down based on desired batch size and ratio adjustments",
    fields: [
      { name: "baseBatch", label: "Original Batch Size", type: "number", suffix: "tbsp", min: 1, max: 100, defaultValue: 10 },
      { name: "targetBatch", label: "Target Batch Size", type: "number", suffix: "tbsp", min: 1, max: 500, defaultValue: 30 },
      { name: "ingredients", label: "Number of Spices", type: "number", min: 2, max: 15, defaultValue: 5 },
    ],
    calculate: (inputs) => {
      const base = inputs.baseBatch as number;
      const target = inputs.targetBatch as number;
      const ingredients = inputs.ingredients as number;
      if (!base || !target || base <= 0 || target <= 0) return null;
      const scaleFactor = target / base;
      const avgPerSpice = base / ingredients;
      const scaledPerSpice = avgPerSpice * scaleFactor;
      const cups = target / 16;
      return {
        primary: { label: "Scale Factor", value: scaleFactor.toFixed(2) + "x" },
        details: [
          { label: "Target Batch", value: formatNumber(target) + " tbsp" },
          { label: "Target in Cups", value: cups.toFixed(2) + " cups" },
          { label: "Avg per Spice (scaled)", value: scaledPerSpice.toFixed(2) + " tbsp" },
        ],
      };
    },
  }],
  relatedSlugs: ["bbq-meat-calculator", "sugar-syrup-calculator"],
  faq: [
    { question: "How do I scale a spice recipe?", answer: "Divide your target batch size by the original to get a scale factor, then multiply each ingredient amount by that factor." },
    { question: "How long do spice blends last?", answer: "Ground spice blends stay fresh for about 6-12 months when stored in an airtight container away from heat and light." },
  ],
  formula: "Scale Factor = Target Batch Size / Original Batch Size; Each Spice = Original Amount x Scale Factor",
};
