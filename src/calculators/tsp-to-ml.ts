import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const tspToMlConverter: CalculatorDefinition = {
  slug: "tsp-to-ml-converter",
  title: "Teaspoons to mL Converter",
  description:
    "Free teaspoons to milliliters converter. Instantly convert tsp to mL with formula and examples. Formula: mL = tsp × 4.929.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: [
    "teaspoons to ml",
    "tsp to ml",
    "teaspoon to milliliters",
    "convert tsp to ml",
    "cooking conversion",
  ],
  variants: [
    {
      id: "tsp-to-ml",
      name: "Teaspoons to Milliliters",
      fields: [
        {
          name: "tsp",
          label: "Teaspoons (tsp)",
          type: "number",
          placeholder: "e.g. 5",
        },
      ],
      calculate: (inputs) => {
        const tsp = inputs.tsp as number;
        if (tsp === undefined || tsp === null) return null;
        const ml = tsp * 4.929;
        const tbsp = tsp / 3;
        const flOz = tsp / 6;
        return {
          primary: {
            label: `${formatNumber(tsp, 2)} tsp`,
            value: `${formatNumber(ml, 2)} mL`,
          },
          details: [
            { label: "Milliliters", value: `${formatNumber(ml, 4)} mL` },
            { label: "Tablespoons", value: formatNumber(tbsp, 4) },
            { label: "Fluid Ounces", value: `${formatNumber(flOz, 4)} fl oz` },
            { label: "Formula", value: "mL = tsp × 4.929" },
          ],
        };
      },
    },
  ],
  relatedSlugs: [
    "tbsp-to-ml-converter",
    "ml-to-tbsp-converter",
    "teaspoons-to-tablespoons-converter",
    "cooking-calculator",
  ],
  faq: [
    {
      question: "How many mL in a teaspoon?",
      answer:
        "1 US teaspoon = 4.929 milliliters. To convert teaspoons to mL, multiply by 4.929.",
    },
    {
      question: "How many mL is 5 teaspoons?",
      answer:
        "5 teaspoons = 24.645 mL. Multiply 5 by 4.929 to get the result.",
    },
  ],
  formula: "mL = tsp × 4.929",
};
