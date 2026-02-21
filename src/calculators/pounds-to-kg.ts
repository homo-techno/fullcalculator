import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const poundsToKgConverter: CalculatorDefinition = {
  slug: "pounds-to-kg-converter",
  title: "Pounds to KG Converter",
  description:
    "Free pounds to kilograms converter. Quickly convert lbs to kg with our easy calculator. 1 lb = 0.453592 kg.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: [
    "pounds to kg",
    "lbs to kg",
    "pounds to kilograms",
    "lb to kg",
    "convert pounds to kg",
  ],
  variants: [
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
        const pounds = val / 0.453592;
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
  ],
  relatedSlugs: [
    "kg-to-pounds-converter",
    "ounces-to-grams-converter",
    "stones-to-pounds-converter",
    "unit-converter",
  ],
  faq: [
    {
      question: "How many kg in a pound?",
      answer:
        "1 pound = 0.453592 kilograms. This is the international avoirdupois pound.",
    },
    {
      question: "How do I convert pounds to kg?",
      answer:
        "Multiply the number of pounds by 0.453592. For example, 150 lbs = 150 × 0.453592 = 68.039 kg.",
    },
  ],
  formula: "kg = pounds × 0.453592",
};
