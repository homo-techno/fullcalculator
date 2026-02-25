import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const metersToMilesConverter: CalculatorDefinition = {
  slug: "meters-to-miles-converter",
  title: "Meters to Miles Converter",
  description: "Free meters to miles converter. Convert meters to miles instantly with formula explanation.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["meters to miles","m to mi","meter mile converter","distance conversion"],
  variants: [
    {
      id: "convert",
      name: "Meters to Miles Converter",
      fields: [
        { name: "value", label: "Meters (m)", type: "number", placeholder: "e.g. 10" },
      ],
      calculate: (inputs) => {
        const value = inputs.value as number;
        if (value === undefined) return null;
        const miles = value / 1609.344;
        return {
          primary: { label: `${formatNumber(value)} m`, value: `${formatNumber(miles, 4)} mi` },
          details: [
            { label: "Miles", value: formatNumber(miles, 6) },
            { label: "Kilometers", value: formatNumber(value / 1000, 4) },
            { label: "Feet", value: formatNumber(value * 3.28084, 2) },
            { label: "Formula", value: "m / 1609.344 = mi" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["miles-to-meters-converter","unit-converter","length-converter"],
  faq: [
    { question: "How do you convert meters to miles?", answer: "Divide the meter value by 1609.344. For example, 5000 m = 3.1069 mi." },
  ],
  formula: "1 m = 0.000621371 mi | mi = m / 1609.344",
};
