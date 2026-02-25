import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const pastaWaterCalculator: CalculatorDefinition = {
  slug: "pasta-water-calculator",
  title: "Pasta Water Ratio Calculator",
  description:
    "Free pasta water ratio calculator. Get the right amount of water, salt, and pasta for perfectly cooked pasta every time.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "pasta water ratio",
    "how much water for pasta",
    "pasta salt",
    "cooking pasta",
    "pasta per person",
  ],
  variants: [
    {
      id: "calc",
      name: "Calculate",
      fields: [
        {
          name: "servings",
          label: "Number of Servings",
          type: "number",
          placeholder: "e.g. 4",
        },
        {
          name: "pastaType",
          label: "Pasta Type",
          type: "select",
          options: [
            { label: "Long (Spaghetti, Linguine)", value: "long" },
            { label: "Short (Penne, Rigatoni)", value: "short" },
            { label: "Tiny (Orzo, Ditalini)", value: "tiny" },
            { label: "Egg Noodles", value: "egg" },
            { label: "Fresh Pasta", value: "fresh" },
            { label: "Filled (Ravioli, Tortellini)", value: "filled" },
          ],
        },
        {
          name: "appetite",
          label: "Serving Size",
          type: "select",
          options: [
            { label: "Side Dish (2 oz dry)", value: "side" },
            { label: "Regular (3 oz dry)", value: "regular" },
            { label: "Generous (4 oz dry)", value: "generous" },
          ],
        },
      ],
      calculate: (inputs) => {
        const servings = inputs.servings as number;
        const pastaType = inputs.pastaType as string;
        const appetite = inputs.appetite as string;
        if (!servings || servings <= 0) return null;

        const ozPerServing: Record<string, number> = {
          side: 2,
          regular: 3,
          generous: 4,
        };

        const cookTime: Record<string, string> = {
          long: "8-12",
          short: "10-14",
          tiny: "6-9",
          egg: "6-8",
          fresh: "2-4",
          filled: "4-6",
        };

        const dryOzPerServing = ozPerServing[appetite] || 3;
        const totalDryOz = servings * dryOzPerServing;
        const totalDryGrams = totalDryOz * 28.35;
        const waterQuarts = Math.max(4, Math.ceil(totalDryOz / 4) * 4);
        const waterLiters = waterQuarts * 0.946;
        const saltTbsp = waterQuarts;
        const saltGrams = saltTbsp * 18;
        const cookedWeight = pastaType === "fresh" ? totalDryGrams * 1.5 : totalDryGrams * 2;
        const time = cookTime[pastaType] || "8-12";

        return {
          primary: {
            label: "Water Needed",
            value: formatNumber(waterQuarts, 0) + " quarts",
          },
          details: [
            { label: "Water (liters)", value: formatNumber(waterLiters, 1) + " L" },
            { label: "Salt", value: saltTbsp + " tbsp (" + formatNumber(saltGrams, 0) + "g)" },
            { label: "Dry Pasta", value: formatNumber(totalDryOz, 0) + " oz (" + formatNumber(totalDryGrams, 0) + "g)" },
            { label: "Cooked Weight (approx)", value: formatNumber(cookedWeight, 0) + " g" },
            { label: "Cook Time", value: time + " min" },
            { label: "Rule", value: "4 qt water + 1 tbsp salt per 4 oz pasta" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["pasta-serving-calculator", "cooking-calculator"],
  faq: [
    {
      question: "How much water do I need to cook pasta?",
      answer:
        "Use at least 4 quarts (1 gallon) of water for up to 1 pound of pasta. The general rule is 4 quarts of water per 4 ounces of dry pasta.",
    },
    {
      question: "How much salt should I add to pasta water?",
      answer:
        "Add 1 tablespoon of kosher salt per 4 quarts of water. The water should taste pleasantly salty, like the sea. This is the only chance to season the pasta itself.",
    },
  ],
  formula:
    "Water = max(4, ceil(pasta oz / 4) × 4) quarts. Salt = 1 tbsp per 4 quarts. Dry pasta per person: Side 2oz, Regular 3oz, Generous 4oz. Pasta roughly doubles in weight when cooked.",
};
