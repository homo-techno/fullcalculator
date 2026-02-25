import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const kgToGramsConverter: CalculatorDefinition = {
  slug: "kg-to-grams-converter",
  title: "Kilograms to Grams Converter",
  description: "Free kilograms to grams converter. Convert kg to g instantly with formula explanation.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["kg to grams","kilograms to grams","kg g converter","weight conversion"],
  variants: [
    {
      id: "convert",
      name: "Kilograms to Grams Converter",
      fields: [
        { name: "value", label: "Kilograms (kg)", type: "number", placeholder: "e.g. 10" },
      ],
      calculate: (inputs) => {
        const value = inputs.value as number;
        if (value === undefined) return null;
        const grams = value * 1000;
        return {
          primary: { label: `${formatNumber(value)} kg`, value: `${formatNumber(grams, 4)} g` },
          details: [
            { label: "Grams", value: formatNumber(grams, 2) },
            { label: "Milligrams", value: formatNumber(grams * 1000, 0) },
            { label: "Pounds", value: formatNumber(value * 2.20462, 4) },
            { label: "Formula", value: "kg x 1000 = g" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["grams-to-kg-converter","unit-converter","weight-converter"],
  faq: [
    { question: "How do you convert kg to grams?", answer: "Multiply the kilogram value by 1000. For example, 2.5 kg = 2500 g." },
  ],
  formula: "1 kg = 1000 g | g = kg x 1000",
};
