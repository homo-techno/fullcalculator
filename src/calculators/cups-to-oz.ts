import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const cupsToOzConverter: CalculatorDefinition = {
  slug: "cups-to-oz-converter",
  title: "Cups to Ounces Converter",
  description:
    "Free cups to ounces converter. Instantly convert cups to fluid oz with formula and examples. Formula: fl oz = cups × 8.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: [
    "cups to ounces",
    "cups to oz",
    "cups to fluid ounces",
    "convert cups to oz",
    "cooking conversion",
  ],
  variants: [
    {
      id: "cups-to-oz",
      name: "Cups to Ounces",
      fields: [
        {
          name: "cups",
          label: "Cups",
          type: "number",
          placeholder: "e.g. 2",
        },
      ],
      calculate: (inputs) => {
        const cups = inputs.cups as number;
        if (cups === undefined || cups === null) return null;
        const oz = cups * 8;
        const ml = cups * 236.588;
        const tablespoons = cups * 16;
        return {
          primary: {
            label: `${formatNumber(cups, 2)} cups`,
            value: `${formatNumber(oz, 2)} fl oz`,
          },
          details: [
            { label: "Fluid Ounces", value: `${formatNumber(oz, 4)} fl oz` },
            { label: "Milliliters", value: `${formatNumber(ml, 2)} mL` },
            { label: "Tablespoons", value: formatNumber(tablespoons, 2) },
            { label: "Formula", value: "fl oz = cups × 8" },
          ],
        };
      },
    },
  ],
  relatedSlugs: [
    "oz-to-cups-converter",
    "cups-to-ml-converter",
    "fluid-ounces-to-ml-converter",
    "cooking-calculator",
  ],
  faq: [
    {
      question: "How many ounces in a cup?",
      answer:
        "There are 8 fluid ounces in 1 US cup. To convert cups to ounces, multiply by 8.",
    },
    {
      question: "How many ounces is 3 cups?",
      answer:
        "3 cups = 24 fluid ounces. Multiply 3 by 8 to get 24 fl oz.",
    },
  ],
  formula: "fl oz = cups × 8",
};
