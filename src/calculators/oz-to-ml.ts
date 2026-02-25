import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const ozToMlConverter: CalculatorDefinition = {
  slug: "oz-to-ml-converter",
  title: "Ounces to Milliliters Converter",
  description: "Free ounces to milliliters converter. Convert fl oz to mL instantly with formula explanation.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["oz to ml","ounces to milliliters","fl oz to ml","volume conversion"],
  variants: [
    {
      id: "convert",
      name: "Ounces to Milliliters Converter",
      fields: [
        { name: "value", label: "Fluid Ounces (fl oz)", type: "number", placeholder: "e.g. 10" },
      ],
      calculate: (inputs) => {
        const value = inputs.value as number;
        if (value === undefined) return null;
        const ml = value * 29.5735;
        return {
          primary: { label: `${formatNumber(value)} fl oz`, value: `${formatNumber(ml, 4)} mL` },
          details: [
            { label: "Milliliters", value: formatNumber(ml, 2) },
            { label: "Liters", value: formatNumber(ml / 1000, 4) },
            { label: "Cups", value: formatNumber(value / 8, 4) },
            { label: "Formula", value: "fl oz x 29.5735 = mL" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["ml-to-oz-converter","unit-converter","volume-converter"],
  faq: [
    { question: "How many mL are in an ounce?", answer: "There are 29.5735 mL in one US fluid ounce. Multiply fl oz by 29.5735 to get mL." },
  ],
  formula: "1 fl oz = 29.5735 mL | mL = fl oz x 29.5735",
};
