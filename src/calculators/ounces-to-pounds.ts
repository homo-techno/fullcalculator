import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const ouncesToPoundsConverter: CalculatorDefinition = {
  slug: "ounces-to-pounds-converter",
  title: "Ounces to Pounds Converter",
  description:
    "Free ounces to pounds converter. Instantly convert oz to lbs with formula and examples. Formula: lbs = oz ÷ 16.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: [
    "ounces to pounds",
    "oz to lbs",
    "convert ounces to pounds",
    "ounce to pound",
    "weight conversion",
  ],
  variants: [
    {
      id: "ounces-to-pounds",
      name: "Ounces to Pounds",
      fields: [
        {
          name: "ounces",
          label: "Ounces (oz)",
          type: "number",
          placeholder: "e.g. 32",
        },
      ],
      calculate: (inputs) => {
        const oz = inputs.ounces as number;
        if (oz === undefined || oz === null) return null;
        const lbs = oz / 16;
        const grams = oz * 28.3495;
        const kg = oz * 0.0283495;
        return {
          primary: {
            label: `${formatNumber(oz, 2)} oz`,
            value: `${formatNumber(lbs, 4)} lbs`,
          },
          details: [
            { label: "Pounds", value: formatNumber(lbs, 4) },
            { label: "Grams", value: `${formatNumber(grams, 2)} g` },
            { label: "Kilograms", value: `${formatNumber(kg, 4)} kg` },
            { label: "Formula", value: "lbs = oz ÷ 16" },
          ],
        };
      },
    },
  ],
  relatedSlugs: [
    "pounds-to-ounces-converter",
    "ounces-to-grams-converter",
    "kg-to-pounds-converter",
    "weight-converter",
  ],
  faq: [
    {
      question: "How many pounds is 32 ounces?",
      answer:
        "32 ounces = 2 pounds. Divide 32 by 16 to get 2 lbs.",
    },
    {
      question: "How do you convert ounces to pounds?",
      answer:
        "Divide the number of ounces by 16. There are 16 ounces in 1 pound.",
    },
  ],
  formula: "lbs = oz ÷ 16",
};
