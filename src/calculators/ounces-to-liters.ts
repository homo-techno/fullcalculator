import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const ouncesToLitersConverter: CalculatorDefinition = {
  slug: "ounces-to-liters-converter",
  title: "Ounces to Liters Converter",
  description: "Free ounces to liters converter. Convert fl oz to liters instantly with formula explanation.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["ounces to liters","fl oz to L","ounce liter converter","volume conversion"],
  variants: [
    {
      id: "convert",
      name: "Ounces to Liters Converter",
      fields: [
        { name: "value", label: "Fluid Ounces (fl oz)", type: "number", placeholder: "e.g. 10" },
      ],
      calculate: (inputs) => {
        const value = inputs.value as number;
        if (value === undefined) return null;
        const liters = value / 33.814;
        return {
          primary: { label: `${formatNumber(value)} fl oz`, value: `${formatNumber(liters, 4)} L` },
          details: [
            { label: "Liters", value: formatNumber(liters, 4) },
            { label: "Milliliters", value: formatNumber(liters * 1000, 2) },
            { label: "Gallons", value: formatNumber(value / 128, 4) },
            { label: "Formula", value: "fl oz / 33.814 = L" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["liters-to-ounces-converter","unit-converter","volume-converter"],
  faq: [
    { question: "How do you convert ounces to liters?", answer: "Divide the fluid ounce value by 33.814. For example, 64 fl oz = 1.8927 L." },
  ],
  formula: "1 fl oz = 0.02957 L | L = fl oz / 33.814",
};
