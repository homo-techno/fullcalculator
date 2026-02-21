import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const acresToSqFeetConverter: CalculatorDefinition = {
  slug: "acres-to-square-feet-converter",
  title: "Acres to Square Feet Converter",
  description:
    "Free acres to square feet converter. Quickly convert acres to ft² with our easy calculator. 1 acre = 43,560 ft².",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: [
    "acres to square feet",
    "acres to sq ft",
    "acre to ft2",
    "convert acres to square feet",
    "acre converter",
  ],
  variants: [
    {
      id: "acres-to-sqft",
      name: "Acres to Square Feet",
      fields: [
        {
          name: "acres",
          label: "Acres",
          type: "number",
          placeholder: "e.g. 1",
        },
      ],
      calculate: (inputs) => {
        const val = inputs.acres as number;
        if (val === undefined || val === null) return null;
        const sqFeet = val * 43560;
        return {
          primary: {
            label: `${formatNumber(val, 4)} acres`,
            value: `${formatNumber(sqFeet, 2)} ft²`,
          },
          details: [
            { label: "Square Feet", value: formatNumber(sqFeet, 2) },
            { label: "Square Meters", value: formatNumber(val * 4046.86, 2) },
            { label: "Square Yards", value: formatNumber(val * 4840, 2) },
            { label: "Hectares", value: formatNumber(val * 0.404686, 6) },
            { label: "Square Miles", value: formatNumber(val / 640, 6) },
          ],
        };
      },
    },
    {
      id: "sqft-to-acres",
      name: "Square Feet to Acres",
      fields: [
        {
          name: "sqFeet",
          label: "Square Feet (ft²)",
          type: "number",
          placeholder: "e.g. 43560",
        },
      ],
      calculate: (inputs) => {
        const val = inputs.sqFeet as number;
        if (val === undefined || val === null) return null;
        const acres = val / 43560;
        return {
          primary: {
            label: `${formatNumber(val, 2)} ft²`,
            value: `${formatNumber(acres, 6)} acres`,
          },
          details: [
            { label: "Acres", value: formatNumber(acres, 6) },
            { label: "Square Meters", value: formatNumber(val * 0.092903, 2) },
            { label: "Square Yards", value: formatNumber(val / 9, 2) },
            { label: "Hectares", value: formatNumber(acres * 0.404686, 6) },
          ],
        };
      },
    },
  ],
  relatedSlugs: [
    "hectares-to-acres-converter",
    "square-meters-to-square-feet-converter",
    "unit-converter",
  ],
  faq: [
    {
      question: "How many square feet in an acre?",
      answer:
        "1 acre = 43,560 square feet exactly. An acre is approximately 208.71 feet × 208.71 feet.",
    },
    {
      question: "How do I convert acres to square feet?",
      answer:
        "Multiply the number of acres by 43,560. For example, 2 acres = 2 × 43,560 = 87,120 ft².",
    },
  ],
  formula: "ft² = acres × 43,560",
};
