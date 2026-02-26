import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const gramsToTeaspoonsCalculator: CalculatorDefinition = {
  slug: "grams-to-teaspoons-calculator",
  title: "Grams to Teaspoons Converter",
  description:
    "Free grams to teaspoons converter for 12+ common cooking and baking ingredients. Accurately convert grams to teaspoons based on ingredient density.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: [
    "grams to teaspoons",
    "g to tsp",
    "grams to tsp converter",
    "baking conversion",
    "ingredient converter",
    "cooking grams",
    "teaspoon grams",
  ],
  variants: [
    {
      id: "ingredient",
      name: "By Ingredient",
      description:
        "Convert grams to teaspoons for a specific ingredient based on its density",
      fields: [
        {
          name: "grams",
          label: "Weight (grams)",
          type: "number",
          placeholder: "e.g. 10",
          min: 0,
          step: 0.1,
        },
        {
          name: "ingredient",
          label: "Ingredient",
          type: "select",
          options: [
            { label: "Granulated Sugar", value: "sugar" },
            { label: "Powdered Sugar", value: "powdered_sugar" },
            { label: "Brown Sugar (packed)", value: "brown_sugar" },
            { label: "All-Purpose Flour", value: "flour" },
            { label: "Bread Flour", value: "bread_flour" },
            { label: "Salt (table)", value: "salt" },
            { label: "Kosher Salt", value: "kosher_salt" },
            { label: "Baking Powder", value: "baking_powder" },
            { label: "Baking Soda", value: "baking_soda" },
            { label: "Cocoa Powder", value: "cocoa" },
            { label: "Cinnamon (ground)", value: "cinnamon" },
            { label: "Butter", value: "butter" },
            { label: "Honey", value: "honey" },
            { label: "Vanilla Extract", value: "vanilla" },
            { label: "Active Dry Yeast", value: "yeast" },
            { label: "Cornstarch", value: "cornstarch" },
          ],
          defaultValue: "sugar",
        },
      ],
      calculate: (inputs) => {
        const grams = parseFloat(inputs.grams as string);
        const ingredient = inputs.ingredient as string;
        if (!grams || grams <= 0) return null;

        // Grams per teaspoon for each ingredient
        const gramsPerTsp: Record<string, number> = {
          sugar: 4.2,
          powdered_sugar: 2.5,
          brown_sugar: 4.6,
          flour: 2.6,
          bread_flour: 2.7,
          salt: 6.0,
          kosher_salt: 3.0,
          baking_powder: 4.6,
          baking_soda: 4.6,
          cocoa: 2.5,
          cinnamon: 2.6,
          butter: 4.7,
          honey: 7.0,
          vanilla: 4.2,
          yeast: 3.1,
          cornstarch: 2.7,
        };

        const ingredientLabels: Record<string, string> = {
          sugar: "Granulated Sugar",
          powdered_sugar: "Powdered Sugar",
          brown_sugar: "Brown Sugar (packed)",
          flour: "All-Purpose Flour",
          bread_flour: "Bread Flour",
          salt: "Table Salt",
          kosher_salt: "Kosher Salt",
          baking_powder: "Baking Powder",
          baking_soda: "Baking Soda",
          cocoa: "Cocoa Powder",
          cinnamon: "Ground Cinnamon",
          butter: "Butter",
          honey: "Honey",
          vanilla: "Vanilla Extract",
          yeast: "Active Dry Yeast",
          cornstarch: "Cornstarch",
        };

        const gPerTsp = gramsPerTsp[ingredient] || 4.2;
        const teaspoons = grams / gPerTsp;
        const tablespoons = teaspoons / 3;
        const cups = teaspoons / 48;

        return {
          primary: {
            label: `${formatNumber(grams)} g ${ingredientLabels[ingredient]}`,
            value: `${formatNumber(teaspoons, 2)} tsp`,
          },
          details: [
            { label: "Teaspoons", value: formatNumber(teaspoons, 2) },
            { label: "Tablespoons", value: formatNumber(tablespoons, 2) },
            { label: "Cups", value: formatNumber(cups, 3) },
            {
              label: "Density used",
              value: `${formatNumber(gPerTsp, 1)} g/tsp`,
            },
          ],
          note: `Conversion is based on typical density for ${ingredientLabels[ingredient]}. Actual weight may vary by brand and packing.`,
        };
      },
    },
    {
      id: "custom",
      name: "Custom Density",
      description: "Enter a custom grams-per-teaspoon value for any ingredient",
      fields: [
        {
          name: "grams",
          label: "Weight (grams)",
          type: "number",
          placeholder: "e.g. 25",
          min: 0,
          step: 0.1,
        },
        {
          name: "density",
          label: "Grams per Teaspoon",
          type: "number",
          placeholder: "e.g. 4.2",
          min: 0.1,
          step: 0.1,
        },
      ],
      calculate: (inputs) => {
        const grams = parseFloat(inputs.grams as string);
        const density = parseFloat(inputs.density as string);
        if (!grams || grams <= 0 || !density || density <= 0) return null;

        const teaspoons = grams / density;
        const tablespoons = teaspoons / 3;
        const cups = teaspoons / 48;

        return {
          primary: {
            label: `${formatNumber(grams)} g`,
            value: `${formatNumber(teaspoons, 2)} tsp`,
          },
          details: [
            { label: "Teaspoons", value: formatNumber(teaspoons, 2) },
            { label: "Tablespoons", value: formatNumber(tablespoons, 2) },
            { label: "Cups", value: formatNumber(cups, 3) },
          ],
        };
      },
    },
    {
      id: "reverse",
      name: "Teaspoons to Grams",
      description: "Convert teaspoons back to grams for a specific ingredient",
      fields: [
        {
          name: "teaspoons",
          label: "Teaspoons",
          type: "number",
          placeholder: "e.g. 3",
          min: 0,
          step: 0.25,
        },
        {
          name: "ingredient",
          label: "Ingredient",
          type: "select",
          options: [
            { label: "Granulated Sugar", value: "sugar" },
            { label: "Powdered Sugar", value: "powdered_sugar" },
            { label: "All-Purpose Flour", value: "flour" },
            { label: "Salt (table)", value: "salt" },
            { label: "Baking Powder", value: "baking_powder" },
            { label: "Cocoa Powder", value: "cocoa" },
            { label: "Cinnamon (ground)", value: "cinnamon" },
            { label: "Butter", value: "butter" },
            { label: "Honey", value: "honey" },
            { label: "Cornstarch", value: "cornstarch" },
            { label: "Active Dry Yeast", value: "yeast" },
            { label: "Vanilla Extract", value: "vanilla" },
          ],
          defaultValue: "sugar",
        },
      ],
      calculate: (inputs) => {
        const teaspoons = parseFloat(inputs.teaspoons as string);
        const ingredient = inputs.ingredient as string;
        if (!teaspoons || teaspoons <= 0) return null;

        const gramsPerTsp: Record<string, number> = {
          sugar: 4.2,
          powdered_sugar: 2.5,
          flour: 2.6,
          salt: 6.0,
          baking_powder: 4.6,
          cocoa: 2.5,
          cinnamon: 2.6,
          butter: 4.7,
          honey: 7.0,
          cornstarch: 2.7,
          yeast: 3.1,
          vanilla: 4.2,
        };

        const gPerTsp = gramsPerTsp[ingredient] || 4.2;
        const grams = teaspoons * gPerTsp;

        return {
          primary: {
            label: `${formatNumber(teaspoons, 2)} tsp`,
            value: `${formatNumber(grams, 1)} g`,
          },
          details: [
            { label: "Grams", value: formatNumber(grams, 1) },
            { label: "Ounces", value: formatNumber(grams / 28.3495, 3) },
          ],
        };
      },
    },
  ],
  relatedSlugs: [
    "cooking-converter",
    "cups-to-pounds-calculator",
    "pounds-to-cups-calculator",
  ],
  faq: [
    {
      question: "How many grams are in a teaspoon of sugar?",
      answer:
        "One teaspoon of granulated sugar weighs approximately 4.2 grams. This can vary slightly depending on how finely the sugar is ground and how tightly it is packed.",
    },
    {
      question:
        "Why does the grams-to-teaspoon conversion differ by ingredient?",
      answer:
        "Different ingredients have different densities. For example, a teaspoon of salt (6 g) weighs much more than a teaspoon of flour (2.6 g) because salt crystals are much denser than flour particles.",
    },
    {
      question: "Is it better to measure by weight or volume when baking?",
      answer:
        "Measuring by weight (grams) is more accurate and consistent than measuring by volume (teaspoons, cups). Professional bakers almost always measure by weight to get reproducible results.",
    },
  ],
  formula:
    "Teaspoons = Grams / (Grams per Teaspoon for ingredient) | 1 tbsp = 3 tsp | 1 cup = 48 tsp",
};
