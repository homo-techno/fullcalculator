import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const breadHydrationCalculator: CalculatorDefinition = {
  slug: "bread-hydration-calculator",
  title: "Bread Hydration Calculator",
  description:
    "Free bread hydration calculator. Calculate the hydration percentage of your bread dough and get water and flour amounts for any hydration level.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "bread hydration",
    "dough hydration",
    "baker's percentage",
    "bread recipe",
    "sourdough hydration",
  ],
  variants: [
    {
      id: "calc",
      name: "Calculate",
      fields: [
        {
          name: "flour",
          label: "Flour Weight (grams)",
          type: "number",
          placeholder: "e.g. 500",
        },
        {
          name: "hydration",
          label: "Target Hydration (%)",
          type: "select",
          options: [
            { label: "55% (Bagels, Stiff)", value: "55" },
            { label: "60% (Sandwich Bread)", value: "60" },
            { label: "65% (French Bread)", value: "65" },
            { label: "70% (General Purpose)", value: "70" },
            { label: "75% (Ciabatta, Artisan)", value: "75" },
            { label: "80% (High Hydration)", value: "80" },
            { label: "85% (Focaccia)", value: "85" },
          ],
        },
      ],
      calculate: (inputs) => {
        const flour = inputs.flour as number;
        const hydration = parseFloat(inputs.hydration as string) || 70;
        if (!flour || flour <= 0) return null;

        const water = flour * (hydration / 100);
        const salt = flour * 0.02;
        const yeast = flour * 0.01;
        const totalDough = flour + water + salt + yeast;
        const loaves = Math.round(totalDough / 500);

        return {
          primary: {
            label: "Water Needed",
            value: formatNumber(water, 0) + " g",
          },
          details: [
            { label: "Flour", value: formatNumber(flour, 0) + " g" },
            { label: "Hydration", value: hydration + "%" },
            { label: "Salt (2%)", value: formatNumber(salt, 1) + " g" },
            { label: "Yeast (1%)", value: formatNumber(yeast, 1) + " g" },
            { label: "Total Dough Weight", value: formatNumber(totalDough, 0) + " g" },
            { label: "Approximate Loaves", value: loaves > 0 ? String(loaves) : "1" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["pizza-dough-calculator", "baking-conversion-calculator"],
  faq: [
    {
      question: "What does bread hydration mean?",
      answer:
        "Bread hydration is the ratio of water to flour by weight, expressed as a percentage. A 70% hydration dough has 70g of water for every 100g of flour.",
    },
    {
      question: "What hydration is best for beginners?",
      answer:
        "Start with 65-70% hydration. It is easier to handle than wetter doughs. As you gain experience, you can work with higher hydration levels (75-85%) for a more open crumb.",
    },
  ],
  formula:
    "Water = Flour × (Hydration% / 100). Salt = Flour × 2%. Yeast = Flour × 1%. Total Dough = Flour + Water + Salt + Yeast.",
};
