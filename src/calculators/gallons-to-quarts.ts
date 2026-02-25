import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const gallonsToQuartsConverter: CalculatorDefinition = {
  slug: "gallons-to-quarts-converter",
  title: "Gallons to Quarts Converter",
  description: "Free gallons to quarts converter. Convert gallons to quarts instantly with formula explanation.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["gallons to quarts","gal to qt","gallon quart converter","volume conversion"],
  variants: [
    {
      id: "convert",
      name: "Gallons to Quarts Converter",
      fields: [
        { name: "value", label: "Gallons (gal)", type: "number", placeholder: "e.g. 10" },
      ],
      calculate: (inputs) => {
        const value = inputs.value as number;
        if (value === undefined) return null;
        const quarts = value * 4;
        return {
          primary: { label: `${formatNumber(value)} gal`, value: `${formatNumber(quarts, 4)} qt` },
          details: [
            { label: "Quarts", value: formatNumber(quarts, 2) },
            { label: "Liters", value: formatNumber(value * 3.78541, 4) },
            { label: "Cups", value: formatNumber(quarts * 4, 2) },
            { label: "Formula", value: "gal x 4 = qt" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["quarts-to-gallons-converter","unit-converter","volume-converter"],
  faq: [
    { question: "How many quarts in a gallon?", answer: "There are 4 quarts in 1 gallon. Multiply gallons by 4 to get quarts." },
  ],
  formula: "1 gal = 4 qt | qt = gal x 4",
};
