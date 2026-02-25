import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const mgToGramsConverter: CalculatorDefinition = {
  slug: "mg-to-grams-converter",
  title: "Milligrams to Grams Converter",
  description: "Free milligrams to grams converter. Convert mg to g instantly with formula explanation.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["mg to grams","milligrams to grams","mg g converter","weight conversion"],
  variants: [
    {
      id: "convert",
      name: "Milligrams to Grams Converter",
      fields: [
        { name: "value", label: "Milligrams (mg)", type: "number", placeholder: "e.g. 10" },
      ],
      calculate: (inputs) => {
        const value = inputs.value as number;
        if (value === undefined) return null;
        const grams = value / 1000;
        return {
          primary: { label: `${formatNumber(value)} mg`, value: `${formatNumber(grams, 4)} g` },
          details: [
            { label: "Grams", value: formatNumber(grams, 6) },
            { label: "Kilograms", value: formatNumber(grams / 1000, 8) },
            { label: "Ounces", value: formatNumber(value * 0.000035274, 6) },
            { label: "Formula", value: "mg / 1000 = g" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["grams-to-mg-converter","unit-converter","weight-converter"],
  faq: [
    { question: "How do you convert mg to grams?", answer: "Divide the milligram value by 1000. For example, 500 mg = 0.5 g." },
  ],
  formula: "1 mg = 0.001 g | g = mg / 1000",
};
