import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const iceCreamMakerCalculator: CalculatorDefinition = {
  slug: "ice-cream-maker-calculator",
  title: "Ice Cream Maker Recipe Calculator",
  description:
    "Free ice cream maker recipe calculator. Scale homemade ice cream recipes for different machine sizes and flavor bases.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "ice cream maker",
    "homemade ice cream",
    "ice cream recipe",
    "gelato calculator",
    "ice cream ingredients",
  ],
  variants: [
    {
      id: "calc",
      name: "Calculate",
      fields: [
        {
          name: "machineSize",
          label: "Machine Capacity (quarts)",
          type: "select",
          options: [
            { label: "1 Quart", value: "1" },
            { label: "1.5 Quarts", value: "1.5" },
            { label: "2 Quarts", value: "2" },
            { label: "4 Quarts", value: "4" },
            { label: "6 Quarts", value: "6" },
          ],
        },
        {
          name: "base",
          label: "Ice Cream Base",
          type: "select",
          options: [
            { label: "Classic Custard (egg-based)", value: "custard" },
            { label: "Philadelphia Style (no eggs)", value: "philadelphia" },
            { label: "Gelato", value: "gelato" },
            { label: "Vegan (coconut milk)", value: "vegan" },
          ],
        },
        {
          name: "richness",
          label: "Richness Level",
          type: "select",
          options: [
            { label: "Light", value: "light" },
            { label: "Regular", value: "regular" },
            { label: "Premium / Rich", value: "premium" },
          ],
        },
      ],
      calculate: (inputs) => {
        const machineSize = parseFloat(inputs.machineSize as string) || 1.5;
        const base = inputs.base as string;
        const richness = inputs.richness as string;

        const scaleFactor = machineSize / 1.5;

        const recipes: Record<string, Record<string, { cream: number; milk: number; sugar: number; eggs: number; vanilla: number }>> = {
          custard: {
            light: { cream: 240, milk: 480, sugar: 150, eggs: 4, vanilla: 5 },
            regular: { cream: 360, milk: 360, sugar: 150, eggs: 5, vanilla: 5 },
            premium: { cream: 480, milk: 240, sugar: 165, eggs: 6, vanilla: 7 },
          },
          philadelphia: {
            light: { cream: 240, milk: 480, sugar: 150, eggs: 0, vanilla: 5 },
            regular: { cream: 360, milk: 360, sugar: 150, eggs: 0, vanilla: 5 },
            premium: { cream: 480, milk: 240, sugar: 165, eggs: 0, vanilla: 7 },
          },
          gelato: {
            light: { cream: 120, milk: 600, sugar: 150, eggs: 3, vanilla: 5 },
            regular: { cream: 180, milk: 540, sugar: 165, eggs: 4, vanilla: 5 },
            premium: { cream: 240, milk: 480, sugar: 180, eggs: 5, vanilla: 7 },
          },
          vegan: {
            light: { cream: 400, milk: 320, sugar: 150, eggs: 0, vanilla: 5 },
            regular: { cream: 480, milk: 240, sugar: 165, eggs: 0, vanilla: 5 },
            premium: { cream: 600, milk: 120, sugar: 180, eggs: 0, vanilla: 7 },
          },
        };

        const recipe = (recipes[base] && recipes[base][richness]) || recipes.custard.regular;
        const cream = recipe.cream * scaleFactor;
        const milk = recipe.milk * scaleFactor;
        const sugar = recipe.sugar * scaleFactor;
        const eggs = Math.round(recipe.eggs * scaleFactor);
        const vanilla = recipe.vanilla * scaleFactor;
        const servings = Math.round(machineSize * 4);
        const churnTime = base === "gelato" ? "20-25" : "25-35";

        return {
          primary: {
            label: "Heavy Cream",
            value: formatNumber(cream, 0) + " ml",
          },
          details: [
            { label: base === "vegan" ? "Coconut Milk" : "Whole Milk", value: formatNumber(milk, 0) + " ml" },
            { label: "Sugar", value: formatNumber(sugar, 0) + " g" },
            { label: "Egg Yolks", value: eggs > 0 ? String(eggs) : "None" },
            { label: "Vanilla Extract", value: formatNumber(vanilla, 1) + " ml" },
            { label: "Yield", value: machineSize + " quarts (" + servings + " servings)" },
            { label: "Churn Time", value: churnTime + " min" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["recipe-scaler-calculator", "cooking-calculator"],
  faq: [
    {
      question: "What is the difference between custard and Philadelphia-style ice cream?",
      answer:
        "Custard-based ice cream uses egg yolks for a richer, creamier texture. Philadelphia-style uses no eggs, relying on cream and milk alone, resulting in a cleaner, lighter flavor.",
    },
    {
      question: "How long should I churn homemade ice cream?",
      answer:
        "Most ice cream makers need 25-35 minutes of churning. The ice cream is done when it reaches soft-serve consistency. It then needs 4-6 hours in the freezer to firm up.",
    },
  ],
  formula:
    "Ingredients are scaled by machine capacity. Scale Factor = Machine Size / 1.5 quarts (base recipe). One quart yields about 4 servings of ice cream.",
};
