import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const gramsToOuncesConverter: CalculatorDefinition = {
  slug: "grams-to-ounces-converter",
  title: "Grams to Ounces Converter",
  description:
    "Free grams to ounces converter. Quickly convert g to oz with our easy calculator. 1 g = 0.035274 oz.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: [
    "grams to ounces",
    "g to oz",
    "gram to ounce",
    "convert grams to ounces",
    "gram converter",
  ],
  variants: [
    {
      id: "grams-to-ounces",
      name: "Grams to Ounces",
      fields: [
        {
          name: "grams",
          label: "Grams",
          type: "number",
          placeholder: "e.g. 200",
        },
      ],
      calculate: (inputs) => {
        const val = inputs.grams as number;
        if (val === undefined || val === null) return null;
        const ounces = val * 0.035274;
        return {
          primary: {
            label: `${formatNumber(val, 4)} g`,
            value: `${formatNumber(ounces, 4)} oz`,
          },
          details: [
            { label: "Ounces", value: formatNumber(ounces, 4) },
            { label: "Pounds", value: formatNumber(ounces / 16, 4) },
            { label: "Kilograms", value: formatNumber(val / 1000, 6) },
            { label: "Milligrams", value: formatNumber(val * 1000, 2) },
          ],
        };
      },
    },
    {
      id: "ounces-to-grams",
      name: "Ounces to Grams",
      fields: [
        {
          name: "ounces",
          label: "Ounces",
          type: "number",
          placeholder: "e.g. 8",
        },
      ],
      calculate: (inputs) => {
        const val = inputs.ounces as number;
        if (val === undefined || val === null) return null;
        const grams = val * 28.3495;
        return {
          primary: {
            label: `${formatNumber(val, 4)} oz`,
            value: `${formatNumber(grams, 4)} g`,
          },
          details: [
            { label: "Grams", value: formatNumber(grams, 4) },
            { label: "Kilograms", value: formatNumber(grams / 1000, 6) },
            { label: "Milligrams", value: formatNumber(grams * 1000, 2) },
            { label: "Pounds", value: formatNumber(val / 16, 4) },
          ],
        };
      },
    },
  ],
  relatedSlugs: [
    "ounces-to-grams-converter",
    "pounds-to-kg-converter",
    "kg-to-pounds-converter",
    "unit-converter",
  ],
  faq: [
    {
      question: "How many ounces in a gram?",
      answer:
        "1 gram = 0.035274 ounces. To convert grams to ounces, multiply the gram value by 0.035274.",
    },
    {
      question: "How do I convert grams to ounces?",
      answer:
        "Multiply the number of grams by 0.035274. For example, 200 g = 200 × 0.035274 = 7.0548 oz.",
    },
  ],
  formula: "ounces = grams × 0.035274",
};
