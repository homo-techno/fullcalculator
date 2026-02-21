import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const alcoholCalorieCalculator: CalculatorDefinition = {
  slug: "alcohol-calorie-calculator",
  title: "Alcohol Calorie Calculator",
  description:
    "Free alcohol calorie calculator. Calculate how many calories are in your drinks based on drink type, volume, and ABV percentage. Track alcohol calories for weight management.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "alcohol calorie calculator",
    "calories in alcohol",
    "beer calorie calculator",
    "wine calories",
    "cocktail calorie calculator",
    "drink calorie calculator",
  ],
  variants: [
    {
      id: "custom",
      name: "Custom Drink",
      description: "Calculate calories for any alcoholic drink",
      fields: [
        {
          name: "drinkType",
          label: "Drink Type",
          type: "select",
          options: [
            { label: "Beer", value: "beer" },
            { label: "Wine", value: "wine" },
            { label: "Spirits (vodka, whiskey, etc.)", value: "spirits" },
            { label: "Cocktail / Mixed Drink", value: "cocktail" },
          ],
          defaultValue: "beer",
        },
        { name: "volume", label: "Volume", type: "number", placeholder: "e.g. 12", suffix: "oz" },
        { name: "abv", label: "ABV (Alcohol by Volume)", type: "number", placeholder: "e.g. 5", suffix: "%" },
        { name: "numDrinks", label: "Number of Drinks", type: "number", placeholder: "e.g. 2", defaultValue: 1 },
      ],
      calculate: (inputs) => {
        const drinkType = inputs.drinkType as string;
        const volume = inputs.volume as number;
        const abv = inputs.abv as number;
        const numDrinks = (inputs.numDrinks as number) || 1;
        if (!volume || !abv) return null;

        const alcoholOz = volume * (abv / 100);
        const alcoholCalories = alcoholOz * 0.6 * 7 * 1.6;

        let extraCalories = 0;
        let extraNote = "";
        if (drinkType === "beer") {
          extraCalories = volume * (abv / 100) * 10;
          extraNote = "Includes estimated carb calories from beer";
        } else if (drinkType === "wine") {
          extraCalories = volume * 2;
          extraNote = "Includes estimated residual sugar calories";
        } else if (drinkType === "cocktail") {
          extraCalories = volume * 5;
          extraNote = "Includes estimated mixer/sugar calories (varies widely by recipe)";
        } else {
          extraNote = "Pure spirits have virtually no carbs";
        }

        const totalPerDrink = alcoholCalories + extraCalories;
        const totalAll = totalPerDrink * numDrinks;

        return {
          primary: { label: "Total Calories", value: formatNumber(totalAll, 0) },
          details: [
            { label: "Calories Per Drink", value: formatNumber(totalPerDrink, 0) },
            { label: "Alcohol Calories", value: `${formatNumber(alcoholCalories * numDrinks, 0)}` },
            { label: "Other Calories (carbs/sugar)", value: `${formatNumber(extraCalories * numDrinks, 0)}` },
            { label: "Pure Alcohol", value: `${formatNumber(alcoholOz * numDrinks, 1)} oz` },
            { label: "Number of Drinks", value: `${numDrinks}` },
          ],
          note: extraNote,
        };
      },
    },
  ],
  relatedSlugs: ["calorie-calculator", "bac-calculator", "macro-calculator"],
  faq: [
    {
      question: "How many calories are in alcohol?",
      answer:
        "Pure alcohol contains 7 calories per gram, making it almost as calorie-dense as fat (9 cal/g). A standard drink (12 oz beer, 5 oz wine, or 1.5 oz spirits) contains roughly 100-150 calories from alcohol alone, plus additional calories from carbs and sugar.",
    },
    {
      question: "What alcoholic drink has the fewest calories?",
      answer:
        "Spirits (vodka, gin, whiskey) neat or with zero-calorie mixers have the fewest calories at about 65-100 per serving. Light beer (90-100 cal) and dry wine (120 cal) are also lower-calorie options. Cocktails with juice or soda can have 200-500+ calories.",
    },
    {
      question: "Do alcohol calories count toward weight gain?",
      answer:
        "Yes. Alcohol calories do count and can contribute to weight gain. Additionally, alcohol can lower inhibitions and increase appetite, leading to overeating. The body also prioritizes metabolizing alcohol over other nutrients, which can slow fat burning.",
    },
  ],
  formula:
    "Alcohol Calories = Volume (oz) × ABV% × 0.6 × 7 cal/g × 1.6 (density factor) | Additional calories from carbs/sugar vary by drink type",
};
