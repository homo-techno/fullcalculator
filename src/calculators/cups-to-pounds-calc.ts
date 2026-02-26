import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const cupsToPoundsCalculator: CalculatorDefinition = {
  slug: "cups-to-pounds-calculator",
  title: "Cups to Pounds Converter",
  description:
    "Free cups to pounds converter for baking ingredients. Accurately convert cups to pounds and ounces based on ingredient density for flour, sugar, butter, and more.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: [
    "cups to pounds",
    "cups to lbs",
    "baking conversion",
    "flour cups to pounds",
    "sugar cups to pounds",
    "butter cups to pounds",
  ],
  variants: [
    {
      id: "by-ingredient",
      name: "By Ingredient",
      description: "Convert cups to pounds for common baking ingredients",
      fields: [
        {
          name: "cups",
          label: "Number of Cups",
          type: "number",
          placeholder: "e.g. 2",
          min: 0,
          step: 0.25,
        },
        {
          name: "ingredient",
          label: "Ingredient",
          type: "select",
          options: [
            { label: "All-Purpose Flour", value: "ap_flour" },
            { label: "Bread Flour", value: "bread_flour" },
            { label: "Cake Flour", value: "cake_flour" },
            { label: "Whole Wheat Flour", value: "ww_flour" },
            { label: "Granulated Sugar", value: "sugar" },
            { label: "Brown Sugar (packed)", value: "brown_sugar" },
            { label: "Powdered Sugar", value: "powdered_sugar" },
            { label: "Butter", value: "butter" },
            { label: "Vegetable Oil", value: "oil" },
            { label: "Milk", value: "milk" },
            { label: "Heavy Cream", value: "cream" },
            { label: "Honey", value: "honey" },
            { label: "Rolled Oats", value: "oats" },
            { label: "Rice (uncooked)", value: "rice" },
            { label: "Cocoa Powder", value: "cocoa" },
            { label: "Cornstarch", value: "cornstarch" },
          ],
          defaultValue: "ap_flour",
        },
      ],
      calculate: (inputs) => {
        const cups = parseFloat(inputs.cups as string);
        const ingredient = inputs.ingredient as string;
        if (!cups || cups <= 0) return null;

        // Grams per cup for each ingredient
        const gramsPerCup: Record<string, number> = {
          ap_flour: 125,
          bread_flour: 130,
          cake_flour: 114,
          ww_flour: 128,
          sugar: 200,
          brown_sugar: 220,
          powdered_sugar: 120,
          butter: 227,
          oil: 218,
          milk: 244,
          cream: 238,
          honey: 340,
          oats: 90,
          rice: 185,
          cocoa: 86,
          cornstarch: 128,
        };

        const ingredientLabels: Record<string, string> = {
          ap_flour: "All-Purpose Flour",
          bread_flour: "Bread Flour",
          cake_flour: "Cake Flour",
          ww_flour: "Whole Wheat Flour",
          sugar: "Granulated Sugar",
          brown_sugar: "Brown Sugar (packed)",
          powdered_sugar: "Powdered Sugar",
          butter: "Butter",
          oil: "Vegetable Oil",
          milk: "Milk",
          cream: "Heavy Cream",
          honey: "Honey",
          oats: "Rolled Oats",
          rice: "Rice (uncooked)",
          cocoa: "Cocoa Powder",
          cornstarch: "Cornstarch",
        };

        const gPerCup = gramsPerCup[ingredient] || 125;
        const totalGrams = cups * gPerCup;
        const pounds = totalGrams / 453.592;
        const ounces = totalGrams / 28.3495;
        const wholeOz = Math.floor(ounces);
        const poundsWhole = Math.floor(pounds);
        const remainderOz = ounces - poundsWhole * 16;

        return {
          primary: {
            label: `${formatNumber(cups, 2)} cups ${ingredientLabels[ingredient]}`,
            value: `${formatNumber(pounds, 3)} lbs`,
          },
          details: [
            { label: "Pounds", value: formatNumber(pounds, 3) },
            {
              label: "Pounds & Ounces",
              value: `${formatNumber(poundsWhole)} lb ${formatNumber(remainderOz, 1)} oz`,
            },
            { label: "Ounces", value: formatNumber(ounces, 2) },
            { label: "Grams", value: formatNumber(totalGrams, 1) },
            { label: "Kilograms", value: formatNumber(totalGrams / 1000, 3) },
          ],
        };
      },
    },
    {
      id: "custom-density",
      name: "Custom Density",
      description: "Enter a custom grams-per-cup for any ingredient",
      fields: [
        {
          name: "cups",
          label: "Number of Cups",
          type: "number",
          placeholder: "e.g. 3",
          min: 0,
          step: 0.25,
        },
        {
          name: "gramsPerCup",
          label: "Grams per Cup",
          type: "number",
          placeholder: "e.g. 125",
          min: 1,
        },
      ],
      calculate: (inputs) => {
        const cups = parseFloat(inputs.cups as string);
        const gramsPerCup = parseFloat(inputs.gramsPerCup as string);
        if (!cups || cups <= 0 || !gramsPerCup || gramsPerCup <= 0) return null;

        const totalGrams = cups * gramsPerCup;
        const pounds = totalGrams / 453.592;
        const ounces = totalGrams / 28.3495;

        return {
          primary: {
            label: `${formatNumber(cups, 2)} cups`,
            value: `${formatNumber(pounds, 3)} lbs`,
          },
          details: [
            { label: "Pounds", value: formatNumber(pounds, 3) },
            { label: "Ounces", value: formatNumber(ounces, 2) },
            { label: "Grams", value: formatNumber(totalGrams, 1) },
          ],
        };
      },
    },
  ],
  relatedSlugs: [
    "cooking-converter",
    "pounds-to-cups-calculator",
    "grams-to-teaspoons-calculator",
  ],
  faq: [
    {
      question: "How many cups of flour are in a pound?",
      answer:
        "There are approximately 3.6 cups of all-purpose flour in one pound (453.6 g). Since 1 cup of all-purpose flour weighs about 125 g, a pound contains 453.6 / 125 = ~3.63 cups.",
    },
    {
      question: "Why does the cups-to-pounds conversion vary by ingredient?",
      answer:
        "Different ingredients have different densities. A cup of sugar (200 g) weighs more than a cup of flour (125 g) because sugar granules pack more densely. Always use ingredient-specific conversions for accuracy.",
    },
  ],
  formula:
    "Pounds = (Cups x Grams per Cup) / 453.592 | Ounces = (Cups x Grams per Cup) / 28.3495",
};
