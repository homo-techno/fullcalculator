import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const kgToPoundsConverter: CalculatorDefinition = {
  slug: "kg-to-pounds-converter",
  title: "KG to Pounds Converter",
  description:
    "Free kilograms to pounds converter. Quickly convert kg to lbs with our easy calculator. 1 kg = 2.20462 lbs.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: [
    "kg to pounds",
    "kg to lbs",
    "kilograms to pounds",
    "kg converter",
    "convert kg to pounds",
  ],
  variants: [
    {
      id: "kg-to-pounds",
      name: "Kilograms to Pounds",
      fields: [
        {
          name: "kg",
          label: "Kilograms",
          type: "number",
          placeholder: "e.g. 70",
        },
      ],
      calculate: (inputs) => {
        const val = inputs.kg as number;
        if (val === undefined || val === null) return null;
        const pounds = val * 2.20462;
        return {
          primary: {
            label: `${formatNumber(val, 4)} kg`,
            value: `${formatNumber(pounds, 4)} lbs`,
          },
          details: [
            { label: "Pounds", value: formatNumber(pounds, 4) },
            { label: "Ounces", value: formatNumber(pounds * 16, 2) },
            { label: "Stones", value: formatNumber(pounds / 14, 4) },
            { label: "Grams", value: formatNumber(val * 1000, 2) },
          ],
        };
      },
    },
    {
      id: "pounds-to-kg",
      name: "Pounds to Kilograms",
      fields: [
        {
          name: "pounds",
          label: "Pounds",
          type: "number",
          placeholder: "e.g. 150",
        },
      ],
      calculate: (inputs) => {
        const val = inputs.pounds as number;
        if (val === undefined || val === null) return null;
        const kg = val * 0.453592;
        return {
          primary: {
            label: `${formatNumber(val, 4)} lbs`,
            value: `${formatNumber(kg, 4)} kg`,
          },
          details: [
            { label: "Kilograms", value: formatNumber(kg, 4) },
            { label: "Grams", value: formatNumber(kg * 1000, 2) },
            { label: "Ounces", value: formatNumber(val * 16, 2) },
            { label: "Stones", value: formatNumber(val / 14, 4) },
          ],
        };
      },
    },
  ],
  relatedSlugs: [
    "pounds-to-kg-converter",
    "ounces-to-grams-converter",
    "stones-to-kg-converter",
    "unit-converter",
  ],
  faq: [
    {
      question: "How many pounds in a kilogram?",
      answer:
        "1 kilogram = 2.20462 pounds. To convert kg to pounds, multiply the kg value by 2.20462.",
    },
    {
      question: "How do I convert kg to pounds?",
      answer:
        "Multiply the number of kilograms by 2.20462. For example, 70 kg = 70 × 2.20462 = 154.323 lbs.",
    },
  ],
  formula: "pounds = kg × 2.20462",
};
