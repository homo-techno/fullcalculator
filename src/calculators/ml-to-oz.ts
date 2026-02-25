import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const mlToOzConverter: CalculatorDefinition = {
  slug: "ml-to-oz-converter",
  title: "Milliliters to Ounces Converter",
  description: "Free milliliters to ounces converter. Convert mL to fl oz instantly with formula explanation.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["ml to oz","milliliters to ounces","ml to fl oz","volume conversion"],
  variants: [
    {
      id: "convert",
      name: "Milliliters to Ounces Converter",
      fields: [
        { name: "value", label: "Milliliters (mL)", type: "number", placeholder: "e.g. 10" },
      ],
      calculate: (inputs) => {
        const value = inputs.value as number;
        if (value === undefined) return null;
        const oz = value / 29.5735;
        return {
          primary: { label: `${formatNumber(value)} mL`, value: `${formatNumber(oz, 4)} fl oz` },
          details: [
            { label: "Fluid Ounces", value: formatNumber(oz, 4) },
            { label: "Liters", value: formatNumber(value / 1000, 4) },
            { label: "Cups", value: formatNumber(oz / 8, 4) },
            { label: "Formula", value: "mL / 29.5735 = fl oz" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["oz-to-ml-converter","unit-converter","volume-converter"],
  faq: [
    { question: "How do you convert mL to ounces?", answer: "Divide the mL value by 29.5735. For example, 500 mL = 16.907 fl oz." },
  ],
  formula: "1 mL = 0.033814 fl oz | fl oz = mL / 29.5735",
};
