import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const tspToTbspConverter: CalculatorDefinition = {
  slug: "teaspoons-to-tablespoons-converter",
  title: "Teaspoons to Tablespoons Converter",
  description:
    "Free teaspoons to tablespoons converter. Quickly convert teaspoons to tablespoons with our easy calculator. 1 tablespoon = 3 teaspoons.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: [
    "teaspoons to tablespoons",
    "tsp to tbsp",
    "cooking converter",
    "measurement converter",
    "kitchen converter",
  ],
  variants: [
    {
      id: "tsp-to-tbsp",
      name: "Teaspoons to Tablespoons",
      fields: [
        {
          name: "tsp",
          label: "Teaspoons",
          type: "number",
          placeholder: "e.g. 6",
        },
      ],
      calculate: (inputs) => {
        const tsp = inputs.tsp as number;
        if (tsp === undefined || tsp === null) return null;
        const tbsp = tsp / 3;
        const cups = tsp / 48;
        const ml = tsp * 4.92892;
        const flOz = tsp / 6;
        return {
          primary: {
            label: `${formatNumber(tsp, 4)} teaspoons`,
            value: `${formatNumber(tbsp, 4)} tablespoons`,
          },
          details: [
            { label: "Tablespoons", value: formatNumber(tbsp, 4) },
            { label: "Cups", value: formatNumber(cups, 4) },
            { label: "Fluid Ounces", value: formatNumber(flOz, 4) },
            { label: "Milliliters", value: formatNumber(ml, 2) },
          ],
        };
      },
    },
    {
      id: "tbsp-to-tsp",
      name: "Tablespoons to Teaspoons",
      fields: [
        {
          name: "tbsp",
          label: "Tablespoons",
          type: "number",
          placeholder: "e.g. 2",
        },
      ],
      calculate: (inputs) => {
        const tbsp = inputs.tbsp as number;
        if (tbsp === undefined || tbsp === null) return null;
        const tsp = tbsp * 3;
        const cups = tbsp / 16;
        const ml = tbsp * 14.7868;
        return {
          primary: {
            label: `${formatNumber(tbsp, 4)} tablespoons`,
            value: `${formatNumber(tsp, 2)} teaspoons`,
          },
          details: [
            { label: "Teaspoons", value: formatNumber(tsp, 2) },
            { label: "Cups", value: formatNumber(cups, 4) },
            { label: "Milliliters", value: formatNumber(ml, 2) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["tablespoons-to-cups-converter", "fluid-ounces-to-ml-converter", "cooking-calculator"],
  faq: [
    {
      question: "How many teaspoons are in a tablespoon?",
      answer:
        "There are 3 teaspoons in 1 tablespoon. This is a standard US measurement.",
    },
    {
      question: "How do I convert teaspoons to tablespoons?",
      answer:
        "Divide the number of teaspoons by 3. For example, 6 teaspoons = 6 / 3 = 2 tablespoons.",
    },
  ],
  formula: "tablespoons = teaspoons / 3 | teaspoons = tablespoons × 3",
};
