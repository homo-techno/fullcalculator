import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const coffeeRatioCalculator: CalculatorDefinition = {
  slug: "coffee-ratio-calculator",
  title: "Coffee Ratio Calculator",
  description:
    "Free coffee ratio calculator. Find the perfect coffee-to-water ratio for any brew strength and number of cups.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "coffee ratio",
    "coffee to water",
    "brew calculator",
    "golden ratio coffee",
    "coffee grams",
  ],
  variants: [
    {
      id: "calc",
      name: "Calculate",
      fields: [
        {
          name: "cups",
          label: "Number of Cups",
          type: "number",
          placeholder: "e.g. 2",
        },
        {
          name: "strength",
          label: "Strength",
          type: "select",
          options: [
            { label: "Strong (1:15)", value: "15" },
            { label: "Medium (1:16)", value: "16" },
            { label: "Mild (1:18)", value: "18" },
          ],
        },
      ],
      calculate: (inputs) => {
        const cups = inputs.cups as number;
        const ratio = parseFloat(inputs.strength as string) || 16;
        if (!cups || cups <= 0) return null;

        const mlPerCup = 177;
        const totalWaterMl = cups * mlPerCup;
        const totalWaterOz = cups * 6;
        const coffeeGrams = totalWaterMl / ratio;

        return {
          primary: {
            label: "Coffee Needed",
            value: formatNumber(coffeeGrams, 1) + " g",
          },
          details: [
            { label: "Water Needed", value: formatNumber(totalWaterMl, 0) + " ml" },
            { label: "Water (oz)", value: formatNumber(totalWaterOz, 0) + " oz" },
            { label: "Ratio", value: "1:" + ratio },
            { label: "Cups", value: String(cups) },
            {
              label: "Tablespoons (approx)",
              value: formatNumber(coffeeGrams / 5, 1),
            },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["party-food-calculator"],
  faq: [
    {
      question: "What is the golden ratio for coffee?",
      answer:
        "The golden ratio for coffee is generally considered 1:15 to 1:18 (coffee to water by weight). A 1:16 ratio is the most commonly recommended starting point for drip coffee.",
    },
    {
      question: "How much coffee do I need per cup?",
      answer:
        "For a standard 6 oz cup using a medium strength (1:16 ratio), you need about 11 grams of coffee, which is roughly 2 tablespoons.",
    },
  ],
  formula:
    "Coffee (g) = Water (ml) / Ratio. One cup = 6 oz = 177 ml. Ratios: Strong 1:15, Medium 1:16, Mild 1:18.",
};
