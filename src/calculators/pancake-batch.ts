import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const pancakeBatchCalculator: CalculatorDefinition = {
  slug: "pancake-batch",
  title: "Pancake Recipe Batch Calculator",
  description: "Free online pancake batch calculator. Scale your pancake recipe up or down for any number of servings.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["pancake calculator", "pancake recipe", "batch calculator", "pancake servings", "scale recipe", "pancake ingredients"],
  variants: [
    {
      id: "pancake-batch",
      name: "Pancake Batch Calculator",
      fields: [
        { name: "servings", label: "Number of Servings (3 pancakes each)", type: "number", placeholder: "e.g. 4" },
        {
          name: "type",
          label: "Pancake Type",
          type: "select",
          options: [
            { label: "Classic Buttermilk", value: "buttermilk" },
            { label: "Fluffy American", value: "fluffy" },
            { label: "Whole Wheat", value: "whole_wheat" },
            { label: "Protein Pancakes", value: "protein" },
            { label: "Blueberry Pancakes", value: "blueberry" },
          ],
        },
        {
          name: "size",
          label: "Pancake Size",
          type: "select",
          options: [
            { label: "Small (4 inch)", value: "small" },
            { label: "Medium (6 inch)", value: "medium" },
            { label: "Large (8 inch)", value: "large" },
          ],
        },
      ],
      calculate: (inputs) => {
        const servings = parseFloat(inputs.servings as string) || 0;
        const type = inputs.type as string;
        const size = inputs.size as string;

        const sizeMultiplier: Record<string, number> = {
          small: 0.7,
          medium: 1.0,
          large: 1.5,
        };

        const sizeFactor = sizeMultiplier[size] || 1.0;
        // Base recipe makes ~4 servings (12 medium pancakes)
        const batchFactor = (servings / 4) * sizeFactor;

        // Base recipe amounts (for 4 servings)
        const baseFlour = 1.5;      // cups
        const baseSugar = 2;        // tbsp
        const baseBakingPowder = 2; // tsp
        const baseSalt = 0.5;       // tsp
        const baseEggs = 1;
        const baseMilk = 1.25;      // cups
        const baseButter = 3;       // tbsp (melted)

        // Adjustments by type
        const typeAdjustments: Record<string, Record<string, number>> = {
          buttermilk: { flour: 1, sugar: 1, milk: 1, eggs: 1, butter: 1 },
          fluffy: { flour: 1, sugar: 1.5, milk: 0.9, eggs: 1.5, butter: 1.2 },
          whole_wheat: { flour: 1, sugar: 0.5, milk: 1.1, eggs: 1, butter: 0.8 },
          protein: { flour: 0.7, sugar: 0.3, milk: 1, eggs: 2, butter: 0.5 },
          blueberry: { flour: 1, sugar: 1.2, milk: 1, eggs: 1, butter: 1 },
        };

        const adj = typeAdjustments[type] || typeAdjustments.buttermilk;
        const flour = baseFlour * batchFactor * adj.flour;
        const sugar = baseSugar * batchFactor * adj.sugar;
        const bakingPowder = baseBakingPowder * batchFactor;
        const salt = baseSalt * batchFactor;
        const eggs = Math.ceil(baseEggs * batchFactor * adj.eggs);
        const milk = baseMilk * batchFactor * adj.milk;
        const butter = baseButter * batchFactor * adj.butter;
        const totalPancakes = servings * 3;
        const blueberries = type === "blueberry" ? formatNumber(batchFactor * 0.75) + " cups" : "N/A";

        return {
          primary: { label: "Total Pancakes", value: formatNumber(totalPancakes) },
          details: [
            { label: "Flour", value: `${formatNumber(flour)} cups` },
            { label: "Sugar", value: `${formatNumber(sugar)} tbsp` },
            { label: "Baking Powder", value: `${formatNumber(bakingPowder)} tsp` },
            { label: "Salt", value: `${formatNumber(salt)} tsp` },
            { label: "Eggs", value: formatNumber(eggs) },
            { label: "Milk / Buttermilk", value: `${formatNumber(milk)} cups` },
            { label: "Melted Butter", value: `${formatNumber(butter)} tbsp` },
            { label: "Blueberries", value: blueberries },
            { label: "Servings", value: formatNumber(servings) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["sourdough-calc", "self-rising-flour", "grams-to-cups"],
  faq: [
    {
      question: "How many pancakes per person?",
      answer: "Plan for 3 medium-sized (6-inch) pancakes per person for a typical serving. For bigger appetites or smaller pancakes, adjust up to 4-5 per person.",
    },
    {
      question: "Can I make pancake batter ahead of time?",
      answer: "Pancake batter can be refrigerated for up to 24 hours, but it is best used within 1-2 hours. The leavening agents start losing effectiveness over time, resulting in flatter pancakes.",
    },
    {
      question: "What makes pancakes fluffier?",
      answer: "For fluffier pancakes, separate the eggs and fold in beaten egg whites, use buttermilk instead of regular milk, avoid overmixing the batter (lumps are okay), and let the batter rest for 5-10 minutes before cooking.",
    },
  ],
  formula: "ingredient_amount = base_amount × (servings / 4) × size_factor × type_adjustment",
};
