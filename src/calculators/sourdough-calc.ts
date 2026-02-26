import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const sourdoughCalculator: CalculatorDefinition = {
  slug: "sourdough-calc",
  title: "Sourdough Bread Calculator",
  description: "Free online sourdough bread calculator. Calculate hydration, levain, flour, and water amounts for your sourdough recipe.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["sourdough calculator", "bread hydration", "levain calculator", "baker's math", "sourdough recipe", "bread baking"],
  variants: [
    {
      id: "sourdough-recipe",
      name: "Sourdough Recipe Calculator",
      fields: [
        { name: "totalFlour", label: "Total Flour (grams)", type: "number", placeholder: "e.g. 500" },
        { name: "hydration", label: "Hydration (%)", type: "number", placeholder: "e.g. 75", defaultValue: 75 },
        { name: "saltPct", label: "Salt (%)", type: "number", placeholder: "e.g. 2", defaultValue: 2 },
        { name: "levainPct", label: "Levain / Starter (%)", type: "number", placeholder: "e.g. 20", defaultValue: 20 },
        {
          name: "levainHydration",
          label: "Levain Hydration (%)",
          type: "select",
          options: [
            { label: "100% (Equal flour & water)", value: "100" },
            { label: "80%", value: "80" },
            { label: "60% (Stiff)", value: "60" },
          ],
        },
      ],
      calculate: (inputs) => {
        const totalFlour = parseFloat(inputs.totalFlour as string) || 0;
        const hydration = parseFloat(inputs.hydration as string) || 75;
        const saltPct = parseFloat(inputs.saltPct as string) || 2;
        const levainPct = parseFloat(inputs.levainPct as string) || 20;
        const levainHydration = parseFloat(inputs.levainHydration as string) || 100;

        // Levain weight
        const levainWeight = totalFlour * (levainPct / 100);
        // Flour in levain
        const levainFlour = levainWeight / (1 + levainHydration / 100);
        // Water in levain
        const levainWater = levainWeight - levainFlour;
        // Remaining flour
        const recipeFlour = totalFlour - levainFlour;
        // Total water needed
        const totalWater = totalFlour * (hydration / 100);
        // Remaining water
        const recipeWater = totalWater - levainWater;
        // Salt
        const salt = totalFlour * (saltPct / 100);
        // Total dough weight
        const totalDough = totalFlour + totalWater + salt;

        return {
          primary: { label: "Total Dough Weight", value: `${formatNumber(totalDough)} g` },
          details: [
            { label: "Recipe Flour", value: `${formatNumber(recipeFlour)} g` },
            { label: "Recipe Water", value: `${formatNumber(recipeWater)} g` },
            { label: "Levain / Starter", value: `${formatNumber(levainWeight)} g` },
            { label: "Salt", value: `${formatNumber(salt)} g` },
            { label: "Levain Flour", value: `${formatNumber(levainFlour)} g` },
            { label: "Levain Water", value: `${formatNumber(levainWater)} g` },
            { label: "True Hydration", value: `${formatNumber(hydration)}%` },
          ],
        };
      },
    },
    {
      id: "scale-recipe",
      name: "Scale by Loaf Count",
      fields: [
        { name: "loaves", label: "Number of Loaves", type: "number", placeholder: "e.g. 2" },
        { name: "loafWeight", label: "Target Loaf Weight (grams)", type: "number", placeholder: "e.g. 900", defaultValue: 900 },
        { name: "hydration", label: "Hydration (%)", type: "number", placeholder: "e.g. 75", defaultValue: 75 },
        { name: "levainPct", label: "Levain (%)", type: "number", placeholder: "e.g. 20", defaultValue: 20 },
      ],
      calculate: (inputs) => {
        const loaves = parseFloat(inputs.loaves as string) || 1;
        const loafWeight = parseFloat(inputs.loafWeight as string) || 900;
        const hydration = parseFloat(inputs.hydration as string) || 75;
        const levainPct = parseFloat(inputs.levainPct as string) || 20;

        const totalDough = loaves * loafWeight;
        // totalDough = flour + water + salt = flour × (1 + hydration/100 + 0.02)
        const flourFactor = 1 + hydration / 100 + 0.02;
        const totalFlour = totalDough / flourFactor;
        const totalWater = totalFlour * (hydration / 100);
        const salt = totalFlour * 0.02;
        const levain = totalFlour * (levainPct / 100);

        return {
          primary: { label: "Total Flour", value: `${formatNumber(totalFlour)} g` },
          details: [
            { label: "Total Water", value: `${formatNumber(totalWater)} g` },
            { label: "Levain / Starter", value: `${formatNumber(levain)} g` },
            { label: "Salt", value: `${formatNumber(salt)} g` },
            { label: "Total Dough Weight", value: `${formatNumber(totalDough)} g` },
            { label: "Loaves", value: formatNumber(loaves) },
            { label: "Weight per Loaf", value: `${formatNumber(loafWeight)} g` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["self-rising-flour", "grams-to-cups", "pancake-batch"],
  faq: [
    {
      question: "What does hydration mean in sourdough baking?",
      answer: "Hydration is the ratio of water to flour expressed as a percentage. A 75% hydration dough means for every 100g of flour, you use 75g of water. Higher hydration results in a more open, airy crumb.",
    },
    {
      question: "What is baker's percentage?",
      answer: "Baker's percentage expresses each ingredient as a percentage of the total flour weight. Flour is always 100%, and other ingredients are calculated relative to it. For example, 2% salt means 2g of salt per 100g of flour.",
    },
    {
      question: "How much levain should I use?",
      answer: "A typical sourdough uses 15-25% levain (relative to total flour). More levain leads to faster fermentation and more sour flavor. Less levain produces a milder flavor with a longer fermentation.",
    },
  ],
  formula: "total_water = total_flour × (hydration% / 100); levain = total_flour × (levain% / 100)",
};
