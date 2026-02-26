import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const mlToGramsCalculator: CalculatorDefinition = {
  slug: "ml-to-grams",
  title: "Milliliters to Grams Converter",
  description: "Free online milliliters to grams converter. Convert mL to grams for water, milk, oil, honey, and other common liquids.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["ml to grams", "milliliters to grams", "liquid conversion", "volume to weight", "cooking conversion"],
  variants: [
    {
      id: "ml-to-grams",
      name: "Milliliters to Grams",
      fields: [
        { name: "ml", label: "Volume (mL)", type: "number", placeholder: "e.g. 250" },
        {
          name: "liquid",
          label: "Liquid Type",
          type: "select",
          options: [
            { label: "Water", value: "water" },
            { label: "Whole Milk", value: "milk" },
            { label: "Heavy Cream", value: "cream" },
            { label: "Vegetable Oil", value: "oil" },
            { label: "Olive Oil", value: "olive_oil" },
            { label: "Honey", value: "honey" },
            { label: "Maple Syrup", value: "maple_syrup" },
            { label: "Soy Sauce", value: "soy_sauce" },
            { label: "Vinegar", value: "vinegar" },
            { label: "Coconut Oil (melted)", value: "coconut_oil" },
          ],
        },
      ],
      calculate: (inputs) => {
        const ml = parseFloat(inputs.ml as string) || 0;
        const liquid = inputs.liquid as string;

        const density: Record<string, number> = {
          water: 1.0,
          milk: 1.03,
          cream: 1.005,
          oil: 0.92,
          olive_oil: 0.913,
          honey: 1.42,
          maple_syrup: 1.33,
          soy_sauce: 1.08,
          vinegar: 1.006,
          coconut_oil: 0.925,
        };

        const d = density[liquid] || 1.0;
        const grams = ml * d;
        const ounces = grams / 28.3495;
        const pounds = grams / 453.592;

        return {
          primary: { label: "Grams", value: formatNumber(grams) },
          details: [
            { label: "Milliliters", value: formatNumber(ml) },
            { label: "Ounces", value: formatNumber(ounces) },
            { label: "Pounds", value: formatNumber(pounds) },
            { label: "Density (g/mL)", value: formatNumber(d) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["grams-to-cups", "grams-to-tablespoons", "cups-to-grams"],
  faq: [
    {
      question: "Is 1 mL always equal to 1 gram?",
      answer: "No. 1 mL equals 1 gram only for water at standard temperature. Other liquids have different densities. For example, 1 mL of honey weighs about 1.42 grams, while 1 mL of oil weighs about 0.92 grams.",
    },
    {
      question: "Why does liquid density matter for conversion?",
      answer: "Density is the ratio of mass to volume. Heavier liquids like honey have a higher density and weigh more per milliliter than lighter liquids like oil.",
    },
    {
      question: "How do I convert mL to grams?",
      answer: "Multiply the volume in milliliters by the density of the liquid. For water, the density is 1.0 g/mL, so mL and grams are the same. For other liquids, look up the specific density.",
    },
  ],
  formula: "grams = milliliters × density (g/mL)",
};
