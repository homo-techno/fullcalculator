import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const tbspToCupsConverter: CalculatorDefinition = {
  slug: "tablespoons-to-cups-converter",
  title: "Tablespoons to Cups Converter",
  description:
    "Free tablespoons to cups converter. Quickly convert tablespoons to cups with our easy calculator. 1 cup = 16 tablespoons.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: [
    "tablespoons to cups",
    "tbsp to cups",
    "cooking converter",
    "measurement converter",
    "kitchen converter",
  ],
  variants: [
    {
      id: "tbsp-to-cups",
      name: "Tablespoons to Cups",
      fields: [
        {
          name: "tbsp",
          label: "Tablespoons",
          type: "number",
          placeholder: "e.g. 8",
        },
      ],
      calculate: (inputs) => {
        const tbsp = inputs.tbsp as number;
        if (tbsp === undefined || tbsp === null) return null;
        const cups = tbsp / 16;
        const tsp = tbsp * 3;
        const flOz = tbsp * 0.5;
        const ml = tbsp * 14.7868;
        return {
          primary: {
            label: `${formatNumber(tbsp, 4)} tablespoons`,
            value: `${formatNumber(cups, 4)} cups`,
          },
          details: [
            { label: "Cups", value: formatNumber(cups, 4) },
            { label: "Teaspoons", value: formatNumber(tsp, 2) },
            { label: "Fluid Ounces", value: formatNumber(flOz, 4) },
            { label: "Milliliters", value: formatNumber(ml, 2) },
          ],
        };
      },
    },
    {
      id: "cups-to-tbsp",
      name: "Cups to Tablespoons",
      fields: [
        {
          name: "cups",
          label: "Cups",
          type: "number",
          placeholder: "e.g. 0.5",
        },
      ],
      calculate: (inputs) => {
        const cups = inputs.cups as number;
        if (cups === undefined || cups === null) return null;
        const tbsp = cups * 16;
        const tsp = tbsp * 3;
        const flOz = cups * 8;
        const ml = cups * 236.588;
        return {
          primary: {
            label: `${formatNumber(cups, 4)} cups`,
            value: `${formatNumber(tbsp, 2)} tablespoons`,
          },
          details: [
            { label: "Tablespoons", value: formatNumber(tbsp, 2) },
            { label: "Teaspoons", value: formatNumber(tsp, 2) },
            { label: "Fluid Ounces", value: formatNumber(flOz, 4) },
            { label: "Milliliters", value: formatNumber(ml, 2) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["teaspoons-to-tablespoons-converter", "fluid-ounces-to-ml-converter", "cooking-calculator"],
  faq: [
    {
      question: "How many tablespoons are in a cup?",
      answer:
        "There are 16 tablespoons in 1 cup. Half a cup equals 8 tablespoons, and a quarter cup equals 4 tablespoons.",
    },
    {
      question: "How do I convert tablespoons to cups?",
      answer:
        "Divide the number of tablespoons by 16. For example, 8 tablespoons = 8 / 16 = 0.5 cups.",
    },
  ],
  formula: "cups = tablespoons / 16 | tablespoons = cups × 16",
};
