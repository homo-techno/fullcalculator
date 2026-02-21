import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const bakingConversionCalculator: CalculatorDefinition = {
  slug: "baking-conversion-calculator",
  title: "Baking Conversion Calculator",
  description:
    "Free baking conversion calculator. Convert between cups, grams, and ounces for common baking ingredients like flour, sugar, and butter.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "baking conversion",
    "cups to grams",
    "baking measurements",
    "flour cups to grams",
    "sugar cups to grams",
    "baking ingredient converter",
  ],
  variants: [
    {
      id: "cups-to-grams",
      name: "Cups to Grams",
      description: "Convert cups to grams for common baking ingredients",
      fields: [
        {
          name: "amount",
          label: "Amount (cups)",
          type: "number",
          placeholder: "e.g. 2",
        },
        {
          name: "ingredient",
          label: "Ingredient",
          type: "select",
          options: [
            { label: "All-Purpose Flour", value: "ap_flour" },
            { label: "Bread Flour", value: "bread_flour" },
            { label: "Cake Flour", value: "cake_flour" },
            { label: "Granulated Sugar", value: "sugar" },
            { label: "Brown Sugar (packed)", value: "brown_sugar" },
            { label: "Powdered Sugar", value: "powdered_sugar" },
            { label: "Butter", value: "butter" },
            { label: "Honey", value: "honey" },
            { label: "Milk", value: "milk" },
            { label: "Heavy Cream", value: "heavy_cream" },
            { label: "Cocoa Powder", value: "cocoa" },
            { label: "Rolled Oats", value: "oats" },
          ],
        },
      ],
      calculate: (inputs) => {
        const amount = inputs.amount as number;
        const ingredient = inputs.ingredient as string;
        if (!amount || !ingredient) return null;

        const gramsPerCup: Record<string, number> = {
          ap_flour: 120,
          bread_flour: 127,
          cake_flour: 114,
          sugar: 200,
          brown_sugar: 220,
          powdered_sugar: 120,
          butter: 227,
          honey: 340,
          milk: 244,
          heavy_cream: 238,
          cocoa: 86,
          oats: 90,
        };

        const ingredientNames: Record<string, string> = {
          ap_flour: "All-Purpose Flour",
          bread_flour: "Bread Flour",
          cake_flour: "Cake Flour",
          sugar: "Granulated Sugar",
          brown_sugar: "Brown Sugar (packed)",
          powdered_sugar: "Powdered Sugar",
          butter: "Butter",
          honey: "Honey",
          milk: "Milk",
          heavy_cream: "Heavy Cream",
          cocoa: "Cocoa Powder",
          oats: "Rolled Oats",
        };

        const gPerCup = gramsPerCup[ingredient] || 120;
        const totalGrams = amount * gPerCup;
        const totalOz = totalGrams / 28.3495;

        return {
          primary: {
            label: `${amount} cup(s) ${ingredientNames[ingredient]}`,
            value: formatNumber(totalGrams, 0) + " g",
          },
          details: [
            { label: "Grams", value: formatNumber(totalGrams, 1) + " g" },
            { label: "Ounces", value: formatNumber(totalOz, 2) + " oz" },
            { label: "Pounds", value: formatNumber(totalOz / 16, 3) + " lb" },
            { label: "Grams per Cup", value: gPerCup + " g" },
            { label: "Tablespoons", value: formatNumber(amount * 16, 1) + " tbsp" },
            { label: "Teaspoons", value: formatNumber(amount * 48, 1) + " tsp" },
          ],
        };
      },
    },
    {
      id: "grams-to-cups",
      name: "Grams to Cups",
      description: "Convert grams back to cups for common baking ingredients",
      fields: [
        {
          name: "grams",
          label: "Amount (grams)",
          type: "number",
          placeholder: "e.g. 250",
        },
        {
          name: "ingredient",
          label: "Ingredient",
          type: "select",
          options: [
            { label: "All-Purpose Flour", value: "ap_flour" },
            { label: "Bread Flour", value: "bread_flour" },
            { label: "Cake Flour", value: "cake_flour" },
            { label: "Granulated Sugar", value: "sugar" },
            { label: "Brown Sugar (packed)", value: "brown_sugar" },
            { label: "Powdered Sugar", value: "powdered_sugar" },
            { label: "Butter", value: "butter" },
            { label: "Honey", value: "honey" },
            { label: "Milk", value: "milk" },
            { label: "Heavy Cream", value: "heavy_cream" },
            { label: "Cocoa Powder", value: "cocoa" },
            { label: "Rolled Oats", value: "oats" },
          ],
        },
      ],
      calculate: (inputs) => {
        const grams = inputs.grams as number;
        const ingredient = inputs.ingredient as string;
        if (!grams || !ingredient) return null;

        const gramsPerCup: Record<string, number> = {
          ap_flour: 120,
          bread_flour: 127,
          cake_flour: 114,
          sugar: 200,
          brown_sugar: 220,
          powdered_sugar: 120,
          butter: 227,
          honey: 340,
          milk: 244,
          heavy_cream: 238,
          cocoa: 86,
          oats: 90,
        };

        const gPerCup = gramsPerCup[ingredient] || 120;
        const cups = grams / gPerCup;
        const tbsp = cups * 16;
        const oz = grams / 28.3495;

        return {
          primary: {
            label: `${grams} g`,
            value: formatNumber(cups, 2) + " cups",
          },
          details: [
            { label: "Cups", value: formatNumber(cups, 2) },
            { label: "Tablespoons", value: formatNumber(tbsp, 1) },
            { label: "Teaspoons", value: formatNumber(tbsp * 3, 1) },
            { label: "Ounces", value: formatNumber(oz, 2) + " oz" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["cooking-converter", "butter-oil-conversion-calculator"],
  faq: [
    {
      question: "Why do baking conversions vary by ingredient?",
      answer:
        "Different ingredients have different densities. One cup of flour weighs about 120 grams, while one cup of sugar weighs about 200 grams. This is why professional bakers prefer measuring by weight.",
    },
    {
      question: "How do I measure flour correctly in cups?",
      answer:
        "Spoon flour into the measuring cup and level off with a knife. Do not scoop directly from the bag, as this packs the flour and you'll get more than intended (up to 150g per cup instead of 120g).",
    },
    {
      question: "Is it better to bake by weight or volume?",
      answer:
        "Weight (grams) is always more accurate and consistent for baking. Volume measurements like cups can vary depending on how the ingredient is packed. For the most consistent results, always use a kitchen scale.",
    },
  ],
  formula:
    "Grams = Cups x Grams per Cup. Common values: All-Purpose Flour = 120g/cup, Sugar = 200g/cup, Brown Sugar = 220g/cup, Butter = 227g/cup, Milk = 244g/cup, Honey = 340g/cup.",
};
