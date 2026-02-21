import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const litersToMlConverter: CalculatorDefinition = {
  slug: "liters-to-ml-converter",
  title: "Liters to Milliliters Converter",
  description:
    "Free liters to milliliters converter. Instantly convert L to mL with formula and examples. Formula: mL = L × 1000.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: [
    "liters to milliliters",
    "liters to ml",
    "L to mL",
    "convert liters to ml",
    "volume conversion",
  ],
  variants: [
    {
      id: "liters-to-ml",
      name: "Liters to Milliliters",
      fields: [
        {
          name: "liters",
          label: "Liters (L)",
          type: "number",
          placeholder: "e.g. 2",
        },
      ],
      calculate: (inputs) => {
        const liters = inputs.liters as number;
        if (liters === undefined || liters === null) return null;
        const ml = liters * 1000;
        const flOz = liters * 33.814;
        const cups = liters * 4.22675;
        const gallons = liters * 0.264172;
        return {
          primary: {
            label: `${formatNumber(liters, 4)} L`,
            value: `${formatNumber(ml, 2)} mL`,
          },
          details: [
            { label: "Milliliters", value: `${formatNumber(ml, 2)} mL` },
            { label: "Fluid Ounces", value: `${formatNumber(flOz, 4)} fl oz` },
            { label: "Cups", value: `${formatNumber(cups, 4)} cups` },
            { label: "US Gallons", value: `${formatNumber(gallons, 4)} gal` },
            { label: "Formula", value: "mL = L × 1000" },
          ],
        };
      },
    },
  ],
  relatedSlugs: [
    "ml-to-liters-converter",
    "liters-to-gallons-converter",
    "cups-to-ml-converter",
    "volume-converter",
  ],
  faq: [
    {
      question: "How many milliliters are in a liter?",
      answer:
        "There are 1,000 milliliters in 1 liter. To convert liters to mL, multiply by 1,000.",
    },
    {
      question: "How many mL is 1.5 liters?",
      answer:
        "1.5 liters = 1,500 mL. Multiply 1.5 by 1,000 to get 1,500 mL.",
    },
  ],
  formula: "mL = L × 1000",
};
