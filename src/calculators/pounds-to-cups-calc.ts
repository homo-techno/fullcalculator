import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const poundsToCupsCalculator: CalculatorDefinition = {
  slug: "pounds-to-cups-calculator",
  title: "Pounds to Cups Converter",
  description:
    "Free pounds to cups converter for cooking and baking. Convert pounds and ounces to cups for flour, sugar, butter, and other common ingredients.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: [
    "pounds to cups",
    "lbs to cups",
    "flour pounds to cups",
    "sugar pounds to cups",
    "weight to volume",
    "baking pounds cups",
  ],
  variants: [
    {
      id: "by-ingredient",
      name: "By Ingredient",
      description: "Convert pounds to cups for a specific ingredient",
      fields: [
        {
          name: "pounds",
          label: "Weight (pounds)",
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
            { label: "Granulated Sugar", value: "sugar" },
            { label: "Brown Sugar (packed)", value: "brown_sugar" },
            { label: "Powdered Sugar", value: "powdered_sugar" },
            { label: "Butter", value: "butter" },
            { label: "Vegetable Oil", value: "oil" },
            { label: "Milk", value: "milk" },
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
        const pounds = parseFloat(inputs.pounds as string);
        const ingredient = inputs.ingredient as string;
        if (!pounds || pounds <= 0) return null;

        const gramsPerCup: Record<string, number> = {
          ap_flour: 125,
          bread_flour: 130,
          cake_flour: 114,
          sugar: 200,
          brown_sugar: 220,
          powdered_sugar: 120,
          butter: 227,
          oil: 218,
          milk: 244,
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
          sugar: "Granulated Sugar",
          brown_sugar: "Brown Sugar (packed)",
          powdered_sugar: "Powdered Sugar",
          butter: "Butter",
          oil: "Vegetable Oil",
          milk: "Milk",
          honey: "Honey",
          oats: "Rolled Oats",
          rice: "Rice (uncooked)",
          cocoa: "Cocoa Powder",
          cornstarch: "Cornstarch",
        };

        const gPerCup = gramsPerCup[ingredient] || 125;
        const totalGrams = pounds * 453.592;
        const cups = totalGrams / gPerCup;
        const wholeCups = Math.floor(cups);
        const remainderTbsp = (cups - wholeCups) * 16;

        return {
          primary: {
            label: `${formatNumber(pounds, 2)} lbs ${ingredientLabels[ingredient]}`,
            value: `${formatNumber(cups, 2)} cups`,
          },
          details: [
            { label: "Cups (decimal)", value: formatNumber(cups, 2) },
            {
              label: "Cups & Tablespoons",
              value: `${formatNumber(wholeCups)} cups + ${formatNumber(remainderTbsp, 1)} tbsp`,
            },
            { label: "Tablespoons (total)", value: formatNumber(cups * 16, 1) },
            { label: "Grams", value: formatNumber(totalGrams, 1) },
            { label: "Ounces", value: formatNumber(pounds * 16, 2) },
          ],
        };
      },
    },
    {
      id: "ounces-to-cups",
      name: "Ounces to Cups",
      description: "Convert ounces to cups for a specific ingredient",
      fields: [
        {
          name: "ounces",
          label: "Weight (ounces)",
          type: "number",
          placeholder: "e.g. 8",
          min: 0,
          step: 0.5,
        },
        {
          name: "ingredient",
          label: "Ingredient",
          type: "select",
          options: [
            { label: "All-Purpose Flour", value: "ap_flour" },
            { label: "Granulated Sugar", value: "sugar" },
            { label: "Brown Sugar (packed)", value: "brown_sugar" },
            { label: "Butter", value: "butter" },
            { label: "Milk", value: "milk" },
            { label: "Honey", value: "honey" },
            { label: "Rolled Oats", value: "oats" },
            { label: "Cocoa Powder", value: "cocoa" },
          ],
          defaultValue: "ap_flour",
        },
      ],
      calculate: (inputs) => {
        const ounces = parseFloat(inputs.ounces as string);
        const ingredient = inputs.ingredient as string;
        if (!ounces || ounces <= 0) return null;

        const gramsPerCup: Record<string, number> = {
          ap_flour: 125,
          sugar: 200,
          brown_sugar: 220,
          butter: 227,
          milk: 244,
          honey: 340,
          oats: 90,
          cocoa: 86,
        };

        const gPerCup = gramsPerCup[ingredient] || 125;
        const totalGrams = ounces * 28.3495;
        const cups = totalGrams / gPerCup;

        return {
          primary: {
            label: `${formatNumber(ounces, 1)} oz`,
            value: `${formatNumber(cups, 2)} cups`,
          },
          details: [
            { label: "Cups", value: formatNumber(cups, 2) },
            { label: "Grams", value: formatNumber(totalGrams, 1) },
            { label: "Pounds", value: formatNumber(ounces / 16, 3) },
          ],
        };
      },
    },
  ],
  relatedSlugs: [
    "cooking-converter",
    "cups-to-pounds-calculator",
    "grams-to-teaspoons-calculator",
  ],
  faq: [
    {
      question: "How many cups of sugar are in a pound?",
      answer:
        "There are approximately 2.27 cups of granulated sugar in one pound. Since one cup of sugar weighs about 200 g and a pound is 453.6 g, a pound equals 453.6 / 200 = ~2.27 cups.",
    },
    {
      question: "How do I convert pounds of butter to cups?",
      answer:
        "One pound of butter equals 2 cups (4 sticks). Each stick of butter is 1/2 cup or 8 tablespoons (113.5 g). This makes butter one of the easiest ingredients to convert.",
    },
    {
      question: "Why is weight-based measurement more accurate for baking?",
      answer:
        "Measuring by weight eliminates variations from how ingredients are scooped or packed. A cup of flour can range from 110 g to 160 g depending on technique, but 125 g of flour is always 125 g.",
    },
  ],
  formula:
    "Cups = (Pounds x 453.592) / Grams per Cup | 1 lb = 16 oz = 453.592 g",
};
