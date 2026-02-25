import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const metersToYardsConverter: CalculatorDefinition = {
  slug: "meters-to-yards-converter",
  title: "Meters to Yards Converter",
  description: "Free meters to yards converter. Convert meters to yards instantly with formula explanation.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["meters to yards","m to yd","meter yard converter","length conversion"],
  variants: [
    {
      id: "convert",
      name: "Meters to Yards Converter",
      fields: [
        { name: "value", label: "Meters (m)", type: "number", placeholder: "e.g. 10" },
      ],
      calculate: (inputs) => {
        const value = inputs.value as number;
        if (value === undefined) return null;
        const yards = value * 1.09361;
        return {
          primary: { label: `${formatNumber(value)} m`, value: `${formatNumber(yards, 4)} yd` },
          details: [
            { label: "Yards", value: formatNumber(yards, 4) },
            { label: "Feet", value: formatNumber(value * 3.28084, 4) },
            { label: "Inches", value: formatNumber(value * 39.3701, 2) },
            { label: "Formula", value: "m x 1.09361 = yd" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["yards-to-meters-converter","unit-converter","length-converter"],
  faq: [
    { question: "How do you convert meters to yards?", answer: "Multiply the meter value by 1.09361. For example, 10 m = 10.9361 yd." },
  ],
  formula: "1 m = 1.09361 yd | yd = m x 1.09361",
};
