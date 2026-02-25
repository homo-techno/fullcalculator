import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const milesToMetersConverter: CalculatorDefinition = {
  slug: "miles-to-meters-converter",
  title: "Miles to Meters Converter",
  description: "Free miles to meters converter. Convert miles to meters instantly with formula explanation.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["miles to meters","mi to m","mile meter converter","distance conversion"],
  variants: [
    {
      id: "convert",
      name: "Miles to Meters Converter",
      fields: [
        { name: "value", label: "Miles (mi)", type: "number", placeholder: "e.g. 10" },
      ],
      calculate: (inputs) => {
        const value = inputs.value as number;
        if (value === undefined) return null;
        const meters = value * 1609.344;
        return {
          primary: { label: `${formatNumber(value)} mi`, value: `${formatNumber(meters, 4)} m` },
          details: [
            { label: "Meters", value: formatNumber(meters, 2) },
            { label: "Kilometers", value: formatNumber(value * 1.60934, 4) },
            { label: "Feet", value: formatNumber(value * 5280, 0) },
            { label: "Formula", value: "mi x 1609.344 = m" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["meters-to-miles-converter","unit-converter","length-converter"],
  faq: [
    { question: "How many meters are in a mile?", answer: "There are 1609.344 meters in one mile. Multiply miles by 1609.344 to get meters." },
  ],
  formula: "1 mi = 1609.344 m | m = mi x 1609.344",
};
