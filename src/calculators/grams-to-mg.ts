import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const gramsToMgConverter: CalculatorDefinition = {
  slug: "grams-to-mg-converter",
  title: "Grams to Milligrams Converter",
  description: "Free grams to milligrams converter. Convert g to mg instantly with formula explanation.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["grams to mg","grams to milligrams","g mg converter","weight conversion"],
  variants: [
    {
      id: "convert",
      name: "Grams to Milligrams Converter",
      fields: [
        { name: "value", label: "Grams (g)", type: "number", placeholder: "e.g. 10" },
      ],
      calculate: (inputs) => {
        const value = inputs.value as number;
        if (value === undefined) return null;
        const mg = value * 1000;
        return {
          primary: { label: `${formatNumber(value)} g`, value: `${formatNumber(mg, 4)} mg` },
          details: [
            { label: "Milligrams", value: formatNumber(mg, 2) },
            { label: "Kilograms", value: formatNumber(value / 1000, 6) },
            { label: "Ounces", value: formatNumber(value * 0.035274, 4) },
            { label: "Formula", value: "g x 1000 = mg" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["mg-to-grams-converter","unit-converter","weight-converter"],
  faq: [
    { question: "How do you convert grams to milligrams?", answer: "Multiply the gram value by 1000. For example, 2.5 g = 2500 mg." },
  ],
  formula: "1 g = 1000 mg | mg = g x 1000",
};
