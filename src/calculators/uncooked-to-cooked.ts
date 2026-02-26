import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const uncookedToCookedCalculator: CalculatorDefinition = {
  slug: "uncooked-to-cooked",
  title: "Uncooked to Cooked Food Weight Converter",
  description: "Free online uncooked to cooked food weight converter. Calculate how much pasta, rice, meat, and other foods weigh after cooking.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["uncooked to cooked", "raw to cooked weight", "food weight converter", "pasta cooked weight", "rice cooked weight", "meat shrinkage"],
  variants: [
    {
      id: "uncooked-to-cooked",
      name: "Uncooked to Cooked Weight",
      fields: [
        { name: "rawWeight", label: "Uncooked / Raw Weight (grams)", type: "number", placeholder: "e.g. 100" },
        {
          name: "food",
          label: "Food Item",
          type: "select",
          options: [
            { label: "Pasta (dried)", value: "pasta" },
            { label: "White Rice", value: "white_rice" },
            { label: "Brown Rice", value: "brown_rice" },
            { label: "Quinoa", value: "quinoa" },
            { label: "Oatmeal (dry)", value: "oatmeal" },
            { label: "Lentils (dry)", value: "lentils" },
            { label: "Chickpeas (dry)", value: "chickpeas" },
            { label: "Chicken Breast", value: "chicken" },
            { label: "Ground Beef (80/20)", value: "ground_beef" },
            { label: "Ground Beef (93/7)", value: "lean_beef" },
            { label: "Salmon Fillet", value: "salmon" },
            { label: "Pork Chop", value: "pork" },
            { label: "Shrimp", value: "shrimp" },
            { label: "Beans (dry)", value: "beans" },
          ],
        },
      ],
      calculate: (inputs) => {
        const rawWeight = parseFloat(inputs.rawWeight as string) || 0;
        const food = inputs.food as string;

        // Cooked-to-raw ratio (multiply raw weight to get cooked weight)
        const cookingRatio: Record<string, number> = {
          pasta: 2.25,
          white_rice: 3.0,
          brown_rice: 2.5,
          quinoa: 2.75,
          oatmeal: 3.5,
          lentils: 2.5,
          chickpeas: 2.75,
          chicken: 0.75,
          ground_beef: 0.65,
          lean_beef: 0.75,
          salmon: 0.8,
          pork: 0.7,
          shrimp: 0.75,
          beans: 2.5,
        };

        const ratio = cookingRatio[food] || 1;
        const cookedWeight = rawWeight * ratio;
        const cookedOz = cookedWeight / 28.3495;
        const rawOz = rawWeight / 28.3495;
        const change = ((cookedWeight - rawWeight) / rawWeight) * 100;

        const grainOrMeat = ratio > 1 ? "absorbs water" : "loses moisture/fat";

        return {
          primary: { label: "Cooked Weight", value: `${formatNumber(cookedWeight)} g` },
          details: [
            { label: "Raw Weight", value: `${formatNumber(rawWeight)} g (${formatNumber(rawOz)} oz)` },
            { label: "Cooked Weight (oz)", value: formatNumber(cookedOz) },
            { label: "Cooking Ratio", value: `${formatNumber(ratio)}x` },
            { label: "Weight Change", value: `${formatNumber(change)}%` },
            { label: "Note", value: `Food ${grainOrMeat} during cooking` },
          ],
        };
      },
    },
    {
      id: "cooked-to-uncooked",
      name: "Cooked to Uncooked Weight",
      fields: [
        { name: "cookedWeight", label: "Cooked Weight (grams)", type: "number", placeholder: "e.g. 200" },
        {
          name: "food",
          label: "Food Item",
          type: "select",
          options: [
            { label: "Pasta (dried)", value: "pasta" },
            { label: "White Rice", value: "white_rice" },
            { label: "Brown Rice", value: "brown_rice" },
            { label: "Quinoa", value: "quinoa" },
            { label: "Chicken Breast", value: "chicken" },
            { label: "Ground Beef (80/20)", value: "ground_beef" },
            { label: "Salmon Fillet", value: "salmon" },
            { label: "Beans (dry)", value: "beans" },
          ],
        },
      ],
      calculate: (inputs) => {
        const cookedWeight = parseFloat(inputs.cookedWeight as string) || 0;
        const food = inputs.food as string;

        const cookingRatio: Record<string, number> = {
          pasta: 2.25,
          white_rice: 3.0,
          brown_rice: 2.5,
          quinoa: 2.75,
          chicken: 0.75,
          ground_beef: 0.65,
          salmon: 0.8,
          beans: 2.5,
        };

        const ratio = cookingRatio[food] || 1;
        const rawWeight = cookedWeight / ratio;
        const rawOz = rawWeight / 28.3495;
        const cookedOz = cookedWeight / 28.3495;

        return {
          primary: { label: "Raw / Uncooked Weight", value: `${formatNumber(rawWeight)} g` },
          details: [
            { label: "Cooked Weight", value: `${formatNumber(cookedWeight)} g (${formatNumber(cookedOz)} oz)` },
            { label: "Raw Weight (oz)", value: formatNumber(rawOz) },
            { label: "Cooking Ratio", value: `${formatNumber(ratio)}x` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["grams-to-cups", "cups-to-grams", "ml-to-grams"],
  faq: [
    {
      question: "How much does pasta weigh after cooking?",
      answer: "Dried pasta roughly doubles in weight when cooked, with a ratio of about 2.25x. So 100g of dry pasta becomes approximately 225g of cooked pasta.",
    },
    {
      question: "How much does rice expand when cooked?",
      answer: "White rice triples in weight when cooked (1:3 ratio). 100g of uncooked white rice yields about 300g of cooked rice. Brown rice has about a 2.5x ratio.",
    },
    {
      question: "How much weight does chicken lose when cooked?",
      answer: "Chicken breast loses about 25% of its weight when cooked due to moisture loss. 100g of raw chicken breast becomes approximately 75g cooked.",
    },
  ],
  formula: "cooked_weight = raw_weight × cooking_ratio",
};
