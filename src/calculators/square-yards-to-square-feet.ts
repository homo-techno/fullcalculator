import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const squareYardsToSquareFeetConverter: CalculatorDefinition = {
  slug: "square-yards-to-square-feet-converter",
  title: "Square Yards to Square Feet Converter",
  description: "Free square yards to square feet converter. Convert between sq yd and sq ft instantly. Essential for flooring, carpeting, and land measurements.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["square yards to square feet", "sq yd to sq ft", "yard to feet area", "carpet area converter", "flooring calculator"],
  variants: [
    {
      id: "convert",
      name: "Convert Square Yards to Square Feet",
      fields: [
        { name: "value", label: "Value", type: "number", placeholder: "e.g. 100" },
        { name: "direction", label: "Direction", type: "select", options: [
          { label: "Square Yards to Square Feet", value: "sqyd_to_sqft" },
          { label: "Square Feet to Square Yards", value: "sqft_to_sqyd" },
        ], defaultValue: "sqyd_to_sqft" },
      ],
      calculate: (inputs) => {
        const value = inputs.value as number;
        const direction = inputs.direction as string;
        if (value === undefined) return null;
        if (direction === "sqft_to_sqyd") {
          const sqyd = value / 9;
          return {
            primary: { label: `${formatNumber(value)} ft²`, value: `${formatNumber(sqyd, 4)} yd²` },
            details: [
              { label: "Square Yards", value: formatNumber(sqyd, 4) },
              { label: "Square Meters", value: formatNumber(value * 0.092903, 4) },
              { label: "Acres", value: formatNumber(value / 43560, 6) },
              { label: "Square Inches", value: formatNumber(value * 144, 0) },
            ],
          };
        }
        const sqft = value * 9;
        return {
          primary: { label: `${formatNumber(value)} yd²`, value: `${formatNumber(sqft, 2)} ft²` },
          details: [
            { label: "Square Feet", value: formatNumber(sqft, 2) },
            { label: "Square Meters", value: formatNumber(value * 0.836127, 4) },
            { label: "Acres", value: formatNumber(sqft / 43560, 6) },
            { label: "Square Inches", value: formatNumber(sqft * 144, 0) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["area-converter", "square-footage-calculator", "unit-converter"],
  faq: [
    { question: "How many square feet are in a square yard?", answer: "1 square yard = 9 square feet. Since 1 yard = 3 feet, 1 square yard = 3 ft × 3 ft = 9 ft². To convert sq yd to sq ft, multiply by 9." },
    { question: "Why do I need to convert square yards to square feet?", answer: "Carpet and flooring materials are often priced per square yard, while room dimensions are typically measured in feet. Converting between them helps you accurately estimate material costs." },
  ],
  formula: "1 yd² = 9 ft² | 1 ft² = 0.1111 yd² | 1 yd² = 0.836127 m²",
};
