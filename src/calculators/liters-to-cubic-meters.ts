import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const litersToCubicMetersConverter: CalculatorDefinition = {
  slug: "liters-to-cubic-meters-converter",
  title: "Liters to Cubic Meters Converter",
  description:
    "Free liters to cubic meters converter. Instantly convert L to m³ with formula and examples. Formula: m³ = L ÷ 1000.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: [
    "liters to cubic meters",
    "L to m3",
    "liters to m³",
    "convert liters to cubic meters",
    "volume conversion",
  ],
  variants: [
    {
      id: "liters-to-cubic-meters",
      name: "Liters to Cubic Meters",
      fields: [
        {
          name: "liters",
          label: "Liters (L)",
          type: "number",
          placeholder: "e.g. 1000",
        },
      ],
      calculate: (inputs) => {
        const liters = inputs.liters as number;
        if (liters === undefined || liters === null) return null;
        const m3 = liters / 1000;
        const gallons = liters * 0.264172;
        const cubicFeet = liters * 0.0353147;
        return {
          primary: {
            label: `${formatNumber(liters, 2)} L`,
            value: `${formatNumber(m3, 4)} m³`,
          },
          details: [
            { label: "Cubic Meters", value: `${formatNumber(m3, 6)} m³` },
            { label: "US Gallons", value: `${formatNumber(gallons, 4)} gal` },
            { label: "Cubic Feet", value: `${formatNumber(cubicFeet, 6)} ft³` },
            { label: "Milliliters", value: `${formatNumber(liters * 1000, 2)} mL` },
            { label: "Formula", value: "m³ = L ÷ 1000" },
          ],
        };
      },
    },
  ],
  relatedSlugs: [
    "cubic-meters-to-liters-converter",
    "liters-to-gallons-converter",
    "gallons-to-liters-converter",
    "volume-converter",
  ],
  faq: [
    {
      question: "How do you convert liters to cubic meters?",
      answer:
        "Divide the liter value by 1,000. For example, 1,000 L = 1,000 ÷ 1,000 = 1 m³.",
    },
    {
      question: "How many cubic meters is 500 liters?",
      answer:
        "500 liters = 0.5 cubic meters. Divide 500 by 1,000 to get 0.5 m³.",
    },
  ],
  formula: "m³ = L ÷ 1000",
};
