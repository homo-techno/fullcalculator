import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const mlToLitersConverter: CalculatorDefinition = {
  slug: "ml-to-liters-converter",
  title: "Milliliters to Liters Converter",
  description:
    "Free milliliters to liters converter. Instantly convert mL to L with formula and examples. Formula: L = mL ÷ 1000.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: [
    "milliliters to liters",
    "ml to liters",
    "mL to L",
    "convert ml to liters",
    "volume conversion",
  ],
  variants: [
    {
      id: "ml-to-liters",
      name: "Milliliters to Liters",
      fields: [
        {
          name: "ml",
          label: "Milliliters (mL)",
          type: "number",
          placeholder: "e.g. 500",
        },
      ],
      calculate: (inputs) => {
        const ml = inputs.ml as number;
        if (ml === undefined || ml === null) return null;
        const liters = ml / 1000;
        const flOz = ml / 29.5735;
        const cups = ml / 236.588;
        const gallons = ml / 3785.41;
        return {
          primary: {
            label: `${formatNumber(ml, 2)} mL`,
            value: `${formatNumber(liters, 4)} L`,
          },
          details: [
            { label: "Liters", value: `${formatNumber(liters, 4)} L` },
            { label: "Fluid Ounces", value: `${formatNumber(flOz, 4)} fl oz` },
            { label: "Cups", value: `${formatNumber(cups, 4)} cups` },
            { label: "US Gallons", value: `${formatNumber(gallons, 6)} gal` },
            { label: "Formula", value: "L = mL ÷ 1000" },
          ],
        };
      },
    },
  ],
  relatedSlugs: [
    "liters-to-ml-converter",
    "cups-to-ml-converter",
    "fluid-ounces-to-ml-converter",
    "volume-converter",
  ],
  faq: [
    {
      question: "How do you convert milliliters to liters?",
      answer:
        "Divide the milliliter value by 1,000. For example, 500 mL = 500 ÷ 1,000 = 0.5 L.",
    },
    {
      question: "How many liters is 750 mL?",
      answer:
        "750 mL = 0.75 liters. Divide 750 by 1,000 to get 0.75 L.",
    },
  ],
  formula: "L = mL ÷ 1000",
};
