import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const coldBrewRatioCalculator: CalculatorDefinition = {
  slug: "cold-brew-ratio",
  title: "Cold Brew Coffee Ratio Calculator",
  description: "Free online cold brew coffee ratio calculator. Get the perfect coffee-to-water ratio for smooth, delicious cold brew.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["cold brew ratio", "cold brew calculator", "coffee ratio", "cold brew recipe", "iced coffee", "coffee to water ratio"],
  variants: [
    {
      id: "cold-brew",
      name: "Cold Brew Recipe",
      fields: [
        { name: "servings", label: "Number of Servings", type: "number", placeholder: "e.g. 4" },
        { name: "servingSize", label: "Serving Size (oz)", type: "number", placeholder: "e.g. 8", defaultValue: 8 },
        {
          name: "strength",
          label: "Brew Strength",
          type: "select",
          options: [
            { label: "Light (1:12 ratio)", value: "light" },
            { label: "Medium (1:8 ratio)", value: "medium" },
            { label: "Strong / Concentrate (1:5 ratio)", value: "strong" },
            { label: "Extra Strong Concentrate (1:4 ratio)", value: "extra_strong" },
          ],
        },
        {
          name: "grind",
          label: "Grind Size",
          type: "select",
          options: [
            { label: "Coarse (recommended)", value: "coarse" },
            { label: "Medium-Coarse", value: "medium_coarse" },
            { label: "Medium", value: "medium" },
          ],
        },
      ],
      calculate: (inputs) => {
        const servings = parseFloat(inputs.servings as string) || 1;
        const servingSize = parseFloat(inputs.servingSize as string) || 8;
        const strength = inputs.strength as string;
        const grind = inputs.grind as string;

        const ratios: Record<string, number> = {
          light: 12,
          medium: 8,
          strong: 5,
          extra_strong: 4,
        };

        const steepHours: Record<string, number> = {
          coarse: 18,
          medium_coarse: 14,
          medium: 12,
        };

        const ratio = ratios[strength] || 8;
        const totalOz = servings * servingSize;
        const totalMl = totalOz * 29.5735;
        const waterOz = totalOz;
        const coffeeOz = waterOz / ratio;
        const coffeeGrams = coffeeOz * 28.3495;
        const coffeeTbsp = coffeeGrams / 5.3; // ~5.3g per tablespoon of ground coffee
        const steepTime = steepHours[grind] || 18;

        return {
          primary: { label: "Coffee Needed", value: `${formatNumber(coffeeGrams)} g` },
          details: [
            { label: "Coffee (tablespoons)", value: formatNumber(coffeeTbsp) },
            { label: "Coffee (oz)", value: formatNumber(coffeeOz) },
            { label: "Water", value: `${formatNumber(waterOz)} oz (${formatNumber(totalMl)} mL)` },
            { label: "Ratio", value: `1:${ratio} (coffee:water)` },
            { label: "Steep Time", value: `${formatNumber(steepTime)} hours` },
            { label: "Total Yield", value: `${formatNumber(totalOz)} oz` },
          ],
          note: strength === "strong" || strength === "extra_strong"
            ? "This is a concentrate. Dilute 1:1 with water or milk before serving."
            : undefined,
        };
      },
    },
  ],
  relatedSlugs: ["party-drink-calc", "beer-brewing-calc", "catering-serving-calc"],
  faq: [
    {
      question: "What is the best ratio for cold brew?",
      answer: "A 1:8 coffee-to-water ratio produces a smooth, medium-strength cold brew ready to drink. For concentrate (to dilute later), use a 1:4 or 1:5 ratio.",
    },
    {
      question: "How long should cold brew steep?",
      answer: "Cold brew should steep for 12-24 hours in the refrigerator. Coarse grinds need longer (18-24 hours), while medium grinds steep faster (12-14 hours). Do not over-steep or it may become bitter.",
    },
    {
      question: "Should I use coarse or fine ground coffee?",
      answer: "Use coarse ground coffee for cold brew. Fine grinds will over-extract and produce a bitter, gritty brew. Coarse grinds produce a smoother, cleaner flavor.",
    },
  ],
  formula: "coffee_grams = (water_oz / ratio) × 28.35",
};
