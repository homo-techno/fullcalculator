import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const milesToKmConverter: CalculatorDefinition = {
  slug: "miles-to-km-converter",
  title: "Miles to KM Converter",
  description:
    "Free miles to kilometers converter. Quickly convert miles to km with our easy calculator. 1 mile = 1.60934 km.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: [
    "miles to km",
    "miles to kilometers",
    "mile converter",
    "mi to km",
    "convert miles to km",
  ],
  variants: [
    {
      id: "miles-to-km",
      name: "Miles to Kilometers",
      fields: [
        {
          name: "miles",
          label: "Miles",
          type: "number",
          placeholder: "e.g. 10",
        },
      ],
      calculate: (inputs) => {
        const val = inputs.miles as number;
        if (val === undefined || val === null) return null;
        const km = val * 1.60934;
        return {
          primary: {
            label: `${formatNumber(val, 4)} miles`,
            value: `${formatNumber(km, 4)} km`,
          },
          details: [
            { label: "Kilometers", value: formatNumber(km, 4) },
            { label: "Meters", value: formatNumber(km * 1000, 2) },
            { label: "Feet", value: formatNumber(val * 5280, 2) },
            { label: "Yards", value: formatNumber(val * 1760, 2) },
          ],
        };
      },
    },
    {
      id: "km-to-miles",
      name: "Kilometers to Miles",
      fields: [
        {
          name: "km",
          label: "Kilometers",
          type: "number",
          placeholder: "e.g. 16",
        },
      ],
      calculate: (inputs) => {
        const val = inputs.km as number;
        if (val === undefined || val === null) return null;
        const miles = val / 1.60934;
        return {
          primary: {
            label: `${formatNumber(val, 4)} km`,
            value: `${formatNumber(miles, 4)} miles`,
          },
          details: [
            { label: "Miles", value: formatNumber(miles, 4) },
            { label: "Meters", value: formatNumber(val * 1000, 2) },
            { label: "Feet", value: formatNumber(miles * 5280, 2) },
            { label: "Yards", value: formatNumber(miles * 1760, 2) },
          ],
        };
      },
    },
  ],
  relatedSlugs: [
    "km-to-miles-converter",
    "feet-to-meters-converter",
    "yards-to-meters-converter",
    "unit-converter",
  ],
  faq: [
    {
      question: "How many km in a mile?",
      answer:
        "1 mile = 1.60934 kilometers. This is based on the international mile.",
    },
    {
      question: "How do I convert miles to km?",
      answer:
        "Multiply the number of miles by 1.60934. For example, 10 miles = 10 × 1.60934 = 16.0934 km.",
    },
  ],
  formula: "km = miles × 1.60934",
};
