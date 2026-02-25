import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const butterToOilCalculator: CalculatorDefinition = {
  slug: "butter-to-oil-calculator",
  title: "Butter to Oil Conversion",
  description:
    "Free butter to oil conversion calculator. Convert between butter and cooking oil amounts for baking and cooking recipes.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "butter to oil",
    "oil to butter",
    "baking substitute",
    "butter conversion",
    "cooking oil substitute",
  ],
  variants: [
    {
      id: "calc",
      name: "Calculate",
      fields: [
        {
          name: "amount",
          label: "Amount",
          type: "number",
          placeholder: "e.g. 1",
        },
        {
          name: "unit",
          label: "Unit",
          type: "select",
          options: [
            { label: "Cups of Butter", value: "cups_butter" },
            { label: "Tablespoons of Butter", value: "tbsp_butter" },
            { label: "Sticks of Butter", value: "sticks_butter" },
            { label: "Grams of Butter", value: "grams_butter" },
          ],
        },
        {
          name: "oilType",
          label: "Oil Type",
          type: "select",
          options: [
            { label: "Vegetable Oil", value: "vegetable" },
            { label: "Olive Oil", value: "olive" },
            { label: "Coconut Oil", value: "coconut" },
            { label: "Canola Oil", value: "canola" },
          ],
        },
      ],
      calculate: (inputs) => {
        const amount = inputs.amount as number;
        const unit = inputs.unit as string;
        const oilType = inputs.oilType as string;
        if (!amount || amount <= 0) return null;

        let butterGrams: number;
        switch (unit) {
          case "cups_butter":
            butterGrams = amount * 227;
            break;
          case "tbsp_butter":
            butterGrams = amount * 14.2;
            break;
          case "sticks_butter":
            butterGrams = amount * 113;
            break;
          case "grams_butter":
            butterGrams = amount;
            break;
          default:
            butterGrams = amount * 227;
        }

        const conversionRatio = 0.80;
        const oilGrams = butterGrams * conversionRatio;
        const oilMl = oilGrams / 0.92;
        const oilTbsp = oilMl / 14.787;
        const oilCups = oilTbsp / 16;
        const calSaved = butterGrams * 7.17 - oilGrams * 8.84;

        const oilLabel =
          oilType === "vegetable"
            ? "Vegetable Oil"
            : oilType === "olive"
              ? "Olive Oil"
              : oilType === "coconut"
                ? "Coconut Oil"
                : "Canola Oil";

        return {
          primary: {
            label: oilLabel + " Needed",
            value: formatNumber(oilMl, 0) + " ml",
          },
          details: [
            { label: "Oil (tablespoons)", value: formatNumber(oilTbsp, 1) + " tbsp" },
            { label: "Oil (cups)", value: formatNumber(oilCups, 2) + " cups" },
            { label: "Oil (grams)", value: formatNumber(oilGrams, 0) + " g" },
            { label: "Butter (grams)", value: formatNumber(butterGrams, 0) + " g" },
            { label: "Conversion Ratio", value: "80% (¾ + 1 tbsp rule)" },
            { label: "Approx. Calorie Difference", value: formatNumber(Math.abs(calSaved), 0) + " cal" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["baking-conversion-calculator", "cooking-calculator"],
  faq: [
    {
      question: "How do I convert butter to oil?",
      answer:
        "Use approximately 80% of the butter amount when substituting oil. For example, 1 cup of butter (227g) becomes about 180g (¾ cup + 1 tablespoon) of oil.",
    },
    {
      question: "Can I substitute oil for butter in any recipe?",
      answer:
        "Oil works best as a butter substitute in cakes, muffins, and quick breads. It is not recommended for pastries, pie crusts, or recipes that require creaming butter with sugar.",
    },
  ],
  formula:
    "Oil Amount = Butter Amount × 0.80. One stick of butter = 113g = 8 tbsp. One cup of butter = 227g = 2 sticks.",
};
