import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const fruitServingCalculator: CalculatorDefinition = {
  slug: "fruit-serving-calculator",
  title: "Fruit Serving Size Calculator",
  description:
    "Free fruit serving size calculator. Determine how much fruit to buy for events, daily intake, or recipes based on serving guidelines.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "fruit serving",
    "fruit per person",
    "fruit platter",
    "fruit portion",
    "daily fruit intake",
  ],
  variants: [
    {
      id: "calc",
      name: "Calculate",
      fields: [
        {
          name: "people",
          label: "Number of People",
          type: "number",
          placeholder: "e.g. 10",
        },
        {
          name: "fruitType",
          label: "Fruit Type",
          type: "select",
          options: [
            { label: "Mixed Fruit Platter", value: "mixed" },
            { label: "Berries (strawberries, blueberries)", value: "berries" },
            { label: "Sliced Melon", value: "melon" },
            { label: "Grapes", value: "grapes" },
            { label: "Apple / Pear Slices", value: "apple" },
            { label: "Citrus Segments", value: "citrus" },
            { label: "Tropical (mango, pineapple)", value: "tropical" },
          ],
        },
        {
          name: "occasion",
          label: "Occasion",
          type: "select",
          options: [
            { label: "Side Dish / Snack", value: "side" },
            { label: "Fruit Platter (Party)", value: "party" },
            { label: "Breakfast Fruit Bowl", value: "breakfast" },
            { label: "Dessert Fruit", value: "dessert" },
          ],
        },
      ],
      calculate: (inputs) => {
        const people = inputs.people as number;
        const fruitType = inputs.fruitType as string;
        const occasion = inputs.occasion as string;
        if (!people || people <= 0) return null;

        const ozPerPerson: Record<string, number> = {
          side: 4,
          party: 6,
          breakfast: 5,
          dessert: 3,
        };

        const wasteFactor: Record<string, number> = {
          mixed: 1.3,
          berries: 1.1,
          melon: 1.5,
          grapes: 1.1,
          apple: 1.2,
          citrus: 1.4,
          tropical: 1.4,
        };

        const perPerson = ozPerPerson[occasion] || 5;
        const waste = wasteFactor[fruitType] || 1.3;
        const totalServingOz = people * perPerson;
        const totalBuyOz = totalServingOz * waste;
        const totalBuyLbs = totalBuyOz / 16;
        const totalBuyKg = totalBuyLbs * 0.4536;
        const cups = totalServingOz / 5;
        const varieties = fruitType === "mixed" ? Math.min(Math.ceil(people / 3), 6) : 1;

        return {
          primary: {
            label: "Total Fruit to Buy",
            value: formatNumber(totalBuyLbs, 1) + " lbs",
          },
          details: [
            { label: "Total (kg)", value: formatNumber(totalBuyKg, 1) + " kg" },
            { label: "Edible Portion", value: formatNumber(totalServingOz / 16, 1) + " lbs" },
            { label: "Serving Cups (approx)", value: formatNumber(cups, 0) + " cups" },
            { label: "Per Person", value: perPerson + " oz" },
            { label: "Waste Factor", value: Math.round((waste - 1) * 100) + "% (peels, cores)" },
            { label: "Suggested Varieties", value: String(varieties) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["party-food-calculator", "cheese-serving-calculator"],
  faq: [
    {
      question: "How much fruit do I need per person for a party?",
      answer:
        "Plan for about 6 ounces of fruit per person for a party platter. Buy about 30% more by weight to account for peeling, coring, and trimming waste.",
    },
    {
      question: "What is a serving of fruit?",
      answer:
        "One serving of fruit is about 1 cup of cut fruit, one medium whole fruit, or half a cup of dried fruit. The USDA recommends 1.5-2 cups of fruit per day for adults.",
    },
  ],
  formula:
    "Fruit to buy = People × Oz per person × Waste factor. Waste factors: Berries/Grapes 1.1, Apple 1.2, Mixed 1.3, Citrus/Tropical 1.4, Melon 1.5.",
};
