import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const pastaServingCalculator: CalculatorDefinition = {
  slug: "pasta-serving-calculator",
  title: "Pasta Serving Size Calculator",
  description:
    "Free pasta serving size calculator. Calculate how much dry pasta to cook per person for any pasta shape and meal type.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "pasta serving size",
    "how much pasta per person",
    "pasta calculator",
    "dry pasta per serving",
    "pasta for a crowd",
    "spaghetti serving size",
  ],
  variants: [
    {
      id: "calc",
      name: "Calculate Pasta Amount",
      fields: [
        {
          name: "people",
          label: "Number of People",
          type: "number",
          placeholder: "e.g. 6",
        },
        {
          name: "pastaType",
          label: "Pasta Shape",
          type: "select",
          options: [
            { label: "Long (Spaghetti, Linguine, Fettuccine)", value: "long" },
            { label: "Short (Penne, Rigatoni, Fusilli)", value: "short" },
            { label: "Small (Orzo, Ditalini, Macaroni)", value: "small" },
            { label: "Egg Noodles", value: "egg" },
            { label: "Fresh Pasta", value: "fresh" },
          ],
        },
        {
          name: "mealType",
          label: "Meal Type",
          type: "select",
          options: [
            { label: "Main Course", value: "main" },
            { label: "Side Dish", value: "side" },
            { label: "Appetizer / Starter", value: "appetizer" },
            { label: "Hungry Adults", value: "hungry" },
          ],
        },
      ],
      calculate: (inputs) => {
        const people = inputs.people as number;
        const pastaType = inputs.pastaType as string;
        const mealType = inputs.mealType as string;
        if (!people || !pastaType || !mealType) return null;

        // Grams of dry pasta per person
        const servingSizes: Record<string, Record<string, number>> = {
          long: { main: 100, side: 60, appetizer: 50, hungry: 140 },
          short: { main: 100, side: 60, appetizer: 50, hungry: 140 },
          small: { main: 85, side: 50, appetizer: 40, hungry: 115 },
          egg: { main: 85, side: 50, appetizer: 40, hungry: 115 },
          fresh: { main: 130, side: 80, appetizer: 65, hungry: 175 },
        };

        const gramsPerPerson = servingSizes[pastaType]?.[mealType] || 100;
        const totalGrams = gramsPerPerson * people;
        const totalOz = totalGrams / 28.3495;
        const totalLbs = totalOz / 16;
        // Pasta roughly doubles in weight when cooked
        const cookedWeight = pastaType === "fresh" ? totalGrams * 1.5 : totalGrams * 2.25;
        const waterLiters = totalGrams / 100; // 1L per 100g rule

        return {
          primary: {
            label: "Dry Pasta Needed",
            value: formatNumber(totalGrams, 0) + " g",
          },
          details: [
            { label: "Per Person (dry)", value: gramsPerPerson + " g" },
            { label: "Total (ounces)", value: formatNumber(totalOz, 1) + " oz" },
            { label: "Total (pounds)", value: formatNumber(totalLbs, 2) + " lbs" },
            { label: "Cooked Weight (approx)", value: formatNumber(cookedWeight, 0) + " g" },
            { label: "Water Needed", value: formatNumber(waterLiters, 1) + " liters" },
            { label: "Salt for Water", value: formatNumber(waterLiters * 10, 0) + " g" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["rice-water-ratio-calculator", "meal-prep-calculator", "party-food-calculator"],
  faq: [
    {
      question: "How much dry pasta per person?",
      answer:
        "For a main course, plan for 100g (3.5 oz) of dry pasta per person. For a side dish, use about 60g (2 oz). Fresh pasta requires more per serving since it doesn't expand as much - about 130g per person.",
    },
    {
      question: "How much does dry pasta expand when cooked?",
      answer:
        "Dry pasta roughly doubles to 2.25x its weight when cooked. So 100g of dry spaghetti becomes about 200-225g of cooked pasta. Fresh pasta only expands about 1.5x its weight.",
    },
    {
      question: "How much water do I need to cook pasta?",
      answer:
        "Use at least 1 liter (4 cups) of water per 100g of dry pasta. Add about 10g of salt per liter of water. The water should be at a rolling boil before adding pasta.",
    },
  ],
  formula:
    "Dry Pasta (g) = Servings x Grams per Person. Main course = 100g/person, Side = 60g/person, Appetizer = 50g/person. Fresh pasta: Main = 130g/person. Cooked weight ~2.25x dry weight. Use 1L water per 100g pasta.",
};
