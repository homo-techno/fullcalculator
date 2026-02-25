import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const cupsToPintsConverter: CalculatorDefinition = {
  slug: "cups-to-pints-converter",
  title: "Cups to Pints Converter",
  description: "Free cups to pints converter. Convert cups to pints instantly with formula explanation.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["cups to pints","cups to pt","cup pint converter","volume conversion"],
  variants: [
    {
      id: "convert",
      name: "Cups to Pints Converter",
      fields: [
        { name: "value", label: "Cups", type: "number", placeholder: "e.g. 10" },
      ],
      calculate: (inputs) => {
        const value = inputs.value as number;
        if (value === undefined) return null;
        const pints = value / 2;
        return {
          primary: { label: `${formatNumber(value)} cups`, value: `${formatNumber(pints, 4)} pt` },
          details: [
            { label: "Pints", value: formatNumber(pints, 4) },
            { label: "Fluid Ounces", value: formatNumber(value * 8, 2) },
            { label: "Liters", value: formatNumber(value * 0.236588, 4) },
            { label: "Formula", value: "cups / 2 = pt" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["pints-to-cups-converter","unit-converter","volume-converter"],
  faq: [
    { question: "How do you convert cups to pints?", answer: "Divide the number of cups by 2. For example, 4 cups = 2 pints." },
  ],
  formula: "1 cup = 0.5 pt | pt = cups / 2",
};
