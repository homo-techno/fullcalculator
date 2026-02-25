import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const cmToFeetConverter: CalculatorDefinition = {
  slug: "cm-to-feet-converter",
  title: "Centimeters to Feet Converter",
  description: "Free centimeters to feet converter. Convert cm to feet instantly with formula explanation.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["cm to feet","cm to ft","centimeters feet converter","length conversion"],
  variants: [
    {
      id: "convert",
      name: "Centimeters to Feet Converter",
      fields: [
        { name: "value", label: "Centimeters (cm)", type: "number", placeholder: "e.g. 10" },
      ],
      calculate: (inputs) => {
        const value = inputs.value as number;
        if (value === undefined) return null;
        const feet = value / 30.48;
        return {
          primary: { label: `${formatNumber(value)} cm`, value: `${formatNumber(feet, 4)} ft` },
          details: [
            { label: "Feet", value: formatNumber(feet, 4) },
            { label: "Inches", value: formatNumber(value / 2.54, 2) },
            { label: "Meters", value: formatNumber(value / 100, 4) },
            { label: "Formula", value: "cm / 30.48 = ft" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["feet-to-cm-converter","unit-converter","length-converter"],
  faq: [
    { question: "How do you convert cm to feet?", answer: "Divide the centimeter value by 30.48. For example, 180 cm = 5.9055 ft." },
  ],
  formula: "1 cm = 0.0328084 ft | ft = cm / 30.48",
};
