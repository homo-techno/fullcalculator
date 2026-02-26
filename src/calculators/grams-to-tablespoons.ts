import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const gramsToTablespoonsCalculator: CalculatorDefinition = {
  slug: "grams-to-tablespoons",
  title: "Grams to Tablespoons Converter",
  description: "Free online grams to tablespoons converter. Accurately convert grams to tablespoons for flour, sugar, butter, and more.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["grams to tablespoons", "g to tbsp", "baking conversion", "cooking measurement", "tablespoon converter"],
  variants: [
    {
      id: "grams-to-tbsp",
      name: "Grams to Tablespoons",
      fields: [
        { name: "grams", label: "Weight (grams)", type: "number", placeholder: "e.g. 30" },
        {
          name: "ingredient",
          label: "Ingredient",
          type: "select",
          options: [
            { label: "All-Purpose Flour", value: "flour" },
            { label: "Granulated Sugar", value: "sugar" },
            { label: "Powdered Sugar", value: "powdered_sugar" },
            { label: "Brown Sugar", value: "brown_sugar" },
            { label: "Butter", value: "butter" },
            { label: "Salt (table)", value: "salt" },
            { label: "Baking Powder", value: "baking_powder" },
            { label: "Cocoa Powder", value: "cocoa" },
            { label: "Cornstarch", value: "cornstarch" },
            { label: "Olive Oil", value: "olive_oil" },
            { label: "Honey", value: "honey" },
            { label: "Milk", value: "milk" },
          ],
        },
      ],
      calculate: (inputs) => {
        const grams = parseFloat(inputs.grams as string) || 0;
        const ingredient = inputs.ingredient as string;

        const gramsPerTbsp: Record<string, number> = {
          flour: 7.81,
          sugar: 12.5,
          powdered_sugar: 7.5,
          brown_sugar: 13.75,
          butter: 14.18,
          salt: 18.0,
          baking_powder: 13.8,
          cocoa: 5.38,
          cornstarch: 8.0,
          olive_oil: 13.5,
          honey: 21.25,
          milk: 15.26,
        };

        const factor = gramsPerTbsp[ingredient] || 12.5;
        const tablespoons = grams / factor;
        const teaspoons = tablespoons * 3;
        const cups = tablespoons / 16;

        return {
          primary: { label: "Tablespoons", value: formatNumber(tablespoons) },
          details: [
            { label: "Grams", value: formatNumber(grams) },
            { label: "Teaspoons", value: formatNumber(teaspoons) },
            { label: "Cups", value: formatNumber(cups) },
            { label: "Grams per Tablespoon", value: formatNumber(factor) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["grams-to-cups", "cups-to-grams", "ml-to-grams"],
  faq: [
    {
      question: "How many tablespoons is 10 grams of sugar?",
      answer: "10 grams of granulated sugar is approximately 0.8 tablespoons. One tablespoon of sugar weighs about 12.5 grams.",
    },
    {
      question: "How many grams are in 1 tablespoon of flour?",
      answer: "One tablespoon of all-purpose flour weighs approximately 7.81 grams. This can vary slightly depending on how the flour is measured.",
    },
    {
      question: "Why is grams more accurate than tablespoons?",
      answer: "Tablespoons measure volume while grams measure weight. Volume measurements can vary based on how ingredients are scooped or packed, whereas weight is always consistent.",
    },
  ],
  formula: "tablespoons = grams / grams_per_tablespoon (varies by ingredient)",
};
