import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const quartsToGallonsConverter: CalculatorDefinition = {
  slug: "quarts-to-gallons-converter",
  title: "Quarts to Gallons Converter",
  description: "Free quarts to gallons converter. Convert quarts to gallons instantly with formula explanation.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["quarts to gallons","qt to gal","quart gallon converter","volume conversion"],
  variants: [
    {
      id: "convert",
      name: "Quarts to Gallons Converter",
      fields: [
        { name: "value", label: "Quarts (qt)", type: "number", placeholder: "e.g. 10" },
      ],
      calculate: (inputs) => {
        const value = inputs.value as number;
        if (value === undefined) return null;
        const gallons = value / 4;
        return {
          primary: { label: `${formatNumber(value)} qt`, value: `${formatNumber(gallons, 4)} gal` },
          details: [
            { label: "Gallons", value: formatNumber(gallons, 4) },
            { label: "Liters", value: formatNumber(value * 0.946353, 4) },
            { label: "Cups", value: formatNumber(value * 4, 2) },
            { label: "Formula", value: "qt / 4 = gal" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["gallons-to-quarts-converter","unit-converter","volume-converter"],
  faq: [
    { question: "How many quarts in a gallon?", answer: "There are 4 quarts in 1 gallon. Divide quarts by 4 to get gallons." },
  ],
  formula: "1 qt = 0.25 gal | gal = qt / 4",
};
