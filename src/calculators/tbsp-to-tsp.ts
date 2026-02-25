import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const tbspToTspConverter: CalculatorDefinition = {
  slug: "tbsp-to-tsp-converter",
  title: "Tablespoons to Teaspoons Converter",
  description: "Free tablespoons to teaspoons converter. Convert tbsp to tsp instantly with formula explanation.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["tbsp to tsp","tablespoons to teaspoons","tablespoon teaspoon converter","cooking conversion"],
  variants: [
    {
      id: "convert",
      name: "Tablespoons to Teaspoons Converter",
      fields: [
        { name: "value", label: "Tablespoons (tbsp)", type: "number", placeholder: "e.g. 10" },
      ],
      calculate: (inputs) => {
        const value = inputs.value as number;
        if (value === undefined) return null;
        const tsp = value * 3;
        return {
          primary: { label: `${formatNumber(value)} tbsp`, value: `${formatNumber(tsp, 4)} tsp` },
          details: [
            { label: "Teaspoons", value: formatNumber(tsp, 2) },
            { label: "Milliliters", value: formatNumber(value * 14.787, 2) },
            { label: "Fluid Ounces", value: formatNumber(value * 0.5, 4) },
            { label: "Formula", value: "tbsp x 3 = tsp" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["tsp-to-tbsp-converter","unit-converter","volume-converter"],
  faq: [
    { question: "How many teaspoons in a tablespoon?", answer: "There are 3 teaspoons in 1 tablespoon. Multiply tablespoons by 3 to get teaspoons." },
  ],
  formula: "1 tbsp = 3 tsp | tsp = tbsp x 3",
};
