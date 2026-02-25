import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const gramsToKgConverter: CalculatorDefinition = {
  slug: "grams-to-kg-converter",
  title: "Grams to Kilograms Converter",
  description: "Free grams to kilograms converter. Convert g to kg instantly with formula explanation.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["grams to kg","grams to kilograms","g kg converter","weight conversion"],
  variants: [
    {
      id: "convert",
      name: "Grams to Kilograms Converter",
      fields: [
        { name: "value", label: "Grams (g)", type: "number", placeholder: "e.g. 10" },
      ],
      calculate: (inputs) => {
        const value = inputs.value as number;
        if (value === undefined) return null;
        const kg = value / 1000;
        return {
          primary: { label: `${formatNumber(value)} g`, value: `${formatNumber(kg, 4)} kg` },
          details: [
            { label: "Kilograms", value: formatNumber(kg, 6) },
            { label: "Milligrams", value: formatNumber(value * 1000, 0) },
            { label: "Pounds", value: formatNumber(value * 0.00220462, 6) },
            { label: "Formula", value: "g / 1000 = kg" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["kg-to-grams-converter","unit-converter","weight-converter"],
  faq: [
    { question: "How do you convert grams to kilograms?", answer: "Divide the gram value by 1000. For example, 500 g = 0.5 kg." },
  ],
  formula: "1 g = 0.001 kg | kg = g / 1000",
};
