import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const inchesToMetersConverter: CalculatorDefinition = {
  slug: "inches-to-meters-converter",
  title: "Inches to Meters Converter",
  description: "Free inches to meters converter. Convert inches to meters instantly with formula explanation.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["inches to meters","in to m","inch meter converter","length conversion"],
  variants: [
    {
      id: "convert",
      name: "Inches to Meters Converter",
      fields: [
        { name: "value", label: "Inches (in)", type: "number", placeholder: "e.g. 10" },
      ],
      calculate: (inputs) => {
        const value = inputs.value as number;
        if (value === undefined) return null;
        const meters = value * 0.0254;
        return {
          primary: { label: `${formatNumber(value)} in`, value: `${formatNumber(meters, 4)} m` },
          details: [
            { label: "Meters", value: formatNumber(meters, 6) },
            { label: "Centimeters", value: formatNumber(value * 2.54, 4) },
            { label: "Feet", value: formatNumber(value / 12, 4) },
            { label: "Formula", value: "in x 0.0254 = m" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["meters-to-inches-converter","unit-converter","length-converter"],
  faq: [
    { question: "How do you convert inches to meters?", answer: "Multiply the inch value by 0.0254. For example, 72 in = 1.8288 m." },
  ],
  formula: "1 in = 0.0254 m | m = in x 0.0254",
};
