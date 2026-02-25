import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const metersToInchesConverter: CalculatorDefinition = {
  slug: "meters-to-inches-converter",
  title: "Meters to Inches Converter",
  description: "Free meters to inches converter. Convert meters to inches instantly with formula explanation.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["meters to inches","m to in","meter inch converter","length conversion"],
  variants: [
    {
      id: "convert",
      name: "Meters to Inches Converter",
      fields: [
        { name: "value", label: "Meters (m)", type: "number", placeholder: "e.g. 10" },
      ],
      calculate: (inputs) => {
        const value = inputs.value as number;
        if (value === undefined) return null;
        const inches = value / 0.0254;
        return {
          primary: { label: `${formatNumber(value)} m`, value: `${formatNumber(inches, 4)} in` },
          details: [
            { label: "Inches", value: formatNumber(inches, 2) },
            { label: "Feet", value: formatNumber(inches / 12, 4) },
            { label: "Centimeters", value: formatNumber(value * 100, 2) },
            { label: "Formula", value: "m / 0.0254 = in" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["inches-to-meters-converter","unit-converter","length-converter"],
  faq: [
    { question: "How do you convert meters to inches?", answer: "Divide the meter value by 0.0254 (or multiply by 39.3701). For example, 2 m = 78.7402 in." },
  ],
  formula: "1 m = 39.3701 in | in = m / 0.0254",
};
