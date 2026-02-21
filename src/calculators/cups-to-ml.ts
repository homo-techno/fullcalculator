import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const cupsToMlConverter: CalculatorDefinition = {
  slug: "cups-to-ml-converter",
  title: "Cups to ML Converter",
  description:
    "Free cups to milliliters converter. Quickly convert cups to mL with our easy calculator. 1 US cup = 236.588 mL.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: [
    "cups to ml",
    "cups to milliliters",
    "cup converter",
    "cups to mL",
    "convert cups to ml",
  ],
  variants: [
    {
      id: "cups-to-ml",
      name: "Cups to Milliliters",
      fields: [
        {
          name: "cups",
          label: "Cups",
          type: "number",
          placeholder: "e.g. 2",
        },
      ],
      calculate: (inputs) => {
        const val = inputs.cups as number;
        if (val === undefined || val === null) return null;
        const ml = val * 236.588;
        return {
          primary: {
            label: `${formatNumber(val, 4)} cups`,
            value: `${formatNumber(ml, 2)} mL`,
          },
          details: [
            { label: "Milliliters", value: formatNumber(ml, 2) },
            { label: "Liters", value: formatNumber(ml / 1000, 4) },
            { label: "Tablespoons", value: formatNumber(val * 16, 2) },
            { label: "Fluid Ounces", value: formatNumber(val * 8, 2) },
            { label: "Teaspoons", value: formatNumber(val * 48, 2) },
          ],
        };
      },
    },
    {
      id: "ml-to-cups",
      name: "Milliliters to Cups",
      fields: [
        {
          name: "ml",
          label: "Milliliters",
          type: "number",
          placeholder: "e.g. 500",
        },
      ],
      calculate: (inputs) => {
        const val = inputs.ml as number;
        if (val === undefined || val === null) return null;
        const cups = val / 236.588;
        return {
          primary: {
            label: `${formatNumber(val, 2)} mL`,
            value: `${formatNumber(cups, 4)} cups`,
          },
          details: [
            { label: "Cups", value: formatNumber(cups, 4) },
            { label: "Liters", value: formatNumber(val / 1000, 4) },
            { label: "Tablespoons", value: formatNumber(cups * 16, 2) },
            { label: "Fluid Ounces", value: formatNumber(cups * 8, 2) },
          ],
        };
      },
    },
  ],
  relatedSlugs: [
    "liters-to-gallons-converter",
    "gallons-to-liters-converter",
    "unit-converter",
  ],
  faq: [
    {
      question: "How many mL in a cup?",
      answer:
        "1 US cup = 236.588 milliliters. Note that metric cups (used in Australia) are 250 mL, and imperial cups are approximately 284 mL.",
    },
    {
      question: "How do I convert cups to mL?",
      answer:
        "Multiply the number of cups by 236.588. For example, 2 cups = 2 × 236.588 = 473.176 mL.",
    },
  ],
  formula: "mL = cups × 236.588",
};
