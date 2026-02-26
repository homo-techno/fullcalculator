import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const gramsToCupsCalculator: CalculatorDefinition = {
  slug: "grams-to-cups",
  title: "Grams to Cups Converter",
  description: "Free online grams to cups converter. Convert grams to cups for common baking and cooking ingredients instantly.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["grams to cups", "g to cups", "baking conversion", "ingredient converter", "cooking measurement"],
  variants: [
    {
      id: "grams-to-cups",
      name: "Grams to Cups",
      fields: [
        { name: "grams", label: "Weight (grams)", type: "number", placeholder: "e.g. 250" },
        {
          name: "ingredient",
          label: "Ingredient",
          type: "select",
          options: [
            { label: "All-Purpose Flour", value: "flour" },
            { label: "Granulated Sugar", value: "sugar" },
            { label: "Powdered Sugar", value: "powdered_sugar" },
            { label: "Brown Sugar (packed)", value: "brown_sugar" },
            { label: "Butter", value: "butter" },
            { label: "Milk", value: "milk" },
            { label: "Water", value: "water" },
            { label: "Rice (uncooked)", value: "rice" },
            { label: "Oats (rolled)", value: "oats" },
            { label: "Cocoa Powder", value: "cocoa" },
            { label: "Honey", value: "honey" },
            { label: "Vegetable Oil", value: "oil" },
          ],
        },
      ],
      calculate: (inputs) => {
        const grams = parseFloat(inputs.grams as string) || 0;
        const ingredient = inputs.ingredient as string;

        const gramsPerCup: Record<string, number> = {
          flour: 125,
          sugar: 200,
          powdered_sugar: 120,
          brown_sugar: 220,
          butter: 227,
          milk: 244,
          water: 236.6,
          rice: 185,
          oats: 90,
          cocoa: 86,
          honey: 340,
          oil: 218,
        };

        const factor = gramsPerCup[ingredient] || 125;
        const cups = grams / factor;
        const tablespoons = cups * 16;
        const teaspoons = cups * 48;

        return {
          primary: { label: "Cups", value: formatNumber(cups) },
          details: [
            { label: "Grams", value: formatNumber(grams) },
            { label: "Tablespoons", value: formatNumber(tablespoons) },
            { label: "Teaspoons", value: formatNumber(teaspoons) },
            { label: "Grams per Cup", value: formatNumber(factor) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["cups-to-grams", "grams-to-tablespoons", "ml-to-grams"],
  faq: [
    {
      question: "How many cups is 100 grams of flour?",
      answer: "100 grams of all-purpose flour is approximately 0.8 cups. The exact conversion depends on how the flour is measured (sifted vs. scooped).",
    },
    {
      question: "Why does the conversion differ by ingredient?",
      answer: "Different ingredients have different densities. For example, sugar is denser than flour, so 1 cup of sugar weighs more than 1 cup of flour.",
    },
    {
      question: "Is it better to measure by grams or cups?",
      answer: "Measuring by grams (weight) is more accurate and consistent, which is why professional bakers prefer it over volume measurements like cups.",
    },
  ],
  formula: "cups = grams / grams_per_cup (varies by ingredient)",
};
