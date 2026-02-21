import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const tbspToMlConverter: CalculatorDefinition = {
  slug: "tbsp-to-ml-converter",
  title: "Tablespoons to mL Converter",
  description:
    "Free tablespoons to milliliters converter. Instantly convert tbsp to mL with formula and examples. Formula: mL = tbsp × 14.787.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: [
    "tablespoons to ml",
    "tbsp to ml",
    "tablespoon to milliliters",
    "convert tbsp to ml",
    "cooking conversion",
  ],
  variants: [
    {
      id: "tbsp-to-ml",
      name: "Tablespoons to Milliliters",
      fields: [
        {
          name: "tbsp",
          label: "Tablespoons (tbsp)",
          type: "number",
          placeholder: "e.g. 3",
        },
      ],
      calculate: (inputs) => {
        const tbsp = inputs.tbsp as number;
        if (tbsp === undefined || tbsp === null) return null;
        const ml = tbsp * 14.787;
        const tsp = tbsp * 3;
        const flOz = tbsp * 0.5;
        return {
          primary: {
            label: `${formatNumber(tbsp, 2)} tbsp`,
            value: `${formatNumber(ml, 2)} mL`,
          },
          details: [
            { label: "Milliliters", value: `${formatNumber(ml, 4)} mL` },
            { label: "Teaspoons", value: formatNumber(tsp, 2) },
            { label: "Fluid Ounces", value: `${formatNumber(flOz, 4)} fl oz` },
            { label: "Formula", value: "mL = tbsp × 14.787" },
          ],
        };
      },
    },
  ],
  relatedSlugs: [
    "ml-to-tbsp-converter",
    "teaspoons-to-tablespoons-converter",
    "cups-to-ml-converter",
    "cooking-calculator",
  ],
  faq: [
    {
      question: "How many mL in a tablespoon?",
      answer:
        "1 US tablespoon = 14.787 milliliters. To convert tablespoons to mL, multiply by 14.787.",
    },
    {
      question: "How many mL is 2 tablespoons?",
      answer:
        "2 tablespoons = 29.574 mL. Multiply 2 by 14.787 to get the result.",
    },
  ],
  formula: "mL = tbsp × 14.787",
};
