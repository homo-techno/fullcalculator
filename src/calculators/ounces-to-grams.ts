import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const ouncesToGramsConverter: CalculatorDefinition = {
  slug: "ounces-to-grams-converter",
  title: "Ounces to Grams Converter",
  description:
    "Free ounces to grams converter. Quickly convert oz to g with our easy calculator. 1 oz = 28.3495 grams.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: [
    "ounces to grams",
    "oz to g",
    "ounce to gram",
    "convert ounces to grams",
    "ounce converter",
  ],
  variants: [
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
        const ounces = val / 28.3495;
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
  ],
  relatedSlugs: [
    "grams-to-ounces-converter",
    "pounds-to-kg-converter",
    "kg-to-pounds-converter",
    "unit-converter",
  ],
  faq: [
    {
      question: "How many grams in an ounce?",
      answer:
        "1 ounce = 28.3495 grams. This is the avoirdupois ounce used in the US and UK.",
    },
    {
      question: "How do I convert ounces to grams?",
      answer:
        "Multiply the number of ounces by 28.3495. For example, 8 oz = 8 × 28.3495 = 226.796 grams.",
    },
  ],
  formula: "grams = ounces × 28.3495",
};
