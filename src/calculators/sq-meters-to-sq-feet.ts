import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const sqMetersToSqFeetConverter: CalculatorDefinition = {
  slug: "square-meters-to-square-feet-converter",
  title: "Square Meters to Square Feet Converter",
  description:
    "Free square meters to square feet converter. Quickly convert m² to ft² with our easy calculator. 1 m² = 10.7639 ft².",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: [
    "square meters to square feet",
    "m2 to ft2",
    "sq m to sq ft",
    "convert square meters to square feet",
    "area converter",
  ],
  variants: [
    {
      id: "sqm-to-sqft",
      name: "Square Meters to Square Feet",
      fields: [
        {
          name: "sqMeters",
          label: "Square Meters (m²)",
          type: "number",
          placeholder: "e.g. 100",
        },
      ],
      calculate: (inputs) => {
        const val = inputs.sqMeters as number;
        if (val === undefined || val === null) return null;
        const sqFeet = val * 10.7639;
        return {
          primary: {
            label: `${formatNumber(val, 4)} m²`,
            value: `${formatNumber(sqFeet, 4)} ft²`,
          },
          details: [
            { label: "Square Feet", value: formatNumber(sqFeet, 4) },
            { label: "Square Yards", value: formatNumber(sqFeet / 9, 4) },
            { label: "Acres", value: formatNumber(val / 4046.86, 6) },
            { label: "Hectares", value: formatNumber(val / 10000, 6) },
            { label: "Square Inches", value: formatNumber(sqFeet * 144, 2) },
          ],
        };
      },
    },
    {
      id: "sqft-to-sqm",
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
        const val = inputs.sqFeet as number;
        if (val === undefined || val === null) return null;
        const sqMeters = val / 10.7639;
        return {
          primary: {
            label: `${formatNumber(val, 4)} ft²`,
            value: `${formatNumber(sqMeters, 4)} m²`,
          },
          details: [
            { label: "Square Meters", value: formatNumber(sqMeters, 4) },
            { label: "Square Yards", value: formatNumber(val / 9, 4) },
            { label: "Acres", value: formatNumber(val / 43560, 6) },
            { label: "Hectares", value: formatNumber(sqMeters / 10000, 6) },
          ],
        };
      },
    },
  ],
  relatedSlugs: [
    "acres-to-square-feet-converter",
    "hectares-to-acres-converter",
    "unit-converter",
  ],
  faq: [
    {
      question: "How many square feet in a square meter?",
      answer:
        "1 square meter = 10.7639 square feet. To convert m² to ft², multiply by 10.7639.",
    },
    {
      question: "How do I convert square meters to square feet?",
      answer:
        "Multiply the number of square meters by 10.7639. For example, 100 m² = 100 × 10.7639 = 1,076.39 ft².",
    },
  ],
  formula: "ft² = m² × 10.7639",
};
