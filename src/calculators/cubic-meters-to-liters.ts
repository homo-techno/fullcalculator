import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const cubicMetersToLitersConverter: CalculatorDefinition = {
  slug: "cubic-meters-to-liters-converter",
  title: "Cubic Meters to Liters Converter",
  description:
    "Free cubic meters to liters converter. Instantly convert m³ to L with formula and examples. Formula: L = m³ × 1000.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: [
    "cubic meters to liters",
    "m3 to liters",
    "m³ to L",
    "convert cubic meters to liters",
    "volume conversion",
  ],
  variants: [
    {
      id: "cubic-meters-to-liters",
      name: "Cubic Meters to Liters",
      fields: [
        {
          name: "cubicMeters",
          label: "Cubic Meters (m³)",
          type: "number",
          placeholder: "e.g. 2",
        },
      ],
      calculate: (inputs) => {
        const m3 = inputs.cubicMeters as number;
        if (m3 === undefined || m3 === null) return null;
        const liters = m3 * 1000;
        const gallons = m3 * 264.172;
        const cubicFeet = m3 * 35.3147;
        return {
          primary: {
            label: `${formatNumber(m3, 4)} m³`,
            value: `${formatNumber(liters, 2)} L`,
          },
          details: [
            { label: "Liters", value: `${formatNumber(liters, 4)} L` },
            { label: "US Gallons", value: `${formatNumber(gallons, 4)} gal` },
            { label: "Cubic Feet", value: `${formatNumber(cubicFeet, 4)} ft³` },
            { label: "Milliliters", value: `${formatNumber(liters * 1000, 2)} mL` },
            { label: "Formula", value: "L = m³ × 1000" },
          ],
        };
      },
    },
  ],
  relatedSlugs: [
    "liters-to-cubic-meters-converter",
    "liters-to-gallons-converter",
    "gallons-to-liters-converter",
    "volume-converter",
  ],
  faq: [
    {
      question: "How many liters are in a cubic meter?",
      answer:
        "There are 1,000 liters in 1 cubic meter. To convert cubic meters to liters, multiply by 1,000.",
    },
    {
      question: "How many liters is 2 cubic meters?",
      answer:
        "2 cubic meters = 2,000 liters. Multiply 2 by 1,000 to get 2,000 L.",
    },
  ],
  formula: "L = m³ × 1000",
};
