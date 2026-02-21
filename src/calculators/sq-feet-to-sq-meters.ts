import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const sqFeetToSqMetersConverter: CalculatorDefinition = {
  slug: "sq-feet-to-sq-meters-converter",
  title: "Square Feet to Square Meters Converter",
  description:
    "Free square feet to square meters converter. Instantly convert sq ft to sq m with formula and examples. Formula: m² = ft² × 0.092903.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: [
    "square feet to square meters",
    "sq ft to sq m",
    "ft2 to m2",
    "convert square feet to square meters",
    "area conversion",
  ],
  variants: [
    {
      id: "sq-feet-to-sq-meters",
      name: "Square Feet to Square Meters",
      fields: [
        {
          name: "sqFeet",
          label: "Square Feet (ft²)",
          type: "number",
          placeholder: "e.g. 1000",
        },
      ],
      calculate: (inputs) => {
        const sqFt = inputs.sqFeet as number;
        if (sqFt === undefined || sqFt === null) return null;
        const sqM = sqFt * 0.092903;
        const acres = sqFt / 43560;
        const sqYards = sqFt / 9;
        return {
          primary: {
            label: `${formatNumber(sqFt, 2)} ft²`,
            value: `${formatNumber(sqM, 4)} m²`,
          },
          details: [
            { label: "Square Meters", value: `${formatNumber(sqM, 4)} m²` },
            { label: "Square Yards", value: `${formatNumber(sqYards, 4)} yd²` },
            { label: "Acres", value: formatNumber(acres, 6) },
            { label: "Formula", value: "m² = ft² × 0.092903" },
          ],
        };
      },
    },
  ],
  relatedSlugs: [
    "sq-meters-to-sq-feet-converter",
    "acres-to-sq-feet-converter",
    "hectares-to-acres-converter",
    "area-converter",
  ],
  faq: [
    {
      question: "How do you convert square feet to square meters?",
      answer:
        "Multiply the square feet value by 0.092903. For example, 1,000 sq ft = 1,000 × 0.092903 = 92.903 m².",
    },
    {
      question: "How many square meters is 500 square feet?",
      answer:
        "500 square feet = 46.4515 square meters. Multiply 500 by 0.092903.",
    },
  ],
  formula: "m² = ft² × 0.092903",
};
