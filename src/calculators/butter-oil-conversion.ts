import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const butterOilConversionCalculator: CalculatorDefinition = {
  slug: "butter-oil-conversion-calculator",
  title: "Butter to Oil Conversion Calculator",
  description:
    "Free butter to oil conversion calculator. Convert between butter and oil for baking and cooking. Get exact measurements in cups, tablespoons, and grams.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "butter to oil conversion",
    "oil to butter",
    "substitute butter for oil",
    "baking oil conversion",
    "butter oil ratio",
    "replace butter with oil",
  ],
  variants: [
    {
      id: "butter-to-oil",
      name: "Butter to Oil",
      description: "Convert butter to oil for recipes",
      fields: [
        {
          name: "amount",
          label: "Butter Amount",
          type: "number",
          placeholder: "e.g. 1",
        },
        {
          name: "unit",
          label: "Unit",
          type: "select",
          options: [
            { label: "Cups", value: "cup" },
            { label: "Tablespoons", value: "tbsp" },
            { label: "Sticks", value: "stick" },
            { label: "Grams", value: "gram" },
            { label: "Ounces", value: "oz" },
          ],
        },
        {
          name: "oilType",
          label: "Oil Type",
          type: "select",
          options: [
            { label: "Vegetable / Canola Oil", value: "vegetable" },
            { label: "Olive Oil", value: "olive" },
            { label: "Coconut Oil (melted)", value: "coconut" },
            { label: "Avocado Oil", value: "avocado" },
          ],
        },
      ],
      calculate: (inputs) => {
        const amount = inputs.amount as number;
        const unit = inputs.unit as string;
        const oilType = inputs.oilType as string;
        if (!amount || !unit || !oilType) return null;

        // Convert everything to grams of butter first
        const butterToGrams: Record<string, number> = {
          cup: 227,
          tbsp: 14.18,
          stick: 113.4,
          gram: 1,
          oz: 28.35,
        };

        const butterGrams = amount * (butterToGrams[unit] || 1);

        // Butter is ~80% fat, oil is 100% fat
        // Standard conversion: use 3/4 the amount of oil (by volume)
        // But since oil is 100% fat and butter is 80% fat, by weight: oil = butter x 0.8
        const oilRatio = oilType === "coconut" ? 0.85 : 0.75; // coconut is solid at room temp, use slightly more
        const oilGrams = butterGrams * 0.8;
        const oilCups = (amount * oilRatio);
        const oilTbsp = oilCups * 16;

        // Convert to the same unit they input
        let oilInOriginalUnit: string;
        if (unit === "cup") {
          oilInOriginalUnit = formatNumber(amount * oilRatio, 2) + " cups";
        } else if (unit === "tbsp") {
          oilInOriginalUnit = formatNumber(amount * oilRatio, 1) + " tbsp";
        } else if (unit === "stick") {
          oilInOriginalUnit = formatNumber(amount * oilRatio * 0.5, 2) + " cups (" + formatNumber(amount * oilRatio * 8, 1) + " tbsp)";
        } else if (unit === "gram") {
          oilInOriginalUnit = formatNumber(oilGrams, 0) + " g";
        } else {
          oilInOriginalUnit = formatNumber(oilGrams / 28.35, 2) + " oz";
        }

        const oilNames: Record<string, string> = {
          vegetable: "Vegetable/Canola Oil",
          olive: "Olive Oil",
          coconut: "Coconut Oil (melted)",
          avocado: "Avocado Oil",
        };

        return {
          primary: {
            label: oilNames[oilType] + " Needed",
            value: oilInOriginalUnit,
          },
          details: [
            { label: "Butter Amount", value: amount + " " + unit },
            { label: "Butter (grams)", value: formatNumber(butterGrams, 0) + " g" },
            { label: "Oil (grams)", value: formatNumber(oilGrams, 0) + " g" },
            { label: "Oil (cups)", value: formatNumber((butterGrams * 0.8) / 218, 2) + " cups" },
            { label: "Oil (tablespoons)", value: formatNumber((butterGrams * 0.8) / 13.6, 1) + " tbsp" },
            { label: "Conversion Ratio", value: "3/4 volume (butter is 80% fat, oil is 100%)" },
          ],
          note: "When substituting oil for butter, the texture will be slightly different. Baked goods may be more moist and dense but less flaky.",
        };
      },
    },
    {
      id: "oil-to-butter",
      name: "Oil to Butter",
      description: "Convert oil to butter for recipes",
      fields: [
        {
          name: "amount",
          label: "Oil Amount",
          type: "number",
          placeholder: "e.g. 0.5",
        },
        {
          name: "unit",
          label: "Unit",
          type: "select",
          options: [
            { label: "Cups", value: "cup" },
            { label: "Tablespoons", value: "tbsp" },
            { label: "Grams", value: "gram" },
            { label: "Ounces", value: "oz" },
          ],
        },
      ],
      calculate: (inputs) => {
        const amount = inputs.amount as number;
        const unit = inputs.unit as string;
        if (!amount || !unit) return null;

        const oilToGrams: Record<string, number> = {
          cup: 218,
          tbsp: 13.6,
          gram: 1,
          oz: 28.35,
        };

        const oilGrams = amount * (oilToGrams[unit] || 1);
        const butterGrams = oilGrams / 0.8;
        const butterCups = butterGrams / 227;
        const butterSticks = butterGrams / 113.4;
        const butterTbsp = butterGrams / 14.18;

        return {
          primary: {
            label: "Butter Needed",
            value: formatNumber(butterGrams, 0) + " g",
          },
          details: [
            { label: "Oil Amount", value: amount + " " + unit + " (" + formatNumber(oilGrams, 0) + " g)" },
            { label: "Butter (grams)", value: formatNumber(butterGrams, 0) + " g" },
            { label: "Butter (cups)", value: formatNumber(butterCups, 2) + " cups" },
            { label: "Butter (sticks)", value: formatNumber(butterSticks, 2) + " sticks" },
            { label: "Butter (tablespoons)", value: formatNumber(butterTbsp, 1) + " tbsp" },
          ],
          note: "Add a pinch of salt when substituting butter for oil, as butter contains salt and more water content.",
        };
      },
    },
  ],
  relatedSlugs: ["baking-conversion-calculator", "egg-substitute-calculator"],
  faq: [
    {
      question: "How much oil equals 1 cup of butter?",
      answer:
        "Use 3/4 cup (12 tablespoons) of oil to replace 1 cup of butter. This is because butter is about 80% fat and 20% water and milk solids, while oil is 100% fat. Using less oil compensates for this difference.",
    },
    {
      question: "Can I substitute oil for butter in all recipes?",
      answer:
        "Oil works well in quick breads, muffins, cakes, and brownies. However, it won't work for recipes that rely on creaming butter with sugar for air (like butter cookies) or where solid fat creates flaky layers (like pie crust and puff pastry).",
    },
    {
      question: "What is the best oil substitute for butter?",
      answer:
        "For baking, neutral oils like canola or vegetable oil work best. Coconut oil is good for a 1:1 swap in many recipes since it's solid at room temperature like butter. Olive oil adds flavor and works well in savory baking.",
    },
  ],
  formula:
    "Butter to Oil: Oil = Butter x 0.75 (by volume) or Butter x 0.8 (by weight). 1 cup butter = 3/4 cup oil. 1 stick butter = 6 tbsp oil. Butter is ~80% fat, oil is 100% fat.",
};
