import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const cupsToGramsCalculator: CalculatorDefinition = {
  slug: "cups-to-grams",
  title: "Cups to Grams Converter",
  description: "Free online cups to grams converter. Convert cups to grams for common baking and cooking ingredients.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["cups to grams", "cup to g", "baking conversion", "cooking measurement", "ingredient weight"],
  variants: [
    {
      id: "cups-to-grams",
      name: "Cups to Grams",
      fields: [
        { name: "cups", label: "Cups", type: "number", placeholder: "e.g. 2", step: 0.25 },
        {
          name: "ingredient",
          label: "Ingredient",
          type: "select",
          options: [
            { label: "All-Purpose Flour", value: "flour" },
            { label: "Bread Flour", value: "bread_flour" },
            { label: "Cake Flour", value: "cake_flour" },
            { label: "Granulated Sugar", value: "sugar" },
            { label: "Powdered Sugar", value: "powdered_sugar" },
            { label: "Brown Sugar (packed)", value: "brown_sugar" },
            { label: "Butter", value: "butter" },
            { label: "Milk", value: "milk" },
            { label: "Water", value: "water" },
            { label: "Rice (uncooked)", value: "rice" },
            { label: "Oats (rolled)", value: "oats" },
            { label: "Chocolate Chips", value: "chocolate_chips" },
          ],
        },
      ],
      calculate: (inputs) => {
        const cups = parseFloat(inputs.cups as string) || 0;
        const ingredient = inputs.ingredient as string;

        const gramsPerCup: Record<string, number> = {
          flour: 125,
          bread_flour: 130,
          cake_flour: 114,
          sugar: 200,
          powdered_sugar: 120,
          brown_sugar: 220,
          butter: 227,
          milk: 244,
          water: 236.6,
          rice: 185,
          oats: 90,
          chocolate_chips: 170,
        };

        const factor = gramsPerCup[ingredient] || 125;
        const grams = cups * factor;
        const ounces = grams / 28.3495;
        const pounds = grams / 453.592;

        return {
          primary: { label: "Grams", value: formatNumber(grams) },
          details: [
            { label: "Cups", value: formatNumber(cups) },
            { label: "Ounces", value: formatNumber(ounces) },
            { label: "Pounds", value: formatNumber(pounds) },
            { label: "Grams per Cup", value: formatNumber(factor) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["grams-to-cups", "grams-to-tablespoons", "ml-to-grams"],
  faq: [
    {
      question: "How many grams is 1 cup of flour?",
      answer: "One cup of all-purpose flour weighs approximately 125 grams. Bread flour is about 130 grams per cup, and cake flour is about 114 grams per cup.",
    },
    {
      question: "How many grams is 1 cup of sugar?",
      answer: "One cup of granulated sugar weighs approximately 200 grams. Brown sugar (packed) weighs about 220 grams per cup, and powdered sugar about 120 grams.",
    },
    {
      question: "Why do professional bakers use grams?",
      answer: "Grams provide a more accurate and consistent measurement than cups. Cup measurements can vary based on how ingredients are scooped, packed, or leveled.",
    },
  ],
  formula: "grams = cups × grams_per_cup (varies by ingredient)",
};
