import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const cookieBatchCalculator: CalculatorDefinition = {
  slug: "cookie-batch-calculator",
  title: "Cookie Batch Size Calculator",
  description:
    "Free cookie batch size calculator. Scale cookie recipes up or down and calculate ingredient amounts for any number of cookies.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "cookie batch",
    "cookie recipe scaler",
    "how many cookies",
    "cookie ingredients",
    "batch size",
  ],
  variants: [
    {
      id: "calc",
      name: "Calculate",
      fields: [
        {
          name: "cookiesWanted",
          label: "Number of Cookies Wanted",
          type: "number",
          placeholder: "e.g. 48",
        },
        {
          name: "cookieType",
          label: "Cookie Type",
          type: "select",
          options: [
            { label: "Chocolate Chip", value: "chocolate_chip" },
            { label: "Sugar Cookies", value: "sugar" },
            { label: "Oatmeal Raisin", value: "oatmeal" },
            { label: "Peanut Butter", value: "peanut_butter" },
            { label: "Snickerdoodle", value: "snickerdoodle" },
          ],
        },
        {
          name: "cookieSize",
          label: "Cookie Size",
          type: "select",
          options: [
            { label: "Small (1 tbsp dough)", value: "small" },
            { label: "Medium (2 tbsp dough)", value: "medium" },
            { label: "Large (3 tbsp dough)", value: "large" },
          ],
        },
      ],
      calculate: (inputs) => {
        const cookiesWanted = inputs.cookiesWanted as number;
        const cookieType = inputs.cookieType as string;
        const cookieSize = inputs.cookieSize as string;
        if (!cookiesWanted || cookiesWanted <= 0) return null;

        const baseYield: Record<string, number> = {
          small: 60,
          medium: 36,
          large: 24,
        };
        const base = baseYield[cookieSize] || 36;
        const scaleFactor = cookiesWanted / base;

        const recipes: Record<string, { flour: number; butter: number; sugar: number; eggs: number; extra: string; extraAmt: number }> = {
          chocolate_chip: { flour: 280, butter: 227, sugar: 200, eggs: 2, extra: "Chocolate Chips", extraAmt: 340 },
          sugar: { flour: 300, butter: 227, sugar: 250, eggs: 2, extra: "Vanilla Extract (tsp)", extraAmt: 2 },
          oatmeal: { flour: 190, butter: 227, sugar: 200, eggs: 2, extra: "Rolled Oats", extraAmt: 200 },
          peanut_butter: { flour: 190, butter: 113, sugar: 200, eggs: 2, extra: "Peanut Butter", extraAmt: 250 },
          snickerdoodle: { flour: 330, butter: 227, sugar: 200, eggs: 2, extra: "Cinnamon (tsp)", extraAmt: 2 },
        };

        const recipe = recipes[cookieType] || recipes.chocolate_chip;
        const flour = recipe.flour * scaleFactor;
        const butter = recipe.butter * scaleFactor;
        const sugar = recipe.sugar * scaleFactor;
        const eggs = Math.round(recipe.eggs * scaleFactor);
        const extra = recipe.extraAmt * scaleFactor;
        const batchesNeeded = Math.ceil(cookiesWanted / 24);
        const bakeTime = cookieSize === "small" ? "8-10" : cookieSize === "medium" ? "10-12" : "12-14";

        return {
          primary: {
            label: "Flour",
            value: formatNumber(flour, 0) + " g",
          },
          details: [
            { label: "Butter", value: formatNumber(butter, 0) + " g" },
            { label: "Sugar", value: formatNumber(sugar, 0) + " g" },
            { label: "Eggs", value: String(eggs) },
            { label: recipe.extra, value: formatNumber(extra, 0) + (recipe.extra.includes("tsp") ? "" : " g") },
            { label: "Oven Batches (1 sheet)", value: String(batchesNeeded) },
            { label: "Bake Time at 350°F", value: bakeTime + " min" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["baking-conversion-calculator", "recipe-scaler-calculator"],
  faq: [
    {
      question: "How many cookies does a standard batch make?",
      answer:
        "A standard cookie recipe using 2.25 cups of flour makes about 36 medium cookies (2 tablespoons of dough each) or 60 small cookies (1 tablespoon each).",
    },
    {
      question: "Can I halve or double a cookie recipe?",
      answer:
        "Yes, cookie recipes scale well. When halving, use 1 egg for recipes calling for 2. When doubling, keep the same oven temperature but be careful not to overcrowd the baking sheet.",
    },
  ],
  formula:
    "Scale Factor = Cookies Wanted / Base Yield. Each ingredient = Base Amount × Scale Factor. Base yields: Small 60, Medium 36, Large 24 per standard batch.",
};
