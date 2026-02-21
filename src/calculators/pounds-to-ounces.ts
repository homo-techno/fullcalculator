import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const poundsToOuncesConverter: CalculatorDefinition = {
  slug: "pounds-to-ounces-converter",
  title: "Pounds to Ounces Converter",
  description:
    "Free pounds to ounces converter. Instantly convert lbs to oz with formula and examples. Formula: oz = lbs × 16.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: [
    "pounds to ounces",
    "lbs to oz",
    "convert pounds to ounces",
    "pound to ounce",
    "weight conversion",
  ],
  variants: [
    {
      id: "pounds-to-ounces",
      name: "Pounds to Ounces",
      fields: [
        {
          name: "pounds",
          label: "Pounds (lbs)",
          type: "number",
          placeholder: "e.g. 5",
        },
      ],
      calculate: (inputs) => {
        const lbs = inputs.pounds as number;
        if (lbs === undefined || lbs === null) return null;
        const oz = lbs * 16;
        const grams = lbs * 453.592;
        const kg = lbs * 0.453592;
        return {
          primary: {
            label: `${formatNumber(lbs, 2)} lbs`,
            value: `${formatNumber(oz, 2)} oz`,
          },
          details: [
            { label: "Ounces", value: formatNumber(oz, 4) },
            { label: "Grams", value: `${formatNumber(grams, 2)} g` },
            { label: "Kilograms", value: `${formatNumber(kg, 4)} kg` },
            { label: "Formula", value: "oz = lbs × 16" },
          ],
        };
      },
    },
  ],
  relatedSlugs: [
    "ounces-to-pounds-converter",
    "pounds-to-kg-converter",
    "ounces-to-grams-converter",
    "weight-converter",
  ],
  faq: [
    {
      question: "How many ounces are in a pound?",
      answer:
        "There are 16 ounces in 1 pound. To convert pounds to ounces, multiply by 16.",
    },
    {
      question: "How many ounces is 5 pounds?",
      answer:
        "5 pounds = 80 ounces. Multiply 5 by 16 to get 80 oz.",
    },
  ],
  formula: "oz = lbs × 16",
};
