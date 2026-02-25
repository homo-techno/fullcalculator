import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const cupsToTablespoonsConverter: CalculatorDefinition = {
  slug: "cups-to-tablespoons-converter",
  title: "Cups to Tablespoons Converter",
  description: "Free cups to tablespoons converter. Convert cups to tbsp instantly with formula explanation.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["cups to tablespoons","cups to tbsp","cup tablespoon converter","cooking conversion"],
  variants: [
    {
      id: "convert",
      name: "Cups to Tablespoons Converter",
      fields: [
        { name: "value", label: "Cups", type: "number", placeholder: "e.g. 10" },
      ],
      calculate: (inputs) => {
        const value = inputs.value as number;
        if (value === undefined) return null;
        const tbsp = value * 16;
        return {
          primary: { label: `${formatNumber(value)} cups`, value: `${formatNumber(tbsp, 4)} tbsp` },
          details: [
            { label: "Tablespoons", value: formatNumber(tbsp, 2) },
            { label: "Teaspoons", value: formatNumber(tbsp * 3, 2) },
            { label: "Fluid Ounces", value: formatNumber(value * 8, 2) },
            { label: "Formula", value: "cups x 16 = tbsp" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["tbsp-to-tsp-converter","unit-converter","volume-converter"],
  faq: [
    { question: "How many tablespoons in a cup?", answer: "There are 16 tablespoons in 1 cup. Multiply cups by 16 to get tablespoons." },
  ],
  formula: "1 cup = 16 tbsp | tbsp = cups x 16",
};
