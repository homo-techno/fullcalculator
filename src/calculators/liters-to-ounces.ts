import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const litersToOuncesConverter: CalculatorDefinition = {
  slug: "liters-to-ounces-converter",
  title: "Liters to Ounces Converter",
  description: "Free liters to ounces converter. Convert liters to fl oz instantly with formula explanation.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["liters to ounces","L to fl oz","liter ounce converter","volume conversion"],
  variants: [
    {
      id: "convert",
      name: "Liters to Ounces Converter",
      fields: [
        { name: "value", label: "Liters (L)", type: "number", placeholder: "e.g. 10" },
      ],
      calculate: (inputs) => {
        const value = inputs.value as number;
        if (value === undefined) return null;
        const oz = value * 33.814;
        return {
          primary: { label: `${formatNumber(value)} L`, value: `${formatNumber(oz, 4)} fl oz` },
          details: [
            { label: "Fluid Ounces", value: formatNumber(oz, 2) },
            { label: "Milliliters", value: formatNumber(value * 1000, 0) },
            { label: "Cups", value: formatNumber(oz / 8, 4) },
            { label: "Formula", value: "L x 33.814 = fl oz" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["ounces-to-liters-converter","unit-converter","volume-converter"],
  faq: [
    { question: "How many ounces are in a liter?", answer: "There are 33.814 US fluid ounces in one liter. Multiply liters by 33.814 to get fl oz." },
  ],
  formula: "1 L = 33.814 fl oz | fl oz = L x 33.814",
};
