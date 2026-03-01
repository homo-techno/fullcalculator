import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const cookingUnitConverterCalculator: CalculatorDefinition = {
  slug: "cooking-unit-converter",
  title: "Cooking Unit Converter",
  description: "Convert between common cooking measurements including cups, tablespoons, teaspoons, and milliliters.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["cooking converter", "cups to ml", "tablespoon to teaspoon"],
  variants: [{
    id: "standard",
    name: "Cooking Unit",
    description: "Convert between common cooking measurements including cups, tablespoons, teaspoons, and milliliters",
    fields: [
      { name: "amount", label: "Amount", type: "number", suffix: "", min: 0.01, max: 10000, defaultValue: 1 },
      { name: "fromUnit", label: "From Unit", type: "select", options: [{value:"cup",label:"Cup"},{value:"tbsp",label:"Tablespoon"},{value:"tsp",label:"Teaspoon"},{value:"ml",label:"Milliliter"},{value:"liter",label:"Liter"},{value:"floz",label:"Fluid Ounce"}], defaultValue: "cup" },
      { name: "toUnit", label: "To Unit", type: "select", options: [{value:"cup",label:"Cup"},{value:"tbsp",label:"Tablespoon"},{value:"tsp",label:"Teaspoon"},{value:"ml",label:"Milliliter"},{value:"liter",label:"Liter"},{value:"floz",label:"Fluid Ounce"}], defaultValue: "ml" },
    ],
    calculate: (inputs) => {
      const amount = inputs.amount as number;
      const from = inputs.fromUnit as string;
      const to = inputs.toUnit as string;
      if (!amount || amount <= 0) return null;
      const toMl: Record<string, number> = { cup: 236.588, tbsp: 14.787, tsp: 4.929, ml: 1, liter: 1000, floz: 29.574 };
      const fromFactor = toMl[from] || 1;
      const toFactor = toMl[to] || 1;
      const result = amount * fromFactor / toFactor;
      const inMl = amount * fromFactor;
      return {
        primary: { label: "Result", value: formatNumber(Math.round(result * 1000) / 1000) + " " + to },
        details: [
          { label: "In Milliliters", value: formatNumber(Math.round(inMl * 100) / 100) + " ml" },
          { label: "In Cups", value: formatNumber(Math.round(inMl / 236.588 * 1000) / 1000) + " cups" },
          { label: "In Tablespoons", value: formatNumber(Math.round(inMl / 14.787 * 100) / 100) + " tbsp" },
        ],
      };
    },
  }],
  relatedSlugs: ["shoe-size-converter", "ring-size-converter"],
  faq: [
    { question: "How many tablespoons are in a cup?", answer: "There are 16 tablespoons in one US cup (236.6 ml). Each tablespoon equals 3 teaspoons." },
    { question: "How many ml in a cup?", answer: "One US cup equals approximately 236.6 milliliters. One metric cup used in some countries equals 250 milliliters." },
  ],
  formula: "Result = Amount x (Source Unit in ml) / (Target Unit in ml)",
};
